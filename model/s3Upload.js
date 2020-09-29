var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');
var storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  }
});
var multipleUpload = multer({ storage: storage }).array('file');
var upload = multer({ storage: storage }).single('file');

router.post('/upload', multipleUpload, function (req, res) {
  console.log("getting here 14")
  // console.log(req)
  const file = req.files;

  Object.values(file).forEach((f) => {
    console.log(f)
  })

  AWS.config.update({ region: 'us-east-1' });

  AWS.config.loadFromPath('./config.json');



  let s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  // s3.createBucket(function () {
  //   //Where you want to store your file
  //   console.log("getting here 19")
  var ResponseData = [];
  // s3.config.loadFromPath('./config.json');

  s3.listBuckets(function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Buckets);
    }
  });

  file.map((item) => {
    console.log("mapping files")
    console.log(item)
    var params = {
      Bucket: "filter-user-upload-bucket",
      Region: 'us-east-1',
      Key: item.originalname,
      Body: item.buffer
    };
    s3.upload(params, function (err, data) {
      if (err) {
        res.json({ "error": true, "Message": err });
        console.log(err)
      } else {
        ResponseData.push(data);
        if (ResponseData.length == file.length) {
          res.json({ "error": false, "Message": "File Uploaded Successfully", Data: ResponseData });
        }
      }
    });
  });

});
module.exports = router;


/// this works for one file already on system

// var express = require('express');
// var router = express.Router();
// var multer = require('multer');
// var AWS = require('aws-sdk');
// var storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, '');
//   }
// });

// var fs = require('fs'),
//   S3FS = require('s3fs'),
//   s3fsImpl = new S3FS("filter-user-upload-bucket", {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   });


// // var multipleUpload = multer({ storage: storage }).array('file');
// // var upload = multer({ storage: storage }).single('file');

// var upload = multer({ dest: 'upload/' });

// var type = upload.single('file');

// AWS.config.getCredentials(function (err) {
//   if (err) console.log(err.stack);
//   // credentials not loaded
//   else {
//     console.log("Access key:", AWS.config.credentials.accessKeyId);
//   }
// });

// AWS.config.update({ region: 'us-east-1' });

// const s3 = new AWS.S3();
// console.log("i'm here")
// router.post('/upload', type, function (req, res) {

//   // var file = req.file;
//   var stream = fs.createReadStream('upload/20200802_212017 (1).jpg');
//   return s3fsImpl.writeFile("file", stream).then(function () {
//     fs.unlink('upload/20200802_212017 (1).jpg', function (err) {
//       if (err) {
//         console.error(err);
//       }
//     });
//     res.status(200).end();
//   });

// })

// module.exports = router;