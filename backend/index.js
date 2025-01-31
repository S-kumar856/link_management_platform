const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user.route');
const urlRoute = require('./routes/url.route');
const redirectUrl = require('./routes/redirect.route')
var device = require('express-device');
const cors = require('cors');
dotenv.config();

// to know the devie type 
// app.use(device.capture());
app.use(device.capture({
    parseUserAgent: true
}));
device.enableViewRouting(app);

// Enable CORS


// middelwares & routers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Define the port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Route middleware for user authentication (register/login)
app.use('/api/user', userRoute);

// Route middleware for URL shortening
app.use('/api/url', urlRoute);

app.use('/', redirectUrl)


app.get('/', (req, res) => {
    console.log("hi im server");
    res.send("im server");

});

app.listen(PORT, () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB')
        }).catch((err) => {
            console.log(err)
        })
    console.log(`Server is running on port ${PORT}`)
})
