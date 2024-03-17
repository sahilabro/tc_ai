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
            
            # Start a new thread for date extraction and updating the property
            threading.Thread(target=extract_dates_and_update_property, args=(file_path, property_id)).start()
            
            return Response({'message': 'File upload initiated. Dates will be extracted and stored.'}, status=status.HTTP_202_ACCEPTED)
        else:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        

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
