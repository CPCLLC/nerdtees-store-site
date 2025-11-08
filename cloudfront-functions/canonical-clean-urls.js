function handler(event) {
  var req = event.request;
  var host = req.headers.host.value;

  // Canonical host (force apex)
  if (host === 'www.nerdtees.store') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://nerdtees.store' + req.uri + (req.querystring ? '?' + req.querystring : '') } }
    };
  }

  // Clean URLs: append /index.html for naked paths and folder paths
  var uri = req.uri;
  if (uri.endsWith('/')) {
    req.uri += 'index.html';
  } else if (!uri.includes('.') ) {
    req.uri += '/index.html';
  }

  return req;
}
