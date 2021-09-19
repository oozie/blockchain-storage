import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

ReactDOM.render(
  <Web3ReactProvider getLibrary={(provider) => new Web3(provider)} >
    <App />
  </Web3ReactProvider>,
  document.getElementById('root')
);
