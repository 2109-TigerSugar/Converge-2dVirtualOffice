import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const NameList = ({ roomKey }) => {
  const [currentEmployees, setCurrentEmployees] = useState([]);

  const currEmployees = ({ employees }) => {
    let idArr = Object.keys(employees);
    let names = [];
    idArr.forEach(element => {
      names.push(employees[element].name);
    });
    setCurrentEmployees([...currentEmployees, ...names]);
  };

  const coworkerDisconnected = ({ coworkerName }) => {
    currentEmployees.forEach((name, index) => {
      let nameString = name + ' left';
      if (nameString === coworkerName) {
        currentEmployees.splice(index, 1);
        setCurrentEmployees([...currentEmployees]);
      }
    });
  };

  const newEmployee = (data) => {
    setCurrentEmployees([...currentEmployees, data.employeeName]);
  };

  // useEffect(() => {
    socket.on('currentEmployees', currEmployees);
    socket.on('coworker disconnected', coworkerDisconnected);
    socket.on('newEmployee', newEmployee);

    // return () => {
    //   socket.off('currentEmployees', currEmployees);
    //   socket.off('coworker disconnected', coworkerDisconnected);
    //   socket.off('newEmployee', newEmployee);
    // };
  // }, []);

  return (
    <div className="nameList">
      <p className="nameListTitle">Office: {roomKey}</p>
      {currentEmployees.map((name, index) => {
        return <p key={index}>{name}</p>;
      })}
    </div>
  );
};

export default NameList;
