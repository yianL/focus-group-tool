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
      <div className={styles.activeFilters}>
        <span>{filters.length > 0 ? 'Active Filters: ' : ' '}</span>
        <ul className={styles.filterList}>
          {filters.map(filter => (
            <li>
              {`${NAME2LABEL[filter.name]}: ${filter.value || '""'}`}
              <i
                className="fa fa-times-circle action"
                onClick={() => removeFilter(filter.name)}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}


export default ActiveFilters;
