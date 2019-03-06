import '../system.less';
import React, {PropTypes} from 'react';
import { Button, message, Form } from 'antd';
import SettingStationTable from './SettingStationTable';
import BoundModal from './BoundModal';
import ajax from 'Utility/ajax';
import JobTreeSelect from '@alipay/opbase-biz-components/src/component/job/JobTreeSelect';
import { pick } from 'lodash';

const StationSetting = React.createClass({
  propTypes: {
    form: PropTypes.object,
  },
  getInitialState() {
    return {
      boundData: {},
      boundVisble: false,
    };
  },

  onNewBound() {
    this.setState({
      boundData: {},
      boundVisble: true,
    });
  },

  // 修改岗位约束
  onJobsChange(row) {
    this.setState({
      boundData: row,
      boundVisble: true,
    });
  },

  onOk(values) {
    const url = `/manage/${!values.isModify ? 'create' : 'modify'}JobConfig.json`;

    // 后端配置：maxParameterCount = 2000 删除无用字段
    const postData = pick(values, ['areaConstraintType', 'areaJsonStr', 'jobId']);

    const loader = ajax({
      url: url,
      method: 'post',
      data: postData,
      type: 'json',
    }).then((res) => {
      if (res.status === 'succeed') {
        message.success(res.resultMsg);
        this.setState({ boundVisble: false });
        this.refs.settingStationTable.refresh();
      }
      return res;
    }).catch((e) => {
      throw e;
    });

    return loader;
  },
  onSearch() {
    const jobInfo = this.props.form.getFieldValue('jobInfo');
    if (jobInfo) {
      this.refs.settingStationTable.refresh({jobId: jobInfo.id});
      this.setState({jobId: jobInfo.id});
    } else {
      this.refs.settingStationTable.refresh();
    }
  },
  onReset() {
    this.props.form.resetFields();
  },
  onCancel() {
    this.setState({ boundVisble: false });
  },

  render() {
    const { getFieldProps } = this.props.form;
    const jobTreeSelectProps = getFieldProps('jobInfo');
    return (<div>
      <div className="app-detail-header">
        岗位业务配置
        <div className="app-detail-header-right-btn">
          <Button type="primary" size="large" onClick={this.onNewBound}>新增约束</Button>
        </div>
      </div>
      <div className="app-detail-content-padding">
        <div style={{marginBottom: '24px'}}>
          <Form horizontal>
            <span>岗位范围：</span>
            <JobTreeSelect { ...jobTreeSelectProps } style={{width: 250}} placeholder="请选择"
            ajax={ ajax } buserviceUrl={ window.APP.buserviceUrl } />
            <Button type="ghost" style={{marginLeft: '8px'}} onClick={this.onSearch}>搜索</Button>
            <Button type="ghost" onClick={this.onReset} style={{marginLeft: '8px'}}>重置</Button>
          </Form>
        </div>
        <SettingStationTable ref="settingStationTable" params={this.state.params} onJobsChange={this.onJobsChange} />
      </div>
      {this.state.boundVisble ? <BoundModal data={this.state.boundData} onOk={this.onOk} onCancel={this.onCancel} /> : null}
    </div>);
  },
});

export default Form.create()(StationSetting);

