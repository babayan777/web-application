const Router = require('express');
const {dashboard} = require("../controlers/DashboardController");

const router = new Router();

router.post('/dashboard', dashboard);

module.exports = router;