import React, { Component } from 'react';
import { message, Modal } from 'antd';
import {Page} from '@alipay/kb-biz-components';
import ApplyForm from './ApplyForm';
import Tips from './Tips';
import ajax from 'Utility/ajax';
import { appendOwnerUrlIfDev } from '../../../../common/utils';
import { handleApiException, apiGetStuffTemplateList, apiGetStuffAttrList, apiGetShopList } from '../common/api';

class KoubeiCodeApply extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
    ready: false,
    submitting: false,
    templateList: [],
    typeList: [],
    shopList: [],
  };

  componentDidMount() {
    Promise.all([
      // 获取物料模板
      apiGetStuffAttrList(),
      apiGetStuffTemplateList()
    ]).then(([typeList, templateList]) => {
      this.setState({
        loading: false,
      });
      this.setState({
        typeList,
        templateList,
        ready: true,
      });
    }).catch((err) => {
      this.setState({
        loading: false,
      });
      message.error(handleApiException(err));
    });

    apiGetShopList().then(shopList => {
      this.setState({
        shopList,
      });
      if (shopList.length === 0) {
        Modal.info({
          title: '亲，你名下没有归属门店，无法绑定明码。',
        });
      }
    });
  }

  handleFormSubmit = (data, resetForm) => {
    this.setState({
      submitting: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'post',
      type: 'json',
      data: {
        mappingValue: 'kbasset.createKBCode',
        ...data,
      },
      error: () => {}, // 阻止默认报错
    }).then(() => {
      this.setState({
        submitting: false,
      });
      Modal.confirm({
        iconClassName: 'check-circle',
        title: '操作成功',
        okText: '看生成记录',
        onOk: () => this.props.history.push('/material/koubeicode/manage/record'),
        cancelText: '知道了',
        onCancel: resetForm,
      });
    }).catch(err => {
      this.setState({
        submitting: false,
      });
      Modal.error({
        title: '操作失败',
        content: handleApiException(err),
      });
    });
  };

  render() {
    const { loading, ready, submitting, typeList, templateList, shopList } = this.state;
    const breadcrumb = [
      {title: '口碑码管理', link: '#/material/koubeicode/manage'},
      {title: '获取口碑码'}
    ];
    return (
      <Page breadcrumb={breadcrumb} spinning={loading || !ready}>
        {ready && <ApplyForm
          onSubmit={this.handleFormSubmit}
          submitting={submitting}
          typeList={typeList}
          templateList={templateList}
          shopList={shopList}
        />}
        <Tips/>
      </Page>
    );
  }
}

export default KoubeiCodeApply;
