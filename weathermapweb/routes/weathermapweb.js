var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var proxy_host = process.env.HTTP_PROXY_HOST || 'service-edge.default.svc.cluster.local';
    var proxy_port = process.env.HTTP_PROXY_PORT || '13080'; // 13092

    console.log(proxy_host + ':' + proxy_port);
    console.log(req.query.city + ", " + req.query.type);
    var opt = {
        host: proxy_host,
        port: proxy_port,
        method: 'GET',
        path: '/rest/fusionweather/show?city=' + req.query.city,
        headers: {}
    };
    if (req.query.user) {
        opt.path = opt.path + "&user=" + req.query.user;
    }
    console.log(opt.path);
    var body = '';
    var request = http.request(opt, function (response) {
        console.log("Got response: " + response.statusCode);
        response.on('data', function (d) {
            body += d;
        }).on('end', function () {
            console.log(body);
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf8'});
            res.write(body);
            res.end();
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
    request.end();
});

module.exports = router;
