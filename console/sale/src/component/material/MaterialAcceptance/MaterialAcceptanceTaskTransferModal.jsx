import {Select, Modal, Button, Form, message} from 'antd';
import React, {PropTypes} from 'react';
import ajax from 'Utility/ajax';
import permission from '@alipay/kb-framework/framework/permission';
import {appendOwnerUrlIfDev} from '../../../common/utils';

const Option = Select.Option;
const FormItem = Form.Item;

const MaterialAcceptanceTaskTransferModal = React.createClass({
  propTypes: {
    form: PropTypes.any,
    ids: PropTypes.array,
    callbackParent: PropTypes.func,
  },

  getInitialState() {
    return {
      data: [],
      selectTargetOperatorName: '',
    };
  },

  onSelected(value, option) {
    this.setState({
      selectTargetOperatorName: option.props.children[0],
    });
  },

  showModal() {
    if (!permission('STUFF_CHECK_INFO_TRANSFER')) {
      message.error('您没有该操作的权限');
    } else {
      this.setState({
        visible: true,
      });
      this.fetchData();
    }
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  handleOk() {
    const params = {
      ids: this.props.ids.join(','),
      targetOperatorId: this.props.form.getFieldValue('operator'),
      targetOperatorName: this.state.selectTargetOperatorName,
    };
    const url = appendOwnerUrlIfDev('/sale/asset/stuffCheckTransfer.json');
    ajax({
      url: url,
      type: 'json',
      data: params,
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            visible: false,
          });
          message.success('转移成功', 3);
          this.props.callbackParent();
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
    });
  },

  fetchData() {
    ajax({
      url: appendOwnerUrlIfDev('/sale/asset/transferObject.json'),
      success: (result) => {
        if (result.status === 'succeed') {
          this.setState({
            data: result.data || [],
          });
        }
      },
      error: () => {},
    });
  },

  render() {
    const {ids} = this.props;
    const {data} = this.state;
    const {getFieldProps} = this.props.form;
    const options = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].nickName) {
        options.push(<Option key={data[i].id} value={data[i].id}>{data[i].nickName}({data[i].operatorName})</Option>);
      } else {
        options.push(<Option key={data[i].id} value={data[i].id}>{data[i].realName}({data[i].operatorName})</Option>);
      }
    }
    return (
      <div style={{display: 'inline'}}>
        <Button type="primary" onClick={this.showModal} disabled={ids.length === 0}>
          任务转移
        </Button>
        <Modal ref="modal"
           visible={this.state.visible}
           title="任务转移" onOk={this.handleOk} onCancel={this.handleCancel}>
           <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem
              label="将任务转移给："
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 4 }}
              required>
              <Select style={{width: '300px'}} onSelect= {this.onSelected} {...getFieldProps('operator')}>
                {options}
              </Select>
             </FormItem>
          </Form>
        </Modal>
      </div>
    );
  },
});

export default Form.create()(MaterialAcceptanceTaskTransferModal);
