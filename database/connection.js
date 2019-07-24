const mongoose = require('mongoose');

module.exports = async () => {
  try {
    const { DB_USERNAME, DB_PASSWORD, DB_PATH } = process.env;
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_PATH}`,
      { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
    );
    console.log(`Database connected`);
  } catch (err) {
    console.error(err);
  }
};
