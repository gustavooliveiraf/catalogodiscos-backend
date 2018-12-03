const Disc = require('../models').Disc;

module.exports = {
  create(req, res) {
    return Disc
      .create({
          name: req.body.name
      })
      .then(disc => res.status(201).send(disc))
      .catch(error => {
        console.log(error)
        return res.status(400).send({ error: 'Todos os campos são obrigatórios, verifique se estão definidos com as fk\'s povoadas na base.' })
      })
  },

  list(req, res) {
    return Disc
      .findAll({
        order:[['name', 'ASC']]
      })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error))
  },

  update(req, res) {
    return Disc
      .update (
        {name: req.body.name},
        {where: { id: req.params.id }}
      )
      .then(resp => res.status(200).json(resp))
      .catch(error => res.status(400).send(error));
  },

  delete(req, res) {
    return Disc
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(resp => res.status(200).json(resp))
      .catch(error => res.status(400).send(error));
  },
}