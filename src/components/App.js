import React from 'react';
import Navbar from './Navbar';
import RouteContent from './Routes';
import { BrowserRouter } from 'react-router-dom';
export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
          <Navbar />
          <RouteContent />
      </BrowserRouter>
    );
  }
}
