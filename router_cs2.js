var fs = require('fs');  // file system
var http = require('http');
var server = http.createServer(function (req, res) {
  // logic here to determine what file, etc
  var rstream = fs.createReadStream('C:\Users\Abilascha\Documents\ESME\clientServer\TPNodejs_M2C_3-02\ClientServer2.txt');
  rstream.pipe(res);
  console.log(res);
});
server.listen(80, '127.0.0.1');  // start
var dataLength = 0;
// using a readStream that we created already
rstream
  .on('data', function (chunk) {
    dataLength += chunk.length;
  })
  .on('end', function () {  // done
    console.log('The length was:', dataLength);
  });