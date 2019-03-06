import React, { PureComponent } from 'react';
import { object, func, bool, array } from 'prop-types';
import { Alert, Table, Input, Select, Button, Form, Row, Col, Switch, message } from 'antd';

import Block from '../../common/components/block';

import { TIMES, TIME_TYPES } from '../constants';

export default class Step1 extends PureComponent {
  static propTypes = {
    form: object,
    dispatch: func,
    loading: bool,
    listErr: bool,
    timeModeOn: object,
    resourceList: array,
    timeList: array,
  }

  state = {
    isSubmiting: false,
  }

  onAddRow = (fieldName) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const keysName = `${fieldName}Keys`;
    const keyName = `${fieldName}Key`;
    let listKeys = getFieldValue(keysName);
    const key = getFieldValue(keyName);
    const index = listKeys.length;
    listKeys = listKeys.concat({ key, index });
    let value = null;
    switch (fieldName) {
      case 'resourceList':
        value = {
          resourceId: '',
          resourceName: '',
          minUserNumbers: '',
          maxUserNumbers: '',
        };
        break;
      case 'packageTimeList':
        value = {
          timeId: '',
          timeModel: 'PACKAGE_MODE',
          startTime: '',
          startTimeType: '',
          endTime: '',
          endTimeType: '',
        };
        break;
      case 'entryTimeList':
        value = {
          timeId: '',
          timeModel: 'ENTRY_MODE',
          startTime: '',
          startTimeType: '',
          endTime: '',
          endTimeType: '',
        };
        break;
      default:
        value = {};
    }
    const kvs = {};
    Object.keys(value).forEach(k => {
      kvs[`${fieldName}[${key}].${k}`] = value[k];
    });
    setFieldsValue({
      ...kvs,
      [keysName]: listKeys,
      [keyName]: key + 1,
    });
    /* setFieldsValue({
      [keysName]: listKeys,
      [keyName]: key + 1,
      [`${fieldName}[${key}]`]: value,
    }); */
  }

  onRemoveRow = (fieldName, _key, _index) => {
    const { form: {
      getFieldValue, setFieldsValue, getFieldError, validateFields }, timeModeOn } = this.props;
    const name = `${fieldName}Keys`;
    let listKeys = getFieldValue(name) || [];
    listKeys = listKeys.filter(({ key }) => key !== _key).map(({ key }, index) => ({ key, index }));
    this.props[fieldName].splice(_index, 1);
    setFieldsValue({ [name]: listKeys });
    // 如果是删除时段，相同时段的关联校验要重新校验
    if (fieldName.endsWith('TimeList')) {
      ['package', 'entry'].forEach(timeMode => {
        if (timeModeOn[timeMode]) {
          listKeys = getFieldValue(`${timeMode}TimeListKeys`) || [];
          listKeys.forEach(({ key }) => {
            const fnS = `${timeMode}TimeList[${key}]_startTime`;
            const fnE = `${timeMode}TimeList[${key}]_endTime`;
            const errS = getFieldError(fnS);
            const errE = getFieldError(fnE);
            if (errS && errS[0].includes('重复')) {
              validateFields([fnS], { force: true });
            }
            if (errE && errE[0].endsWith('重复')) {
              validateFields([fnE], { force: true });
            }
          });
        }
      });
    } else if (fieldName.endsWith('resourceList')) {
      listKeys.forEach(({ key }) => {
        const fn = `resourceList[${key}].resourceName`;
        const errs = getFieldError(fn);
        if (errs && errs[0].includes('重复')) {
          validateFields([fn], { force: true });
        }
      });
    }
  }

  // 设置包房
  renderResourceTable() {
    const fieldName = 'resourceList';
    const { form: { getFieldValue, getFieldProps, getFieldError, validateFields },
      resourceList, loading } = this.props;
    const dataSource = getFieldValue(`${fieldName}Keys`) || [];
    const columns = [{
      title: '包厢类型',
      width: 100,
      render: (_, row) => {
        const { key, index } = row;
        const { resourceName } = resourceList[index];
        return (
          <Form.Item>
            <Input size="default" style={{ width: '80%' }} placeholder="字数10个以内" {...getFieldProps(`${fieldName}[${key}].resourceName`, {
              initialValue: resourceName,
              validateFirst: true,
              rules: [{
                required: true, whitespace: true, message: '请输入包厢类型',
              }, {
                validator(rule, val, callback) {
                  // eslint-disable-next-line no-control-regex
                  if (val.replace(/[^\x00-\xff]/g, 'xx').length > 20) {
                    callback('包厢类型不能超过10个字');
                    return;
                  }
                  const listKeys = getFieldValue(`${fieldName}Keys`) || [];
                  const repeat = listKeys.some(({ key: _k }) => {
                    if (_k !== key) {
                      const fn = `${fieldName}[${_k}].resourceName`;
                      if (getFieldValue(fn) === val) {
                        // 和其他的重复
                        return true;
                      }
                      if (getFieldError(fn) && getFieldError(fn)[0].includes('重复')) {
                        validateFields([fn], { force: true });
                      }
                    }
                    return false;
                  });
                  if (repeat) {
                    callback('不能与其他包厢类型重复');
                    return;
                  }
                  callback();
                },
              }],
            })} />
          </Form.Item>
        );
      },
    }, {
      title: '容纳最少人数',
      width: 80,
      render: (_, row) => {
        const { key, index } = row;
        const { minUserNumbers } = resourceList[index];
        return (
          <Form.Item>
            <Input size="default" style={{ width: '50%' }} placeholder="小于999" {...getFieldProps(`${fieldName}[${key}].minUserNumbers`, {
              initialValue: minUserNumbers,
              validateFirst: true,
              rules: [{
                required: true, whitespace: true, message: '请输入最少容纳人数',
              }, {
                pattern: /^[1-9]\d*$/, message: '人数只能输入正整数',
              }, {
                validator(rule, val, callback) {
                  if (+val > 998) {
                    callback('人数不能大于998');
                    return;
                  }
                  const relFieldName = `${fieldName}[${key}].maxUserNumbers`;
                  if (getFieldError(relFieldName)) {
                    callback();
                    validateFields([relFieldName], { force: true });
                    return;
                  }
                  const relVal = getFieldValue(relFieldName);
                  if (relVal && +val >= +relVal) {
                    callback('最少容纳人数不能大于等于最多容纳人数');
                    return;
                  }
                  callback();
                },
              }],
            })} />
          </Form.Item>
        );
      },
    }, {
      title: '容纳最多人数',
      width: 80,
      render: (_, row) => {
        const { key, index } = row;
        const { maxUserNumbers } = resourceList[index];
        return (
          <Form.Item>
            <Input size="default" style={{ width: '50%' }} placeholder="小于1000" {...getFieldProps(`${fieldName}[${key}].maxUserNumbers`, {
              initialValue: maxUserNumbers,
              validateFirst: true,
              rules: [{
                required: true, whitespace: true, message: '请输入最多容纳人数',
              }, {
                pattern: /^[1-9]\d*$/, message: '人数只能输入正整数',
              }, {
                validator(rule, val, callback) {
                  if (+val > 999) {
                    callback('人数不能大于999');
                    return;
                  }
                  const relFieldName = `${fieldName}[${key}].minUserNumbers`;
                  if (getFieldError(relFieldName)) {
                    callback();
                    validateFields([relFieldName], { force: true });
                    return;
                  }
                  const relVal = getFieldValue(relFieldName);
                  if (relVal && +val <= +relVal) {
                    callback('最多容纳人数不能小于等于最少容纳人数');
                    return;
                  }

                  callback();
                },
              }],
            })} />
          </Form.Item>
        );
      },
    }, {
      title: '操作',
      width: 50,
      render: (_, row) => {
        const { key, index } = row;
        return (
          <Button className="btn-link" size="small" disabled={dataSource.length <= 1} onClick={this.onRemoveRow.bind(this, fieldName, key, index)}>删除</Button>
        );
      },
    }];
    const footer = function () {
      return (
        <Button disabled={dataSource.length >= 10} type="ghost"
          onClick={this.onAddRow.bind(this, fieldName)}>添加（最多添加10条）
        </Button>
      );
    };
    return (
      <Table className="addable-table"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        footer={footer.bind(this)} // eslint-disable-line
        pagination={false} bordered size="small" />
    );
  }

  // 设置时段（包段模式 | 进场模式）
  renderTimeTable(timeModel) { // timeModel: 预订时间模式package包段模式、entry进场模式
    const fieldName = `${timeModel}TimeList`;
    const anotherTimeModel = { package: 'entry', entry: 'package' }[timeModel];
    const anotherFieldName = `${anotherTimeModel}TimeList`;
    const anotherTimeModelLabel = { package: '包段', entry: '进场' }[anotherTimeModel];
    const { form: { getFieldValue, getFieldProps, getFieldError, validateFields },
      loading, timeModeOn } = this.props;
    const dataSource = getFieldValue(`${fieldName}Keys`) || [];
    const totalTime = (getFieldValue('packageTimeListKeys') || []).length + (getFieldValue('entryTimeListKeys') || []).length;
    const timeList = this.props[fieldName];
    const columns = [{
      title: '开始时间',
      width: 100,
      render: (_, row) => {
        const { key, index } = row;
        const { startTime, startTimeType, endTime, endTimeType } = timeList[index];
        const endTimeStr = `${endTimeType}-${endTime}`;
        const { onChange: changeStartTime, ...fPropsTime } = getFieldProps(`${fieldName}[${key}].startTime`, {
          initialValue: startTime,
        });
        const { onChange: changeStartTimeType, ...fPropsTimeType } = getFieldProps(`${fieldName}[${key}].startTimeType`, {
          initialValue: startTimeType,
        });
        let disabled = false;
        const options = TIMES.map((time, idx) => {
          const [type, value] = time.split('-');
          const label = `${TIME_TYPES[type]}${value}`;
          if (TIMES[idx + 1] === endTimeStr) {
            disabled = true;
          }
          return (
            <Select.Option key={time} value={time}
              disabled={disabled}>{label}
            </Select.Option>
          );
        });
        return (
          <Form.Item>
            <Select size="default" showSearch style={{ width: 100 }} {...getFieldProps(`${fieldName}[${key}]_startTime`, {
              initialValue: startTime && startTimeType ? `${startTimeType}-${startTime}` : '',
              onChange(value) {
                const [type, time] = value.split('-');
                changeStartTimeType(type);
                changeStartTime(time);
              },
              validateFirst: true,
              rules: [{
                required: true, message: '请选择开始时间',
              }, {
                validator(rule, val, callback) {
                  const relFieldName = `${fieldName}[${key}]_endTime`;
                  if (getFieldError(relFieldName)) {
                    callback();
                    validateFields([relFieldName], { force: true });
                    return;
                  }
                  const relValue = getFieldValue(relFieldName);
                  if (!relValue) {
                    callback();
                    return;
                  }
                  const diff = Math.abs(TIMES.findIndex(v => v === val)
                    - TIMES.findIndex(v => v === relValue));
                  if (diff === 0) {
                    callback('开始时间和结束时间不能相等');
                    return;
                  }
                  if (diff === 1) {
                    callback('开始时间和结束时间跨度不能小于1小时');
                    return;
                  }
                  const listKeys = getFieldValue(`${fieldName}Keys`) || [];
                  const repeat = listKeys.some(({ key: _k }) => {
                    if (_k !== key) {
                      const fnS = `${fieldName}[${_k}]_startTime`;
                      const fnE = `${fieldName}[${_k}]_endTime`;
                      if (getFieldValue(fnS) === val && getFieldValue(fnE) === relValue) {
                        // 和其他的重复
                        return true;
                      }
                      if (getFieldError(fnS) && getFieldError(fnS)[0].includes('重复')) {
                        validateFields([fnS], { force: true });
                      } else if (getFieldError(fnE) && getFieldError(fnE)[0].includes('重复')) {
                        validateFields([fnE], { force: true });
                      }
                    }
                    return false;
                  });
                  if (repeat) {
                    callback('不能与其他时段重复');
                    return;
                  }
                  if (timeModeOn[anotherTimeModel]) { // 如果另一个时段模式开启的话，校验是否和另外的相等
                    const listKeys2 = getFieldValue(`${anotherFieldName}Keys`) || [];
                    const repeatAnother = listKeys2.some(({ key: _k }) => {
                      const fnS = `${anotherFieldName}[${_k}]_startTime`;
                      const fnE = `${anotherFieldName}[${_k}]_endTime`;
                      if (getFieldValue(fnS) === val && getFieldValue(fnE) === relValue) {
                        // 和另一个模式的时段重复
                        return true;
                      }
                      if (getFieldError(fnS) && getFieldError(fnS)[0].includes('重复')) {
                        validateFields([fnS], { force: true });
                      } else if (getFieldError(fnE) && getFieldError(fnE)[0].includes('重复')) {
                        validateFields([fnE], { force: true });
                      }
                      return false;
                    });
                    if (repeatAnother) {
                      callback(`不能与[${anotherTimeModelLabel}]模式的时段重复`);
                      return;
                    }
                  }
                  callback();
                },
              }],
            })}>
              {options}
            </Select>
            <span {...fPropsTime} />
            <span {...fPropsTimeType} />
          </Form.Item>
        );
      },
    }, {
      title: '结束时间',
      width: 80,
      render: (_, row) => {
        const { key, index } = row;
        const { endTime, endTimeType, startTime, startTimeType } = timeList[index];
        const startTimeStr = `${startTimeType}-${startTime}`;
        const { onChange: changeEndTime, ...fPropsTime } = getFieldProps(`${fieldName}[${key}].endTime`, {
          initialValue: endTime,
        });
        const { onChange: changeEndTimeType, ...fPropsTimeType } = getFieldProps(`${fieldName}[${key}].endTimeType`, {
          initialValue: endTimeType,
        });
        let disabled = startTimeStr !== '-';
        const options = TIMES.map((time, idx) => {
          const [type, value] = time.split('-');
          if (TIMES[idx - 2] === startTimeStr) {
            disabled = false;
          }
          return (
            <Select.Option key={time} value={time}
              disabled={disabled}>{`${TIME_TYPES[type]}${value}`}
            </Select.Option>
          );
        });
        return (
          <Form.Item>
            <Select size="default" style={{ width: 100 }}
              showSearch optionFilterProp="children" {...getFieldProps(`${fieldName}[${key}]_endTime`, {
              initialValue: endTime && endTimeType ? `${endTimeType}-${endTime}` : '',
              onChange(value) {
                const [type, time] = value.split('-');
                changeEndTimeType(type);
                changeEndTime(time);
              },
              validateFirst: true,
              rules: [{
                required: true, message: '请选择结束时间',
              }, {
                validator(rule, val, callback) {
                  const relFieldName = `${fieldName}[${key}]_startTime`;
                  if (getFieldError(relFieldName)) {
                    callback();
                    validateFields([relFieldName], { force: true });
                    return;
                  }
                  const relValue = getFieldValue(relFieldName);
                  if (!relValue) {
                    callback();
                    return;
                  }
                  const diff = Math.abs(TIMES.findIndex(v => v === val)
                    - TIMES.findIndex(v => v === relValue));
                  if (diff === 0) {
                    callback('结束时间和开始时间不能相等');
                    return;
                  }
                  if (diff === 1) {
                    callback('结束时间和开始时间跨度不能小于1小时');
                    return;
                  }
                  const listKeys = getFieldValue(`${fieldName}Keys`) || [];
                  const repeat = listKeys.some(({ key: _k }) => {
                    if (_k !== key) {
                      const fnE = `${fieldName}[${_k}]_endTime`;
                      const fnS = `${fieldName}[${_k}]_startTime`;
                      if (getFieldValue(fnE) === val && getFieldValue(fnS) === relValue) {
                        // 和其他的重复
                        return true;
                      }
                      if (getFieldError(fnE) && getFieldError(fnE)[0].includes('重复')) {
                        validateFields([fnE], { force: true });
                      } else if (getFieldError(fnS) && getFieldError(fnS)[0].includes('重复')) {
                        validateFields([fnS], { force: true });
                      }
                    }
                    return false;
                  });
                  if (repeat) {
                    callback('不能与其他时段重复');
                    return;
                  }
                  if (timeModeOn[anotherTimeModel]) { // 如果另一个时段模式开启的话，校验是否和另外的相等
                    const listKeys2 = getFieldValue(`${anotherFieldName}Keys`) || [];
                    const repeatAnother = listKeys2.some(({ key: _k }) => {
                      const fnE = `${anotherFieldName}[${_k}]_endTime`;
                      const fnS = `${anotherFieldName}[${_k}]_startTime`;
                      if (getFieldValue(fnE) === val && getFieldValue(fnS) === relValue) {
                        // 和另一个模式的时段重复
                        return true;
                      }
                      if (getFieldError(fnE) && getFieldError(fnE)[0].includes('重复')) {
                        validateFields([fnE], { force: true });
                      } else if (getFieldError(fnS) && getFieldError(fnS)[0].includes('重复')) {
                        validateFields([fnS], { force: true });
                      }
                      return false;
                    });
                    if (repeatAnother) {
                      callback(`不能与[${anotherTimeModelLabel}]模式的时段重复`);
                      return;
                    }
                  }
                  callback();
                },
              }],
            })}>
              {options}
            </Select>
            <span {...fPropsTime} />
            <span {...fPropsTimeType} />
          </Form.Item>
        );
      },
    }, {
      title: '操作',
      width: 50,
      render: (_, row) => {
        const { key, index } = row;
        return (
          <Button className="btn-link" size="small" disabled={totalTime <= 1} onClick={this.onRemoveRow.bind(this, fieldName, key, index)}>删除</Button>
        );
      },
    }];
    const footer = function () {
      return (
        <Button disabled={totalTime >= 6} type="ghost"
          onClick={this.onAddRow.bind(this, fieldName)}>添加
        </Button>
      );
    };
    return (
      <Table className="addable-table"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        footer={footer.bind(this)}
        pagination={false} bordered size="small" />
    );
  }

  onTimeModelChange = (model, checked) => {
    const { form: {
      setFieldsValue, getFieldValue, getFieldError, validateFields }, timeModeOn } = this.props;
    timeModeOn[model] = checked;
    setFieldsValue({
      [`timeModeOn.${model}`]: checked,
    });
    let timeModeToCheck = null;
    if (checked) { // 检查自己
      timeModeToCheck = model;
    } else {
      timeModeToCheck = { package: 'entry', entry: 'package' }[model];
    }
    const listKeys = getFieldValue(`${timeModeToCheck}TimeListKeys`) || [];
    listKeys.forEach(({ key }) => {
      const fnS = `${timeModeToCheck}TimeList[${key}]_startTime`;
      const fnE = `${timeModeToCheck}TimeList[${key}]_endTime`;
      const errS = getFieldError(fnS);
      const errE = getFieldError(fnE);
      if (errS && errS[0].includes('重复')) {
        validateFields([fnS], { force: true });
      }
      if (errE && errE[0].endsWith('重复')) {
        validateFields([fnE], { force: true });
      }
    });
  }

  onNextClick = () => {
    const { form, dispatch, timeModeOn } = this.props;
    form.validateFieldsAndScroll({ force: true, scroll: { offsetTop: 100 } }, (err) => {
      // console.log('validateFieldsAndScroll', err, values);
      if (err) {
        const errKeys = Object.keys(err);
        if (!((!timeModeOn.package && errKeys.every(k => k.startsWith('packageTimeList'))) ||
          (!timeModeOn.entry && errKeys.every(k => k.startsWith('entryTimeList'))))) {
          message.error('内容有误，请修改', 2);
          return;
        }
      }
      this.setState({ isSubmiting: true });
      dispatch({ type: 'modifyService', payload: {} }).catch(() => {
        this.setState({ isSubmiting: false });
      });
    });
  }

  reloadList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'queryServiceList', payload: {} });
  }

  render() {
    const { timeModeOn, loading, listErr } = this.props;
    const { isSubmiting } = this.state;
    return (
      <div className="plan-step1">
        <Block title="设置包房" subtitle={<Alert type="info" showIcon message="建议添加3种以上包房类型，给用户更多选择。" />}>
          {this.renderResourceTable()}
        </Block>
        <Block title="设置时段" subtitle={<Alert type="info" showIcon message="请至少设置一项，包段模式与进场模式共计最多6项。" />}>
          <Row gutter={32}>
            <Col span={12}>
              <div style={{ margin: '0 0 16px 0' }}>
                添加包段模式：<Switch checkedChildren="是" unCheckedChildren="否"
                  checked={timeModeOn.package} onChange={this.onTimeModelChange.bind(this, 'package')} />
                <div style={{ marginTop: 8 }}>
                  <Alert type="info" showIcon message="包段模式：按欢唱时间段选择进场时间，唱至时间段最晚时间结束。" />
                </div>
              </div>
              <div style={{ display: timeModeOn.package ? '' : 'none' }}>
                {this.renderTimeTable('package')}
              </div>
            </Col>
            <Col span={12}>
              <div style={{ margin: '0 0 16px 0' }}>
                添加进场模式：<Switch checkedChildren="是" unCheckedChildren="否"
                  checked={timeModeOn.entry} onChange={this.onTimeModelChange.bind(this, 'entry')} />
                <div style={{ marginTop: 8 }}>
                  <Alert type="info" showIcon message="进场模式：按进场时间段选择进场时间，结束时间以进场时间+欢唱时间为准。" />
                </div>
              </div>
              <div style={{ display: timeModeOn.entry ? '' : 'none' }}>
                {this.renderTimeTable('entry')}
              </div>
            </Col>
          </Row>

          <div style={{ margin: '64px 0 0 24px' }}>
            {listErr ? (
              <Button icon="reload" type="primary" size="large" loading={loading} onClick={this.reloadList}>刷新</Button>
            ) : (
              <Button type="primary" size="large" loading={isSubmiting} disabled={loading} onClick={this.onNextClick}>下一步</Button>
            )}
          </div>
        </Block>
      </div>
    );
  }
}
