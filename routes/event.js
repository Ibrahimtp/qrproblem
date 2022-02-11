const express = require('express') ;
const router = express.Router() ;
const studentdb = require('../models/student') ;
const eventAndRenderedHoursdb = require('../models/studentParticipatingAndRenderedHours') ;
const mongoose = require('mongoose') ;

const eventdb = require('../models/event') ;

var base64ToImage = require('base64-to-image');

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





router.get('/',async(req,res)=>{
  
  let events = await eventdb.find({eventStatus:true}).populate('studentParticipating').sort({created_at: 1}).populate('studentParticipating').exec()
   ;
  
  
  res.send(events)
  
})


router.get('/markAttendance/:eventid/:studentid',async(req,res)=>{
 
 
  let newStuParticipating = await studentdb.findById(req.params.studentid.replace("%20%20"," "))
  
 let eventToBeModified = await eventdb.findById(req.params.eventid.replace("%20%20"," ").trim()).populate('studentParticipating')
  
  let studentAlreadyRegistered = await eventdb.findById(req.params.eventid.trim())
  //,{studentParticipating: { $in: [req.params.studentid] }})
 let statusOfStudentAlreadyRegistered = studentAlreadyRegistered.studentParticipating.find((h)=>{return h == req.params.studentid})
  //console.log(Boolean(statusOfStudent))
 
  
//  console.log(studentAlreadyRegistered)

  if(newStuParticipating && eventToBeModified) {
    
    if(Boolean(statusOfStudentAlreadyRegistered)) {
      res.send("Student has already been marked as attending ")
    }
    

else if(eventToBeModified.studentParticipating.length == "Unlimited Number of Student" ) {
  
  let newEventAndRenHours = await new eventAndRenderedHoursdb({
    eventId:eventToBeModified._id,
    studentId:newStuParticipating._id,
  });
  
  await newEventAndRenHours.save() ;
  
  
  
  
  eventdb.findByIdAndUpdate(req.params.eventid.replace("%20%20"," ").trim(),{$push:{studentParticipating:req.params.studentid.replace("%20%20"," "),studentParticipatingAndHoursRendered:newEventAndRenHours._id}}).then(()=>res.send("the student has been succesfully added to the event as attending")).catch((e)=>{res.send("there was an error pls retry") ;  })
  
}



    else if(eventToBeModified.studentParticipating.length == eventToBeModified.eventNoOfStudent) {
      res.send("no more students are allowed to participate in this event")
    }

    else {
     // console.log(eventToBeModified)


let newEventAndRenHours = await new eventAndRenderedHoursdb({
    eventId:eventToBeModified._id,
    studentId:newStuParticipating._id,
  });
  
  await newEventAndRenHours.save() ;
  


      eventdb.findByIdAndUpdate(req.params.eventid.replace("%20%20"," ").trim(),{$push:{studentParticipating:req.params.studentid.replace("%20%20"," "),studentParticipatingAndHoursRendered:newEventAndRenHours._id}}).then(()=>res.send("the student has been succesfully added to the event as attending")).catch((e)=>{res.send("there was an error pls retry") ;  })  

    }
  } 
  
    
  
  
 
  
  
})



router.get("/unapproved",async(req,res)=>{

let allEvents = await eventdb.find({eventStatus:false}) ;
res.send(allEvents) ;

})


router.get("/approve/:evid",async(req,res)=>{
  let eventToBeModified = await eventdb.findByIdAndUpdate(req.params.evid,{eventStatus:true}).then(()=>{
    res.send("event was succesfully  approved")
  }).catch((e)=>res.send("there was an error pls retry agin"+e))
})


router.get("/delete/:evid",async(req,res)=>{
  let eventToBeModified = await eventdb.findByIdAndDelete(req.params.evid).then(()=>{
    res.send("event was succesfully  deleted")
  }).catch((e)=>res.send("there was an error pls retry agin"+e))
})



