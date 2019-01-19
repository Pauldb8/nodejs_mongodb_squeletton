const mongoose = require('mongoose');

const testCommentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comment: { type: String, required: true },
});

module.exports = mongoose.model('TestComment', testCommentSchema);