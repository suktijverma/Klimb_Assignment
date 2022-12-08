var mongoose  =  require('mongoose');  
   
var excelSchema = new mongoose.Schema({
    name:String,
    email:String,
    mobile:String,
    dob:Date,
    experience:String,
    resume:String,
    location:String,
    address:String,
    employer:String,
    designation:String
});


module.exports = mongoose.model('excelData',excelSchema); 