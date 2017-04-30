/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import cn from 'classnames';
import { ipcRenderer } from 'electron';
import { AutoSizer, MultiGrid } from 'react-virtualized';
import {
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormGroup,
  Label,
} from 'reactstrap';
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

const InitialState = {
  showModal: false,
  activeColumn: {},
  selectedFilters: [],
};

class ResponseTable extends PureComponent {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.any).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = InitialState;
    this.shouldMarkAllUnavailable = props.list.reduce(
      (prev, current) => prev || current.state === STATES.DEFAULT
    , false);
  }

  componentWillReceiveProps(nextProps) {
    this.shouldMarkAllUnavailable = nextProps.list.reduce(
      (prev, current) => prev || current.state === STATES.DEFAULT
    , false);
  }

  onImportButtonClick = () => {
    ipcRenderer.send('open-file-dialog');
  }

  getColumnWidth = ({ index }) => COLUMNS[index].width;

  getSearchInputRef = ref => { this.searchInput = ref; }

  handleApplyFilter = () => {
    const { addFilter, removeFilter, filterOptions } = this.props;
    const { name, filter, search } = this.state.activeColumn;

    if (search) {
      const value = this.searchInput.value;

      this.setState(InitialState, () => {
        if (value) {
          addFilter(name, value);
        } else {
          removeFilter(name);
        }
      });
    } else if (filter) {
      const { selectedFilters } = this.state;

      this.setState(InitialState, () => {
        if (selectedFilters.length === filterOptions[name].length) {
          removeFilter(name);
        } else {
          addFilter(name, selectedFilters);
        }
      });
    }
  }

  handleCloseModal = () => this.setState(InitialState);

  handleOpenModal = (column) => {
    const { filters, filterOptions } = this.props;
    const activeFilter = filters.filter(f => f.name === column.name)[0];
    const selectedFilters = (activeFilter && activeFilter.value) ||
      filterOptions[column.name] || [];

    this.setState({
      showModal: true,
      activeColumn: column,
      selectedFilters,
    }, () => {
      if (this.searchInput) {
        const { activeColumn } = this.state;
        const filter = filters.filter(f => f.name === activeColumn.name)[0];

        this.searchInput.focus();
        if (filter) {
          this.searchInput.value = filter.value;
        }
      }
    });
  }

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const {
      list,
    } = this.props;
    const column = COLUMNS[columnIndex];

    if (rowIndex === 0) {
      if (columnIndex === 0) {
        return (
          <div
            className={styles.Cell}
            key={key}
            style={style}
          >
            {this.shouldMarkAllUnavailable && (
              <Button
                size="sm"
                color="danger"
                onClick={this.handleRemoveAll}
                title="Mark all as unavailable"
              >
                <i className="fa fa-fw fa-ban" />
              </Button>
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
    const datum = list[id];
    const columnName = column.name;

    if (columnIndex === 0) {
      const {
        addToGroup,
        markAsUnavailable,
        markAsAvailable,
        activeGroup
      } = this.props;

      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          {datum.state === STATES.DEFAULT && activeGroup && (
            <i
              className="fa fa-user-plus action"
              title="Add to group"
              onClick={() => addToGroup(datum.id, activeGroup)}
            />

          )}
          {datum.state === STATES.DEFAULT && (
            <i
              className="fa fa-ban action"
              title="Mark as unavailable"
              onClick={() => markAsUnavailable(datum.id)}
            />
          )}
          {datum.state === STATES.UNAVAILABLE && (
            <i
              className="fa fa-repeat action"
              title="Mark as available"
              onClick={() => markAsAvailable(datum.id)}
            />
          )}
        </div>
      );
    }

    return (
      <div
        className={cn(styles.Cell, datum.state === STATES.UNAVAILABLE && styles.no)}
        key={key}
        style={style}
      >
        {datum[columnName]}
      </div>
    );
  }

  handleRemoveAll = () => {
    const {
      list,
      markAsUnavailable,
    } = this.props;

    list.filter(person => person.state === STATES.DEFAULT)
      .forEach(person => markAsUnavailable(person.id));
  }

  toggleFilterOption = (e) => {
    const value = e.target.textContent;
    const { selectedFilters } = this.state;

    if (selectedFilters.includes(value)) {
      this.setState({
        selectedFilters: selectedFilters.filter(f => f !== value),
      });
    } else {
      this.setState({
        selectedFilters: selectedFilters.concat(value),
      });
    }
  }

  renderFilterOptions = () => {
    const { filterOptions } = this.props;
    const { activeColumn, selectedFilters } = this.state;
    const options = filterOptions[activeColumn.name];

    return (
      <ul className={styles.filters}>
        {options.map(option => (
          <li onClick={this.toggleFilterOption}>
            <i
              className={cn(
              'fa fa-fw',
              selectedFilters.includes(option) ? 'fa-check' : ''
            )}
            />
            {option}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { list, filters } = this.props;
    const { showModal, activeColumn } = this.state;

    return (
      <div className={styles.list}>
        {list.length === 0 && (
          <div className={styles.noRows}>
            {filters.length > 0
              ? 'No data: try disabling some filters to show more data'
              : (
                <p>
                  No data:
                  <Button
                    size="sm"
                    color="primary"
                    onClick={this.onImportButtonClick}
                  >
                    Import Responses Data
                  </Button>
                </p>
              )
            }
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
                height={260}
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

        <Modal
          isOpen={showModal}
          toggle={this.handleCloseModal}
        >
          <ModalHeader toggle={this.handleCloseModal}>{activeColumn.header}</ModalHeader>
          <ModalBody>
            {activeColumn.search && (
              <FormGroup>
                <Label for="search">Search by:</Label>
                <input
                  className="form-control"
                  type="text"
                  name="search"
                  id="search"
                  ref={this.getSearchInputRef}
                />
              </FormGroup>
            )}
            {activeColumn.filter && this.renderFilterOptions()}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleCloseModal}>Cancel</Button>{' '}
            <Button color="primary" onClick={this.handleApplyFilter}>Apply</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}


export default ResponseTable;
