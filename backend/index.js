import express from 'express';
const app = express();
import { connectdb } from './Models/db.js'
import dotenv from 'dotenv'
import AuthRouter from './Routes/AuthRouter.js'
import cors from 'cors'
import { Booking } from './Models/User.js'

dotenv.config()
const PORT = process.env.PORT;
const mongo_url = process.env.MONGO_CONN;
app.use(cors())

app.get("/ping", (req, res) => {
    res.send({
        name: "harish dayma",
        village: "dantiya",


    })
})
app.use(express.json())
// app.use(bodyParser.json());
app.use("/auth", AuthRouter);

app.listen(PORT, async () => {
    console.log(`server is running on http://localhost:${PORT}`);
    await connectdb(mongo_url)
})
// const bookings = await Booking.find({
//     staffName: "naresh kekad "
// })
// console.log(bookings);