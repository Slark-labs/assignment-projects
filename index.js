const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const itemsRouter = require('./items/items');
app.use('/api/items', itemsRouter);

const categoryRouter = require('./categories/categories');
app.use('/api/categories', categoryRouter);


const port = 8000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
















