const UrlSchema = require('../schema/url.schema');

const shortid = require("shortid")

exports.shortenUrl = async (req, res) => {

    const { destinationUrl, expiryDate } = req.body;
  
    // Dynamically get the base URL (works for both development and production)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    console.log(baseUrl)
  
    // Generate URL code (use shortid, nanoid, or any unique ID generator)
    const urlCode = shortid.generate();
      
    try {
      // Check if the original URL already exists in the database
      let url = await UrlSchema.findOne({ destinationUrl });
      console.log(url)
      if (url) {
        // If the URL exists, return the existing shortened URL
        return res.json(url);
      } else {
        // Create a new shortened URL
        const shortUrl = `${baseUrl}/${urlCode}`;
  
        // Handle expiration date if provided
        let expiration = null;
        if (expiryDate) {
          expiration = new Date(expiryDate);
        }
  
        // Save the new URL to the database
        url = new UrlSchema({
          destinationUrl,
          shortUrl,
          urlCode,
          expiryDate: expiration,
        });
  
        await url.save();
        return res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  };
  

  // In routes/url.js or similar file

// Route to redirect short URL to the original URL
exports.redirectUrl =  async (req, res) => {
  
    const shortUrlCode = req.params.shorted;
    console.log(shortUrlCode)
   
    try {
        // Look up the original URL using the short URL code
        const urlData = await UrlSchema.findOne({ urlCode: shortUrlCode });
        console.log(urlData)

        if (!urlData) {
            return res.status(404).json('No URL found');
        }

        // If found, redirect the user to the original URL
        return res.redirect(urlData.destinationUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
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

      // If linkExpiration.enabled is false, remove expiryDate
      if (req.body.linkExpiration.enabled === false) {
        updateData.linkExpiration.expiryDate = undefined; // Clear expiryDate
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


