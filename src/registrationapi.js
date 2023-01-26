const registrationInputs = require('./index.js')
const http = require('http');
const querystring = require('querystring');

let registrationInputs = [];

function sendDataToPHPAPI(data) {
    let options = {
        hostname: 'https://3715-41-90-228-226.eu.ngrok.io/',
        port: 80,
        path: '/register.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(querystring.stringify(data))
        }
    };

    let req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log("successfull");
    } else {
        console.log("error");
    }
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`Response: ${chunk}`);
        });
    });
    

    req.on('error', (e) => {
        console.error(`Error: ${e.message}`);
    });

    req.write(querystring.stringify(data));
    req.end();
}

// Example of how to use the function
registerInputs.push({ name: 'John Doe', email: 'johndoe@example.com', password: 'password123' });
sendDataToPHPAPI(registerInputs[0]);

