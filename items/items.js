const express = require('express');
const router = express.Router();

const uid = require("uuid");
const items = require("./ITEMs_MOCK_DATA.json");
const fs = require("fs");


router.post('/', (req, res) => {
    const { name, prize } = req.body;
    const newItem = {
        id:  uid.v4(),
        name,
        prize
    }
    items.push(newItem);
    fs.writeFile("./items/ITEMs_MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Inserted Successfully", item: newItem})
    });
});



router.get('/', (req, res) => {
    return res.json({
        message: "All items retrieved",
        items
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const itemIndex = items.find(item => item.id === id);
    if (!itemIndex && itemIndex !== 0) {
        return res.status(404).send({message: "Not Found"});
    }
    return res.json({
        message: " Item retrieved",
        itemIndex
    });

})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const itemIndex = items.findIndex(item => item.id === id);

    console.log({ itemIndex });
    if (!itemIndex && itemIndex !== 0) {
        return res.status(404).send({message: "Item Not Found"});

    }
    console.log({items})
    items.splice(itemIndex, 1);

    console.log({items})

    fs.writeFile("./items/ITEMs_MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Delete Successfully"})
    });
});

router.put('/:id', (req, res) => {
    const { name, prize } = req.body;
    const id = req.params.id;

    // Find the index of the item in the array
    const itemIndex = items.findIndex(item => item.id === id);

    // Check if item exists
    if (itemIndex === -1) {  // -1 means not found
        return res.status(404).send({ message: "Item Not Found" });
    }

    // Update item properties if they exist
    if (name) {
        items[itemIndex].name = name;  // Update the name of the item
    }
    if (prize) {
        items[itemIndex].prize = prize; // Update the prize of the item
    }

    // Write the updated items back to the JSON file
    fs.writeFile("./items/ITEMs_MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: "Failed to update item in the file" });
        }
        return res.status(200).send({ message: "Item Updated Successfully" });
    });
});


module.exports = router;