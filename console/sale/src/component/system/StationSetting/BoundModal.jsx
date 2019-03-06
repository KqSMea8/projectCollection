import React, { PropTypes } from 'react';
import { Modal, Button, Spin } from 'antd';
import BoundForm from './BoundForm';
import ajax from 'Utility/ajax';

const BoundModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
  },

  getInitialState() {
    let loading = false;
    if (this.props.data.jobId) {
      loading = true;
      this.fetchInitData(this.props.data.jobId);
    }

    return {
      loading: loading, // 浮层初始化loading
      postLoading: false, // 提交loading
      areaCategoryData: [],
    };
  },

  onOk() {
    this.boundForm.getForm().validateFields((error, values) => {
      if (!error) {
      //  【泛行业全类目】不再需要以下特殊处理逻辑
      //   const firstCategories = 'categories-' + values.keys[0];
      //   if (!values[firstCategories] || values[firstCategories][0] === 'UNIVERSAL') {
      //     for (const i in values.keys) {
      //       /* eslint-disable */
      //       if (values.keys.hasOwnProperty(i)) {
      //         /* eslint-enable */
      //         const item = 'categories-' + values.keys[i];
      //         values[item] = ['UNIVERSAL'];
      //       }
      //     }
      //     values.areaConstraintType = 'categoryLabels';
      //   } else {
      //     values.areaConstraintType = 'categories';
      //   }
        // 格式化需要传递的参数
        const params = this.parseAreaCategoryTableParam(values);
        params.jobId = this.props.data.jobId || values.jobs.id;
        params.isModify = this.props.data.jobId ? true : false;
        this.setState({postLoading: true});

        this.props.onOk(params).catch(() => {
          this.setState({postLoading: false});
        });
      }
    });
  },

  // 提交前转换服务端需要的服务区域品类数据结构
  parseAreaCategoryTableParam(form) {
    const tmp = {};
    for (const o in form) {
      if (form.hasOwnProperty(o)) {
        if (/-/.test(o)) {
          const splited = o.split('-');
          const obj = tmp[splited[1]] || {};
          obj[splited[0]] = form[o];
          tmp[splited[1]] = obj;
        }
      }
    }

    const data = [];
    for (const i in tmp) {
      if (tmp.hasOwnProperty(i)) {
        const item = tmp[i];
        data.push({
          countryCode: 'CN',
          provinceCode: item.area[0],
          cityCode: item.area[1],
          districtCode: item.area[2],
          categories: item.categories.join(','),
          spaceCodes: item.spaceCodes ? item.spaceCodes.join(',') : null,
        });
      }
    }
    form.areaJsonStr = JSON.stringify(data);
    return form;
  },

  // 修改前获取城市品类数据
  fetchInitData(jId) {
    ajax({
      url: '/manage/initJobConfig.json',
      // url: 'http://local.alipay.net:8982/manage/initJobConfig.json',
      method: 'GET',
      data: {
        jobId: jId,
      },
      type: 'json',
      success: (result) => {
        this.setState({
          loading: false,
          areaCategoryData: result.data,
        });
      },
    });
  },

  saveForm(form) {
    this.boundForm = form;
  },

  render() {
    const {data} = this.props;
    const {loading, postLoading, areaCategoryData} = this.state;

    const title = data.jobId ? '修改' : '新增';
    const boundTitle = `${title}岗位业务约束`;
    const footer = [
      <Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>取 消</Button>,
      loading ? <Button key="submit" type="primary" size="large" disabled>提 交</Button> : <Button key="submit" type="primary" size="large" loading={postLoading} onClick={this.onOk}>提 交</Button>,
    ];

    return (<Modal width={900}
      title={boundTitle} visible
      onOk={this.onOk}
      onCancel={this.props.onCancel} footer={footer} >
      <Spin spinning={loading}>
        <BoundForm ref={this.saveForm} data={data} areaCategoryData={areaCategoryData} />
      </Spin>
    </Modal>);
  },
});

export default BoundModal;
