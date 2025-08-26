import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { BadRequestError } from "./errors/BadRequestError.js";
import { ForbiddenError } from "./errors/ForbiddenError.js";
import { NotFoundError } from "./errors/NotFoundError.js";
import { UnauthorizedError } from "./errors/UnauthorizedError.js";
import { migrate } from "./db/migrate.js";
import { handlerCreateUser } from "./handlers/handlerCreateUser.js";
import { handlerCreateChrip } from "./handlers/handerCreateChrip.js";
import { truncateUsers } from "./db/queries/users.js";

migrate();

const app = express();
const PORT = config.api.port;

const resposeError = (status: number, message: string, res: Response) => {
  res.status(status);
  res.json({
    error: message,
  });
};

const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    if (res.statusCode >= 200) {
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
  config.api.fileServerHits++;
  next();
};

const handlerReadindess = async (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200);
  res.send("OK");
};

const handlerMetrics = async (req: Request, res: Response) => {
  res.status(200);
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
      </body>
    </html>
  `);
};

const handlerReset = async (req: Request, res: Response) => {
  config.api.fileServerHits = 0;
  await truncateUsers();

  res.status(200);
  res.send();
};

const errorHander = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.message);

  // Can be done with polymorphism.
  if (err instanceof BadRequestError) {
    resposeError(400, err.message, res);
  } else if (err instanceof ForbiddenError) {
    resposeError(403, err.message, res);
  } else if (err instanceof NotFoundError) {
    resposeError(404, err.message, res);
  } else if (err instanceof UnauthorizedError) {
    resposeError(401, err.message, res);
  } else {
    resposeError(500, "500 - Internal Server Errors", res);
  }
};

app.use([middlewareLogResponses]);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res) => {
  await handlerReadindess(req, res);
});

// Admin Routes
app.get("/admin/metrics", async (req, res) => {
  await handlerMetrics(req, res);
});
app.post("/admin/reset", async (req, res) => {
  await handlerReset(req, res);
});

// chirps
app.post("/api/chirps", async (req, res) => {
  await handlerCreateChrip(req, res);
});

// users
app.post("/api/users", async (req, res) => {
  await handlerCreateUser(req, res);
});
// Error Handler Middleware needs to defined last.
// If we don't have the error handler middleware, fallback to express build in handling.
app.use(errorHander);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
