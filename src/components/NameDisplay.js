import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const NameDisplay = () => {
  const [names, setNames] = useState([]);

  // componentDidMount
  const updateNames = data => {
    const { coworkerName } = data;
    setNames([...names, coworkerName]);
  };

  useEffect(() => {
    socket.on('newEmployee', updateNames);

    socket.on('coworker disconnected', updateNames);

    return () => {
      socket.off('newEmployee', updateNames);
      socket.off('coworker disconnected', updateNames);
    };
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
    <React.Fragment>
      {names.map((name, index) => {
        return (
          <div className="nameJoined" key={index}>
            {name}
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default NameDisplay;
