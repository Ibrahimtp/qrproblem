const express = require('express') ;
const router = express.Router() ;
const studentdb = require('../models/student') ;
const admindb = require('../models/admin') ;
const eventdb = require('../models/event') ;
const multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({
  storage: storage
})





router.get('/',(req,res)=>{
  res.render('admin')
})

router.post('/',async(req,res)=>{
  let incoming = await admindb.findOne({idNo:req.body.adminid})  ;
 // let incomings = await admindb.find()  ;
  
  
  if(req.body.adminid ==="administheid" && req.body.password==="administhepassword") {
    
      res.render('adminDashborad')
  }
  
 

  else if (incoming && incoming.password == req.body.password) {
    
    let currentAdmin = await admindb.findOne({idNo:req.body.adminid})
    
    if(currentAdmin.adminType == "eao") {
      res.render('eaodashboard',{adminType:"EAO DASHBOARD",currentAdmin})
    }
    
    
     if (currentAdmin.adminType == "oic") {
      res.render('oicdashboard',{adminType:"OIC DASHBOARD",currentAdmin})
    }
    
    
    
  /*  else if (currentAdmin.type == "account maker") {
      
    }*/
    
    
    
  }
  
  
  else {
    res.send("the admin info entered does not exist or are incorrect")
  }
  
  

})

router.post('/create/:entity',upload.single('scannedimage'),async(req,res)=>{
  
  if(req.params.entity =='student') {
    
    newStudent = new studentdb({studentNo:req.body.studentno,
  email:req.body.email,
  surname:req.body.surname,
  contactNo:req.body.contactno,
  firstName:req.body.firstname,
  address:req.body.address,
  middleName:req.body.middlename,
  username:req.body.username,
  course:req.body.course,
  password:req.body.password,
  emergencyName:req.body.emername,
  emergencyNumber:req.body.emerno})

    await newStudent.save().then(()=>{
      res.send("Please ask the student to login with the following detail" + '<br>'+"Student Id:"+req.body.studentno + "<br>"+"password:"+req.body.password)
    }).catch((err)=>{
      res.send(err + " "+ "please try again later")
    })
    
  }
  
  else if(req.params.entity =="event") {
    let noOfStu ;
    if(req.body.eventnoofstudent == ""|" ") {
      noOfStu = "Unlimited Number of Student"
    } else {
      noOfStu = req.body.eventnoofstudent
    }
    
    
    
    newEvent = new eventdb({
    eventName:req.body.eventname,
    eventHours:req.body.eventhours,
    eventNoOfStudent:noOfStu,
    eventStartDate:req.body.eventstartdate,
    eventEndDate:req.body.eventenddate,
    eventVenue:req.body.venue,
    dateAndTime: req.body.dateandtime,
    scannedImage : removePublic(req.file.path)
      
    }) ;
    
    await newEvent.save().then(()=>{res.send("event was created succesfully")}).catch((e)=>{res.send("try again" + e)})
    
    
    
    
  }
  
  
  
  else if (req.params.entity ==="eao") {
    
    newAdmin = new admindb({
    idNo:req.body.idnumber,
  email:req.body.email,
  surname:req.body.Surname,
  contactNo:req.body.contactnumber,
  firstName:req.body.firstname,
  middleName:req.body.middlename,
  username:req.body.username,
  departmentCode:req.body.departmentcode,
  departmen:req.body.department,
  password:req.body.password,
  adminType:"eao"})
  
  await newAdmin.save().then(()=>{
    res.send(`ask the EAO to login with the follwoing: <br> adminid:${req.body.idnumber} <br> password:${req.body.password}`)
  }).catch((e)=>{res.send(e + "please try again. An err occured")})
  
  
    
    
  }
  
  else if (req.params.entity ==="oic") {
    
    newAdmin = new admindb({
    idNo:req.body.idnumber,
  email:req.body.email,
  surname:req.body.Surname,
  contactNo:req.body.contactnumber,
  firstName:req.body.firstname,
  middleName:req.body.middlename,
  username:req.body.username,
  departmentCode:req.body.departmentcode,
  departmen:req.body.department,
  password:req.body.password,
  adminType:"oic"})
  
  await newAdmin.save().then(()=>{
    res.send(`ask the oic to login with the follwoing: <br> adminid:${req.body.idnumber} <br> password:${req.body.password}`)
  }).catch((e)=>{res.send(e + "please try again. An err occured")})
  
  
    
    
  }
  
  
  
  
  
  
})

function removePublic(string) {
  return string.slice(7)
}




module.exports = router



