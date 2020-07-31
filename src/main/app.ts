import path from 'path';
import os from 'os';
import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import svg2img from 'svg2img';
import GtkIcons from 'node-gtk-icon-lookup';

const TITLE = 'Twitch Desktop Notifier';
const RES_PATH = '../../res';

function getResourcePath(resourceName: string) {
  return path.join(__dirname, RES_PATH, path.normalize(resourceName));
}

async function getProgramIcon(): Promise<nativeImage> {
  if (os.platform() === 'linux' && await GtkIcons.isIconLookupSupported()) {
    const gtkIconPath =  GtkIcons.getIconFilePath('twitch-indicator');
    if (gtkIconPath) {
      return getIconFromSvg(gtkIconPath);
    }
  }

  return nativeImage.createFromPath(getResourcePath('icon.png'));
}

async function getIconFromSvg(svgFilePath: string): Promise<nativeImage> {
  return new Promise<nativeImage>((resolve, reject) => {
    svg2img(svgFilePath, (err, buffer) => {
      if (err) {
        return reject();
      }
      return resolve(nativeImage.createFromBuffer(buffer)); 
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
