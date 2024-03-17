from rest_framework import generics
from .models import Property, Document
from .serializers import PropertySerializer, DocumentSerializer
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from tc_ai.extract import extract_dates_with_gpt as get_dates
import json

# Liam Imports
import os
import openai
from supabase.client import Client, create_client
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import SupabaseVectorStore
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())
from tc_ai.extract import actions_and_compliance

# get secrets
openai.api_key = os.environ['OPENAI_API_KEY']
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']

# set up supabase client
supabase: Client = create_client(supabase_url, supabase_key)

#import serializers

class PropertyList(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class PropertyDetail(generics.RetrieveUpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


import threading
from django.shortcuts import get_object_or_404
from .models import Property
from .extract import extract_dates_with_gpt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

def extract_dates_and_update_property(file_path, property_id):
    # Assuming PyPDFLoader or similar to read the document text
    from langchain_community.document_loaders import PyPDFLoader
    loader = PyPDFLoader(file_path)
    text = loader.load()
    
    # Use the existing extract_dates_with_gpt function
    new_extracted_dates_json = extract_dates_with_gpt(text)
    print(new_extracted_dates_json)
    # Get the property
    property = get_object_or_404(Property, pk=property_id)
    
    # Merge the new dates with the existing ones
    if property.extracted_dates:
        # Assuming both property.extracted_dates and new_extracted_dates_json are dictionaries
        for key, value in new_extracted_dates_json.items():
            if key in property.extracted_dates:
                # Update only if the new date is different and not empty
                for date_type, date_value in value.items():
                    if date_value and (date_type not in property.extracted_dates[key] or property.extracted_dates[key][date_type] != date_value):
                        property.extracted_dates[key][date_type] = date_value
            else:
                # Add the new date category if it doesn't exist
                property.extracted_dates[key] = value
    else:
        property.extracted_dates = json.dumps(new_extracted_dates_json)
    property.save()

class DocumentUploadView(APIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('doc_file')
        print(request.FILES)
        
        if uploaded_file:
            # Save the uploaded file
            file_path = default_storage.save('uploads/' + uploaded_file.name, ContentFile(uploaded_file.read()))
            
            # Get property_id from the request
            property_id = self.kwargs.get('property_id')  # Ensure you send property_id in your request
            
            # Get similar documents using rag
            doc_text, match_text = self.get_matched_docs_from_pdfs("documents", 10, file_path)

            category_text = ''
            actions_and_compliance(doc_text, category_text, match_text, property_id)

            return Response({'message': 'File upload initiated. Dates will be extracted and stored.'}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
    def get_matched_docs_from_pdfs(self, table, num_docs, file_path):
        """
        Retrieves documents from the specified table that match the uploaded files,
        performing a similarity search for each file individually.
        """

        # setup
        embeddings = OpenAIEmbeddings()
        vector_store = SupabaseVectorStore(
            client=supabase,
            embedding=embeddings,
            table_name=table,
            query_name="match_documents",
        )

        # Get vectors embeddings of all docs in the uploads directory
        directory = "uploads/"

        print(f'processing {file_path}')
        # load pages from file
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # get all text from documents
        doc_text = ''
        for doc in documents:
            doc_text+=doc.page_content

        matched_docs = vector_store.similarity_search(doc_text, k=num_docs)

        # join all matched docs into a string
        match_text = ''
        for doc in matched_docs:
            match_text+=doc.page_content

        return doc_text, match_text

class DocumentListCategoryView(generics.ListAPIView):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned documents to a given property and category,
        by filtering against a `category` query parameter in the URL.
        """
        queryset = Document.objects.all()
        property_id = self.kwargs['property_id']
        category_name = self.kwargs['category']
        if property_id and category_name:
            queryset = queryset.filter(property_id=property_id, category__name=category_name)
        return queryset

class DocumentDetailView(generics.RetrieveAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
