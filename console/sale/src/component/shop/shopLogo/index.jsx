import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Modal, message } from 'antd';
import { PageNoAuth } from '@alipay/kb-framework-components';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import permission from '@alipay/kb-framework/framework/permission';
import { queryPicture, uploadPicture } from './common/api';
import PhotoPickerModal from '../../../common/PhotoPickerModal';
import './index.less';

/* eslint-disable */
const { object } = PropTypes;
const createForm = Form.create;
const FormItem = Form.Item;
class ShopLogo extends React.Component {
  static propTypes = {
    form: object,
  };
  constructor(props) {
    super(props);
    this.state = {
      photoVisibile: false,
      findImgLogo: false,
      logoWarning: false,
      uploadSuccessVisibile: false,
      findShop: false,
      fileList: [],
    }
  }

  handleClick = () => {
    this.setState({
      photoVisibile: true,
    });
  }

  // 点击确定
  addFiles = (fileList) => {
    this.setState({
      fileList,
    });
    const shopId = this.props.form.getFieldValue('shopId');
    const param = {
      shopId, //店铺id
      djangoid: fileList[0].sourceId,	//图片资源id
      materialId: fileList[0].id, //素材id
    };
    uploadPicture(param).then(res => {
      if (res.status === 'succeed') {
        message.success('已上传完成');
        this.setState({uploadSuccessVisibile: false});
        this.queryPictureData(shopId);
        setTimeout(() => this.setState({uploadSuccessVisibile: false}), 2000)
      }
    })
    this.closeModal();
  }
  
  closeModal = () => {
    this.setState({
      photoVisibile: false,
    });
  }

  // 搜索
  searchClick = () => {
    // 获取shopId
    const shopId = this.props.form.getFieldValue('shopId');
    // 2016102100077000000003441154
    this.props.form.validateFields((errors, values) => {
      // 判断校验是否通过
      if (errors) {
        message.error('提交失败');
        const getFieldError = this.props.form.getFieldError;
        const errMsgs = Object.keys(errors).map(key => getFieldError(key) && getFieldError(key)[0]);
        Modal.error({
          title: '提交失败',
          content: `失败原因：${errMsgs.join('、')}`,
        });
        return;
      }
      this.queryPictureData(shopId);
    });
  }

  queryPictureData = (shopId) => {
    queryPicture({ shopId }).then(res => {
      if (res.status === 'succeed') {
        if (res.data === null) {
          this.setState({
            findShop: true,
          })
        } else {
          this.setState({
            findImgLogo: true,
            findShop: false,
          });
          if (res.data.status === null) {
            // 没有店铺logo
            this.setState({
              logoWarning: true,
              pictureURL: res.data.pictureURL,
              pid: res.data.pid,
            })
          } else {
            this.setState({
              logoWarning: false,
              pictureURL: res.data.pictureURL,
              pid: res.data.pid,
              shopAddress: res.data.shopAddress,
              shopName: res.data.shopName,
            });
          }
        }
      } else {
        this.setState({
          findImgLogo: true,
        });
        message.error('未查询到结果');
        Modal.error({
          title: '查询失败',
          content: res.resultMsg,
        });
      }
    }).catch(err => {
      this.setState({
        findImgLogo: false,
      })
    })
  }

  render() {
    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    };
    if (!permission('SHOP_LOGO_MANAGER')) {
      return <PageNoAuth authCodes={['SHOP_LOGO_MANAGER']} />;
    }
    return (
      <Page title="门店LOGO" id="shopLogo">
        <Form horizontal>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="门店名称">
                <Input placeholder="请输入要查找的门店名称" {...getFieldProps('shopName')} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="门店ID">
                <Input placeholder="请输入要操作的门店id" {...getFieldProps('shopId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入要操作的门店id',
                    },
                  ],
                })} />
              </FormItem>
            </Col>
          </Row>
          {this.state.findShop && <Row>
            <Col span={12}>
              <p style={{ color: 'red', marginBottom: '10px'}}>未查到结果</p>
            </Col>
          </Row>}
          <Row>
            <Col span={12}>
              <Button type="primary" onClick={this.searchClick}>搜索</Button>
            </Col>
          </Row>
          {this.state.findImgLogo &&
            (<div>
              <Row className="findLogo">
                <Col span={12}>
                  <p>{this.state.logoWarning ? '未查到结果' : `已查找到：${this.state.shopName}（${this.state.shopAddress}）店。LOGO如下：`}</p>
                </Col>
              </Row>
              <Row className="findLogo">
                <Col span={12}>
                  <div className="imageLogo">
                    {this.state.logoWarning && <p className="logoWarning">抱歉，此店铺暂无LOGO</p>}
                    {this.state.logoWarning === false && <img src={this.state.pictureURL} style={{width: '180px', height: '180px'}} />}
                  </div>
                  {this.state.uploadSuccessVisibile && <div className="uploadSuccessModal">已上传成功</div>}
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: 'center', width: '180px'}}>
                  <Button type="primary" onClick={this.handleClick}>
                  {this.state.logoWarning ? '上传' : '更换'}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <p className="textWarning">*给此店铺上传logo，图片大小：不超过2M。格式：bmp, png, jpeg, jpg, gif。建议尺寸：720px*720px以上。<br />注：如有店铺已有logo，将会被新logo覆盖。</p>
                </Col>
              </Row>
            </div>)}
          {this.state.photoVisibile &&
          (<PhotoPickerModal modalTitle="上传LOGO"
            pid={this.state.pid}
            selectedFileList={this.state.fileList}
            onCancel={this.closeModal}
            onOk={this.addFiles}  />)}
        </Form>
      </Page>
    );
  }
}

export default createForm()(ShopLogo);
