import re
import pdfplumber
from openai import OpenAI

import pdfplumber


file_path_cats = './categories_questions.pdf' # Update with the actual path

client = OpenAI()

file_path_cats = './categories_questions.pdf' # Update with the actual path
import pdfplumber

def extract_categories_and_questions(doc_text):
    categories_and_questions = {}
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
    new_items = response.choices[0].message.content.strip()
    return new_items
filepath = '/Users/sahilabro/src/tcai/file/Roof_Doctors_Inspection - 2020-09-01T060254.159.pdf'
user_document_text = ''
with pdfplumber.open(filepath) as pdf:
    for page in pdf.pages:
        user_document_text += page.extract_text()


categories_and_questions = extract_categories_and_questions(user_document_text)

print(categories_and_questions)
