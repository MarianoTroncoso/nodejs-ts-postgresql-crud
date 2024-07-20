import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';

const app: Application = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
