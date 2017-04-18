// @flow
import React, { PropTypes, Component } from 'react';
import { push } from 'react-router-redux';
import { Button, Table, Nav, Navbar, NavItem, Alert } from 'reactstrap';
import { DEMOGRAPHIC_METRICS } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import { selectFocusGroup, calculateUnmetCriteria, getAccuracyOfFocusGroup } from '../utils/algorithms';
import styles from './CreateGroup.css';

export default class CreateGroup extends Component {
  static contextTypes = {
    store: PropTypes.any,
  };

  getConfigurationTable = (key) => {
    const { constraints, groupSize } = this.props;
    const { columns } = DEMOGRAPHIC_METRICS[key];
    const constraint = constraints[key] || [];
    const sum = constraint.reduce((prev, current) => isNaN(current) ? prev : prev + current, 0);

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
              <td key={`${col.name}|${index}`}>
                <input
                  className={styles.countField}
                  type="number"
                  name={`${col.name}|${index}`}
                  value={constraint[index]}
                  onChange={this.handleConstraintChange}
                />
              </td>
            ))}
            <td>
              {sum}
            </td>
          </tr>
          <tr>
            <td>Percentile</td>
            {columns.map((_, index) => (
              <td key={index}>
                {isNaN(constraint[index]) ? '--' : `${(constraint[index] * 100 / groupSize).toFixed(1)}%`}
              </td>
            ))}
            <td>{(sum * 100 / groupSize).toFixed(1)}%</td>
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
    const {
      data,
      constraints,
      session,
      groupSize,
      addToGroup,
      createGroup,
      setMismatches,
    } = this.props;

    const constraintObject = Object.keys(constraints).reduce((prev, current) => (
      prev.concat(
        constraints[current].map((count, index) => ({
          category: current,
          target: DEMOGRAPHIC_METRICS[current].columns[index].value,
          count,
        }))
      )
    ), [])
    .filter(constraint => Number.isInteger(constraint.count));
    console.log('Constraints', constraintObject);

    const focusGroup = selectFocusGroup(data, constraintObject, groupSize);
    const unmetCriteria = calculateUnmetCriteria(focusGroup, constraintObject);
    const accuracy = getAccuracyOfFocusGroup(focusGroup, constraintObject);
    console.log('Group created, accuracy:', accuracy);

    // set members of the group as selected
    Object.keys(focusGroup).forEach((key) => {
      addToGroup(focusGroup[key].id, session);
    });

    setMismatches(unmetCriteria);
    createGroup(session);

    store.dispatch(push('/'));
  }

  handleGroupSizeChange = (event) => {
    const { setGroupSize } = this.props;
    const { valueAsNumber } = event.target;

    setGroupSize(valueAsNumber);
  }

  handleSessionChange = (event) => {
    const { setSession } = this.props;
    const { value } = event.target;

    setSession(value);
  }

  gotoHome = () => this.context.store.dispatch(push('/'));

  render() {
    const {
      groupSize,
      session,
      filterOptions: { availability },
    } = this.props;

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
          {Object.keys(DEMOGRAPHIC_METRICS).map((key) => (
            <div className={styles.contraintSet} key={key}>
              <h5>{capitalize(key)}</h5>
              {this.getConfigurationTable(key)}
            </div>
            ))}
          <div className={styles.groupSize}>
            <h5>
              Session:
              <select
                name="session"
                value={session}
                defaultValue=""
                onChange={this.handleSessionChange}
              >
                <option disabled value=""> -- Select a session -- </option>
                {availability && availability.map(o => (
                  <option value={o}>{o}</option>
                ))}
              </select>
            </h5>
          </div>
          <div className="actionBar">
            <Button onClick={this.gotoHome}>Cancel</Button>
            <Button
              color="primary"
              onClick={this.handleCreate}
              disabled={!session}
            >
              Create
            </Button>
          </div>
          {!session && (
            <Alert color="warning">
              Please select a session for this group.
            </Alert>
          )}
        </div>
      </div>
    );
  }
}
