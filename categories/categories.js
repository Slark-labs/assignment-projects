const express = require('express');
const router = express.Router();

const uid = require("uuid");
const cats = require("./CATs_MOCK_DATA.json");
const fs = require("fs");


router.post('/', (req, res) => {
    const { name} = req.body;
    const newCat = {
        id: uid.v4(),
        name,
        created_at: new Date(),
        updated_at: ""
    }
    cats.push(newCat);
    fs.writeFile("./CATs_MOCK_DATA.json", JSON.stringify(cats), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Inserted Successfully", item: newCat})
    });
});

router.get('/', (req, res) => {
    return res.json({
        message: "All items retrieved",
        cats
    })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const category = cats.find(item => item.id === id);
    if (!category) {
        return res.status(404).send({message: "Not Found"});
    }
    return res.json({
        category
    });

});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { name,} = req.body;
    const category = cats.find(item => item.id === id);
    if (!category) {
        return res.status(404).send({message: "Item Not Found"});

    }
    if (category) {
        category.name = name;
        category.updated_at = new Date();

    }

    fs.writeFile("./CATs_MOCK_DATA.json", JSON.stringify(cats), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Patch Successfully",})
    });

})
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const category = cats.find(item => item.id === id);
    if (!category) {
        return res.status(404).send({message: "Item Not Found"});
    }
    cats.splice(category, 1);
    fs.writeFile("./CATs_MOCK_DATA.json", JSON.stringify(cats), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Delete Successfully",})
    });

});

module.exports = router;