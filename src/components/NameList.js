import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const NameList = () => {

  const [currentEmployees, setCurrentEmployees] = useState([]);

  // useEffect(() => {
    socket.on('currentEmployees', function (data) {
      const { employees } = data;

      let idArr = Object.keys(employees)
      let names = []
      idArr.forEach(element => {
        names.push(employees[element].name)
      });

      setCurrentEmployees([...currentEmployees, ...names])

    });

  // },[]);


  socket.on('coworker disconnected', function (data) {
    const { coworkerName } = data;
   currentEmployees.forEach((name, index)=> {
     let nameString = name + " left"
     console.log("cwn", coworkerName)
     if(nameString === coworkerName) {
      currentEmployees.splice(index, 1)
          console.log("nce", currentEmployees)
       setCurrentEmployees([...currentEmployees])
     }
   })
  });


  socket.on('newEmployee', function (data) {
    const { employeeName } = data;
    setCurrentEmployees([...currentEmployees, employeeName])
  });



  return (
    <div className="nameList">
       <p className="nameListTitle">Who's in the Office?</p>
      {currentEmployees.map((name, index) => {
      return (
        <p key={index}>
          {name}
        </p>
        );
      })}
    </div>
  );
};

export default NameList;
