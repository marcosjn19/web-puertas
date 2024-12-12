from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import data
import uuid
from datetime import datetime


app = Flask( __name__ , static_folder='../website/dist/static',template_folder = '../website/dist')
cors = CORS( app, origins = '*' )
app.config["SQLALCHEMY_DATABASE_URI"] = data.URL.replace("mysql://", "mysql+mysqlconnector://")
db = SQLAlchemy(app)

class Usuarios ( db.Model ):
    id     = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rfid   = db.Column(db.String(10), nullable=False)
    user = db.Column(db.String(50), nullable=False)

class Registros ( db.Model ):
    id_lectura = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rfid = db.Column(db.String(10), nullable=False)
    fecha_hora = db.Column(db.DateTime, default=datetime.utcnow)

@app.route ( "/")

def index(id = 0):
    return render_template("index.html")

@app.route ( "/clients", methods = ['GET'] ) 
def clients():
    users = db.session.execute(db.select(Usuarios).order_by(Usuarios.user)).scalars()
    users_list = [
        {"id": user.id, "rfid": user.rfid, "user": user.user}
        for user in users
    ]
    return jsonify({"clientes": users_list})

@app.route ( "/registros", methods = ['GET'] ) 
def registros():
    registros = db.session.execute(db.select(Registros).order_by(Registros.fecha_hora)).scalars()
    registros_list = [
        {"id": registro.id_lectura, "rfid": registro.rfid, "time": registro.fecha_hora}
        for registro in registros
    ]
    return jsonify({"registros": registros_list})

@app.route('/newuser', methods=['POST'])
def new_user():
    rfid = request.json.get('rfid')
    usuario = request.json.get('usuario')  
    print(f"RFID: {rfid}, Usuario: {usuario}")
    nuevo_usuario = Usuarios(rfid=rfid, user=usuario)
    db.session.add(nuevo_usuario)
    db.session.commit()
    return render_template("index.html")

@app.route('/deleteuser/<int:id>', methods=['DELETE'])
def delete_user(id):
    usuario = Usuarios.query.get(id)
    db.session.delete(usuario)
    db.session.commit()
    return render_template("index.html")

if __name__ == "__main__":
    app.run( debug = True, port = 5555 )