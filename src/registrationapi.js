const http = require('http');

const options = {
  hostname: 'api.example.com',
  port: 80,
  path: '/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

const clientData = { name: 'John Doe', email: 'johndoe@example.com' };
req.write(JSON.stringify(clientData));
req.end();
