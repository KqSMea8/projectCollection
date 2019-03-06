import React from 'react';
import { Modal, Row, Col, Icon, message, Form, Breadcrumb, Spin, Button } from 'antd';
import {
  decorators, DonateFlag, CouponGoods, PhotoPicker, OnlineTime, ValidTime,
  BudgetAmount, VerifyMode, RenewMode, ReceiveLimited, DescList,
} from '@alipay/xform';
import moment from 'moment';
import classnames from 'classnames';
import { uniq, cloneDeep } from 'lodash';
import SelectShops, { flattenData } from '../../../common/SelectShops';
import ajax from '../../../common/ajax';
import FormBanner from '../common/FormBanner';
import CommonSimulator from '../common/CommonSimulator';

const NOW = moment();
const START_TIME = moment(NOW.format('YYYY-MM-DD 00:00:00'), 'YYYY-MM-DD 00:00:00');
const END_TIME = moment(NOW.clone().add(3, 'M').format('YYYY-MM-DD 00:00:00'), 'YYYY-MM-DD 00:00:00');
const merchantIdInput = document.getElementById('J_crmhome_merchantId');
const opMerchantId = merchantIdInput ? merchantIdInput.value : '';
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const VERIFY_MODE_MAP = {
  USER_CLICK: { name: '用户点击核销', tips: '提示：用户主动点击券上的“立即使用”按钮核销，可能造成对账不准确情况' },
  MERCHANT_SCAN: { name: '商家扫码核销', tips: '提示：适用于使用口碑商家 APP 的商家，可使用口碑商家 APP 扫用户券码核销兑换券，该核销方式对账更加准确' },
};

export function transformDefaultData(data) {
  return {
    couponGoods: data.subject,
    logoImg: data.realLogoFileId ? [{
      uid: data.realLogoFileId,
      url: data.logoFileId,
    }] : [],
    descList: data.descList || [''],
    shop: data.cityShop || [],
    startTime: data.startTime,
    endTime: data.endTime,
    validTimeFrom: data.validTimeFrom,
    validTimeTo: data.validTimeTo,
    validTimeType: data.validTimeType,
    validPeriod: data.validPeriod,
    budgetAmount: data.budgetAmount,
    verifyMode: data.verifyMode,
    receiveLimited: data.receiveLimited,
    donateFlag: data.donateFlag,
    shopIds: data.shopIds,
  };
}

const modalOpts = {
  cutRate: 4 / 3,
  containerHeight: 300,
  containerWidth: 400,
  width: 800,
  previewTitle: (<h4>上传的图片将会展示如下，<br />请确保图片重要内容居中完整显示，且不可有水印。</h4>),
  previews: [{
    style: { width: 125, height: 125 },
    title: '商家详情页--优惠券入口--商品预览图',
  }, {
    style: { width: 240, height: 135 },
    title: '券详情页--商品预览图',
  }],
};

class NewExchangeV2 extends React.Component {
  state = {
    loading: true,
    submitting: false,
    initialData: null,
  };

  componentDidMount() {
    ['validTimeFrom', 'validTimeTo', 'validTimeType', 'validPeriod', 'verifyMode',
      'receiveLimited', 'shopIds'].forEach(d => {
        this.props.form.getFieldProps(d);
      });
    if (this.isEdit) {
      this.fetchModifyExchangeInit(this.props.params.id);
    } else {
      this.props.form.setFieldsValue({
        startTime: START_TIME,
        endTime: END_TIME,
        logoImg: [],
        validTimeType: 'RELATIVE',
        validPeriod: '30',
        budgetAmount: '999999999',
        verifyMode: 'USER_CLICK',
        renewMode: '1',
        donateFlag: '1',
      });
    }
  }

  onCut = (cropInfo, next) => {
    const cutParams = {
      xx: cropInfo.X,
      yy: cropInfo.Y,
      width: cropInfo.width,
      height: cropInfo.height,
      orgWidth: cropInfo.imgWidth,
      orgHeight: cropInfo.imgHeight,
      avatarImage: this.fileUrl,
      fileType: this.fileType,
    };
    ajax({
      url: '/goods/itempromo/cutPicture.json',
      method: 'post',
      type: 'json',
      data: cutParams,
      success: (res) => {
        if (res.status === 'succeed') {
          next({
            uid: res.fileId,
            url: res.result,
          });
        } else {
          message.error(res.resultMsg || '裁剪失败');
        }
      },
      error: (res) => {
        message.error(res.resultMsg || '裁剪失败');
      },
    });
  }

