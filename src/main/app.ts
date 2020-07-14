import path from 'path';
import { app, BrowserWindow, Menu, Tray } from 'electron';

const TITLE = 'Twitch Desktop Notifier';
const RES_PATH = '../../res';

function getResource(resourceName: string) {
  return path.join(__dirname, RES_PATH, path.normalize(resourceName));
}

let tray = null;
let window = null;
app.on('ready', () => {
  tray = new Tray(getResource('icon.png'));
  tray.setToolTip(TITLE);
  tray.setTitle(TITLE);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Exit', type: 'normal', click: () => console.log('exit') }
  ]));

  window = new BrowserWindow({
    width: 800,
    height: 600,
    title: TITLE,
    icon: getResource('icon.png'),
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadFile(getResource('index.html'));
  // window.removeMenu();
});
