/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import { AutoSizer, MultiGrid } from 'react-virtualized';
import { COLUMNS, STATES } from '../utils/constants';
import styles from './ResponseTable.css';

const STYLE = {
  border: '1px solid #ddd',
  backgroundColor: '#ffffff',
};
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold'
};
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold'
};

class ResponseTable extends PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  getColumnWidth = ({ index }) => COLUMNS[index].width;

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const {
      list,
    } = this.props;

    if (rowIndex === 0) {
      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          {COLUMNS[columnIndex].header}
        </div>
      );
    }

    const id = rowIndex - 1;
    const datum = list[id];
    const columnName = COLUMNS[columnIndex].name;

    if (columnIndex === 0) {
      const { addToGroup, markAsUnavailable, markAsAvailable } = this.props;

      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          {datum.state !== STATES.UNAVAILABLE && (
            <button
              type="button"
              onClick={() => addToGroup(datum.id)}
            >
              +
            </button>
          )}
          {datum.state !== STATES.UNAVAILABLE && (
            <button
              type="button"
              onClick={() => markAsUnavailable(datum.id)}
            >
              X
            </button>
          )}
          {datum.state === STATES.UNAVAILABLE && (
            <button
              type="button"
              onClick={() => markAsAvailable(datum.id)}
            >
              O
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {datum[columnName]}
      </div>
    );
  }

  render() {
    const { list } = this.props;

    return (
      <div className={styles.list}>
        {list.length === 0 && (
          <div className={styles.noRows}>
            No rows
          </div>
        )}
        {list.length > 0 && (
          <AutoSizer disableHeight>
            {({ width }) => (
              <MultiGrid
                list={list}
                fixedColumnCount={3}
                fixedRowCount={1}
                cellRenderer={this.cellRenderer}
                columnWidth={this.getColumnWidth}
                columnCount={COLUMNS.length}
                height={300}
                rowHeight={40}
                rowCount={list.length > 0 ? list.length + 1 : 0}
                style={STYLE}
                styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
                styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
                styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </div>
    );
  }
}


export default ResponseTable;
