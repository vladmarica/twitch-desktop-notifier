import fs from 'fs';

export async function exists(path: fs.PathLike): Promise<boolean> {
  return new Promise<boolean>((resolve) => fs.exists(path, resolve));
}

export async function readFile(path: fs.PathLike | number, options: { encoding: string; flag?: string; } | string): Promise<string> {
  return new Promise<string>((resolve, reject) => fs.readFile(path, options, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  }));
}

export default {
  exists,
  readFile
};
