const express = require('express');
const Auth = require('../middlewares/AuthMiddleware');


const {shortenUrl, getAllLinks, getLinkById, updateLink, deleteLink, getInfo, getAnalytics} = require ( '../controllers/url.controllers');
const {getDashboardStats} = require ('../controllers/dashboard.controllers')

const router = express.Router();


// Route to create a new link
router.post('/createLinks', Auth , shortenUrl);

router.get('/getAllLinks', Auth, getAllLinks);

router.get('/getLinkById/:id', Auth, getLinkById);

router.put('/updateLink/:id', Auth, updateLink);

router.delete('/deleteLink/:id', Auth, deleteLink);

router.get("/analytics", Auth, getAnalytics);

router.get('/',Auth,getInfo)

router.get('/dashboard/Stats', Auth, getDashboardStats)



module.exports = router;