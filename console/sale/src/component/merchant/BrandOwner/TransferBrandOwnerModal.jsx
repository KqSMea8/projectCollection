import React, {PropTypes} from 'react';
import {Modal, Form, Spin, Button} from 'antd';
// import {appendOwnerUrlIfDev} from '../../../common/utils';
// import classnames from 'classnames';
// import ajax from 'Utility/ajax';
// import JobTreeSelect from '@alipay/opbase-biz-components/src/component/job/JobTreeSelect';
import NewManagerSelect from '../common/NewManagerSelect';

const FormItem = Form.Item;

const TransferBrandOwnerModal = React.createClass({
  propTypes: {
    data: PropTypes.any,
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    return {
      loading: false, // 浮层初始化loading
      postLoading: false, // 提交loading
      staffOption: [],
    };
  },
  // componentWillMount() {
  //   this.getStaffNamesOption();
  // },

  onOk() {
    if (this.state.loading) return;

    this.props.form.validateFields((error, values) => {
      if (!error) {
        this.setState({ postLoading: true });
        const merchant = this.props.data;
        const params = {
          partnerId: merchant.partnerId,
          currentSalesManagerId: merchant.belongStaffId,
          newSalesManagerId: (values.staffId && values.staffId.split(',')[0]) || '',
          // memo: values.memo,
          newJobId: values.staffId.split(',')[1],
        };

        this.props.onOk(params).catch((e) => {
          this.setState({ postLoading: false });
          throw e;
        });
      }
    });
  },

  onCancel() {
    this.props.onCancel();
  },

  // getStaffNamesOption() {
  //   if (this.props.form.getFieldValue('jobs')) {
  //     const options = [];
  //     options.push(<Option >{this.props.form.getFieldValue('jobs').id}</Option>);
  //     this.setState({
  //       staffOption: options,
  //     });
  //   }
  // },
  // onTreeSelectChange(value) {
  //   if (value.id) {
  //     this.props.form.resetFields(['staffId']);
  //     ajax({
  //       url: appendOwnerUrlIfDev('/sale/merchant/queryUserByJobId.json'),
  //       method: 'GET',
  //       data: {jobId: value.id},
  //       type: 'json',
  //       success: (result) => {
  //         if (!result) {
  //           return;
  //         }
  //         if (result.status && result.status === 'succeed') {
  //           const items = result.data;
  //           const options = [];
  //           for (let i = 0; i < items.length; i++) {
  //             options.push(<Option key={items[i].operatorId} value={items[i].operatorId}>{items[i].operatorName}<br /><span>江浙大区-杭州城市经理</span></Option>);
  //           }
  //           this.setState({
  //             staffOption: options,
  //           });
  //         }
  //       },
  //     });
  //   }
  // },

  render() {
    const { data } = this.props;
    const { loading, postLoading} = this.state;
    const footer = [
      <Button key="back" type="ghost" size="large" onClick={this.onCancel}>取 消</Button>,
      loading ? <Button key="submit" type="primary" size="large" disabled>提 交</Button> : <Button key="submit" type="primary" size="large" loading={postLoading} onClick={this.onOk}>提 交</Button>,
    ];
    const {getFieldProps} = this.props.form;
    // const staffOption = [];
    // // if (this.props.form.getFieldValue('jobs')) {
    // //   // this.props.form.resetFields({staffId: ''});
    // //   // staffOption.push(<Option key="2">{getFieldValue('jobs').id}</Option>);
    // // }
    return (<Modal title="转移" visible onCancel={this.onCancel} footer={footer} width="800px">
      <Spin spinning={loading}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem
            label="支付宝账号："
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}>
            <p className="ant-form-text">{data.loginEmail}（{data.partnerId}）</p>
          </FormItem>
          <FormItem
            label="品牌商名称："
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}>
            <p className="ant-form-text">{data.merchantName}</p>
          </FormItem>
          <FormItem
            label="当前业务经理："
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}>
            <p className="ant-form-text">{data.staffName}</p>
          </FormItem>
          <FormItem
            label="新业务经理："
            labelCol={{span: 4}}
            wrapperCol={{span: 18}}
            // help={(getFieldError('staffId') || '当前只允许一名业务经理')}
            // notFoundContent=""
            required>
            <NewManagerSelect
              {...getFieldProps('staffId', {
                rules: [{
                  message: '此处必填',
                  required: true,
                  // type: 'object',
                }],
              })}
            />
          </FormItem>
        </Form>
      </Spin>
    </Modal>);
  },
});

export default Form.create()(TransferBrandOwnerModal);
