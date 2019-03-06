import './CityAreaManage.less';
import React, {PropTypes} from 'react';
// import ajax from 'Utility/ajax';
import { Button} from 'antd';

const CityAreaManageCity = React.createClass({
  propTypes: {
    addCity: PropTypes.func,
    cityId: PropTypes.string,
    parentId: PropTypes.string,
    title: PropTypes.string,
    areaSum: PropTypes.number,
  },
  onClick() {
    this.props.addCity('city');
  },
  render() {
    return (
      <div className="right-area-panel">
        <div className="add-header">{this.props.title}
          <div className="add-header-button">
            <Button type="primary" onClick={this.onClick}>新增下级网格</Button>
          </div>
        </div>
        <div className="right-area-conter">
          <table className="kb-detail-table-2">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">网格数（个）</td>
                <td>{this.props.areaSum}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});

export default CityAreaManageCity;
