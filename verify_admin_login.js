const http = require('http');
const data = JSON.stringify({ email: 'karrivishalreddy6@gmail.com', password: 'amaze' });
const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/admin/create-admin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log('BODY', body); });
});
req.on('error', (e) => { console.error('ERROR', e.message); });
req.write(data);
req.end();
