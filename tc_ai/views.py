from rest_framework import generics
from .models import Property, Document
from .serializers import PropertySerializer, DocumentSerializer

class PropertyList(generics.ListCreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class PropertyDetail(generics.RetrieveUpdateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer

class DocumentUploadView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    # You would include logic in the post method to automatically determine the category

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
