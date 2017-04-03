// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { DEMOGRAPHIC_METRICS } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import { selectFocusGroup, calculateUnmetCriteria, getAccuracyOfFocusGroup } from '../utils/algorithms';
import styles from './CreateGroup.css';

export default class CreateGroup extends Component {

  getConfigurationTable = (key) => {
    const { constraints, groupSize } = this.props;
    const { columns } = DEMOGRAPHIC_METRICS[key];
    const constraint = constraints[key] || [];
    const sum = constraint.reduce((prev, current) => prev + current, 0);

    return (
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((col) => (
              <th>{col.value}</th>
            ))}
            <th className={styles.summaryColumn}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Count</td>
            {columns.map((col, index) => (
              <td>
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
              <td>
                {isNaN(constraint[index]) ? '--' : `${(constraint[index] * 100 / groupSize).toFixed(1)}%`}
              </td>
            ))}
            <td>{(sum * 100 / groupSize).toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    );
  }

  handleConstraintChange = (event) => {
    const { setConstraint } = this.props;
    const { valueAsNumber, name } = event.target;
    const nameAndIndex = name.split('|');
    setConstraint(nameAndIndex[0], nameAndIndex[1], valueAsNumber);
  }

  handleCreate = () => {
    const { data, constraints, groupSize, dispatch, addToGroup } = this.props;

    const constraintObject = Object.keys(constraints).reduce((prev, current) => (
      prev.concat(
        constraints[current].map((count, index) => ({
          category: current,
          target: DEMOGRAPHIC_METRICS[current].columns[index].value,
          count,
        }))
      )
    ), []);

    const focusGroup = selectFocusGroup(data, constraintObject, groupSize);
    console.log(focusGroup);
    const unmetCriteria = calculateUnmetCriteria(focusGroup, constraintObject);
    console.log(unmetCriteria);
    const accuracy = getAccuracyOfFocusGroup(focusGroup, constraintObject);
    console.log(accuracy);

    // set members of the group as selected
    Object.keys(focusGroup).forEach((key) => {
      addToGroup(focusGroup[key].id);
    });

    dispatch(push('/'));
  }

  handleGroupSizeChange = (event) => {
    const { setGroupSize } = this.props;
    const { valueAsNumber } = event.target;

    setGroupSize(valueAsNumber);
  }

  render() {
    const {
      groupSize,
    } = this.props;

    return (
      <div className={styles.createGroup}>
        <h2>
          <Link to="/">
            <i className="fa fa-chevron-circle-left fa-fw" ariaHidden="true" />
          </Link>
          Create Focus Group
        </h2>
        <div className={styles.groupSize}>
          <h3>
            Group Size:
            <input
              type="number"
              name="groupSize"
              value={groupSize}
              onChange={this.handleGroupSizeChange}
            />
          </h3>
        </div>
        {Object.keys(DEMOGRAPHIC_METRICS).map((key) => {
          return (
            <div className={styles.contraintSet} key={key}>
              <h3>{capitalize(key)}</h3>
              {this.getConfigurationTable(key)}
            </div>
          );
        })}
        <button><Link to="/">Cancel</Link></button>
        <button onClick={this.handleCreate}>Create</button>
      </div>
    );
  }
}
