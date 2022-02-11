const express = require('express') ;
const router = express.Router() ;
const studentdb = require('../models/student') ;

var base64ToImage = require('base64-to-image');

var QRCode = require('qrcode')




router.get('/',(req,res)=>{
  res.render('student')
})


router.post('/',async(req,res)=>{
  
  let currentStudent = await studentdb.findOne({studentNo:req.body.studentid})
  
  let allStudent = await studentdb.find() ;
  //console.log(allStudent)
  
    
    if(currentStudent && currentStudent.password ==req.body.password) {
      
      
      
      //console.log(currentStudent._id.toString())
      
     await QRCode.toDataURL(currentStudent._id.toString(), function (err, url) {
  studentqrCode = url ;

    //console.log(url)  
     res.render('studentdashboard',{currentStudent,url}) })
    }
    
  
    else{
    res.send("student with these credentials does not exist, please locate an oic to crrate an account for you")
  
    }
  
  
  
  

  
  
  
    
})





module.exports = router ;

