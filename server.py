import json
import os
import requests
import pymongo

from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime

load_dotenv()

connessione = MongoClient()
db = connessione.chatbotDB

static_dir = str(os.path.abspath(os.path.join(__file__, "..", "static")))

app = Flask(__name__,
            static_folder=static_dir,
            static_url_path="",
            template_folder=static_dir)
CORS(app)

print(static_dir)

#dopo aver digitato l'http... mostra l'html, cioè l'interfaccia(frontend)
@app.route('/', methods=['GET'])
def index():
    return render_template('login.html')

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
        
    iso_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    
    answer = query(question)

    collection = db.questions
    Question = list(question.split("/n"))

    for x in db.users.find():
        userId = x['_id']
    
    theQuestion ={"userId":userId,"the question":Question, "date":iso_date}
    rec_id = collection.insert_one(theQuestion)
    print(rec_id)
    cursor = collection.find()
    for record in cursor:
        print(record)

    return jsonify({'answer': answer}), 200

@app.route('/saved-chat', methods=['GET'])
def load_chat():
    lista = []
    answers_list = []
    lista2 = []
    questions_list = []

    for x in db.users.find():
        userId = x['_id']
    #prende le risposte
    for row in db.answers.find({'userId':userId}):
        lista.append({'message':row['the answer'], 'date':row['date'], 'type':'answer'})
    print(lista)
    for i in range(len(lista)):
        answers_list.append(lista[i])
        print(answers_list)

    #prende le domande
    for row in db.questions.find({'userId':userId}):
        lista2.append({'message':row['the question'], 'date':row['date'],'type':'question'})

    for i in range(len(lista2)):
        questions_list.append(lista2[i])
        print(questions_list)

    return jsonify({'answers_list': answers_list, 'questions_list': questions_list }), 200

@app.route('/user-login', methods=['GET','POST'])
def user_login():
    if request.method == 'POST':
        try:
            req_data = json.loads(request.data)
        except:
            return jsonify({'error': "The provided input is not a JSON"}), 400

        user = req_data["user"]
        password = req_data["password"]
        _id = req_data["id"]
        theUser = {"_id":_id,"nome utente":user, "password":password}

        collection = db.users
    
        if user != "" and password != "":
            if len(password)>=3:
                existingUser = collection.find_one({"nome utente": user})
                if existingUser:
                    passExists = collection.find_one({"password":password})
                    if passExists:
                        return jsonify({'user': user}), 200
                    else:
                        return render_template('login.html')
                else:
                    rec_id = collection.insert_one(theUser)
                    print(rec_id)
                    cursor = collection.find()
                    for record in cursor:
                        print(record)
            else:
                return render_template('login.html')
    
    return jsonify({'theUser': theUser}), 200

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

    collection = db.answers

    for x in db.users.find():
        userId = x['_id']
    
    theAnswer ={"userId":userId,"the answer":answer, "date":datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")}
    
    rec_id = collection.insert_one(theAnswer)
    print(rec_id)
    cursor = collection.find()
    for record in cursor:
        print(record)
    
    return answer


if __name__ == '__main__':
    app.run(port=4242, debug=True)  