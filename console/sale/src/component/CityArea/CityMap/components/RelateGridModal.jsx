import React from 'react';
import { Form, Select, message, Modal } from 'antd';
import ajax from 'Utility/ajax';
import Constants from '../../common/constants';

const FormItem = Form.Item;

export default class RelateGridModal extends React.Component {

  static propTypes = {
    cityName: React.PropTypes.string,
    cityCode: React.PropTypes.string,
    positions: React.PropTypes.array,
    shopIds: React.PropTypes.array,
    leadsIds: React.PropTypes.array,
    territoryArea: React.PropTypes.number,
    bindTerritoryId: React.PropTypes.string,
    visible: React.PropTypes.bool,
    onCancel: React.PropTypes.func.isRequired,
    onOk: React.PropTypes.func
  };

  state = {
    chooseGrid: null,
    grids: [],
    gridAlreadyHasData: false,
    isSubmitting: false,
    loadingGrid: false,
  };

  componentDidMount() {
    this.onMessage = (e) => {
      const type = e && e.data && e.data.type;
      if (type && type === Constants.TerritoryChanged) {
        this.fetchGrids();
      }
    };
    window.addEventListener('message', this.onMessage);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this.setState({
        chooseGrid: null,
      }, () => {
        this.fetchGrids(true);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onGridValueChange(gridId) {
    const grid = this.state.grids.filter((item) => gridId === item.territoryId)[0];
    this.setState({
      chooseGrid: grid,
      gridAlreadyHasData: grid.territoryShopCount || grid.territoryLeadsCount,
    });
  }

  onClickSubmit() {
    const { chooseGrid, gridAlreadyHasData, loadingGrid } = this.state;
    if (!chooseGrid) {
      message.error(loadingGrid ? '正在加载，请稍候...' : '请选择一个网格');
      return;
    }
    const { cityCode, positions, shopIds, leadsIds, territoryArea } = this.props;
    this.setState({ isSubmitting: true });
    ajax({
      url: `${window.APP.crmhomeUrl}/shop/koubei/territory/submitPolygonShopInfo.json`,
      method: 'post',
      data: {
        param: JSON.stringify({
          cityCode: cityCode,
          territoryId: chooseGrid.territoryId,
          positions: positions,
          shopIds: shopIds,
          leadsIds: leadsIds,
          territoryName: chooseGrid.territoryName,
          territoryArea: territoryArea,
          isRestart: !!gridAlreadyHasData,
        }),
      },
      type: 'json',
      success: (res) => {
        this.setState({ isSubmitting: false });
        if (res.status === 'succeed') {
          this.setState({ chooseGrid: null });
          this.props.onCancel();
          Modal.confirm({
            title: '提交成功，等待数据生效',
            content: '有圈选的门店数据较多，处理时间大约10分钟，新网格就可生效。',
            okText: '知道了',
            cancelText: '查看进度',
            onCancel: () => { location.hash = '/cityarea/tabs/upload'; },
            onOk: () => {
              if (this.props.onOk) this.props.onOk();
            },
          });
        } else {
          message.error('操作失败，请重试');
        }
      },
      error: (results) => {
        this.setState({ isSubmitting: false });
        Modal.error({
          title: '提交失败',
          content: results && results.resultMsg || '网络出错',
        });
      },
    });
  }

  onClickAddGrid() {
    window.open(`#/cityarea/manager/add?cityCode=${this.props.cityCode}`);
  }

  fetchGrids(chooseFirstNoDataGrid) {
    const { bindTerritoryId } = this.props;
    this.setState({ loadingGrid: true });
    ajax({
      url: window.APP.crmhomeUrl + '/shop/koubei/territory/queryTerritorys.json',
      method: 'get',
      data: {
        cityCode: this.props.cityCode,
        pageNum: 1,
        pageSize: 1000,
      },
      type: 'json',
      success: (res) => {
        this.setState({ loadingGrid: false });
        if (res && res.status && res.status === 'succeed') {
          let chooseGrid = this.state.chooseGrid;
          if (!chooseGrid && bindTerritoryId) {
            chooseGrid = res.data.territorys.filter((grid) => bindTerritoryId === grid.territoryId)[0];
          }
          if (!chooseGrid && chooseFirstNoDataGrid) {
            chooseGrid = res.data.territorys.filter((grid) => !grid.territoryShopCount && !grid.territoryLeadsCount)[0];
          }
          this.setState({
            grids: res.data.territorys,
            chooseGrid,
            gridAlreadyHasData: chooseGrid && (chooseGrid.territoryShopCount || chooseGrid.territoryLeadsCount),
          });
        }
      },
      error: (res) => {
        message.error((res && res.resultMsg) || '请求异常', 3);
      },
    });
  }

  render() {
    const { cityName, visible, onCancel, bindTerritoryId } = this.props;
    const { chooseGrid, grids, gridAlreadyHasData, isSubmitting, loadingGrid } = this.state;
    let placeHolder = '选择网格';
    if (loadingGrid) {
      placeHolder = '加载中...';
    } else if (grids && grids.length === 0) {
      placeHolder = '请先新增网格';
    }
    const value = chooseGrid && chooseGrid.territoryId;

    return (<Modal visible={visible} onOk={() => this.onClickSubmit()} onCancel={onCancel}
      title="关联网格" okText="提 交" cancelText="取 消" confirmLoading={isSubmitting}
    >
      <Form>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="所在城市：">{cityName}</FormItem>
        <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="网格名称：" required>
          <Select
            style={{ width: 180 }}
            showSearch
            placeholder={placeHolder}
            optionFilterProp="children"
            notFoundContent="没有找到"
            disabled={!!bindTerritoryId}
            onChange={(v) => this.onGridValueChange(v)}
            {...(value ? {value} : {})}
          >
            {grids && grids.map((item, index) => (
              <Select.Option key={index} value={item.territoryId}>{item.territoryName}</Select.Option>
            ))}
          </Select>
          {!bindTerritoryId && <a style={{ marginLeft: 12 }} onClick={() => this.onClickAddGrid()}>+ 新增网格</a>}
          {gridAlreadyHasData ? (
            <div style={{ lineHeight: 1.6, marginTop: 12 }}>
              此网格已有门店leads数据，<br />
              <span style={{color: '#FF6633'}}>本次圈入将覆盖旧的门店leads数据</span>
            </div>
          ) : null}
        </FormItem>
      </Form>
    </Modal>);
  }
}
