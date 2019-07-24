require('dotenv').config();
const express = require('express');
const databaseConnection = require('./database/connection');

const app = express();

databaseConnection();

app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/profile', require('./routes/profile'));

app.listen(process.env.PORT, () => {
  console.log(`Application listened on port: ${process.env.PORT}`);
});
