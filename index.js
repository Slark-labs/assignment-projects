const express = require('express');
const cors = require('cors');
const itemsRouter = require('./items/items');
const categoryRouter = require('./categories/categories');
const app = express();

app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// this is the change

app.use('/api/items', itemsRouter);


app.use('/api/categories', categoryRouter);


const port = 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});





