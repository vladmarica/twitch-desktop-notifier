import React, { Component } from 'react';
import ReactDOM from 'react-dom';

console.log('Hello from the renderer processor');

const App = (
 <>
  <h1>Hello from React</h1>
  <button>Click me</button>
 </>
);

ReactDOM.render(App, document.getElementById('app'));
