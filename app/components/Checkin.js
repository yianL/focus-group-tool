// @flow
import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Button, Table, Nav, Navbar, NavItem, Alert } from 'reactstrap';
import { ipcRenderer } from 'electron';
import { COLUMNS, DEMOGRAPHIC_METRICS } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import styles from './Checkin.css';

export default class Home extends React.Component {
  static contextTypes = {
    store: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDemographicSummary: false,
    };
  }

  onExportData = () => {
    const { focusGroup, checkInStatus } = this.props;
    const exportColumns = COLUMNS.slice(1);
    const focusGroupArray = [
      exportColumns.map(col => col.header)
    ];

    focusGroup.filter((person) => checkInStatus.includes(person.id))
      .forEach((person) => {
        focusGroupArray.push(exportColumns.map(col => person[col.name]));
      });

    console.log('export', focusGroupArray);
    ipcRenderer.send('export-csv', focusGroupArray);
  }

  getDemographicTable = (key, group) => {
    const groupSize = group.length;
    const { columns } = DEMOGRAPHIC_METRICS[key];
    const counts = columns.map((col) =>
      group.filter(person => person[col.name].includes(col.value)).length);

    return (
      <Table striped>
        <thead>
          <tr>
            <th />
            {columns.map((col) => (
              <th key={col.value}>{col.value}</th>
            ))}
            <th className={styles.summaryColumn}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Count</td>
            {columns.map((col, index) => (
              <td key={`${col.name}|${index}`}>{counts[index]}</td>
            ))}
            <td>{groupSize}</td>
          </tr>
          <tr>
            <td>Percentile</td>
            {columns.map((_, index) => (
              <td>
                {`${(counts[index] * 100 / groupSize).toFixed(1)}%`}
              </td>
            ))}
            <td />
          </tr>
        </tbody>
      </Table>
    );
  }

  checkAllIn = () => {
    const { focusGroup, activeGroup, checkPersonIn } = this.props;
    focusGroup.forEach(person => checkPersonIn(person.id, activeGroup));
  }

  uncheckAllIn = () => {
    const { focusGroup, activeGroup, uncheckPersonIn } = this.props;
    focusGroup.forEach(person => uncheckPersonIn(person.id, activeGroup));
  }

  toggleDemographic = () => this.setState({
    showDemographicSummary: !this.state.showDemographicSummary,
  });

  gotoHome = () => this.context.store.dispatch(push('/'));

  renderDemographicsSummary = () => {
    const { focusGroup, checkInStatus } = this.props;
    const group = focusGroup.filter((person) => checkInStatus.includes(person.id));

    return Object.keys(DEMOGRAPHIC_METRICS).map((key) => (
      <div className={styles.contraintSet} key={key}>
        <h5>{capitalize(key)}</h5>
        {this.getDemographicTable(key, group)}
      </div>
      ));
  }

  render() {
    const { showDemographicSummary } = this.state;
    const {
      focusGroup,
      activeGroup,
      checkPersonIn,
      uncheckPersonIn,
      checkInStatus,
    } = this.props;

    return (
      <div>
        <Navbar color="inverse" inverse light toggleable>
          <span className="navbar-brand">
            {`Group Check-in (Session: ${activeGroup})`}
          </span>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button onClick={this.gotoHome}>
                <i className="fa fa-chevron-circle-left fa-fw" />
                Back
              </Button>
            </NavItem>
          </Nav>
        </Navbar>
        <div className="container">
          <Table striped>
            <thead>
              <tr>
                <th>
                  {checkInStatus.length < focusGroup.length
                    ? <Button color="primary" size="sm" onClick={this.checkAllIn}>Check all</Button>
                    : <Button color="primary" size="sm" onClick={this.uncheckAllIn}>Uncheck all</Button>
                  }
                </th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {focusGroup.map((person) => {
                const checkedIn = checkInStatus.includes(person.id);
                return (
                  <tr>
                    <td>
                      {checkedIn
                        ? <Button size="sm" onClick={() => uncheckPersonIn(person.id, activeGroup)}>Undo</Button>
                        : <Button color="info" size="sm" onClick={() => checkPersonIn(person.id, activeGroup)}>Check-in</Button>
                      }
                    </td>
                    <td>
                      {person.name}
                      {checkedIn && <i className="fa fa-check text-success ml-1" />}
                    </td>
                    <td>{person.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <div className="actionBar">
            <Button color="primary" onClick={this.onExportData}>Export Attendees</Button>
            <Button onClick={this.toggleDemographic}>Demographics Summary</Button>
          </div>
          {showDemographicSummary && this.renderDemographicsSummary()}
        </div>
      </div>
    );
  }
}
