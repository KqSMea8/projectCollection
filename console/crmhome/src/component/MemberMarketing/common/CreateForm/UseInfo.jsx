import React, {PropTypes} from 'react';
import { Form, Input } from 'antd';
const FormItem = Form.Item;

/*
  表单字段 － 使用说明
*/

const UseInfo = React.createClass({
  propTypes: {
    form: PropTypes.object,
    layout: PropTypes.object,
    initData: PropTypes.object,
    roleType: PropTypes.string,
    actionType: PropTypes.string,
    max: PropTypes.number,
  },

  getDefaultProps() {
    return {
      initData: {},
    };
  },

  getInitialState() {
    const {initData} = this.props;
    return {
      list: initData.descList && initData.descList.length ? initData.descList : [''],
    };
  },

  componentDidMount() {
    const { initData } = this.props;

    this.props.form.setFieldsValue({
      'descList': initData.descList,
    });
  },

  setDescList() {
    this.props.form.setFieldsValue({
      'descList': this.state.list,
    });
  },

  addItem(e) {
    e.preventDefault();

    const list = this.state.list;

    if (this.props.max > list.length) {
      list.push('');
      this.setState({
        list: list,
      });
    }
  },

  delItem(index, e) {
    e.preventDefault();

    const list = this.state.list;
    list.splice(index, 1);

    this.setState({
      list: list,
    });

    this.setDescList();
  },

  inputBlur(index, e) {
    const list = this.state.list;
    list[index] = e.target.value;

    this.setState({
      list: list,
    });

    this.setDescList();
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { max } = this.props;

    let actionElem = '';
    if ( max > this.state.list.length ) {
      actionElem = <a href="#" onClick={this.addItem}>增加</a>;
    }

    return (
      <FormItem
        {...this.props.layout}
        label="使用说明：">
        {this.state.list.map((item, index) => {
          return (
            <div key={'rule-wrap' + index}>
              <Input
                placeholder="请输入使用说明，100字以内"
                style={{ width: 250, marginRight: 5, marginBottom: 5 }}
                defaultValue={item}
                onBlur={this.inputBlur.bind(this, index)}
                key={'rule' + Math.random()}
                maxLength={100} />
              {index === 0 ? actionElem : <a href="#" onClick={this.delItem.bind(this, index)}>删除</a>}
            </div>
          );})
        }
        <Input type="hidden" {...getFieldProps('descList')} />
      </FormItem>
    );
  },
});

export default UseInfo;
