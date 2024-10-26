const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const route = require("./Routes/route");
const cors = require("cors");
dotenv.config();
const Port = process.env.Port;

app.use(express.json());
app.use(cors());
app.use(route);
mongoose
  .connect(
    "mongodb+srv://omojolaobaloluwa:obalolu1976@cluster0.q9yj9ht.mongodb.net/Seunstore",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("mongo DB connection established"))
  .catch((err) => {
    console.log(err.message);
  });

app.listen(Port || 5000, () => {
  console.log(`app listening on Port ${Port}`);
});
