import React, {PropTypes} from 'react';
import { Table, Button} from 'antd';
import './ApproveMaterial.less';
import { Form, Input, message} from 'antd';
import {appendOwnerUrlIfDev} from '../../../../common/utils';
import ajax from '@alipay/kb-framework/framework/ajax';
import {MaterialPropertiesMap} from '../../common/MaterialLogMap';
import {format} from '../../../../common/dateUtils';
import permission from '@alipay/kb-framework/framework/permission';
import ErrorPage from 'Library/ErrorPage/NoPermission';
import PageLayout, {BlockTitle} from 'Library/PageLayout';

const FormItem = Form.Item;

const ApplyDetail = React.createClass({
  propTypes: {
    params: PropTypes.object,
    location: PropTypes.any,
  },
  getInitialState() {
    this.columns = [{
      title: '模板名称/ID',
      dataIndex: 'templateId',
      width: 210,
      render(text, record) {
        if (typeof text === 'undefined') {
          return '';
        }
        return (
          <div>
            <a target="_blank" href={'#/material/templatemanage/tempinfo/' + text}>{record.templateName}</a>
            <br />{text}
          </div>
          );
      },
    }, {
      title: '物料属性/类型',
      dataIndex: 'stuffAttrName',
      width: 150,
      render(text, record) {
        if (!text) {
          return '';
        }
        return [MaterialPropertiesMap[record.stuffType], <br />, text];
      },
    }, {
      title: '物料材质/规格尺寸',
      dataIndex: 'sizeName',
      width: 200,
      render(text, record) {
        if (!text) {
          return '';
        }
        return [record.materialName, <br />, text];
      },
    }, {
      title: '申请数量',
      dataIndex: 'applyQuantity',
      width: 150,
      render(t) {
        return [t, <span>&nbsp;</span>, '件'];
      },
    }, {
      title: '预估单价',
      dataIndex: 'unitPrice',
      width: 150,
      render(text) {
        const cent = text.cent || '';
        if (cent) {
          return `${cent / 100}元`;
        }
        return '-';
      },
    }];
    return {
      showModal: false,
      data: [],
      tableData: [],
      detailData: {},
    };
  },
  componentWillMount() {
    // const orderId = this.props.location;
    const orderId = this.props.params.orderId;
    const params = {
      mappingValue: 'kbasset.queryApplyOrder',
      domain: 'KOUBEI',
      orderId,
    };
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          const {stuffApplyItemDtoList} = result.data;
          this.setState({
            tableData: stuffApplyItemDtoList,
            detailData: result.data,
          });
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg, 3);
          }
        }
      },
      error: (e) => {
        message.error( '系统繁忙请稍后' || e.resultMsg);
      },
    });
  },
  submitAjax(params) {
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed') {
          window.location.hash = '#/material/applicationManagement/applicationRecord';
        } else {
          if (result.resultMsg) {
            message.error(result.resultMsg || '系统繁忙,请稍候……');
          }
        }
      },
      error: (err) => {
        message.error( err.resultMsg || '系统繁忙请稍后');
      },
    });
  },
  handleSubmit(type, e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }
      const params = {
        mappingValue: 'kbasset.reviewApplyItem',
        remark: values.remark,
        domain: 'KOUBEI',
        status: Number(type),
        orderId: this.props.params.orderId,
      };
      if (type === '801' && !values.remark) {
        message.error('请填写驳回理由');
        return;
      }
      this.submitAjax(params);
    });
  },
  renderTable(data) {
    const addressInfoDto = data.addressInfoDto || {provinceName: null, cityName: null, districtName: null, address: null};
    const {provinceName, cityName, districtName, address} = addressInfoDto;
    const add = provinceName + cityName + districtName + address;
    return (<table className="kb-detail-table-6">
      <tbody>
      <tr>
        <td className="kb-detail-table-label">申请单号</td>
        <td>{data.orderId}</td>
        <td className="kb-detail-table-label">申请时间</td>
        <td>{format(new Date(data.gmtCreate))}</td>
			</tr>
			<tr>
        <td className="kb-detail-table-label">申请人</td>
        <td>{data.applicant}</td>
        <td className="kb-detail-table-label">{data.storageType === 'CT' ? '申请城市' : '申请单位'}</td>
        <td>{data.storageName}</td>
			</tr>
			<tr>
        <td className="kb-detail-table-label">收货人姓名</td>
        <td>{data.receiver}</td>
        <td className="kb-detail-table-label">联系电话</td>
        <td>{data.contactPhone}</td>
      </tr>
			<tr>
        <td className="kb-detail-table-label">收货地址</td>
        <td colSpan="5">{add}</td>
			</tr>
     </tbody>
     </table>);
  },
  render() {
    const { getFieldProps } = this.props.form;
    if (!permission('STUFF_APPLY_ORDER_APPROVE')) {
      return (<ErrorPage />);
    }
    const breadcrumb = [
      {title: '申请单管理', link: '#/material/applicationManagement/applicationRecord'},
      {title: '审核'}
    ];
    return (
      <PageLayout breadcrumb={breadcrumb}>
        <BlockTitle title="审核内容"/>
        {this.renderTable(this.state.detailData)}
        <Table style={{marginTop: 20, marginBottom: 10}} columns={this.columns} dataSource={this.state.tableData} pagination={false}/>
        <Form horizontal form={this.props.form}>
          <FormItem
            label="备注：     "
            labelCol={{span: 1}}
            wrapperCol={{span: 16}}
          >
            <Input type="textarea" rows="3" placeholder="驳回时，请填写备注"
                   {...getFieldProps('remark')}
            />
          </FormItem>
          <FormItem
            wrapperCol={{ span: 5, offset: 1 }}
          >
            <Button type="primary" onClick={this.handleSubmit.bind(this, '802')} style={{marginRight: 80}}>通过</Button>
            <Button type="ghost" onClick={this.handleSubmit.bind(this, '801')}>驳回</Button>
          </FormItem>
        </Form>
      </PageLayout>
    );
  }
});

export default Form.create()(ApplyDetail);
