import React, { PureComponent } from 'react';
import { object, func, array, number, bool } from 'prop-types';
import { Alert, Table, Input, Select, Button, Form, Checkbox, message } from 'antd';

import Block from '../../common/components/block';

import { TIME_TYPES, PACKAGE_TYPES, TIME_MODELS } from '../constants';

export default class Step2 extends PureComponent {
  static propTypes = {
    form: object,
    dispatch: func,
    loading: bool,
    listErr: bool,
    currentStep: number,
    timeList: array,
    resourceList: array,
    packageList: array,
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
    const value = {
      contentId: '',
      contentType: 'PACKAGE',
      contentName: '',
      contentDesc: '',
      timeIds: [],
      resourceIds: [],
    };
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
      [`${fieldName}[${key}]`]: ,
    }); */
  }

  onRemoveRow = (fieldName, _key, _index) => {
    const { form: { getFieldValue, setFieldsValue, getFieldError, validateFields } } = this.props;
    const name = `${fieldName}Keys`;
    let listKeys = getFieldValue(name);
    listKeys = listKeys.filter(({ key }) => key !== _key).map(({ key }, index) => ({ key, index }));
    this.props[fieldName].splice(_index, 1);
    setFieldsValue({ [name]: listKeys });
    listKeys.forEach(({ key }) => {
      if (getFieldValue(`${fieldName}[${key}].contentType`) !== 'PURE_SING') {
        const fnContentName = `${fieldName}[${key}].contentName`;
        const errs = getFieldError(fnContentName);
        if (errs && errs[0].includes('重复')) {
          validateFields([fnContentName], { force: true });
        }
      }
    });
  }

  // 设置套餐类型
  renderTable() {
    const fieldName = 'packageList';
    const { form: { getFieldValue, getFieldProps, getFieldError, validateFields },
      packageList, resourceList, timeList, loading } = this.props;
    const dataSource = getFieldValue(`${fieldName}Keys`) || [];
    const columns = [{
      title: '类型',
      width: 96,
      render: (_, row) => {
        const { key, index } = row;
        const { contentType } = packageList[index];
        const hasPureSing = packageList.some((pkg, i) => i !== index && pkg.contentType === 'PURE_SING');
        const pkgTypes = Object.keys(PACKAGE_TYPES).filter(type => (hasPureSing ? type !== 'PURE_SING' : true));
        return (
          <Form.Item>
            <Select size="default" style={{ width: 80 }} {...getFieldProps(`${fieldName}[${key}].contentType`, {
              initialValue: contentType,
              validateFirst: true,
              rules: [{
                required: true, message: '请选择类型',
              }],
            })}>
              {pkgTypes.map((type) => (
                <Select.Option key={type} value={type}>
                  {PACKAGE_TYPES[type]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      },
    }, {
      title: '套餐名称',
      width: 705,
      render: (_, row) => {
        const { key, index } = row;
        const { contentType, contentName } = packageList[index];
        if (contentType === 'PURE_SING') {
          return '--';
        }
        return (
          <Form.Item>
            <Input size="default" placeholder="字数10个以内" {...getFieldProps(`${fieldName}[${key}].contentName`, {
              initialValue: contentName,
              validateFirst: true,
              rules: [{
                required: true, whitespace: true, message: '请输入套餐名称',
              }, {
                validator(rule, val, callback) {
                  // eslint-disable-next-line no-control-regex
                  if (val.replace(/[^\x00-\xff]/g, 'xx').length > 20) {
                    callback('套餐名称不能超过10个字');
                    return;
                  }
                  if (/(欢唱|时长|节假日通用)/.test(val)) {
                    callback('套餐名称不可包含“欢唱”、“时长”、“节假日通用”字样');
                    return;
                  }
                  const listKeys = getFieldValue(`${fieldName}Keys`) || [];
                  const contentType1 = getFieldValue(`${fieldName}[${key}].contentType`);
                  if (contentType1 !== 'PURE_SING' && listKeys.some(({ key: _k }) => {
                    const fnContentName = `${fieldName}[${_k}].contentName`;
                    const contentType2 = getFieldValue(`${fieldName}[${_k}].contentType`);
                    const contentName2 = getFieldValue(fnContentName) || '';
                    if (_k !== key) {
                      if (contentType2 !== 'PURE_SING'
                        && val.trim() === contentName2.trim()) {
                        return true;
                      }
                      const errs = getFieldError(fnContentName);
                      if (errs && errs[0].includes('重复')) {
                        validateFields([fnContentName], { force: true });
                      }
                    }
                    return false;
                  })) {
                    callback('不能与其他套餐名称重复');
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
      title: '套餐内容',
      width: 1000,
      render: (_, row) => {
        const { key, index } = row;
        const { contentType, contentDesc } = packageList[index];
        if (contentType === 'PURE_SING') {
          return '--';
        }
        return (
          <Form.Item>
            <Input type="textarea" size="default" autosize placeholder="字数100个以内" {...getFieldProps(`${fieldName}[${key}].contentDesc`, {
              initialValue: contentDesc,
              validateFirst: true,
              rules: [{
                required: true, whitespace: true, message: '请输入套餐内容',
              }, {
                validator(rule, val, callback) {
                  // eslint-disable-next-line no-control-regex
                  if (val.replace(/[^\x00-\xff]/g, 'xx').length > 200) {
                    callback('套餐内容不能超过100个字');
                    return;
                  }
                  if (/(欢唱|时长|节假日通用)/.test(val)) {
                    callback('套餐内容不可包含“欢唱”、“时长”、“节假日通用”字样');
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
      title: '适应时段',
      width: 1000,
      render: (_, row) => {
        const { key, index } = row;
        const { timeIds } = packageList[index];
        const fName = `${fieldName}[${key}].timeIds`;
        const fError = getFieldError(fName);
        const { onChange, ...fProps } = getFieldProps(fName, {
          initialValue: timeIds,
          validateFirst: true,
          rules: [{
            validator(rule, val, callback) {
              if (val && val.length === 0) {
                callback('请至少勾选1个套餐适用时段');
                return;
              }
              callback();
            },
          }],
        });
        const onCheckBoxChange = function (timeId, e) {
          const checked = e.target.checked;
          const value = checked ? timeIds.concat(timeId) : timeIds.filter(id => id !== timeId);
          onChange(value);
        };
        return (
          <Form.Item {...fProps} validateStatus={fError ? 'error' : 'success'} help={fError}>
            {timeList.map((time) => (
              <Checkbox key={time.timeId} checked={timeIds.includes(time.timeId)}
                onChange={onCheckBoxChange.bind(this, time.timeId)}>
                {`[${TIME_MODELS[time.timeModel]}] ${TIME_TYPES[time.startTimeType]}${time.startTime}~${TIME_TYPES[time.endTimeType]}${time.endTime}`}
              </Checkbox>
            ))}
          </Form.Item>
        );
      },
    }, {
      title: '适用包房',
      width: 1000,
      render: (_, row) => {
        const { key, index } = row;
        const { resourceIds } = packageList[index];
        const fName = `${fieldName}[${key}].resourceIds`;
        const fError = getFieldError(fName);
        const { onChange, ...fProps } = getFieldProps(fName, {
          initialValue: resourceIds,
          validateFirst: true,
          rules: [{
            validator(rule, val, callback) {
              if (val && val.length === 0) {
                callback('请至少勾选1个套餐适用包房');
                return;
              }
              callback();
            },
          }],
        });
        const onCheckBoxChange = function (resourceId, e) {
          const checked = e.target.checked;
          const value = checked ? resourceIds.concat(resourceId) :
            resourceIds.filter(id => id !== resourceId);
          onChange(value);
        };
        return (
          <Form.Item {...fProps} validateStatus={fError ? 'error' : 'success'} help={fError}>
            {resourceList.map((resource) => (
              <Checkbox key={resource.resourceId}
                checked={resourceIds.includes(resource.resourceId)}
                onChange={onCheckBoxChange.bind(this, resource.resourceId)}>
                {resource.resourceName}
              </Checkbox>
            ))}
          </Form.Item>
        );
      },
    }, {
      title: '操作',
      width: 60,
      render: (_, row) => {
        const { key, index } = row;
        return (
          <Button className="btn-link" size="small" disabled={dataSource.length <= 1} onClick={this.onRemoveRow.bind(this, fieldName, key, index)}>删除</Button>
        );
      },
    }];
    const footer = function () {
      return (
        <Button disabled={dataSource.length >= 5} type="ghost"
          onClick={this.onAddRow.bind(this, fieldName)}>添加（最多添加5条）
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

  onPrevClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'setState',
      payload: {
        currentStep: 0,
        resourceList: [],
        timeList: [],
        packageList: [],
      },
    });
    dispatch({ type: 'queryServiceList', payload: { } });
  }

  onNextClick = () => {
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll({ force: true, scroll: { offsetTop: 100 } }, (err) => {
      // console.log('validateFieldsAndScroll', err, values);
      if (err) {
        message.error('内容有误，请修改', 2);
        return;
      }
      this.setState({ isSubmiting: true });
      dispatch({ type: 'modifyPackageAttribute', payload: {} }).catch(() => {
        this.setState({ isSubmiting: false });
      });
    });
  }

  reloadList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'queryPackageList', payload: {} });
  }

  render() {
    const { loading, listErr, currentStep } = this.props;
    const { isSubmiting } = this.state;
    return (
      <div className="plan-step2">
        <Block title="套餐类型" subtitle={<Alert type="info" showIcon message="套餐名称及内容不可包含“欢唱”、“时长”、“节假日通用”等字段内容信息。套餐内容请标注数量或收费标准。" />}>
          {this.renderTable()}

          <div style={{ margin: '64px 0 0 24px' }}>
            {listErr ? (
              <Button icon="reload" type="primary" size="large" loading={loading} onClick={this.reloadList}>刷新</Button>
            ) : (
              <Button type="primary" size="large" loading={isSubmiting} disabled={loading} onClick={this.onNextClick}>下一步</Button>
            )}
            <Button style={{ marginLeft: 24 }} size="large" loading={currentStep === 0 && loading} disabled={isSubmiting} onClick={this.onPrevClick}>上一步</Button>
          </div>
        </Block>
      </div>
    );
  }
}
