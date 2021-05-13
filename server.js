const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');

const config = require('./App/Config/config');

const app = express();
server = http.createServer(app);

const apiManagement = require('./App/Route/apiManagement');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiManagement);
// app.use('/user', userManagent);

const port = process.env.PORT || config.PORT;

server.listen(port, () => console.log("app is running on port " + config.PORT));