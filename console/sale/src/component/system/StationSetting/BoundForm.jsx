import React, { PropTypes } from 'react';
import { Form, Spin } from 'antd';
import AreaCategoryTable from '../../../common/AreaCategoryTable/AreaCategoryTable';
import ajax from 'Utility/ajax';
import JobTreeSelect from '@alipay/opbase-biz-components/src/component/job/JobTreeSelect';

const FormItem = Form.Item;

const BoundForm = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.object,
    areaCategoryData: PropTypes.any,
  },

  getInitialState() {
    return {
      showChangeTable: false,
      jobId: this.props.data.jobId,
    };
  },

  onTreeSelectChange(v) {
    const {jobId} = this.state;
    if (jobId !== v.id) {
      this.setState({ showChangeTable: true });
      setTimeout(() => {
        this.setState({
          showChangeTable: false,
          jobId: v.id,
        });
      }, 300);
    }
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
        });
      }
    }
    form.areaJsonStr = JSON.stringify(data);
    return form;
  },

  render() {
    const {data} = this.props;
    const {getFieldProps} = this.props.form;
    const {jobId, showChangeTable} = this.state;
    const jobName = data.jobName ? (
      <p className="ant-form-text">{data.jobName}</p>
    ) : (
      <JobTreeSelect {...getFieldProps('jobs', {onChange: this.onTreeSelectChange} )}
        style={{width: 300}}
        placeholder="请选择"
        ajax={ajax}
        buserviceUrl={window.APP.buserviceUrl} />
    );
    const isShowParentTreeSelect = true;
    const options = {
      url: '/kbConfig/queryJobAreaCategory.json',
      // url: 'http://local.alipay.net:8982/kbConfig/queryJobAreaCategory.json',
      params: {
        jobId: jobId,
      },
    };

    return (<Form className="advanced-search-form" horizontal onSubmit={this.handleSubmit}>
      <FormItem
        label="业务岗位："
        required
        labelCol={{span: 4}}
        wrapperCol={{span: 6}}>
        {jobName}
      </FormItem>

      {
        jobId ?
        <FormItem
          label="业务区域品类："
          required
          labelCol={{span: 4}}
          wrapperCol={{span: 18}}>
          {
            !showChangeTable ? <AreaCategoryTable
              isShowParentTreeSelect={isShowParentTreeSelect}
              getTreeOption={options}
              form={this.props.form}
              data={this.props.areaCategoryData} />
            : <div className="ant-form-text" style={{width: 200, paddingLeft: 8}}>
              <Spin spinning="true" />
            </div>
          }
        </FormItem> : null
      }

    </Form>);
  },
});

export default Form.create()(BoundForm);
