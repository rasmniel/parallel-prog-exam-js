// Initialize the test server with express.
const express = require('express');
const ejs = require('ejs').renderFile;
const app = express();

// Set default paths for views and public folder.
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs);
app.use(express.static(path.join(__dirname, 'public')));

// Set index route.
app.use('/', function (req, res, next) {
    res.render('index.html');
});

// Run the express server which listens on the environment port.
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port: ' + port + '\n');
});
