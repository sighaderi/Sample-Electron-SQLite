const electron = require("electron");
const path = require("path");
const url = require("url");
const sqlite3 = require("sqlite3").verbose();

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Create a new database connection
// const db = new sqlite3.Database(":memory:");

// Open a database file
const db = new sqlite3.Database(path.join(__dirname, "mydb.sqlite"));

// Create a new window when the app is ready
app.on("ready", function () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Load the HTML file
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // Open the DevTools
  mainWindow.webContents.openDevTools();

  // Create a table in the database
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)"
  );

  // Insert some data into the table
  db.run("INSERT INTO users (name) VALUES (?)", "John Doe");

  // Query the database and send the results to the renderer process
  db.all("SELECT * FROM users", function (err, rows) {
    mainWindow.webContents.send("rows", rows);
  });
});

// Quit the app when all windows are closed
app.on("window-all-closed", function () {
  app.quit();
});
