var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var path       = require('path');
var XLSX       = require('xlsx');
var multer     = require('multer');
var userModel=require('./models/userModel')
var each = require('async-each-series');
var async=require('async')

  //connecting to database
  mongoose.connect('mongodb+srv://Ntree:12345@cluster0.flyhtb8.mongodb.net/posts?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true})
  .then(()=>{console.log('connected to db')})
  .catch((error)=>{console.log('error',error)});

  //multer
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
  var upload = multer({ storage: storage });

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//static folder path
app.use(express.static(path.resolve(__dirname,'public')));

app.get('/',(req,res)=>{
   userModel.find((err,data)=>{
       if(err){
           console.log(err)
       }else{
           if(data!=''){
               res.render('home',{result:data});
           }else{
               res.render('home',{result:{}});
           }
       }
   });
});

app.post('/',upload.single('excel'),(req,res)=>{
  var workbook =  XLSX.readFile(req.file.path);
  var sheet_namelist = workbook.SheetNames;
  var x=0;
  sheet_namelist.forEach(element => {
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
    each(xlData,function(data,next){
        setTimeout(function () {
            userModel.find({email:data.email})
            .then(res=>{
                    console.log(res);
                    if(res.length==0)
                    {
                      userModel.create(data);
                    } 
                })
            console.log('Hello');
            next();
          },1000);
      })
      x++;
  });
  res.redirect('/');
});

//assign port
var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at '+port));

