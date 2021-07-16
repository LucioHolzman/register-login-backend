import mongosee from "mongoose";

mongosee
  .connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })

  .then((db) => console.log("Connected to database"))
  .catch((err) => console.log("Error connecting to database: ", err));
