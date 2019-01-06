const multer = require('multer');
const multerS3 = require('multer-s3');

var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

const s3 = new AWS.S3();

module.exports = {
  createOrUpdateObject: (hash) => {
    return multer({
      storage: multerS3({
        s3: s3,
        bucket: 'gof-initial-test',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        // metadata: function (req, file, cb) {
        //   cb(null, {fieldName: file.fieldname});
        // },
        key: function (req, file, cb) {
          cb(null, hash)
        }
      })
    })
  },

  getObject: (hash) => {
    return new Promise((resolve, reject) => {
      var params = { Bucket: 'gof-initial-test', Key: hash };
      s3.getObject(params, function (err, data) {
        if (err) {
          console.log(err.message);
          return reject(err.message)
        }

        dataImage = 'data:' + data.ContentType + ';base64,' + data.Body.toString('base64')

        return resolve(dataImage)
      })
    })
  },

  deleteObject: (hash) => {
    return new Promise((resolve,reject) => {
      var params = { Bucket: 'gof-initial-test', Key: hash };
      s3.deleteObject(params, function (err, data) {
        if (err) {
          console.log(err.message);
          return reject(err.message)
        }

        return resolve(true)
      })
    })
  }
}