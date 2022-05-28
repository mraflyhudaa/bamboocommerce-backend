const axios = require('axios');

/* GET PROVINCE */
const getProvince = async (req, res, next) => {
  await axios
    .get('https://api.rajaongkir.com/starter/province', {
      headers: { key: process.env.RAJAONGKIR_API_KEY },
      params: { id: req.params.id },
    })
    .then((province) => {
      const { data } = province;
      console.log(data);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

/* GET ALL PROVINCE */
const getAllProvince = async (req, res, next) => {
  await axios
    .get('https://api.rajaongkir.com/starter/province', {
      headers: { key: process.env.RAJAONGKIR_API_KEY },
      params: { id: req.params.id },
    })
    .then((province) => {
      const { data } = province;
      console.log(data);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

module.exports = { getProvince, getAllProvince };
