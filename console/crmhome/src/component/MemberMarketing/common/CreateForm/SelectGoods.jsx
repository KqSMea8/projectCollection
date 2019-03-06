import React, {PropTypes} from 'react';
import { Row, Col, Button, Modal, Form, Select, Cascader, message} from 'antd';
import Tree from 'hermes-treeselect/asynctree';
import ajax from '../../../../common/ajax';
const FormItem = Form.Item;
const Option = Select.Option;

const SelectGoods = React.createClass({
  propTypes: {
    form: PropTypes.object,
    value: PropTypes.array,
    initData: PropTypes.object,
  },

  getDefaultProps() {
    return {
      checked: [],
      merchants: [],
    };
  },

  getInitialState() {
    this.categoryUrl = '/promo/brand/getGoodsName.json';
    this.DateBool = true;
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    this.merchantId = merchantIdInput ? merchantIdInput.value : '';
    return {
      checked: [],
      confirmChecked: [],
      showGoodsModal: false,
      searchInfo: {},
      leftData: [],
      rightData: [],
      searching: false,
      kbBrand: [],
      kbCategory: [],
      goodsDate: [],
      AllgoodsDate: [],
    };
  },
  componentDidMount() {
    this.queryBrandsInfo();
    this.queryCatetoriesInfo();
  },
  componentDidUpdate(prevProps) {
    if (prevProps.form.getFieldValue('goodsIds') === '') {
      this.goodsDate = prevProps.form.getFieldValue('goodsIds');
    }
  },
  onChange(checked) {
    // console.log(checked);
    this.checkedValue = checked;
    this.confirmCheckedArr = checked;
    this.DateBool = false;
    this.setState({checked: checked, confirmCheckedArr: checked});
  },
  getGoodsIds(value, all) {
    const array = [];
    if (value) {
      all.map(p=>{
        const id = p.id;
        (value.split('\n')).map((g)=>{
          if (id === g) {
            array.push(g);
          }
        });
      });
    }
    return array;
  },
  queryBrandsInfo() {
    ajax({
      url: '/goods/ic/queryBrandsInfo.json',
      success: (res) => {
        this.setState({
          kbBrand: res.data,
        });
      },
    });
  },
  queryUnique(list) {
    const result = [];
    list.map((p, index)=>{
      if (result.indexOf(list[index]) === -1 ) {
        result.push(list[index]);
      }
    });
    return result;
  },
  queryMergeWeight() {
    const lastArr = [];
    (this.goodsDate || []).map(p=>{
      if (p !== '') {
        lastArr.push(p);
      }
    });
    const checkedArr = this.state.checked;
    let newArr;
    if (checkedArr.length > 0 && lastArr.length > 0) {
      newArr = this.queryUnique(lastArr.concat(checkedArr));
    } else if ( checkedArr.length === 0 && lastArr.length > 0 ) {
      newArr = lastArr;
    } else if (checkedArr.length > 0 && lastArr.length === 0) {
      newArr = checkedArr;
    } else if (checkedArr.length === 0 && lastArr.length === 0) {
      if (this.DateBool === true) {
        newArr = this.checkedValue;
      } else {
        newArr = [];
      }
    }
    return newArr.join('\n');
  },
  queryCatetoriesInfo() {
    // const params = {...this.props.form.getFieldsValue()};
    ajax({
      url: '/goods/ic/queryCatetoriesInfo.json',
      success: (res) => {
        this.setState({
          kbCategory: res.data,
        });
      },
    });
    ajax({
      url: '/promo/brand/getGoodsName.json',
      data: {brandCode: '', categoryCode: '', pid: this.merchantId},
      success: (res) => {
        const {itemList = []} = res;
        const newGoodsData = itemList.map(item => {
          const {title, extItemCode} = item;
          return {name: title, id: extItemCode};
        });
        this.setState({
          goodsDate: newGoodsData,
          AllgoodsDate: newGoodsData,
        });
      },
    });
  },
  showGoodsModal() {
    const { AllgoodsDate } = this.state;
    const array = this.getGoodsIds(this.props.form.getFieldValue('goodsIds'), AllgoodsDate);
    this.setState({showGoodsModal: true, checked: array});
  },
  search() {
    if (!this.state.searching) {
      this.setState({
        searching: true,
        leftData: [],
      });
    }
  },

  fetch() {
    const params = {...this.props.form.getFieldsValue()};
    params.categoryCode = params.categoryCode[2] || params.categoryCode[1] || params.categoryCode[0];
    return new Promise((resolve)=> {
      ajax({
        url: '/promo/brand/getGoodsName.json',
        data: {brandCode: params.brandCode, categoryCode: params.categoryCode, pid: this.merchantId},
        success: (res) => {
          const {itemList = []} = res;
          const newGoodsData = itemList.map(item => {
            const {title, extItemCode} = item;
            return {name: title, id: extItemCode};
          });
          this.setState({
            searching: false,
            goodsDate: newGoodsData,
          });
          resolve(newGoodsData);
        },
      });
    });
  },

  handleOk() {
    const goodsDate = this.queryUnique((this.goodsDate || []).concat(this.checkedValue));

    if (goodsDate.length > 500) {
      message.error('不能超过500个编码');
    } else {
      const fields = this.props.form.getFieldsValue();
      fields.goodsIds = this.queryMergeWeight();
      this.props.form.setFieldsValue(fields);
      this.setState({showGoodsModal: false, confirmChecked: this.state.checked, checked: []}, () => {
        // this.props.onChange(this.state.checked);
      });
    }
  },

  handleCancel() {
    this.setState({showGoodsModal: false, checked: this.state.confirmChecked});
  },

  render() {
    const { getFieldProps, getFieldValue} = this.props.form;
    const {showGoodsModal, confirmChecked, rightData, leftData, checked, kbBrand, kbCategory, AllgoodsDate} = this.state;
    const goodsIds = getFieldValue('goodsIds');

    const kbBrandOptions = kbBrand.map((data) => {
      return <Option key={data.brandCode} value={data.brandCode}>{data.name}</Option>;
    });
    kbBrandOptions.unshift(<Option key={1} value={''}>全部品牌</Option>);
    this.checkedValue = checked;
    this.confirmCheckedArr = goodsIds === '' ? [] : confirmChecked;

    if (goodsIds && goodsIds.length) {
      this.goodsDate = goodsIds.split('\n');
      const array = [];
      AllgoodsDate.map(p=>{
        const id = p.id;
        (this.goodsDate).map((g, index)=>{
          if (id === g) {
            array.push(g);
            delete this.goodsDate[index];
          }
        });
      });
      this.checkedValue = checked.length > 0 ? checked : array;
      this.confirmCheckedArr = array.length > 0 ? this.checkedValue : [];
    }
    return (
      <span>
        <a onClick={this.showGoodsModal}>+从商品库选择SKU</a>
        {showGoodsModal ? <Modal title="商品库选择SKU" visible width={750}
          className=""
          onOk={() => { this.handleOk(); }} onCancel={() => { this.handleCancel(); }}
        >
        <div style = {{ width: 700, margin: '0 auto' }}>
          <Form form={this.props.form} horizontal>
            <Row>
              <Col span="7">
                <FormItem style={{ paddingRight: 16 }}>
                  <Select {...getFieldProps('brandCode', {initialValue: ''})}>
                    {kbBrandOptions}
                  </Select>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem style={{ paddingRight: 16 }}>
                  <Cascader options={kbCategory} placeholder="请选择类目" {...getFieldProps('categoryCode', {initialValue: ''})} />
                </FormItem>
              </Col>
              <Col span="2">
                <Button type="primary" onClick={() => { this.search(); }} size="large">搜索</Button>
              </Col>
            </Row>
          </Form>
          <Tree
            {...{ rightData, leftData, checked: this.checkedValue, fetch: this.fetch }}
            onChange = { this.onChange }
          />
        </div>
      </Modal> : null}</span>
    );
  },
});

export default Form.create()(SelectGoods);
