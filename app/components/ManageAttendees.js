/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import moment from 'moment';
import { push } from 'react-router-redux';
import { ipcRenderer } from 'electron';
import { AutoSizer, MultiGrid } from 'react-virtualized';
import {
  Button,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
} from 'reactstrap';
import { WIDTH } from '../utils/constants';
import {
  STYLE_BASE,
  STYLE_BOTTOM_LEFT_GRID,
  STYLE_TOP_LEFT_GRID,
  STYLE_TOP_RIGHT_GRID,
} from './GridStyles';
import styles from './ResponseTable.css';


const InitialState = {
  data: [],
  sortBy: null,
  sortDirection: 'asc',
  nameFilter: null,
  dateFilter: null,
};

const COLUMNS = [
  {
    header: 'Selected',
    width: WIDTH.action,
  },
  {
    header: 'Full Name',
    width: WIDTH.long,
    name: 'name',
    search: true,
  },
  {
    header: 'Email',
    width: WIDTH.long,
    name: 'email',
    search: true,
  },
  {
    header: 'Last Checked-in',
    width: WIDTH.long,
    name: 'lastFocusGroupDate',
    renderer: (value) => { return value ? moment(value).format('MM/DD/YYYY') : '---'; },
  },
  {
    header: 'Released',
    width: WIDTH.boolean,
    name: 'released',
    filter: 'BOOLEAN',
    renderer: (value) => { return value ? 'Yes' : 'No'; },
  },
  {
    header: 'First Added Date',
    width: WIDTH.short,
    name: 'createdAt',
    renderer: (value) => { return value ? moment(value).format('MM/DD/YYYY') : '---'; },
  },
];


class ManageAttendees extends PureComponent {
  static contextTypes = {
    store: PropTypes.any,
  };

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = InitialState;
  }

  componentWillMount() {
    ipcRenderer.on('db-got', this.onDBGot);
  }

  componentDidMount() {
    ipcRenderer.send('db-get', { key: 'pastParticipants' });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('db-got');
  }

  onDBGot = (event, { key, data }) => {
    if (key === 'pastParticipants') {
      this.setState({ data });
    }
  }

  gotoHome = () => this.context.store.dispatch(push('/'));

  getColumnWidth = ({ index }) => COLUMNS[index].width;

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const {
      data,
    } = this.state;
    const column = COLUMNS[columnIndex];

    if (rowIndex === 0) {
      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          <div className={styles.headerDiv} title={column.header}>
            {column.header}
          </div>
          {(column.search || column.filter) && (
            <i
              className="fa fa-filter action"
              title="Filters"
              onClick={() => this.handleOpenModal(column)}
            />
          )}
        </div>
      );
    }

    const id = rowIndex - 1;
    const datum = data[id];
    const { renderer } = column;
    const columnName = column.name;

    if (columnIndex === 0) {
      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          <Button outline color="secondary"></Button>
        </div>
      );
    }

    return (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {renderer ? renderer(datum[columnName]) : datum[columnName]}
      </div>
    );
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarBrand>Focus Group Tool</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button color="secondary" onClick={this.gotoHome}>
                <i className="fa fa-chevron-circle-left fa-fw" />
                Back
              </Button>
            </NavItem>
          </Nav>
        </Navbar>
        <div className="container" data-tid="container">
          {data.length > 0 && (
            <AutoSizer disableHeight>
              {({ width }) => (
                <MultiGrid
                  list={data}
                  fixedColumnCount={1}
                  fixedRowCount={1}
                  cellRenderer={this.cellRenderer}
                  columnWidth={this.getColumnWidth}
                  columnCount={6}
                  height={500}
                  rowHeight={40}
                  rowCount={data.length + 1}
                  style={STYLE_BASE}
                  styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
                  styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
                  styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
                  width={width}
                />
              )}
            </AutoSizer>
          )}
        </div>
      </div>
    );
  }
}

export default ManageAttendees;
