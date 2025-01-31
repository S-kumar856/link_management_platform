const UrlSchema = require('../schema/url.schema');
const moment = require("moment"); // To manage dates
const shortid = require("shortid");
const cron = require('node-cron');

exports.shortenUrl = async (req, res) => {

  const { destinationUrl, remarks, expiryDate } = req.body;

  const userID = req.user.id;

  // Dynamically get the base URL (works for both development and production)
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Generate URL code (use shortid, nanoid, or any unique ID generator)
  const urlCode = shortid.generate();

  try {
    // Check if the original URL already exists in the database
    let url = await UrlSchema.findOne({ destinationUrl, userID });
    if (url) {
      // If the URL exists, return the existing shortened URL
      return res.json(url);
    } else {
      // Create a new shortened URL
      const shortUrl = `${baseUrl}/${urlCode}`;

      // Handle expiration date if provided
      let status = "Active";
      let expiration = null;
      if (expiryDate) {
        expiration = new Date(expiryDate);
        // Check if the expiration date is in the past
        if (moment(expiration).isBefore(moment())) {
          status = "Inactive";
        }
      }

      // Save the new URL to the database
      url = new UrlSchema({
        destinationUrl,
        shortUrl,
        urlCode,
        remarks,
        userID,
        status,
        expiryDate: expiration,
        clickCount:0,
        dailyClickCounts: [],
        deviceDetails: []
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

    // Check if URL has expired
    if (urlData.expiryDate && moment().isAfter(urlData.expiryDate)) {
      // Update status to Inactive if it hasn't been updated yet
      if (urlData.status !== "Inactive") {
        urlData.status = "Inactive";
        await urlData.save();
      }
      return res.status(410).json({ 
        message: "This link has expired", 
        expiryDate: urlData.expiryDate 
      });
    }

    // If URL is manually set to Inactive
    if (urlData.status === "Inactive") {
      return res.status(410).json({ 
        message: "This link is inactive"
      });
    }

    // Increment the clickCount by 1
   urlData.clickCount += 1;

   const today = moment().format("YYYY-MM-DD");
   const existingDayRecord = urlData.dailyClickCounts.find(
     (day) => day.date === today
   );

   if (existingDayRecord) {
     existingDayRecord.count += 1;
   } else {
     urlData.dailyClickCounts.push({ date: today, count: 1 });
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
    const { destinationUrl, remarks, expiryDate } = req.body;

    
    // Determine status based on expiration date
    let status = "Active";
    if (expiryDate) {
      if (moment(expiryDate).isBefore(moment())) {
        status = "Inactive";
      }
    }

    const updatedLink = await UrlSchema.findByIdAndUpdate(
      id, 
      {
        destinationUrl,
        remarks,
        expiryDate,
        status,
        $set:{
            lastUpdated: new Date()
        }
      },
     { new: true}
    );

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
  
    const totalPages = Math.ceil(totalLinks / limit);

    if (page > totalPages && totalPages > 0) {
      page = totalPages;
    }

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

// expiry date
const updateExpiredUrls = async () => {
  try {
    const now = new Date();
    const result = await UrlSchema.updateMany(
      {
        expiryDate: { $lt: now },
        status: 'Active'
      },
      {
        $set: { status: 'Inactive' }
      }
    );
    // console.log(`Updated ${result.modifiedCount} expired URLs`);
  } catch (error) {
    console.error('Error updating expired URLs:', error);
  }
};

// Run every minute
cron.schedule('* * * * *', updateExpiredUrls);

