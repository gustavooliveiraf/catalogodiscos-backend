const Collection = require('../models').Collection;
const methodsS3 = require('../services/methodsS3');

module.exports = {
  create(req, res) {
    const upload = methodsS3.createOrUpdateObject(Date.now().toString())
    const singleUpload = upload.single('image')

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
        async function asyncForEach(collections) {
          for (let collection of collections) {
            try {
              collection.url = await methodsS3.getObject(collection.url)
            } catch (res) {
              console.log(res)
              continue
            }
          }
          return res.status(200).send(collections)
        }
    
        return asyncForEach(collections)
      })
      .catch(error => res.status(400).send(error))
  },

  delete(req, res) {
    return Collection
    .find({where: { id: req.params.id } })
    .then(collection => {
      return Collection.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(async (resp) => {
        await methodsS3.deleteObject(collection.url)

        return res.status(200).json(resp)
      })
    })
    .catch(error => res.status(400).send(error));
  },

  getCollection(req, res) {
    return Collection
      .find({where: { id: req.params.id } })
      .then(resp => res.status(200).send(resp))
      .catch(error => res.status(400).send(error));
  },

  // https://github.com/expressjs/multer/issues/150 https://github.com/expressjs/multer/issues/632
  update(req, res) {
    const upload = methodsS3.createOrUpdateObject(Date.now().toString())
    const singleUpload = upload.single('image')

    singleUpload(req, res, function(err, data) {
      var collectionReq = JSON.parse(req.body.collection)

      return Collection
      .find({where: { id: collectionReq.id } })
      .then(async (collection) => {
        try {
          await methodsS3.deleteObject(collectionReq.url)
        } catch (res) {
          console.log(collection)
        }

        return Collection.update (
          {name: collectionReq.name, description: collectionReq.description, url: req.file.key},
          {where: { id: collectionReq.id }}
        )
        .then(resp => res.status(200).send(resp) )
      })
      .catch(error => res.status(400).send(error));
    })
  }
}
