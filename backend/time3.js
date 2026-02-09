const express = require("express");
const cors = require("cors");
const dayjs = require("dayjs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

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

// download tài liệu
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "files", req.params.filename);

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send("File không tồn tại");
    }
  });
});
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
