const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const purchaseRoutes = require('./routes/purchase');
const youtuberRoutes = require('./routes/youtuber');
const paypalWebhookRoutes = require('./routes/paypalWebhookRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/purchase', purchaseRoutes);
app.use('/youtuber',youtuberRoutes);
app.use('/webhook/paypal', paypalWebhookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
