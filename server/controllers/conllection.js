const Collection = require('../models').Collection;

module.exports = {
  create(req, res) {
    return Collection
      .create({
          name: req.body.name,
          description: req.body.description,
          url: req.body.url
      })
      .then(collection => res.status(201).send(collection))
      .catch(error => {
        console.log(error)
        return res.status(400).send({ error: 'Todos os campos são obrigatórios, verifique se estão definidos com as fk\'s povoadas na base.' })
      })
  },

  list(req, res) {
    return Collection
      .findAll({
        order:[['name', 'ASC']]
      })
      .then(collections => res.status(200).send(collections))
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
