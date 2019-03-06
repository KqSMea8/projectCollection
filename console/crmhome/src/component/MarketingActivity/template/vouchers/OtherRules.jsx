import React, {PropTypes} from 'react';
import {Form, Input, Radio, InputNumber, Button, Modal, message, DatePicker, Select} from 'antd';
import BudgetAmountFormItem from '../common/BudgetAmountFormItem';
import GoodsIds from '../common/GoodsIds';
import SkuPhotoPicker from '../common/Xform/SkuPhotoPicker';
import UseConditionFormItem from '../common/UseCondtionFormItem';
// import SingleActivityImgs from '../common/SingleActivityImgs';
import classnames from 'classnames';
// import UploadCropPic from '../common/upload/UploadCropPic';
// import { ImgCropModal } from 'hermes-react';
import moment from 'moment';
import ajax from '../../../../common/ajax';
// const Preview = ImgCropModal.Preview;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16},
};

const OtherRules = React.createClass({
  propTypes: {
    initData: PropTypes.object,
    allData: PropTypes.object,
    actionType: PropTypes.string,
    form: PropTypes.object,
    renderType: PropTypes.func,
    isEdit: PropTypes.bool,
    getQuery: PropTypes.func,
  },

  getInitialState() {
    this.bool = false;
    return {
      validateStatus: {},
      value: 1,
      canSubmit: true,
      submitVisible: false,
      spin: false,
      coverPreviewModal: false,
      goodsList: null,
      data: [],
      total: 0,
    };
  },

  onChange(e) {
    if (e.target.value === 1) {
      this.props.form.resetFields(['originPrice', 'reduceToPrice']);
    } else {
      this.props.form.resetFields(['valueAmount']);
    }
    this.setState({
      value: e.target.value,
    });
  },

  setActivityListBox(obj) {
    const imgList = [];
    if (obj && obj.activityImgsArr) {
      obj.activityImgsArr.map((item) => {
        imgList.push(item.response.fileId);
      });
    }
    this.props.form.setFieldsValue({
      activityListBox: {
        activityName: obj.activityName,
        activityLink: obj.activityLink,
        activityImgs: imgList.lenght === 0 ? '' : imgList.join(','),
      },
    });
  },

  getGoodList(info) {
    const self = this;
    self.setState({
      goodsList: info,
    });
  },

  queryUnique(list) {
    const result = [];
    const newResult = [];
    list.map((p) => {
      if (p.replace(/\s+/g, '') !== '') {
        result.push(p);
      }
    });
    result.map((p, index)=>{
      if (newResult.indexOf(result[index]) === -1 ) {
        newResult.push(result[index]);
      }
    });
    return newResult.join(',');
  },

  timeToStr(date, formate) {
    if (date instanceof Date) {
      return moment(date).format(formate ? formate : 'YYYY-MM-DD HH:mm');
    }
    return date;
  },

  birthDateChange(value) {
    if (value[0] === null) {
      this.setState({
        validateStatus: {
          validateStatus: 'error',
          help: '请输入生日开始和结束时间',
        },
      });
    } else {
      this.setState({
        validateStatus: {},
      });
    }
  },
  dayAvailableNumGroupSel(e) {
    const {form} = this.props;
    if (e === '0') {
      form.setFieldsValue({dayAvailableNum: ''});
      form.validateFields(['budgetAmount'], { force: true });
    }
  },

  checkNum(rule, value, callback) {
    const {form} = this.props;
    const reduceToPrice = form.getFieldValue('reduceToPrice');
    const originPrice = form.getFieldValue('originPrice');
    if (rule.field === 'originPrice') {
      if (Number(value) <= Number(reduceToPrice)) {
        this.bool = true;
        callback([new Error('优惠价必须小于商品原价')]);
      } else {
        if (this.bool) {
          this.bool = false;
          form.validateFields([`reduceToPrice`], { force: true });
        }
      }
    }
    if (rule.field === 'reduceToPrice') {
      if (Number(value) >= Number(originPrice)) {
        this.bool = true;
        callback([new Error('优惠价必须小于商品原价')]);
      } else {
        if (this.bool) {
          this.bool = false;
          form.validateFields([`originPrice`], { force: true });
        }
      }
    }
    callback();
  },

  checkDayAvailableNum(rule, value, callback) {
    const {form} = this.props;
    const sizeNum = form.getFieldValue('budgetAmount');
    const sizeType = form.getFieldValue('budgetAmountType');
    if (sizeType === '2' && (Number(sizeNum) < Number(value))) {
      callback([new Error('发放上限不能大于发放总量')]);
      return;
    }
    callback();
  },

  testModal(type) {
    this.handleSubmit(type);
  },

  openModel() {
    this.props.form.validateFieldsAndScroll((error)=> {
      if (!!error) {
        return;
      }
      this.setState({
        submitVisible: true,
      });
    });
  },

  checkUrl(rule, value, callback) {
    if (value) {
      const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      if (!reg.test(value)) {
        callback([new Error('跳转链接格式不正确，请以"http://"、"https://"或"alipays://"开头填写')]);
      }
    }
    callback();
  },

  showCoverPreviewModal(val) {
    this.setState({coverPreviewModal: true});
    this.douponDetail = false;
    this.shopDetail = false;
    this.goodDetail = false;
    if (val === 'douponDetail') {
      this.douponDetail = true;
    } else if (val === 'shopDetail') {
      this.shopDetail = true;
    } else if (val === 'goodDetail') {
      this.goodDetail = true;
    }
  },

  handleSubmit(type) {
    /*eslint-disable */
    this.props.form.validateFieldsAndScroll((error, values)=> {
      if (!!error) {
        return;
      }
      const availableTimeValues = [];
      if (this.props.initData.bsnParams.availableTimeValues) {
        this.props.initData.bsnParams.availableTimeValues.map((item) => {
          const date = item.times.split(',');
          const week = '\"' + item.values + '^' + date[0] + '^' + date[1] + '\"';
          availableTimeValues.push(week);
        });
      }
      if (!this.props.initData.bsnParams.donateFlag) {
        this.props.initData.bsnParams.donateFlag = '0';
      }
      if (this.props.initData.bsnParams.descList && this.props.initData.bsnParams.descList[0] === '') {
        delete this.props.initData.bsnParams.descList;
      }
      // 生日用户
      if (values.allowUseUserGroup === '2') {
        values.birthDateFrom = this.timeToStr(values.birthDate[0], 'MM-DD');
        values.birthDateTo = this.timeToStr(values.birthDate[1], 'MM-DD');
      }

      // 重组商品图片
      if (values.skuImage) {
        const imgs = [];
        const imgsUrl = [];
        if (values.skuImage.images.length > 0) {
          values.skuImage.images.map((item) => {
            if (item !== null) {
              imgs.push(item.uid)
            }
          })
        }
        values.activityImgFileIds = imgs;

        if (values.skuImage.images.length > 0) {
          values.skuImage.images.map((item) => {
            if (item !== null) {
              imgsUrl.push(item.url)
            }
          })
        }

        values.voucherImgs = imgsUrl;
      }

      const payChannelList = {'USE_NO_LIMIT': '1', 'USE_ON_CURRENT_PAY_CHANNEL': '2', 'NOT_ALLOWED_USE': '3'};
      const postData = {
        ...this.props.initData.bsnParams,
        budgetAmount: values.budgetAmountType === '1' ? '999999999' : values.budgetAmount,
        minimumAmount: values.minimumAmount,
        fileId: values.skuImage.mainImage.uid,
        backgroundImgUrl: values.skuImage.mainImage.url,
        goodsIds: values.goodsIds,
        singleItemTitle: values.singleItemTitle,
        itemType: 'appDefault',
        availableTimeValues: availableTimeValues.length > 0 ? '[' + availableTimeValues + ']' : '[\"7,1,2,3,4,5,6^00:00^23:59\"]',
        shop: this.props.initData.shopList,
        activityName: values.activityName,
        payChannel: payChannelList[ this.props.initData.bsnParams.payChannel],
        shopType: 'select',
        valueAmount: values.valueAmount,
        originPrice: values.originPrice,
        reduceToPrice: values.reduceToPrice,
        rate: values.rate,
        allowUseUserGroup: values.allowUseUserGroup || 0,
        birthDateFrom: values.birthDateFrom,
        birthDateTo: values.birthDateTo,
        activityImgs: values.activityImgFileIds.join(','),
        activityLink: values.activityLink,
      };
      if (values.dayAvailableNum) {
        postData.dayAvailableNum = values.dayAvailableNum;
      }
      if (postData.descList && postData.descList[0] !== '' && postData.descList.length > 0) {
        postData.descList = postData.descList.join(':-)');
      }
      if (postData.itemDiscountType === 'MONEY' && postData.valueAmount) {
        postData.cashType = 'CASH_MONEY';
      }
      if (postData.itemDiscountType === 'MONEY' && postData.originPrice && postData.reduceToPrice) {
        postData.cashType = 'CASH_REDUCETO';
      }
      if (values.totalMaxDiscountType === '2') {
        postData.totalMaxDiscountItemNum = values.totalMaxDiscountItemNum;
      }
      if (values.conditionType === '2') {
        postData.minItemNum = values.minItemNum;
        postData.maxDiscountItemNum = values.maxDiscountItemNum;
      }
      if (values.consumptionType === '2') {
        postData.goodsThresholdOrderAmount = values.goodsThresholdOrderAmount;
      }

      console.log(postData);
      ajax({
        method: 'post',
        url: '/goods/itempromo/singleCreate.json',
        data: {
          jsonDataStr: JSON.stringify(postData),
          submitType: type,
          templateNo: this.props.initData.templateNo,
        },
        success: (res) => {
          if (res.status === 'succeed') {
            this.setState({canSubmit: true, submitVisible: false, spin: true});
            this.props.getQuery();
            message.success('创建成功');
          }
          this.setState({spin: false});
        },
        error: (data) => {
          this.setState({canSubmit: true, submitVisible: false});
          message.error( data.resultMsg || data.errorMsg || '提交失败');
        },
      });
    });
  },

  /* eslint-disable complexity */
  render() {
    /* eslint-disable complexity */
    const {form, initData} = this.props;
    const {getFieldProps, getFieldError, getFieldValue} = form;

    const radioStyle = {
      display: 'block',
      height: '90px',
      lineHeight: '30px',
    };

    let modalTop = 100;
    if (window.top !== window) {
      modalTop = window.top.scrollY - 100;
    }

    // const logoUploadOption = {
    //   maxSize: 2048, // 上传文件最大尺寸,单位为KB
    //   triggerText: '商品封面图(2000*1500)',
    //   rate: 4 / 3, // 裁剪的虚线框的宽/高比
    //   initWidth: 0.8,
    //   requiredSize: {width: 2000, height: 1500},  // 要求的最小尺寸
    //   style: {width: 400, height: 300},
    //   getPicInfo: (positionInfo) => {
    //     const {width, height, url} = positionInfo;
    //     // 裁剪后的照片，按照长的一边作为基准展示，短的一边则裁剪或两边留白
    //     const fillType = width > height ? 'width' : 'height';
    //     return (<div style={{display: 'inline-block', marginLeft: 30, verticalAlign: 'top'}}>
    //       <div style={{'marginBottom': 10}}><p>您上传的图片将会自动适配为以下两种尺寸</p></div>
    //       <div style={{'marginBottom': 5, 'color': '#999'}}>展示在券详情页</div>
    //       <Preview
    //         url={url}
    //         fillType={fillType}
    //         style={{width: 16 / 9 * 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
    //         crop={positionInfo}
    //       />
    //       <div style={{'marginBottom': 5, 'color': '#999'}}>展示在店铺详情页</div>
    //       <Preview
    //         url={url}
    //         fillType={fillType}
    //         style={{width: 100, height: 100, background: '#fff', marginBottom: 20, border: '1px solid #ccc'}}
    //         crop={positionInfo}
    //       />
    //     </div>);
    //   },
    // };
    return (
      <div>
        {this.state.spin ? null : <Form horizontal form={form} className="market_vouchers_form">
          <FormItem
            required
            label="标题："
            {...formItemLayout}>
            <Input {...getFieldProps('singleItemTitle', {
              rules: [{
                required: true,
                message: '此处必填',
              }],
            })} placeholder="例：光明莫斯利安酸奶或光明纯牛奶等5件" />
            <div>输入商品名称，无需输入<span className="colorFA0">"折扣券""优惠券"</span>等字样</div>
          </FormItem>
          {(initData.bsnParams && initData.bsnParams.itemDiscountType === 'MONEY') ? <FormItem
            required
            className="radio-vertical-top"
            label="券种类："
            {...formItemLayout} >
            <RadioGroup onChange={this.onChange} value={this.state.value} >
              <Radio style={radioStyle} key="a" value={1}>
                <FormItem
                  required
                  className="input-wrap-left">
                  立减<InputNumber min={1} max={50000} step={0.1} style={{ width: 80, marginLeft: 10, marginRight: 10}} disabled={this.state.value === 2 ? true : false} {...getFieldProps('valueAmount', {
                    rules: [{
                      required: this.state.value === 2 ? false : true,
                      type: 'number',
                      message: '此处必填',
                    }],
                  })} />元
                  <div className="colorFA0">单品代金券面额。例如：金额2元，商品原价10元，用户仅需付8元</div>
                </FormItem>
              </Radio>
              <Radio style={radioStyle} key="b" value={2}>
                <FormItem
                  required
                  className="input-wrap-left"
                  help={getFieldError('originPrice') || getFieldError('reduceToPrice') || getFieldError('rate')}
                  validateStatus={
                    classnames({
                      error: (!!getFieldError('originPrice') || !!getFieldError('reduceToPrice') || !!getFieldError('rate')) ? true : false,
                    })}>
                  减到固定优惠价
                  <InputNumber min={0.1} max={50000} step={0.1} style={{ width: 80, marginLeft: 10, marginRight: 10}} disabled={this.state.value === 1 ? true : false} {...getFieldProps('originPrice', {
                    rules: [{
                      required: this.state.value === 1 ? false : true,
                      type: 'number',
                      message: '此处必填',
                    }, this.checkNum],
                  })} />
                  元，优惠价
                  <InputNumber min={0.1} max={50000} step={0.1} style={{ width: 80, marginLeft: 10, marginRight: 10}} disabled={this.state.value === 1 ? true : false}{...getFieldProps('reduceToPrice', {
                    rules: [{
                      required: this.state.value === 1 ? false : true,
                      type: 'number',
                      message: '此处必填',
                    }, this.checkNum],
                  })} />
                  元
                  <div className="colorFA0">优惠价即为用户需付款金额。例如：原价10元，优惠价2元，用户仅需付2元</div>
                </FormItem>
              </Radio>
            </RadioGroup>
          </FormItem> :
          <FormItem
            required
            className="radio-vertical-top"
            label="券种类："
            {...formItemLayout} >
              <InputNumber min={1.1} max={9.9} step={0.1} style={{ width: 80, marginRight: 10}} disabled={!this.state.value ? true : false} {...getFieldProps('rate', {
                rules: [{
                  required: true,
                  type: 'number',
                  message: '此处必填',
                }],
              })} />折
              <div className="colorFA0">折扣范围1.1折至9.9折。例：设置2折后，原价10元，用户仅需付2元</div>
          </FormItem>
          }
          <BudgetAmountFormItem form={form} data={{budgetAmount: initData && initData.budgetAmount ? Number(initData.budgetAmount) : 0}} />
          <FormItem
            label="每日发券份数："
            validateStatus={classnames({error: !!getFieldError('dayAvailableNum') })}
            help={getFieldError('dayAvailableNum')}
            {...formItemLayout}>
            <Select style={{width: 150, marginRight: '10px'}} {...getFieldProps('dayAvailableNumGroup', {
              onChange: this.dayAvailableNumGroupSel,
              initialValue: '0',
            })}>
              <Option key="0">不限制</Option>
              <Option key="2">设置每日发券数量</Option>
            </Select>
            {getFieldValue('dayAvailableNumGroup') === '2' && <InputNumber size="large" min={1} max={999999} step={1} style={{width: 100}} {...getFieldProps('dayAvailableNum', {
              validateFirst: true,
              rules: [this.checkDayAvailableNum],
            })}/>}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            required
            label="背景图片："
            help={getFieldError('logoFileId')}
            validateStatus={
              classnames({
                error: !!getFieldError('logoFileId'),
              })}>
            <div className="clearfix clip template-clip">
              <UploadCropPic {...getFieldProps('logoFileId', {
                rules: [
                  { required: true, message: '请上传背景图片' },
                  {
                    max: 1,
                    message: '仅支持上传一张',
                    type: 'array',
                  },
                ],
              })} {...logoUploadOption} />
              <p className="tip" style={{lineHeight: 1.5, color: '#999'}}>大小：不超过2M。格式：bmp, png, jpeg, jpg, gif建议尺寸：2000px*1500px以上；</p>
            </div>
          </FormItem> */}

          <FormItem
            required
            label="活动商品详情："
            {...formItemLayout}>
            <Input {...getFieldProps('activityName', {
              rules: [{
                required: true,
                message: '请输入摘要',
              }],
            })} type="textarea" placeholder="商品内容简介，如“买海飞丝去屑护肤洗发水系列产品可享随机立减”，120字以内" />
          </FormItem>

          <GoodsIds layout={formItemLayout} {...this.props} getGoodList={this.getGoodList}/>
          <SkuPhotoPicker {...this.props} layout={formItemLayout} goodsList={this.state.goodsList} showPreviewModal={this.showCoverPreviewModal}/>

          <Modal
            width="320"
            style={{top: modalTop}}
            visible={this.state.coverPreviewModal}
            title="图片在支付宝口碑中的展示位置"
            onCancel={() => {this.setState({coverPreviewModal: false});}}
            footer={null}
          >
            <div className="preview-flex">
              {this.douponDetail && <div>
                <h5>商品封面图 | <span className="span-pos">展示在券详情页</span></h5>
                <img src="https://zos.alipayobjects.com/rmsportal/xqCqqCqZgXMZVaAfJQnC.png" width="250" alt=""/>
              </div>}
              { this.shopDetail && <div>
                <h5>商品封面图 | <span className="span-pos">展示在店铺详情页</span></h5>
                <img src="https://zos.alipayobjects.com/rmsportal/tyInQdEknMUJeWQXTAIA.png" width="250" alt=""/>
              </div>}
              { this.goodDetail && <div>
                <h5>商品详情图 | <span className="span-pos">展示在券详情的商品详情页</span></h5>
                <img src="https://zos.alipayobjects.com/rmsportal/hCmhSxhRjEFOJBbFmxac.png" width="250" alt=""/>
              </div>}
            </div>
          </Modal>
          <FormItem
            label="跳转链接："
            {...formItemLayout}>
            <Input {...getFieldProps('activityLink', {
              rules: [
                this.checkUrl,
              ],
            })} placeholder="包含商品介绍的链接，如：http://www.alipay.com" />
          </FormItem>

          {/**<FormItem
            required
            {...formItemLayout}
            help={getFieldError('activityListBox')}
            validateStatus={
              classnames({
                error: !!(getFieldError('activityListBox')),
              })
            }
            label="商品详情：">
            <SingleActivityImgs initData={initData} requiredData={this.setActivityListBox}/>
            <Input type="hidden" {...getFieldProps('activityListBox', {
              rules: [
                { required: true, message: '请编辑商品详情' },
              ]})}/>
          </FormItem> **/}
          {/** 使用条件conditionsOfUseType没默认返回**/}
          <UseConditionFormItem form={form} min={1} minMessage="最低消费需大于等于券面额" priceType={initData.bsnParams.itemDiscountType === 'RATE' ? 3 : this.state.value}/>
          {/** 使用人群限制 
          <FormItem
            required
            label={initData.bsnParams.useMode === '0' ? '领取人群限制：' : '使用人群限制：'}
            {...formItemLayout}>
            <Select {...getFieldProps('allowUseUserGroup', {
              initialValue: '0',
              rules: [{
                required: true,
                message: '此处必填',
              }],
            })}>
              <Option key="0">全部用户</Option>
              <Option key="2" disabled={(initData.bsnParams.useMode === '0' && this.state.value === 1 && !getFieldValue('rate')) || (initData.bsnParams.useMode === '0' && getFieldValue('rate'))}>生日用户</Option>
            </Select>
          </FormItem> **/}
          {/** 生日用户专有 **/}
          <div style={{display: (getFieldValue('allowUseUserGroup') === '2') ? 'block' : 'none' }}>
            <FormItem
              required
              label="指定生日日期："
              {...this.state.validateStatus}
              {...formItemLayout}>
              <div>
                <RangePicker {...getFieldProps('birthDate', {
                  onChange: this.birthDateChange,
                  initialValue: [],
                  rules: [{
                    required: getFieldValue('allowUseUserGroup') === '2' ? true : false,
                    message: '请输入生日开始和结束时间',
                  }],
                })} format="MM-dd" allowClear />
                  <p style={{height: '20px'}}>若填写<span style={{color: '#ff8208'}}>12月1日~12月1日</span>，则<span style={{color: '#ff8208'}}>12月1日生日</span>的用户可享</p>
                  <p style={{height: '20px'}}>若填写<span style={{color: '#ff8208'}}>12月1日~12月15日</span>，则<span style={{color: '#ff8208'}}>12月1日~12月15日生日</span>的用户可享</p>
                  <p style={{width: '430px'}}>若填写<span style={{color: '#ff8208'}}>12月1日~3月1日</span>，则<span style={{color: '#ff8208'}}>12月1日-12月31日</span>和<span style={{color: '#ff8208'}}>1月1日~3月1日生日</span>的用户可享</p>
              </div>
            </FormItem>
          </div>
          <FormItem wrapperCol={{span: 12, offset: 6}}>
            <Button type="primary" onClick={this.openModel} loading={!this.state.canSubmit} disabled={this.props.isEdit}>创建</Button>
            <Button type="ghost" onClick={this.onCancel} style={{marginLeft: 20}}>取消</Button>
          </FormItem>
          <Modal
            visible={this.state.submitVisible}
            title="提交确认"
            onCancel={() => { this.setState({submitVisible: false}); }}
            footer={null}
          >
            <p>您可以在提交正式活动时同时创建一个当前可用的测试活动用于测试，测试活动仅白名单可见</p>
            <div style={{textAlign: 'center', padding: '15px 0 20px 0'}}>
              <Button type="primary" size="large" onClick={() => {this.testModal('submit'); }} style={{marginRight: 20}}>仅创建正式活动</Button>
              <Button size="large" onClick={() => {this.testModal('createAndTest'); }}>同时创建正式活动和测试活动</Button>
            </div>
          </Modal>
        </Form>}
      </div>
    );
  },
});

export default Form.create()(OtherRules);
