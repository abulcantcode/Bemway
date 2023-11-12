import express from "express";
import { pool } from "./db";
// import cors from "cors";

const port = 8080;

const app = express();
app.use(express.json());
// app.use(cors());
//routes
app.get("/", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM schools");
    res.status(200).send(data.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/", async (req, res) => {
  const { name, location } = req.body;
  try {
    await pool.query("INSERT INTO schools (name, address) VALUES ($1, $2)", [
      name,
      location,
    ]);
    res.status(200).send({ message: "Successfully added child" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
