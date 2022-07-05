var midtransClient = require('midtrans-client');

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

module.exports = { transactionToken };
