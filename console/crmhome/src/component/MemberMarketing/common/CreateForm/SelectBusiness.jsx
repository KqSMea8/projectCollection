import React, {PropTypes} from 'react';
import { Row, Col, Input, Button, Modal, Form, Select } from 'antd';
import Tree from 'hermes-treeselect/asynctree';
import ajax from '../../../../common/ajax';
const FormItem = Form.Item;
const Option = Select.Option;

const SelectBusiness = React.createClass({
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
    return {
      checked: this.props.value || [],
      confirmChecked: this.props.value || [],
      showShopModal: false,
      searchInfo: {},
      cityNames: [''],
      industryNames: [''],
      leftData: [],
      rightData: [],
      searching: false,
    };
  },

  componentDidMount() {
    ajax({
      url: '/goods/discountpromo/getCityIndustryInfo.json',
      success: (res) => {
        const {cityNames, industryNames} = res;
        this.setState({
          cityNames: ['', ...cityNames],
          industryNames: ['', ...industryNames],
        });
      },
    });
  },

  onChange(checked) {
    console.log(checked);
    this.setState({
      checked,
    });
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
    return new Promise((resolve)=> {
      ajax({
        url: '/goods/discountpromo/getRetailers.json',
        data: {displayName: params.displayName, cityName: params.cityName, industryName: params.industryName},
        success: (res) => {
          const {retailers = []} = res;
          this.setState({searching: false});
          const newShopsData = retailers.map(item => {
            const {cardNo, name} = item;
            return {name, id: cardNo};
          });
          resolve(newShopsData);
        },
      });
    });
  },

  handleOk() {
    const checked = (this.state.checked).length !== 0 ? this.state.checked : this.props.value;
    this.setState({showShopModal: false, confirmChecked: checked}, () => {
      this.props.onChange(checked);
    });
  },

  handleCancel() {
    this.setState({showShopModal: false, checked: this.state.confirmChecked});
  },

  render() {
    const { getFieldProps } = this.props.form;
    const { displayStatus } = this.props.initData;
    const { cityNames, industryNames, showShopModal, rightData, leftData} = this.state;
    const confirmChecked = this.props.value;
    const checked = (this.state.checked).length !== 0 ? this.state.checked : this.props.value;
    return (
      <div>
        {confirmChecked.length ? <span style={{marginRight: 10}}>已选{confirmChecked.length}家</span> : null}
        {
          this.props.isDisabled || displayStatus === 'STARTED' ? null :
            <a onClick={() => { this.setState({showShopModal: true}); }}>
              {confirmChecked.length ? '新增商家' : '配置商家'}
            </a>
        }
       {showShopModal ? <Modal title={confirmChecked.length ? '新增商家' : '配置商家'} visible width={750}
          className=""
          onOk={() => { this.handleOk(); }} onCancel={() => { this.handleCancel(); }}
        >
        <div style = {{ width: 700, margin: '0 auto' }}>
          <Form form={this.props.form} horizontal>
            <Row>
              <Col span="7">
                <FormItem style={{ paddingRight: 16 }}>
                  <Input {...getFieldProps('displayName')} placeholder="搜索" />
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem style={{ paddingRight: 16 }}>
                  <Select {...getFieldProps('cityName', {initialValue: ''})}>
                    {cityNames.map(city => <Option key={city} value={city}>{city || '全国'}</Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem style={{ paddingRight: 16 }}>
                  <Select {...getFieldProps('industryName', {initialValue: ''})}>
                    {industryNames.map(trade => <Option key={trade} value={trade}>{trade || '全部行业'}</Option>)}
                  </Select>
                </FormItem>
              </Col>
              <Col span="2">
                <Button type="primary" onClick={() => { this.search(); }} size="large">搜索</Button>
              </Col>
            </Row>
          </Form>
          <Tree
            {...{ rightData, leftData, checked, fetch: this.fetch }}
            onChange = { this.onChange }
          />
        </div>
      </Modal> : null}</div>
    );
  },
});

export default Form.create()(SelectBusiness);
