import React, {PropTypes} from 'react';
import { Form, Input, DatePicker } from 'antd';
import ajax from '../../../../../common/ajax';
import classnames from 'classnames';
import { dateLaterThanToday, serverStringToDate } from '../../../../../common/dateUtils';

const FormItem = Form.Item;

/*
  表单字段 － 活动设置：活动名称、活动时间、活动对象
*/

const ActivitySet = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    query: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
      query: {},
    };
  },

  getInitialState() {
    return {
      name: '',
      count: '',
      ratio: '',
    };
  },

  componentWillMount() {
    const { actionType, roleType, query } = this.props;

    if (actionType === 'create') {
      this.setState({
        name: query.crowdName,
      });
      this.fetch(roleType, query.crowdId);
    }
  },

  componentWillReceiveProps(nextProps) {
    const { actionType, roleType, initData } = nextProps;

    if (actionType === 'edit') {
      if (initData.crowdRestriction && initData.crowdRestriction === 'NEW_MEMBER_PROMO') {
        this.setState({
          name: '从未到该商家消费的新客',
        });
      }
      if (!this.props.initData.crowdId && initData.crowdId) {
        this.setState({
          name: initData.crowdName,
        });
        this.fetch(roleType, initData.crowdId);
      }
    }
  },

  fetch(roleType, crowdId) {
    if (crowdId !== '-1') { // 如果不是新人券才走这些流程
      if (roleType === 'brand') {
        ajax({
          url: '/promo/common/memberCrowdCount.json',
          method: 'get',
          type: 'json',
          data: {
            crowdGroupId: crowdId,
          },
          success: (res) => {
            if (res && res.memberCrowdCount) {
              this.setState({
                count: res.memberCrowdCount,
              });
            }
          },
        });
      } else if (roleType === 'merchant') {
        ajax({
          url: '/promo/merchant/memberMerchantBatchSum.json',
          method: 'get',
          type: 'json',
          data: {
            crowdGroupId: crowdId,
            needStatistics: 1,
          },
          success: (res) => {
            if (res.status === 'success') {
              const data = res.data;

              if (data && data.memberMerchantGroupCount) {
                this.setState({
                  count: data.memberMerchantGroupCount,
                  ratio: data.memberMerchantGroupRatio,
                });
              }
            }
          },
        });
      }
    }
  },

  checkStartTime(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const end = getFieldValue('endTime');

    if (value && end) {
      if (value > end) {
        callback([new Error('开始时间应该早于结束时间')]);
        return;
      }

      const millSecond = end.getTime() - value.getTime();

      const day = millSecond / 1000 / 60 / 60 / 24;
      if ( day >= 365) {
        callback(new Error('活动时间最长为1年'));
        return;
      }
    }

    if (getFieldError('endTime')) {
      validateFields(['endTime'], {force: true});
    }

    if (getFieldValue('confirmTime') !== undefined) {
      validateFields(['confirmTime'], {force: true});
    }

    if (getFieldValue('validTimeFrom') !== undefined) {
      validateFields(['validTimeFrom'], {force: true});
    }

    callback();
  },

  checkEndTime(rule, value, callback) {
    const { getFieldValue, getFieldError, validateFields } = this.props.form;
    const { initData, actionType } = this.props;
    const start = getFieldValue('startTime');

    if (value && start) {
      if (value < start) {
        callback([new Error('结束时间应该大于开始时间')]);
        return;
      }

      const millSecond = value.getTime() - start.getTime();

      const day = millSecond / 1000 / 60 / 60 / 24;
      if ( day >= 365) {
        callback(new Error('活动时间最长为1年'));
        return;
      }
    }

    if (actionType === 'edit') {
      if (initData.endTime && value < serverStringToDate(initData.endTime)) {
        callback([new Error('活动结束时间只可后延')]);
        return;
      }
    }

    if (getFieldError('startTime')) {
      validateFields(['startTime'], {force: true});
    }

    if (getFieldValue('validTimeTo') !== undefined) {
      validateFields(['validTimeTo'], {force: true});
    }

    callback();
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, roleType, actionType } = this.props;
    const isEdit = actionType === 'edit';
    const isMerchant = roleType === 'merchant';

    if (isEdit && !initData.campaignName) {
      return null;
    }

    const now = new Date();
    const end = new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000);
    const defaultStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const defaultEndTime = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 0);

    let initStartTime = null;
    let initEndTime = null;

    if (initData.startTime && initData.endTime) {
      initStartTime = serverStringToDate(initData.startTime);
      initEndTime = serverStringToDate(initData.endTime);
    }

    return (
      <div>
        <FormItem
          {...this.props.layout}
          required
          label="活动名称：">
          <Input
            disabled={isEdit && isMerchant && initData.campaignStart}
            {...getFieldProps('campaignName', {
              rules: [
                { required: true, message: '请填写活动名称' },
                { max: 20, message: '最多 20 个字符' },
              ],
              initialValue: initData.campaignName,
            })}
            placeholder="为这个活动起个名字方便管理" />
        </FormItem>

        <FormItem
          {...this.props.layout}
          required
          label="活动时间："
          help={getFieldError('startTime') || getFieldError('endTime')}
          validateStatus={
          classnames({
            error: !!(getFieldError('startTime') || getFieldError('endTime')),
          })}>
          <DatePicker
            disabled={isEdit && isMerchant && initData.campaignStart}
            showTime
            format="yyyy-MM-dd HH:mm"
            disabledDate={dateLaterThanToday}
            placeholder="开始时间"
            {...getFieldProps('startTime', {
              rules: [
                { required: true, type: 'date', message: '请选择活动开始时间' },
                { validator: this.checkStartTime },
              ],
              initialValue: initStartTime || defaultStartTime,
            })} />
          <span style={{ margin: '0 5px', color: '#ccc' }}>－</span>
          <DatePicker
            showTime
            format="yyyy-MM-dd HH:mm"
            disabledDate={dateLaterThanToday}
            placeholder="结束时间"
            {...getFieldProps('endTime', {
              rules: [
                { required: true, type: 'date', message: '请选择活动结束时间' },
                { validator: this.checkEndTime },
              ],
              initialValue: initEndTime || defaultEndTime,
            })} />
        </FormItem>

        <FormItem
          {...this.props.layout}
          label="活动对象：">
          <p style={{ color: '#333' }}>
            {this.state.name}
            {isMerchant && this.state.count ?
            <span style={{ color: '#666', marginLeft: 5 }}>
              选定会员{this.state.count}，占比总数{this.state.ratio}
            </span>
            : null}
            {!isMerchant && this.state.count ?
            <span style={{ color: '#666', marginLeft: 5 }}>
              选定会员{this.state.count}
            </span>
            : null}
          </p>
        </FormItem>
      </div>
    );
  },
});

export default ActivitySet;
