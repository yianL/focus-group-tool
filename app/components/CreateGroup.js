// @flow
import React, { PropTypes, Component } from 'react';
import { push } from 'react-router-redux';
import { Button, Table, Nav, Navbar, NavItem, Alert, FormGroup, Label, Input } from 'reactstrap';
import { DEMOGRAPHIC_METRICS, DEFAULT_CONSTRAINTS } from '../utils/constants';
import { capitalize, getAvailableCandidates } from '../utils/helpers';
import { selectFocusGroup, getAccuracyOfFocusGroup } from '../utils/algorithms';
import styles from './CreateGroup.css';

export default class CreateGroup extends Component {
  static contextTypes = {
    store: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
    };
  }

  getConfigurationTable = (key) => {
    const { constraints, groupSize } = this.props;
    const { columns } = DEMOGRAPHIC_METRICS[key];
    const constraint = constraints[key] || [];
    const sum = constraint.reduce((prev, current) =>
      Number.isFinite(current) ? prev + Math.round(current * groupSize / 100) : prev, 0);
    const percentileSum = constraint.reduce((acc, cur) => Number.isFinite(cur) ? acc + cur : acc, 0).toFixed(1);

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
            {columns.map((_, index) => (
              <td key={index}>
                {Number.isFinite(constraint[index]) ? Math.round(constraint[index] * groupSize/ 100) : '--'}
              </td>
            ))}
            <td>
              {sum}
            </td>
          </tr>
          <tr>
            <td>Percentile</td>
            {columns.map((col, index) => (
              <td key={`${col.name}|${index}`}>
                <input
                  className={styles.percentileField}
                  type="number"
                  name={`${col.name}|${index}`}
                  value={constraint[index]}
                  onChange={this.handleConstraintChange}
                />
              </td>
            ))}
            <td>{`${percentileSum}%`}</td>
          </tr>
        </tbody>
      </Table>
    );
  }

  handleConstraintChange = (event) => {
    const { setConstraint } = this.props;
    const { valueAsNumber, name } = event.target;
    const nameAndIndex = name.split('|');
    setConstraint(nameAndIndex[0], nameAndIndex[1], valueAsNumber);
  }

  handleCreate = () => {
    const { store } = this.context;
    const { groupName } = this.state;
    const {
      data,
      constraints,
      availability,
      groupSize,
      zipCodes,
      addToGroup,
      createGroup,
    } = this.props;

    const constraintObject = Object.keys(constraints).reduce((prev, current) => (
      prev.concat(
        constraints[current].map((percentile, index) => ({
          category: current,
          target: DEMOGRAPHIC_METRICS[current].columns[index].matchValue || DEMOGRAPHIC_METRICS[current].columns[index].value,
          count: Number.isFinite(percentile) ? Math.round(percentile * groupSize / 100) : null,
          percentile,
        }))
      )
    ), [])
    .filter(constraint => Number.isInteger(constraint.count));

    const availableGroup = getAvailableCandidates(data, availability, zipCodes);
    const focusGroup = selectFocusGroup(availableGroup, constraintObject, groupSize);
    const accuracy = getAccuracyOfFocusGroup(focusGroup, constraintObject);
    console.log('Group created, accuracy:', accuracy);

    // set members of the group as selected
    Object.keys(focusGroup).forEach((key) => {
      addToGroup(focusGroup[key].id, groupName);
    });

    createGroup(groupName, availability, constraintObject);

    store.dispatch(push('/'));
  }

  handleGroupNameChange = (event) => {
    const { value } = event.target;
    this.setState({ groupName: value });
  }

  handleGroupSizeChange = (event) => {
    const { setGroupSize } = this.props;
    const { valueAsNumber } = event.target;

    setGroupSize(valueAsNumber);
  }

  handleAvailabilityChange = (event) => {
    const { setAvailability, availability } = this.props;
    const { value } = event.target;
    if (availability.includes(value)) {
      setAvailability(availability.filter(a => a !== value));
    } else {
      setAvailability(availability.concat([value]));
    }
  }

  handlePresetChange = (event) => {
    const { setConstraintPreset } = this.props;
    const { value } = event.target;
    setConstraintPreset(DEFAULT_CONSTRAINTS[value]);
  }

  gotoHome = () => this.context.store.dispatch(push('/'));

  render() {
    const {
      groupSize,
      availability,
      availabilities,
    } = this.props;

    const {
      groupName,
    } = this.state;

    return (
      <div className={styles.createGroup}>
        <Navbar color="inverse" inverse light toggleable>
          <span className="navbar-brand">Create Focus Group</span>
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
          <div className={styles.groupName}>
            <h5>
              Group Name:
              <input
                name="groupName"
                value={groupName}
                onChange={this.handleGroupNameChange}
              />
            </h5>
          </div>
          <div className={styles.groupSize}>
            <h5>
              Group Size:
              <input
                type="number"
                name="groupSize"
                value={groupSize}
                onChange={this.handleGroupSizeChange}
              />
            </h5>
          </div>
          <div>
            <h5>
              Availability:
              {availabilities.map(o => (
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      onChange={this.handleAvailabilityChange}
                      value={o}
                      checked={availability.includes(o)}
                    />
                    {` ${o}`}
                  </Label>
                </FormGroup>
              ))}
            </h5>
          </div>
          <div className={styles.groupSize}>
            <h5>
              Demographic presets:
              <select
                onChange={this.handlePresetChange}
                defaultValue=""
              >
                <option disabled value=""> Select a preset </option>
                {Object.keys(DEFAULT_CONSTRAINTS).map(o => (
                  <option value={DEFAULT_CONSTRAINTS[o].name}>{DEFAULT_CONSTRAINTS[o].label}</option>
                ))}
              </select>
            </h5>
          </div>
          {Object.keys(DEMOGRAPHIC_METRICS).map((key) => (
            <div className={styles.contraintSet} key={key}>
              <h5>{capitalize(key)}</h5>
              {this.getConfigurationTable(key)}
            </div>
          ))}
          <div className="actionBar">
            <Button onClick={this.gotoHome}>Cancel</Button>
            <Button
              color="primary"
              onClick={this.handleCreate}
              disabled={availability.length === 0 || !groupName}
            >
              Create
            </Button>
          </div>
          {availability.length === 0 && (
            <Alert color="warning">
              Please select time availability for this group.
            </Alert>
          )}
          {!groupName && (
            <Alert color="warning">
              Please give the group a name.
            </Alert>
          )}
        </div>
      </div>
    );
  }
}
