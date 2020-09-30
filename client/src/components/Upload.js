import React, { useRef, useState, useEffect, useContext } from 'react';
import Header from './Header';
import firebase from "firebase/app";
import SignIn from './auth/SignIn';
import { withFirestore, useFirestore } from 'react-redux-firebase';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UserContext } from '../userContext';
import { MyContext } from "../context.js"
import axios from "axios"
import { Jumbotron, Navbar, Nav, Col } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import 'antd/dist/antd.css';

const theme = {
  font: 'Courier',
  primary: '#0a192f',
  secondary: '#303C55',
  light: '#ccd6f6',
  white: '#e6f1ff',
};

const Upload = (props) => {
  const firestore = useFirestore();
  const [value, setValue] = useState(UserContext);
  const fileInput = useRef();
  const primaryFile = useRef();
  const context = useContext(MyContext);
  const [user, setUser] = useState(null);
  const auth = firebase.auth();
  const [deleteBool, setDeleteBool] = useState(false);

  let fileList = {};

  const ocShowAlert = (message, background = '#3089cf') => {
    setTimeout(function () {
      alert(message)
    }, 3000);
  }

  function uploadRequest(files) {
    console.log(typeof (files))
    let data = new FormData();
    Object.values(files).forEach((f) => {
      data.append('file', f)
    })
    console.log(data)
    console.log(user)
    axios.post('http://localhost:5000/api/upload', data, {
      headers:
      {
        'userName': user.displayName,
        'timeStamp': Date.now()
      }
    })
      .then(response => { addInfoToDb(response); console.log(response) })
      .catch(error => console.log(error))
  }

  const addInfoToDb = (resp) => {
    resp["data"]['Data'].forEach((d) => {
      console.log(d)
    })
  }

  const handleFileUpload = (e) => {
    e.preventDefault();
    let mainPic = primaryFile.current.files;
    mainPic[0]['primary'] = true;
    let file = fileInput.current.files;
    file = [...file, mainPic[0]]
    console.log(mainPic)
    console.log(file)
    uploadRequest(
      file
    )
  }

  useEffect(() => {
    // callApi();
    setUser(auth.currentUser)
    if (auth.currentUser) {
      setValue(auth.currentUser);
    }
  }, [context.state.user])
  if (document.getElementById("form")) {

    document.getElementById("form").addEventListener("submit", function (event) {
      event.preventDefault()
    });
  }

  return (
    <React.Fragment>


      {user ? <div>


        <form onSubmit={handleFileUpload}>
          <div>
            <label>Select you primary image:</label>
            <input type="file" name="main-pic" ref={primaryFile} text="Upload file" />
            <br></br>
            <label>Select the rest of your images:</label>
            <input type="file" multiple name="profile_pic" ref={fileInput} />
          </div>
          <div>
            <input type="submit" name="btn_upload_profile_pic" value="Upload" />
          </div>
        </form>


      </div> :
        ""
      }
      { console.log("screech")}
    </React.Fragment >
  );
}

export default withFirestore(Upload);