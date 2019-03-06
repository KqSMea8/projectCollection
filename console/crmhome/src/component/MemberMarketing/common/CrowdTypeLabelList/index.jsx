import React, { PropTypes } from 'react';
import { Row, Col, Button, Icon, Form } from 'antd';
import classnames from 'classnames';
import {toggleListItem} from '../../../../common/utils';
import './style.less';

const BtnGroup = Button.Group;
const FormItem = Form.Item;

const CrowdTypeLabelList = React.createClass({
  propTypes: {
    form: PropTypes.object.isRequired,
  },
  switchGroupType(value, e) {
    e.stopPropagation();
    const { setFieldsValue, getFieldValue } = this.props.form;
    const oldValue = getFieldValue('groupTypeList');
    setFieldsValue({
      groupTypeList: toggleListItem(oldValue, value),
    });
  },
  switchCrowdType(type, e) {
    e.stopPropagation();
    const { setFieldsValue, getFieldValue } = this.props.form;
    if (getFieldValue('crowdType') === type) return;
    setFieldsValue({
      crowdType: type,
      groupTypeList: [],
    });
  },
  render() {
    const { getFieldValue } = this.props.form;
    const crowdType = getFieldValue('crowdType');
    const groupTypeList = getFieldValue('groupTypeList');
    const validateProps = {
      help: groupTypeList.length === 0 ? '请选择人群来源' : null,
      validateStatus: groupTypeList.length > 0 ? '' : 'error',
    };
    return (
      <FormItem style={{ paddingLeft: '80px' }} {...validateProps} className="unable-select">
        <BtnGroup size="large" style={{ marginBottom: 20 }}>
          <Button type={crowdType === '会员' ? 'primary' : 'ghost'} onClick={this.switchCrowdType.bind(this, '会员')}>会员</Button>
          <Button type={crowdType === '粉丝' ? 'primary' : 'ghost'} onClick={this.switchCrowdType.bind(this, '粉丝')}>粉丝</Button>
        </BtnGroup>
        { crowdType === '会员' &&
          <Row gutter={16}>
            <Col span={6}>
              <div className={classnames({ 'selected': groupTypeList.indexOf('支付会员') >= 0, 'group-label': true })} onClick={this.switchGroupType.bind(this, '支付会员')}>
                支付会员
                <div className="icon-wrapper">
                  <Icon type="check" />
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className={classnames({ 'selected': groupTypeList.indexOf('储值卡会员') >= 0, 'group-label': true })} onClick={this.switchGroupType.bind(this, '储值卡会员')}>
                储值卡会员
                <div className="icon-wrapper">
                  <Icon type="check" />
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className={classnames({ 'selected': groupTypeList.indexOf('会员卡会员') >= 0, 'group-label': true })} onClick={this.switchGroupType.bind(this, '会员卡会员')}>
                会员卡会员
                <div className="icon-wrapper">
                  <Icon type="check" />
                </div>
              </div>
            </Col>
          </Row>
        }
        { crowdType === '粉丝' &&
          <Row gutter={16}>
            <Col span={6}>
              <div className={classnames({ 'selected': groupTypeList.indexOf('服务窗粉丝') >= 0, 'group-label': true })} onClick={this.switchGroupType.bind(this, '服务窗粉丝')}>
                服务窗粉丝
                <div className="icon-wrapper">
                  <Icon type="check" />
                </div>
              </div>
            </Col>
          </Row>
        }
      </FormItem>
    );
  },
});

export default CrowdTypeLabelList;
