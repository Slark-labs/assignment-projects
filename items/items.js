const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Connection
mongoose.connect("mongodb://127.0.0.1:27017/Grocery-list")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Schema
const itemsSchema = new mongoose.Schema({
    id: {
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

const Item = mongoose.model('Item', itemsSchema);

// POST: Create a new item
router.post('/', async (req, res) => {
    const { name, price } = req.body;

    if (name === undefined || price === undefined) {
        return res.status(400).send({ message: "Name and price are required" });
    }

    const newItem = new Item({
        id: uuidv4(),
        name,
        price
    });

    try {
        const savedItem = await newItem.save();
        res.status(200).send({ message: "Item Inserted Successfully", item: savedItem });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to insert item" });
    }
});


// GET: Retrieve all items with pagination
router.get('/', async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;

    try {
        const totalItems = await Item.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page Not Found" });
        }

        const paginatedItems = await Item.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            message: "All items retrieved",
            totalItems,
            totalPages,
            items: paginatedItems
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to retrieve items" });
    }
});

// GET: Retrieve a specific item by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Item.findOne({ id });
        if (!item) {
            return res.status(404).send({ message: "Not Found" });
        }
        res.json({
            message: "Item retrieved",
            item
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to retrieve item" });
    }
});

// DELETE: Delete a specific item by ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedItem = await Item.findOneAndDelete({ id });
        if (!deletedItem) {
            return res.status(404).send({ message: "Item Not Found" });
        }
        res.status(200).send({ message: "Item Deleted Successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to delete item" });
    }
});

// PUT: Update a specific item by ID
router.put('/:id', async (req, res) => {
    const { name, price } = req.body;
    const id = req.params.id;

    try {
        const updatedItem = await Item.findOneAndUpdate(
            { id },
            { name, price },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).send({ message: "Item Not Found" });
        }
        res.status(200).send({ message: "Item Updated Successfully", item: updatedItem });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to update item" });
    }
});

module.exports = router;
