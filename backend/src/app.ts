import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import classRoutes from './routes/classes';
import assessmentRoutes from './routes/assessments';
import assignmentRoutes from './routes/assignments';
import qtiRoutes from './routes/qti';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/qti', qtiRoutes);

export default app; 