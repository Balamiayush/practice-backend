const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  // Read the list of files from the directory
  fs.readdir(path.join(__dirname, "files"), (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Error reading directory");
    }
    res.render("index", { files: files });
  });
});

app.post("/create", (req, res) => {
  const title = req.body.title.split(' ').join(''); // Remove spaces in title
  const details = req.body.details;

  // Sanitize the filename to avoid problematic characters
  const fileName = title.replace(/[^a-zA-Z0-9_-]/g, "") + ".txt";

  // Create the file and save the details inside it
  fs.writeFile(path.join(__dirname, "files", fileName), details, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error creating file");
    }
    res.redirect("/");
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
