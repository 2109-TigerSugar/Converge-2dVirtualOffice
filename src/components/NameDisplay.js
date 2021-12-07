import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const NameDisplay = () => {

  const [names, setNames] = useState([]);

  // componentDidMount
  useEffect(() => {
    socket.on('newEmployee', function (data) {
      const { coworkerName } = data;
      setNames([...names, coworkerName + ' joined']);
    });

    socket.on('coworker disconnected', function (data) {
      const { coworkerName } = data;
      setNames([...names, coworkerName + ' left']);
    });


  }, []);

  // Timer to remove message
  useEffect(() => {
    const timer = setTimeout(() => {
      if(names.length != 0) {
        setNames(names.slice(1))
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [names.length])

  return (
    <div>
      {names.map((name, index) => {
        return (
          <div className="nameJoined" key={index}>
            {name}
          </div>
        );
      })}
    </div>
  );
};

export default NameDisplay;
