import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import "./database";
const init = () => {
  app.listen(app.get("port"));
  console.log(`Server started on port ${app.get("port")}`);
};

init();
