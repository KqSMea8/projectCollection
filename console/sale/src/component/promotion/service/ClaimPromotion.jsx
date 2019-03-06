import React from 'react';
import {Breadcrumb, Button, Checkbox, Form, message, Input} from 'antd';
import ajax from 'Utility/ajax';
import classnames from 'classnames';
import './index.less';
import { accMul } from '../utils';

const FormItem = Form.Item;

const ClaimPromotion = React.createClass({
  getInitialState() {
    return {
      data: {},
      canSubmit: false,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onAgree(e) {
    const checked = (e.target.checked);
    if (checked) {
      this.setState({
        canSubmit: true,
      });
    } else {
      this.setState({
        canSubmit: false,
      });
    }
  },

  onClaim() {
    const {validateFields} = this.props.form;
    validateFields((error, values) => {
      if (!!error) {
        return;
      }
      const data = {
        ...values,
        taskId: this.props.params.taskId,
      };
      ajax({
        url: window.APP.kbopenprodUrl + '/commodity/task/claimTask.json',
        method: 'post',
        data: data,
        type: 'json',
        success: (res) => {
          if (res.status === 'succeed') {
            message.success('认领成功');
            setTimeout(()=>{
              window.location.hash = '#promotion/myOrder';
            }, 3000);
          } else {
            message.error(res.resultMsg || '认领失败');
          }
        },
        error: (res) => {
          message.error(res.resultMsg || '认领失败');
        },
      });
    });
  },

  checkContact(rule, value, callback) {
    const cellphone = /^1\d{10}$/;
    const telephone = /^0\d{2,3}-?\d{7,8}$/;

    if (!cellphone.test(value) && !telephone.test(value)) {
      callback(new Error('请输入正确的联系方式'));
      return;
    }
    callback();
  },

  fetch() {
    const data = {
      taskId: this.props.params.taskId,
    };

    ajax({
      url: window.APP.kbopenprodUrl + '/commodity/taskQuery/queryTaskInfo.json',
      method: 'get',
      data: data,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            data: res.data,
          });
        }
      },
      error: () => {
        this.setState({
          data: {},
        });
      },
    });
  },

  render() {
    const { data } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    return (<div>
      <div className="app-detail-header" style={{position: 'relative'}}>
          <Breadcrumb>
            <Breadcrumb.Item><a href="#/promotion/list">选购推广服务</a></Breadcrumb.Item>
            <Breadcrumb.Item>推广</Breadcrumb.Item>
          </Breadcrumb>
      </div>
      <div className="promotion-head" style={{margin: '24px 0 0 18px'}}>推广任务信息</div>
      <div className="app-detail-content-padding" style={{paddingTop: 0}}>
         <table className="kb-detail-table-4" style={{marginTop: 20}}>
          <tbody>
            <tr>
              <td className="kb-detail-table-label">推广任务类型</td>
              <td colSpan="3">{data.taskTypeName}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广服务名称</td>
              <td colSpan="3">{data.commodityName}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广任务名称</td>
              <td colSpan="3">{data.taskName}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">推广时间</td>
              <td colSpan="3">{data.startTime} ~ {data.endTime}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">佣金计算方式</td>
              <td colSpan="3">{data.feeTypeName}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">当前佣金政策</td>
              <td colSpan="3">{data.scale ? accMul(data.scale, 100) : null}%
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">ISV名称</td>
              <td colSpan="3">{data.isvName}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">ISV ID</td>
              <td colSpan="3">{data.isvId}
              </td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">联系方式</td>
              <td colSpan="3">{data.contact}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="promotion-head" style={{margin: '24px 0 0 18px'}}>联系方式</div>
      <div className="app-detail-content-padding" style={{paddingTop: 0}}>
        <FormItem
          label="我的联系方式"
          required
          labelCol={{span: 7}}
          wrapperCol={{span: 12}}
          style={{height: '40px'}}
          className="myContact"
          validateStatus={
          classnames({
            error: !!getFieldError('contact'),
          })}
          help={(getFieldError('contact')) || '请确保信息真实，方便ISV能联系到您'}>
            <Input placeholder="请输入联系方式" style={{width: '500px'}} {...getFieldProps('contact', {
              rules: [this.checkContact],
            })}/>
        </FormItem>
      </div>
      <div style={{textAlign: 'center', marginTop: '20px'}}>
            <label>
              <Checkbox onChange={this.onAgree}/>
              同意<a href="https://render.alipay.com/p/f/fd-j1bvwym4/index.html" target="_blank">《服务市场服务推广协议（推广者）》</a>
            </label>
        </div>
        <div style={{textAlign: 'center', marginTop: '20px'}}><Button type="primary" onClick={this.onClaim} disabled={!this.state.canSubmit}>认领</Button></div>
        <p style={{textAlign: 'center', marginTop: '10px', color: '#aaa'}}>认领成功后，次日00:00:00生效</p>
    </div>);
  },
});

export default Form.create()(ClaimPromotion);
