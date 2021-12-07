import React, { useEffect, useState } from 'react';

import { socket } from '../socket';

// const initialState = [{
//   employeeid: null,
//   name:''
// }]

const NameDisplay = () => {
  console.log(socket);


  const [names, setNames] = useState([]);
  const [isActive, setActive] = useState(true);

  // const clearState = () => {
  //   setNames([...initialState])
  //    }

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
      <div className={isActive ? "nameJoined" : "noNameJoined"}>
       {names.map((name, index) => {
         return <div key={index}>{name}</div>
       })}
      </div>
    </div>

  )
}

export default NameDisplay;
