# Progetti


### How to develop the Python Flask Server

- access the project main folder via terminal

```shell
cd /path/to/main/project/folder
```

- create virtual environment

```shell
python -m venv env
```

- activate virtual environment

```shell
source env/bin/activate
```

- install dependencies (needed libraries)

```shell
pip install -r requirements.txt
```

### How to run the Backend server

- set the `FLASK_APP` variable with path to the server main file

```shell
export FLASK_APP=be/server.py
```

- run the server

```shell
python3 -m flask run --port=4242
```