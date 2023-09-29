const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  HTML: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
  },
  JSON: {
    '/success': jsonHandler.success,
    '/badRequest': jsonHandler.badRequest,
    '/unauthorized': jsonHandler.unauthorized,
    '/forbidden': jsonHandler.forbidden,
    '/internal': jsonHandler.internalError,
    '/notImplemented': jsonHandler.notImplemented,
    notFound: jsonHandler.notFound,
  },
  XML: {
    '/success': xmlHandler.success,
    '/badRequest': xmlHandler.badRequest,
    '/unauthorized': xmlHandler.unauthorized,
    '/forbidden': xmlHandler.forbidden,
    '/internal': xmlHandler.internalError,
    '/notImplemented': xmlHandler.notImplemented,
    notFound: xmlHandler.notFound,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  const acceptList = request.headers.accept.split(',');
  if (acceptList.includes('text/html') || acceptList.includes('text/css')) {
    if (urlStruct.HTML[parsedUrl.pathname]) {
      return urlStruct.HTML[parsedUrl.pathname](request, response);
    }
    return urlStruct.JSON.notFound(request, response);
  }
  if (acceptList.includes('application/json')) {
    if (urlStruct.JSON[parsedUrl.pathname]) {
      return params
        ? urlStruct.JSON[parsedUrl.pathname](request, response, params)
        : urlStruct.JSON[parsedUrl.pathname](request, response);
    }
    return urlStruct.JSON.notFound(request, response);
  }
  if (acceptList.includes('application/xml')) {
    if (urlStruct.XML[parsedUrl.pathname]) {
      return params
        ? urlStruct.XML[parsedUrl.pathname](request, response, params)
        : urlStruct.XML[parsedUrl.pathname](request, response);
    }
    return urlStruct.XML.notFound(request, response);
  }

  return urlStruct.JSON.notFound(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
