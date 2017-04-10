/**
 * @flow
 */
import React, { PropTypes, PureComponent } from 'react';
import cn from 'classnames';
import { AutoSizer, MultiGrid } from 'react-virtualized';
import Modal from 'react-modal';
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

const STYLE_MODAL = {
  content: {
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
    position: 'relative',
    border: '1px solid rgb(204, 204, 204)',
    background: 'rgb(255, 255, 255)',
    overflow: 'auto',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px',
    width: '360px',
    margin: '50px auto',
  }
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
      return (
        <div
          className={styles.Cell}
          key={key}
          style={style}
        >
          {column.header}
          {(column.search || column.filter) && (
            <button
              type="button"
              onClick={() => this.handleOpenModal(column)}
            >
              O
            </button>
          )}
        </div>
      );
    }

    const id = rowIndex - 1;
    const datum = list[id];
    const columnName = column.name;

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
      <ul>
        {options.map(option => (
          <li onClick={this.toggleFilterOption}>
            <i className={cn(
              'fa fa-fw', 
              selectedFilters.includes(option) ? 'fa-check' : 'fa-minus'
            )} />
            {option}
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { list } = this.props;
    const { showModal, activeColumn } = this.state;
    
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

        <Modal
          isOpen={showModal}
          style={STYLE_MODAL}
          contentLabel="Minimal Modal Example"
        >
          <div className={styles.filterModal}>
            <h3>{activeColumn.header}</h3>
            {activeColumn.search && (
              <input name="search" ref={this.getSearchInputRef} />
            )}
            {activeColumn.filter && this.renderFilterOptions()}
            <button onClick={this.handleCloseModal}>Cancel</button>
            <button onClick={this.handleApplyFilter}>Apply</button>
          </div>
        </Modal>
      </div>
    );
  }
}


export default ResponseTable;
