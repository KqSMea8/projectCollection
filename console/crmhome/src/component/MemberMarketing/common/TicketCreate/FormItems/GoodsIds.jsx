import React, {PropTypes} from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

/*
  表单字段 － 商品编码
*/

const GoodsIds = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  checkGoodsIds(rule, value, callback) {
    const reg = new RegExp(/^[a-zA-Z0-9\s\n]+$/g);  // 取消空格约束限制 20160727 浴兰
    if ( !reg.test(value) ) {
      callback([new Error('请输入数字或英文字母')]);
      return;
    }

    if (value) {
      const arr = value.split('\n');
      if (arr.length > 500) {
        callback([new Error('最多输入500个编码')]);
        return;
      }
    }
    callback();
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { initData, actionType } = this.props;
    const isEdit = actionType === 'edit';

    if (isEdit && !initData.goodsIds) {
      return null;
    }

    return (
      <div>
        <FormItem
          style={{ marginBottom: 0 }}
          {...this.props.layout}
          required
          label="商品编码：">
          <Input
            {...getFieldProps('goodsIds', {
              rules: [
                { required: true, message: '请输入商品编码' },
                { max: 7000, message: '最多 7000 个字符' },
                { validator: this.checkGoodsIds },
              ],
              initialValue: initData.goodsIds,
            })}
            type="textarea"
            placeholder="输入券指定的商品编码" />
        </FormItem>
        <Row>
          <Col span="16" offset="7">
            <p className="tip" style={{ marginBottom: 24 }}>最多可输入500个，若输入多个商品编码，多个商品均会享受优惠，请按回车键进行间隔</p>
          </Col>
        </Row>
      </div>
    );
  },
});

export default GoodsIds;
