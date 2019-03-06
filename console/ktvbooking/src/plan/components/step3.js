import React, { PureComponent } from 'react';
import { object, func, array, number, bool, string } from 'prop-types';
import { Alert, Table, Input, Select, Button, Form, DatePicker, Tag, message,
  Modal, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import { cloneDeepWith as _cloneDeepWith } from 'lodash';
import Block from '../../common/components/block';
import { TIME_TYPES, WEEKS, PRICE_MODELS, TIMES, TIME_MODELS } from '../constants';
import { setStorage } from '../../common/utils';

export default class Step3 extends PureComponent {
  static propTypes = {
    form: object,
    dispatch: func,
    loading: bool,
    listErr: bool,
    shopId: string,
    currentStep: number,
    cyclePriceList: array,
    unReservationDayList: array,
    resourceList: array,
  }

  state = {
    isSubmiting: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      editKeyIndex: { index: 0, key: 0 }, // 当前正在编辑的cyclePriceListKeys中的key
      openSpecialDatePicker: false, // 打开特殊日期选择
      openUnReservationDatePicker: false, // 打开不可预约日期选择
      openCopyModal: false, // 打开辅助对话框
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resourceList.length === 0 && this.props.resourceList.length > 0) {
      const theads = document.querySelectorAll('.plan-step3 .ant-table-thead');
      const len = theads.length;
      if (!len) {
        return;
      }
      const { resourceList } = this.props;
      let i = 0;
      while (i < len) {
        const thead = theads[i];
        const tr1 = thead.firstElementChild;
        const tr0 = document.createElement('tr');
        let j = 0;
        const childNodes = tr1.childNodes;
        while (j < 3) {
          const th = childNodes[0];
          th.setAttribute('rowSpan', 2);
          tr0.appendChild(th);
          j += 1;
        }
        if (len === 1 || i > 0) {
          resourceList.forEach(intiRes => {
            const th = document.createElement('th');
            th.setAttribute('colSpan', 3);
            th.innerHTML = intiRes.resourceName;
            tr0.appendChild(th);
          });
        }
        thead.insertBefore(tr0, tr1);
        tr1.style.height = '40px';
        tr0.style.height = '40px';
        i += 1;
      }
    }
  }

  toggleSpecialDatePicker = ({ open }) => {
    this.setState({
      openSpecialDatePicker: open,
    });
  }

  onAddSpecialDate = (date, dateString) => {
    const { form: { getFieldValue, setFieldsValue }, cyclePriceList } = this.props;
    const keysName = 'cyclePriceListKeys';
    const keyName = 'cyclePriceListKey';
    let listKeys = getFieldValue(keysName);
    const key = getFieldValue(keyName);
    const index = listKeys.length;
    listKeys = listKeys.concat({ key, index });
    const timePackageResourceList = _cloneDeepWith(cyclePriceList && cyclePriceList[0] &&
      cyclePriceList[0].timePackageResourceList, (value, ikey) => {
      if (['usableTimeLen', 'cyclePropertyId', 'price', 'minReservationNumbers', 'reserveStock'].includes(ikey)) {
        return ''; // 默认值
      } else if (ikey === 'priceModel') {
        return 'YUAN_PER_ROOM'; // 默认值
      }
      return undefined;
    }) || [];
    const value = {
      week: '',
      specialDate: dateString,
      timePackageResourceList,
    };
    const kvs = {};
    Object.keys(value).forEach(k => {
      kvs[`cyclePriceList[${key}].${k}`] = value[k];
    });
    setFieldsValue({
      ...kvs,
      [keysName]: listKeys,
      [keyName]: key + 1,
    });
    /* setFieldsValue({
      [keysName]: listKeys,
      [keyName]: key + 1,
      [`cyclePriceList[${key}]`]: {
        week: '',
        specialDate: dateString,
        timePackageResourceList,
      },
    }); */

    this.setState({
      openSpecialDatePicker: false,
    });
  }

  onRemoveSpecialDate = (_key, _inedx) => {
    const { form: { getFieldValue, setFieldsValue }, cyclePriceList } = this.props;
    const { editKeyIndex } = this.state;
    const name = 'cyclePriceListKeys';
    let listKeys = getFieldValue(name);
    listKeys = listKeys.filter(({ key }) => key !== _key).map(({ key }, index) => ({ key, index }));
    let keyIndex = listKeys.find(({ key }) => key >= editKeyIndex.key);
    if (!keyIndex) {
      keyIndex = listKeys[listKeys.length - 1];
    }
    Object.assign(editKeyIndex, keyIndex);
    cyclePriceList.splice(_inedx, 1);
    setFieldsValue({ [name]: listKeys });
  }

  onSepcialDateClick = (editKeyIndex, e) => {
    if (e.target.tagName !== 'I') { // 不是删除操作触发的
      this.setState({
        editKeyIndex,
      });
    }
  }

  disabledDate = (current) => {
    const { cyclePriceList, unReservationDayList } = this.props;
    return current && (current.getTime() <= Date.now()
    || unReservationDayList.some((date) => moment(date).isSame(current.getTime(), 'day'))
    || cyclePriceList.some(({ specialDate }) => (specialDate && moment(specialDate).isSame(current.getTime(), 'day')))
    );
  }

  hasNotCompleted = (timePackageResourceList) =>
    !timePackageResourceList.length || // 时段套餐包厢信息列表为空
    timePackageResourceList.some(({ usableTimeLen, priceModel, packageResourceList }) =>
      packageResourceList && packageResourceList.length && // 套餐-包厢价格列表不为空的情况下：
      (!usableTimeLen || !priceModel || // 欢唱时长为空 || 计价方式为空
      packageResourceList.some(({ resourcePriceSetList }) =>
        !resourcePriceSetList || !resourcePriceSetList.length || // 套餐-包厢价格列表为空
        resourcePriceSetList.some(({ minReservationNumbers, reserveStock }) =>
          !reserveStock || (priceModel === 'YUAN_PER_PERSON' && !minReservationNumbers))))) // 房间数为空 || 在元/人模式下，起订人数为空

  // 周期
  renderCycle() {
    const { form: { getFieldValue }, cyclePriceList, listErr } = this.props;
    const { openSpecialDatePicker, editKeyIndex: { key: editKey } } = this.state;
    const cyclePriceListKeys = getFieldValue('cyclePriceListKeys') || [];

    let specialDateCount = 0;
    const tags = cyclePriceListKeys.map(({ index, key }) => {
      const { week, specialDate, timePackageResourceList } = cyclePriceList[index];
      if (!week && specialDate) {
        specialDateCount += 1;
      }
      return (
        <Tag key={key} className="ant-tag-default" closable={!week && specialDate} color={key === editKey ? 'blue' : ''}
          onClick={this.onSepcialDateClick.bind(this, { key, index })}
          afterClose={this.onRemoveSpecialDate.bind(this, key, index)}>
          {(week && WEEKS[week]) || specialDate}
          <div className={`tag-dot${this.hasNotCompleted(timePackageResourceList) ? '' : ' tag-dot-complete'}`} />
        </Tag>
      );
    });
    const disabled = listErr || specialDateCount >= 6;
    return (
      <div>
        <div className="tag-dot-legend">
          <div className="tag-dot tag-dot-complete" />已设置
          <div className="tag-dot" />未设置
        </div>
        <Form.Item label="设置日期" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} required>
          {tags}
          <Button type="dashed" size="default" disabled={disabled} icon="plus" style={{ marginBottom: 12 }}
            onClick={this.toggleSpecialDatePicker.bind(this, { open: true })}>添加特殊日期
          </Button>
          <DatePicker open={openSpecialDatePicker} toggleOpen={this.toggleSpecialDatePicker}
            disabledDate={this.disabledDate} onChange={this.onAddSpecialDate}
            style={{ visibility: 'hidden', width: 0, height: 0, left: -122, top: 30 }} />
        </Form.Item>
      </div>
    );
  }

  // 表格
  renderTable() {
    const { form: { getFieldProps }, cyclePriceList, resourceList, loading } = this.props;
    const { editKeyIndex: { key: editKey, index: editIndex } } = this.state;

    const { timePackageResourceList } = cyclePriceList[editIndex]
      || { timePackageResourceList: [] };
    const fName = `cyclePriceList[${editKey}].timePackageResourceList`;
    // 将 时段-套餐-包厢 列表转为 套餐-时段-包厢 便于表格输出
    // [{key:'',timePackageResource,timePackageResourceIndex,packageResource,packageResourceIndex}]
    const packageTimeResourceList = timePackageResourceList
      .reduce((dataSource, timePackageResource, timePackageResourceIndex) => {
        const { priceModel, packageResourceList } = timePackageResource;
        Object.assign(timePackageResource, { priceModel: priceModel || 'YUAN_PER_ROOM' }); // 设置默认元/间
        if (packageResourceList && packageResourceList.length) {
          return dataSource.concat(packageResourceList
            .map((packageResource, packageResourceIndex) => ({
              key: `${timePackageResourceIndex}-${packageResourceIndex}`,
              timePackageResource, timePackageResourceIndex,
              packageResource, packageResourceIndex,
            })));
        }
        const packageResourceIndex = -1; // 时段未关联套餐或包厢
        return dataSource.concat({
          key: `${timePackageResourceIndex}-${packageResourceIndex}`,
          timePackageResource, timePackageResourceIndex,
          packageResource: null, packageResourceIndex,
        });
      }, []);

    const fixed = resourceList.length >= 3;
    // const scroll = fixed ? { x: 324 + (298 * resourceList.length), y: false } : undefined;
    const scroll = fixed ? { x: 340 + (294 * resourceList.length), y: false } : undefined;
    const columns = [{
      title: '时段',
      width: 139,
      fixed,
      key: 'planTimeVO',
      dataIndex: 'timePackageResource',
      render: (timePackageResource, row) => {
        const { planTimeVO: { startTime, startTimeType, endTime, endTimeType, timeModel },
          usableTimeLen, packageResourceList } = timePackageResource;
        const { timePackageResourceIndex, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return (
            <div>
              <span>[{TIME_MODELS[timeModel]}]</span>
              <div>{TIME_TYPES[startTimeType]}{startTime}~{TIME_TYPES[endTimeType]}{endTime}</div>
            </div>
          );
        }
        let children = null;
        if (packageResourceIndex === 0) {
          const startTimeStr = `${startTimeType}-${startTime}`;
          const endTimeStr = `${endTimeType}-${endTime}`;
          const diff = Math.floor((Math.abs(TIMES.findIndex(v => v === startTimeStr)
            - TIMES.findIndex(v => v === endTimeStr))) / 2); // 时段跨度diff个小时
          children = (
            <Form.Item>
              <div>{`${TIME_TYPES[startTimeType]}${startTime}~${TIME_TYPES[endTimeType]}${endTime}`}</div>
              <Input size="default" placeholder="大于0" addonBefore={`[${TIME_MODELS[timeModel]}] `} addonAfter="小时" {...getFieldProps(`${fName}[${timePackageResourceIndex}].usableTimeLen`, {
                initialValue: usableTimeLen,
                validateFirst: true,
                rules: [{
                  required: true, whitespace: true, message: '请输入欢唱时长',
                }, {
                  pattern: /^[1-9]\d*$/, message: '欢唱时长只能输入正整数',
                }, {
                  validator(rule, val, callback) {
                    if (+val > diff) {
                      callback('欢唱时长必须小于时段跨度');
                      return;
                    }
                    callback();
                  },
                }],
              })} />
            </Form.Item>
          );
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }, {
      title: '计价方式',
      width: 81,
      fixed,
      key: 'priceModel',
      dataIndex: 'timePackageResource',
      render: (timePackageResource, row) => {
        const { timePackageResourceIndex, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { priceModel, packageResourceList } = timePackageResource;
        let children = null;
        if (packageResourceIndex === 0) {
          children = (
            <Form.Item>
              <Select size="default" style={{ width: 64 }} {...getFieldProps(`${fName}[${timePackageResourceIndex}].priceModel`, {
                initialValue: priceModel,
                validateFirst: true,
                rules: [{
                  required: true, message: '请选择计价方式',
                }],
              })}>
                {Object.keys(PRICE_MODELS).map((k) => (
                  <Select.Option key={k} value={k}>
                    {PRICE_MODELS[k]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          );
        }
        const obj = {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
        return obj;
      },
    }, {
      title: '套餐',
      width: 116,
      fixed,
      key: 'contentName',
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { contentType, contentName } = packageResource;
        return contentType === 'PURE_SING' ? '纯欢唱' : `欢唱-${contentName}`;
      },
    }, ...resourceList.reduce((
      allColumns, resource,
      resourceIndex,
    ) => allColumns.concat([{
      title: '售价',
      width: 110,
      key: `price${resourceIndex}`,
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { timePackageResource: { priceModel },
          timePackageResourceIndex, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { resourcePriceSetList } = packageResource;
        const { resourceId } = resource;
        const resourcePriceSetIndex = resourcePriceSetList
          .findIndex(rps => rps.resourceId === resourceId);
        if (resourcePriceSetIndex === -1) {
          return '--';
        }
        const { price } = resourcePriceSetList[resourcePriceSetIndex];
        return (
          <Form.Item>
            <Input size="default" placeholder="大于0" addonAfter={PRICE_MODELS[priceModel]}
              {...getFieldProps(`${fName}[${timePackageResourceIndex}].packageResourceList[${packageResourceIndex}].resourcePriceSetList[${resourcePriceSetIndex}].price`, {
              initialValue: price,
              validateFirst: true,
              rules: [{
                required: false, whitespace: false,
              }, {
          // pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0\.([1-9]\d?|0[1-9])$)/, message: '售价只能输入正金额',
                pattern: /^[1-9]\d*$/, message: '售价只能输入正整数',
              }, {
                validator(rule, val, callback) {
                  if (+val > 2000) {
                    callback('售价必须小于2000');
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
      title: '起订人数',
      width: 90,
      key: `minReservationNumbers${resourceIndex}`,
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { timePackageResource: { packageResourceList, priceModel },
          timePackageResourceIndex, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { resourceId, minUserNumbers, maxUserNumbers } = resource;
        let children = null;
        if (packageResourceIndex === 0) {
          children = '--';
          if (priceModel === 'YUAN_PER_PERSON') {
            const fieldPropsList = []; // 时段-包厢 下的所有起订人数fieldProps列表
            packageResourceList.forEach((pkgRes, pkgResIndex) => {
              pkgRes.resourcePriceSetList.forEach((resPriceSet, resPriceSetIndex) => {
                if (resPriceSet.resourceId === resourceId) {
                  const fieldProps = getFieldProps(`${fName}[${timePackageResourceIndex}].packageResourceList[${pkgResIndex}].resourcePriceSetList[${resPriceSetIndex}].minReservationNumbers`, {
                    initialValue: resPriceSet.minReservationNumbers,
                  });
                  fieldPropsList.push(fieldProps);
                }
              });
            });
            if (fieldPropsList.length > 0) {
              const { value: minReservationNumbers } = fieldPropsList[0];
              children = (
                <Form.Item>
                  <Input size="default" addonAfter="人" placeholder="大于0"
                    {...getFieldProps(`cyclePriceList[${editKey}]_timePackageResourceList[${timePackageResourceIndex}]_packageResourceList[${packageResourceIndex}]_resourcePriceSetList[${resourceIndex}]_minReservationNumbers`, {
                    initialValue: minReservationNumbers,
                    onChange(value) {
                      fieldPropsList.forEach(fieldProps => fieldProps.onChange(value));
                    },
                    validateFirst: true,
                    rules: [{
                      required: true, whitespace: true, message: '请输入起订人数',
                    }, {
                      pattern: /^[1-9]\d*$/, message: '起订人数只能输入正整数',
                    }, {
                      validator(rule, val, callback) {
                        if (+val < minUserNumbers) {
                          callback(`起订人数不能小于该房型最少容纳人数${minUserNumbers}`);
                          return;
                        }
                        if (+val > maxUserNumbers) {
                          callback(`起订人数不能大于该房型最多容纳人数${maxUserNumbers}`);
                          return;
                        }
                        callback();
                      },
                    }],
                  })} />
                  {fieldPropsList.map((fieldProps, index) => <span {...fieldProps} key={index} />)}
                </Form.Item>
              );
            }
          }
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }, {
      title: '房间数',
      width: 90,
      key: `reserveStock${resourceIndex}`,
      dataIndex: 'packageResource',
      render: (packageResource, row) => {
        const { timePackageResource: { packageResourceList },
          timePackageResourceIndex, packageResourceIndex } = row;
        if (packageResourceIndex === -1) {
          return '--';
        }
        const { resourceId } = resource;
        let children = null;
        if (packageResourceIndex === 0) {
          children = '--';
          const fieldPropsList = []; // 时段-包厢 下的所有房间数fieldProps列表
          packageResourceList.forEach((pkgRes, pkgResIndex) => {
            pkgRes.resourcePriceSetList.forEach((resPriceSet, resPriceSetIndex) => {
              if (resPriceSet.resourceId === resourceId) {
                const fieldProps = getFieldProps(`${fName}[${timePackageResourceIndex}].packageResourceList[${pkgResIndex}].resourcePriceSetList[${resPriceSetIndex}].reserveStock`, {
                  initialValue: resPriceSet.reserveStock,
                });
                fieldPropsList.push(fieldProps);
              }
            });
          });
          if (fieldPropsList.length > 0) {
            const { value: reserveStock } = fieldPropsList[0];
            children = (
              <Form.Item>
                <Input size="default" addonAfter="间" placeholder="大于0"
                  {...getFieldProps(`cyclePriceList[${editKey}]_timePackageResourceList[${timePackageResourceIndex}]_packageResourceList[${packageResourceIndex}]_resourcePriceSetList[${resourceIndex}]_reserveStock`, {
                  initialValue: reserveStock,
                  onChange(value) {
                    fieldPropsList.forEach(fieldProps => fieldProps.onChange(value));
                  },
                  validateFirst: true,
                  rules: [{
                    required: true, whitespace: true, message: '请输入房间数',
                  }, {
                    pattern: /^[1-9]\d*$/, message: '房间数只能输入正整数',
                  }, {
                    validator(rule, val, callback) {
                      if (+val > 999) {
                        callback('房间数不能大于999');
                        return;
                      }
                      callback();
                    },
                  }],
                })} />
                {fieldPropsList.map((fieldProps, index) => <span {...fieldProps} key={index} />)}
              </Form.Item>
            );
          }
        }
        return {
          children,
          props: {
            rowSpan: packageResourceIndex === 0 ? packageResourceList.length : 0,
          },
        };
      },
    }]), [])];
    return (
      <Table className="addable-table plan-price-table"
        loading={loading}
        dataSource={packageTimeResourceList}
        columns={columns}
        scroll={scroll}
        pagination={false} bordered size="small" />
    );
  }

  toggleOpenCopyModal = (openCopyModal) => {
    this.setState({
      openCopyModal,
    });
  }

  onCopyModalOk = () => {
    const { cyclePriceList,
      form: { setFieldsValue, validateFieldsAndScroll }, shopId } = this.props;
    const { editKeyIndex: { index: editIndex } } = this.state;
    validateFieldsAndScroll(['copyList'], { force: true, scroll: { offsetTop: 100 } }, (err, values) => {
      // console.log('validateFieldsAndScroll', err, values);
      if (err) {
        return;
      }
      const { timePackageResourceList: sourceTimePackageResourceList } = cyclePriceList[editIndex];
      const { copyList } = values;
      cyclePriceList.forEach((cyclePrice) => {
        if (copyList.some(item => (item.week && item.week === cyclePrice.week)
           || (item.specialDate && item.specialDate === cyclePrice.specialDate))) {
          const timePackageResourceList = _cloneDeepWith(sourceTimePackageResourceList);
          timePackageResourceList.forEach((timePackageResource, index1) => {
            const o1 = cyclePrice.timePackageResourceList[index1];
            if (o1) {
              timePackageResource.packageResourceList.forEach((packageResource, index2) => {
                const o2 = o1.packageResourceList[index2];
                if (o2) {
                  packageResource.resourcePriceSetList.forEach((resourcePriceSet, index3) => {
                    const o3 = o2.resourcePriceSetList[index3];
                    if (o3) {
                      Object.assign(resourcePriceSet, {
                        cyclePropertyId: o3.cyclePropertyId, // cyclePropertyId不能被覆盖
                      });
                    }
                  });
                }
              });
            }
          });
          Object.assign(cyclePrice, { timePackageResourceList });
        }
      });
      if (copyList.length) {
        setStorage(`plan#${shopId}#cyclePriceList`, cyclePriceList); // 实时保存
      }
      setFieldsValue({
        copyList: [],
      });
      this.toggleOpenCopyModal(false);
    });
  }

  // 复制
  renderCopy() {
    const { cyclePriceList, form: { getFieldProps, getFieldError }, listErr } = this.props;
    const { openCopyModal, editKeyIndex: { index: editIndex } } = this.state;
    const cyclePrice = cyclePriceList[editIndex];
    if (!cyclePrice) {
      return null;
    }
    const { value: copyList, onChange, ...fProps } = getFieldProps('copyList', {
      initialValue: [],
      hidden: !openCopyModal,
      validateFirst: true,
      rules: [{
        required: true, message: '请选择复制到的日期',
      }],
    });
    const fError = getFieldError('copyList');
    const onCheckBoxChange = function ({ week, specialDate }, e) {
      const checked = e.target.checked;
      const value = checked ? copyList.concat({ week, specialDate }) :
        copyList.filter(item => (week && item.week !== week) ||
        (specialDate && item.specialDate !== specialDate));
      onChange(value);
    };
    return (
      <div>
        <Button style={{ marginTop: 24 }} type="primary" disabled={listErr} onClick={this.toggleOpenCopyModal.bind(this, true)}>将设置结果复制到其他日期</Button>
        <Modal className="plan-modal-copy" title="复制到" visible={openCopyModal}
          onCancel={this.toggleOpenCopyModal.bind(this, false)} onOk={this.onCopyModalOk}>
          <Alert message="复制后的日期会覆盖原来的内容" type="info" showIcon />
          <div style={{ marginTop: 8 }}>
            当前设置日期：
            <strong>{(cyclePrice.week && WEEKS[cyclePrice.week]) || cyclePrice.specialDate}</strong>
          </div>
          <div style={{ marginTop: 16 }}>请选择复制到的日期：</div>
          <Form.Item {...fProps} validateStatus={fError ? 'error' : 'success'} help={fError}>
          {cyclePriceList.map(({ week, specialDate }, index) => (index !== editIndex && (
            <Checkbox key={index} checked={copyList.some((item) => (
              (week && item.week === week) || (specialDate && item.specialDate === specialDate)))}
              onChange={onCheckBoxChange.bind(this, { week, specialDate })}>
              {(week && WEEKS[week]) || specialDate}
            </Checkbox>
          )))}
          </Form.Item>
        </Modal>
      </div>
    );
  }

  toggleOpenUnReservationDatePicker = ({ open }) => {
    this.setState({
      openUnReservationDatePicker: open,
    });
  }

  onAddUnReservationDate = (date, dateString) => {
    const { form: { getFieldValue, setFieldsValue } } = this.props;
    const keysName = 'unReservationDayListKeys';
    const keyName = 'unReservationDayListKey';
    let listKeys = getFieldValue(keysName);
    const key = getFieldValue(keyName);
    const index = listKeys.length;
    listKeys = listKeys.concat({ key, index });
    setFieldsValue({
      [keysName]: listKeys,
      [keyName]: key + 1,
      [`unReservationDayList[${key}]`]: dateString,
    });

    this.setState({
      openUnReservationDatePicker: false,
    });
  }

  onRemoveUnReservationDate = (_key, _index) => {
    const { form: { getFieldValue, setFieldsValue }, unReservationDayList } = this.props;
    const name = 'unReservationDayListKeys';
    let listKeys = getFieldValue(name);
    listKeys = listKeys.filter(({ key }) => key !== _key).map(({ key }, index) => ({ key, index }));
    unReservationDayList.splice(_index, 1);
    setFieldsValue({ [name]: listKeys });
  }

  // 不可预约日期
  renderUnReservationDay() {
    const { form: { getFieldValue }, unReservationDayList, listErr } = this.props;
    const { openUnReservationDatePicker } = this.state;
    const unReservationDayListKeys = getFieldValue('unReservationDayListKeys') || [];

    const tags = unReservationDayListKeys.map(({ index, key }) => {
      const day = unReservationDayList[index];
      return (
        <Tag key={key} className="ant-tag-default" closable
          afterClose={this.onRemoveUnReservationDate.bind(this, key, index)}>
          {day}
        </Tag>
      );
    });
    return (
      <Form.Item style={{ marginTop: 24 }} label="不可预约日期" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
        <div style={{ paddingLeft: 8 }}>
          <Row style={{ marginBottom: 16 }}>
            <Col span={3}>
              <Button type="ghost" size="default" disabled={listErr || tags.length >= 6}
                onClick={this.toggleOpenUnReservationDatePicker.bind(this, { open: true })}>添加
              </Button>
              <DatePicker open={openUnReservationDatePicker}
                toggleOpen={this.toggleOpenUnReservationDatePicker}
                disabledDate={this.disabledDate} onChange={this.onAddUnReservationDate}
                style={{ visibility: 'hidden', width: 0, height: 0, left: -60, top: 32 }} />
            </Col>
            <Col span={21} style={{ paddingTop: 9 }}>
              <Alert message="若设置不可预约日期，则当天不可预订；不可预约日期请不要和特殊日期重复；不可预约日期不可超过6天。" type="info" showIcon />
            </Col>
          </Row>
          {tags}
        </div>
      </Form.Item>
    );
  }

  onPrevClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'setState',
      payload: {
        currentStep: 1,
        cyclePriceList: [],
        unReservationDayList: [],
        resourceList: [],
      },
    });
    dispatch({ type: 'queryPackageList', payload: { } });
  }

  onSubmitClick = async () => {
    const { form: { getFieldValue, validateFieldsAndScroll },
      dispatch, cyclePriceList } = this.props;
    const listKeys = getFieldValue('cyclePriceListKeys');
    this.setState({ isSubmiting: true });
    for (const keyIndex of listKeys) { // eslint-disable-line
      try {
        await new Promise((resolve, reject) => { // eslint-disable-line
          this.setState({ editKeyIndex: keyIndex }, () => {
            validateFieldsAndScroll({ force: true,
              scroll: { offsetTop: 100, offsetLeft: 350, offsetRight: 20 },
            }, (err) => {
              // console.log('validateFieldsAndScroll', err, values);
              const { week, specialDate } = cyclePriceList[keyIndex.index];
              if (!err) {
                resolve();
              } else {
                reject(`[${week && WEEKS[week] || specialDate}]内容有误，请修改`); // eslint-disable-line
              }
            });
          });
        });
      } catch (err) {
        message.error(err, 3);
        this.setState({ isSubmiting: false });
        const table = document.querySelector('.plan-price-table');
        if (table.scrollIntoViewIfNeeded) {
          table.scrollIntoViewIfNeeded(true);
        } else {
          table.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }
    dispatch({ type: 'modifyPriceList', payload: {} }).catch(() => {
      this.setState({ isSubmiting: false });
    });
  }

  reloadList = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'queryPriceList', payload: {} });
  }

  render() {
    const { loading, listErr, currentStep } = this.props;
    const { isSubmiting } = this.state;

    const subtitle = (
      <div className="plan-step3-subtitle">
        <Alert type="info" showIcon message="“售价”为空，则默认该套餐不可售卖。" />
        <a href="https://render.alipay.com/p/f/jgdib90q/index.html" target="_blank" rel="noopener noreferrer">查看客户端展示效果样例</a>
      </div>
    );
    return (
      <div className="plan-step3">
        <Block title="价目表" subtitle={subtitle}>
          {this.renderCycle()}
          {this.renderTable()}
          {this.renderCopy()}
          {this.renderUnReservationDay()}
          <div style={{ margin: '64px 0 0 24px' }}>
            {listErr ? (
              <Button icon="reload" type="primary" size="large" loading={loading} onClick={this.reloadList}>刷新</Button>
            ) : (
              <Button className="S_btn-sbmt" type="primary" size="large" loading={isSubmiting} disabled={loading} onClick={this.onSubmitClick}>提交</Button>
            )}
            <Button style={{ marginLeft: 24 }} size="large" loading={currentStep === 1 && loading} disabled={isSubmiting} onClick={this.onPrevClick}>上一步</Button>
          </div>
        </Block>
      </div>
    );
  }
}
