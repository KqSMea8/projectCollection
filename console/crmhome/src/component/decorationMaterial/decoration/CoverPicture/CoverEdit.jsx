import React, {PropTypes} from 'react';
import {message, Spin, Breadcrumb, Button, Form, Modal} from 'antd';
import CoverShopItem from '../../common/CoverShopItem';
import ajax from '../../../../common/ajax';
import {getCategoryId} from '../../common/utils';
import {kbScrollToTop} from '../../../../common/utils';
import CoverUpload from '../../common/CoverUpload';

const FormItem = Form.Item;

const CoverEdit = React.createClass({
  propTypes: {
    params: PropTypes.object,
  },
  getInitialState() {
    window.parent.postMessage({'showPidSelect': false}, '*');
    const {fileGroupId} = this.props.params;
    return {
      isCreate: !fileGroupId,
      loading: true,
      data: {},
      saveLoading: false,
      firstShopName: '',
      firstShopId: '',
    };
  },
  componentDidMount() {
    const {fileGroupId} = this.props.params;
    const {isCreate} = this.state;
    if (!isCreate) {
      const params = {
        fileGroupId: fileGroupId,
      };
      ajax({
        url: '/shop/shopsurface/detailQuery.json',
        method: 'get',
        data: params,
        type: 'json',
        success: (result) => {
          if (result.status === 'succeed') {
            const shopSurfaceVO = result.result.ShopSurfaceVO;
            this.setState({
              data: shopSurfaceVO,
              loading: false,
              firstShopName: shopSurfaceVO.relatedShops,
              firstShopId: shopSurfaceVO.relatedShopId,
            });
          } else {
            message.error(result.resultMsg);
          }
        },
        error: (_, msg) => {
          message.error(msg);
        },
      });
    }
  },
  onSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      this.save(values);
    });
  },
  onFirstShopChange({shopName, shopId}) {
    this.setState({
      firstShopName: shopName,
      firstShopId: shopId,
    });
  },
  goTo(hash) {
    window.parent.postMessage({'showPidSelect': true}, '*');
    if (hash) {
      window.location.hash = hash;
    } else {
      window.history.back();
    }
  },
  save(values) {
    const {fileGroupId} = this.props.params;
    const {isCreate, firstShopName, firstShopId} = this.state;
    const {cover, surfacePic1, surfacePic2, surfacePic3, shopIds} = values;
    const surfacePics = [surfacePic1, surfacePic2, surfacePic3].reduce((p, c) => {
      const res = p;
      if (c && c.fileId) res.push(c.fileId);
      return res;
    }, []);
    if (!surfacePics.length) surfacePics.push('');
    this.setState({
      saveLoading: true,
    });
    const params = {
      firstShopName,
      firstShopId,
      cover: cover.fileId,
      surfacePics,
      shopIds: shopIds.join(','),
    };
    if (!isCreate) params.fileGroupId = fileGroupId;
    ajax({
      url: `/shop/shopsurface/${isCreate ? 'save' : 'modifyAlbum'}.json`,
      method: 'post',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          message.success('提交成功');
          this.goTo('/decoration/' + getCategoryId() + '/cover');
        } else {
          message.error(result.resultMsg);
        }
        this.setState({
          saveLoading: false,
        });
        kbScrollToTop();
      },
      error: (_, msg) => {
        message.error(msg);
        this.setState({
          saveLoading: false,
        });
        kbScrollToTop();
      },
    });
  },
  goBack(hash) {
    kbScrollToTop();
    Modal.confirm({
      title: '是否放弃提交',
      content: '',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        if (hash) {
          window.location.hash = hash;
        } else {
          window.history.back();
        }
      },
    });
  },
  render() {
    const {fileGroupId} = this.props.params;
    const {getFieldProps} = this.props.form;
    const {isCreate, loading, saveLoading} = this.state;
    const formItemLayout = {
      labelCol: {span: '6'},
      wrapperCol: {span: '16'},
    };
    const data = isCreate ? {} : this.state.data || {};
    const extra = (noRepeat) => <div>不可有水印，{noRepeat ? '不可重复上传，' : ''}不超过2.9M，格式：bmp、png、jpeg、jpg、gif。<br />建议尺寸在2000px＊1500px以上</div>;
    return (<div className="menu-edit cover-edit">
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => {this.goBack('#/decoration/' + getCategoryId() + '/cover');}} href={null}>封面图</Breadcrumb.Item>
          <Breadcrumb.Item>{isCreate ? '添加' : '修改'}封面图</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding">
        {!isCreate && loading ? <Spin /> : <div>
          <div className="sample-image-wrap">
            <img width="280" height="290" src="https://zos.alipayobjects.com/rmsportal/YGPKxkZahsGwpytlfSAE.jpg" />
            <p>列表图展示在支付宝APP-口碑-列表</p>
          </div>
          <div className="edit-form-wrap">
            <Form form={this.props.form} horizontal>
              <FormItem {...formItemLayout} label="列表图：" extra={extra()}>
                <CoverUpload {...getFieldProps('cover', {
                  initialValue: data.cover,
                  rules: [{ required: true, message: '请选择列表图'}],
                })} title="列表图" />
              </FormItem>
              <FormItem {...formItemLayout} label="适用门店：">
                <CoverShopItem {...getFieldProps('shopIds', {
                  initialValue: data.hasRelatedShopIds,
                  rules: [{
                    min: 1,
                    required: true,
                    type: 'array',
                    message: '请选择适用门店',
                  }],
                })}
                  relatedShops={data.relatedShops}
                  relatedShopsCount={data.relatedShopsCount}
                  onFirstShopChange={this.onFirstShopChange}
                  fileGroupId={fileGroupId}
                  url={isCreate ? '/shop/shopsurface/getCreateShops.json' : '/shop/shopsurface/getModifyShops.json'}
                  subUrl="/shop/shopsurface/getShopsByCity.json" />
              </FormItem>
              <FormItem {...formItemLayout} label=" " className="kb-without-colon">
                <Button loading={saveLoading} type="primary" onClick={this.onSubmit}>提交</Button>
                <Button style={{marginLeft: '10px'}} onClick={() => this.goBack()}>取消</Button>
              </FormItem>
            </Form>
          </div>
          <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" src={this.state.priviewImage} />
          </Modal>
        </div>}
      </div>
    </div>);
  },
});

export default Form.create()(CoverEdit);
