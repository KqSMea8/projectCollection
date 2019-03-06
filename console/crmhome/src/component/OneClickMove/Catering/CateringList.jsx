import React from 'react';
import { Row, Col } from 'antd';
import ajax from '../../../common/ajax';
import './CateringList.less';
import CaterinForm from './CateringForm';
import CateringTable from './CateringTable';

const node = document.getElementById('J_isFromKbServ');
const isIframe = window.top !== window && node && node.value === 'true';
class CateringList extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      params: '',
      options: [],
      categoryOptions: [],
      ProfessionValue: '', // 所属行业
    };
  }

  componentDidMount() {
    ajax({
      url: '/goods/caterItem/queryItemListFilterStatus.json',
      success: res => {
        if (res.status === 'succeed') {
          const options = Object.keys(res.filterStatus || {}).map(key => ({ key, name: res.filterStatus[key] }));
          this.setState({
            options: [{ key: '', name: '全部状态' }, ...options],
            isFetchingOptions: false,
          });
        }
      },
      err: () => { this.setState({ isFetchingOptions: false }); },
    });

    // 行业类目categorySelectorOnChange
    ajax({
      url: '/goods/caterItem/queryIndustryList.json',
      success: res => {
        if (res.status === 'succeed') {
          res.data.industries.unshift({
            code: 'ALL',
            name: '全部',
          });
          this.setState({
            categoryOptions: res.data.industries,
          });
        }
      },
      err: () => { this.setState({ isFetchingOptions: false }); },
    });
  }

  onSearch = (params) => {
    this.setState({
      params,
    });
  }

  getProfessionValue = (value) => {
    this.setState({
      ProfessionValue: value,
    });
  }

  render() {
    return (
      <div>
        {!isIframe && (
          <div className="app-detail-header" style={{ position: 'relative' }}>
            商品管理
          </div>
        )}
          <div className="kb-detail-main catering-list">
            <CaterinForm
              onSearch={this.onSearch}
              options={this.state.options}
              getProfessionValue={this.getProfessionValue}
              categoryOptions={this.state.categoryOptions}
            />

            <Row>
              <Col span={24}>
                <CateringTable
                  params={this.state.params}
                />
              </Col>
              {this.state.ProfessionValue === 'SERV_INDUSTRY' ? <div>
                <p>若列表中未找到你名下已有的商品，获取更多商品内容，</p>
                <a href="#/stuff/order">可点此查看其他商品服务工具</a>
              </div> : null}
            </Row>
          </div>
      </div>
    );
  }
}

export default CateringList;
