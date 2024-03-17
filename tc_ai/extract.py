from openai import OpenAI
from django.shortcuts import get_object_or_404
from .models import Property
import json

client = OpenAI()

def extract_dates_with_gpt(document_text):

    prompt = f"Extract the following dates from the document: Contract Acceptance Date, COE/Settlement Date, Earnest Money Deposit Due Date, Disclosures Due Date, Inspection Due Date, Appraisal Due Date, Loan Contingency Date. Here's the document content:\n{document_text}. Return JSON format, with all of the provided dates as keys. Please use null for any dates that haven't been extracted.   "

    response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                            {"role": "user", "content": prompt},
                        ]
                )
    
    return response.choices[0].message.content.strip()


def actions_and_compliance(document_text, category_text, knowledge_text, property_id):
    prompt = f'You are an paralegal assistant, helping real-estate agents with property transactions who will return a JSON after analysing the following - you need to extract action items, recommendations etc in the following format: \
    {{ "category": <document-type>, \
      "action-items": [""], \
      "warnings":[""], \
      "recommendations": [""], \
      "legal_document": "Property Survey/Title Deed.pdf" , #if possible, otherwise skip \
    }} \
    The text you are analysing is {document_text}. \
    Here is a relevant piece of information from the state of california: {knowledge_text} \
    We need the following questions answered: {category_text}; you can also determine the document-name from there. \
        Please do not return anything but the JSON. Not even backticks.\
'

    response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                            {"role": "user", "content": prompt},
                        ]
                )

    property = get_object_or_404(Property, pk=property_id)
    if property.results_json:
        existing_data = json.loads(property.results_json)
    else:
        existing_data = {}

    new_items = response.choices[0].message.content.strip()

    new_items = json.loads(new_items)
    # Check if the category already exists
    category = new_items["category"]
    if category in existing_data:
        # Category exists, append new items to each sub-list
        existing_data[category]["action-items"].extend(new_items["action-items"])
        existing_data[category]["recommendations"].extend(new_items["recommendations"])
        existing_data[category]["warnings"].extend(new_items["warnings"])
        # Assuming you want to update the legal_document if a new one is provided
        if new_items["legal_document"]:
            existing_data[category]["legal_document"] = new_items["legal_document"]
    else:
        # Category does not exist, add the new category with its details
        existing_data[category] = new_items

    # Convert the updated Python object back into a JSON string
    property.results_json = json.dumps(existing_data)
    property.save()

    return existing_data




def extract_categories_and_questions(doc_text):
    import pdfplumber
    file_path_cats = './categories_questions.pdf' # Update with the actual path
    reference_document_text = ''
    # Open the PDF file
    with pdfplumber.open(file_path_cats) as pdf:
        for page in pdf.pages:
            reference_document_text += page.extract_text()

    prompt = f"""
            Given the reference document below, categorize the user document and extract relevant questions related to its category.

            Reference Document:
            {reference_document_text}

            User Document:
            {doc_text}

            Based on the reference document, return a JSON in the format {{'category' : 'X', 'questions' : <str: category and questions>}}
            Please do not return anything other than JSON, not even backticks. 
            """
    
    response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                            {"role": "user", "content": prompt},
                        ]
                )
    categories_and_questions = response.choices[0].message.content.strip()
    return categories_and_questions
