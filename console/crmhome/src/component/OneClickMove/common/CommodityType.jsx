 /**
 * 核销方式
 */
import React, { PropTypes } from 'react';
import { Form, Select, Icon } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import './commodityType.less';

const FormItem = Form.Item;
const Option = Select.Option;
export default class CommodityType extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    field: PropTypes.string.isRequired,
  }
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '商品类型',
    rules: [],
    onSelect: () => {},
  }

  onSelectChange = (v, prev) => {
    if (v !== prev) {
      this.props.onSelect(v);
    }
    return v;
  }

  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, itemId, sequenceId, verifyFrequency } = this.props;
    let {initialValue} = this.props;
    const rules = [...this.props.rules];
    if (itemId || sequenceId) {
      initialValue = verifyFrequency;
    }
    if (this.props.required) {
      rules.push({
        required: true, message: `请选择${this.props.label}`,
      });
    }
    return getFieldProps(field, {
      normalize: this.onSelectChange,
      initialValue,
      rules,
    });
  }
  render() {
    const { label, required, labelCol, wrapperCol, placeholder, commodityType, sequenceId, itemId, verifyFrequency } = this.props;
    let isDisabled = false;
    let isShowTxt = false;
    const commodityTypeOption = [];
    if (itemId || sequenceId) {
      isDisabled = true;
      const opArr = [
        'single',
        'multi',
      ];
      // 判断用户是否有建次卡的权限---控制提示文案
      if (verifyFrequency === 'multi') {
        isShowTxt = true;
      }
      opArr.map((item) => {
        commodityTypeOption.push(<Option value={item}>{item === 'single' ? '普通商品' : '可多次核销商品'}</Option>);
      });
    } else {
      commodityType.map((item) => {
        // 判断用户是否有建次卡的权---限控制提示文案
        if (item === 'multi') {
          isShowTxt = true;
        }
        commodityTypeOption.push(<Option value={item}>{item === 'single' ? '普通商品' : '可多次核销商品'}</Option>);
      });
    }
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <Select {...this.fieldProps} placeholder={placeholder} disabled={isDisabled} >
        {commodityTypeOption}
        </Select>
        <div style={{marginTop: '5px'}}></div>
        {isShowTxt && <div>
           <div className="title-icon-row">
             <div className="icon-wrap"><Icon style={{color: '#2db7f5'}} className="anticon anticon-info-circle" /></div>
             <div className="title-content">
               <p className="title-p">类型说明</p>
               <p>可多次核销商品：如30份鸡翅套餐，用户购买这个商品之后，商品包含了30份鸡翅，用户最多可分30次使用。如此提高用户消费黏性。</p>
               <p>普通商品：即顾客购买的商品，只能一次性核销掉。</p>
             </div>
           </div>
         </div>}
      </FormItem>
    );
  }
}
