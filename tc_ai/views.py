from rest_framework import generics
from .models import Property, Document
from .serializers import PropertySerializer, DocumentSerializer
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile



#import serializers

class PropertyList(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class PropertyDetail(generics.RetrieveUpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer


class DocumentUploadView(APIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        uploaded_file = request.FILES.get('doc_file')
        print(request.FILES)
        
        if uploaded_file:
            # Optionally, save the file to your media root
            file_path = default_storage.save('uploads/' + uploaded_file.name, ContentFile(uploaded_file.read()))

            return Response({'message': f'File uploaded successfully at {file_path}.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': f'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        

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
