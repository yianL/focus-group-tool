// @flow
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import ResponseTable from './ResponseTable';
import FocusGroupTable from './FocusGroupTable';
import ActiveFilters from './ActiveFilters';
import { capitalize } from '../utils/helpers';
import styles from './Home.css';

export default class Home extends Component {
  static contextTypes = {
    store: PropTypes.any,
  };

  componentWillMount() {
    const { loadDataSet, loadState } = this.props;
    ipcRenderer.on('file-loaded', (event, data) => {
      loadDataSet(data);
    });

    ipcRenderer.on('state-loaded', (event, state) => {
      loadState(state);
    });
  }

  onImportButtonClick = () => {
    ipcRenderer.send('open-file-dialog');
  }

  onLoadButtonClick = () => {
    ipcRenderer.send('open-load-dialog');
  }

  onSaveButtonClick = () => {
    const { store } = this.context;
    ipcRenderer.send('open-save-dialog', store.getState());
  }

  handleSelectActiveGroup = (e) => {
    const value = e.target.textContent;
    const { setActiveGroup } = this.props;
    setActiveGroup(value);
  }

  renderMismatches = () => {
    const { addFilter, mismatches } = this.props;

    return (
      <ul className={styles.mismatchList}>
        {mismatches.map((mismatch) => {
          const { category, target, count, offset } = mismatch;
          return (
            <li
              key={`${category}-${target}`}
              onClick={() => addFilter(category, target)}
            >
              {`${capitalize(category)} ${target} (${count + offset}/${count})`}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const {
      data,
      focusGroup,
      focusGroups,
      activeGroup,
      addToGroup,
      removeFromGroup,
      addFilter,
      removeFilter,
      markAsUnavailable,
      markAsAvailable,
      constraints,
      mismatches,
      filters,
      filterOptions,
    } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <button type="button" onClick={this.onImportButtonClick}>Import Data</button>
          <button type="button" onClick={this.onLoadButtonClick}>Load</button>
          <button type="button" onClick={this.onSaveButtonClick}>Save</button>
          <ActiveFilters
            filters={filters}
            removeFilter={removeFilter}
          />
          <ResponseTable
            list={data}
            addToGroup={addToGroup}
            activeGroup={activeGroup}
            markAsUnavailable={markAsUnavailable}
            markAsAvailable={markAsAvailable}
            addFilter={addFilter}
            removeFilter={removeFilter}
            filters={filters}
            filterOptions={filterOptions}
          />
          {data.length > 0 && (
            <button type="button">
              <Link to="/create">Create Focus Group</Link>
            </button>
          )}
          {activeGroup && (
            <button type="button">
              <Link to="/checkin">Check-in</Link>
            </button>
          )}
          {focusGroups.length > 0 && (
            <ul className={styles.focusGroupSelector}>
              {focusGroups.map(f => (
                <li
                  key={f}
                  className={classNames(activeGroup === f ? styles.isActive : undefined)}
                  onClick={this.handleSelectActiveGroup}
                >
                  {f}
                </li>
              ))}
            </ul>
          )}
          {mismatches.length > 0 && this.renderMismatches()}
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
