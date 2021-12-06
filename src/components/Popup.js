import React from 'react';

const Popup = (props) => {
  return (
    <div id="popup-box">
      <div className="box">
        <span id="close-icon" onClick={props.handleClose}>
          x
        </span>
        {props.content}
      </div>
    </div>
  );
};

export default Popup;
