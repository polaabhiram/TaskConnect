const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  job:{type:mongoose.Schema.Types.ObjectId,ref:'Job',required:true},
  worker:{type:mongoose.Schema.Types.ObjectId,ref:'Worker',required:true},
  status:{type:String,enum:['pending','accepted','rejected'],default:'pending'}
},{timestamps:true});
schema.index({job:1,worker:1},{unique:true}); schema.index({worker:1}); schema.index({job:1}); schema.index({status:1});
module.exports=mongoose.model('Application',schema);
