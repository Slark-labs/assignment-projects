const express = require('express');
const app = express();
const items = require("./MOCK_DATA.json");
const port = 8000;
const fs = require('fs');
app.use(express.urlencoded({ extended: false }));





app.post('/post', (req, res) => {
    const { name, prize } = req.body;
    const newItem = {
        id:  items.length + 1,
        name,
        prize
    }
    items.push(newItem);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(items), (err) => {
        if (err) {
            console.log(err);
        }

        return res.status(200).send({ message: "Item Inserted Successfully", item: newItem})
    })
    //
    // console.log(body);
    // return res.send("Secuss");
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

app.get('/get', (req, res) => {
    return res.json({
        message: "All items retrieved",
        items
    })
})