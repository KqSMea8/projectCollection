import React from 'react';
import { Link } from 'react-router';
import permission from '@alipay/kb-framework/framework/permission';
import moment from 'moment';
import { Modal, Tooltip, Dropdown, Menu, Icon, message } from 'antd';
import './AreaCard.less';
import ajax from 'Utility/ajax';
const confirm = Modal.confirm;

const AreaCard = React.createClass({
  getInitialState() {
    return {};
  },

  showClearConfirm(id) {
    confirm({
      title: '确认清除当前网格区下的所有门店吗？',
      onOk: () => {
        this.props.clear(id);
      },
      onCancel: () => {},
    });
  },

  download(id, cityId) {
    const downloadPath = `${window.APP.crmhomeUrl}/shop/koubei/territory/exportShop.json?_input_charset=ISO8859-1&territoryId=${id}&cityId=${cityId}`;
    window.open(downloadPath);
  },

  deleteTerritory(territory) {
    confirm({
      title: `确认删除“${territory.territoryName}”吗?`,
      content: '删除后，门店中相应的网格名也会清除，请慎重操作',
      onOk: () => {
        ajax({
          url: window.APP.crmhomeUrl + '/shop/koubei/territory/delete.json',
          method: 'post',
          data: {
            territoryId: territory.territoryId,
          },
          type: 'json',
          success: (result) => {
            if (result.status && result.status === 'succeed') {
              message.success('删除成功', 3);
              if (this.props.doReloadList) this.props.doReloadList();
            }
          },
          error: (results) => {
            message.error(results && results.resultMsg || '请求失败');
          },
        });
      },
    });
  },
  resetTerritory(item) {
    Modal.info({
      title: `新圈入数据将覆盖旧的门店数据`,
      onOk: () => {
        location.hash = `/cityarea/config/${item.territoryId}?areaName=${encodeURIComponent(item.territoryName)}&citycode=${item.cityCode}&cityName=${encodeURIComponent(item.cityName)}&action=update`;
      },
    });
  },

  render() {
    const item = this.props.data;
    const hasTerritory = (item.territoryShopCount > 0) || (item.territoryLeadsCount !== undefined && item.territoryLeadsCount > 0);
    return (
      <div className="area-wrapper">
        <div className="area-detail" style={{background: hasTerritory ? '#f2f2f2' : '#ffc'}}>
          <h2>{item.territoryName}</h2>
          <p className="remark">
            {item.memo && item.memo.substring(0, 17)}
            {item.memo && item.memo.length > 17 && <Tooltip title={item.memo}><span style={{ color: 'blue'}}>...</span></Tooltip>}
          </p>
          <p>
            更新时间：{moment(item.gmtModified).format('YYYY-MM-DD')}
          </p>
        </div>
        <div className="area-action">
          {(() => {
            if (item.has_been_locked === 'T') {
              return <span style={{color: '#999'}}>门店数和leads数：数据待生效，请稍后查看</span>;
            }

            return (<div>
              <div>
                门店数: <span style={{color: item.territoryShopCount ? '#666' : '#fc6620', marginRight: 12}}>{item.territoryShopCount}</span>
                leads数: <span style={{color: item.territoryLeadsCount ? '#666' : '#fc6620'}}>{item.territoryLeadsCount}</span>
              </div>
              <div>
                { (!hasTerritory && permission('TERRITORY_MANAGE')) && (<Link to={{
                  pathname: `/cityarea/config/${item.territoryId}`,
                  query: { areaName: item.territoryName, citycode: item.cityCode, cityName: item.cityName, action: 'create' },
                }}>立即配置</Link>) }
                { (hasTerritory && permission('TERRITORY_MANAGE')) && (<a href="#" onClick={(e) => { e.preventDefault(); this.resetTerritory(item); }}>重新配置</a>) }
                { (hasTerritory && permission('TERRITORY_MANAGE')) && <Link target="_blank" to={{
                  pathname: `/cityarea/manager/edit`,
                  query: { territoryId: item.territoryId, cityCode: item.cityCode, parentId: item.parentId, territoryName: item.territoryName, territoryMemo: item.memo },
                }}>修改网格</Link> }
                <Dropdown
                  trigger={['click']}
                  overlay={(<Menu>
                    {[
                      hasTerritory && <Menu.Item key="1">
                        <span onClick={() => { this.download(item.territoryId, item.cityCode); }}>下载门店leads</span>
                      </Menu.Item>,
                      hasTerritory && <Menu.Item key="2">
                        <span onClick={() => { this.showClearConfirm(item.territoryId); }}>清除已圈选的</span>
                      </Menu.Item>,
                      <Menu.Item key="3">
                        <span onClick={() => { this.deleteTerritory(item); }}>删除网格</span>
                      </Menu.Item>,
                    ].filter(i => i)}
                  </Menu>)}
                >
                  <a className="ant-dropdown-link">更多<Icon type="down" /></a>
                </Dropdown>
              </div>
            </div>);
          })()}
        </div>
      </div>
    );
  },
});

export default AreaCard;
