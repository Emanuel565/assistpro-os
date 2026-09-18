const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');

let mainWindow = null;
let serverProcess = null;

const PORT = 3001;

function getDatabasePath() {
  const userDataPath = app.getPath('userData');
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }
  return path.join(userDataPath, 'assistpro.db');
}

function startBackendServer() {
  const dbPath = getDatabasePath();
  const dbUrl = `file:${dbPath}`;

  // Se o banco ainda não existir na pasta userData, copiamos o dev.db inicial
  const seedDbPath = path.join(__dirname, '..', 'backend', 'dev.db');
  if (!fs.existsSync(dbPath) && fs.existsSync(seedDbPath)) {
    try {
      fs.copyFileSync(seedDbPath, dbPath);
      console.log('Banco de dados inicial copiado para:', dbPath);
    } catch (e) {
      console.error('Falha ao copiar banco inicial:', e);
    }
  }

  const backendEntry = path.join(__dirname, '..', 'backend', 'dist', 'server.js');
  const backendDevEntry = path.join(__dirname, '..', 'backend', 'src', 'server.ts');

  const env = {
    ...process.env,
    PORT: String(PORT),
    DATABASE_URL: dbUrl,
    NODE_ENV: app.isPackaged ? 'production' : 'development'
  };

  if (fs.existsSync(backendEntry)) {
    serverProcess = fork(backendEntry, [], {
      env,
      silent: true,
      windowsHide: true
    });
  } else {
    // Modo dev
    console.log('Servidor backend em desenvolvimento...');
  }

  if (serverProcess) {
    serverProcess.stdout?.on('data', (data) => {
      console.log(`[Backend] ${data}`);
    });
    serverProcess.stderr?.on('data', (data) => {
      console.error(`[Backend Error] ${data}`);
    });
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: 'AssistPro OS - Sistema de Gestão para Assistência Técnica',
    icon: path.join(__dirname, '..', 'frontend', 'public', 'icon.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    show: false
  });

  mainWindow.maximize();
  mainWindow.show();

  const appUrl = app.isPackaged 
    ? `http://localhost:${PORT}` 
    : 'http://localhost:5173';

  // Esperar o servidor responder ou carregar direto com retentativas
  const loadWithRetry = (retries = 15) => {
    mainWindow.loadURL(appUrl).catch((err) => {
      if (retries > 0) {
        setTimeout(() => loadWithRetry(retries - 1), 1000);
      } else {
        console.error('Erro ao carregar URL do aplicativo:', err);
      }
    });
  };

  loadWithRetry();

  // Abrir links externos no navegador padrão do usuário
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('wa.me')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackendServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
