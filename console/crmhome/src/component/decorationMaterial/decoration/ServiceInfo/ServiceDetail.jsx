import React, {PropTypes} from 'react';
import {message, Button, Breadcrumb, Spin, Form, Tag} from 'antd';
import ajax from '../../../../common/ajax';
import {getCategoryId} from '../../common/utils';

const FormItem = Form.Item;

const ServiceDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    return {
      loading: true,
      data: {},
    };
  },
  componentDidMount() {
    this.fetch();
  },
  fetch() {
    const {shopId} = this.props.params;
    const params = {
      shopId,
    };
    ajax({
      url: '/shop/queryShopServiceDetail.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (data) => {
        if (data.status === 'succeed') {
          const result = data.result;
          this.setState({
            data: result.vo,
            loading: false,
          });
        } else {
          message.error(data.resultMsg);
        }
      },
      error: (_, msg) => {
        message.error(msg);
      },
    });
  },
  goEdit() {
    const {shopId} = this.props.params;
    window.location.hash = '/decoration/' + getCategoryId() + '/service/edit/' + shopId;
  },
  goToBread(url) {
    window.location.hash = url;
  },
  render() {
    const {loading, data} = this.state;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 16},
    };
    const button = <Button style={{position: 'absolute', top: 16, right: 16, zIndex: 1}} size="large" onClick={this.goEdit}>修改</Button>;
    return (<div>
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => {this.goToBread('#/decoration/' + getCategoryId() + '/service');}} href={null}>服务信息</Breadcrumb.Item>
          <Breadcrumb.Item>查看</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? null : button}
      </div>
      <div className="service-detail menu-detail app-detail-content-padding">
        {loading ? <Spin /> : <div className="menu-detail-form">
          <Form horizontal>
            <FormItem {...formItemLayout} label="适用门店">
              <div>{data.shopName}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="特色标签">
              <div>{data.serviceList.map((v, i) => <Tag key={i}>{v.name}</Tag>)}</div>
            </FormItem>
            <FormItem {...formItemLayout} label="更多服务">
              <div className="more-text">{data.desc}</div>
            </FormItem>
          </Form>
        </div>}
      </div>
    </div>);
  },
});

export default ServiceDetail;
