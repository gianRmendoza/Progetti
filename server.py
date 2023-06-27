import json

from flask import Flask, jsonify, request


app = Flask(__name__,
            static_folder='',
            static_url_path="",
            template_folder='')


@app.route('/my-get-route', methods=['GET'])
def create_payment():
    return jsonify({'message': 'hello world'}), 200


@app.route('/my-post-route', methods=['POST'])
def webhook_received():
    req_data = json.loads(request.data)
    return jsonify({'received-data': req_data}), 200


if __name__ == '__main__':
    app.run(port=4242, debug=True)  