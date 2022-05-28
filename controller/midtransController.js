var midtransClient = require('midtrans-client');

/* GENERATE TRANSACTION TOKEN */
const transactionToken = (req, res, next) => {
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
      order_id: `ORDER-105-${cTime}`,
      gross_amount: 10000,
    },
    item_details: [
      {
        id: 'ITEM1',
        price: 10000,
        quantity: 1,
        name: 'Midtrans Bear',
        brand: 'Midtrans',
        category: 'Toys',
        merchant_name: 'Midtrans',
      },
    ],
    customer_details: {
      first_name: 'John',
      last_name: 'Watson',
      email: 'test@example.com',
      phone: '+628123456',
      billing_address: {
        first_name: 'John',
        last_name: 'Watson',
        email: 'test@example.com',
        phone: '081 2233 44-55',
        address: 'Sudirman',
        city: 'Jakarta',
        postal_code: '12190',
        country_code: 'IDN',
      },
      shipping_address: {
        first_name: 'John',
        last_name: 'Watson',
        email: 'test@example.com',
        phone: '0 8128-75 7-9338',
        address: 'Sudirman',
        city: 'Jakarta',
        postal_code: '12190',
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
        .json({ message: 'token aquired', token: transactionToken });
    })
    .catch((error) => {
      res.status(400).json(error.ApiResponse);
      console.log(dateTime);
    });
};

module.exports = { transactionToken };
