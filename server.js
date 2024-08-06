const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/recipe-finder-app"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/recipe-finder-app/index.html"));
});

app.listen(process.env.PORT || 8080);
// Start json-server
exec("json-server --watch db.json", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running json-server: ${error}`);
    return;
  }
  console.log(`json-server is running: ${stdout}`);
});
