import React, {PropTypes} from 'react';
import { Row, Col, Form} from 'antd';
import CircleMap from './CircleMap';
import AreaSelect from '../common/AreaSelect';
const FormItem = Form.Item;


const PublicLeadsForm = React.createClass({
  propTypes: {
    onSearch: PropTypes.func,
    form: PropTypes.object,
  },

  onSearch(lngLat) {
    const info = {
      lng: lngLat.lng,
      lat: lngLat.lat,
      radius: lngLat.radius,
      searchType: 'PUBLIC',
    };
    this.props.onSearch(info);
  },

  render() {
    const {getFieldValue, getFieldProps} = this.props.form;
    return (<div>
      <Form className="advanced-search-form" horizontal>
        <Row>
          <Col span="9" style={{paddingLeft: 13, lineHeight: '32px'}}>
            点击地图可圈出该区域未被领取的leads
          </Col>
          <Col span="8" offset="7"><FormItem
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
            label="服务地区：">
            <AreaSelect
              {...getFieldProps('area')}
              style={{width: '100%'}}
              placeholder="请输入服务地区"/>
          </FormItem>
          </Col>
        </Row>
        <FormItem>
          <CircleMap
            onChange={this.onSearch}
            cityCode={getFieldValue('area') && getFieldValue('area')[getFieldValue('area').length - 1] }
            area={getFieldValue('area')}
          />
        </FormItem>
      </Form>
    </div>);
  },
});

export default Form.create()(PublicLeadsForm);
