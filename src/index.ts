import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );
    }
  });

  next();
};

const middlewareMetricsInc = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  config.fileserverHits++;
  next();
};

const handlerReadindess = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200);
  res.send("OK");
};

const handlerMetrics = (req: Request, res: Response) => {
  res.status(200);
  res.send(`Hits: ${config.fileserverHits}`);
};

const handlerReset = (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.status(200);
  res.send();
};

app.use([middlewareLogResponses]);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/healthz", handlerReadindess);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
