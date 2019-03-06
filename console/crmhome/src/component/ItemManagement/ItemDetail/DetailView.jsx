import React, {PropTypes} from 'react';
import {Button, Form, message, Spin} from 'antd';
import ajax from '../../../common/ajax';

const FormItem = Form.Item;

const DetailView = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      detail: null,
    };
  },

  componentDidMount() {
    if (this.props.params.id) {
      this.fetchDetail();
    }
  },

  fetchDetail() {
    ajax({
      url: '/goods/ic/queryItemDetail.json',
      data: {
        id: this.props.params.id,
      },
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            detail: res.data,
          });
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (res) => {
        message.error(res.resultMsg);
      },
    });
  },

  edit() {
    location.hash = '/item-management/detail-edit/' + this.props.params.id;
  },

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const { detail } = this.state;

    return (<div className="commodity">
      <div className="app-detail-header">商品库 > 查看商品</div>

      <div className="app-detail-content-padding">
        {detail ? (
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="商品国标码："
            >
              <p className="item-text">{detail.itemCode}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品名称："
            >
              <p className="item-text">{detail.title}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品品牌："
            >
              <p className="item-text">{detail.brandName}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品品类："
            >
              <p className="item-text">{detail.categoryName}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品价格："
            >
              <p className="item-text">{detail.price && Number.parseFloat(detail.price / 100)}元</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品规格："
            >
              <p className="item-text">{detail.specification}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品图片："
            >
              <div>
                <img src={detail.picture} style={{maxWidth: 200}}/>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品数量："
            >
              <p className="item-text">{detail.count > 0 ? detail.count : ''}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品描述："
            >
              <p className="item-text">{detail.description}</p>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品产地："
            >
              <p className="item-text">{detail.country}</p>
            </FormItem>
            <FormItem wrapperCol={{ span: 16, offset: 6 }} style={{ marginTop: 10 }}>
              <Button type="primary" onClick={this.edit}>编辑</Button>
            </FormItem>
          </Form>
        ) : (
          <div className="spin-wrap">
            <Spin />
          </div>
        )}
      </div>
    </div>);
  },
});

export default DetailView;
