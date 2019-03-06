import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const FormItem = Form.Item;

class GroupsAddName extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object.isRequired,
    form: React.PropTypes.object.isRequired,
    name: React.PropTypes.string,
    type: React.PropTypes.oneOf(['brands', 'retailers', 'cate7']).isRequired,
    count: React.PropTypes.number,
    onClick: React.PropTypes.func,
  }

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 4 },
      wrapperCol: { span: 12, offset: 1 },
    },
  }

  render() {
    const { formItemLayout, form, name, count, onClick, type } = this.props;
    const { getFieldProps } = form;
    const nameProps = getFieldProps('name', {
      initialValue: name,
      rules: [
        { required: true, message: '人群名称必填' },
        { max: 20, message: '人群名称最多 20 个字符' },
      ],
    });
    return (
      <groups-add-name>
        <div>
          <FormItem { ...formItemLayout } label="人群名称" required hasFeedback>
            <Input { ...nameProps } size="large" placeholder="最多20个字" />
          </FormItem>
          <Row>
            <Col span="12" offset="5">
              <p>你可以按照以下维度圈定你需要的人</p>
            </Col>
          </Row>
        </div>
        {type !== 'brands' && (
          <div>
            <Button type="ghost" onClick={onClick}>计算人数</Button>
            {count >= 0 && <span><strong>{count}</strong> 人符合条件</span>}
          </div>
        )}
      </groups-add-name>
    );
  }
}

export default GroupsAddName;
