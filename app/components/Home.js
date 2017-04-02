// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import ResponseTable from './ResponseTable';
import FocusGroupTable from './FocusGroupTable';
import styles from './Home.css';

const constraints = {
  education: {},
  age: {},
  income: {},
};

export default class Home extends Component {
  componentWillMount() {
    const { loadDataSet } = this.props;
    // ipcRenderer.on('selected-file', (event, path) => {
    // });

    ipcRenderer.on('file-loaded', (event, data) => {
      loadDataSet(data);
    });
  }

  onBtnClick() {
    ipcRenderer.send('open-file-dialog');
  }

  render() {
    const {
      data,
      focusGroup,
      addToGroup,
      removeFromGroup,
      markAsUnavailable,
      markAsAvailable,
    } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <button type="button" onClick={this.onBtnClick}>Import Data</button>
          <ResponseTable
            list={data}
            addToGroup={addToGroup}
            markAsUnavailable={markAsUnavailable}
            markAsAvailable={markAsAvailable}
          />
          {data.length > 0 && (
            <button type="button">
              <Link to="/create">Create Focus Group</Link>
            </button>
          )}
          {data.length > 0 && (
            <FocusGroupTable
              list={focusGroup}
              constraints={constraints}
              removeFromGroup={removeFromGroup}
            />
          )}
        </div>
      </div>
    );
  }
}
