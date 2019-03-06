import React from 'react';
import { Form, Cascader } from 'antd';
// import ajax from '../../../common/ajax';
import BaseFormComponent from './BaseFormComponent';

// function flattenCategory2CascaderOptions(allCategory = [], onlyToSecond) {
//   const res = [];
//   allCategory.forEach(cate => {
//     const node = {
//       label: cate.name,
//       value: cate.categoryId,
//       disabled: !(cate.subCategories && cate.subCategories.length) && !cate.canPublishItem,
//     };
//     if (cate.subCategories && cate.subCategories.length) {
//       if (onlyToSecond) {
//         node.children = cate.subCategories.map(d => ({ label: d.name, value: d.categoryId, disabled: !d.canPublishItem }));
//       }
//       /*eslint-disable */
//       else {
//       /*eslint-enable */
//         node.children = flattenCategory2CascaderOptions(cate.subCategories);
//       }
//     }
//     res.push(node);
//   });
//   return res;
// }

const FormItem = Form.Item;
export default class TypeSelect extends BaseFormComponent {
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    label: '所属类目',
    placeholder: '请选择',
    required: true,
    allCategorys: [],
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
    // this.state = {
    //   allCategorys: [],
    // };
  }
  // componentDidMount() {
  //   ajax({
  //     url: window.APP.kbservindustryprodUrl + '/item/getCategoryTree.json',
  //     type: 'json',
  //     method: 'post',
  //     success: (res) => {
  //       if (res.data && res.status === 'succeed') {
  //         // const options = flattenCategory2CascaderOptions(res.data.root.subCategories, false);
  //         const options = flattenCategory2CascaderOptions([{
  //           categoryId: '111',
  //           leaf: true,
  //           name: '简单大大的',
  //           canPublishItem: true,
  //           highSecurity: true,
  //           priceRange: {
  //             min: 0,
  //             max: 10000,
  //           },
  //           subCategories: [],
  //         }], false);
  //         this.setState({
  //           allCategorys: options,
  //         });
  //       }
  //     },
  //   });
  // }
  onChange = (v, node) => {
    if (v && node.length > 0) {
      this.props.changeCategory(v[v.length - 1], node[node.length - 1].max, node[node.length - 1].min, node[node.length - 1].highSecurity);
    }
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field, rules } = this.props;
    return getFieldProps(field, {
      onChange: this.onChange,
      rules,
    });
  }

  render() {
    const { label, placeholder, extra, required, labelCol, wrapperCol, allCategorys } = this.props;
    return (
      <FormItem
        label={label}
        required={required}
        extra={extra}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <Cascader
          placeholder={placeholder}
          expandTrigger="hover"
          {...this.fieldProps}
          options={allCategorys}
        />
      </FormItem>
    );
  }
}
