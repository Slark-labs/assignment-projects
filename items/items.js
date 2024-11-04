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
    fs.writeFile("./ITEMs_MOCK_DATA.json", JSON.stringify(items), (err) => {
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
    const item = items.find(item => item.id === id);
    if (!item) {
        return res.status(404).send({message: "Not Found"});
    }
    return res.json({
        message: "All items retrieved",
        item
    });

})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    const item = items.find(item => item.id === id);
    if (!item) {
        return res.status(404).send({message: "Item Not Found"});

    }
    items.splice(item, 1);

    fs.writeFile("./ITEMs_MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Delete Successfully"})
    });
});

router.put('/:id', (req, res) => {
    const {name, prize} = req.body;
    const id = req.params.id;
    const item = items.find(item => item.id === id);
    if (!item) {
        console.log(item);
        return res.status(404).send({message: "Item Not Found"});

    }
    if (name) {
        item.name = name;

    }
    if (prize) {
        item.prize = prize;
    }
    fs.writeFile("./ITEMs_MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Patch Successfully"})
    });
});

module.exports = router;