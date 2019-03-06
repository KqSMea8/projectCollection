import React, { PropTypes } from 'react';
import { Button, Modal, Spin, message } from 'antd';
import { TreeSelect } from 'hermes-react';
import { getImageById } from '../../../common/utils';

const greyImg = 'https://gw.alipayobjects.com/zos/rmsportal/LbKuRAGokvUOxBHgBHAa.png';

/**
 * 添加商品 控件
 */

class AddGoodsModal extends React.Component {
  static propTypes = {
    checked: PropTypes.array,
    goodsList: PropTypes.array,
    fetchGoodsList: PropTypes.func,
    disabled: PropTypes.array,
    selectGoods: PropTypes.func,
    selectAGoods: PropTypes.func,
    cancelGoods: PropTypes.func,
    max: PropTypes.number,
    isChooseAGoods: PropTypes.bool,
  };
  static defaultProps = {
    checked: [],
    disabled: [],
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: props.isChooseAGoods,
      values: [],
      goodsList: props.goodsList,
    };
  }

  componentDidMount() {
    this.checkStartFetch();
  }

  onChange = (ids) => {
    if (this.props.isChooseAGoods) {
      this.setState({
        values: ids,
        visible: false,
      });
      this.props.selectAGoods(this.state.goodsList.filter(item => item.itemId === ids[0])[0]);
      return;
    }
    this.setState({
      values: ids,
    });
  }

  checkStartFetch = () => {
    if (this.state.visible && this.props.fetchGoodsList) {
      this.setState({ fetching: true });
      this.props.fetchGoodsList().then(goodsList => {
        this.setState({
          goodsList,
          fetching: false,
        });
      });
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    }, () => {
      this.checkStartFetch();
    });
  }
  handleOk = () => {
    const { max } = this.props;
    const { values } = this.state;
    if (max && max < values.length) {
      message.warning(`最多选择${max}个商品`);
    } else if (values.length === 0) {
      message.warning('请选择商品');
    } else {
      this.setState({
        visible: false,
      });
      this.props.selectGoods(values);
    }
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
    if (this.props.isChooseAGoods) {
      this.props.cancelGoods();
    }
  }
  nodeText = (node, isRight) => {
    let rtn = false;
    if (node) {
      const nodeDom = (<div className="treeselect-itme">
        <div className="treeselect-img">
          {node.model.logo && <img src={getImageById(node.model.logo)} onError={e => e.target.src !== greyImg && (e.target.src = greyImg)} />}
        </div>
        <div className="goods-text1">
          <span className="goods-title1">{node.model.itemName}</span>
          <span className="goods-price1">{node.model.price}</span>
          <span className="goods-originalprice">{node.model.originalPrice}</span>
          <span className="goods-gray">{node.model.itemId}</span>
        </div>
      </div>);
      if (isRight) {
        if (node.id === '#') {
          rtn = (<span>已选 ({`${node.checked().length}`})</span>);
        } else if (node.isLeaf()) {
          rtn = nodeDom;
        }
      } else if (node.id === '#') {
        rtn = (<span>全选 共({`${node.leafs().length}`})</span>);
        if (this.props.isChooseAGoods) rtn = '';
      } else if (node.isLeaf()) {
        rtn = nodeDom;
      }
    }
    return rtn;
  }
  render() {
    const { disabled, checked, isChooseAGoods } = this.props;
    const { goodsList, fetching } = this.state;
    return (
      <div>
        {!isChooseAGoods && <div className="head-text">
          <span className="gray-text">口碑app和支付宝口碑tab中的品牌页，商品排序与下列表格一致</span>
          <Button type="primary" onClick={this.showModal}>添加商品</Button>
        </div>}
        <Modal title="选择要添加的商品" visible={this.state.visible}
          width="750"
          onOk={this.handleOk} onCancel={this.handleCancel}
          footer={[
            <Button style={{ float: 'left', marginLeft: 10 }} key="create" type="primary" size="large"
              onClick={() => window.location.href = '#/catering/list'}>
              新建商品
            </Button>,
            <span key="text" style={{ float: 'left', color: '#999', marginLeft: 10, marginTop: 5 }}>
              前往“商品管理”中设置
            </span>,
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取 消</Button>,
            !isChooseAGoods && <Button key="submit" type="primary" size="large" onClick={this.handleOk} disabled={!this.state.values.length}>
              确 定
            </Button>,
          ]}
        >
          {fetching && <div style={{ textAlign: 'center', height: 400, paddingTop: 190 }}><Spin /></div>}
          {!fetching && goodsList && goodsList.length === 0 && <div style={{ textAlign: 'center', height: 400, paddingTop: 190, fontSize: 20 }}>
            没有可以添加的商品
          </div>}
          {!fetching && goodsList && goodsList.length > 0 && <div className="goods-treeselect">
            <TreeSelect
              treeData={goodsList}
              checked={checked}
              disabled={disabled}
              defaultExpandLevel={1}
              onlyLeft={isChooseAGoods}
              showCheckAll={!isChooseAGoods}
              nodeText={this.nodeText}
              onChange={this.onChange}
            />
          </div>}
        </Modal>
      </div>
    );
  }
}

export default AddGoodsModal;
