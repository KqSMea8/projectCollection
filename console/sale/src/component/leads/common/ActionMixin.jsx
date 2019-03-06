import ajax from 'Utility/ajax';
import {message} from 'antd';
import {remoteLog} from '../../../common/utils';

export default {
  getInitialState() {
    return {
      showAllocModal: false,
      showReleaseModal: false,
      showRelateModal: false,
      showPopConfirm: false,
      categoryId: this.props.categoryId,
    };
  },

  onCancel() {
    this.setState({
      showAllocModal: false,
      showReleaseModal: false,
      showRelateModal: false,
      showPopConfirm: false,
    });
  },

  onReleaseOk(values) {
    ajax({
      url: '/sale/leads/release.json',
      method: 'post',
      data: {
        ...values,
        leadsId: this.props.id,
      },
      success: () => {
        message.success('leads 释放成功');
        this.setState({
          showReleaseModal: false,
        });
        if (this.props.refresh) {
          this.props.refresh(true);
        }
      },
    });
  },

  onRelateOk() {
    message.success('关联成功，可在“我的门店”补充信息');
    this.setState({
      showRelateModal: false,
    });
  },

  checkModify() {
    ajax({
      url: '/sale/leads/queryDetail.json',
      data: {leadsId: this.props.id},
      success: (res) => {
        if (res.modify && res.data.process) {
          this.setState({showPopConfirm: true});
        } else if (res.modify && !res.data.process) {
          window.location.hash = '/leads/edit/' + this.props.id;
        }
      },
      error: (e) => {
        message.error(e.resultMsg || '系统错误');
      },
    });
  },

  onClick({key}) {
    if (key === 'release') {
      remoteLog('LEADS_RELEASE');
      this.setState({
        showReleaseModal: true,
      });
    } else if (key === 'relate') {
      this.setState({
        showRelateModal: true,
      });
    } else if (key === 'modify') {
      remoteLog('LEADS_EDIT');
      window.open('?mode=modify#/leads/edit/' + this.props.id);
    } else if (key === 'alloc') {
      remoteLog('LEADS_ALLOC');
      this.setState({
        showAllocModal: true,
      });
    } else if (key === 'view') {
      window.location.hash = '/leads/detail/' + this.props.id + '/detail';
    } else if (key === 'public') {
      window.location.hash = '/leads/detail/' + this.props.id + '/public';
    } else if (key === 'complete') {
      window.open('?mode=modify#/leads/edit/' + this.props.id);
    }
  },

  onAllocOk(values) {
    let targetOpId = '';
    let isProvider = false;
    if (values.bucUser) {
      targetOpId = values.bucUser.id;
    } else if (values.alipayUser) {
      targetOpId = values.alipayUser.partnerId;
      isProvider = true;
    }
    ajax({
      url: '/sale/leads/allocate.json',
      method: 'post',
      data: {
        leadsId: this.props.id,
        targetOpIdType: values.userType || window.APP.userType,
        targetOpId,
        isProvider,
      },
      success: () => {
        message.success('leads 分配成功');
        this.setState({
          showAllocModal: false,
        });
        if (this.props.refresh) {
          this.props.refresh(true);
        }
      },
    });
  },
};
