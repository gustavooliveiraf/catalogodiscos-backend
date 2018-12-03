const router = require('express').Router()
const discController = require('../controllers/disc');

router.post('/', discController.create)
      .get ('/', discController.list)
      .put ('/:id', discController.update)
      .delete('/:id', discController.delete)

module.exports = router