router.post("/modify/:eventid",upload.single('scannedimage'),async(req,res)=>{
  
     let noOfStu ;
    if(req.body.eventnoofstudent == ""|" ") {
      noOfStu = "Unlimited Number of Student"
    } else {
      noOfStu = req.body.eventnoofstudent
    }
    
  
  let wantsToBeModified = await eventdb.findByIdAndUpdate(req.params.eventid.trim(),{
    eventName:req.body.eventname,
    eventHours:req.body.eventhours,
    eventNoOfStudent:noOfStu,
    eventVenue:req.body.venue,
    dateAndTime: req.body.dateandtime,
    scannedImage : removePublic(req.file.path)
    
    
  })
  
  await wantsToBeModified.save().then(()=>{
    res.send("event was succesfully modified")
  }).catch((err)=>res.send(err + " there was an error"))
  
  
})







router.get("/join/:eventid/:studentid",async(req,res)=>{
 
 
 
 
  let newStuParticipatingj = await studentdb.findById(req.params.studentid.replace(/^%20/," ").trim())
  
 let eventToBeModifiedj = await eventdb.findById(req.params.eventid.replace("%20%20"," ").trim())
  
//  let studentAlreadyRegisteredj = await eventdb.findOne({listofStudentWishingToParticipate: { $in: [req.params.studentid.replace(/%20/," ").trim()] }})
  let studentAlreadyRegisteredj = await eventdb.findById(req.params.eventid.trim())
  //,{studentParticipating: { $in: [req.params.studentid] }})
 let statusOfStudentAlreadyRegistered =  studentAlreadyRegisteredj.listofStudentWishingToParticipate.find((h)=>{return h == req.params.studentid.trim()})
 
 console.log(8888888)
 //console.log(studentAlreadyRegisteredj)
 console.log(statusOfStudentAlreadyRegistered)


  if(newStuParticipatingj && eventToBeModifiedj) {
    
    if(Boolean(statusOfStudentAlreadyRegistered)) {
      res.send("You are already one of the participant for this event ")
    }
    

else if(eventToBeModifiedj.studentParticipating.length == "Unlimited Number of Student" ) {
  
  eventdb.findByIdAndUpdate(req.params.eventid.replace("%20%20"," ").trim(),{$push:{listofStudentWishingToParticipate:req.params.studentid.replace("%20"," ").trim()}}).then(()=>res.send("You are now one of the participant for the event. Make sure you present your qr code for attendance")).catch((e)=>{res.send("there was an error pls retry") ;  })
  
}



    else if(eventToBeModifiedj.studentParticipating.length == eventToBeModifiedj.eventNoOfStudent) {
      res.send("no more students are allowed to participate in this event")
    }

    else {
  //    console.log(eventToBeModified)


      eventdb.findByIdAndUpdate(req.params.eventid.replace("%20%20"," ").trim(),{$push:{listofStudentWishingToParticipate:req.params.studentid.replace("%20"," ").trim()}}).then(()=>res.send(" You are now one of the participant for the event. Make sure you present your qr code for attendance ")).catch((e)=>{res.send("there was an error pls retry"+ e) ;  })  

    }
  }  
  
    
  
  
  
  
  
  
  
})



router.get("/inputrenderedhours/:eventid/:studentid/:hours",async(req,res)=>{
  
  let modifyNewRenderedHour =  await eventAndRenderedHoursdb.findOneAndUpdate({eventId:req.params.eventid.trim(),
  studentId:req.params.studentid},{renderedHours:req.params.hours}).then(()=>res.send("rendered hours has been saved successful")).catch((err)=>{res.send("error pls try again " +err )})
  
  
    })
  
  
  
  








    router.get('/:eventid',async(req,res)=>{
  
  let events = await eventdb.findOne({_id:mongoose.Types.ObjectId(req.params.eventid)}).populate('studentParticipating').populate({path:'studentParticipatingAndHoursRendered',populate:{path:"studentId"}})
  console.log(JSON.stringify(events.studentParticipatingAndHoursRendered))
 res.send(events)
  
})
  
  
  
  

  
 function removePublic(string) {
  return string.slice(7)
}
 
  
    






module.exports = router ;
