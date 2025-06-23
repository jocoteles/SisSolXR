import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

import { readFileSync } from "fs";
import { createServer } from "https";

   
const app = express();
const httpsServer = createServer({
    key: readFileSync('./ssl/key.pem'),
    cert: readFileSync('./ssl/cert.pem')
  }, app);
const io = new Server(httpsServer);

//Inclusão das pastas:
app.use('/aframe', express.static('./aframe/'));
app.use('/assets', express.static('./assets/'));
app.use('/config', express.static('./config'));

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('stagePressed', (msg) => {
      io.emit('stagePressed', msg);
    });
    socket.on('resetPressed', (msg) => {
      io.emit('resetPressed', msg);
    });
  });

const port = 8080;
httpsServer.listen(port, () => {
  console.log(`server running at https://127.0.0.1:${port} and https://10.42.0.1:${port}`);
});