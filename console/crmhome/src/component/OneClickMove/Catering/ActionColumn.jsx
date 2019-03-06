import React, { PropTypes } from 'react';
import { Popconfirm, Tooltip, Icon, Dropdown, Menu } from 'antd';
import { saveJumpTo, getMerchantId } from '../../../common/utils';
const Item = Menu.Item;
export const ACTION_ENUM = {
  '1': '查看',
  '2': '编辑',
  '3': '置顶',
  '4': '取消置顶',
  '5': '审核通过',
  '6': '退回修改',
  '7': '删除',
  '10': '上架',
  '11': '下架',
};

/* eslint-disable */
function genUrl(type, data) {
  /* eslint-enable */
  let rtn;
  const loc = window.top.location;
  const port = loc.port ? `:${loc.port}` : '';
  const pid = getMerchantId();
  switch (type) {
  case '1':
    rtn = `${loc.protocol}//${loc.hostname}${port}${loc.pathname}${loc.search}#/catering/detail?`;
    if (data.itemId || data.sequenceId) {
      rtn += `itemId=${data.itemId || ''}`;
      rtn += `&sequenceId=${data.sequenceId || ''}`;
    }
    break;
  case '2':
    if (data.itemManageChannel === 'INTELLIGENT_MGS' && data.intelligentPlanId) {
      // 莫干山当前页面跳转
      const isIframe = window.top !== window;
      const system = isIframe ? 'crmhome' : 'sale';
      const url = `#/marketing/brands/detail/${data.intelligentPlanId}?system=${system}`;
      window.location.href = url;
      rtn = '';
    } else {
      rtn = `${loc.protocol}//${loc.hostname}${port}${loc.pathname}${loc.search}#/catering/edit?`;
      if (data.itemId || data.sequenceId) {
        rtn += `itemId=${data.itemId || ''}`;
        rtn += `&sequenceId=${data.sequenceId || ''}`;
      }
    }
    break;
  default:
  }
  if (!rtn) {
    return null;
  }
  if (pid) {
    rtn += `&pid=${pid}`;
  }
  return rtn;
}

function goto(url) {
  if (url) {
    saveJumpTo(url, window.top !== window ? '_blank' : undefined);
  }
}

export default class ActionColumn extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onConfirmDelegator: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data;
  }

  gotoLuopan = itemId => () => {
    saveJumpTo(`https://luopan.alipay.com/report/crmhome_report.htm?myreports=v2&url=report&pageUri=pageUri1515557326174&analysis=goods&itemId=${itemId}`, '_blank');
  }

  render() {
    const { operationMap = {} } = this.props.data;
    const menu = [];
    Object.keys(operationMap).forEach((key) => {
      const txt = ACTION_ENUM[key];
      if (key === '1') {
        return;
      }
      if (key === '2') {
        let editTxt = '';
        if (this.props.data.verifyFrequency === 'multi' && this.props.isIframe) {
          editTxt = (
            <Menu.Item>
              <span style={{ color: '#FF6600' }}>
                <Tooltip placement="top" title={'此商品仅限商户可编辑'}>
                  <Icon type="exclamation-circle" style={{ color: '#efce93', marginLeft: '5px' }} />
                </Tooltip>
              </span>
            </Menu.Item>
          );
        } else {
          editTxt = (
            <Menu.Item>
              <a key={key} onClick={() => { goto(genUrl(key, this.props.data)); }}>{txt}</a>
            </Menu.Item>
          );
        }
        menu.push(editTxt);
      } else {
        const title = `确定要${ACTION_ENUM[key]}商品？`;
        menu.push(
          <Menu.Item>
            <Popconfirm title={title} onConfirm={this.props.onConfirmDelegator(key, this.props.data)}>
              <a key={key}>{txt}</a>
            </Popconfirm>
          </Menu.Item>
        );
      }
    });

    if (!this.props.isIframe) {
      menu.push(<Menu.Item><a onClick={this.gotoLuopan(this.props.data.itemId)}>查看效果</a></Menu.Item>);
    }

    return (
      <div>
        <a onClick={() => { goto(genUrl('1', this.props.data)); }}>查看 </a>
        {
          menu.length ? (<Dropdown
            overlay={<Menu>{menu}</Menu>}
            trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              | 更多 <Icon type="down" />
            </a>
          </Dropdown>) : null
        }
      </div>
    );
  }
}
