import express, { Request, Response } from "express";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

const handlerReadindess = (req: Request, res: Response) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.status(200);
  res.send("OK");
};

app.get("/healthz", handlerReadindess);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
