var Lumberjack = (function () {
    function lumberjack() {
        var levels = ["debug", "log", "info", "notify", "warn", "error", "fatal"];

        function getBrowserInfo() {
            return {
                "origin": window.location.origin,
                "pathname": window.location.pathname,
                "params": window.location.search,
                "hash": window.location.search,
                "language": window.navigator.language,
                "platform": window.navigator.platform,
                "userAgenct": window.navigator.userAgent,
            };
        }

        function logToConsole(level, args) {
            if (console[level] && typeof console[level] === 'function') {
                console[level](args, getBrowserInfo());
            }
            else {
                var logType = 'log';
                var logMessage = "generic log: ";

                if (level === 'fatal') {
                    logType = 'error';
                    logMessage = 'fatal error: ';
                }
                else if (level === 'notify') {
                    logType = 'info';
                    logMessage = 'notification: ';
                }

                console[logType](logMessage, args, getBrowserInfo());
            }
        }

        function logSuccessResponse(response) {
            if (isDebugModeOn) {
                console.log('Successful logging', response);
            }
        }

        function logErrorResponse(xhrObj) {
            if (isDebugModeOn) {
                console.log('Something went wrong when logging', xhrObj);
            }
        }

        function logToApi(level, args, browserData) {
            var data = JSON.stringify({
                type: level,
                message: args[0],
                otherData: args.shift(),
                browserData: browserData,
            });

            postAjax(this.apiUrl, data, logSuccessResponse, logErrorResponse);
        }

        function log(level, args) {
            if (isDebugModeOn) {
                logToConsole(level, args);
            }
        }

        function postAjax(url, data, success, error) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var json = JSON.parse(xhr.responseText);
                    success(json);
                }
                else {
                    error(xhr);
                }
            };
        }

        return function init(apiUrl, isDebugModeOn) {
            this.apiUrl = apiUrl;
            this.isDebugModeOn = !!isDebugModeOn;

            this.debug = function (args) {
                log("debug", args);
            };
            this.log = function (args) {
                log("log", args);
            };
            this.info = function (args) {
                log("info", args);
            };
            this.warn = function (args) {
                log("warn", args);
            };
            this.notify = function (args) {
                log("notify", args);
            };
            this.error = function (args) {
                log("error", args);
            };
            this.fatal = function (args) {
                log("fatal", args);
            };
        };
    }

    return lumberjack;
})();