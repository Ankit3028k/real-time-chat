import mongoose from "mongoose";
const dbConnect = async () => {
    try {
        if(!process.env.MONGODB_CONNECT){
            console.log("Please add MONGODB_CONNECT to your .env file");
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error.message,"Error in connecting to MongoDB");

    }
}
export default dbConnect ;  