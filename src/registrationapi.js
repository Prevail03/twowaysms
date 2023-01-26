const http = require('http');
const querystring = require('querystring');



let registerInputs = [];

const  sendDataToPHPAPI = (data) => {
    let options = {
        hostname: 'https://206c-41-90-228-226.eu.ngrok.io',
        port: 80,
        path: 'C:/xampp/htdocs/Octagon/projects/TestAPI/registeration.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(querystring.stringify(data))
        }
    };

    let req = http.request(options, (res) => {
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

module.exports = sendDataToPHPAPI;