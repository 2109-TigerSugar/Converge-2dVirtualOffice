import React, { useEffect, useState } from 'react';

import { socket } from '../socket';


const NameDisplay = () => {
  console.log(socket);


  const [name, setNames] = useState([]);
  const [isActive, setActive] = useState(true);


  useEffect(() => {

    socket.on("newEmployee", function(arg) {
      const { employeeInfo } = arg
      setNames([...name, employeeInfo.name + " joined the room"])
      console.log('new', employeeInfo)

    })

    // socket.on("coworkerLeftRoom", function(arg) {
    //   const
    // })


  }, );


  useEffect(() => {
    const timer = setTimeout(() => {
       setActive(false)
    }, 10000);
    return () => clearTimeout(timer);
 }, []);

  return(
    <div>
    <div className={isActive ? "nameJoined" : "noNameJoined"}>
    <p>{name}</p>
    </div>
    </div>

  )
}

export default NameDisplay;
