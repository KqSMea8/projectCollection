import React, {PropTypes} from 'react';
import {Form, Input, Row, Col, Button, message} from 'antd';
import {validationAdcode, commonCheck, checkAddressCollect} from '../../../../common/validatorUtils';
import classnames from 'classnames';
import Cascader from './Cascader';
import Map from './Map';

const FormItem = Form.Item;

const Area = React.createClass({
  propTypes: {
    form: PropTypes.object,
    showDesc: PropTypes.bool,
    areas: PropTypes.array,
    onAreaChange: PropTypes.func,
    addressDisabled: PropTypes.bool,
  },

  getInitialState() {
    return {
    };
  },

  onFocusAddressInfo() {
    this.refs.addressText.style.display = 'block';
  },

  checkMap(rule, value, callback) {
    if (!value) {
      callback(new Error('无法找到实际位置，可通过拖动蓝点修改'));
    } else {
      const {lng, lat} = value;
      commonCheck('poi', {longitude: lng, latitude: lat}, callback);
    }
  },

  checkAdreass(rules, value, callback) {
    if (value === '') {
      this.refs.addressText.style.display = 'block';
    }
    commonCheck('address', {address: value}, (errs) => {
      if (!errs) {
        setTimeout(()=> {
          this.refs.addressText.style.display = 'none';
        }, 2000);
      }
      if (errs) {
        callback(errs);
        this.refs.addressText.style.display = 'block';
      } else if (this.props.form.getFieldsValue(['area'])) {
        this.checkAll(callback);
      }
    });
  },

  checkAll(callback) {
    const cb = (typeof callback === 'function') ? callback : () => {};
    const {area, address} = this.props.form.getFieldsValue();
    if (area && area.length >= 2 && address) {
      let provinceId;
      let cityId;
      let districtId;
      if (area.length === 3) {
        provinceId = area[0];
        cityId = area[1];
        districtId = area[2];
      } else {
        provinceId = area[0];
        cityId = area[0];
        districtId = area[1];
      }
      const params = {
        provinceId: provinceId,
        cityId: cityId,
        districtId: districtId,
        address: address,
      };
      validationAdcode(params, (result) => {
        const areaArray = [];
        areaArray.push(params.provinceId, params.cityId, result.correctDistrictId);
        message.warn('您的区应该填写为' + result.correctDistrictName + ',系统已进行自动覆盖', 3);
        this.props.form.setFieldsValue({area: areaArray});
      });
      checkAddressCollect({
        address,
        provinceId,
        cityId,
        districtId,
      }, cb);
    } else {
      cb();
    }
  },

  saveMap(m) {
    this.map = m;
  },

  relocate() {
    const {getFieldValue} = this.props.form;
    const areaId = getFieldValue('area') && getFieldValue('area')[getFieldValue('area').length - 1];
    if (areaId) {
      this.map.search(areaId, getFieldValue('address'));
    }
  },

  render() {
    const {getFieldValue, getFieldError, getFieldProps} = this.props.form;
    const {areas, disabled, addressDisabled, showDesc, onAreaChange} = this.props;
    return (
      <FormItem
        required
        label="门店地址："
        labelCol={{span: 4}}
        wrapperCol={{span: 18}}>
        <div>
          <Row>
            <Col span="20">
              <FormItem
                validateStatus={classnames({error: !!getFieldError('area')})}
                help={getFieldError('area') || true}>
                <Cascader
                  data={areas}
                  placeholder={areas ? '省-市-区' : '加载中…'}
                  allowClear={!disabled}
                  disabled={disabled}
                  {...getFieldProps('area', {
                    onChange: onAreaChange,
                    rules: [{
                      required: true,
                      type: 'array',
                      message: '此处必填',
                    }],
                  })}
                />
              </FormItem>
            </Col>
            <Col span="3" offset="1">
              <Button type="primary" onClick={this.relocate}>地图定位</Button>
            </Col>
          </Row>
          <FormItem
            validateStatus={classnames({error: !!getFieldError('address')})}
            help={getFieldError('address') || true}>
            <Input style={{width: '100%', marginRight: 10}} disabled={addressDisabled} onBlur={this.checkAll}
              onFocus={this.onFocusAddressInfo}
              {...getFieldProps('address', {
                validateTrigger: 'onBlur',
                rules: [{
                  required: true,
                  message: '此处必填',
                }, this.checkAdreass],
              })}
                   placeholder="请输入详细地址，如：文一西路99号"/>
             <div ref="addressText" style={{display: 'none', marginBottom: 10}}>
               <p style={{lineHeight: '16px', marginTop: '8px'}}><span style={{color: '#F90'}}>请按规范格式填写地址，以免影响门店搜索及活动报名</span></p>
               <p style={{lineHeight: '16px'}}>例1：<span style={{color: '#F90'}}>道路+门牌号，“人民东路18号”</span></p>
               <p style={{lineHeight: '16px'}}>例2：<span style={{color: '#F90'}}>道路+门牌号+标志性建筑+楼层，“四川北路1552号欢乐广场1楼”;</span><a style={{textDecoration: 'underline', marginLeft: 20}} href="https://cshall.alipay.com/takeaway/knowledgeDetail.htm?knowledgeId=201602050473" target="_blank">正确的地址示例</a></p>
             </div>
          </FormItem>
          <FormItem
            validateStatus={classnames({error: !!getFieldError('map')})}
            help={getFieldError('map') || true}>
            <Map
              {...getFieldProps('map', {
                rules: [this.checkMap],
                ref: this.saveMap,
              })}
              checkAll={this.checkAll}
              areaId={getFieldValue('area') && getFieldValue('area')[getFieldValue('area').length - 1]}
              address={getFieldValue('address')}/>
          </FormItem>
          {
            showDesc && (
              <FormItem
                validateStatus={classnames({error: !!getFieldError('addressDesc')})}
                help={getFieldError('addressDesc') || true}>
                <Input style={{width: '100%', marginRight: 10}}
                  {...getFieldProps('addressDesc', {
                    rules: [{
                      max: 50,
                      message: '限50个字符',
                    }],
                  })}
                       placeholder="备注地址，例：地铁口左边"/>
              </FormItem>
            )
          }
        </div>
      </FormItem>);
  },
});

export default Area;
