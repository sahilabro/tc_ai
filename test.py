import os
import openai
from supabase.client import Client, create_client
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import SupabaseVectorStore
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# ignore warnings for now
import warnings
warnings.filterwarnings("ignore")

# get secrets
openai.api_key = os.environ['OPENAI_API_KEY']
supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']

# set up supabase client
supabase: Client = create_client(supabase_url, supabase_key)

# Process and upload a PDF to the specified table
def process_and_upload_pdf(table, file_path):
    print(f"Processing {file_path}")

    # Load and process the document
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)

    # Embed and store the document vectors
    embeddings = OpenAIEmbeddings()
    vector_store = SupabaseVectorStore.from_documents(docs, embeddings, client=supabase, table_name=table, query_name="match_documents")

# Process and upload all PDFs in the specified directory
def process_directory(table, directory_path):
    """
    Iterates over each file in the specified directory and processes them.
    """
    for file_name in os.listdir(directory_path):
        file_path = os.path.join(directory_path, file_name)
        if os.path.isfile(file_path):
            process_and_upload_pdf(table, file_path)

# New function to get matched documents
def get_matched_docs(table, user_query, num_docs):
    """
    Retrieves documents from the specified table that match the user query.
    """
    embeddings = OpenAIEmbeddings()
    vector_store = SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name=table,
        query_name="match_documents",
    )
    matched_docs = vector_store.similarity_search(user_query, k=num_docs)
    return matched_docs

# query table using user input & gpt
def query_table(table, num_docs):
    """
    Queries the specified table based on user input, processes the query, and prints the AI's response.
    """
    user_query = input("Enter your query: ")

    # Get matched documents
    matched_docs = get_matched_docs(table, user_query, num_docs)
    print(f"Matched {len(matched_docs)} documents.")

    injected_docs = "\n\n".join([doc.page_content for doc in matched_docs])

    # Prepare and send the query to the model
    print("Sending query to model...")
    completion_messages = [
        {
            "role": "system",
            "content": "You are an AI assistant with unparalleled expertise in real estate," +
                       "possessing a profound understanding of the intricacies of real estate." +
                       "Your primary task is to provide answers about real estate topics using " + 
                       "the documents provided below. You can comprehend and interpret information " +
                       "from any language. If a query is not addressed by these documents, you will " +
                       "utilize your extensive knowledge in real estate to provide accurate answers. " +
                       "Keep your responses concise and focused on the topics of real estate."
        },
        {
            "role": "user",
            "content": user_query,
        },
        {
            "role": "assistant",
            "content": injected_docs,
        },
    ]

    # get response
    response = openai.chat.completions.create(
        model="gpt-4-0125-preview",
        messages=completion_messages,  
    )
    print("Assistant's Response:")
    print(response.choices[0].message.content)

def main():
    
    knowledge_dir = "./data/test"
    table = "documents"

    # process_directory(table, knowledge_dir)

    query_table(table, num_docs=10)

if __name__ == "__main__":
    main()