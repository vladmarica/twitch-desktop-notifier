import svg2img from 'svg2img';
import { nativeImage } from 'electron';

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

export default async function getGtkIcon(iconName: string): Promise<nativeImage | null> {
  const GtkIcons = require('node-gtk-icon-lookup');
  if (await GtkIcons.isIconLookupSupported()) {
    const gtkIconPath = GtkIcons.getIconFilePath('twitch-indicator');
    if (gtkIconPath) {
      return getIconFromSvg(gtkIconPath);
    }
  }
  return null;
}
