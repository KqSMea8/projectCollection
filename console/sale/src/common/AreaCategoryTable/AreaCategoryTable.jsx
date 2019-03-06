import './component.less';
import React, { PropTypes } from 'react';
import { Spin } from 'antd';
import ajax from 'Utility/ajax';
import { getAreaCategoryData, getCategoriesTree, tagAreaNode, equalObject } from './util';
import { appendOwnerUrlIfDev } from '../utils';
import lodash from 'lodash';
import AreaCategoryTableRow from './AreaCategoryTableRow';

let uuid = 0;

const AreaCategoryTable = React.createClass({
  propTypes: {
    form: PropTypes.object,
    data: PropTypes.array,
    getTreeOption: PropTypes.object,
    isShowParentTreeSelect: PropTypes.any,
  },

  getDefaultProps() {
    return {
      isShowParentTreeSelect: false,
    };
  },

  getInitialState() {
    return {
      loading: true,
      areas: undefined,
      areaOrder: undefined,
      categoryOrderList: [],
      isShowZhanWei: false, // 当是运营工作台岗位是展示展位=>isShowZhanWei:true;
      editRow: NaN,
    };
  },

  componentDidMount() {
    this.fetch();
    // 查询当前所在的工作台,如果是运营工作台则添加展位字段.
    this.getDomainId();
  },

  componentWillReceiveProps(nextProps) {
    if (!equalObject(nextProps.getTreeOption, this.props.getTreeOption)) {
      this.fetch(nextProps);
    }

    if (this.props.data !== nextProps.data && nextProps.data.length > 0) {
      // 收到编辑数据
      const {setFieldsValue} = this.props.form;
      const keys = [];
      const fieldsValue = {};
      let state = { ...this.state };

      // 这个函数是为了处理展位下来选的回显值的问题(不然的话只能显示spacesCodes);
      this.setSpaceData(nextProps.data);

      uuid = 0;
      nextProps.data.forEach((row) => {
        keys.push(uuid);
        const area = [row.provinceCode, row.cityCode, row.districtCode];
        fieldsValue['area-' + uuid] = area;
        fieldsValue['categories-' + uuid] = row.categories.split(',');
        // 如果是运营工作台则回显展位
        if (row.spaces) {
          const items = row.spaces;
          const spaceCodes = [];
          for (let i = 0; i < items.length; i++) {
            spaceCodes.push(items[i].spaceCode);
          }
          fieldsValue['spaceCodes-' + uuid] = spaceCodes;
        }
        // 如果所有的树形结构数据已经存在，则...
        if (this.data) {
          state = this.getNewAreaAndTreeData(state, uuid, area);
        }
        uuid++;
      });

      this.setState(state);

      fieldsValue.keys = keys;
      setFieldsValue(fieldsValue);
    }
  },

  // 当选择服务区域时
  onAreaChange(key, v) { // key代表数组的行号,v代表选择的数组例如:["130000", "131100", "131125"]
    const newState = this.getNewAreaAndTreeData(this.state, key, v);
    this.setState({ ...newState });
  },

  setEditRow(idx) {
    this.setState({
      editRow: idx,
    });
  },

  // 获取新的区域和品类树
  getNewAreaAndTreeData(data, key, v) {
    let categories;
    const {categoryOrderList} = data;
    if (v) {
      // 获取区域对应的品类树
      categories = getCategoriesTree(this.data, v);
    } else {
      categories = null;
    }

    categoryOrderList[key] = categories;
    // 更新区域树
    let {areas} = data;
    const prevValue = this.props.form.getFieldValue('area-' + key);
    areas = tagAreaNode(areas, prevValue, false);
    areas = tagAreaNode(areas, v, true);

    return data;
  },

  // 获取当前所登录的工作台,
  getDomainId() {
    ajax({
      url: appendOwnerUrlIfDev('/queryDomainId.json'),
      // url: window.APP.buserviceUrl + '/pub/getLoginUser.json',
      method: 'get',
      type: 'json',
      success: (result) => {
        if (result.status === 'succeed' && result.data === 'KOUBEI_OPERATING') {
          this.setState({
            isShowZhanWei: true,
          });
        }
      },
    });
  },

  // 回显展位的下拉选数据
  setSpaceData(nextPropsData) {
    const allData = nextPropsData;
    const spacesArrayData = [];
    for (let i = 0; i < allData.length; i++) {
      let spacesData = {};
      if (allData[i].spaces) {
        for (let j = 0; j < allData[i].spaces.length; j++) {
          spacesData = allData[i].spaces[j];
          spacesArrayData.push(spacesData);
        }
      }
    }
    this.setState({
      spacesArrayData,
    });
  },

  fetch(props = this.props) {
    this.setState({
      loading: true,
    });

    // 获取所有的区域品类数据
    getAreaCategoryData(props.getTreeOption).then((d) => {
      this.data = lodash.cloneDeep(d);

      // 针对泛行业设置一个特定的值categoryLabels 并保存起来,方便后面调用
      if (this.data.areaConstraintType === 'categoryLabels') {
        this.setState({
          areaConstraintType: 'categoryLabels',
        });
      } else if (this.data.areaConstraintType === 'categories') {// 针对其他行业
        this.setState({
          areaConstraintType: 'categories',
        });
      }

      let state = { ...this.state };
      state.areas = this.data.areas;
      state.areaOrder = this.data.areaOrder;

      // 数据返回更新品类树
      const {getFieldValue} = this.props.form;
      getFieldValue('keys').forEach((k) => {
        state = this.getNewAreaAndTreeData(state, k, getFieldValue('area-' + k));
      });

      state.loading = false;
      this.setState(state);
    });
  },

  addRow() {
    const {getFieldValue, setFieldsValue} = this.props.form;
    const keys = getFieldValue('keys');
    uuid++;
    keys.push(uuid);
    setFieldsValue({ keys });
  },

  removeRow(key) {
    let {areas} = this.state;
    const {getFieldValue, setFieldsValue} = this.props.form;
    let keys = getFieldValue('keys');
    keys = keys.filter((k) => {
      return k !== key;
    });
    setFieldsValue({ keys });

    const area = getFieldValue('area-' + key);
    areas = tagAreaNode(areas, area, false);
    this.setState({
      areas,
    });
  },

  render() {
    const { getFieldProps } = this.props.form;
    const keys = getFieldProps('keys', { initialValue: [0] }).value;

    return (
      <div {...this.props} className="area-category-table">
        <Spin spinning={this.state.loading}>
          <div className="area-category-table-head clearfix">
            <div className="area-category-col col1">服务区域</div>
            <div className="area-category-col col2">服务品类</div>
            {this.state.isShowZhanWei && <div className="area-category-col col2">展位</div>}
            <div className="area-category-col col3">操作</div>
          </div>
          {keys.map((key, i) => {
            const treeData = this.state.categoryOrderList[key];
            const props = {
              form: this.props.form,
              treeData, isShowParentTreeSelect: this.props.isShowParentTreeSelect,
              areaConstraintType: this.state.areaConstraintType,
              areas: this.state.areas, idx: key, isShowZhanWei: this.state.isShowZhanWei,
              isEdit: isNaN(this.state.editRow) || this.state.editRow === key,
              isLast: i === keys.length - 1,
              isOnly: keys.length === 1,
              spacesArrayData: this.state.spacesArrayData,
              addRow: this.addRow,
              removeRow: this.removeRow.bind(this, key),
              onAreaChange: this.onAreaChange.bind(this, key),
              setEditRow: this.setEditRow,
            };
            return <AreaCategoryTableRow {...props} key={key} />;
          })}
        </Spin>
      </div>
    );
  },
});

export default AreaCategoryTable;
