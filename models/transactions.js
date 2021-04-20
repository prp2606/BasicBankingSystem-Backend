const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transactionSchema = new mongoose.Schema(
  {
    transactionFrom: {
      type: ObjectId,
      ref: "Customer",
      required: true,
    },
    transactionTo: {
      type: ObjectId,
      ref: "Customer",
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transactions", transactionSchema);
