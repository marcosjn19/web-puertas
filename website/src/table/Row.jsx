import './Row.css'
import axios from 'axios';

function Row({id, rfid, user, flag}) {   
const eliminarUsuario = async () => {
    await axios.delete(`/deleteuser/${id}`); 
    location.reload(true)
}

  return (
    <>
      <tr>
        <td>{id}</td>
        <td>{rfid}</td>
        <td>{user}</td>
        <button onClick={eliminarUsuario}>Eliminar</button>
      </tr>
    </>
  )
}

export default Row
