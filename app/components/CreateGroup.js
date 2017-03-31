// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { DEMOGRAPHIC_METRICS } from '../utils/constants';
import styles from './CreateGroup.css';

const constraints = {
  education: {},
  age: {},
  income: {},
};

export default class CreateGroup extends Component {

  getConfigurationTable = (key) => {
    const { columns } = DEMOGRAPHIC_METRICS[key];

    return (
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map((col) => (
              <th>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Count</td>
            {columns.map((col) => (
              <td>
                <input className={styles.countField} type="number" name={col.label} />
              </td>
            ))}
          </tr>
          <tr>
            <td>Percentile</td>
            {columns.map(() => (
              <td>

              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className={styles.createGroup}>
        <h1>Create Focus Group</h1>
        <Link to="/">Cancel</Link>
        {Object.keys(DEMOGRAPHIC_METRICS).map((key) => {
          return (
            <div className={styles.contraintSet} key={key}>
              <h3>{key}</h3>
              {this.getConfigurationTable(key)}
            </div>
          );
        })}
        <Link to="/">Cancel</Link>
        <button>Create</button>
      </div>
    );
  }
}
