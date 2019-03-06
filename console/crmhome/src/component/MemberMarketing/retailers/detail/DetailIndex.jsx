import React, { PropTypes } from 'react';
import { Button, message, Checkbox, Modal } from 'antd';
import PageLayout from 'layout/index';
import Info from './info';
import Tabs from './tabs';
import ajax from '../../../../common/ajax';
import './index.less';

const link = {
  crmhome: '#/marketing/retailers/manage/makertingPlan',
  support: undefined,
  sale: '#/marketing/retailers/manage/makertingPlan/isKbservLogin',
};

class DetailIndex extends React.Component {
  constructor() {
    super();
    this.state = {
      detaildata: {},
      modifiedDetailData: {},
      btnDisabled: false,
      loading: true,
      autoHidden: false,// 表格自动隐藏空字段
      submitting: false, // 修改提交中
    };
  }
  componentWillMount() {
    const {smartPromoId} = this.props.params;
    ajax({
      url: '/goods/kbsmartplan/querySmartPlan.json',
      method: 'get',
      data: {smartPromoId},
      success: (res) => {
        if (res.status === 'succeed') {
          this.setState({
            detaildata: res.data,
            loading: false,
            autoHidden: true,
          }, () => {
            // 获取副本信息
            this.fetchBackUpData();
          });
        } else {
          message.error(res.resultMsg || '系统繁忙');
        }
      },
      error: (err) => {
        this.setState({
          loading: false,
        });
        message.error(err.resultMsg || '系统繁忙');
      },
    });
  }

  fetchBackUpData() {
    const {smartPromoId} = this.props.params;
    const { status } = this.state.detaildata;
    // 修改确认需要一个额外的请求得到方案副本
    if (status === 'MODIFY_WAIT_CONFIRM') {
      ajax({
        url: '/goods/kbsmartplan/queryModifySmartPlan.json',
        method: 'post',
        data: {smartPromoId},
        success: (res) => {
          if (res.status === 'succeed') {
            this.setState({
              modifiedDetailData: res.data,
            });
          } else {
            throw res;
          }
        },
        error: (err) => {
          message.error(err.resultMsg || '系统繁忙');
        },
      });
    }
  }

  handleSubmit = (auditType, auditStatus, msg) => {
    const { detaildata } = this.state;
    const {smartPromoId} = this.props.params;
    const self = this;
    ajax({
      url: '/goods/kbsmartplan/agreeOnOrOffline.json',
      method: 'get',
      data: {
        version: detaildata.version,
        auditType,
        smartPromoId,
        auditStatus,
      },
      success: (res) => {
        if (res.status === 'succeed') {
          message.success(msg);
          self.setState({btnDisabled: true});
          const { system } = this.props.location.query;
          window.location.href = link[system];
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (err) => {
        message.error(err.resultMsg);
      },
    });
  };

  agreeToRelease = () => {
    Modal.confirm({
      title: '方案上架确认',
      content: '为确保体验计划效果，活动到期前将无法下架。',
      okText: '确认',
      cancelText: '再看看',
      onOk: () => {
        this.handleSubmit('ONLINE', 'PASS', '上架成功');
      },
    });
  }
  goToModity = () => {
    const { smartPromoId } = this.props.params;
    const {system} = this.props.location.query;
    window.location.href = `#/marketing/brands/detailmodify/${smartPromoId}?system=${system}`;
  }
  renderFooter = () => {
    const btnDisabled = this.state.btnDisabled;
    const detaildata = this.state.detaildata;
    // showAdvertising 代表招商开关的DRM配置，isAdvertising代表改方案是否可升级
    const { showAdvertising, allowModifyConfirm = false, allowOfflineConfirm = false, allowOnlineConfirm = false } = detaildata;
    if (allowOnlineConfirm) {
      return (<div>
          <div className="ft-center" style={{marginBottom: '20px'}}>
            <Checkbox defaultChecked disabled/> 同意
            {showAdvertising === 'Y' ? <a href="https://render.alipay.com/p/f/fd-j9tczyiw/agreement1212.html" target="_blank">《1212收入月增计划协议》</a> : <a href="https://render.alipay.com/p/f/fd-j7fpaflw/agreement.html" target="_blank">《收入月增计划协议》</a>}
          </div>
          <div className="ft-center">
            <Button disabled={btnDisabled} onClick={this.agreeToRelease.bind(this)} type="primary">确认上架</Button>
            <Button disabled={btnDisabled} style={{marginLeft: '20px'}} onClick={this.handleSubmit.bind(this, 'ONLINE', 'REJECTED', '暂不上架成功')} type="ghost">暂不上架</Button>
          </div>
        </div>
      );
    } else if (allowOfflineConfirm) {
      return (<div className="ft-center">
          <Button disabled={btnDisabled} onClick={this.handleSubmit.bind(this, 'OFFLINE', 'PASS', '下架成功')} type="primary">确认下架</Button>
          <Button disabled={btnDisabled} style={{marginLeft: '20px'}} onClick={this.handleSubmit.bind(this, 'OFFLINE', 'REJECTED', '暂不下架成功')} type="ghost">暂不下架</Button>
        </div>
      );
    } else if (allowModifyConfirm) {
      return (<div className="ft-center">
          <Button disabled={btnDisabled} onClick={this.handleSubmit.bind(this, 'MODIFY', 'PASS', '修改成功')} type="primary">确认修改</Button>
          <Button disabled={btnDisabled} style={{ marginLeft: '20px' }} onClick={this.handleSubmit.bind(this, 'MODIFY', 'REJECTED', '暂不修改成功')} type="ghost">暂不修改</Button>
        </div>
      );
    }
    return (<div className="ft-center">
    </div>);
  };


  render() {
    const { smartPromoId } = this.props.params;
    const {system} = this.props.location.query;
    const breadcrumb = [
      {title: '营销管理', link: link[system]},
      {title: '详情'},
    ];
    const { detaildata, loading, modifiedDetailData } = this.state;
    return (
      <PageLayout
        footer={this.renderFooter()}
        loading={loading}
        breadcrumb={link[system] ? breadcrumb : undefined}
      >
        {detaildata.allowModify && (
          <Button
            type="primary"
            size="large"
            style={{ position: 'absolute', right: 16, top: 16 }}
            onClick={this.goToModity}
          >
            修改方案
          </Button>
        )}
        <Info data={detaildata} modifiedData={modifiedDetailData} autoHidden={this.state.autoHidden}/>
        <Tabs data={detaildata} modifiedData={modifiedDetailData} autoHidden={this.state.autoHidden} smartPromoId={smartPromoId}/>
      </PageLayout>
    );
  }
}

DetailIndex.propTypes = {
  form: PropTypes.object,
  params: PropTypes.object,
  location: PropTypes.object,
};

export default DetailIndex;
