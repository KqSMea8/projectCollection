import React, { Component } from 'react';
import PageLayout, { BlockTitle } from 'Library/PageLayout';
import { DetailTable } from 'hermes-react';
import { Form, Input, Button, message } from 'antd';
import InStockList from './InStockList';
import ManualQueryModal from './ManualQueryModal';
import getLoginUser from '@alipay/kb-framework/framework/getLoginUser';
import { getInStockSummary } from '../../common/api';
import { getData as getFengdieData } from 'Utility/fengdie';
import { keyMirror } from 'Common/TypeUtils';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { submitInStockRegister } from '../../common/api';

const QueryMode = keyMirror({
  MANUAL: null, // 手动输入物流信息
  PARAM: null   // 通过路由参数传入物流信息
});

const LogisticInfo = props => {
  const expressProviderList = props.expressProviderList;
  const { expressNo, expressProvider } = props.data;
  const provider = find(expressProviderList, {code: expressProvider}) || {};
  const dataSource = [
    {label: '物流公司', value: provider.name},
    {label: '物流单号', value: expressNo}
  ];
  return (
    <DetailTable dataSource={dataSource} columnCount={4}/>
  );
};

const SubmitForm = props => {
  const user = getLoginUser();
  const { onRemarkChange } = props;
  const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8}
  };
  return (
    <Form horizontal>
      <Form.Item {...formItemLayout} label="入库验收人">{user.nickName || user.realName || user.mobileNumber}</Form.Item>
      <Form.Item {...formItemLayout} label="备注">
        <Input onChange={onRemarkChange} type="textarea"/>
      </Form.Item>
    </Form>
  );
};

export default class Register extends Component {
  constructor(props) {
    super();
    const { expressProvider, expressNo, purchaseItemId } = props.params;
    this.state = {
      mode: expressProvider ? QueryMode.PARAM : QueryMode.MANUAL,
      params: {
        expressProvider,
        expressNo,
        purchaseItemId
      },
      inStockList: [],
      manualQueryOk: false,
      loadingList: false,
      expressProviderList: [],
      remark: '',
      submitting: false
    };
  }

  componentDidMount() {
    const params = this.props.params;
    this.loadLogisticProviders();
    if (params.expressProvider) {
      this.loadList(params);
    }
  }

  componentWillReceiveProps(next) {
    const params = next.params;
    const cParams = this.state.params;
    if (params.expressProvider !== cParams.expressProvider
      || params.expressNo !== cParams.expressNo
      || params.purchaseItemId !== cParams.purchaseItemId
    ) {
      this.setState({
        mode: params.expressProvider ? QueryMode.PARAM : QueryMode.MANUAL,
        params: {
          ...params
        }
      }, () => {
        if (params.expressProvider) {
          this.loadList(params);
        }
      });
    }
  }

  loadList = params => {
    const { expressProvider, expressNo, purchaseItemId } = params;
    this.setState({loadingList: true});
    return getInStockSummary({
      expressNo,
      purchaseItemId,
      expressCode: expressProvider
    })
      .then(res => {
        this.setState({
          loadingList: false,
          inStockList: res.data
        });
        return res;
      })
      .catch(() => {
        this.setState({
          loadingList: false,
          inStockList: []
        });
      });
  };

  loadLogisticProviders = () => {
    getFengdieData('material-logistic-provider/config/list-h5data')
      .then(res => {
        this.setState({
          expressProviderList: res
        });
      })
      .catch(() => message.error('加载物流公司配置失败，请刷新重试'));
  };

  handleManualQuery = params => {
    return this.loadList(params)
      .then(res => {
        if (isEmpty(res.data)) {
          message.error('查询不到该物流信息');
          return;
        }
        this.setState({
          params,
          manualQueryOk: true
        });
      })
      .catch(() => Promise.reject());
  };

  handleRemarkChange = e => {
    const remark = e.target.value;
    this.setState({remark});
  };

  handleSubmit = () => {
    const user = getLoginUser();
    const { params, inStockList, remark, expressProviderList } = this.state;
    const provider = find(expressProviderList, {code: params.expressProvider}) || {};
    this.setState({submitting: true});
    submitInStockRegister({
      logisticOrderNo: params.expressNo,
      logisticName: provider.name,
      listInStockOrder: JSON.stringify(inStockList.map(i => ({
        orderId: i.orderId,
        itemId: i.itemId,
        summaryId: i.id,
        curQuantity: i.curBatchQuantity,
        purchaseItemId: i.purItemId
      }))),
      checkOperatorId: user.id,
      checkOperatorName: user.nickName,
      remark
    })
      .then(() => {
        this.setState({submitting: false});
        this.props.history.replace('/material/applicationManagement/applicationRecord/koubei');
      })
      .catch(() => this.setState({submitting: false}));
  };

  render() {
    const { params, inStockList, mode, loadingList, manualQueryOk, expressProviderList, submitting } = this.state;
    const SubmitButton = () => <Button type="primary" onClick={this.handleSubmit} loading={submitting}>确认入库</Button>;
    const showManualQueryModal = mode === QueryMode.MANUAL && !manualQueryOk;
    const breadcrumb = [
      {title: '申请单管理', link: '#/material/applicationManagement/applicationRecord/koubei'},
      {title: '入库登记'}
    ];
    return (
      <PageLayout
        title="入库登记"
        breadcrumb={breadcrumb}
        footer={<SubmitButton/>}
      >
        <BlockTitle title="物流信息"/>
        <LogisticInfo data={params} expressProviderList={expressProviderList}/>
        <BlockTitle title="入库物料信息"/>
        <InStockList list={inStockList} loading={loadingList}/>
        <BlockTitle title="入库基本信息"/>
        <SubmitForm onRemarkChange={this.handleRemarkChange}/>
        <ManualQueryModal visible={showManualQueryModal} expressProviderList={expressProviderList} submitQuery={this.handleManualQuery}/>
      </PageLayout>
    );
  }
}
