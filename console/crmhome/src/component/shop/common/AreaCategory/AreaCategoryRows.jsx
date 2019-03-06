import React, {PropTypes} from 'react';
import classnames from 'classnames';
import Cascader from './Cascader';
import Area from './Area';
import mixins from './mixins';
import {Form} from 'antd';
import CategoryChangeSignUtil from './categoryChangeSignUtil';
const FormItem = Form.Item;

const AreaCategoryRows = React.createClass({
  propTypes: {
    form: PropTypes.object,
    showDesc: PropTypes.bool,
    addressDisabled: PropTypes.bool,
    categoryDisabled: PropTypes.bool,
    checkChangeSign: PropTypes.bool,
    partnerId: PropTypes.string,
  },

  mixins: [mixins],

  onCategoryChange(v) {
    if (this.props.checkChangeSign) { // 检查改签
      this.setState({
        categoryTip: null,
        categoryTipClick: null,
      });

      const partnerId = this.props.partnerId;
      const categoryId = v && v[v.length - 1];
      CategoryChangeSignUtil.checkChangeSign({
        partnerId,
        categoryId,
        shouldChangeSign: (resultData) => {
          const showConfirm = () => {
            this.setState({
              categoryTip: '当前品类需改签，请同意改签',
              categoryTipClick: showConfirm,
            });
            CategoryChangeSignUtil.showShouldChangeSignConfirm({
              categoryId,
              checkSignApiData: resultData,
              okCallback: () => {
                this.setState({
                  categoryTip: '当前品类需改签，您已同意改签',
                  categoryTipClick: showConfirm,
                });
              },
            });
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
    const {getFieldProps, getFieldError} = this.props.form;
    const {form, showDesc, addressDisabled, categoryDisabled} = this.props;
    const inheritedProps = {form, showDesc, addressDisabled, categoryDisabled};
    return (<div>
      <Area {...inheritedProps}
        areas={this.state.areas}
        onAreaChange={this.onAreaChange}/>

      <FormItem
        label="品类："
        required
        validateStatus={classnames({error: !!getFieldError('categoryId')})}
        help={getFieldError('categoryId') || true}
        labelCol={{span: 4}}
        wrapperCol={{span: 18}}>
        <Cascader data={this.state.categories}
          disabled={this.props.categoryDisabled}
          placeholder="请选择品类"
          {...getFieldProps('categoryId', {
            onChange: this.onCategoryChange,
            rules: [{
              required: true,
              message: '此处必填',
              type: 'array',
            }],
          })}
        />
        {
          this.state.categoryTip ? (<p style={{ display: 'block', lineHeight: '16px', color: '#F90', marginTop: '8px' }}>
            <span>{this.state.categoryTip}</span>
            {this.state.categoryTipClick ? <a onClick={this.state.categoryTipClick}> 查看 </a> : null}
          </p>) : null
        }
        <div><a href="https://cshall.alipay.com/takeaway/knowledgeDetail.htm;jsessionid=9A2702F2B85CDD8D6643A0CF8652D432?knowledgeId=201602046422&enctraceid=SmcXNHS6TNQTeKLy_aFiBY7NuBv-io_z1KWqLzhLnn4" target="_blank" style={{textDecoration: 'underline'}}>品类怎么选？</a>查看实际经营在口碑归哪个品类</div>
      </FormItem>
    </div>);
  },
});

export default AreaCategoryRows;
