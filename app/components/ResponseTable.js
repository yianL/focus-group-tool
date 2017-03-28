/**
 * @flow
 */
import cn from 'classnames';
import React, { PropTypes, PureComponent } from 'react';
import { AutoSizer, MultiGrid } from 'react-virtualized';
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

const WIDTH = {
  action: 60,
  boolean: 80,
  short: 120,
  medium: 180,
  long: 240,
};

const COLUMNS = [
  { header: 'Actions', width: WIDTH.action },
  { header: 'Full Name', width: WIDTH.long },
  { header: 'Email', width: WIDTH.long },
  { header: 'Participated in a focus group', width: WIDTH.boolean },
  { header: 'What kind', width: WIDTH.short },
  { header: 'Participated in a jury research project', width: WIDTH.boolean },
  { header: 'Hear well', width: WIDTH.boolean },
  { header: 'Read and write', width: WIDTH.boolean },
  { header: 'See well enough', width: WIDTH.boolean },
  { header: 'Mobile phone', width: WIDTH.boolean },
  { header: 'Jury duty', width: WIDTH.boolean },
  { header: 'Civil lawsuit', width: WIDTH.boolean },
  { header: 'Zip code', width: WIDTH.short },
  { header: 'Registered voter', width: WIDTH.boolean },
  { header: 'California driver\'s license', width: WIDTH.boolean },
  /* START demographic metrics */
  { header: 'Education', width: WIDTH.long },
  { header: 'Age', width: WIDTH.short },
  { header: 'Ethnicity', width: WIDTH.medium },
  { header: 'Gender', width: WIDTH.boolean },
  { header: 'Married', width: WIDTH.boolean },
  { header: 'Income', width: WIDTH.medium },
  { header: 'Children', width: WIDTH.boolean },
  { header: 'Employed', width: WIDTH.short },
  /* END demographic metrics */
  { header: 'Occupation', width: WIDTH.medium },
  { header: 'Know anyone who works in the news', width: WIDTH.boolean },
  { header: 'Political issues', width: WIDTH.boolean },
  { header: 'Economic issues', width: WIDTH.boolean },
  { header: 'Social issues', width: WIDTH.boolean },
  { header: 'There are too many lawsuits', width: WIDTH.boolean },
  { header: 'Jury awards are too large', width: WIDTH.boolean },
  { header: 'Lawsuits cost us all too much', width: WIDTH.boolean },
];

class ResponseTable extends PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  getColumnWidth = ({ index }) => COLUMNS[index].width;

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const {
      list,
    } = this.props;
    const datum = list[rowIndex];

    return rowIndex === 0 ? (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {COLUMNS[columnIndex].header}
      </div>
    ) : (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {columnIndex === 1 ? datum['Full name:'] : `${columnIndex}, ${rowIndex}`}
      </div>
    );
  }

  render() {
    const { list } = this.props;

    return (
      <div className={styles.list}>
        {
          list.length === 0 && (
            <div className={styles.noRows}>
              No rows
            </div>
          )
        }
        <AutoSizer disableHeight>
          {({ width }) => (
            <MultiGrid
              fixedColumnCount={list.length > 0 ? 2 : 0}
              fixedRowCount={list.length > 0 ? 1 : 0}
              cellRenderer={this.cellRenderer}
              columnWidth={this.getColumnWidth}
              columnCount={COLUMNS.length}
              height={300}
              rowHeight={40}
              rowCount={list.length}
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


export default ResponseTable;
