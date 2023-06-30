import json
import os

from flask import Flask, jsonify, render_template, request

static_dir = str(os.path.abspath(os.path.join(__file__, "..", "static")))

app = Flask(__name__,
            static_folder=static_dir,
            static_url_path="",
            template_folder=static_dir)

print(static_dir)

@app.route('/', methods=['GET'])
def index():
    return render_template('chatbot.html')

#controlla la question col try catch e chiama l'istruzione chatbot_answer_question(question)
#per restituire la risposta
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

    if  question == "":
        return jsonify({'error': "The provided question has no value"}), 400

    answer = chatbot_answer_question(question)
    return jsonify({'answer': answer}), 200

#restituisce la risposta alla domanda    
def chatbot_answer_question(question: str) -> str:
    data = question
    result = 'Hi ' + data + 'How can I help you?'
    return result

if __name__ == '__main__':
    app.run(port=4242, debug=True)  