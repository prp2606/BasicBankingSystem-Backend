const express = require("express");
const router = express.Router();

const {
  getAllTransactions,
  saveTransaction,
  getTransactions,
} = require("../controllers/transaction.js");
const { getCustomerByName } = require("../controllers/customer.js");

router.param("customerName", getCustomerByName);

router.get("/transaction/getalltransactions", getAllTransactions);
router.post("/transaction/savetransaction", saveTransaction);
router.get("/transaction/gettransactions/:customerName", getTransactions);

module.exports = router;
