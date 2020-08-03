import React, { FunctionComponent, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}


const App: FunctionComponent<{}> = (props) => {
  const [userData, setUserData] = useState({} as any);

  useEffect(() => {
    window.ipcRenderer.on('user-data-update', (event, data) => {
      console.log(`Received user-data-update: ${JSON.stringify(data)}`);
      setUserData(data);
    })
  }, []);

  return (
    <>
      <h1>Hello from React</h1>
      <button onClick={() => window.ipcRenderer.send('exit-click')}>Exit</button>
      {userData && userData['accessToken'] && <p>{userData.accessToken}</p>}
   </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
