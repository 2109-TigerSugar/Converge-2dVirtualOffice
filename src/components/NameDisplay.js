import React, { useEffect, useState } from 'react';
import { socket } from '../socket';


const NameDisplay = () => {
  console.log(socket);


  const [names, setNames] = useState([]);


  useEffect(() => {

    socket.on("newEmployee", function(data) {
      const { coworkerName } = data
      setNames([...names, coworkerName + " joined"])

    })

    socket.on("coworker disconnected", function(data) {
      const { coworkerName } = data
      setNames([...names, coworkerName + " left"])
    })

    const timer = setTimeout(() => {
             setNames(names.slice(1))
          }, 5000);
          return () => clearTimeout(timer);
  },);



  return(
    <div>
       {names.map((name, index) => {
         return <div className= 'nameJoined' key={index}>{name}</div>
       })}
    </div>

  )
}

export default NameDisplay;
