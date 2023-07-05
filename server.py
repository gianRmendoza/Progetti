import json
import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

static_dir = str(os.path.abspath(os.path.join(__file__, "..", "static")))

app = Flask(__name__,
            static_folder=static_dir,
            static_url_path="",
            template_folder=static_dir)
CORS(app)

print(static_dir)

#dopo aver digitato il sito http mostra html, cioè l'interfaccia(frontend)
@app.route('/', methods=['GET'])
def index():
    return render_template('chatbot.html')

#controlla la question col try catch e chiama l'istruzione query(question) per
#restituire la risposta
@app.route('/answer-question', methods=['POST'])
def answer_question():
    try:
        req_data = json.loads(request.data)
    except:
        return jsonify({'error': "The provided input is not a JSON"}), 400

    if "question" not in req_data.keys():
        return jsonify({'error': "No question provided"}), 400

    question = req_data["question"]

    if type(question) is not str:
        return jsonify({'error': "The provided question is not a String"}), 400
        
    answer = query(question)
    return jsonify({'answer': answer}), 200

#restituisce la risposta della domanda
def chatbot_answer_question(question: str) -> str:
    li = list(question.split(" "))
    if len(li) == 1:
        return "Hi " + question + "How can I help you?"
    else:
        return "Hey!"

#crea un collegamento per passare la password dell'API
API_PASS = os.getenv("API_PASS")

API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
headers = {'Authorization': f'Bearer {API_PASS}', "Content-Type": "application/json"}

#il bot restituisce la risposta della domanda
def query(question):
    data = json.dumps({"inputs": question})
    response = requests.request("POST", API_URL, headers=headers, data=data)
    decoded_response = json.loads(response.content.decode("utf-8"))
    
    try:
        answer = decoded_response[0]['generated_text']
        answer = answer.split(question)[-1]
    except (Exception, ):
        answer = "I do not know." 
    answer = answer.split(question)

    return answer



if __name__ == '__main__':
    app.run(port=4242, debug=True)  