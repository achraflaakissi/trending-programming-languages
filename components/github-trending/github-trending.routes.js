const Router = require('express');
const controller = require('./github-trending.controller');
const router = Router();

router.route('/').get(controller.getListTranding);

module.exports = router;