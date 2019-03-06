import React from 'react';
import TreeModal from '../../src/component/MemberMarketing/common/TreeModal';
import city from './city.json';
import shop from './shop.json';

class TreeModalSpec extends React.Component {
  state = {
    treeData: [],
    checkedSymbols: [],
    visible: false,
  }

  componentWillMount() {
    const children = shop.shopComps.map(({ shopName, shopId }, i) => ({
      name: shopName,
      symbol: shopId,
      disabled: i === 0 ? true : false,
    }));
    const treeData = city.shopCountGroupByCityVO.map(({ cityCode, cityName, shopCount }, i) => ({
      name: cityName,
      symbol: cityCode,
      children: i === 0 ? children : [],
      count: shopCount,
      disabled: i === 1 ? true : false,
    }));
    const checkedSymbols = [shop.shopComps[0].shopId];
    setTimeout(() => this.setState({ treeData, checkedSymbols }), 500);
  }

  loadChildren(symbol) {
    console.log(symbol);
    return new Promise((resolve) => {
      setTimeout(() => {
        const children = shop.shopComps.map(({ shopName, shopId }) => ({
          name: shopName,
          symbol: `${symbol}-${shopId}`,
        }));
        resolve(children);
      }, 500);
    });
  }

  render() {
    const { treeData, checkedSymbols, visible } = this.state;
    const props = {
      defaultTreeData: treeData,
      defaultCheckedSymbols: checkedSymbols,
      loadChildren: ::this.loadChildren,
      visible,
      modalProps: {
        title: '门店选择',
        onOk: symbols => this.setState({ checkedSymbols: symbols, visible: false }),
        onCancel: () => this.setState({ visible: false }),
      },
    };
    const label = checkedSymbols.length ? `${checkedSymbols.length} 家门店` : '查看门店';
    return (
      <tree-modal-spec>
        <a href="#" onClick={e => {
          e.preventDefault();
          this.setState({ visible: true });
        }}>{label}</a>
        {treeData.length > 0 && <TreeModal { ...props } />}
      </tree-modal-spec>
    );
  }
}

export default TreeModalSpec;
