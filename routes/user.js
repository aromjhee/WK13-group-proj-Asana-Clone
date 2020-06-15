const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { asyncHandler, csrfProtection } = require('./utils')
const db = require('../db/models')


router.get('/user', asyncHandler(async (req, res) => {
  const users = await db.User.findAll()
  res.render('users', { users })
}))

// - register page (GET - 'user/register')
router.get('/user/register', csrfProtection, asyncHandler(async (req, res) => {
  const user = db.User.build()
  res.render('user-register', { user, token: req.csrfToken() })
}))

// - register page (POST - 'user/register')
router.post('/user/register', csrfProtection, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const user = db.User.build({ firstName, lastName, email, hashedPassword: password })

  try {
    await user.save()
    res.redirect('/user')
  } catch (err) {
    const errors = err.errors.map(error => error.message)
    res.render('user-register', {
        errors,
        user,
        token: req.csrfToken()
      })
  }
}))

// - login page (GET - 'user/login')
router.get('/user/login', csrfProtection, asyncHandler(async (req, res) => {
  res.render('user-login', { token: req.csrfToken() })
}))

// - login page (POST - 'user/login')
router.post('/user/login', csrfProtection, asyncHandler(async (req, res) => {
  const { email, password } = req.body
  let errors = []

  try {
    const user = await db.User.findOne({ where: { email: { [Op.iLike]: email } }})
    if (user !== null) {
      const passwordMatch = await user.validatePassword(password)
      if (passwordMatch) {
        // TODO: Login the user
        const token = getUserToken(user)
        return res.redirect('/')
      }
    }

    errors.push('Login failed for the provided email address and password');
  } catch (err) {
    errors = err.errors.map(error => error.message)
  }

  res.render('user-login', {
    errors,
    email,
    token: req.csrfToken()
  })
}))

module.exports = router