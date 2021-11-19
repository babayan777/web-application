const Router = require('express');
const {login, register} = require('./../controlers/UserController');

const router = new Router();

router.post('/login', login);

router.post('/register', register);

module.exports = router;