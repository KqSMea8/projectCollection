import React from 'react';
import {Form, Button} from 'antd';

const FormItem = Form.Item;
const PurchaseFooter = React.createClass({
  render() {
    return (
    <div style={{borderTop: '1px solid #e9e9e9', paddingTop: 20}}>
        <Form>
          <FormItem>
            <div style={{marginLeft: 10}}>
              <Button type="primary" size="large" style={{marginRight: 20}}>入库</Button>
              <Button type="ghost" size="large">放弃</Button>
            </div>
          </FormItem>
        </Form>
    </div>
    );
  },
});
export default PurchaseFooter;
