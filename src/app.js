const express = require('express');
const userController = require('./userController');

const app = express();

app.use(express.json());

app.use('/auth', userController)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;