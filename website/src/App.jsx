import './App.css'
import Row from './table/Row'
import RowRegistro from './table/RowRegistro'
import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [array, setArray] = useState([])
  const [arrayRegistros, setRegistros] = useState([])
    const [formData, setFormData] = useState({
      rfid: "",
      usuario: "",
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
    setRegistros(registros.data.registros)
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  return (
    <>
    <div className='main-container'>
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

      
      <h2>Registros</h2>
      <div className='table-container'>
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>RFID</th>
            <th>FECHA Y HORA</th>
          </tr>
        </thead>
        <tbody>
      {
        arrayRegistros.map(({ id, rfid, time }) => (
          <RowRegistro
            id_lectura={id}
            rfid={rfid}
            fecha_hora={time}
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