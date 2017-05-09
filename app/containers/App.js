// @flow
import React, { PropTypes, Component } from 'react';
import { ipcRenderer } from 'electron';
import { loadState } from '../actions/ui';
import type { Children } from 'react';

export default class App extends Component {
  static contextTypes = {
    store: PropTypes.any,
  };

  props: {
    children: Children
  };

  componentWillMount() {
    const { store } = this.context;
    ipcRenderer.on('state-loaded', (event, state) => {
      store.dispatch(loadState(state));
    });

    ipcRenderer.on('load-btn-clicked', () => {
      ipcRenderer.send('open-load-dialog');
    });
    ipcRenderer.on('save-btn-clicked', () => {
      ipcRenderer.send('open-save-dialog', store.getState());
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
