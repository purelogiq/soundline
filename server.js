var express = require('express'),
  morgan = require('morgan'),
  path = require('path'),
  https = require('https');

// This app uses the expressjs framework
app = express();
// Log requests
app.use(morgan('[:date] :method :url :status'));
// Process static files which will be found in the public subdirectory
app.use(express.static(path.join(__dirname, 'public')));
// Cross site request handler
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get('/crossrequest', function (req, res) {
  var theurl = req.query.theurl;
  https.get(theurl, function(httpresult){
    var body = '';
    httpresult.on('data', function(chunk){
      body += chunk;
    });

    httpresult.on('end', function(){
      res.send(body);
    });
  }).on('error', function(e){});
});

/*
 * This simple server will work on your laptop if you have installed
 * Nodejs, or deployed to OpenShift.  OpenShift will provide environment
 * variables indicating the IP address and PORT to use.  If those variables
 * are not available (e.g. when you are testing the application on your
 * laptop) then use default values of localhost (127.0.0.1) and
 * port 33333 (port is an arbitrary choice).
 */
ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
port = process.env.OPENSHIFT_NODEJS_PORT || 33333;

//  Start listening on the specific IP and PORT
app.listen(port, ipaddress, function() {
  console.log('%s: Simple static content server started on %s:%d ...', Date(Date.now()), ipaddress, port);
});
