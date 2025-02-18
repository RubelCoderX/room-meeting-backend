import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import notFound from "./app/mddleware/notFound";
import globalErrorHandler from "./app/mddleware/globalErrorHandler";
import router from "./app/routes";

const app: Application = express();

app.use(
  cors({
    origin: [],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers 👋!!!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
