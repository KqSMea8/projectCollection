import { Table, Modal } from 'antd';
import React, {PropTypes} from 'react';

const ModifyTypeMap = {
  activityTime: '活动时间',
  budgetTotal: '发放总量',
  subValue: '每日库存',
  userWin: '参与限制',
  minCost: '活动规则',
  suitShops: '活动门店',
  voucher_name: '券名称',
  subTitle: '品牌名称',
  logo: '券LOGO',
  voucherImg: '券背景图',
  maxAmount: '券最高优惠金额',
  voucherValidTime: '券有效期',
  constraintInfo_itemIds: '消费送单品商品编码',
  voucher_desc: '备注',
  useInstructions: '使用说明',
  effectType: '领取当日是否可用',
  useRule_suitShops: '券适用门店',
  availableTime: '券可用时段',
  forbiddenTime: '不可用日期',
  minConsume: '使用条件',
  userCondition: '使用条件',
  name: '活动名称',
  desc: '活动描述',
  autoDelayFlag: '自动续期',
  itemName: '商品名称',
  itemLink: '更多商品详情',
  itemText: '商品详情',
  itemImgs: '商品图片列表',
  itemInfo_itemIds: '商品编码',
};
const ModifyDetailModal = React.createClass({
  propTypes: {
    ModifyData: PropTypes.any,
  },
  getInitialState() {
    this.columns = [{
      title: '修改内容',
      width: 140,
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (text) => ModifyTypeMap[text],
    }, {
      title: '修改前',
      width: 280,
      dataIndex: 'oldValue',
      key: 'oldValue',
      render: (text, record) => this.transformEntryUtils(text, record.fieldName),
    }, {
      title: '修改后',
      width: 280,
      dataIndex: 'newValue',
      key: 'newValue',
      render: (text, record) => this.transformEntryUtils(text, record.fieldName),
    }];
    return {
      visibleModify: false,
    };
  },
  // 处理条目的方法
  transformEntryUtils(text, fieldName) {
    let content = text;
    if (Array.isArray(text) && fieldName !== 'availableTime' && fieldName !== 'userWin' && fieldName !== 'userCondition'
      && fieldName !== 'voucherValidTime' && fieldName !== 'forbiddenTime' && fieldName !== 'useInstructions') {
      content = text.join(' ; ');
      if (fieldName === 'minConsume') {
        if (content) {
          content = `购买指定商品，满${content}元可用`;
        } else {
          content = '不限制';
        }
      }
    }
    if (fieldName === 'logo' || fieldName === 'voucherImg' || fieldName === 'itemImgs') {
      content = '-';
    } else if (fieldName === 'itemLink' && text) {
      content = <a href={text}>{text}</a>;
    } else if (fieldName === 'autoDelayFlag') {
      content = <span>{text === 'Y' ? '是' : '否'}</span>;
    } else {
      content = this.handleEntryUtils(content, fieldName);
    }
    return content || '-';
  },
  // 处理条目的方法 为了解决if过多的报错
  handleEntryUtils(text, fieldName) {
    let content = text;
    if ((fieldName === 'userWin' || fieldName === 'voucherValidTime' || fieldName === 'forbiddenTime'
      || fieldName === 'useInstructions' || fieldName === 'userCondition') && text) {
      if (Array.isArray(text) && text.length > 0) {
        content = text.map((item, index) => {
          return <p key={index}>{fieldName === 'forbiddenTime' ? item.replace(',', '~') : item}</p>;
        });
      } else if (fieldName === 'forbiddenTime' || fieldName === 'userCondition') {
        content = '不限制';
      }
    } else if (fieldName === 'availableTime' && text) {
      if (Array.isArray(text) && text.length > 0) {
        content = text.map((item, index) => {
          return <p key={index}><span>{item.values && this.handleWeek(item.values)}</span> <span>{item.times.replace(',', '-')}</span></p>;
        });
      } else {
        content = '不限制';
      }
    } else if (fieldName === 'budgetTotal' && text >= 999999999) {
      content = '不限制';
    } else if (fieldName === 'minCost' && text) {
      content = text > 0 ? `消费满送,需单笔消费满${text}元` : '消费即送';
    }
    return content;
  },
  showModifyModal(e) {
    e.preventDefault();
    this.setState({
      visibleModify: true,
    });
  },
  handleModifyCancel() {
    this.setState({
      visibleModify: false,
    });
  },
  handleWeek(text) {
    const str = '日一二三四五六';
    return text.split(',').map(item => {
      return `周${str[item]}`;
    }).join(',');
  },
  render() {
    const {visibleModify} = this.state;
    return (
      <div>
        <a href="#" onClick={this.showModifyModal}>{this.props.ModifyData && `${this.props.ModifyData.length}处修改`}</a>
        <Modal title="修改详情" width="700" visible={visibleModify} onCancel={this.handleModifyCancel} footer={false}>
            <Table columns={this.columns}
            dataSource={this.props.ModifyData}
            pagination={false}
            size="middle"
            rowKey={(row, index) => index}
            bordered/>
        </Modal>
      </div>
    );
  },
});

export default ModifyDetailModal;
