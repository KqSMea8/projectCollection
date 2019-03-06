import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { page as wrapper } from '@alipay/page-wrapper';
import { List, Icon, Result } from '@alipay/qingtai';
import { openPage, popPage } from '@alipay/kb-m-biz-util';
import store from './store';
import spmConfig from './spm.config';
import './style.less';

@wrapper({ store, spmConfig })
class Index extends PureComponent {
  onClickItem(item) {
    popPage(item);
  }

  componentDidMount() {
    kBridge.call('setOptionButton', {
      items: [{ title: '新增' }],
      onClick: this.openAddPage.bind(this),
    });
  }

  openAddPage() {
    const { dispatch, merchantId } = this.props;
    openPage({
      url: 'tka-visit-add-visit-sub-company-add.html',
      data: {
        merchantId,
      },
    }, () => dispatch({ type: 'reloadList' }));
  }

  render() {
    const { initData, chooseId } = this.props;
    const checkExtra = <Icon type="check" color="#108EE9" />;
    return (<List className="visit-sub-company-page">
      {initData && initData.list.map((item, index) => (
        <List.Item onClick={this.onClickItem.bind(this, item)}
          extra={String(item.id) === chooseId && checkExtra}
          key={index}
          wrap>
          {item.name}
        </List.Item>
      ))}
      {initData && initData.list.length === 0 && <Result title="列表为空，请先添加"
        imgUrl="https://os.alipayobjects.com/rmsportal/wtGDSpzccjsKiaS.png"
        buttonText="点击添加"
        onButtonClick={this.openAddPage.bind(this)} />}
            </List>);
  }
}

kBridge.ready(() => {
  ReactDOM.render(
    <Index />,
    document.querySelector('main'),
  );
});
