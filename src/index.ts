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
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileserverHits} times!</p>
      </body>
    </html>
  `);
};

const handlerReset = (req: Request, res: Response) => {
  config.fileserverHits = 0;
  res.status(200);
  res.send();
};

const handlerValidateChrip = (req: Request, res: Response) => {
  type parameter = {
    body: string;
  };

  try {
    const params: parameter = req.body;

    if (params.body === undefined) {
      throw new Error("Something went wrong");
    }

    if (params.body.length > 140) {
      throw new Error("Chirp is too long");
    }

    res.status(200);
    res.send({
      valid: true,
    });
  } catch (err: unknown) {
    res.status(400);
    res.send({
      error: err instanceof Error ? err.message : err,
    });
  }
};

app.use([middlewareLogResponses]);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadindess);

app.post("/api/validate_chirp", handlerValidateChrip);

// Admin Routes
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
