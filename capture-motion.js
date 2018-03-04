var config = require('./config.json');
var AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
var s3 = new AWS.S3();
var fs = require('fs');
var path = require('path');

//Command-line arguments
var args = process.argv.slice(2);
var fullFileName = args[0];
var key = path.basename(fullFileName);

var bitmap = fs.readFileSync(fullFileName);

var params = {
  Body: bitmap,
  Bucket: config.s3Bucket,
  Key: fileName
 };
 s3.putObject(params, function(err, data) {
   fs.exists(fullFileName, function(exists) {
     if(exists) {

       fs.unlink(fullFileName);
     }
     });

   if (err) {
     console.log(err, err.stack);
     cb(err);
   }else{
     //console.log(data);
     cb(null,data);           // successful response
   }

 });
