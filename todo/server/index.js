import express from 'express';
import router from './routes.js'; // Import the router module

const app = express();
app.use("/api", router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});