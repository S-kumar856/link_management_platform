const express = require('express');
// const Auth = require('../middlewares/AuthMiddleware');
const {redirectUrl} = require ( '../controllers/url.controllers');

const router = express.Router();

router.get('/:shorted', redirectUrl)



module.exports = router;