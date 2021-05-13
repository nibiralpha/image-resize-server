const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('../Config/config');

AWS.config.update({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION
});

var s3 = new AWS.S3();
var sqs = new AWS.SQS();

exports.upload = (req, res) => {
  
  let obj = {
    sqsID: "",
    location: "",
    ETag: "",
    id: req.body.id
  };
  // let id = req.body.id;
  
  let fileName = req.file.filename;
  const fileContent = fs.readFileSync(req.file.path);

  var s3Params = {
    Bucket: config.BUCKETNAME,
    Key: fileName,
    Body: fileContent
  };

  var sqsParams = {

    DelaySeconds: 10,
    MessageAttributes: {
      "Path": {
        DataType: "String",
        StringValue: ""
      }
    },
    MessageBody: "data",
    QueueUrl: config.SQSQUEUEURL
  };


  s3.upload(s3Params, (err, uploadData) => {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to myBucket", uploadData);
      fs.unlinkSync(req.file.path)

      sqsParams.MessageAttributes.Path.StringValue = uploadData.Location;

      sqs.sendMessage(sqsParams, (err, data) => {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.MessageId);
          obj.sqsID = data.MessageId;
          obj.location = uploadData.Location;
          obj.ETag = uploadData.ETag

          return res.send({
            data: obj,
            config: {
              ACCESSKEYID: config.ACCESSKEYID,
              SECRETACCESSKEY: config.SECRETACCESSKEY,
              BUCKETNAME: config.BUCKETNAME,
              SQSQUEUEURL: config.SQSQUEUEURL,
              REGION: config.REGION
            }
          });
        }
      });
    }
  });
}

