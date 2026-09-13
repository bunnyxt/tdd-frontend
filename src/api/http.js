// A small fetch-based request layer.
//
// It keeps the response and error shape the components rely on:
// - resolves with { data, status, statusText, headers } for 2xx responses,
//   where headers is a plain object with lower-case keys;
// - rejects with an Error carrying `response` for non-2xx responses, or
//   `request` when no response was received.

const baseURL = 'https://api.bunnyxt.com/tdd/v2/';

const buildURL = function (url, params) {
  let fullURL = /^https?:\/\//i.test(url)
    ? url
    : baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '');
  if (params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(function (key) {
      const value = params[key];
      if (value !== null && value !== undefined) {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    if (query) {
      fullURL += (fullURL.indexOf('?') === -1 ? '?' : '&') + query;
    }
  }
  return fullURL;
};

const parseBody = function (text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

const request = function (config) {
  const method = (config.method || 'get').toUpperCase();
  const url = buildURL(config.url, config.params);
  const headers = Object.assign({ 'Accept': 'application/json, text/plain, */*' }, config.headers);
  const init = {
    method,
    headers,
    credentials: config.credentials || 'include',
  };
  if (config.data !== undefined) {
    init.body = JSON.stringify(config.data);
    if (!Object.keys(headers).some(name => name.toLowerCase() === 'content-type')) {
      headers['Content-Type'] = 'application/json';
    }
  }

  return fetch(url, init)
    .catch(function (cause) {
      const error = new Error('Network Error');
      error.request = { method, url };
      error.cause = cause;
      throw error;
    })
    .then(function (res) {
      return res.text().then(function (text) {
        const responseHeaders = {};
        res.headers.forEach(function (value, name) {
          responseHeaders[name.toLowerCase()] = value;
        });
        const response = {
          data: parseBody(text),
          status: res.status,
          statusText: res.statusText,
          headers: responseHeaders,
        };
        if (!res.ok) {
          const error = new Error('Request failed with status code ' + res.status);
          error.request = { method, url };
          error.response = response;
          throw error;
        }
        return response;
      });
    });
};

const http = {
  request,
  get: function (url, config) {
    return request(Object.assign({}, config, { method: 'get', url }));
  },
  post: function (url, data, config) {
    return request(Object.assign({}, config, { method: 'post', url, data }));
  },
  delete: function (url, config) {
    return request(Object.assign({}, config, { method: 'delete', url }));
  },
};

export default http;
