import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { inngestHandler } from "./inngest/handler.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      (origin && origin.endsWith(".vercel.app"))
    ) {
      return callback(null, true);
    }

    return callback(null, false); // safer
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/inngest", inngestHandler);

app.get("/", (req, res) => {
  res.send("ResQFood backend is live");
});

app.use((req, res, next) => {
 const err = new Error(`Can't find ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

export default app;