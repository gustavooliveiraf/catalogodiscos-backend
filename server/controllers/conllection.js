const Collection = require('../models').Collection;

const upload = require('../services/multer');
const singleUpload = upload.single('image')

var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

const s3 = new AWS.S3();

module.exports = {
  create(req, res) {
    singleUpload(req, res, function(err, some) {
      if (err) return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });

      var collection = JSON.parse(req.body.collection)

      return Collection
        .create({
            name: collection.name,
            description: collection.description,
            url: req.file.key
        })
        .then(collection => res.status(201).send(collection))
        .catch(error => {
          console.log(error)
          return res.status(400).send({ error: 'Todos os campos são obrigatórios, verifique se estão definidos com as fk\'s povoadas na base.' })
        })
    });
  },

  list(req, res) {
    return Collection
      .findAll({
        order:[['name', 'ASC']]
      })
      .then(collections => {
        getObject = (collection) => {
          return new Promise((resolve,reject) => {
            var params = { Bucket: 'gof-initial-test', Key: collection.url };
            s3.getObject(params, function (err, data) {
              if (err) console.log(err.message);
        
              collection.url = 'data:image/jpeg;base64,' + data.Body.toString('base64')
              resolve()
            })
          })
        }

        async function asyncForEach(collections) {
          for (let item of collections) {
            await getObject(item);
          }
          return res.status(200).send(collections)
        }
    
        asyncForEach(collections)
      })
      .catch(error => res.status(400).send(error))
  },

  delete(req, res) {
    return Collection
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(resp => res.status(200).json(resp))
      .catch(error => res.status(400).send(error));
  },

  getCollection(req, res) {
    return Collection
      .find({where: { id: req.params.id } })
      .then(resp => res.status(200).send(resp))
      .catch(error => res.status(400).send(error));
  },

  update(req, res) {
    return Collection
      .update (
        {name: req.body.name, description: req.body.description, url: req.body.url},
        {where: { id: req.body.id }}
      )
      .then(resp => res.status(200).send(resp))
      .catch(error => res.status(400).send(error));
  }
}
