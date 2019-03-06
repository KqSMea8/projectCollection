import React from 'react';
import { Tabs, Select, message, Spin, Icon } from 'antd';
import DishesMenus from './dishesMenus/DishesMenus';
import ShopEnvironment from './shopEnvironment/ShopEnvironment';
import NormalList from './CommonPanel/list';
import ServiceInfo from './ServiceInfo/ServiceInfo';
import CoverPicture from './CoverPicture/CoverPicture';
import ajax from '../../../common/ajax';
import { getMerchantId } from '../common/utils';
import ErrorPage from '../../index/common/ErrorPage';
import { isFromKbServ } from '../../../common/utils';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const Decoration = React.createClass({
  getInitialState() {
    const { categoryId, type } = this.props.params;
    this.merchantId = getMerchantId();
    window.parent.postMessage({ showPidSelect: true }, '*');
    return {
      loading: true,
      categoryList: {},
      tabList: [],
      categoryId: '',
      tabKey: '',
      defaultCategoryId: /^\d+$/.test(categoryId) ? categoryId : '',
      defaultTabKey: (/^\d+$/.test(categoryId) ? type : categoryId) || '',
      errorInfo: false,
    };
  },

  componentDidMount() {
    this.fetchCategory();
  },

  onCategoryChange(id) {
    const { tabKey } = this.state;
    this.setState(
      {
        categoryId: id,
      },
      () => {
        this.changeTab(tabKey);
      }
    );
  },

  onTabChange(key) {
    const { categoryId } = this.state;
    window.parent.postMessage({ showPidSelect: key !== 'brandStory' }, '*');
    if (key === 'brandStory') {
      this.jump(
        this.merchantId
          ? `/shop/brandStory/query.htm?op_merchant_id=${this.merchantId}`
          : '/shop/brandStory/query.htm'
      );
      return;
    }
    if (key === 'menu' && /decoration\/\w+\/menu\/dish/.test(window.location.hash)) {
      window.location.hash = `/decoration/${categoryId}/menu/dish`;
    } else if (key === 'menu' && /decoration\/\w+\/menu\/menu/.test(window.location.hash)) {
      window.location.hash = `/decoration/${categoryId}/menu/menu`;
    } else {
      window.location.hash = `/decoration/${categoryId}/${key}`;
    }
    this.setState({
      tabKey: key,
    });
  },

  changeTab(key) {
    const { categoryId, categoryList } = this.state;
    const availableCategoryList = categoryList[categoryId].filter(v => v.type !== 'NONE');
    if (
      key &&
      availableCategoryList
        .concat('cover', 'environment', 'service')
        .some(v => v === key || v.type === key)
    ) {
      this.onTabChange(key);
    } else {
      this.onTabChange('cover');
    }
  },

  groupCategory(list) {
    const cateList = {};
    if (list && list.length) {
      list.forEach(item => {
        const { typeName, name, id } = item;
        const type = item.type === 'DISH' ? 'menu' : item.type;
        if (cateList[type]) {
          cateList[id].push({ name, type, typeName });
        } else {
          cateList[id] = [{ name, type, typeName }];
        }
      });
    }
    return cateList;
  },

  fetchCategory() {
    const { defaultCategoryId, defaultTabKey } = this.state;
    ajax({
      url: this.merchantId
        ? `/queryRootCategoryList.json.kb?op_merchant_id=${this.merchantId}`
        : '/queryRootCategoryList.json',
      type: 'json',
      success: res => {
        if (res.status === 'succeed') {
          const result = res.result;
          this.setState(
            {
              loading: false,
              categoryId:
                defaultCategoryId && result.some(v => v.id === defaultCategoryId)
                  ? defaultCategoryId
                  : result[0].id,
              categoryList: this.groupCategory(result),
            },
            () => {
              this.changeTab(defaultTabKey);
            }
          );
        } else {
          message.error(res.resultMsg);
        }
      },
      error: (_, msg) => {
        if (isFromKbServ()) {
          this.setState({ errorInfo: msg, loading: false });
        } else {
          message.error(msg);
        }
      },
    });
  },

  jump(href) {
    window.location.href = href; // eslint-disable-line no-location-assign
  },

  gainErroInfo() {
    const { errorInfo } = this.state;
    if (errorInfo) {
      return <ErrorPage desc={errorInfo} />;
    }
    return false;
  },

  render() {
    const {
      loading,
      categoryList,
      categoryId,
      defaultCategoryId,
      tabKey,
      defaultTabKey,
    } = this.state;
    const categoryIdList = Object.keys(categoryList);
    const tabList = categoryList[categoryId] || [];
    const errorInfo = this.gainErroInfo();
    if (errorInfo) {
      return errorInfo;
    }

    let tabs = [
      <TabPane tab="封面图" key="cover">
        <CoverPicture />
      </TabPane>,
    ];
    if (tabList.length) {
      tabList.forEach(item => {
        const { typeName, type } = item;
        if (type !== 'NONE') {
          if (type === 'menu') {
            tabs.push(
              <TabPane tab={typeName} key={type}>
                <DishesMenus />
              </TabPane>
            );
          } else {
            tabs.push(
              <TabPane tab={typeName} key={type}>
                <NormalList
                  categoryId={categoryId || defaultCategoryId}
                  typeName={typeName}
                  type={type}
                />
              </TabPane>
            );
          }
        }
      });
    }
    tabs = tabs.concat([
      <TabPane tab="门店环境" key="environment">
        <ShopEnvironment />
      </TabPane>,
      <TabPane tab="服务信息" key="service">
        <ServiceInfo />
      </TabPane>,
      <TabPane tab="品牌故事" key="brandStory" />,
    ]);
    const content = tabList.length ? (
      <Tabs
        defaultActiveKey={tabKey || defaultTabKey}
        onChange={this.onTabChange}
        destroyInactiveTabPane
        className="decorate-tabs"
      >
        {tabs}
      </Tabs>
    ) : (
      <div className="no-category">
        <p>
          <Icon style={{ fontSize: 24, paddingRight: 5, verticalAlign: 'middle' }} type="meh" />
          <span style={{ verticalAlign: 'middle' }}>请先选择一个一级品类</span>
        </p>
      </div>
    );
    return (
      <div>
        <div className="app-detail-header" style={{ borderBottom: 'none' }}>
          <p>门店内容</p>
          {!loading && categoryIdList.length ? (
            <Select
              defaultValue={categoryId || defaultCategoryId}
              showSearch
              style={{ width: 145, marginTop: 12, marginLeft: this.merchantId ? 280 : 0 }}
              placeholder="请选择一级品类"
              optionFilterProp="children"
              size="large"
              onChange={this.onCategoryChange}
            >
              {categoryIdList.map(k => {
                const { name } = categoryList[k][0];
                return (
                  <Option key={k} value={k}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          ) : (
            <Spin style={{ marginTop: isFromKbServ() ? 70 : 0 }} />
          )}
        </div>
        {!loading ? content : null}
      </div>
    );
  },
});

export default Decoration;
