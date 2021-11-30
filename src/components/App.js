import React from 'react';
import Navbar from './Navbar';
import Routes from './Routes';
export default class App extends React.Component {
  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Navbar />
        <Routes />
      </div>
    );
  }
}
