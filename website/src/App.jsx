import './App.css'
import Row from './table/Row'
import RowRegistro from './table/RowRegistro'
import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import useSocket from './useSocket';
function App() {
  const [array, setArray] = useState([])
  const [arrayRegistros, setRegistros] = useState([])
    const [formData, setFormData] = useState({
      rfid: "",
      usuario: "",
    });

    useSocket(() => {
      window.location.reload();
    });
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    
  const newUser = async ( e ) => {
    e.preventDefault();
    try {
      console.log(formData)
      const response = await axios.post("/newuser", formData);
      console.log("Response:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const fetchAPI = async () => {
    const response = await axios.get("/clients")
    console.log(response)
    console.log(response.data)
    setArray(response.data.clientes)

    const registros = await axios.get("/registros")
    console.log(registros.data.registros)
    setRegistros(registros.data.registros)
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
    <div className='main-container'>
      <h1>Control de puerta 🚪</h1>
      <h2>Equipo:</h2>
      <ul>
        <li>21130847 Sergio A. Lopez Delgado</li>
        <li>21130848 Manuel Mijares Lara</li>
        <li>21130852 Marcos E. Juárez Navarro</li>
        <li>21130856 Alejandro Cabrera Mendez</li>
        <li>21130869 Juan Fernando Vaquera Sanchez</li>
        <li>21130874 Leopoldo Zavala Gonzalez</li>
        <li>21130882 Miriam A. Sánchez Cervantes</li>
        <li>21130893 Diego Muñoz Rede</li>
        <li>21130923 Gael Costilla Garcia</li>
      </ul>

      <h2>Usuarios</h2>
      <div className='table-container'>
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>RFID</th>
            <th>USUARIO</th>
            <th>ACCCIONES</th>
          </tr>
        </thead>
        <tbody>
      {
        array.map(({ id, rfid, user }) => (
          <Row
            id={id}
            rfid={rfid}
            user={user}
          >
          </Row>
        ))
      }
        </tbody>
      </table>

      </div>

      <h2>Nuevo usuario</h2>
      <div className='form-container'>
        <form className='formulario' onSubmit={newUser}>
        <label for="rfid">RFID</label>
        <input type="text" id="rfid" name="rfid" placeholder="RFID" onChange={handleChange} required></input>
        
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" name="usuario" placeholder="USUARIO" onChange={handleChange} required></input>
        
        <button type="submit" onClick={newUser}>Añadir</button>
        </form>
      </div>

      <h2>Log</h2>
      <div className='table-container'>
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>RFID</th>
            <th>FECHA Y HORA</th>
            <th>PERMISO</th>
          </tr>
        </thead>
        <tbody>
      {
        arrayRegistros.map(({ id, rfid, time, aprobado}) => (
          <RowRegistro
            id_lectura={id}
            rfid={rfid}
            fecha_hora={time}
            aprobado={aprobado}
          >
          </RowRegistro>
        ))
      }
        </tbody>
      </table>

      </div>

    </div>
    </>
  )
}


export default App