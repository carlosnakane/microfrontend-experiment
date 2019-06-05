import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const mount = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
}

const unmount = () => {
  // TODO: It's a workaround due https://github.com/facebook/react/issues/13690
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 0);
  });
}

window['lifecycle'] = {
  mount,
  unmount
}
