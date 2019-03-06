import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DetailTable extends Component {
  static propTypes = {
    dataSource: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      dataIndex: PropTypes.any,
      render: PropTypes.func,
      colSpan: PropTypes.number,
    })),
    columnCount: PropTypes.number,
    tableClassName: PropTypes.string,
    labelCellClassName: PropTypes.string,
    valueCellClassName: PropTypes.string,
    emptyCellClassName: PropTypes.string,
    autoHidden: PropTypes.bool,
  }

  static defaultProps = {
    dataSource: [],
    columnCount: 6,
    autoHidden: false,
    tableClassName: 'kb-detail-table',
    labelCellClassName: 'kb-detail-table-label',
    valueCellClassName: 'kb-detail-table-value',
    emptyCellClassName: 'kb-detail-table-empty',
  }

  renderEmptyCell = (idx, colSpan) => (
    <td key={`empty_cell-${idx}`} className={this.props.emptyCellClassName} colSpan={colSpan} />
  )

  renderCellPair = ({ label, dataIndex, colSpan = 1, render, className = '' }, idx) => ([
    <td key={`cell_label-${idx}`} className={this.props.labelCellClassName}>{label}</td>,
    <td key={`cell_value-${idx}`} className={`${this.props.valueCellClassName} ${className}`} colSpan={colSpan}>{render ? render() : dataIndex}</td>,
  ])
  renderTbody = () => {
    const { dataSource, columnCount, autoHidden } = this.props;
    const rows = [];
    let rowIdx = 0;
    let row = [];
    let colSpanCount = 0;
    for (let idx = 0; idx < dataSource.length; idx++) {
      const cellData = dataSource[idx];
      const isSkipped = typeof cellData.dataIndex === 'undefined';// 如果某个字段不存在则跳过渲染
      if (!isSkipped || !autoHidden) {
        const cellPair = this.renderCellPair(cellData, idx);
        const { colSpan = 1 } = cellData;
        // 如果当前行已经放不下新单元格
        if (colSpan + colSpanCount + 1 > columnCount) {
          // 先用空单元格补齐当前行
          /* eslint-disable max-depth */
          if (columnCount > colSpanCount) {
            row.push(this.renderEmptyCell(rowIdx, columnCount - colSpanCount));
          }
          // 输出当前行
          rows.push(<tr key={`row-${rowIdx++}`}>{row}</tr>);
          // 再另起一行，将新单元格放入新行
          row = [].concat(cellPair);
          colSpanCount = colSpan + 1;
        } else {
          row = row.concat(cellPair);
          colSpanCount = colSpanCount + colSpan + 1;
        }
      }
    }
    // 如有必要，用空单元格补齐最后一行
    if (columnCount > colSpanCount) {
      row.push(this.renderEmptyCell(rowIdx, columnCount - colSpanCount));
    }
    // 输出最后一行
    rows.push(<tr key={`row-${rowIdx++}`}>{row}</tr>);
    return rows;
  }
  render() {
    const { tableClassName } = this.props;
    const rows = this.renderTbody();

    return (
      <table className={tableClassName}>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

export default DetailTable;
