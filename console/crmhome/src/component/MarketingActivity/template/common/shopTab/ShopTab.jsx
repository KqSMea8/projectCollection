import React, {PropTypes} from 'react';
import {Tabs, Tooltip, Modal, message} from 'antd';
import ShopSelectBox from './ShopSelectBox';
// import ShopUploadBox from './ShopUploadBox';
// import {getCurrentPickedShop} from './utils';
// import './ShopAreaBox.less';

const TabPane = Tabs.TabPane;

/**
 * 口碑商户报名 - 门店tab
 * 文素能
 */
function parse(arr = []) {
  const newArr = [];
  arr.map((lvl1) =>{
    const shops = lvl1.shops || [];
    if (shops.length > 0) {
      shops.map(v => newArr.push({id: v.id}));
    }
  });
  return newArr;
}
const ShopTabs = React.createClass({

  propTypes: {
    isEdit: PropTypes.bool,
    selectedShops: PropTypes.array,
    shopUrl: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    cityUrl: PropTypes.string,
    categoryUrl: PropTypes.string,
    canReduce: PropTypes.bool, // 修改
    form: PropTypes.object,
    // userData: PropTypes.object,
    initialData: PropTypes.object,
    pickedShop: PropTypes.array, // 用户选择的门店
    disabledFunciton: PropTypes.string, // 门店互斥功能（当传入值为false,表示无互斥功能，否则存在互斥功能）
    actityType: PropTypes.string, // 活动类型
  },

  getInitialState() {
    let selectedShops = parse(this.props.selectedShops);
    selectedShops = selectedShops.map((d) => d.id).length;
    return {
      disabledTabs: [],
      checkedShopQuatity: selectedShops, // 用户选择的门店数量
      activeTab: 'select',
    };
  },

  componentDidUpdate(prevProps) {
    const { selectedShops } = this.props;
    if (prevProps.selectedShops.length !== 0 && selectedShops.length === 0) {
      if (selectedShops !== prevProps.selectedShops) {
        this.resetData(selectedShops);
      }
    }
  },

  onShopSelectFunction(shop = []) {
    // 置灰门店上传tab
    const pickedShop = shop.length;
    if (pickedShop > 0) {
      this.setState({
        disabledTabs: ['upload'],
      });
    } else {// 取消置灰
      this.setState({
        disabledTabs: [],
      });
    }
  },

  onShopUploadFunction(uploadFile) {
    // 置灰手动选择门店tab
    if (uploadFile > 0) {
      this.setState({
        disabledTabs: ['select'],
      });
    } else {// 取消置灰
      this.setState({
        disabledTabs: [],
      });
    }
  },

  resetData(list) {
    if (list.length === 0) {
      this.setState({
        checkedShopQuatity: [],
      });
    }
  },

  uploadFileSuccess(val) {
    this.setState({
      uploadStatu: val,
    });
  },
  handleChange(key) {
    this.setState({activeTab: key});
  },
  showModal() {
    this.setState({
      visible: true,
    });
  },
  validateCheck() {// 检测是否选择门店
    let bool = true;
    let data;
    const all = this.props.form.getFieldsValue();
    const checked = all.selecshop || [];
    const activeTab = this.state.activeTab;// 当前选中的tab
    if (activeTab === 'select') {// 手动选择
      bool = checked.length > 0 ? false : true;
      data = {
        checked,
        checkedShopQuatity: checked.length,
        shopType: 'select',
      };
    } else {
      // 文件上传
      const {uploadStatu} = all;
      bool = !uploadStatu.hasUpload;
      data = {
        logId: uploadStatu.logId,
        checkedShopQuatity: uploadStatu.shopTotalCnt,
        shopType: 'upload',
      };
    }
    return {data, error: bool, activeTab};
  },
  handleOk() {
    // 回传上层数据
    const modalData = this.validateCheck();
    const {data, error, activeTab} = modalData;
    const index = [];
    if (error) {
      message.error('请选择或者上传门店');
      return;
    }
    if (activeTab === 'select') {
      this.props.onChange(data);
      data.checked.map((p) => {
        p.shops.map((s) => {
          index.push(s.id);
        });
      });
    } else {
      this.props.onChange(data);
    }
    this.setState({
      visible: false,
      checkedShopQuatity: activeTab === 'select' ? index.length : data.checkedShopQuatity,
    });
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
  },

  render() {
    const {disabledTabs} = this.state;
    const defaultActiveKey = 'select';
    const { checkedShopQuatity } = this.state;
    const { isEdit, canReduce } = this.props;
    // const checkedShopIds = checked.map((d) => d.id);
    const {getFieldProps} = this.props.form;
    const selectTab = (<TabPane tab="选择门店" key="select" disabled={disabledTabs.indexOf('select') !== -1}>
            <ShopSelectBox {...getFieldProps('selecshop')}{...this.props}
            onShopSelectFunction={(val)=>{this.onShopSelectFunction(val);}}/>
          </TabPane>);
    // const uploadTab = (<TabPane tab="上传门店列表" key="upload" disabled={disabledTabs.indexOf('upload') !== -1}>
    //         <ShopUploadBox {...this.props}
    //                                     uploadFileSuccess={(val)=>{this.uploadFileSuccess(val);}}
    //                                    onShopUploadFunction={(value) => {this.onShopUploadFunction(value);}} />
    //       </TabPane>);
    const tabArray = [selectTab];
    return (<div>
       {/*eslint-disable */
          checkedShopQuatity > 0 ? 
          (<span>已选择{checkedShopQuatity}家门店<a style={{ marginLeft: '16px' }}
            onClick={this.showModal}>{isEdit && canReduce ? '修改' : isEdit && !canReduce ? '新增' : '查看'}</a></span>)
            : (<a onClick={this.showModal}>选择门店</a>)
          /*eslint-enable */
      }
      <Modal title="活动门店"
          closable={false}
          onOk={this.handleOk} onCancel={this.handleCancel}
          visible={this.state.visible}
          width={700}>
      <div className="single-voucher-wrapper">
        { // 由于tabs 在disabled时无法加hover事件, 也没有tabOnClick事件，这里只能在外部放一个正方形，实现Tab 在disabled的时候hover特效
          disabledTabs.indexOf('select') !== -1 && <div className="hover-for-tab"><Tooltip title="删除上传文件方可点击"><div className="hover-tab-left">选择门店</div></Tooltip></div>
        }
        { // 由于tabs 在disabled时无法加hover事件, 也没有tabOnClick事件，这里只能在外部放一个正方形，实现Tab 在disabled的时候hover特效
          disabledTabs.indexOf('upload') !== -1 && !isEdit ? <div className="hover-for-tab"><div className="hover-tab-left">选择门店</div><Tooltip title="取消已经选择门店方可点击"><div className="hover-tab-left">上传门店</div></Tooltip></div>
          : null
        }
        <Tabs defaultActiveKey={defaultActiveKey} style={{minHeight: 300}} onChange={(val) => {this.handleChange(val);}}>
          {tabArray}
        </Tabs>
      </div></Modal>
      </div>);
  },
});

export default ShopTabs;
