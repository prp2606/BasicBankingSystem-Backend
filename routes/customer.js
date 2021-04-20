const express = require("express");
const router = express.Router();

const {
  addCustomer,
  getAllCustomers,
  getCustomerByName,
  getCustomerById,
  getCustomer,
} = require("../controllers/customer");

router.param("customerName", getCustomerByName);
router.param("customerId", getCustomerById);

router.post("/customer/savecustomer", addCustomer);
router.get("/customer/allcustomers", getAllCustomers);
router.get("/customer/:customerName", getCustomer);
router.get("/customerById/:customerId", getCustomer);

module.exports = router;
