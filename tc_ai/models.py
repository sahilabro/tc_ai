from django.db import models
from django.db.models import JSONField

class Property(models.Model):
    title = models.CharField(max_length=255)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)
    extracted_dates = JSONField(null=True, blank=True)
    # Add more fields as necessary

    def __str__(self):
        return self.title

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Document(models.Model):
    property = models.ForeignKey(Property, related_name='documents', on_delete=models.CASCADE)
    category = models.ForeignKey(Category, related_name='documents', on_delete=models.SET_NULL, null=True, blank=True)
    doc_file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    document_date = models.DateTimeField(blank=True, null=True)
    supapase_link = models.URLField()
    def __str__(self):
        return f"{self.property.title} - {self.category.name if self.category else 'Uncategorized'}"
