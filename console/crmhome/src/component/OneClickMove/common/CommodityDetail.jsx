import React from 'react';
import { Button, Modal, Form, Tabs, Icon } from 'antd';
import componentGetter from '../common/ComponentGetter';
import BaseFormComponent from './BaseFormComponent';
import { pick, cloneDeep } from 'lodash';
import './commodityDetail.less';

const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: { span: 4, offset: 2 },
  wrapperCol: { span: 15 },
};

class CommodityDetail extends BaseFormComponent {
  static defaultProps = {
    ...BaseFormComponent.defaultProps,
    title: null,
    tabPanes: [],
    className: '',
    label: '商品详情',
    required: true,
  }
  constructor(props, ctx) {
    super(props, ctx);
    this.form = ctx.form;
    this.state = {
      visible: false,
      hasError: 0,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.form = nextContext.form;
  }

  onOk = () => {
    const { validateFields, getFieldsValue } = this.form;
    // ['contents', 'remarks', 'dishes', 'introductions'], {force: true},
    const contents = getFieldsValue();
    const contentsKeys = Object.keys(contents);
    const fieldInModal = [];
    let needValidate;

    contentsKeys.forEach((item) => {
      if (/^contents/.test(item)) {
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
      if (/^introduction/.test(item)) {
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
            hasError: 0,
          });
          return;
        }
        const errArr = Object.keys(errors);
        // console.log(errors, values);
        let errStatus = 0;
        errArr.forEach((item) => {
          if (/^contents/.test(item)) {
            errStatus = errStatus | 4;    // 100
          }
          if (/^remarks/.test(item)) {
            errStatus = errStatus | 4;    // 100
          }
          if (/^dishes/.test(item)) {
            errStatus = errStatus | 2;    // 010
          }
          if (/^introduction/.test(item)) {
            errStatus = errStatus | 1;    // 001
          }
        });
        const dishesFormValue = this.form.getFieldValue('dishes');
        if (!fieldInModal.some(key => key.indexOf('dishes0') >= 0) && !(dishesFormValue && dishesFormValue.length
          && dishesFormValue.some(dish => dish.title && dish.imageUrls && dish.imageUrls.length > 0))) {
          errStatus = errStatus | 2;
        }
        this.setState({
          hasError: errStatus,
        });
      });
    }
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  get footer() {
    return (
      <div>
        <Button onClick={this.onCancel}>关 闭</Button>
        <Button
          onClick={this.onOk}
          type="primary"
        >
          确 定
        </Button>
      </div>
    );
  }

  get requiredRule() {
    return (r, v, cb) => {
      cb();
    };
  }

  renderTabPane(panes) {
    return panes.map((item, i) => {
      // 泛行业创建商品详情编辑时的组件修改点
      const errorTip = ((this.state.hasError >> (2 - i)) & 1) === 1 ? <Icon style={{ color: '#f50' }} type="exclamation-circle" /> : null;
      return (<TabPane tab={<span>{item.name}{errorTip}</span>} key={i} width="668">
        {componentGetter({ ...formItemLayout, ...cloneDeep(item.config) })}
      </TabPane>);
    });
  }

  renderInputHidden(panes) {
    const { getFieldProps } = this.form;
    return panes.map((item, k) => {
      if (item.namedConfig && Array.isArray(item.namedConfig)) {
        const ret = item.namedConfig.map((i) => {
          return <input type="hidden" {...getFieldProps(i.field) } />;
        });
        return React.createElement('div', { key: k }, ...ret);
      }
      return <input type="hidden" {...getFieldProps(item.config.field, { rules: [...item.config.rules] }) } />;
    });
  }

  render() {
    const { tabPanes, className, rules, field } = this.props;
    const { getFieldProps } = this.form;
    const formItemProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required']);
    const validators = [...rules];
    if (this.props.required) {
      validators.push(this.requiredRule);
    }

    return (
      <Form.Item
        {...formItemProps}
      >
        <input type="hidden" {...getFieldProps(field, { rules: validators }) } />
        <a onClick={() => { this.setState({ visible: true }); }}>编辑</a>
        <Modal
          className={className}
          width="700"
          height="500"
          visible={this.state.visible}
          title="商品详情"
          onOk={this.onOk}
          onCancel={this.onCancel}
          footer={this.footer}
          style={window.top !== window ? { top: window.top.scrollY } : undefined}
          closable
        >
          {React.createElement('div', {
            style: { marginBottom: '12px', display: 'inline-block', width: 668 },
          }, (
              <Tabs defaultActiveKey="0" >
                {this.renderTabPane(tabPanes)}
              </Tabs>
            ),
            ...this.renderInputHidden(tabPanes)
          )}
        </Modal>
      </Form.Item>
    );
  }
}

export default CommodityDetail;
