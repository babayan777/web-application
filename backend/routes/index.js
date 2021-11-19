const Routes = require('express');
const auth = require('./../middleware/auth')
const UserRouter = require('./UserRoutes');
const DashboardRoutes = require('./DashboardRoutes');

const router = new Routes();

router.use('/user', UserRouter);
router.use('/home', auth , DashboardRoutes);

module.exports = router;