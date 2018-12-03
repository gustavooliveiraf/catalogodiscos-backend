const router = require('express').Router()
const conllectionController = require('../controllers/conllection');

router.post('/', conllectionController.create)
      .get ('/', conllectionController.list)
      .put ('/', conllectionController.update)
      .delete('/:id', conllectionController.delete)

router.get('/getCollections/:id', conllectionController.getCollection)

module.exports = router
