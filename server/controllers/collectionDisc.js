const CollectionDisc = require('../models').CollectionDisc;
const Disc = require('../models').Disc;

module.exports = {
  create(req, res) {
    asyncForEach = async (collectionIds) => {
      var flag = true;
      for (i in collectionIds) {
        await CollectionDisc.findOrCreate({
          where: {
            discId: req.params.discId,
            collectionId: collectionIds[i]
          },
          defaults: {
            discId: req.params.discId,
            collectionId: collectionIds[i]
          }})
          .catch(err => flag = err)
      }

      if (flag === true) return res.status(201).send({check: true})
      else res.status(400).send(flag);
    }

    asyncForEach(req.body.collectionId)
  },

  destroy(req, res) {
    return CollectionDisc
      .destroy({
        where: {
          collectionId: req.params.collectionId,
          discId: req.params.discId
        }
      })
      .then(collectionDisc => res.status(200).json(collectionDisc))
      .catch(error => res.status(400).send(error))
  },

  list(req, res) {
    return CollectionDisc
      .findAll()
      .then(collectionDiscs => res.status(200).send(collectionDiscs))
      .catch(error => res.status(400).send(error))
  },

  listCollection(req, res) {
    return CollectionDisc
      .findAll ( { where: {discId: req.params.discId}} )
      .then(collectionDiscs => res.status(200).send(collectionDiscs))
      .catch(error => res.status(400).send(error))
  },

  listDisc(req, res) {
    return CollectionDisc
      .findAll ( { where: {collectionId: req.params.collectionId}} )
      .then(discIds => {
        asyncForEach = async (discIds) => {
          var flag = true, discs = []

          for (i in discIds) {
            await Disc.find({ where: { id: discIds[i].discId } })
              .then(res => discs.push(res))
              .catch(err => flag = err)
          }
    
          if (flag === true) return res.status(201).send(discs)
          else res.status(400).send(flag);
        }
    
        asyncForEach(discIds)
      })
      .catch(error => res.status(400).send(error))
  }
}
