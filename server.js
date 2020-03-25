const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const router = require("./src/routes/index");
const cors = require("cors");
const nocache = require("nocache");
require("dotenv").config();

app.use(cors({ credentials: true, origin: true }));
app.use("/public", express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", router);
app.use(nocache());

app.listen(process.env.SERVER_PORT, () => {
	console.log(`\n Server is running on port ${process.env.SERVER_PORT} ...\n`);
});
