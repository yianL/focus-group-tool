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
  unsavedChanges: false,
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
  },
  {
    header: 'Email',
    width: WIDTH.long,
    name: 'email',
  },
  {
    header: 'Last Checked-in',
    width: WIDTH.long,
    name: 'lastFocusGroupDate',
    renderer: (value) => { return value ? moment(value).format('MM/DD/YYYY') : '---'; },
  },
  {
    header: 'Available',
    width: WIDTH.boolean,
    name: 'released',
    renderer: (value) => value ? (
      <Button color="success" size="sm">Yes</Button>
    ) : (
      <Button color="danger" size="sm">No</Button>
    ),
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
      this.setState({
        data: data.map(d => ({
          ...d,
          selected: false,
        }))
      });
    }
  }

  onSelectRow = (row) => {
    const { data } = this.state;
    const idx = data.findIndex(d => d === row);

    const newData = data.slice(0, idx)
      .concat({ ...row, selected: !row.selected })
      .concat(data.slice(idx + 1));

    this.setState({ data: newData });
  }

  onRelease = () => this.onSetReleased(true)

  onUnrelease = () => this.onSetReleased(false)

  onSetReleased = (released) => {
    const { data } = this.state;
    const newData = data.map(d => d.selected ? ({
      ...d,
      released,
    }) : d);

    this.setState({
      data: newData,
      unsavedChanges: true,
    });
  }

  getColumnWidth = ({ index }) => COLUMNS[index].width;

  gotoHome = () => this.context.store.dispatch(push('/'));

  unselectAll = () => {
    const { data } = this.state;
    const newData = data.map(d => d.selected ? ({
      ...d,
      selected: false,
    }) : d);

    this.setState({ data: newData });
  }

  saveAndGoHome = () => {
    const { data } = this.state;
    data.forEach(d => delete d.selected);
    ipcRenderer.once('db-done', () => this.context.store.dispatch(push('/')));
    ipcRenderer.send('db-set', { key: 'pastParticipants', data });
  }

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
          <Button outline color="secondary" onClick={() => this.onSelectRow(datum)}>
            {datum.selected ? (
              <i className="fa fa-fw fa-check action" />
            ) : (
              <i className="fa fa-fw action" />
            )}
          </Button>
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
    const { data, unsavedChanges } = this.state;
    const selectedCount = data.reduce((prev, cur) => cur.selected ? (prev + 1) : prev, 0);

    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <NavbarBrand>Focus Group Tool</NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              {unsavedChanges ? (
                <Button outline color="secondary" onClick={this.saveAndGoHome}>
                  <i className="fa fa-chevron-circle-left fa-fw" />
                  Save & Back
                </Button>
              ) : (
                <Button outline color="secondary" onClick={this.gotoHome}>
                  <i className="fa fa-chevron-circle-left fa-fw" />
                  Back
                </Button>
              )}
            </NavItem>
          </Nav>
        </Navbar>
        <div className="container" data-tid="container">
          <div>
            <span>
              {selectedCount} Selected
            </span>
            <Button outline color="info" size="sm" onClick={this.onRelease}>
              Set Available
            </Button>
            <Button outline color="info" size="sm" onClick={this.onUnrelease}>
              Set Unavailable
            </Button>
            <Button outline color="info" size="sm" onClick={this.unselectAll}>
              Unselect All
            </Button>
          </div>
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
