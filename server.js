const express = require("express");
const cors = require("cors");

const { userRoutes } = require("./routes/users");
const { chatRoutes } = require("./routes/chats");
const { authRoutes } = require("./routes/auth");
const { responseType } = require("./routes/utils");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
app.use("/chats", chatRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  responseType.sendUnauthorized(res);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
