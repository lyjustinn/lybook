const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const User = mongoose.model(
    'User',
    new Schema({
        email: { type: String, required:true},
        password: { type: String, required: true},
        items: [{type: Schema.Types.ObjectId, ref: 'Item'}] 
    })
);

module.exports = User