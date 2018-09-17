const express = require('express');

const app = express();

// Add headers
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];

    let origin = req.headers.origin;
    if(allowedOrigins.includes(origin)) {   
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    return next();
});

app.use(express.json());
app.post('/', function (request, response) {
    console.log(new Date(), request.body);
    response.send('OK');
});

const PORT = 3001;
console.log('app listening on ' + PORT);
app.listen(PORT);
