from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Configuração do banco de dados MySQL
db_user = os.getenv("MYSQL_USER", "appuser")
db_pass = os.getenv("MYSQL_PASSWORD", "apppass")
db_host = os.getenv("MYSQL_HOST", "mysql")  # nome do serviço no docker-compose
db_name = os.getenv("MYSQL_DATABASE", "appdb")

app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{db_user}:{db_pass}@{db_host}/{db_name}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Modelo de exemplo
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

@app.route("/")
def hello():
    return jsonify({"message": "Flask está rodando com Docker!"})

@app.route("/users")
def get_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "name": u.name} for u in users])

if __name__ == "__main__":
    # Cria as tabelas no banco, caso não existam
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)