var mongoose = require('mongoose');
var url = 'mongodb://localhost/movieview';
mongoose.connect(url,{
    useUnifiedTopology: true,
    useNewUrlParser: true
});

module.exports = mongoose;