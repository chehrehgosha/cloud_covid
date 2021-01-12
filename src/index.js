import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";


firebase.initializeApp({
  apiKey: "AIzaSyCOPPSemIVRnBuNoSP96OEHKN0po5krbaI",
  authDomain: "cloudcovid-d70ec.firebaseapp.com",
  projectId: "cloudcovid-d70ec",
  storageBucket: "cloudcovid-d70ec.appspot.com",
  messagingSenderId: "899591900709",
  appId: "1:899591900709:web:7b324fcf3742466fc3f9cc",
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
