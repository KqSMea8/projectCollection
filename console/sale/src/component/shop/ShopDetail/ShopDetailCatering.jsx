import React from 'react';
import { Spin } from 'antd';
import { DetailTable } from 'hermes-react';
import { Block } from '@alipay/kb-biz-components';
import fetch from '@alipay/kb-fetch';

const AMap = window.AMap;

class ShopDetailCatering extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    fetch({
      url: 'kbscprod.deliveryStationQueryService.queryDeliveryStation', // 网关 bizType
      param: { shopId: this.props.id }, // 对应统一网关入参的 requestData
      devServer: 'kbscprod-zth-6.gz00b.dev.alipay.net',
    }).then(res => {
      if (res.status === 'succeed') {
        this.setState({
          data: res.data,
          loading: false,
        }, () => {
          this.initMap(res.data);
        });
      }
    });
  }

  initMap({ longitude, latitude, fenceArea }) {
    this.map = new AMap.Map(this.refs.map, {
      zoom: 11, // 级别
      center: [longitude, latitude], // 中心点坐标
      resizeEnable: true,
      keyboardEnable: false,
    });

    this.map.plugin(['AMap.ToolBar'], () => {
      const toolBar = new AMap.ToolBar();
      this.map.addControl(toolBar);
    });

    const marker = new AMap.Marker({
      position: [longitude, latitude], // 位置
    });
    this.map.add(marker); // 添加到地图

    try {
      const arr = JSON.parse(fenceArea);
      const path = arr.map(([lng, lat]) => {
        return new AMap.LngLat(lng, lat);
      });

      const polygon = new AMap.Polygon({
        path: path,
        fillColor: '#F33', // 多边形填充颜色
        fillOpacity: 0.3,
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: '#F33', // 线条颜色
      });

      this.map.add(polygon);
    } catch (e) {
      //
    }
  }

  render() {
    if (this.state.loading) {
      return <Spin className="fn-p20" />;
    }

    const { data } = this.state;
    return (
      <div>
        {/* <Block title="证照信息">
          <DetailTable
            dataSource={[{
              label: '行业许可证',
              value: data.license ? <img src={data.license} style={{ maxHeight: 100, maxWidth: 100 }} /> : '',
            }, {
              label: '行业许可证有效期',
              value: data.licensePeriodType,
            }, {
              label: '编号',
              value: data.licenseCode,
            }]}
          />
        </Block> */}

        <Block title="应用">
          <DetailTable
            columnCount={4}
            dataSource={[{
              label: '一体机',
              value: data.posDevice,
              colSpan: 3,
            }, {
              label: '发票',
              value: `${data.hasInvoice === 'true' ? '' : '不'}支持纸质发票`,
              colSpan: 3,
            }]}
          />
        </Block>

        <Block title="配送方案">
          <DetailTable
            columnCount={4}
            dataSource={[{
              label: '配送机构',
              value: data.shopName,
            }, {
              label: '配送点联系人和方式',
              value: `${data.contactName || ''}(${data.contactPhone || ''})`,
            }, {
              label: '配送时间',
              value: data.deliveryTime,
            }, {
              label: '配送费用',
              value: data.deliveryFee,
            }, {
              label: '配送编码',
              value: data.fenceAreaCode,
            }]}
          />
          <div ref="map" style={{ marginTop: 10, marginBottom: 10, height: 400 }} />
        </Block>
      </div>
    );
  }
}

export default ShopDetailCatering;
