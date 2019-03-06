import React, { PropTypes } from 'react';
import { Modal, Form, Radio, Input, DatePicker, message } from 'antd';
import ADImgPicker from './ADImgPicker';
import ChooseAGoods from './ChooseAGoods';
import fetch from '@alipay/kb-fetch';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class OpenAddADModal extends React.Component {
  static propTypes = {
    modifyData: PropTypes.any,
    onSuccess: PropTypes.func,
    cantAdd: PropTypes.bool,
    brandShopId: PropTypes.string.isRequired, // 品牌门店id
    brandId: PropTypes.string.isRequired, // 品牌id
  };
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      submitting: false,
    };
    const modifyData = props.modifyData;
    if (modifyData) {
      props.form.setFieldsInitialValue({
        banner: { url: modifyData.imageUrl, sourceId: modifyData.imgId },
        advertUrlType: modifyData.advertUrlType,
        goodsItem: modifyData.itemId,
        customUrl: modifyData.advertUrlType === 'CUSTOM' && modifyData.advertUrl || '',
        dateRange: [modifyData.startTime, modifyData.endTime],
      });
    }
  }
  showModal = () => {
    if (this.props.cantAdd) {
      Modal.error({
        title: '提示',
        content: '最多只能添加4条广告',
      });
      return;
    }
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.handleSubmit();
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleSubmit = () => {
    this.props.form.validateFields((errors, values) => {
      const getFieldError = this.props.form.getFieldError;
      const errMsg = errors && Object.keys(errors).map((key) => getFieldError(key) && getFieldError(key)[0]).join(' ');
      if (errMsg) {
        message.error(errMsg);
      } else {
        this.setState({ submitting: true });

        let advertUrl;
        let advertUrlName;
        let entityShopId;
        const modifyData = this.props.modifyData;
        if (values.advertUrlType === 'ITEM') {
          entityShopId = values.goodsItem.entityShopId || (modifyData && modifyData.entityShopId); // 重选商品 goodsItem.entityShopId 才有值
          const extInfo = encodeURIComponent(JSON.stringify({ platformSubsidyFirst: true, suitObjId: entityShopId }));
          advertUrl = `alipays://platformapi/startapp?appId=20001039&target=goodsDetail&itemId=${values.goodsItem.itemId}&extInfo=${extInfo}`;
          advertUrlName = values.goodsItem.itemName;
        } else if (values.advertUrlType === 'CUSTOM') {
          advertUrl = values.customUrl;
          advertUrlName = values.customUrl;
        }

        fetch({
          url: modifyData ? 'kbshopdecorate.advertManagerWrapperService.update' : 'kbshopdecorate.advertManagerWrapperService.delivery',
          param: {
            advertId: modifyData && modifyData.advertId,
            brandShopId: this.props.brandShopId,
            imgId: values.banner.sourceId,
            advertUrlType: values.advertUrlType, // CUSTOM, ITEM
            itemId: values.advertUrlType === 'ITEM' && values.goodsItem.itemId, // 商品id
            advertUrl,
            advertUrlName, // 广告名
            entityShopId, // 商品适用门店
            startTime: moment(values.dateRange[0]).format('YYYY-MM-DD HH:mm'),
            endTime: moment(values.dateRange[1]).format('YYYY-MM-DD HH:mm'),
          },
        }).then(() => {
          this.setState({ submitting: false });
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
        }).catch(e => {
          Modal.error({ title: '出错', content: e.message });
          this.setState({ submitting: false });
        });
      }
    });
  }
  render() {
    const { getFieldProps, getFieldValue } = this.props.form;
    const { submitting, visible } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      required: true,
    };

    const children = React.cloneElement(this.props.children, { onClick: this.showModal });
    return (
      <div style={{ display: 'inline-block' }}>
        {children}
        <Modal title="选择要添加的商品" visible={visible}
          loading={submitting}
          width="750"
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="广告banner图">
              <ADImgPicker
                {...getFieldProps('banner', { rules: [{ required: true, message: '请上传广告banner图' }] })}
              />
            </FormItem>
            <FormItem {...formItemLayout} label="banner点击跳转">
              <RadioGroup {...getFieldProps('advertUrlType', {rules: [{ required: true, message: '请选择banner点击跳转方式' }]})}
              style={{ width: '100%' }}>
                <Radio value="ITEM">在售商品详情</Radio>
                <Radio value="CUSTOM">自定义url</Radio>
                <div>
                  {getFieldValue('advertUrlType') === 'ITEM' && (<ChooseAGoods
                    {...getFieldProps('goodsItem', { rules: [{ required: true, message: '请选择在售商品' }] })}
                    brandShopId={this.props.brandShopId}
                    brandId={this.props.brandId}
                  />)}
                  {getFieldValue('advertUrlType') === 'CUSTOM' && (<div>
                    <Input {...getFieldProps('customUrl')} placeholder="请输入要跳转的url" />
                    <p>可在 <a href="https://fengdie.alipay-eco.com/intro" target="_blank">云凤蝶</a> 编辑活动发布后，将活动链接填入。</p>
                  </div>)}
                </div>
              </RadioGroup>
            </FormItem>
            <FormItem {...formItemLayout} label="广告投放时间">
              <RangePicker
                size="default"
                showTime
                format="yyyy-MM-dd HH:mm"
                {...getFieldProps('dateRange', { rules: [{ required: true, message: '请设置广告投放时间' }] })}
              />
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(OpenAddADModal);
