const Customer = require("../models/customers.js");

exports.addCustomer = (req, res) => {
  // console.log(req.body);

  const customer = new Customer(req.body);

  customer.save((error, customer) => {
    if (error) {
      return res.status(400).json({ error: error });
    } else if (!customer) {
      return res
        .status(400)
        .json({ error: "Not able to save customer in DATABASE" });
    }

    return res
      .status(200)
      .json({ msg: "Customer saved successfully", customer });
  });
};

exports.getAllCustomers = (req, res) => {
  // console.log("All customers");

  Customer.find({}).exec((error, customers) => {
    if (error) {
      return res.status(400).json({ error: error });
    } else if (!customers) {
      return res.status(400).json({ error: "No customers found in DATABASE" });
    }

    return res.status(200).json(customers);
  });
};

exports.getCustomerByName = (req, res, next, customerName) => {
  Customer.find({ name: customerName }).exec((error, customer) => {
    if (error) {
      return res.status(400).json({ error: error });
    } else if (!customer) {
      return res.status(400).json({ error: "No customer found in DATABASE" });
    }

    // return res.status(200).json(customer);
    req.customer = customer;
    next();
  });
};

exports.getCustomerById = (req, res, next, customerId) => {
  Customer.findById(customerId).exec((error, customer) => {
    if (error) {
      return res.status(400).json({ error: error });
    } else if (!customer) {
      return res.status(400).json({ error: "No customer found in DATABASE" });
    }

    // return res.status(200).json(customer);
    req.customer = customer;
    next();
  });
};

exports.getCustomer = (req, res) => {
  req.customer.createdAt = undefined;
  req.customer.updatedAt = undefined;

  return res.status(200).json(req.customer);
};
