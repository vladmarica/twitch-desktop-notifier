import { app } from 'electron';
import path from 'path';
import mkdirp from 'mkdirp';
import asyncfs from './util/async-fs';
import fs from 'fs';

export interface SessionData {
  /** Twitch access token */
  accessToken: string;

  /** Timestamp when the Twitch access token was last updated */
  lastUpdated: number;
}

const APP_ID = 'twitch-desktop-notifier';
const DEFAULT_DATA_FOLDER = path.join(app.getPath('appData'), APP_ID, 'data');
const SESSION_DATA_FILENAME = 'session.json';

export async function loadSessionData(): Promise<SessionData> {
  const contents = await asyncfs.readFile(
    path.join(DEFAULT_DATA_FOLDER, SESSION_DATA_FILENAME),
    'utf8');
  const json = JSON.parse(contents);
  if (json.accessToken && json.lastUpdated) {
    return json as SessionData;
  }

  throw new Error(`Session data in ${SESSION_DATA_FILENAME} was invalid`);
}

export async function sessionDataExists(): Promise<boolean> {
  return asyncfs.exists(path.join(DEFAULT_DATA_FOLDER, SESSION_DATA_FILENAME));
}

export async function saveSessionData(data: SessionData): Promise<void> {
  fs.writeFileSync(
    path.join(DEFAULT_DATA_FOLDER, SESSION_DATA_FILENAME),
    JSON.stringify(data, null, 2),
    'utf8');
}

export async function validateUserDataFolder(): Promise<void> {
  if (!(await asyncfs.exists(DEFAULT_DATA_FOLDER))) {
    await mkdirp(DEFAULT_DATA_FOLDER);

  }
}

export default {
  loadSessionData,
  sessionDataExists,
  saveSessionData,
  validateUserDataFolder,
};
