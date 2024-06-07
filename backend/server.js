const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
