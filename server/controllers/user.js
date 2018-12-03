const User = require('../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  create(req, res) {
    var salt = bcrypt.genSaltSync(11);
    var hash = bcrypt.hashSync(req.body.password, salt);
    return User
      .findOrCreate({
        where: {
            email: req.body.email.toLowerCase()
        },
        defaults: {
          name: req.body.name,
          user: req.body.user.toLowerCase(),
          email: req.body.email.toLowerCase(),
          password: hash,
          company: req.body.company,
          cnpj: req.body.cnpj,
          phone: req.body.phone
        }
      })
      .then(user => {
        delete user[0].password
        return res.status(201).send({ user: { id: user[0].id, name: user[0].name, is_admin: user[0].is_admin, is_active: user[0].is_active }, auth: user[1], token: jwt.sign({ data: user[0].id }, 'secret', { expiresIn: '1h' }) })
      })
      .catch(error => {
        console.log(error)
        return res.status(400).send({ error: 'Todos os campos são obrigatórios, verifique se estão definidos com as fk\'s povoadas na base.' })
      })
  },

  list(req, res) {
    return User
      .findAll({
        order:[['name', 'ASC']]
      })
      .then(users => res.status(201).send(users))
      .catch(error => res.status(400).send(error))
  },

  getUser(req, res) {
    User.hasMany(Bot, { foreignKey: 'user_id' })
    return User
      .findOne({
        where: {
          id: req.params.id
        },
        attributes: {
          exclude: ['password']
        }
      })
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).send(error))
  },

  update(req, res) {
    var salt = bcrypt.genSaltSync(11);
    var hash = bcrypt.hashSync(req.body.password, salt);
    return User
      .update(
        {
          name: req.body.name,
          user: req.body.user.toLowerCase(),
          email: req.body.email.toLowerCase(),
          password: hash,
          company: req.body.company,
          cnpj: req.body.cnpj,
          phone: req.body.phone
        },
        {
          where: { id: req.params.id }
        }
      )
      .then(users => res.status(201).send(users))
      .catch(error => {
        console.log(error)
        return res.status(400).send({ error: 'Todos os campos são obrigatórios, verifique se estão definidos com as fk\'s povoadas na base.' })
      })
  },

  login(req, res) {
    return User
      .findOne({
        where: {
          email: req.body.email.toLowerCase()
        }
      })
      .then(user => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          token = jwt.sign({ data: user.id }, 'secret', { expiresIn: '1h' });
          delete user.password
          return res.status(201).send({ user: { id: user.id, name: user.name, is_admin: user.is_admin, is_active: user.is_active }, token, check: true }) // mudar para auth !!!!!!!!!!!!!!!!!
        } else {
          return res.status(201).send({ check: false })
        }
      })
      .catch(error => {
        return res.status(400).send(error)
      });
  },

  confirmpass(req, res) {
    return User
      .findOne({
        where: {
          id: req.body.id
        }
      })
      .then(user => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
          delete user.password
          return res.status(201).send({check: true })
        } else {
          return res.status(201).send({ check: false })
        }
      })
      .catch(error => res.status(400).send(error));
  },

  validation(req, res) {
    return User
      .findOne({ where: { [req.query.name]: req.query.value.toLowerCase() } })
      .then(check => {
        if (check) return res.status(201).send({ check: check })
        else return res.status(201).send({ check: false })
      })
      .catch(error => res.status(400).send(error));
  },

  autorizarUser(req, res) {
    return User
      .update(
        {
          is_active: req.body.is_active,
          is_admin: req.body.is_admin
        },
        {
          where: { id: req.params.id }
        }
      )
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },

  rememberPassword(req, res) {
    var newPassword = uid.generateUids(1)
    var salt = bcrypt.genSaltSync(11);
    var hash = bcrypt.hashSync(newPassword, salt);

    return User
      .update(
        { password: hash },
        { where: { email: req.body.email } },
        { attributes: { exclude: ['password'] } }
      )
      .then(user => {
        return sendEmail.sendEmail(req.body.email, newPassword)
          .then(() => res.status(201).send(user))
          .catch(error => res.status(400).send(error))
      })
      .catch(error => res.status(400).send(error));
  },

  updatePassword(req, res) {
    var salt = bcrypt.genSaltSync(11);
    var hash = bcrypt.hashSync(req.body.password, salt);

    return User
      .update(
        { password: hash },
        { where: { id: req.params.id } },
        { attributes: { exclude: ['password'] } }
      )
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error))
  },
}
