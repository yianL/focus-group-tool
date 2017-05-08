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
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from 'reactstrap';

import ResponseTable from './ResponseTable';
import FocusGroupTable from './FocusGroupTable';
import ActiveFilters from './ActiveFilters';
import { COLUMNS, COLUMNSBYID } from '../utils/constants';
import { capitalize, getAvailableCandidates } from '../utils/helpers';
import { calculateUnmetCriteria, selectFocusGroup, getAccuracyOfFocusGroup } from '../utils/algorithms';

import styles from './Home.css';

/* eslint-disable react/prop-types */
export default class Home extends Component {
  static contextTypes = {
    store: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  componentWillMount() {
    const { loadDataSet, loadState } = this.props;
    ipcRenderer.on('file-loaded', (event, data) => {
      loadDataSet(data.candidates);

      if (data.filteredOut.length > 0) {
        let message = 'The following email has been filtered out because they are duplicates/past participants:\n';

        data.filteredOut.forEach((person) => {
          message += `- ${person[COLUMNSBYID.email.index - 1]}\n`;
        });
        window.alert(message);
      }
    });

    ipcRenderer.on('state-loaded', (event, state) => {
      loadState(state);
    });
  }

  onExportData = () => {
    const { focusGroup, focusGroupMeta } = this.props;
    const exportColumns = COLUMNS.slice(1);
    const focusGroupArray = [
      exportColumns.map(col => col.header)
    ];

    focusGroup.forEach((person) => {
      focusGroupArray.push(exportColumns.map(col => person[col.name]));
    });

    ipcRenderer.send('export-csv', {
      groupName: focusGroupMeta.name,
      group: focusGroupArray,
    });
  }

  onLoadButtonClick = () => {
    ipcRenderer.send('open-load-dialog');
  }

  onSaveButtonClick = () => {
    const { store } = this.context;
    ipcRenderer.send('open-save-dialog', store.getState());
  }

  getRefillInputRef = ref => { this.refillInput = ref; }

  gotoFocusGroup = () => this.context.store.dispatch(push('/create'));
  gotoCheckin = () => this.context.store.dispatch(push('/checkin'));

  handleSelectActiveGroup = (e) => {
    const value = e.target.textContent;
    const { setActiveGroup } = this.props;
    setActiveGroup(value);
  }

  handleRefillGroup = () => {
    const groupSize = this.refillInput.valueAsNumber;
    if (!groupSize) { return; }

    const {
      data,
      addToGroup,
      focusGroupMeta,
    } = this.props;
    const constraintObject = focusGroupMeta.constraintObject
      .filter(co => !!co.offset)
      .map(co => ({
        ...co,
        count: co.offset < 0 ? -1 * co.offset : 0,
        offset: undefined
      }));
    const pool = getAvailableCandidates(data, focusGroupMeta.availability, focusGroupMeta.zipCodes);

    const subGroup = selectFocusGroup(pool, constraintObject, groupSize);
    let message = `${Object.keys(subGroup).length} new candidates added to group:\n`;

    Object.keys(subGroup).forEach((key) => {
      addToGroup(subGroup[key].id, focusGroupMeta.name);
      message += `- ${subGroup[key].name}\n`;
    });

    window.alert(message);

    this.setState({ showModal: false });
  }

  openRefillModal = () => {
    this.setState({ showModal: true });
  }

  closeRefillModal = () => {
    this.setState({ showModal: false });
  }

  renderActiveGroup = () => {
    const {
      addFilter,
      focusGroup,
      focusGroupMeta,
      markAsUnavailable,
    } = this.props;
    const { showModal } = this.state;

    const mismatches = calculateUnmetCriteria(focusGroup, focusGroupMeta.constraintObject);

    return (
      <div>
        <Row className="mt-2 mb-3">
          <Col>
            <div>{`Size: ${focusGroup.length}`}</div>
            <div>{`Availability: ${focusGroupMeta.availability.join(', ')}`}</div>
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
          <Col xs="4" className="d-flex justify-content-end">
            <Button onClick={this.openRefillModal} className="mr-2">
              Refill Group
            </Button>
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

        <Modal
          isOpen={showModal}
          toggle={this.closeRefillModal}
        >
          <ModalHeader toggle={this.closeRefillModal}>
            Refill Group
          </ModalHeader>
          <ModalBody>
            Select
            <input
              className={styles.refillInput}
              type="number"
              defaultValue={0}
              ref={this.getRefillInputRef}
            />
            more candidates into this group.
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.closeRefillModal}>Cancel</Button>{' '}
            <Button color="primary" onClick={this.handleRefillGroup}>Ok</Button>
          </ModalFooter>
        </Modal>
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
      filteredData,
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
            {(filters.length > 0 || filteredData.length > 0) && (
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
            list={filteredData}
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
