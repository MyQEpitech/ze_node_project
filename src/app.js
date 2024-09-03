const express = require('express');
const authRouter = require('./routes');

const app = express();

app.use(express.json());

app.use('/auth', authRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;