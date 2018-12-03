const router = require('express').Router()
const userController = require('../controllers/user');

router.post('/', userController.create)
      .get ('/', userController.list)
      .put ('/:id', userController.update)

router.post('/login', userController.login)

router.get('/validation', userController.validation)

module.exports = router
