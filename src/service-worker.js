require('./lib/ServiceWorkerWare.js')

import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

const data = [{ id: 1 }, { id: 2 }, { id: 3 }]
// Determine the root for the routes. I.e, if the Service Worker URL is
// `http://example.com/path/to/sw.js`, then the root is
// `http://example.com/path/to/`
var root = (function () {
  var tokens = (self.location + '').split('/');
  tokens[tokens.length - 1] = '';
  return tokens.join('/');
})();


// By using Mozilla's ServiceWorkerWare we can quickly setup some routes
// for a _virtual server_. Compare this code with the one from the
// [server side in the API analytics recipe](/api-analytics_server_doc.html).
var worker = new ServiceWorkerWare();

// Returns an array with all quotations.
worker.get(root + 'api/quotations', function (req, res) {
  return new Response(JSON.stringify(data));
});

worker.get(root + 'api/quotations/:id', function (req, res) {
  const reqId = parseInt(req.url.split('/').slice(-1)[0]);
  return new Response(JSON.stringify(data.find(({ id }) => id === reqId)))
});

// Delete a quote specified by id. The id is the position in the collection
// of quotations (the position is 1 based instead of 0).
worker.delete(root + 'api/quotations/:id', function (req, res) {
  return new Response({ status: 204 });
});

// Add a new quote to the collection.
worker.post(root + 'api/quotations', function (req, res) {
  return req.json().then(function (quote) {
    return new Response(JSON.stringify(quote), { status: 201 });
  });
});

// Start the service worker.
worker.init();