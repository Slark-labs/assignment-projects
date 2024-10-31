const express = require('express');
const app = express();
const items = require("./MOCK_DATA.json");
const cat = require("./CAT_MOCK_DATA.json");
const port = 8000;
const fs = require('fs');
const uid = require('uuid');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


app.post('/api/item/post', (req, res) => {
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



app.get('/api/item/get', (req, res) => {
    return res.json({
        message: "All items retrieved",
        items
    });
});

app.get('/api/item/get/:id', (req, res) => {
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

app.delete('/api/item/delete/:id', (req, res) => {
    const id = req.params.id;

    const item = items.find(item => item.id === id);
    if (!item) {
        return res.status(404).send({message: "Item Not Found"});

    }
    items.splice(item, 1);

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Delete Successfully"})
    });
});

app.patch('/api/item/patch/:id', (req, res) => {
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
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).send({message: "Item Patch Successfully"})
    });
});

app.post('/api/item/category/post', (req, res) => {
    const { name, updated_at } = req.body;
    const newCat = {
        id: uid.v4(),
        name,
        created_at: new Date(),
        updated_at,
    }
    cat.push(newCat);
    fs.writeFile("./CAT_MOCK_DATA.json", JSON.stringify(cat), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Inserted Successfully", item: newCat})
    });
})









