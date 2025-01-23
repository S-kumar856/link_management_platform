const express = require('express');
const Auth = require('../middlewares/AuthMiddleware');
// const UrlSchema = require('../schema/url.schema');

const {createLinks, getAllLinks, getLinkById, updateLink, deleteLink, redirectToDestination} = require ( '../controllers/url.controllers');

const router = express.Router();
const BASE_URL = "https://sho.rt/";

// Route to create a new link
router.post('/createLinks', Auth, createLinks);

router.get('/getAllLinks', Auth, getAllLinks);

router.get('getLinkById/:id', Auth, getLinkById);

router.put('/updateLink/:id', Auth, updateLink);

router.delete('/deleteLink/:id', Auth, deleteLink);

// Route to handle redirection when a short URL is accessed
router.get("/:shortId", redirectToDestination);


// router.get("/:shortId", async (req, res) => {
//     try {
//       const shortId = req.params.shortId;
//       console.log(shortId);
//       const urlData = await UrlSchema.findOne({ shortUrl: `${BASE_URL}${shortId}` });
//       console.log(urlData);
//       if (!urlData) {
//         return res.status(404).json({ message: "Short URL not found" });
//       }
//       res.redirect(urlData.destinationUrl);
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   });


module.exports = router;