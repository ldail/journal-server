const express = require('express');
const router = express.Router();
const fs = require('fs');

router
  .get('/entries', (req, res) => {
    console.log('endpoint hit');
    fs.readdir('./entries', (err, files) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot get files');
      }
      console.log(files);
      return res.status(200).send(files);
    });
  })
  .get('/entries/:entryId', (req, res) => {
    console.log('get entryId hit', req.params.entryId);
    fs.readFile(`./entries/${req.params.entryId}`, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot get file');
      }
      const newBuf = data.toString();
      return res.json(newBuf);
    });
  })
  .post('/entries', (req, res) => {
    console.log('post endpoint hit');
    const {title, entryText} = req.body;
    fs.writeFile(`./entries/${title}`, entryText, (err) => {
      if (err) {
        return res.status(500).send('Could not post');
      }
      return res.status(200).json('ok');
    });
  })
  .put('/entries/:entryId', (req, res) => {
    console.log(req.body);
    console.log('put endpoint hit');
    const {entryText} = req.body;
    const {entryId} = req.params;
    console.log(entryText, entryId);
    fs.writeFile(`./entries/${entryId}.txt`, entryText, (err) => {
      if (err) {
        return res.status(500).send('Could not post');
      }
      return res.status(200).json('ok');
    });
  });

module.exports = router;