import path from 'path';
import os from 'os';
import { app, BrowserWindow, Menu, Tray, NativeImage } from 'electron';
import svg2img from 'svg2img';

const TITLE = 'Twitch Desktop Notifier';
const RES_PATH = '../../res';

function getResourcePath(resourceName: string) {
  return path.join(__dirname, RES_PATH, path.normalize(resourceName));
}

async function getProgramIcon(): Promise<NativeImage> {
  if (os.platform() === 'linux') {
    return getIconFromSvg('/usr/share/icons/Papirus-Dark/16x16@2x/panel/twitch-indicator.svg');
  }

  return NativeImage.createFromPath(getResourcePath('icon.png'));
}

async function getIconFromSvg(svgFilePath: string): Promise<NativeImage> {
  return new Promise<NativeImage>((resolve, reject) => {
    svg2img(svgFilePath, (err, buffer) => {
      if (err) {
        return reject();
      }
      return resolve(NativeImage.createFromBuffer(buffer, { width: 16, height: 16})); 
    });
  });
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
