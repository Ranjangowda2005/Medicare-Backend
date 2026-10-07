import express from "express";
import { connectDb } from "./config/database.js";
import registrationRouter from "./router/userRouter.js";
import adminRouter from "./router/docterRouter.js";
import serviceRouter from "./router/serviceRouter.js";
import cors from "cors";
import router from "./router/serviceRouter.js";
import { redisConnect } from "./config/redis.js";
import diseaseRouter from "./router/diseaseRouter.js";
import feedbackRouter from "./router/feedbackRouter.js";
import contactRouter from "./router/contactRouter.js";
const app = express();

const PORT = 5000;

app.use(cors()); //cross origin resourse sharing  used to share frontend to backend
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDb();

redisConnect();

app.use("/api", registrationRouter);
app.use("/api", adminRouter);
app.use("/api", serviceRouter);
app.use("/api", router);
app.use("/api", diseaseRouter);
app.use("/api/contact", contactRouter);

app.use("/api", feedbackRouter);
app.get("/registrations", (req, res) => {
  res.json("user created");
});

app.post("/appointment", (req, res) => {
  const { name, date, time, contact, description } = req.body;

  res.json({
    success: true,
    data: {
      name,
      date,
      time,
      contact,
      description,
    },
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
