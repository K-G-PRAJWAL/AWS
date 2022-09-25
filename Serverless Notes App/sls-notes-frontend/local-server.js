var express = require('express');
var app = express();
const port = process.env.PORT || 4000;

app.use(express.static('public'));
app.listen(port, function () {
    console.log('Server listening on port: ', port);
});
