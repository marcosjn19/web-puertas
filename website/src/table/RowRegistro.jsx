import './Row.css'
import axios from 'axios';


function RowRegistro({id_lectura, rfid, fecha_hora, aprobado}) {   
  return (
    <>
      <tr>
        <td>{id_lectura}</td>
        <td>{rfid}</td>
        <td>{fecha_hora}</td>
        <td className={aprobado}></td>
      </tr>
    </>
  )
}

export default RowRegistro
