import axios from 'axios'

axios.defaults.baseURL = 'https://api.bunnyxt.com/tdd/v2/';
// axios.defaults.baseURL = 'http://localhost:1437/';

axios.defaults.withCredentials = true;

const reportInteraction = function (action, message) {
  return axios.post('/interaction', { action, message });
}

const service = {
  reportInteraction,
}

export default service
