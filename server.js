var restify = require('restify');
var fs = require('fs');
var moment = require('moment');

var logPath = './logs/'
var logName = 'lumberjack.json';

function getFileName() {
    var dateStr = moment().format('YYYYMMDD');
    var logNameParts = logName.split('.');
    return logNameParts[0] + '-' + dateStr + '.' + logNameParts[1];
}

function getFullLogPath() {
    var fileName = getFileName();
    return logPath + fileName;
}

function writeFile(filePath, logs) {
    var data = logs || '[]';
    fs.writeFile(filePath, data, 'utf8', function () {
        console.log('file created at: ' + filePath);
    });
}

function processLogs(logData) {
    var filePath = getFullLogPath();

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            //Else file probably doesn't exist, create it
            writeFile(filePath);
            processLogs(logData); //TODO: THIS NEEDS TO BE FIXED
        }
        else {
            var logs = JSON.parse(data);
            logs.push(logData);
            writeFile(filePath, JSON.stringify(logs));
        }

    });
}

function Log() {

}

Log.prototype.Save = function Save() {
    processLogs(this);
}


function createLog(data) {
    var log = new Log();
    log.dateCreated = new Date();
    log.type = data.type;
    log.message = data.message;
    log.browser = data.browser;

    log.Save();
}

var server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.post('/logs', function (req, res, next) {
    createLog(req.body);
    return next();
}, function () {
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});