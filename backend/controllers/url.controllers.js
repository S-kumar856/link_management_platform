const UrlSchema = require('../schema/url.schema');

const shortid = require("shortid")

exports.shortenUrl = async (req, res) => {

  const { destinationUrl, remarks, expiryDate } = req.body;

  const userID = req.user.id;

  // Dynamically get the base URL (works for both development and production)
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Generate URL code (use shortid, nanoid, or any unique ID generator)
  const urlCode = shortid.generate();

  try {
    // Check if the original URL already exists in the database
    let url = await UrlSchema.findOne({ destinationUrl });
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
        remarks,
        clickCount: 1,
        userID,
        status: "Active",
        expiryDate: expiration,
      });

      await url.save();
      return res.status(201).json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
};


// In routes/url.js or similar file

// Route to redirect short URL to the original URL
exports.redirectUrl = async (req, res) => {

  const shortUrlCode = req.params.shorted;

  try {
    // Look up the original URL using the short URL code
    const urlData = await UrlSchema.findOne({ urlCode: shortUrlCode });

    if (!urlData) {
      return res.status(404).json('No URL found');
    }

    // Increment the clickCount by 1
    const countUrl = urlData.clickCount += 1;

    // Get today's date in "YYYY-MM-DD" format
    const today = new Date().toISOString().split("T")[0];

    // Check if there's already a record for today
    const todayClickData = urlData.dailyClickCounts.find((data) => data.date === today);

    if (todayClickData) {
      // Increment the click count for today
      todayClickData.count += 1;
    } else {
      // Add a new entry for today's date
      urlData.dailyClickCounts.push({
        date: today,
        count: 1,
      });
    }

    // Ensure cumulative addition of today's count to the previous day's count
    urlData.dailyClickCounts.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
    for (let i = 1; i < urlData.dailyClickCounts.length; i++) {
      urlData.dailyClickCounts[i].count += urlData.dailyClickCounts[i - 1].count;
    }
    // --------------------------- 

    // Extract device type and IP address
    const deviceType = req.device.parser.useragent.family || "Desktop"; // Use express-device to get device type
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Get IP address

    // Save the device details and IP address to the database
    urlData.deviceDetails.push({
      deviceType,
      ipAddress,
      clickedAt: new Date(), // Store the current timestamp
    });

    await urlData.save();


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

    res.status(200).json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single link by ID
exports.getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const link = await UrlSchema.findById(id);

    if (!link) {
      return res.status(404).json({ success: false, error: "Link not found" });
    }

    res.status(200).json({ success: true, data: link });
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

// ----------------------------

// get analytics data for pagination
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }

    // Fetch all links for the user
    const allLinks = await UrlSchema.find({ userID: userId }).sort({ createdAt: -1 });

    // Flatten device details for pagination
    let allClicks = [];
    allLinks.forEach((link) => {
      link.deviceDetails.forEach((device) => {
        allClicks.push({
          shortUrl: link.shortUrl,
          destinationUrl: link.destinationUrl,
          createdAt: device.clickedAt || link.createdAt, // Use device click time
          ipAddress: device.ipAddress || "N/A",
          deviceType: device.deviceType || "N/A",
        });
      });
    });

    // Get total count of clicks (not links)
    const totalClicks = allClicks.length;
    const totalPages = Math.ceil(totalClicks / limit);

    // Ensure `page` is within valid range
    if (page > totalPages && totalPages > 0) {
      page = totalPages;
    }

    // Paginate based on clicks
    const startIndex = (page - 1) * limit;
    const paginatedClicks = allClicks.slice(startIndex, startIndex + limit);

    if (!paginatedClicks.length) {
      return res.status(404).json({ message: "No click data found" });
    }

    return res.json({
      clicks: paginatedClicks,
      totalPages: totalPages > 0 ? totalPages : 1,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving analytics", error });
  }
};


// get info from the db
exports.getInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    // pagination
    let { page, limit } = req.query;

    page = parseInt(page) || 1; // Default to page 1
    limit = parseInt(limit) || 5; // Default limit to 5

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: "Invalid page or limit" });
    }

    const totalLinks = await UrlSchema.countDocuments({ userID: userId });
    console.log("totalLiks:", totalLinks)
    const totalPages = Math.ceil(totalLinks / limit);

    if (page > totalPages && totalPages > 0) {
      page = totalPages;
    }
    console.log(totalPages)
    const skip = (page - 1) * limit;

    // Fetch all URLs created by the authenticated user
    const urls = await UrlSchema.find({ userID: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      links: urls,
      totalPages: totalPages,
      currentPage: page,
    });

    if (!urls.length) {
      return res.status(404).json({ message: "No links found for this user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving URLs", error });
  }
};


