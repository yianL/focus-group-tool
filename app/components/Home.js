// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import ResponseTable from './ResponseTable';
import styles from './Home.css';

export default class Home extends Component {
  componentWillMount() {
    const { loadDataSet } = this.props;
    ipcRenderer.on('selected-file', (event, path) => {
    });

    ipcRenderer.on('file-loaded', (event, data) => {
      loadDataSet(data);
    });
  }

  onBtnClick() {
    ipcRenderer.send('open-file-dialog');
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          {/*<Link to="/counter">to Counter</Link>*/}
          <button type="button" onClick={this.onBtnClick}>Import Data</button>
          <ResponseTable list={data} />
        </div>
      </div>
    );
  }
}
