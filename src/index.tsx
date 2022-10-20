import React from 'react';
import ReactDOM from 'react-dom';
import Popup from '@/popup'; //popup component
import "@/scss/index.scss";  //loading style

//us-proxy Page
ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);