import React, { Component, PropTypes } from 'react';
import { TreeSelect, Form, Cascader } from 'antd';
import classnames from 'classnames';
import FastTreeSelect from './FastTreeSelect';
import ZhanWeiSelect from './ZhanWeiSelect';

const FormItem = Form.Item;
const { SHOW_PARENT, SHOW_CHILD } = TreeSelect;
export default class AreaCategoryTableRow extends Component {
  static propTypes = {
    treeData: PropTypes.any,
    isShowParentTreeSelect: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    areaConstraintType: PropTypes.string,
    areas: PropTypes.any,
    idx: PropTypes.number.isRequired,
    isShowZhanWei: PropTypes.bool,
    isLast: PropTypes.bool.isRequired,
    isOnly: PropTypes.bool.isRequired,
    spacesArrayData: PropTypes.any,
    removeRow: PropTypes.func.isRequired,
    addRow: PropTypes.func.isRequired,
    onAreaChange: PropTypes.func.isRequired,
    setEditRow: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isShowZhanWei: false,
  }

  shouldComponentUpdate(nextProps) {
    const {
      treeData, areaConstraintType, areas, idx,
      isLast, isOnly,
    } = nextProps;
    return this.props.isEdit === true
      || areas !== this.props.areas || treeData !== this.props.treeData
      || areaConstraintType !== this.props.areaConstraintType
      || idx !== this.props.idx || isLast !== this.props.isLast
      || isOnly !== this.props.isOnly;
  }

  get isDisabled() {
    return this.props.areaConstraintType === 'categoryLabels' || !this.props.treeData;
  }

  get isAreasDisabled() {
    return !this.props.areas || this.props.areas.length === 0 || this.props.areaConstraintType === 'categoryLabels';
  }

  render() {
    const {
      treeData, isShowParentTreeSelect, areas, isShowZhanWei,
      form, idx, isLast, isOnly, areaConstraintType, spacesArrayData,
      onAreaChange,
    } = this.props;

    const { getFieldError, getFieldProps } = form;
    const tProps = {
      showCheckedStrategy: isShowParentTreeSelect ? SHOW_PARENT : SHOW_CHILD,
      disabled: this.isDisabled,
    };

    // 用于显示校验的帮助信息针对泛行业设置一个特定的值
    let areaConstraintTypeInfo = areaConstraintType === 'categoryLabels' ? '泛行业' : '品类（多选）';
    // 现在不仅要看是否有 categoryLabels 标，还要看标的内容，而这两个值分别在两个接口
    if (form.getFieldValue(`categories-${idx}`) && form.getFieldValue(`categories-${idx}`).toString() === 'ALL') {
      areaConstraintTypeInfo = '全类目';
    }

    return (
      <div className="area-category-row clearfix" onFocus={() => { this.props.setEditRow(idx); }}>
        <div className="area-category-col col1" style={{ marginBottom: '8px' }}>
          <FormItem
            validateStatus={
              classnames({
                error: !!getFieldError('area-' + idx),
              })}
            help={(getFieldError('area-' + idx) && '请选择服务区域')}>
            <Cascader size="large"
              expandTrigger="hover"
              style={{ width: 180 }}
              placeholder="区域（单选）"
              options={areas}
              disabled={this.isAreasDisabled}
              {...getFieldProps('area-' + idx, {
                onChange: onAreaChange,
                rules: [{ required: true, type: 'array' }],
              }) } />
          </FormItem>
        </div>
        <div className="area-category-col col2">
          <FormItem
            validateStatus={
              classnames({
                error: !!getFieldError('categories-' + idx),
              })}
            help={(getFieldError('categories-' + idx) && '请选择品类')}>
            <FastTreeSelect size="large"
              style={{ width: 180, lineHeight: '24px' }}
              searchPlaceholder={areaConstraintTypeInfo}
              {...tProps}
              data={treeData}
              {...getFieldProps('categories-' + idx, {
                rules: [
                  { required: areaConstraintType === 'categories', type: 'array' },// 当不是泛行业是必填,
                ],
              }) } />
          </FormItem>
        </div>
        {
          isShowZhanWei &&
          <div className="area-category-col col2">
            <FormItem
              validateStatus={
                classnames({
                  error: !!getFieldError('spaceCodes-' + idx),
                })}
              help={(getFieldError('spaceCodes-' + idx) && '请选择展位')}>
              {spacesArrayData ?
                <ZhanWeiSelect spacesArrayData={spacesArrayData}
                  {...getFieldProps('spaceCodes-' + idx, {
                    rules: [{
                      type: 'array',
                    }],
                  }) }
                /> : <ZhanWeiSelect
                  {...getFieldProps('spaceCodes-' + idx, {
                    rules: [{
                      type: 'array',
                    }],
                  }) }
                />}
            </FormItem>
          </div>
        }
        {
          this.props.areaConstraintType !== 'categoryLabels' &&
          <div className="area-category-col col3">
            {
              isLast ? (<a onClick={this.props.addRow}>新增</a>) : null
            }
            {
              isLast && !isOnly ? (<span className="ft-bar">|</span>) : null
            }
            {
              !isOnly ? (<a onClick={this.props.removeRow}>删除</a>) : null
            }
          </div>
        }
      </div>
    );
  }
}
