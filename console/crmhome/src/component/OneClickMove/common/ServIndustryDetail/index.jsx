import React from 'react';
import { Form, Modal, Collapse, Alert, Icon } from 'antd';
import BaseFormComponent from '../BaseFormComponent';
import componentGetter from '../ComponentGetter';
import { cloneDeep } from 'lodash';
import './index.less';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};
export default class ServIndustryDetail extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    rules: [],
    optionsArr: [],
  }
  state = {
    visible: false,
    err: ['', '', ''],
  }
  onClick = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk = () => {
    const { validateFields, getFieldsValue } = this.form;
    const contents = getFieldsValue();
    const contentsKeys = Object.keys(contents);
    const fieldInModal = [];
    let needValidate;
    contentsKeys.forEach((item) => {
      if (/^contents/.test(item)) {
        fieldInModal.push(item);
        needValidate = true;
      }
      if (/^descGroups/.test(item)) {
        fieldInModal.push(item);
        needValidate = true;
      }
      if (/^remarks/.test(item)) {
        fieldInModal.push(item);
        needValidate = true;
      }
      if (/^dishes/.test(item)) {
        fieldInModal.push(item);
        needValidate = true;
      }
      if (/^services/.test(item)) {
        fieldInModal.push(item);
        needValidate = true;
      }
    });
    if (!needValidate) {
      this.setState({
        visible: false,
      });
    } else {
      validateFields(fieldInModal, (errors /* , values*/) => {
        if (!errors) {
          this.setState({
            visible: false,
          });
          return;
        }
      });
    }
  }
  render() {
    const { label, required, labelCol, wrapperCol, tabPanes, namedConfig, field } = this.props;
    const { err } = this.state;
    const { getFieldProps } = this.form;
    return (
      <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        style={{ paddingBottom: 25 }}
      >
        <FormItem>
          <a onClick={this.onClick}>编辑</a>
          <input type="hidden" {...getFieldProps(field)} />
        </FormItem>
        <Modal title="商品内容" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
          width="750"
          style={window.top !== window ? { top: window.top.scrollY } : undefined}
        >
          <div className="serv-industry-detail">
            <Collapse defaultActiveKey={['0', '1', '2']}>
              {tabPanes.map((item, i) => {
                return (
                  <Panel key={i} header={<span>{item.name}{err[i] && <Icon style={{ color: '#f50', marginLeft: 10 }} type="exclamation-circle" />}</span>}>
                    {item.alert && <div className="panel-alert"><Alert message={item.alert} type="info" showIcon /></div>}
                    {componentGetter({ ...formItemLayout, ...cloneDeep(item.config) })}
                  </Panel>
                );
              })}
            </Collapse>
            {(namedConfig || []).map(item => <input type="hidden" key={item} {...getFieldProps(item)} />)}
          </div>
        </Modal>
      </FormItem>
    );
  }
}
