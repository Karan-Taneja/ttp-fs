import axios from 'axios';
const iexReqs = {};

const baseUrl = 'https://cloud.iexapis.com/';

iexReqs.getStockPrice = (symbol) => {
  return axios.get(`${baseUrl}/stock/${symbol}?token=${process.env}`)
};