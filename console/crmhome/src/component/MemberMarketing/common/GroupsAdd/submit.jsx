import React from 'react';
import { Form, Button } from 'antd';

const FormItem = Form.Item;

class GroupsAddSubmit extends React.Component {
  render() {
    return (
      <groups-add-submit>
        <FormItem wrapperCol={{ span: 12, offset: 8 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={{ width: 80 }}>提交</Button>
        </FormItem>
      </groups-add-submit>
    );
  }
}

export default GroupsAddSubmit;
