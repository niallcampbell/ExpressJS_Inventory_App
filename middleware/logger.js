/*
    Logger middleware for Express web server. 
    Logs all requests to the web server to the console. 
*/

const moment = require('moment'); //module for handling time and date
const timeAndDate = moment();

const logger = (req, res, next) => {
    
    console.log(`Request: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(`Date & Time of Request: ${timeAndDate.format()}`);
    next();
    
};

module.exports = logger;