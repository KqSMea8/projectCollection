import React from 'react';
import './index.less';

const iconMap = {
  scan: <i className="iconfont icon-scan"></i>,
  qrcode: <i className="iconfont icon-qrcode"></i>,
  printer: <i className="iconfont icon-printer"></i>,
  paste: <i className="iconfont icon-paste"></i>
};

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  goToBind = () => {
    this.props.history.push('/material/koubeicode/apply');
  }

  icons(datas) {
    return (<div className="koubeicode-process">
      {datas.map((datum, i) => (
        <div className="icon-wrapper" key={i}>
          <p>{iconMap[datum.icon]}</p>
          <div className="content">
            <h3>{datum.title}</h3>
            <p>{datum.content}</p>
          </div>
        </div>
      ))}</div>
    );
  }

  dashedBorderLabel({ title, content }) {
    return (
      <div className="koubeicode-divide-label">
        <div className="title">
          {title}
        </div>
        <p className="content">{content}</p>
      </div>
    );
  }

  get tips() {
    const tips = [{
      title: '商户有利',
      content: '为商家提供了门店线下服务、用户流量、营销活动的一站式管理入口',
    }, {
      title: '顾客有益',
      content: '扫码即可享受门店智能服务、获取营销活动专属权益、丰富用餐体验和趣味性...',
    }];
    const tipStyle = {
      width: `${99 / tips.length}%`,
    };
    return tips.map((d, i) => (
      <div className={`koubeicode-bottom-tip-wrapper${i > 0 ? ' divider' : ''}`} key={i} style={tipStyle}>
        <div className="koubeicode-tip-title">{d.title}</div>
        <div className="koubeicode-tip-content">{d.content}</div>
      </div>
    ));
  }

  render() {
    return (
      <div style={{ padding: '72px 34px 0 19px' }}>
        <div className="koubeicode-bg">
          <div className="koubeima">
            <img src="https://zos.alipayobjects.com/rmsportal/FttWMqBBEzdqiiltWtAg.png" width="263" height="96" />
          </div>
          <p className="koubeicode-tip">助力商家，更好服务</p>
          <div onClick={this.goToBind} className="get-koubei-code">获取口碑码</div>
          <div className="koubeicode-bottom-tip">
            {this.tips}
          </div>
        </div>
        {this.dashedBorderLabel({ title: '铺设方式一：到店绑定 (空码）', content: '生成的物料无任何门店信息，适合绑定到所有门店' })}
        {this.icons([{
          title: '生成口碑码',
          content: '无需绑定',
          icon: 'qrcode'
        }, {
          title: '下载打印',
          content: '按指定材质制作',
          icon: 'printer'
        }, {
          title: '到店绑定',
          content: '钉钉中台扫码绑定门店信息',
          icon: 'scan'
        }])}
        <div style={{ height: 1, backgroundColor: '#e5e5e5'}} />
        {this.dashedBorderLabel({ title: '铺设方式二：线上绑定 (明码）', content: '生成指定门店的物料，适合大商户' })}
        {this.icons([{
          title: '生成口碑码',
          content: '在线绑定门店信息',
          icon: 'qrcode'
        }, {
          title: '下载打印',
          content: '按指定材质制作',
          icon: 'printer'
        }, {
          title: '铺贴物料',
          content: '及时正确的贴到对应门店',
          icon: 'paste'
        }])}
      </div>
    );
  }
}
