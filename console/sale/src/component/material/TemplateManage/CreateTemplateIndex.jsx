import React, {PropTypes} from 'react';
import {Breadcrumb, Form, Radio, Row, Col} from 'antd';
import ConfirmOut from '../common/ConfirmOut';
import './tempmanage.less';
import CreateAlipayTemp from './CreateAlipayTemp';
import CreateKoubeiTemp from './CreateKoubeiTemp';
import {Lifecycle, History } from 'react-router';
import permission from '@alipay/kb-framework/framework/permission';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const CreateTemplateIndex = React.createClass({
  propTypes: {
    location: PropTypes.any,
    form: PropTypes.object,
  },
  mixins: [Lifecycle, History],
  getInitialState() {
    return {
      showOutModel: false,
      data: {},
      noKoubeiAuth: false, // 为true则无口碑的创建权限
      noAlipayAuth: false, // 为true则无支付宝的创建权限
    };
  },
  componentWillMount() {
    // 初始化radio的默认选择按钮
    if (this.props.location.query.tab === 'koubei') {
      this.setState({
        // 当前所选的属于口碑
        belongDomain: 'KOUBEI',
      });
    } else if (this.props.location.query.tab === 'alipay') {
      this.setState({
        // 当前所选的属于支付宝
        belongDomain: 'ALIPAY',
      });
    }
    // 判断有无口碑的创建权限,
    if (!permission('STUFF_TEMPLATE_MANAGE_KOUBEI')) {
      this.setState({
        noKoubeiAuth: true, // 为true则无口碑的创建权限,radio置灰
      });
    }
    // 判断有无alipay的创建权限,
    if (!permission('STUFF_TEMPLATE_MANAGE_ALIPAY')) {
      this.setState({
        noAlipayAuth: true, // 为true则无alipay的创建权限,radio置灰
      });
    }
  },

  // 通过radio 判断创建是支付宝还是口碑模板
  getShowDom(e) {
    e.preventDefault();
    // 如果物料归属支付宝则不显示相应的元素
    if (e.target.value === 'ALIPAY') {
      this.setState({
        // 当前所选的属于支付宝
        belongDomain: 'ALIPAY',
      });
    } else if (e.target.value === 'KOUBEI') {
      this.setState({
        // 当前所选的属于口碑
        belongDomain: 'KOUBEI',
      });
    }
  },

  // 当创建模板成功之后则隐藏二次确认退出框
  getCreateStatus(hidenModel) {
    this.isCreateSuccess = hidenModel;
  },

  hideOutModel() {
    this.setState({showOutModel: false});
  },
  goToNxet() {
    this.forceGoto = true;
    window.location.hash = this.nextPath;
  },

  routerWillLeave(nextLocation) {
    this.nextPath = nextLocation.pathname;
    // 当创建模板不成功时弹出退出框.
    if (this.isCreateSuccess !== 'hidenModel') {
      this.setState({showOutModel: !this.forceGoto});
      return !!this.forceGoto;
    }
  },

  /*eslint-disable */
  render() {
    /*eslint-enable */
    const {getFieldProps} = this.props.form;
    const {noKoubeiAuth, noAlipayAuth} = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };
    // 判断新建模板的tab入口, 口碑或者支付宝
    let tabName;
    if (this.props.location.query.tab === 'koubei') {
      tabName = <Breadcrumb.Item href="#/material/TemplateManage/koubei">口碑物料模板</Breadcrumb.Item>;
    } else if (this.props.location.query.tab === 'alipay') {
      tabName = <Breadcrumb.Item href="#/material/TemplateManage/alipay">支付宝物料模版</Breadcrumb.Item>;
    }

    return (<div>
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          {tabName}
          <Breadcrumb.Item>新建模板</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="app-detail-content-padding" style={{position: 'relative'}}>
        <Form horizontal>
          <Row>
            <Col>
              <FormItem
                {...formItemLayout}
                label="物料归属：">
                <RadioGroup {...getFieldProps('domain', {
                  initialValue: this.state.belongDomain,
                  onChange: this.getShowDom,
                  rules: [{
                    message: '请选择物理归属',
                    required: true,
                  }],
                })}>
                  <Radio key="KOUBEI" value= "KOUBEI" disabled={noKoubeiAuth ? true : null}>口碑</Radio>
                  <Radio key="ALIPAY" value= "ALIPAY" disabled={noAlipayAuth ? true : null}>支付宝</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>

        </Form>
        {
          this.state.belongDomain === 'ALIPAY' && <CreateAlipayTemp fromTab={this.props.location.query.tab} getCreateStatus = {this.getCreateStatus} tempId= {this.props.location.query.tab === 'alipay' ? this.props.location.query.id : null}/>
        }
        {
          this.state.belongDomain === 'KOUBEI' && <CreateKoubeiTemp fromTab={this.props.location.query.tab} getCreateStatus = {this.getCreateStatus} tempId= {this.props.location.query.tab === 'koubei' ? this.props.location.query.id : null}/>
        }
      </div>
      {this.state.showOutModel ? <ConfirmOut onCancel={this.hideOutModel} onOk={this.goToNxet}/> : null}
    </div>);
  },
});
export default Form.create()(CreateTemplateIndex);
