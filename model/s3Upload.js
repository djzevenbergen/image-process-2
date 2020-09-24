// // route/api/profile.js
// const express = require('express');
// const AWS = require('aws-sdk');
// const multerS3 = require('multer-s3');
// const multer = require('multer');
// const path = require('path');
// const url = require('url');/**
//  * express.Router() creates modular, mountable route handlers
//  * A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
//  */
// const router = express.Router();/**
//  * PROFILE IMAGE STORING STARTS
//  */


// AWS.config.getCredentials(function (err) {
//   if (err) console.log(err.stack);
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId);
//   }
// });

// AWS.config.update({ region: 'us-east-1' });

// const s3 = new AWS.S3();



// // accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
// //   secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
// //   Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
// //   region: process.env.REACT_APP_AWS_REGION
// // });/**
// //  * Single Upload
// //   * /

// console.log(process.env.REACT_APP_AWS_ACCESS_KEY_ID,)
// const profileImgUpload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'onclick',
//     acl: 'public-read',
//     key: function (req, file, cb) {
//       cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
//     }
//   }),
//   limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('profileImage');/**
//  * Check File Type
//  * @param file
//  * @param cb
//  * @return {*}
//  */
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype); if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }
// /**
//  * @route POST api/profile/business-img-upload
//  * @desc Upload post image
//  * @access public
//  */
// router.post('/profile-img-upload', (req, res) => {
//   profileImgUpload(req, res, (error) => {
//     // console.log( 'requestOkokok', req.file );
//     // console.log( 'error', error );
//     if (error) {
//       console.log('errors', error);
//       res.json({ error: error });
//     } else {
//       // If File not found
//       if (req.file === undefined) {
//         console.log('Error: No File Selected!');
//         res.json('Error: No File Selected');
//       } else {
//         // If Success
//         const imageName = req.file.key;
//         const imageLocation = req.file.location;// Save the file name into database into profile modelres.json
//         ({
//           image: imageName,
//           location: imageLocation
//         });
//       }
//     }
//   });
// });// End of single profile upload/**

// const uploadsBusinessGallery = multer({

//   storage: multerS3({
//     s3: s3,
//     bucket: `${process.env.REACT_APP_AWS_BUCKET_NAME}`,
//     acl: 'public-read',
//     key: function (req, file, cb) {
//       cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
//     }
//   }),
//   limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).array('galleryImage', 4);/**
//  * @route POST /api/profile/business-gallery-upload
//  * @desc Upload business Gallery images
//  * @access public
//  */
// router.post('/multiple-file-upload', (req, res) => {
//   uploadsBusinessGallery(req, res, (error) => {
//     console.log('files', req.files);
//     if (error) {
//       console.log('errors', error);
//       res.json({ error: error });
//     } else {
//       // If File not found
//       if (req.files === undefined) {
//         console.log('Error: No File Selected!');
//         res.json('Error: No File Selected');
//       } else {
//         // If Success
//         let fileArray = req.files,
//           fileLocation; const galleryImgLocationArray = [];
//         for (let i = 0; i < fileArray.length; i++) {
//           fileLocation = fileArray[i].location;
//           console.log('filenm', fileLocation);
//           galleryImgLocationArray.push(fileLocation)
//         }
//         // Save the file name into databaseres.json
//         ({
//           filesArray: fileArray,
//           locationArray: galleryImgLocationArray
//         });
//       }
//     }
//   });
// });// We export the router so that the server.js file can pick it up
// module.exports = router;


var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');
var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  }
});


// var multipleUpload = multer({ storage: storage }).array('file');
// var upload = multer({ storage: storage }).single('file');

var upload = multer({ dest: 'upload/' });

var type = upload.single('file');

AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

AWS.config.update({ region: 'us-east-1' });

const s3 = new AWS.S3();
console.log("i'm here")
router.post('/upload', function (req, res) {

  let upload = multer({ storage: storage }).array('file');

  console.log("req" + req.file.name)

  upload(req, res, function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    else if (!req.file) {
      return res.send('Please select an image to upload');
    }
    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
  });

});
module.exports = router;


// var multer = require('multer');
// var upload = multer({ dest: 'upload/' });
// var fs = require('fs');

// /** Permissible loading a single file, 
//     the value of the attribute "name" in the form of "recfile". **/
// var type = upload.single('recfile');

// app.post('/upload', type, function (req, res) {

//   /** When using the "single"
//       data come in "req.file" regardless of the attribute "name". **/
//   var tmp_path = req.file.path;

//   /** The original name of the uploaded file
//       stored in the variable "originalname". **/
//   var target_path = 'uploads/' + req.file.originalname;

//   /** A better way to copy the uploaded file. **/
//   var src = fs.createReadStream(tmp_path);
//   var dest = fs.createWriteStream(target_path);
//   src.pipe(dest);
//   src.on('end', function () { res.render('complete'); });
//   src.on('error', function (err) { res.render('error'); });
// }
// )