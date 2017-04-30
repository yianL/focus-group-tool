// @flow
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';
import {
  Button,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
  Col,
} from 'reactstrap';

import ResponseTable from './ResponseTable';
import FocusGroupTable from './FocusGroupTable';
import ActiveFilters from './ActiveFilters';
import { COLUMNS, COLUMNSBYID } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import { calculateUnmetCriteria } from '../utils/algorithms';
import styles from './Home.css';

/* eslint-disable react/prop-types */
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

  onLoadButtonClick = () => {
    ipcRenderer.send('open-load-dialog');
  }

  onSaveButtonClick = () => {
    const { store } = this.context;
    ipcRenderer.send('open-save-dialog', store.getState());
  }

  gotoFocusGroup = () => this.context.store.dispatch(push('/create'));
  gotoCheckin = () => this.context.store.dispatch(push('/checkin'));

  handleSelectActiveGroup = (e) => {
    const value = e.target.textContent;
    const { setActiveGroup } = this.props;
    setActiveGroup(value);
  }

  renderActiveGroup = () => {
    const {
      addFilter,
      focusGroup,
      focusGroupMeta,
      markAsUnavailable,
    } = this.props;

    const mismatches = calculateUnmetCriteria(focusGroup, focusGroupMeta.constraintObject);

    return (
      <div>
        <Row className="mt-2 mb-3">
          <Col>
            <div>Group Summary</div>
            <div>{`Size: ${focusGroup.length}`}</div>
            <span>Unmet Criteria: </span>
            <ul className={styles.mismatchList}>
              {mismatches.length > 0 ? mismatches.map((mismatch) => {
                const { category, target, count, offset } = mismatch;
                return (
                  <li
                    key={`${category}-${target}`}
                    onClick={() => addFilter(category, target)}
                  >
                    {`${capitalize(category)} ${target} (${count + offset}/${count})`}
                  </li>
                );
              }) : 'None'}
            </ul>
          </Col>
          <Col xs="3" className="d-flex justify-content-end">
            <Button onClick={this.onExportData} className="mr-2">
              Export
            </Button>
            <Button onClick={this.gotoCheckin}>
              Check-in
            </Button>
          </Col>
        </Row>
        <FocusGroupTable
          list={focusGroup}
          constraints={focusGroupMeta.constraints}
          markAsUnavailable={markAsUnavailable}
        />
      </div>
    );
  }

  renderFocusGroupSelector = () => {
    const { focusGroups, activeGroup } = this.props;
    return (
      <Nav tabs>
        {focusGroups.map(f => (
          <NavItem key={f}>
            <NavLink
              className={classNames({ active: activeGroup === f })}
              onClick={this.handleSelectActiveGroup}
            >
              {f}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    );
  }

  render() {
    const {
      data,
      focusGroups,
      activeGroup,
      addToGroup,
      addFilter,
      removeFilter,
      markAsUnavailable,
      markAsAvailable,
      filters,
      filterOptions,
    } = this.props;
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarBrand href="/">Focus Group Tool</NavbarBrand>
          <Nav className="ml-auto" navbar>
            {(filters.length > 0 || data.length > 0) && (
              <NavItem>
                <Button color="primary" onClick={this.gotoFocusGroup}>
                  Create Focus Group
                </Button>
              </NavItem>
            )}
            <NavItem>
              <Button outline onClick={this.onLoadButtonClick}>Load</Button>
            </NavItem>
            <NavItem>
              <Button outline onClick={this.onSaveButtonClick}>Save</Button>
            </NavItem>
          </Nav>
        </Navbar>
        <div className="container" data-tid="container">
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
          {focusGroups.length > 0 && this.renderFocusGroupSelector()}
          {activeGroup && this.renderActiveGroup()}
        </div>
      </div>
    );
  }
}
