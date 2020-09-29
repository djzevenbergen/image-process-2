

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

  const context = useContext(MyContext);
  const [user, setUser] = useState(null);
  const auth = firebase.auth();



  // async function fileUpload(e) {
  //   console.log(e)
  //   e.preventDefault();
  //   console.log(e)
  //   console.log(fileInput.current.files)
  //   if (fileInput.current.files.length > 1) {
  //     console.log("multiple file upload")
  //     multipleFileUploadHandler();

  //   } else {
  //     console.log("single file upload")
  //     singleFileUploadHandler();

  //   }

  // }


  const [deleteBool, setDeleteBool] = useState(false);

  let fileList = {};

  // const singleFileUploadHandler = () => {
  //   const data = new FormData();// If file selected
  //   if (fileInput.current.files[0]) {
  //     data.append('profileImage', fileInput.current.files[0], fileInput.current.files[0].name);
  //     axios.post('http://localhost:5000/api/upload', data, {
  //       headers: {
  //         'accept': 'application/json',
  //         'Accept-Language': 'en-US,en;q=0.8',
  //         'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
  //       }
  //     })
  //       .then((response) => {
  //         if (200 === response.status) {
  //           // If file size is larger than expected.
  //           if (response.data.error) {
  //             if ('LIMIT_FILE_SIZE' === response.data.error.code) {
  //               ocShowAlert('Max size: 2MB', 'red');
  //             } else {
  //               console.log(response.data);// If not the given file type
  //               ocShowAlert(response.data.error, 'red');
  //             }
  //           } else {
  //             // Success
  //             let fileName = response.data;
  //             console.log('fileName', fileName);
  //             ocShowAlert('File Uploaded', '#3089cf');
  //           }
  //         }
  //       }).catch((error) => {
  //         // If another error
  //         ocShowAlert(error, 'red');
  //       });
  //   } else {
  //     // if file not selected throw error
  //     ocShowAlert('Please upload file', 'red');
  //   }
  // };
  // const multipleFileUploadHandler = () => {
  //   const data = new FormData();
  //   console.log(fileInput.current.files)
  //   console.log("hiiiii")
  //   let selectedFiles = fileInput.current.files;// If file selected
  //   if (selectedFiles) {
  //     for (let i = 0; i < selectedFiles.length; i++) {
  //       data.append('galleryImage', selectedFiles[i], selectedFiles[i].name);
  //     } axios.post('http://localhost:5000/api/upload', data, {
  //       headers: {
  //         'accept': 'application/json',
  //         'Accept-Language': 'en-US,en;q=0.8',
  //         'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
  //       }
  //     })
  //       .then((response) => {
  //         console.log('res', response); if (200 === response.status) {
  //           // If file size is larger than expected.
  //           if (response.data.error) {
  //             if ('LIMIT_FILE_SIZE' === response.data.error.code) {
  //               ocShowAlert('Max size: 2MB', 'red');
  //             } else if ('LIMIT_UNEXPECTED_FILE' === response.data.error.code) {
  //               ocShowAlert('Max 4 images allowed', 'red');
  //             } else {
  //               // If not the given ile type
  //               ocShowAlert(response.data.error, 'red');
  //             }
  //           } else {
  //             // Success
  //             let fileName = response.data;
  //             console.log('fileName', fileName);
  //             ocShowAlert('File Uploaded', '#3089cf');
  //           }
  //         }
  //       }).catch((error) => {
  //         // If another error
  //         ocShowAlert(error, 'red');
  //       });
  //   } else {
  //     // if file not selected throw error
  //     ocShowAlert('Please upload file', 'red');
  //   }
  // };// ShowAlert Function
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
    // data.append('file', files);
    let mail = { 'processData': false };
    let firstname = { 'contentType': 'file' };
    console.log(data)


    axios.post('http://localhost:5000/api/upload', data)
      .then(response => console.log(response))
      .catch(error => console.log(error))

  }

  /*
   ... A lot of Redux / React boilerplate happens here 
   like mapDispatchToProps and mapStateToProps and @connect ...
  */

  // Component method
  const handleFileUpload = (e) => {
    e.preventDefault();
    const file = fileInput.current.files;
    console.log(file)
    uploadRequest(
      file
    )
  }


  function handleClick(e) {
    e.preventDefault();

    axios.get('http://localhost:5000/')
      .then((response) => {
        if (200 === response.status) {
          // If file size is larger than expected.
          if (response.data.error) {
            if ('LIMIT_FILE_SIZE' === response.data.error.code) {
              ocShowAlert('Max size: 2MB', 'red');
            } else {
              console.log(response.data);// If not the given file type
              ocShowAlert(response.data.error, 'red');
            }
          } else {
            // Success
            let fileName = response.data;
            console.log('fileName', fileName);
            ocShowAlert('File Uploaded', '#3089cf');
          }
        }
      })





    console.log('The link was clicked.');
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
        {/* <form onSubmit={fileUpload}>
          <div><h2>Upload images</h2></div>
          <h3>Images</h3>
          <input type="file" multiple onChange={handleClick} ref={fileInput} />
          <label>Amazon<input name="amazon" type="checkbox" value="amazon" /></label>
          <label>Shopify<input name="shopify" type="checkbox" value="shopify" /></label>

          <button type="submit">Submit</button>
        </form> */}

        <form onSubmit={handleFileUpload}>
          <div>
            <label>Select your profile picture:</label>
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