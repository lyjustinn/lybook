const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Item = mongoose.model(
    'Item',
    new Schema({
        link: { type: String, required: true},
        ASIN: { type: String, required: true},
        name: { type: String, required:true},
        image: { type:String, required: true},
        date: [{ type: Date, required: true, default: Date.now()}],
        price: [{ type: Number, required: true}], 
        status: [{type: String}]
    })
);

module.exports = Item