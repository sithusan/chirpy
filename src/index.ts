import express, { NextFunction, Request, Response } from "express";

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

const handlerReadindess = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200);
  res.send("OK");
};

app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadindess);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
