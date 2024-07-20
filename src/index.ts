import express, { Application, Request, Response } from "express";
import storyRouter from "./routes/get-story";
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Add this line to enable JSON parsing in the request body

// Add the router to the app
app.use("/api", storyRouter);

app.get("/", (req: Request, res: Response) => {
  // Send a JSON response with a message
  res.json({ message: "Hello, World!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
