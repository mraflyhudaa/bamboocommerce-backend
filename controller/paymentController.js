var midtransClient = require('midtrans-client');
var Order = require('../models/Order');

/* GENERATE TRANSACTION TOKEN */
const transactionToken = (req, res, next) => {
  // const id = nanoid.customAlphabet('1234567890abcdefghijklmno', 10);
  let current = new Date();
  let timezoneOffset = current.getTimezoneOffset();
  let cDate =
    current.getFullYear() +
    '-' +
    (current.getMonth() + 1) +
    '-' +
    current.getDate();
  let cTime =
    current.getHours() +
    ':' +
    current.getMinutes() +
    ':' +
    current.getSeconds();
  let dateTime = cDate + ' ' + cTime + ' ' + timezoneOffset;

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  let parameter = {
    transaction_details: {
      order_id: `ORDER-${req.body.nanoid}`,
      gross_amount: req.body.total,
    },
    item_details: req.body.products,
    // [
    //   {
    //     id: 'ITEM1',
    //     price: 10000,
    //     quantity: 1,
    //     name: 'Midtrans Bear',
    //     brand: 'Midtrans',
    //     category: 'Toys',
    //     merchant_name: 'Midtrans',
    //   },
    // ],
    customer_details: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      shipping_address: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        postal_code: req.body.postal_code,
        country_code: 'IDN',
      },
    },
    expiry: {
      start_time: dateTime,
      unit: 'minutes',
      duration: 20,
    },
  };

  snap
    .createTransaction(parameter)
    .then((transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      res
        .status(200)
        .json({ message: 'token acquired', token: transactionToken });
    })
    .catch((error) => {
      res.status(400).json(error.ApiResponse);
      console.log(dateTime);
    });
};

const notificationStatus = (req, res, next) => {
  let apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  let notificationJson = req.body;

  const updateStatus = async (id, status) => {
    await Order.findOneAndUpdate({ orderId: id }, { $set: { status: status } });
  };

  apiClient.transaction
    .notification(notificationJson)
    .then((statusResponse) => {
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic

      if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge') {
          // TODO set transaction status on your database to 'challenge'
          res.status(200).json('challenge');
          // and response with 200 OK
        } else if (fraudStatus == 'accept') {
          // TODO set transaction status on your database to 'success'
          updateStatus(orderId, 'success');
          // Order.findOneAndUpdate({ orderId: orderId }, { status: 'success' });
          // and response with 200 OK
          res.status(200).json('success');
        }
      } else if (transactionStatus == 'settlement') {
        // TODO set transaction status on your database to 'success'
        updateStatus(orderId, 'success');
        // Order.findOneAndUpdate({ orderId: orderId }, { status: 'success' });
        // and response with 200 OK
        res.status(200).json('success');
      } else if (
        transactionStatus == 'cancel' ||
        transactionStatus == 'deny' ||
        transactionStatus == 'expire'
      ) {
        // TODO set transaction status on your database to 'failure'
        updateStatus(orderId, 'failure');
        // Order.findOneAndUpdate({ orderId: orderId }, { status: 'failure' });
        // and response with 200 OK
        res.status(200).json('failure');
      } else if (transactionStatus == 'pending') {
        // TODO set transaction status on your database to 'pending' / waiting payment
        updateStatus(orderId, 'pending');
        // Order.findOneAndUpdate({ orderId: orderId }, { status: 'pending' });
        // and response with 200 OK
        res.status(200).json('pending');
      }
    });
};

module.exports = { transactionToken, notificationStatus };
