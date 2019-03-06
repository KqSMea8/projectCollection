import React, {PropTypes} from 'react';
import classnames from 'classnames';
import Cascader from './Cascader';
import Area from './Area';
import mixins from './mixins';
import {Form} from 'antd';
import CategoryChangeSignUtil from './categoryChangeSignUtil';
const FormItem = Form.Item;

const AreaCategoryCols = React.createClass({
  propTypes: {
    form: PropTypes.object,
    showDesc: PropTypes.bool,
    allCategory: PropTypes.bool,
    allArea: PropTypes.bool,
    disabled: PropTypes.bool,
    areaDisabled: PropTypes.bool,
    needWaring: PropTypes.bool,
    categoryDisabled: PropTypes.bool,
    shopType: PropTypes.string, // COMMON, MALL
    isShopEdit: PropTypes.bool,
    checkChangeSign: PropTypes.bool,
    partnerId: PropTypes.string,
  },

  mixins: [mixins],

  onCategoryChange(v) {
    const categoryId = v && v[v.length - 1];
    if (this.props.checkChangeSign && categoryId) { // 检查改签
      this.setState({
        categoryTip: null,
        categoryTipClick: null,
      });

      const partnerId = this.props.partnerId;
      CategoryChangeSignUtil.checkChangeSign({
        partnerId,
        categoryId,
        shouldChangeSign: () => {
          const showConfirm = () => {
            this.setState({
              categoryTip: '当前品类需改签，请提交后联系商户改签',
              categoryTipClick: showConfirm,
            });
            CategoryChangeSignUtil.showShouldChangeSignConfirm({categoryId});
          };
          showConfirm();
        },
        cantChangeSign: () => {
          CategoryChangeSignUtil.showCantChangeSignAlert();
          this.setState({
            categoryTip: '当前品类需改签，请联系口碑小二改签',
            categoryTipClick: CategoryChangeSignUtil.showCantChangeSignAlert,
          });
        },
      });
    }
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const { needWaring, disabled, areaDisabled, showDesc, form, categoryDisabled, shopType, isShopEdit } = this.props;
    let isCategoryDisabled;
    if (categoryDisabled) {
      isCategoryDisabled = false;
    } else {
      if (isShopEdit) {
        isCategoryDisabled = true;
      } else {
        isCategoryDisabled = disabled;
      }
    }

    return (<div>
      <Area form={form} showDesc={showDesc} shopType={shopType} areas={this.state.areas} onAreaChange={this.onAreaChange} disabled={disabled || areaDisabled}/>
      {needWaring ? (<FormItem
        label={<div style={{height: 1}}></div>}
        labelCol={{span: 4}}
        wrapperCol={{span: 14}}
        help>
        <div style={{marginTop: -10}}>
          {<span style={{color: '#f60'}}>该字段属于敏感字段，修改后需经过审批通过才生效</span>}
        </div>
      </FormItem>) : null}
      <FormItem
        label="品类："
        required
        validateStatus={classnames({error: !!getFieldError('categoryId')})}
        help={getFieldError('categoryId') || true}
        labelCol={{span: 4}}
        wrapperCol={{span: 18}}>
        <Cascader data={this.state.categories}
          placeholder="请选择"
          style={{width: '400px'}}
          disabled={isCategoryDisabled}
          {...getFieldProps('categoryId', {
            onChange: this.onCategoryChange,
            rules: [{
              required: true,
              message: '此处必填',
              type: 'array',
            }],
          })}
        />
        <span style={{marginLeft: 20}}>
          <a href="https://cshall.alipay.com/takeaway/knowledgeDetail.htm;jsessionid=9A2702F2B85CDD8D6643A0CF8652D432?knowledgeId=201602046422&enctraceid=SmcXNHS6TNQTeKLy_aFiBY7NuBv-io_z1KWqLzhLnn4"
            target="_blank" style={{textDecoration: 'underline'}}>
            品类怎么选？
          </a>查看实际经营在口碑归哪个品类
        </span>
        {
          this.state.categoryTip ? (<p style={{ display: 'block', lineHeight: '16px', color: '#F90', marginTop: '8px' }}>
            <span>{this.state.categoryTip}</span>
            {this.state.categoryTipClick ? <a onClick={this.state.categoryTipClick}> 查看 </a> : null}
          </p>) : null
        }
      </FormItem>
    </div>);
  },
});

export default AreaCategoryCols;
