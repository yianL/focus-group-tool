// @flow
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { ipcRenderer } from 'electron';
import { Link } from 'react-router';
import { COLUMNS, DEMOGRAPHIC_METRICS } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import styles from './Checkin.css';

export default class Home extends React.Component {
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
      <table>
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
      </table>
    );
  }

  toggleDemographic = () => this.setState({
    showDemographicSummary: !this.state.showDemographicSummary,
  });

  renderDemographicsSummary() {
    const { focusGroup, checkInStatus } = this.props;
    const group = focusGroup.filter((person) => checkInStatus.includes(person.id));

    return Object.keys(DEMOGRAPHIC_METRICS).map((key) => {
      return (
        <div className={styles.contraintSet} key={key}>
          <h3>{capitalize(key)}</h3>
          {this.getDemographicTable(key, group)}
        </div>
      );
    });
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
        <h2>
          <Link to="/">
            <i className="fa fa-chevron-circle-left fa-fw" />
          </Link>
          {`Group Check-in (Session: ${activeGroup})`}
        </h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {focusGroup.map((person) => (
              <tr>
                <td>
                  {checkInStatus.includes(person.id)
                  ? <button onClick={() => uncheckPersonIn(person.id, activeGroup)}>Undo</button>
                  : <button onClick={() => checkPersonIn(person.id, activeGroup)}>Check-in</button>
                  }
                </td>
                <td>{person.name}</td>
                <td>{person.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={this.onExportData}>Export Attendees</button>
        <button type="button" onClick={this.toggleDemographic}>Demographics Summary</button>
        {showDemographicSummary && this.renderDemographicsSummary()}
      </div>
    );
  }
}
