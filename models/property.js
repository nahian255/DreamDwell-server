const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: String,
    description: String,
    // Add other fields as needed
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
