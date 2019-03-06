import './CityAreaManage.less';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import {Modal, Button, message, Spin} from 'antd';
import moment from 'moment';
const confirm = Modal.confirm;
const CityAreaManageArea = React.createClass({
  propTypes: {
    addCity: PropTypes.func,
    cityId: PropTypes.string,
    cityCode: PropTypes.string,
    parentName: PropTypes.string,
    title: PropTypes.string,
    fetchCity: PropTypes.func,
  },
  getInitialState() {
    return {
      data: {},
      loading: false,
    };
  },

  componentDidMount() {
    if (this.props.cityId) {
      this.fetch();
    }
  },
  componentDidUpdate(prevProps) {
    if (this.props.cityId !== prevProps.cityId && this.props.cityId) {
      this.fetch();
    }
  },
  fetch() {
    const params = {
      territoryId: this.props.cityId,
    };
    this.setState({loading: false});
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/territory/queryDetail.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (results) => {
        if (results.status && results.status === 'succeed') {
          this.setState({
            data: results.data || {},
            loading: true,
          });
        }
      },
      error: (results) =>{
        if (results.resultMsg) {
          message.error(results.resultMsg);
        }
      },
    });
  },
  // 修改
  handleModify() {
    this.props.addCity('area', this.state.data);
  },
  // 删除
  handleDelete() {
    const self = this;
    const {data} = this.state;
    confirm({
      title: `确认删除“${data.territoryName}”吗?`,
      content: '删除后，门店中相应的网格名也会清除，请慎重操作',
      onOk() {
        const params = {
          territoryId: self.props.cityId,
        };
        ajax({
          url: window.APP.crmhomeUrl + '/shop/koubei/territory/delete.json',
          method: 'post',
          data: params,
          type: 'json',
          success: (result) => {
            if (result.status && result.status === 'succeed') {
              const submitkey = {
                cityKey: self.props.cityCode,
                delete: true,
                parentName: self.props.parentName,
                title: self.props.title,
              };
              self.props.fetchCity(submitkey);
              message.success('删除成功', 3);
            }
          },
          error: (results) =>{
            if (results.resultMsg) {
              message.error(results.resultMsg);
            }
          },
        });
      },
    });
  },
  render() {
    const {data, loading} = this.state;
    return (<div className="right-area-panel">{loading ?
        (<div><div className="add-header">{data.territoryName}
          <div className="add-header-button">
            <Button type="ghost" onClick={this.handleModify}>修改</Button>
            <Button type="ghost" style={{marginLeft: 12}} onClick={this.handleDelete}>删除</Button>
          </div>
        </div>
        <div className="right-area-conter">
          <table className="kb-detail-table-2">
            <tbody>
              <tr>
                <td className="kb-detail-table-label">创建时间</td>
                <td>{data.gmtCreate && moment(data.gmtCreate).format('YYYY-MM-DD HH:mm')}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">备注</td>
                <td>{data.memo}</td>
              </tr>
            </tbody>
          </table>
        </div></div>) : <div style={{margin: 20}}><Spin/></div>
      }</div>
    );
  },
});

export default CityAreaManageArea;


