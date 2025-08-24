import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello there");
});
app.listen(3001, () => {
  console.log("http-server is listening on the port 3001");
});
