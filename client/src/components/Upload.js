

import React, { useRef, useState, useEffect, useContext } from 'react';
import Header from './Header';

import firebase from "firebase/app";
import SignIn from './auth/SignIn';
import { withFirestore, useFirestore } from 'react-redux-firebase';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UserContext } from '../userContext';
import { MyContext } from "../context.js"

import { Jumbotron, Navbar, Nav, Col } from 'react-bootstrap';

import "bootstrap/dist/css/bootstrap.min.css";
import 'antd/dist/antd.css';

import AWS from 'aws-sdk';

import S3 from 'react-aws-s3';



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

  const context = useContext(MyContext);
  const [user, setUser] = useState(null);
  const auth = firebase.auth();






  const [deleteBool, setDeleteBool] = useState(false);

  let fileList = {};

  // function getSignedRequest(file) {
  //   return fetch(`${serverUrl}/sign-s3?fileName=${file.name}&fileType=${file.type}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`${response.status}: ${response.statusText}`);
  //       }
  //       return response.json();
  //     });
  // }

  // callApi = async () => {
  //   const response = await fetch('/api/hello');
  //   const body = await response.json();
  //   if (response.status !== 200) throw Error(body.message);

  //   return body;
  // };


  const callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.text();
    if (response.status !== 200) throw Error(body.message);

    console.log(body)

    return body;
  };

  async function uploadFiles(e) {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: fileInput.current.files[0].name }),
    });
    const body = await response.text();

    console.log(body)
  };


  //   e.preventDefault();

  //   console.log(process.env.REACT_APP_AWS_BUCKET_NAME)
  //   console.log(process.env.REACT_APP_AWS_REGION)
  //   console.log(process.env.REACT_APP_AWS_ACCESS_KEY_ID)
  //   console.log(process.env.REACT_APP_AWS_SECRET_ACCESS_KEY)

  //   const config = {
  //     bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
  //     region: process.env.REACT_APP_AWS_REGION,
  //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  //   }


  //   const ReactS3Client = new S3(config);

  //   console.log(ReactS3Client)

  //   let file = fileInput.current.files[0]
  //   let fileName = fileInput.current.files[0].name
  //   ReactS3Client
  //     .uploadFile(file, fileName)
  //     .then(data => console.log(data))
  //     .catch(err => console.error(err))

  //   /**
  //    * {
  //    *   Response: {
  //    *     bucket: "myBucket",
  //    *     key: "image/test-image.jpg",
  //    *     location: "https://myBucket.s3.amazonaws.com/media/test-file.jpg"
  //    *   }
  //    * }
  //    */
  // };



  const addToList = (e) => {
    e.preventDefault();
    fileList = e.target.files
    console.log(fileList)
  }

  useEffect(() => {
    callApi();
    console.log(context.state.user)
    setUser(auth.currentUser)
    if (auth.currentUser) {
      setValue(auth.currentUser);
    }

  }, [context.state.user])

  return (
    <React.Fragment>


      {user ? <div>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <div><h2>Upload images</h2></div>
          <h3>Images</h3>
          <input type="file" multiple />
          <label>Amazon<input name="amazon" type="checkbox" value="amazon" /></label>
          <label>Shopify<input name="shopify" type="checkbox" value="shopify" /></label>

          <button type="submit" >Submit</button>
        </form>


      </div> :
        ""
      }
      { console.log("screech")}
    </React.Fragment >
  );
}

export default withFirestore(Upload);