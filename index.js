const express = require('express');
const app = express();
const items = require("./MOCK_DATA.json");
const port = 8000;
const fs = require('fs');
const uid = require('uuid');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());





app.post('api/item/get', (req, res) => {
    const { name, prize } = req.body;
    const newItem = {
        id:  uid.v4(),
        name,
        prize
    }
    items.push(newItem);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Inserted Successfully", item: newItem})
    });
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


app.get('api/item/get', (req, res) => {
    return res.json({
        message: "All items retrieved",
        items
    });
});

app.delete('api/item/delete/:id', (req, res) => {
    const id = req.params.id;

    const item = items.find(item => item.id === parseInt(id));
    if (!item) {
        return res.status(404).send({message: "Item Not Found"});

    }
    console.log(item);
    items.splice(item, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Delete Successfully"})
    });
});

app.patch('api/item/patch/:id', (req, res) => {
    const {name, prize} = req.body;
    const id = req.params.id;
    const item = items.find(item => item.id === parseInt(id));
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
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Patch Successfully"})
    });
});

app.post('/', (req, res) => {
    const { name, created_at, updated_at } = req.body;
    const newCat = {
        name,
        created_at,
        updated_at,
    }
    items.push(newCat);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Inserted Successfully", item: newCat})
    });
})









