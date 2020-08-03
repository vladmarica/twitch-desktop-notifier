import path from 'path';
import os from 'os';
import { app, BrowserWindow, Menu, Tray, nativeImage, ipcMain } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import TwitchAuthentication from './twitch/authentication';
import { REDIRECT_URL } from './twitch/constants';
import UserData, { SessionData } from './user-data';
import { exit } from 'process';

const TITLE = 'Twitch Desktop Notifier';
const GTK_ICON_NAME = 'twitch-indicator';
const RES_PATH = '../../res';

function getResourcePath(resourceName: string) {
  return path.join(__dirname, RES_PATH, path.normalize(resourceName));
}

async function getProgramIcon(): Promise<nativeImage> {
  // On Linux, try to use the 'twitch-indicator' GTK icon if available
  if (os.platform() === 'linux') {
    const LinuxIconProvider = require('./util/linux/icons');
    const icon = await (LinuxIconProvider.getGtkIcon(GTK_ICON_NAME) as Promise<nativeImage | null>);
    if (icon !== null) {
      return icon;
    }
  }

  return nativeImage.createFromPath(getResourcePath('icon.png'));
}

let tray = null;
let window: BrowserWindow | null = null;

app.on('ready', async () => {
  const icon = await getProgramIcon();

  tray = new Tray(icon);
  tray.setToolTip(TITLE);
  tray.setTitle(TITLE);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: TITLE, type: 'normal', enabled: false },
    { label: 'Open', type: 'normal', click: () => console.log('open') },
    { label: 'Exit', type: 'normal', click: () => app.exit() }
  ]));

  window = new BrowserWindow({
    width: 650,
    height: 820,
    title: TITLE,
    icon: icon,
    show: false,
    backgroundColor: '#2D3748',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  await UserData.validateUserDataFolder();

  window.once('ready-to-show', () => { window!.show() });

  let userSessionData: SessionData;
  if (await UserData.sessionDataExists()) {
    console.log('User data exists!');
    userSessionData = await UserData.loadSessionData();
  } else {
    const accessToken = await TwitchAuthentication.implicitAuthFlow(window, false);
    
    console.log(`Access token: ${accessToken}`);

    userSessionData = {
      accessToken: accessToken,
      lastUpdated: Math.floor(Date.now() / 1000),
    }

    await UserData.saveSessionData(userSessionData);
  }

  window.loadFile(getResourcePath('index.html'));

  window.webContents.once('did-finish-load', () => {
    window!.webContents.send('user-data-update', userSessionData);
  });

  ipcMain.once('exit-click', () => {
    app.exit();
  });
});
