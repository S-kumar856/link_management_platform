const express = require('express');
const Auth = require('../middlewares/AuthMiddleware');


const {shortenUrl, getAllLinks, getLinkById, updateLink, deleteLink} = require ( '../controllers/url.controllers');

const router = express.Router();


// Route to create a new link
router.post('/createLinks', shortenUrl);

router.get('/getAllLinks', Auth, getAllLinks);

router.get('getLinkById/:id', Auth, getLinkById);

router.put('/updateLink/:id', Auth, updateLink);

router.delete('/deleteLink/:id', Auth, deleteLink);




module.exports = router;