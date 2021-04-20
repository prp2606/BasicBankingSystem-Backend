require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();

mongoose
  .connect(process.env.DATABASECLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("DB IS NOT CONNECTED");
  });

app.use(bodyParser.json());
app.use(cors());

const transactionRoutes = require("./routes/transaction.js");
const customerRoutes = require("./routes/customer.js");

app.use("/sparksfoundation", transactionRoutes);
app.use("/sparksfoundation", customerRoutes);

const PORT = process.env.LOCALPORT || 7000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Banking system app is running on port ${PORT}`);
});
