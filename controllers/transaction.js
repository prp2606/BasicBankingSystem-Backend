const Customer = require("../models/customers.js");
const Transaction = require("../models/transactions.js");

exports.saveTransaction = (req, res) => {
  // console.log(req.body);

  if (req.body.transactionFrom._id === req.body.transactionTo._id) {
    return res.status(401).json({
      error: "Cannot perform transaction in the same account!!!",
    });
  }

  Customer.findById(req.body.transactionFrom).exec((error, customerFrom) => {
    if (error) {
      return res
        .status(400)
        .json({ error: "Transaction From customer not found!" });
    } else if (!customerFrom) {
      return res
        .status(400)
        .json({ error: "No such customer exists in DATABASE" });
    }

    if (customerFrom.currentBalance < req.body.transactionAmount) {
      return res.status(400).json({
        msg: "Transaction Failed",
        message: `Not enough balance in ${customerFrom.name}'s account`,
        details: `Transaction Amount: ${req.body.transactionAmount} | Available Balance: ${customerFrom.currentBalance}`,
      });
    } else {
      Customer.findOneAndUpdate(
        { _id: req.body.transactionFrom },
        { $inc: { currentBalance: -req.body.transactionAmount } },
        { new: true, useFindAndModify: false }
      ).exec((error, customerFrom) => {
        if (error) {
          return res.status(400).json({ error: "Error in debiting amount!" });
        } else if (!customerFrom) {
          return res
            .status(400)
            .json({ error: "No such customer exists in DATABASE" });
        }

        Customer.findOneAndUpdate(
          { _id: req.body.transactionTo },
          { $inc: { currentBalance: req.body.transactionAmount } },
          { new: true, useFindAndModify: false }
        ).exec((error, customerTo) => {
          if (error) {
            return res.status(400).json({
              error:
                "Error in crediting amount in TransactionTo customers account",
            });
          } else if (!customerTo) {
            return res.status(400).json({
              error: "No such beneficiary customer exists in DATABASE",
            });
          }
        });

        const transactionObject = new Transaction(req.body);

        transactionObject.save((error, transaction) => {
          if (error) {
            return res
              .status(400)
              .json({ error: "Error in saving transaction history" });
          } else if (!transaction) {
            return res
              .status(400)
              .json({ error: "Not able to save this transaction in DATABASE" });
          }

          return res
            .status(200)
            .json({ msg: "Transaction saved successfully", transaction });
        });
      });
    }
  });
};

exports.getTransactions = (req, res) => {
  // console.log(req.customer[0]);

  Transaction.find({
    $or: [
      { transactionFrom: req.customer[0]._id },
      { transactionTo: req.customer[0]._id },
    ],
  }).exec((error, transactions) => {
    if (error || !transactions) {
      return res.status(400).json({ error: "Failed in fetching transactions" });
    }

    // console.log(transactions);
    return res.status(200).json(transactions);
  });
};

exports.getAllTransactions = (req, res) => {
  Transaction.find({}).exec((error, transactions) => {
    if (error || !transactions) {
      return res.status(400).json({ error: "Failed in fetching transactions" });
    }

    let transactionsResponse = [];

    let length = transactions.length;
    let counter = 0;

    transactions.forEach((object) => {
      let obj = {
        transactionFrom: "",
        transactionTo: "",
        transactionAmount: 0,
        updatedAt: "",
      };

      Customer.findById(object.transactionFrom).exec((error, customerFrom) => {
        if (error || !customerFrom) {
          console.log("Some error happened 1!");
        }

        obj.transactionFrom = customerFrom.name;

        Customer.findById(object.transactionTo).exec((error, customerTo) => {
          if (error || !customerTo) {
            console.log("Some error happened 2!");
          }

          obj.transactionTo = customerTo.name;
          obj.transactionAmount = object.transactionAmount;
          obj.updatedAt = object.updatedAt;

          transactionsResponse.push(obj);

          counter++;

          if (counter === length) {
            return res.status(200).json(transactionsResponse);
          }
        });
      });
    });
  });
};
