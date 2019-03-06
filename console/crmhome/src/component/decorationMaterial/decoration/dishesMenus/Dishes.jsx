import React, {PropTypes} from 'react';
import {Button, Radio, Select} from 'antd';
import DishList from './DishList';
import {SearchInput} from 'hermes-react';
import ajax from '../../../../common/ajax';
import {getMerchantId, getCategoryId} from '../../common/utils';

const Option = Select.Option;
const RadioGroup = Radio.Group;

const Dishes = React.createClass({
  propTypes: {
    setButton: PropTypes.func,
  },
  getInitialState() {
    this.merchantId = getMerchantId();
    return {
      hasDishes: false,
      sourceValue: '',
      searchName: '',
      reviewState: '1',
      batchMode: false,
      hasMenus: true,
    };
  },
  componentDidMount() {
    this.setButton();
    this.fetchMenus();
  },
  componentDidUpdate(prevProps, prevState) {
    const {hasDishes, batchMode} = this.state;
    if (prevState.hasDishes !== hasDishes
      || prevState.batchMode !== batchMode) {
      this.setButton();
    }
  },
  setButton() {
    const {setButton} = this.props;
    const {batchMode} = this.state;
    const button = (!batchMode ? <div style={{position: 'absolute', top: 0, right: 16, zIndex: 1}}>
      <Button type="primary" onClick={this.addDish}>添加菜品</Button>
    </div> : null);
    setButton(button);
  },
  setDishes(hasDishes) {
    this.setState({
      hasDishes,
    });
  },
  fetchMenus() {
    const params = {
      pageNo: 1,
      pageSize: 1,
    };
    if (this.merchantId) params.op_merchant_id = this.merchantId;
    ajax({
      url: '/shop/kbmenu/pageQuery.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (result.status === 'success') {
          this.setState({
            hasMenus: !!result.totalSize,
          });
        }
      },
    });
  },
  addDish() {
    window.location.hash = '/decoration/' + getCategoryId() + '/menu/dish-create';
  },
  goToMenus() {
    window.location.hash = 'decoration/' + getCategoryId() + '/menu/menu';
  },
  startBatch() {
    this.setState({
      batchMode: true,
    });
  },
  endBatch() {
    this.setState({
      batchMode: false,
    });
  },
  sourceChange(v) {
    this.setState({
      sourceValue: v,
    });
  },
  nameSearch(v) {
    this.setState({
      searchName: v,
    });
  },
  reviewChange(e) {
    if (e.target.value !== this.state.reviewState) {
      this.setState({
        reviewState: e.target.value,
        batchMode: false,
      });
    }
  },
  render() {
    const {sourceValue, searchName, reviewState, batchMode} = this.state;
    let listContent;
    listContent = (<DishList
      sourceValue={sourceValue}
      searchName={searchName}
      reviewState={reviewState}
      batchMode={batchMode}
      endBatch={this.endBatch}
      setDishes={this.setDishes} />);
    return (<div>
      <div className="content-head" style={{height: '30'}}>
        <div className="dish-search-select">
          <Select defaultValue="" style={{width: 120}} onChange={this.sourceChange}>
            <Option value="">全部来源</Option>
            <Option value="mer">商户</Option>
            <Option value="import">外部</Option>
          </Select>
          <SearchInput placeholder="菜品名称" onSearch={this.nameSearch} style={{width: 200, marginLeft: 15}} />
        </div>
        <span className="dish-review-select">
          <RadioGroup defaultValue={reviewState} onChange={this.reviewChange}>
            <Radio value="1">审核通过</Radio>
            <Radio value="0">审核不通过</Radio>
          </RadioGroup>
        </span>
      </div>
      {listContent}
    </div>);
  },
});

export default Dishes;
