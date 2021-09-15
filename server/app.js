const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
dotenv.config();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("DATABASE CONNECTED");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

//express server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
