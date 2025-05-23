// index.js
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { readFileSync } from "fs";
import { createServer } from "https";
import os from 'os';

const app = express();
const httpsServer = createServer({
    key: readFileSync('./ssl/key.pem'),
    cert: readFileSync('./ssl/cert.pem')
}, app);
const io = new Server(httpsServer);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use('/aframe', express.static(join(__dirname, 'aframe')));
app.use('/assets', express.static(join(__dirname, 'assets')));
app.use('/config', express.static(join(__dirname, 'config')));

// Servir Service Worker
app.get('/sw.js', (req, res) => {
  res.sendFile(join(__dirname, 'sw.js'), (err) => {
    if (err) {
        console.error("Error sending sw.js:", err.message);
        if (!res.headersSent) {
            res.status(err.status || 500).end();
        }
    }
  });
});

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

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            const {address, family, internal} = iface;
            if (family === 'IPv4' && !internal) {
                if (address.startsWith('192.168.') || address.startsWith('10.') || address.startsWith('172.')) {
                    if (address.startsWith('172.')) {
                        const secondOctet = parseInt(address.split('.')[1], 10);
                        if (secondOctet >= 16 && secondOctet <= 31) return address;
                    } else {
                        return address;
                    }
                }
            }
        }
    }
    for (const name of Object.keys(interfaces)) { // Fallback menos específico
        for (const iface of interfaces[name]) {
            const {address, family, internal} = iface;
            if (family === 'IPv4' && !internal) return address;
        }
    }
    return null;
}

httpsServer.listen(port, '0.0.0.0', () => {
  console.log(`SisSolXR Server Ready`);
  console.log(`  - On this machine: https://localhost:${port}`);
  const localIp = getLocalIpAddress();
  if (localIp) {
    console.log(`  - On Quest (LAN):  https://${localIp}:${port}`);
  } else {
    console.log(`  - LAN IP not auto-detected. Check network settings for Quest access.`);
  }
});