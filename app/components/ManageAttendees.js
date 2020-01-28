/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import cn from 'classnames';
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
  Form,
  Input,
  FormGroup,
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
  filteredData: null,
  unsavedChanges: false,
  sortBy: null,
  sortAscending: true,
  nameFilter: '',
};

const ASC = (key) => (a, b) => a[key] - b[key];
const DESC = (key) => (a, b) => b[key] - a[key];

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

  onClear = () => {
    this.setState({
      nameFilter: '',
      filteredData: null,
    });
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

  onSearchChange = (event) => {
    this.setState({
      nameFilter: event.target.value,
    });
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

  onSetRow = (row, released) => {
    const { data } = this.state;
    const newData = data.map(d => d === row ? ({
      ...d,
      released,
    }) : d);

    this.setState({
      data: newData,
      unsavedChanges: true,
    });
  }

  onSort = (key) => {
    const { data, sortAscending, sortBy } = this.state;
    let newSortAscending;

    if (sortBy === key) {
      newSortAscending = !sortAscending;
    } else {
      newSortAscending = true;
    }

    const newData = data.sort(newSortAscending ? ASC(key) : DESC(key));

    this.setState({
      data: [...newData],
      sortBy: key,
      sortAscending: newSortAscending,
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    const {
      nameFilter,
      data,
    } = this.state;

    if (!!nameFilter) {
      const filter = nameFilter.toLowerCase();
      this.setState({
        filteredData: data.filter(d =>
          d.name.toLowerCase().includes(filter) || d.email.toLowerCase().includes(filter))
      });
    } else {
      this.setState({
        filteredData: null,
      });
    }
  }

  getColumnWidth = ({ index }) => this.Columns[index].width;

  gotoHome = () => this.context.store.dispatch(push('/'));

  Columns = [
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
      sort: true,
      renderer: (value) => { return value ? moment(value).format('MM/DD/YYYY') : '---'; },
    },
    {
      header: 'Available',
      width: WIDTH.boolean,
      name: 'released',
      renderer: (value, row) => value ? (
        <Button color="success" size="sm" onClick={() => this.onSetRow(row, false)}>Yes</Button>
      ) : (
        <Button color="danger" size="sm" onClick={() => this.onSetRow(row, true)}>No</Button>
      ),
    },
    {
      header: 'First Added Date',
      width: WIDTH.short,
      name: 'createdAt',
      sort: true,
      renderer: (value) => { return value ? moment(value).format('MM/DD/YYYY') : '---'; },
    },
  ];

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
      sortBy,
      sortAscending,
    } = this.state;
    const column = this.Columns[columnIndex];

    if (rowIndex === 0) {
      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          <div className={styles.headerDiv} title={column.header}>
            {column.sort ? (
              <button type="button" onClick={() => this.onSort(column.name)}>
                <span>{column.header}</span>
                {sortBy === column.name && sortAscending !== undefined ? (
                  <i className={cn('fa', 'fa-fw', sortAscending ? 'fa-sort-asc' : 'fa-sort-desc')} />
                ) : undefined}
              </button>
            ) : column.header}
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

    const { nameFilter } = this.state;

    if (!!nameFilter && (columnName === 'name' || columnName === 'email')) {
      const str = datum[columnName];
      const idx = str.toLowerCase().indexOf(nameFilter.toLowerCase());
      if (idx > -1) {
        return (
          <div
            className={styles.Cell}
            key={key}
            style={style}
          >
            <span>{str.substr(0, idx)}</span>
            <span className={styles.highlighted}>{str.substr(idx, nameFilter.length)}</span>
            <span>{str.substr(idx + nameFilter.length)}</span>
          </div>
        );
      }
    }

    return (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {renderer ? renderer(datum[columnName], datum) : datum[columnName]}
      </div>
    );
  }

  render() {
    const { data, filteredData, unsavedChanges, nameFilter } = this.state;
    const selectedCount = data.reduce((prev, cur) => cur.selected ? (prev + 1) : prev, 0);

    const dataset = filteredData || data;

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
            <Form
              inline
              onSubmit={this.onSubmit}
            >
              <div>
                Showing { dataset.length } out of { data.length } records
              </div>
              <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                <Input
                  type="text"
                  name="nameSearch"
                  placeholder={'eg. "jonh"'}
                  onChange={this.onSearchChange}
                  value={nameFilter}
                />
              </FormGroup>
              <Button>Search</Button>
              <Button type="button" onClick={this.onClear}>Clear</Button>
            </Form>

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
                  list={dataset}
                  fixedColumnCount={1}
                  fixedRowCount={1}
                  cellRenderer={this.cellRenderer}
                  columnWidth={this.getColumnWidth}
                  columnCount={6}
                  height={500}
                  rowHeight={40}
                  rowCount={dataset.length + 1}
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
