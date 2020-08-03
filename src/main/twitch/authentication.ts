import { TWITCH_CLIENT_ID, REDIRECT_URL } from './constants';
import { BrowserWindow, OnBeforeRequestListenerDetails } from 'electron';
import {v4 as uuidv4 } from 'uuid';


type WebRequestCallback = (response: Electron.Response) => void;

function getAuthenticationURL(state: string, forceVerify: boolean = false): string {
  const redirectUrl = REDIRECT_URL.toString().replace(/\/$/gm, '');
  return `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}`
    + `&redirect_uri=${redirectUrl}&response_type=token&state=${state}`
    + `&force_verify=${forceVerify}`;
}

type FragmentParts = { accessToken: string, state: string };
function parseFragment(fragment: string): FragmentParts {
  fragment = fragment.replace(/^#/gm, ''); // trim leading # if it exists

  const pairs = fragment.split('&');
  const fragmentMap = new Map<string, string>();
  for (const pair of pairs) {
    const parts = pair.split('=');
    fragmentMap.set(parts[0], parts[1]);
  }

  if (!fragmentMap.has('access_token')) {
    throw new Error('Missing \access_token\' key in fragment');
  }

  if (!fragmentMap.has('state')) {
    throw new Error('Missing \state\' key in fragment');
  }

  return {
    accessToken: fragmentMap.get('access_token')!,
    state: fragmentMap.get('state')!
  };
}

export async function implicitAuthFlow(window: BrowserWindow, hidden: boolean = false): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const state = uuidv4();
    const twitchAuthenticationUrl = getAuthenticationURL(state, true);

    const onBeforeRequestListener = (details: OnBeforeRequestListenerDetails, callback: WebRequestCallback) => {
      const url = new URL(details.url);

      if (url.hostname === REDIRECT_URL.hostname) {
        const fragment = parseFragment(url.hash);
        window.webContents.session.webRequest.onBeforeRequest(null);
        callback({ cancel: true });

        if (fragment.state !== state) {
          return reject(`States do not match, sent ${state}, received ${fragment.state}`);
        }

        return resolve(fragment.accessToken);
      } else if (hidden && details.url !== twitchAuthenticationUrl) {
        window.webContents.session.webRequest.onBeforeRequest(null);
        callback({ cancel: true });
        return reject('Hidden reauthorization failed - the request did not immediately hit callback');
      }

      callback({ cancel: false });
    };

    window.webContents.session.webRequest.onBeforeRequest(onBeforeRequestListener);
    window.loadURL(twitchAuthenticationUrl);
  });
}

export default {
  getAuthenticationURL,
  implicitAuthFlow,
};
