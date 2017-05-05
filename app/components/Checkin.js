// @flow
import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Button, Table, Nav, Navbar, NavItem } from 'reactstrap';
import Plottable from 'plottable';
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
    this.charts = {};
  }

  componentWillMount() {
    ipcRenderer.on('saved', (event, data) => {
      let message = `${data.length} entries saved to participants database:\n`;

      data.forEach((d) => {
        message += `- ${d.email}\n`;
      });
      window.alert(message);
    });
  }

  componentDidUpdate(prevProp, prevState) {
    const { showDemographicSummary } = this.state;
    if (prevState.showDemographicSummary !== showDemographicSummary && !showDemographicSummary) {
      this.destroyCharts();
    }
  }

  componentWillUnmount() {
    this.destroyCharts();
  }

  onExportData = () => {
    const { focusGroup, checkInStatus, activeGroup } = this.props;
    const exportColumns = COLUMNS.slice(1);
    const focusGroupArray = [
      exportColumns.map(col => col.header)
    ];

    focusGroup.filter((person) => checkInStatus.includes(person.id))
      .forEach((person) => {
        focusGroupArray.push(exportColumns.map(col => person[col.name]));
      });

    ipcRenderer.send('export-csv', {
      groupName: activeGroup,
      group: focusGroupArray
    });
  }

  onSaveAttendees = () => {
    const { focusGroup, checkInStatus } = this.props;
    const attendees = focusGroup.filter((person) => checkInStatus.includes(person.id));

    if (window.confirm(`This will save ${attendees.length} people into the database, are you sure?`)) {
      ipcRenderer.send('save-to-db', attendees);
    }
  }

  getDemographicTable = (key, group) => {
    const groupSize = group.length;
    const { columns } = DEMOGRAPHIC_METRICS[key];
    const { focusGroupMeta } = this.props;
    const constraints = focusGroupMeta.constraints[key] || [];
    const counts = columns.map((col) =>
      group.filter(person => person[col.name].includes(col.value)).length);
    const percentile = counts.map(c => (c * 100 / groupSize).toFixed(1));
    const chartData = counts.map((c, index) => ({
      name: columns[index].value,
      count: c,
    }));

    setTimeout(() => {
      const dataset = new Plottable.Dataset(chartData);

      if (this.charts[key]) {
        const oldDataset = this.charts[key].dataset;
        setTimeout(() => {
          this.charts[key].dataset = dataset;
          this.charts[key].chart
            .removeDataset(oldDataset)
            .addDataset(dataset)
            .redraw();
        });
        return;
      }

      const colorScale = new Plottable.Scales.Color();
      this.charts[key] = {
        dataset,
        chart: new Plottable.Plots.Pie()
          .attr('fill', d => d.name, colorScale)
          .addDataset(dataset)
          .sectorValue(d => d.count)
          .labelsEnabled(true)
          // .labelFormatter(function(n){ return '$ ' + n ;})
          .renderTo(`div#chart-${key}`),
        legend: new Plottable.Components.Legend(colorScale)
          .xAlignment('left')
          .yAlignment('center')
          .renderTo(`div#legend-${key}`)
      };
    }, 100);

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
                {`${percentile[index]}%`}
              </td>
            ))}
            <td />
          </tr>
          <tr>
            <td>Target</td>
            {columns.map((_, index) => (
              <td>
                {constraints[index] ? `${constraints[index].toFixed(1)}%` : '--'}
              </td>
            ))}
            <td />
          </tr>
          <tr>
            <td>Offset</td>
            {columns.map((_, index) => (
              <td>
                {constraints[index] && (percentile[index] > constraints[index] ? '+' : '-')}
                {constraints[index] ? `${Math.abs(percentile[index] - constraints[index]).toFixed(1)}%` : '--'}
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


  destroyCharts = () => {
    Object.keys(this.charts).forEach((key) => {
      this.charts[key].chart.destroy();
      this.charts[key].legend.destroy();
      delete this.charts[key];
    });
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
        <div className={styles.chart}>
          <div className={styles.chartWrapper}>
            <div id={`chart-${key}`} />
          </div>
          <div className={styles.legendWrapper}>
            <div id={`legend-${key}`} />
          </div>
        </div>
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
            {`Group Check-in: ${activeGroup}`}
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
            <Button onClick={this.onSaveAttendees}>Save Attendees into DB</Button>
            <Button onClick={this.toggleDemographic}>Demographics Summary</Button>
          </div>
          {showDemographicSummary && this.renderDemographicsSummary()}
        </div>
      </div>
    );
  }
}
