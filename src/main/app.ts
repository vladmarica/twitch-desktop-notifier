import path from 'path';
import os from 'os';
import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';

const TITLE = 'Twitch Desktop Notifier';
const GTK_ICON_NAME = 'twitch-indicator';
const RES_PATH = '../../res';

function getResourcePath(resourceName: string) {
  return path.join(__dirname, RES_PATH, path.normalize(resourceName));
}

async function getProgramIcon(): Promise<nativeImage> {
  // On Linux, try to use the 'twitch-indicator' GTK icon if available
  if (os.platform() === 'linux') {
    const icon = await (require('./util/linux/icons')(GTK_ICON_NAME) as Promise<nativeImage | null>);
    if (icon !== null) {
      return icon;
    }
  }

  return nativeImage.createFromPath(getResourcePath('icon.png'));
}

let tray = null;
let window = null;

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
    width: 800,
    height: 600,
    title: TITLE,
    icon: icon,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  window.loadFile(getResourcePath('index.html'));
  // window.removeMenu();
});
