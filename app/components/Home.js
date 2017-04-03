// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import ResponseTable from './ResponseTable';
import FocusGroupTable from './FocusGroupTable';
import { COLUMNS } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import styles from './Home.css';

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

  onExportData = () => {
    const { focusGroup } = this.props;
    const exportColumns = COLUMNS.slice(1);
    const focusGroupArray = [
      exportColumns.map(col => col.header)
    ];

    focusGroup.forEach((person) => {
      focusGroupArray.push(exportColumns.map(col => person[col.name]));
    });

    console.log('export', focusGroupArray);
    ipcRenderer.send('export-csv', focusGroupArray);
  }

  render() {
    const {
      data,
      focusGroup,
      addToGroup,
      removeFromGroup,
      markAsUnavailable,
      markAsAvailable,
      constraints,
      mismatches,
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
          <button type="button" onClick={this.onExportData}>Export Data</button>
          {mismatches.length > 0 && (
            <div>
              <ul>
                {mismatches.map((mismatch) => (
                  <li>
                    {`${capitalize(mismatch.category)} ${mismatch.target} (${mismatch.count + mismatch.offset}/${mismatch.count})`}
                  </li>
                ))}
              </ul>
            </div>
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
