var config = require('./config.json');
var AWS = require('aws-sdk');
AWS.config.update({region:config.awsRegion});
var s3 = new AWS.S3();
var fs = require('fs');
var path = require('path');
const sns = new AWS.SNS();

//Command-line arguments
var args = process.argv.slice(2);
var fullFileName = args[0];
var fileName = path.basename(fullFileName);

var bitmap = fs.readFileSync(fullFileName);

if(bitmap){
  console.log('fullFileName',fullFileName);
  console.log('fileName', fileName);

  var params = {
    Body: bitmap,
    Bucket: config.s3Bucket,
    Key: fileName
   };
   s3.putObject(params, function(err, data) {

    if(err){
      console.log(err);
    }else{
      console.log('uploaded to s3 ', data);

      const url = s3.getSignedUrl('getObject', {
            Bucket: config.s3Bucket,
            Key: fileName,
            Expires: 300
        })

        //console.log(url)

        sns.publish({
          Message: 'Motion delected '+ name+' . See the image I captured. ' + url,
          TopicArn: 'arn:aws:sns:us-east-1:027378352884:edisonMotionDetection'
        }, function (err, data) {
          if(err){
            console.log("error", err);
          }else{
            console.log('success',data);
          }

        });
      fs.exists(fullFileName, function(exists) {
        if(exists) {

          fs.unlink(fullFileName);
        }
        });
    }



   });
}else{
  console.log('No image found');
}
