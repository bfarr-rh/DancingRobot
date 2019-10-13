
var express = require('express')
var cors = require('cors')
var app = express()


app.use(cors())
app.use('/', express.static('./'))


app.listen(8080, function () {
  console.log('CORS-enabled web server listening on port 8080')
})

app.get('/e.js', function(req, res){
  res.setHeader('content-type', 'text/javascript');
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Expires', '-1');
  res.setHeader('Pragma', 'no-cache');
  res.write('var url = "' + process.env.TERM_PROGRAM_VERSION + '";');

  res.end();

});


function nocache(req, res, next) {
  
  next();
}
