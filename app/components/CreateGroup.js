// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './CreateGroup.css';

const constraints = {
  education: {},
  age: {},
  income: {},
};

export default class CreateGroup extends Component {
  render() {
    return (
      <div>
        <h1>Create Focus Group</h1>
        <Link to="/">Cancel</Link>
      </div>
    );
  }
}
