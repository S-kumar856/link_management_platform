const UrlSchema = require('../schema/url.schema');

const BASE_URL = "https://sho.rt/";

// Create a new link
exports.createLinks = async (req, res) => {
  try {
    const { destinationUrl, remarks, linkExpiration } = req.body;

  
     // Generate a unique short URL 
     const shortUrlID = Math.random().toString(36).substring(2, 8);
     const shortUrl = `${BASE_URL}${shortUrlID}`;
    

    const newLink = new UrlSchema({
      destinationUrl,
      remarks,
      linkExpiration,
      shortUrl,
    });

    await newLink.save();
    res
      .status(201)
      .json({ success: true,  message: "Link created successfully", data: newLink });
    // res.redirect(shortUrl.destinationUrl);

  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message:'link not created' });
  }
};
        
// Controller for handling redirection
exports.redirectToDestination = async (req, res) => {
    try {
      const { shortId } = req.params; // Extract the shortId from the URL
      const fullShortUrl = `${BASE_URL}${shortId}`;
  
      // Find the URL document in the database using the shortUrl
      const urlRecord = await UrlSchema.findOne({ shortUrl: fullShortUrl });
  
      if (!urlRecord) {
        return res.status(404).json({ message: "Short URL not found" });
      }
  
      // Redirect to the destination URL
      res.redirect(urlRecord.destinationUrl);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

// Get all links
exports.getAllLinks = async (req, res) => {
  try {
    const links = await UrlSchema.find();
    res.status(200).json({ success: true,  data: links });
  } catch (error) {
    res.status(500).json({ success: false,  error: error.message });
  }
};

// Get a single link by ID
exports.getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await UrlSchema.findById(id);

    if (!link) {
      return res.status(404).json({ success: false, error: "Link not found" });
    }

    res.status(200).json({ success:true, data: link });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a link
exports.updateLink = async (req, res) => {
  try {
    const { id } = req.params;

    // Build an object containing only the fields the user wants to update
    const updateData = {};
    if (req.body.destinationUrl !== undefined) {
      updateData.destinationUrl = req.body.destinationUrl;
    }
    if (req.body.remarks !== undefined) {
      updateData.remarks = req.body.remarks;
    }
    if (req.body.linkExpiration !== undefined) {
      updateData.linkExpiration = req.body.linkExpiration;

      // If linkExpiration.enabled is false, remove expirationDate
      if (req.body.linkExpiration.enabled === false) {
        updateData.linkExpiration.expirationDate = undefined; // Clear expirationDate
      }
    }

    const updatedLink = await UrlSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedLink) {
      return res.status(404).json({ error: "Link not found" });
    }

    res
      .status(200)
      .json({ message: "Link updated successfully", data: updatedLink });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete a link
exports.deleteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLink = await UrlSchema.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ error: "Link not found" });
    }
    res
      .status(200)
      .json({ message: "Link deleted successfully", data: deletedLink });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


