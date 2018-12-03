const router = require('express').Router()
const collectionDiscController = require('../controllers/collectionDisc');

router.post('/:discId', collectionDiscController.create)
      .get ('/', collectionDiscController.list)

router.get ('/listCollections/:discId', collectionDiscController.listCollection)
router.get ('/listDiscs/:collectionId', collectionDiscController.listDisc)

router.delete('/:collectionId/:discId', collectionDiscController.destroy)

module.exports = router
