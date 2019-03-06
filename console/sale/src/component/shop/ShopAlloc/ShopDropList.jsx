import React from 'react';
import { Alert, Cascader, Button, Spin, message } from 'antd';
import ShopDropDateModal from '../common/ShopDropDateModal';
import ShopDropRuleModal from '../common/ShopDropRuleModal';
import {format} from '../../../common/dateUtils';
import ErrorPage from '../../../common/ErrorPage';
import permission from '@alipay/kb-framework/framework/permission';
import ajax from '../../../common/utility/ajax';
import './ShopAlloc.less';

export default class ShopDropList extends React.Component {
  constructor() {
    super();
    const defaultDateRange = this.getDefaultDateRange();
    this.state = {
      params: {
        gmtCreateStart: defaultDateRange[0],
        gmtCreateEnd: defaultDateRange[1],
      },
      defaultDateRange,
      dateShow: false,
      ruleShow: false,
      cityOptions: [],
      cityCode: [],
      loading: true,
      initFallRuleData: {noTrade: 'NONE', noVisit: 'NONE'},
    };
  }

  componentDidMount() {
    this.getCities();
  }

  onCityChange = (value) => {
    this.setState({
      cityCode: value,
    });
    this.initFallRule(value[1]);
  }

  getCities() {
    ajax({
      url: `${window.APP.kbsalesUrl}/queryManagedCityList.json`,
      success: (result) => {
        if (result.status === 'succeed' && result.data) {
          const {data} = result;
          const options = [];
          this.loop(data, options);
          this.setState({
            loading: false,
            cityOptions: options,
            cityCode: options[0] && [options[0].value, options[0].children[0].value],
          });
          this.initFallRule(options[0].children[0].value);
        }
      },
      error: (result) => {
        message.error(result && result.resultMsg || '系统异常');
      },
    });
  }

  getDefaultDateRange = () => {
    const now = new Date();

    // 确定开始时间为截止时间前30天
    const dayTime = 24 * 60 * 60 * 1000;
    const gmtCreateStart = format(new Date(now.getTime() - 30 * dayTime));

    // 确定结束时间为当前时间前一天
    const gmtCreateEnd = format(new Date(now.getTime() - dayTime));

    return [new Date(gmtCreateStart), new Date(gmtCreateEnd)];
  }

  initFallRule = (cityCode) => {
    ajax({
      url: `${window.APP.kbsalesUrl}/shop/queryFallRule.json`,
      method: 'get',
      data: {cityCode},
      success: (result) => {
        if (result.status === 'succeed' && result.data) {
          const {data} = result;
          this.setState({
            initFallRuleData: data,
          });
        }
      },
      error: (result) => {
        message.error(result && result.resultMsg || '系统异常');
      },
    });
  }

  loop(data, options) {
    return data.map(item => {
      const option = {};
      const cities = [];
      option.value = item.i;
      option.label = item.n;
      if (item.c.length) {
        this.loop(item.c, cities);
        option.children = cities;
      }
      options.push(option);
    });
  }

  dropDownload = () => {
    this.setState({ dateShow: true });
  }

  cancelDate = () => {
    this.setState({ dateShow: false });
  }

  cancelRule = () => {
    this.setState({ ruleShow: false });
  }

  compileRule = (e) => {
    e.preventDefault();
    this.setState({
      ruleShow: true,
    });
  }

  render() {
    const { defaultDateRange, dateShow, ruleShow, cityOptions, cityCode, loading, initFallRuleData } = this.state;
    if (permission('FALL_RULE_QUERY')) {
      if (loading) {
        return (
          <div style={{ paddingTop: '100px', textAlign: 'center' }}>
            <Spin />
          </div>
        );
      }
      return (<div>
          <Alert message="城市服务商名下满足掉落规则的门店将掉落到城市经理的名下。TKA和RKA门店不会掉落。拜访与动销时间从17年4月1号开始计算。掉落规则修改后第二天执行掉落。" type="info" showIcon />
          <div>
            <div style={{marginTop: 20}}>
              区域：
              <Cascader
                allowClear={false}
                style={{width: 230}}
                placeholder="省/市"
                onChange={this.onCityChange}
                options={cityOptions}
                defaultValue={cityCode} />
            </div>
            <div className="shop-drop">
              <h3>掉落规则</h3>
              <div style={{float: 'right'}}>
                {permission('FALL_SHOP_QUERY') && <Button type="primary" style={{marginRight: 10}} onClick={this.dropDownload}>下载掉落的门店</Button>}
                {permission('FALL_RULE_CONFIG') && <Button type="primary" onClick={this.compileRule}>编辑规则</Button>}
              </div>
            </div>
           <div>
              <table className="kb-detail-table-2">
                <tbody>
                  <tr>
                    <td className="kb-detail-table-label" style={{textAlign: 'center'}}>无动销掉落门店规则</td>
                    <td>{initFallRuleData.noTrade === 'NONE' ? '不掉落' : `${initFallRuleData.noTrade}天掉落`}</td>
                  </tr>
                  <tr>
                    <td className="kb-detail-table-label" style={{textAlign: 'center'}}>无拜访门店掉落规则</td>
                    <td>{initFallRuleData.noVisit === 'NONE' ? '不掉落' : `${initFallRuleData.noVisit}天掉落`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ShopDropDateModal
            defaultDateRange={defaultDateRange}
            onCancelDate={this.cancelDate}
            dateShow={dateShow}
            cityCode={cityCode} />
          <ShopDropRuleModal
            onCancelRule={this.cancelRule}
            ruleShow={ruleShow}
            cityCode={cityCode}
            initFallRuleData={initFallRuleData}
            initFallRule={this.initFallRule}/>
      </div>);
    }
    return <ErrorPage type="permission"/>;
  }
}
