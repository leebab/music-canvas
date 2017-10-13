var express = require('express');
var router = express.Router();

var path=require('path')
var media = path.join(__dirname,'../public/media')
/* GET home page. */
router.get('/', function(req, res, next) {
  var fs = require('fs')
  fs.readdir(media,function(err,names){//读取目录里面的文件名
    if(err){
      console.log(err)
    }else{
      res.render('index', { title: 'Express' ,music:names});
    }
  });
  
});

module.exports = router;
