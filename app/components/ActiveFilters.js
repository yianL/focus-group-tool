/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import { COLUMNS, NAME2LABEL } from '../utils/constants';
import styles from './ActiveFilters.css';

class ActiveFilters extends PureComponent {

 
  render() {
    const { filters, removeFilter } = this.props;

    return (
      <ul className={styles.activeFilters}>
        {filters.map(filter => (
          <li>
            {`${NAME2LABEL[filter.name]}: ${filter.value}`}
            <button
              type="button"
              onClick={() => removeFilter(filter.name)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    );
  }
}


export default ActiveFilters;
