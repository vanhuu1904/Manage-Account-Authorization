import express from "express";
import initWebRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import initApiRoutes from "./routes/api";
import configCors from "./config/cors";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createJWT, verifyToken } from "./middleware/JWTAction";
const app = express();
const PORT = process.env.PORT || 8000;

// Config CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
configCors(app);

// config view engine
configViewEngine(app);

// config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config cookie parser
app.use(cookieParser());
// test connection db
// connection();

// init web routes
initApiRoutes(app);

app.use((req, res) => {
  return res.send("404 not found");
});
app.listen(PORT, () => {
  console.log(">>> JWT backend is running on the port = ", +PORT);
});
