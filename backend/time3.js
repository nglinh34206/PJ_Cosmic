const express = require("express");
const cors = require("cors");
const dayjs = require("dayjs");

const app = express();
app.use(cors());
app.use(express.json());

let users = {}; // fake database

app.post("/api/login", (req, res) => {
  const { username } = req.body;
  const today = dayjs().format("YYYY-MM-DD");

  if (!users[username]) {
    users[username] = {
      onlineDays: 0,
      lastOnlineDate: null
    };
  }

  if (users[username].lastOnlineDate !== today) {
    users[username].onlineDays += 1;
    users[username].lastOnlineDate = today;
  }

  res.json({
    onlineDays: users[username].onlineDays
  });
});

app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});
