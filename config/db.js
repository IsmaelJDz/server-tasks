const mongoose = require("mongoose");

require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log("Db conectada");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = conectarDB;
