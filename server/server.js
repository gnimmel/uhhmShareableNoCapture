
'use strict';

var path = require('path');
const fs = require('fs');
const os = require('os');
const ejs = require('ejs');

function startServer() {
  app.listen(apiPort, "::", () => {
    console.log(`API port: ${apiPort}`);
  });
}

// API Server
var apiPort = 4000;

var express = require('express');
const cors = require('cors')

const model = require('../public/model');

var videoDirPath = path.join(os.homedir(), 'Desktop', 'videos');
model.init(videoDirPath);
/*if (process.pkg)
  model.init(path.join(__dirname ,'..', 'public', 'videos'));
else
  model.init(path.join(process.cwd(), 'public', 'videos'));
*/

var app = express();
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public', 'videos')));

// PUBLIC

app.post('/add-asset-data', async (req, res) => {
  const { id, emotion, lyrics } = req.body;

  // Validate request body
  if (!id || !lyrics || !emotion) {
    return res.status(400).json({
      message: 'Request body should contain id, lyrics, emotion',
    });
  }

  console.log(`Received data - id: ${id}, emotion: ${emotion}, lyrics: ${lyrics}}`);
  model.setAssetData(id, emotion, lyrics);

  res.status(202).json({
    message: 'data added successfully', //: id: ${id}, emotion: ${emotion}, lyrics: ${lyrics}`,
    id: id
  });

  res.send();
});

app.get('/get-sketch-by-id', (req, res) => {
  var id = req.query.id;
  
  try {
    if (model.getAssetData(id)) {
      // Read the HTML file
      fs.readFile(process.pkg ? path.join(__dirname ,'..', 'public', 'shareable.html') : path.join(process.cwd(), 'public', 'shareable.html'), 'utf8', function(err, data) {
        if (err) {
          console.log("Read file failed:", err);
          res.status(500).send({ error: 'Internal server error' });
          return;
        }

        // Render the HTML file as an EJS template, passing the id as a parameter
        var html = ejs.render(data, { id: id, serverIp: model.getHostIP() });

        // Send the rendered HTML
        res.send(html);
      });
    } else {
      res.status(404).send({ error: 'No data found for this id' });
    }
  } catch (error) {
    console.log("Fetch asset data failed:", error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/get-sketch', async (req, res) => {
  const { id, emotion, lyrics } = req.body;

  // Validate request body
  if (!id || !lyrics || !emotion) {
    return res.status(400).json({
      message: 'Request body should contain id, lyrics, emotion',
    });
  }

  console.log(`Received data - id: ${id}, emotion: ${emotion}, lyrics: ${lyrics}}`);
  model.setAssetData(id, emotion, lyrics);

  // Read the HTML file
  fs.readFile(process.pkg ? path.join(__dirname ,'..', 'public', 'shareable.html') : path.join(process.cwd(), 'public', 'shareable.html'), 'utf8', function(err, data) {
    if (err) {
      console.log("Read file failed:", err);
      res.status(500).send({ error: 'Internal server error' });
      return;
    }

    // Render the HTML file as an EJS template, passing the id as a parameter
    var html = ejs.render(data, { id: id, serverIp: model.getHostIP() });

    // Send the rendered HTML
    res.send(html);
  });
});


// INTERNAL

app.get('/assetdata/:id', (req, res) => {
  const id = req.params.id;
  //console.log("app.get /assetdata/id:" + id);

  if (model.getAssetData(id)) {
      res.json(model.getAssetData(id));
  } else {
      res.status(404).send({ error: 'No data found for this id' });
  }
});

  //process.pkg ? path.join(__dirname ,'..', 'public', 'shareable.html') : path.join(process.cwd(), 'public', 'shareable.html'), 'utf8', function(err, data)

/*app.get('/videos/:filename', function(req, res) {
  try {
    var filename = req.params.filename;
    var videoPath = path.resolve(__dirname, 'videos', filename);
    
    console.log("videoPath from get request: " + videoPath);

    // Check if file exists before sending
    fs.access(videoPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`File ${videoPath} does not exist`);
        res.status(404).send({ error: 'File not found' });
      } else {
        console.log("sending video");
        res.sendFile(videoPath);
      }
    });
  } catch (error) {
    console.log("An error occurred:", error);
    res.status(500).send({ error: 'Internal server error' });
  }
});*/

app.get('/videos/:filename', function(req, res) {
  try {
    var filename = req.params.filename;
    //var videoPath = path.resolve(__dirname, 'videos', filename);
    var videoDirPath = path.join(os.homedir(), 'Desktop', 'videos');
    var videoPath = path.resolve(videoDirPath, filename);
    
    //console.log("videoPath from get request: " + videoPath);

    // Check if file exists before sending
    fs.access(videoPath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`File ${videoPath} does not exist`);
        res.status(404).send({ error: 'File not found' });
      } else {
        //console.log("sending video");
        res.sendFile(videoPath);
      }
    });
  } catch (error) {
    console.log("An error occurred:", error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

startServer();






