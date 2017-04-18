/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import { AutoSizer, MultiGrid } from 'react-virtualized';
import { COLUMNS, DEMOGRAPHIC_METRICS } from '../utils/constants';
import { capitalize } from '../utils/helpers';
import styles from './FocusGroupTable.css';

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

class FocusGroupTable extends PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.any).isRequired,
    constraints: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.columns = this.getColumns(props.constraints);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.constraints !== this.props.constraints) {
      this.columns = this.getColumns(nextProps.constraints);
    }
  }

  getColumnWidth = ({ index }) => index < 3 ? COLUMNS[index].width : 80;

  getColumns = (constraints) => COLUMNS.slice(0, 3).concat(
    Object.keys(constraints).reduce((prev, current) => {
      const columnGroup = DEMOGRAPHIC_METRICS[current].columns;
      columnGroup[0].category = current;
      return prev.concat(columnGroup);
    }, [])
  )

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const {
      list,
    } = this.props;
    const column = this.columns[columnIndex];

    if (rowIndex === 0) {
      return (
        <div
          className={styles.CategoryCell}
          key={key}
          style={style}
        >
          {capitalize(column.category)}
        </div>
      );
    }

    if (rowIndex === 1) {
      const demoColumn = DEMOGRAPHIC_METRICS[column.name] || { style: {} };
      return (
        <div
          title={column.value}
          className={styles.Cell}
          key={key}
          style={{ ...style, ...demoColumn.style }}
        >
          {column.header || column.label}
        </div>
      );
    }

    const id = rowIndex - 2;
    const datum = list[id];
    const columnName = column.name;

    if (columnIndex === 0) {
      const { removeFromGroup } = this.props;
      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          <i
            className="fa fa-user-times action"
            title="Remove from group"
            onClick={() => removeFromGroup(datum.id)}
          />
        </div>
      );
    }

    if (columnIndex < 3) {
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

    return (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {datum[columnName].startsWith(column.value) ? 'O' : ''}
      </div>
    );
  }

  render() {
    const { list } = this.props;

    return (
      <div className={styles.list}>
        <AutoSizer disableHeight>
          {({ width }) => (
            <MultiGrid
              list={list}
              fixedColumnCount={3}
              fixedRowCount={2}
              cellRenderer={this.cellRenderer}
              columnWidth={this.getColumnWidth}
              columnCount={this.columns.length}
              height={260}
              rowHeight={40}
              rowCount={list.length > 0 ? list.length + 2 : 0}
              style={STYLE}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default FocusGroupTable;
