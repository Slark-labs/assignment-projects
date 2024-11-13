const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const itemsRouter = require('./items/items');
const categoryRouter = require('./categories/categories');
const app = express();

//connection
mongoose.connect("mongodb://127.0.0.1:27017/Grocery-list")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

//Schema
const itemsSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }

});

const items = mongoose.model("items", itemsSchema);


app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/items', itemsRouter);
app.use('/api/categories', categoryRouter);
const port = 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});




