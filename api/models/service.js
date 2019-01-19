const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false },
    image: { type: String, required: true },
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    rating: { type: Number, required: false },
    category: { type: String, required: true}
});

module.exports = mongoose.model('Service', serviceSchema);