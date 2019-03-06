import React, {PropTypes} from 'react';
import {Modal, Button, Popconfirm, message} from 'antd';
import { Link } from 'react-router';
import ajax from 'Utility/ajax';
import './create.less';
export default class SuperStarView extends React.Component {

  static propTypes = {
    pid: PropTypes.string,
  }

  state = {
    brandVisible: false,
    logoVisible: false,
    marketingVisible: false,
    backgroundVisible: false,
    cityData: [],
    data: {},
  }

  componentWillMount() {
    this.getData();
    this.getCityUrl();
  }

  getCityUrl = () => {
    ajax({
      url: '/manage/superbrand/initCity.json?id=1',
      method: 'get',
      data: {},
      type: 'json',
      success: (res) => {
        this.setState({cityData: res.data});
      },
      error: () => {
      },
    });
  }

  getData = () => {
    ajax({
      url: '/manage/superbrand/findSuperBrandById.json',
      method: 'get',
      data: {
        id: this.props.params.pid
      },
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data;
          this.setState({
            data: data.data,
          });
        } else {
          message.error(res.resultMsg || '获取数据失败');
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(res.resultMsg || '获取数据失败');
      },
    });
  }

  openModel = (visible) => {
    if (visible === 'brandVisible') {
      this.setState({brandVisible: true});
    } else if (visible === 'logoVisible') {
      this.setState({logoVisible: true});
    } else if (visible === 'backgroundVisible') {
      this.setState({backgroundVisible: true});
    } else {
      this.setState({marketingVisible: true});
    }
  }

  handleCancel = (visible) => {
    if (visible === 'brandVisible') {
      this.setState({brandVisible: false});
    } else if (visible === 'logoVisible') {
      this.setState({logoVisible: false});
    } else if (visible === 'backgroundVisible') {
      this.setState({backgroundVisible: false});
    } else {
      this.setState({marketingVisible: false});
    }
  }

  confirm = (id) => {
    ajax({
      url: '/manage/superbrand/updateSuperBrandStatus.json',
      method: 'get',
      data: {
        id: id,
      },
      type: 'json',
      success: () => {
        message.success('操作成功');
        this.getData();
      },
    });
  }

  render() {
    const {brandVisible, logoVisible, marketingVisible, data, cityData, backgroundVisible} = this.state;
    const {id} = data;
    const {cityList} = data || [];
    let active = '上架';
    let status;
    let TEXT = '草稿';
    const list = [];
    cityData.map((item) => {
      if (item.children.length > 0) {
        item.children.map((items) => {
          cityList.map(i => {
            if (i === items.value) {
              list.push(items.label);
            }
          });
        });
      }
    });
    if (data && data.status) {
      status = data.status;
    }
    if (status === 'ONSHELF') {
      // 状态已上架
      TEXT = '已上架';
    } else if (status === 'OFFSHELF') {
      // 状态已下架
      TEXT = '已下架';
    }
    if (status === 'ONSHELF') {
      // 状态已上架
      active = '下架';
    }
    return (
      <div className="hjf_SuperStarView_0122">
        <div className="title">
          <p><span><Link style={{color: '#999'}} to="/superstar">品牌管理</Link></span> > 超大牌</p>
          <Popconfirm title="确定要下架吗？" placement="topRight" onConfirm={() => this.confirm(data.id)} okText="确定" cancelText="取消">
            <Button type="ghost" className="button">{active}</Button>
          </Popconfirm>
          <Button type="ghost" onClick={() => {location.hash = `superstar/create/${id}`;}} className="button">编辑</Button>
        </div>
        <div className="content">
          <p className="brand-status">品牌状态： {TEXT}</p>
          <div className="title-split">
            <p>品牌图片</p>
          </div>
          <div className="brand-img">
            { data && data.brandImage ?
              <div onClick={() => this.openModel('brandVisible')}>
                <img src={data && data.brandImage}/>
                <Modal width="700" title="图片预览" visible={brandVisible} wrapClassName="pciture-preview-modal"
                       onCancel={() => this.handleCancel('brandVisible')}>
                  <img style={{width: '100%', height: '100%'}} src={data && data.brandImage}/>
                </Modal>
                <a>预览</a>
                <p>品牌头图</p>
              </div> :
              <div>
                <a>无图片</a>
                <p>品牌头图</p>
              </div>
            }
            { data && data.logoUrl ?
              <div onClick={() => this.openModel('logoVisible')}>
                <img src={data && data.logoUrl}/>
                <Modal width="700" title="图片预览" visible={logoVisible} wrapClassName="pciture-preview-modal"
                       onCancel={() => this.handleCancel('logoVisible')}>
                  <img style={{width: '100%', height: '100%'}} src={data && data.logoUrl}/>
                </Modal>
                <a>预览</a>
                <p>品牌logo</p>
              </div> :
              <div>
                <a>无图片</a>
                <p>品牌logo</p>
              </div>
            }
          </div>
          <div className="title-split">
            <p>基本信息</p>
            <table className="kb-detail-table-6">
              <tr>
                <td className="kb-detail-table-label">品牌名称</td>
                <td>{data && data.name}</td>
                <td className="kb-detail-table-label">商户pid</td>
                <td>{data && data.partnerId}</td>
              </tr>
              <tr>
                <td className="kb-detail-table-label">覆盖城市</td>
                <td>{list.join(',')}</td>
                <td className="kb-detail-table-label">品牌跳转链接</td>
                <td>{data && data.jumpUrl}</td>
              </tr>
            </table>
          </div>
          <div className="title-split">
            <p>营销配置</p>
          </div>
          <table className="kb-detail-table-6">
            <tr>
              <td className="kb-detail-table-label">类型</td>
              <td colSpan="3">banner位</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">营销图片</td>
              <td>
                { data && data.bannerUrl ?
                  <div onClick={() => this.openModel('marketingVisible')} className="marketing_image">
                    <img src={data && data.bannerUrl}/>
                    <Modal width="700" title="图片预览" visible={marketingVisible} wrapClassName="pciture-preview-modal"
                           onCancel={() => this.handleCancel('marketingVisible')}>
                      <img style={{width: '100%', height: '100%'}} src={data && data.bannerUrl}/>
                    </Modal>
                    <a>预览</a>
                  </div> :
                  <div className="marketing_image">
                    <a>无图片</a>
                  </div>
                }
              </td>
              <td className="kb-detail-table-label">页面跳转链接</td>
              <td>{data && data.hyperLink}</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">类型</td>
              <td colSpan="3" >大牌点餐</td>
            </tr>
            <tr>
              <td className="kb-detail-table-label">品牌图片</td>
              <td>
                { data && data.backgroundImage ?
                  <div onClick={() => this.openModel('backgroundVisible')} className="marketing_image">
                    <img src={data && data.backgroundImage}/>
                    <Modal width="700" title="图片预览" visible={backgroundVisible} wrapClassName="pciture-preview-modal"
                           onCancel={() => this.handleCancel('backgroundVisible')}>
                      <img style={{width: '100%', height: '100%'}} src={data && data.backgroundImage}/>
                    </Modal>
                    <a>预览</a>
                  </div> :
                  <div className="marketing_image">
                    <a>无图片</a>
                  </div>
                }
              </td>
              <td className="kb-detail-table-label">文案</td>
              <td>{data && data.benefit}</td>
            </tr>
          </table>

          <div className="title-split">
            <p>投放配置</p>
          </div>
          <table className="kb-detail-table-6">
            <tr>
              <td className="kb-detail-table-label">利益点摘要</td>
              <td style={{ width: '55%'}}>{data && data.interestAbstract}</td>
            </tr>
          </table>

        </div>
      </div>
    );
  }
}

