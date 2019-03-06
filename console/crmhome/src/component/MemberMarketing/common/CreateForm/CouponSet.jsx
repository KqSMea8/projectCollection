import React, {PropTypes} from 'react';
import { Form, Input, Modal } from 'antd';
import classnames from 'classnames';
import UploadCropPic from '../../brands/UploadCropPic';
import UploaderClip from '../../brands/UploaderClip';
import { ImgCropModal } from 'hermes-react';
const Preview = ImgCropModal.Preview;
const FormItem = Form.Item;

/*
  表单字段 － 优惠券设置：券种类、商品名称、品牌名称、品牌logo、商品详情文案、商品详情图片、更多商品详情
*/

const CouponSet = React.createClass({
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

  getInitialState() {
    return {
      previewVisible: false,
      previewImage: '',
      coverPreviewModal: false,
      logoPreviewModal: false,
    };
  },

  checkActivityLink(rule, value, callback) {
    const reg = new RegExp(/^(http|https|alipays)\:\/\/[^\s]+$/ig);
    if ( value && !reg.test(value) ) {
      callback([new Error('链接格式不正确，请以"http://"、"https://"或"alipays://"开头填写')]);
      return;
    }

    callback();
  },

  handleCancelPreview() {
    this.setState({
      previewVisible: false,
    });
  },

  showLogoPreviewModal(e) {
    e.preventDefault();
    this.setState({logoPreviewModal: true});
  },

  showCoverPreviewModal(e) {
    e.preventDefault();
    this.setState({coverPreviewModal: true});
  },

  logoDom() { // 纯粹是新加的eslint内容所导致
    const LogoFieldName = 'logoFileId';
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, roleType } = this.props;
    const logoText = roleType === 'brand' ? '品牌logo' : '券logo';

    const logoUploadOption = {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      triggerText: '品牌logo  (500*500)',
      rate: 1, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 500, height: 500},  // 要求的最小尺寸
      getPicInfo: (positionInfo) => {
        const {width, height, url} = positionInfo;
        // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
        const fillType = width > height ? 'width' : 'height';
        return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
          <div style={{'marginBottom': 10}}><p>您上传的图片将会自动适配为以下尺寸</p></div>
          <div style={{'marginBottom': 5, 'color': '#999'}}>品牌logo</div>
          <Preview
            url={url}
            fillType={fillType}
            picStyle={{borderRadius: '100%', border: '1px solid #ddd', overflow: 'hidden'}}
            style={{width: 100, height: 100, background: '#fff', marginBottom: 20}}
            crop={positionInfo}
          />
        </div>);
      },
    };

    return (<FormItem
        {...this.props.layout}
        required
        label={logoText + '：'}
        help={getFieldError(LogoFieldName)}
        validateStatus={
          classnames({
            error: !!getFieldError(LogoFieldName),
          })}>
      <div className="clearfix clip">
        <UploadCropPic {...getFieldProps(LogoFieldName, {
          rules: [
            { required: true, message: '请上传品牌logo' },
          ],
          initialValue: initData.logoFileId && [{
            id: initData.logoFileId,
            uid: initData.logoFileId,
            url: initData.logoFixUrl,
            status: 'done',
          }],
        })} {...logoUploadOption} />
        <p className="tip">建议：请上传品牌logo，不超过2M。格式：bmp, png, jpeg, jpg, gif。建议尺寸: 500px＊500px<br />
          <a href="#" onClick={this.showLogoPreviewModal}>查看图片用在哪？</a>
        </p>
      </div>
    </FormItem>);
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { initData, actionType } = this.props;
    const isGenericIndustry = window.APP.isGenericIndustry === 'true';
    if (actionType === 'edit' && !initData.subject) {
      return null;
    }

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    const paperUploadOption = {
      maxSize: 2048, // 上传文件最大尺寸,单位为KB
      triggerText: '商品封面图(2000*1500)',
      rate: 4 / 3, // 裁剪的虚线框的宽/高比
      initWidth: 0.8,
      requiredSize: {width: 2000, height: 1500},  // 要求的最小尺寸
      style: {width: 400, height: 300},
      getPicInfo: (positionInfo) => {
        const {width, height, url} = positionInfo;
        // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
        const fillType = width > height ? 'width' : 'height';
        return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
          <div style={{'marginBottom': 10}}><p>您上传的图片将会自动适配为以下两种尺寸</p></div>
          <div style={{'marginBottom': 5, 'color': '#999'}}>展示在券详情页</div>
          <Preview
            url={url}
            fillType={fillType}
            style={{width: 16 / 9 * 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
            crop={positionInfo}
          />
          <div style={{'marginBottom': 5, 'color': '#999'}}>展示在店铺详情页</div>
          <Preview
            url={url}
            fillType={fillType}
            style={{width: 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
            crop={positionInfo}
          />
        </div>);
      },
    };

    return (
      <div>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancelPreview}>
          <img src={this.state.previewImage} style={{ maxWidth: '100%' }} />
        </Modal>

        <FormItem
          {...this.props.layout}
          required
          label="商品名称：">
          <Input
            {...getFieldProps('subject', {
              rules: [
                { required: true, message: '请填写商品名称' },
                { max: 20, message: '最多 20 个字符' },
              ],
              initialValue: initData.subject,
            })}
            placeholder="如，莫斯利安酸奶，20字以内"
            style={{ width: 250 }} />
        </FormItem>

        <FormItem
          {...this.props.layout}
          required
          label="品牌名称：">
          <Input
            {...getFieldProps('brandName', {
              rules: [
                { required: true, message: '请填写品牌名称' },
                { max: 20, message: '最多 20 个字符' },
              ],
              initialValue: initData.brandName || '',
            })}
            placeholder="如，光明乳业，20字以内"
            style={{ width: 250 }} />
        </FormItem>

       {this.logoDom()}

        <FormItem
          {...this.props.layout}
          required
          label="商品详情：">
          <Input
            {...getFieldProps('activityName', {
              rules: [
                { required: true, message: '请填写商品详情' },
                { max: 120, message: '最多 120 个字符' },
              ],
              initialValue: initData.activityName || '',
            })}
            type="textarea"
            placeholder="商品内容简介，120字以内" />
        </FormItem>

        <FormItem
            {...this.props.layout}
            required
            label="商品图片："
            help={getFieldError('itemCover')}
            validateStatus={
              classnames({
                error: !!getFieldError('itemCover'),
              })}>
           <div className="clearfix clip">
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <UploadCropPic {...getFieldProps('itemCover', {
                rules: [
                  { required: true, message: '请上传商品封面图' },
                ],
                initialValue: initData.activityImgFileIds && [{
                  id: initData.activityImgFileIds[0],
                  uid: initData.activityImgFileIds[0],
                  url: initData.activityImgs[0],
                  status: 'done',
                }],
              })} {...paperUploadOption} uploadText="商品封面图" aspectRatio={[924, 380]} />
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <UploaderClip {...getFieldProps('itemDetailImg1', {
                initialValue: initData.activityImgFileIds && initData.activityImgFileIds[1] || '',
              })} uploadText="商品详情图"/>
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <UploaderClip {...getFieldProps('itemDetailImg2', {
                initialValue: initData.activityImgFileIds && initData.activityImgFileIds[2] || '',
              })} uploadText="商品详情图"/>
            </div>
          </div>
          <p className="tip">请至少上传1张商品封面图，单张大小不超过2M，格式: bmp, png, jpeg, jpg, gif<br/>
            <a href="#" onClick={this.showCoverPreviewModal}>查看图片用在哪？</a>
          </p>
        </FormItem>
        {
          !isGenericIndustry && (<FormItem
            {...this.props.layout}
            label="更多商品详情：">
            <Input
              placeholder="例：http://www.alipay.com"
              style={{ width: 250 }}
              {...getFieldProps('activityLink', {
                rules: [
                  { validator: this.checkActivityLink },
                ],
                initialValue: initData.activityLink,
              })} />
          </FormItem>)
        }
        <Modal
          width="900"
          style={{top: modalTop}}
          visible={this.state.coverPreviewModal}
          title="图片在支付宝口碑中的展示位置"
          onCancel={() => {this.setState({coverPreviewModal: false});}}
          footer={null}
        >
          <div className="preview-flex">
            <div>
              <h5>商品封面图 | <span className="span-pos">展示在券详情页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/xqCqqCqZgXMZVaAfJQnC.png" width="250" alt=""/>
            </div>
            <div>
              <h5>商品封面图 | <span className="span-pos">展示在店铺详情页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/tyInQdEknMUJeWQXTAIA.png" width="250" alt=""/>
            </div>
            <div>
              <h5>商品详情图 | <span className="span-pos">展示在券详情的商品详情页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/hCmhSxhRjEFOJBbFmxac.png" width="250" alt=""/>
            </div>
          </div>
        </Modal>
        <Modal
          width="340"
          style={{top: modalTop}}
          visible={this.state.logoPreviewModal}
          title="图片在支付宝口碑中的展示位置"
          onCancel={() => {this.setState({logoPreviewModal: false});}}
          footer={null}
        >
          <div className="preview-flex">
            <div>
              <h5>品牌logo图 | <span className="span-pos">展示在卡包页</span></h5>
              <img src="https://zos.alipayobjects.com/rmsportal/FUOxuBzlqAderEQNGkLQ.png" width="270" alt=""/>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
});

export default CouponSet;
