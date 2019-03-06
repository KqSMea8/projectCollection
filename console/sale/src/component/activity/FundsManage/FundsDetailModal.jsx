import React, { PropTypes } from 'react';
import { Modal, Form} from 'antd';

const FormItem = Form.Item;

const FundsDetailModal = React.createClass({
  propTypes: {
    visible: PropTypes.bool,
    item: PropTypes.object,
    onAction: PropTypes.func,
  },

  getInitialState() {
    return {};
  },

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const item = this.props.item || {};

    console.log(item);

    return (
      <div>
        <Modal title="查看" visible={this.props.visible}
          maskClosable={false}
          onCancel={() => {this.props.onAction('detail', 'hide');}}
          footer={null}
        >
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="资金池ID："
            >
              <p className="ant-form-text">{item.poolId}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资金池名称："
            >
              <p className="ant-form-text">{item.poolName}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资金池有效期："
            >
              <p className="ant-form-text">{item.startTime} ~ {item.endTime}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="当前余额："
            >
              <p className="ant-form-text">
                {item.balance || 0} 元
              </p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="失效金额："
            >
              <p className="ant-form-text">{item.invalidAmount ? item.invalidAmount + '元' : '未设置'}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预警金额："
            >
              <p className="ant-form-text">{item.alarmAmount ? item.alarmAmount + '元' : '未设置'}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预警通知人："
            >
              <p className="ant-form-text">{item.alarmReceiver}</p>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  },

});

export default FundsDetailModal;
