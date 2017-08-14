var Lumberjack = (function () {
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

    function info(args) {
        console.info(args, getBrowserInfo());
    }

    function error(args) {
        console.error(args, getBrowserInfo());
    }

    function warn(args) {
        console.warn(args, getBrowserInfo());
    }

    function log(args) {
        console.log(args, getBrowserInfo());
    }

    function logToApi() {

    }

    return {
        init: init,
        info: info,
        error: error,
        warn: warn,
        log: log
    };
})();