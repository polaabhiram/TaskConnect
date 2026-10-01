const mongoose=require('mongoose');
const connectDatabase=async()=>{try{await mongoose.connect(process.env.MONGO_URI);console.log(`MongoDB connected: ${mongoose.connection.name}`);}catch(error){console.error('MongoDB connection failed:',error.message);process.exit(1);}};
module.exports=connectDatabase;