  fetchModifyExchangeInit = (id) => {
    const url = `/goods/itempromo/modifyexchangeinit.json?itemId=${id}`;
    ajax({
      url,
      method: 'get',
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed' && res.discountForm) {
          const defaultData = transformDefaultData(res.discountForm);
          this.setState({
            loading: false,
            initialData: { ...res.discountForm, defaultData },
          });
          this.props.form.setFieldsValue(defaultData);
        } else {
          message.error(res.errorMsg || '获取数据失败', 3);
        }
      },
      error: err => {
        if (typeof err === 'string') {
          message.error(err);
        } else {
          message.error(err && err.resultMsg || '请检查网络');
        }
        this.setState({
          loading: false,
        });
      },
    });
  }

  validTimeProps = () => {
    const cfg = cloneDeep(ValidTime.defaultCfg);
    if (this.isOnline) {
      cfg.options[1].config.disabled = { start: true };
      cfg.options[0].config.rules = [this.validPeriodWhenOnline];
      cfg.options[1].config.rules = [
        ...cfg.options[1].config.rules(this.props.form),
        this.validTimeToWhenOnline,
      ];
      cfg.disabled = true;
    }
    return cfg;
  }

  validTimeToWhenOnline = (r, v, cb) => {
    const oldValue = moment(this.props.form.getFieldValue('validTimeTo'), 'YYYY-MM-DD HH:mm:ss');
    if (moment(v, 'YYYY-MM-DD HH:mm:ss').isBefore(oldValue)) {
      return cb(`有效期只能延长，结束时间必须大于原时间 ${oldValue}`);
    }
    cb();
  }

  validPeriodWhenOnline = (r, v, cb) => {
    const oldValue = Number(this.props.form.getFieldValue('validPeriod'));
    if ((v === 0 || (!!v) && !isNaN(v)) && v < oldValue) {
      return cb(`有效期只能延长，必须大于原时间 ${oldValue} 天`);
    }
    cb();
  }

  converter = resp => {
    if (resp.status === 'succeed') {
      this.fileType = resp.fileType || 'jpg';
      this.fileUrl = resp.avatarImage;
      return {
        uid: resp.fileId,
        url: resp.result,
      };
    }
    message.error('上传图片异常');
  }

  submit = (e) => {
    e.preventDefault();
    const form = this.props.form;
    this.props.form.validateFieldsAndScroll((errs, values) => {
      let shopIds = flattenData(form.getFieldValue('shop')).map(d => d.id);
      if (!this.isReadyToOnline || !this.isEdit) { // 兼容脏数据
        shopIds = uniq(shopIds.concat(this.state.initialData && this.state.initialData.shopIds || []));
      }
      // 如果把下面这段逻辑删掉则会把后端返回donateFlag的值传给后端
      if (this.isEdit) {// 修改页面不传值给后端了
        if (values.donateFlag) {
          delete values.donateFlag;
        }
      }
      if (!errs) {
        ajax({
          url: '/goods/itempromo/modifyexchange.json',
          method: 'post',
          type: 'json',
          data: {
            itemId: this.props.params.id,
            jsonDataStr: JSON.stringify(Object.assign({}, values, {
              descList: form.getFieldValue('descList').join(':-)'),
              shopIds: shopIds,
              fileId: values.logoImg[0].id,
              backgroundImgUrl: values.logoImg[0].url,
              shop: undefined,
              logoImg: undefined,
              renewMode: values.validTimeType === 'RELATIVE' ? form.getFieldValue('renewMode') : undefined,
            }), (field, value) => {
              if (['startTime', 'endTime', 'validTimeTo', 'validTimeFrom'].some(d => field === d)) {
                return moment(value).format('YYYY-MM-DD HH:mm');
              }
              return value;
            }),
          },
          success: (res) => {
            this.setState({
              submitting: false,
            });
            if (res.status === 'succeed') {
              Modal.success({
                title: '提交成功',
                content: '',
                onOk: () => {
                  this.forwardToManage();
                },
              });
            } else {
              message.error(res.errorMsg || '提交失败，请稍后重试');
            }
          },
          error: () => {
            message.error('提交失败，请稍后重试');
            this.setState({ submitting: false });
          },
        });
        this.setState({ submitting: true });
      }
    });
  }

  wrapperFormItems(componentType, props = {}) {
    return React.createElement(componentType,
      Object.assign({
        initialData: this.state.initialData,
        form: this.props.form,
      },
        props,
        {
          isReadyToOnline: this.isReadyToOnline,
          isOnline: this.isOnline,
          isEdit: this.isEdit,
        }));
  }

  get isEdit() {
    return this.props.params.id > 0;
  }

  get isOnline() {
    return this.state.initialData && this.state.initialData.itemStatus === 'ONLINE';
  }

  get isReadyToOnline() {
    return this.state.initialData
      && this.state.initialData.itemStatus === 'READY_TO_ONLINE';
  }

  render() {
    window._f = this.props.form;
    const { getFieldError, getFieldProps } = this.props.form;
    return (
      <div>
        <div className="app-detail-header">营销活动</div>
        <div className="kb-detail-main" style={{ overflow: 'hidden' }}>
          <Breadcrumb>
            <Breadcrumb.Item style={{ fontSize: '14px', color: '#0ae' }}>
              <a onClick={this.forwardToManage}><Icon type="circle-o-left" />营销活动</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ fontSize: '14px' }}>兑换券</Breadcrumb.Item>
          </Breadcrumb>
          <Spin spinning={this.state.loading}>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
              <CommonSimulator
                caption="支付宝折扣展示页面"
                background="https://os.alipayobjects.com/rmsportal/jxpvZAOOekyJDrF.png"
              />
              <Form horizontal form={this.props.form} style={{ float: 'left', width: '600px', marginLeft: '40px' }}>
                <FormBanner>
                  <span style={{ marginRight: 15 }}>券配置</span>
                  <a href="https://cshall.alipay.com/enterprise/help_detail.htm?help_id=580216" target="_blank">什么是兑换券？</a>
                </FormBanner>
                <CouponGoods style={{ width: 300 }} placeholder="如：海底捞 10 元代金券，不超过 20 字" {...formLayout} />
                <PhotoPicker
                  {...formLayout}
                  uploadUrl={`/goods/itempromo/uploadPicture.json?op_merchant_id=${opMerchantId}`}
                  field="logoImg"
                  required
                  uploadName="Filedata"
                  max={1}
                  label="背景图片"
                  needCut
                  onCut={this.onCut}
                  cutModalOpts={modalOpts}
                  fileSize={1024 * 1024 * 2}
                  convertResp2File={this.converter}
                  extra={<span style={{ lineHeight: 1.5, display: 'inline-block' }}>大小：不超过 2M。格式：bmp, png, jpeg, jpg, gif<br />建议尺寸：2000px*1500px;</span>}
                />
                <Form.Item {...formLayout}
                  label="活动门店："
                  required
                  validateStatus={classnames({ error: !!getFieldError('shop') })}
                  help={getFieldError('shop')}
                >
                  {this.state.loading ? <Spin /> :
                    <SelectShops
                      selectedShops={this.state.initialData && this.state.initialData.cityShop || []}
                      isEdit={this.isEdit}
                      canReduce={this.isReadyToOnline}
                      {...getFieldProps('shop', {
                        rules: [this.checkShop],
                      }) }
                    />
                  }
                </Form.Item>
                <OnlineTime {...formLayout} disabled={{ start: this.isOnline }} />
                <ValidTime {...formLayout} {...this.validTimeProps() } />
                <BudgetAmount {...formLayout} />
                {this.isOnline ? (
                  <Form.Item label="核销方式" required {...formLayout}
                    help={VERIFY_MODE_MAP[this.state.initialData.verifyMode] && VERIFY_MODE_MAP[this.state.initialData.verifyMode].tips}
                  >
                    {VERIFY_MODE_MAP[this.state.initialData.verifyMode] && VERIFY_MODE_MAP[this.state.initialData.verifyMode].name}
                  </Form.Item>
                ) : <VerifyMode {...formLayout} />}
                <RenewMode {...formLayout} />
                <FormBanner style={{ marginTop: 40 }}>
                  规则设置
                </FormBanner>
                <ReceiveLimited {...formLayout} disabled={this.isEdit} />
                <DonateFlag {...formLayout} />
                <FormBanner style={{ marginTop: 40 }}>
                  其他设置
                </FormBanner>
                <DescList {...formLayout} getViewValue={v => v} />
                <Row>
                  <Col offset={formLayout.labelCol.span + formLayout.wrapperCol.offset || 0}>
                    <Button
                      type="primary"
                      onClick={this.submit}
                      loading={this.state.submitting}
                    >修改</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

// export default decorators.formDecorator()(NewExchangeV2);
export default decorators.formDecorator()(NewExchangeV2);
