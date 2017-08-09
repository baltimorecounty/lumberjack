var restify = require('restify');
var fs = require('fs');
var moment = require('moment');

var logPath = './logs/'
var logName = 'lumberjack.json';


function writeFile() {

}

function getFileName() {
    var date = moment().format('yyyymmdd');
    return logName.split('.').splice(1, 0, date);
}

function getFullLogPath() {
    var fileName = getFileName();
    return logPath + fileName;
}

function createFile(filePath) {
    fs.writeFile(filePath, null, 'utf8', function () {
        console.log('file created at: ' + filePath);
    });
}

function processFile(log) {
    var filePath = getFullLogPath();

    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            //Else file probably doesn't exist, create it
            createFile(filePath);
        }
        else {
            //Process the fiel
        }

    });
}

function readFile() {
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.table.push({ id: 2, square: 3 }); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
        }
    });
}


function Log() {

}

Log.prototype.Save = function Save() {
    processFile(this);
}


function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
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
server.use(restify.bodyParser());

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.post('/logs', function createLog(req, res, next) {
    createLog({
        type: 'error',
        message: 'test',
        browser: 'chrome'
    });
}, function () {

});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});