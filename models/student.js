const mongoose = require('mongoose') ;

let studentSchema = mongoose.Schema({
  studentNo:{type:String,unique:true},
  email:{type:String},
  surname:{type:String},
  contactNo:{type:Number},
  firstName:{type:String},
  address:{type:String},
  middleName:{type:String},
  username:{type:String},
  course:{type:String},
  password:{type:String},
  emergencyName:{type:String},
  emergencyNumber:{type:Number},
  joinedEvents:[{type:mongoose.Schema.Types.ObjectId,ref:"events"}],
  joinedActivities:[{type:mongoose.Schema.Types.ObjectId,ref:"activities"}]
})

module.exports = mongoose.model('student',studentSchema) ;

