from openai import OpenAI
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