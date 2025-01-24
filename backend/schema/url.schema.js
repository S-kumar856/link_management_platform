const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    destinationUrl: {
        type: String,
        required: true,
        trim: true
    },
    remarks: {
        type: String,
        // required: true,
        trim: true,
    },
    linkExpiration: {
        enabled: {
            type: Boolean,
            // required: true,
            default: false,
        },
        expiryDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    // expirationDate is required only if enabled is true
                    return this.linkExpiration.enabled ? value != null : true;
                },
                message:
                    "Expiration date is required when link expiration is enabled.",
            },
        },
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    urlCode: { 
        type: String, 
        required: true, 
        unique: true 
    },
    Date: {
        type: Date,
        default: Date.now
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('UrlSchema', urlSchema);