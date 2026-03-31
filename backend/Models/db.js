import mongoose from "mongoose";
export const connectdb = async (mongo_url) => {
    await mongoose.connect(mongo_url)
        .then(() => {
            console.log("mongodb connected")
        })
        .catch((err) => {
            console.log("mongodb is not connected ", err)
        })
}