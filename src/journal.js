const express = require('express');
const router = express.Router();
const fs = require('fs');
const { join } = require('path');
const { v4: uuidv4 } = require('uuid');

router
  .get('/entries', (req, res) => {
    fs.readdir('./entries', (err, files) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Cannot get files');
      }
      // return each file
      const allFilesWithInfo = files.map(fileName => {
        let readFile = '';
        try {
          readFile = fs.readFileSync(`./entries/${fileName}`);
        } catch (error) {
          console.log(error);
          return res.status(500).send('Cannot get files');
        }
        const newBuf = readFile.toString();
        // const indexOfSplit = newBuf.indexOf(char => char === ',');
        // const realTitle = newBuf.slice(1, indexOfSplit);
        return [fileName, newBuf];
      });
      return res.status(200).send(allFilesWithInfo);
    });
  })
  .get('/entries/:entryId', (req, res) => {
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
    const randomFileName = uuidv4();
    fs.writeFile(`./entries/${randomFileName}`, req.body.toString(), (err) => {
      if (err) {
        console.log(err);
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