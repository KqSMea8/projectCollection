import React from 'react';
import { Breadcrumb, Form, Button, Input, message } from 'antd';
import { getImageById } from '../../../common/utils';
import OneImgPicker from '../common/OneImgPicker';
import fetch from '@alipay/kb-fetch';
import './BrandAccountEdit.less';

class BrandAccountEdit extends React.Component {
  state = {
    loading: false,
  };

  componentDidMount() {
    if (!this.props.location.state) {
      location.hash = '#/brand-account';
    }
  }

  doSubmit() {
    const { shopName, shopId, brandId } = this.props.location.state || {};
    this.props.form.validateFields((errors, values) => {
      const getFieldError = this.props.form.getFieldError;
      const errMsg = errors && Object.keys(errors).map((key) => getFieldError(key) && getFieldError(key)[0]).join(' ');
      if (errMsg) {
        message.error(errMsg);
      } else {
        this.setState({ loading: true });
        fetch({
          url: 'mshopprod.brandShopManageWrapperService.modifyBrandShop',
          param: {
            brandShopId: shopId,
            brandId: brandId,
            brandName: shopName,
            desc: values.desc,
            logo: values.logoImg.sourceId,
            cover: values.coverImg.sourceId,
          },
        }).then(() => {
          this.setState({ loading: false });
          location.hash = '#/brand-account';
        }).catch(() => {
          this.setState({ loading: false });
        });
      }
    });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { loading } = this.state;
    const { shopName, shopDesc, logo, cover } = this.props.location.state || {};
    const formProps = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
    return (<div className="brand-account-edit-page">
      <div className="app-detail-header" style={{ height: 70 }}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item style={{ cursor: 'pointer' }} href="#/brand-account">品牌号</Breadcrumb.Item>
          <Breadcrumb.Item>完善品牌</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="brand-account-edit-page-content">
        <img src="https://gw.alipayobjects.com/zos/rmsportal/pzfTfAeXmUrQBJANLPNB.png" />
        <Form className="form">
          <Form.Item {...formProps} label="品牌名称">{shopName}</Form.Item>
          <Form.Item {...formProps} label="品牌介绍" required help={getFieldError('desc')}
            validateStatus={getFieldError('desc') ? 'error' : ''}>
            <Input
              {...getFieldProps('desc', {
                initialValue: shopDesc,
                rules: [
                  { required: true, message: '请输入品牌介绍' },
                  { max: 100, message: '品牌介绍最多100字' },
                ],
              })}
              type="textarea" rows={4} placeholder="请输入，不超过100个字" maxLength={100} />
          </Form.Item>
          <Form.Item {...formProps} label="品牌logo" required help={getFieldError('logoImg')}
            validateStatus={getFieldError('desc') ? 'error' : ''}>
            <OneImgPicker
              {...getFieldProps('logoImg', {
                initialValue: logo && { url: getImageById(logo), sourceId: logo },
                rules: [ { required: true, message: '请选择品牌logo' } ],
              })}
              exampleUrl="https://gw.alipayobjects.com/zos/rmsportal/AFiYbNHHEdNgVExYgcNQ.png"
              uploadTip={<div>要求：200x200像素及以上；限2MB以内；支持bmp、png、jpg、jpeg<br />重点：请传无水印、非透明底的商家logo或品牌logo</div>}
              modalTitle="品牌logo"
              fileSizeLimit={2 * 1024 * 1024}
            />
          </Form.Item>
          <Form.Item {...formProps} label="背景图" required help={getFieldError('coverImg')}
            validateStatus={getFieldError('desc') ? 'error' : ''}>
            <OneImgPicker
              {...getFieldProps('coverImg', {
                initialValue: cover && { url: getImageById(cover), sourceId: cover },
                rules: [ { required: true, message: '请选择背景图' } ],
              })}
              exampleUrl="https://gw.alipayobjects.com/zos/rmsportal/CJgjAQlylkeeNssZPtIU.png"
              uploadTip={<div>要求：1242x1424像素；限2MB以内；支持bmp、png、jpg、jpeg<br />重点：请传无水印、非透明底的图片</div>}
              modalTitle="背景图"
              fileSizeLimit={2 * 1024 * 1024}
            />
          </Form.Item>
          <Form.Item {...formProps}>
            <Button loading={loading} onClick={() => this.doSubmit()} type="primary" style={{ marginLeft: 100 }}>保存</Button>
          </Form.Item>
        </Form>
      </div>
    </div>);
  }
}

export default Form.create()(BrandAccountEdit);
