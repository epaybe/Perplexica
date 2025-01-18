// main.ts
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { spawn } from 'child_process';

let mainWindow: BrowserWindow | null = null;
let nextProcess: any;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        title: 'Perplexica'
    });

    // Wait for Next.js server to be ready
    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startNextServer() {
    // Start the Next.js server
    nextProcess = spawn('npm', ['run', 'start'], {
        cwd: path.join(__dirname, '../ui'),
        stdio: 'inherit'
    });
}

app.whenReady().then(() => {
    startNextServer();
    
    // Give Next.js server time to start
    setTimeout(createWindow, 2000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (nextProcess) {
        nextProcess.kill();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});