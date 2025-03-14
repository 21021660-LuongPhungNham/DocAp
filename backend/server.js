import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectMongo from './config/mongodb.js';
import cloudinaryConnect from './config/cloudinary.js';
import adminRoutes from './routers/adminRoutes.js';

dotenv.config();

// .......kiem tra gia tri
console.log("MONGODB_URL:", process.env.DATABASE_URL);

const app = express();
const port = process.env.PORT || 4000;

// .....ket noi mongodb
connectMongo();
cloudinaryConnect();

app.use(express.json());
app.use(cors());

// 
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
    res.send('working');
});

function startServer() {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}
startServer();