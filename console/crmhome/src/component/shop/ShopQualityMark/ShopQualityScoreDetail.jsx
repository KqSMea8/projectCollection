import React, {PropTypes} from 'react';
import {Row, Col, Popover, Affix, Tooltip, Modal, Icon} from 'antd';
import ajax from '../../../common/ajax';
import './ShopQualityScoreDetail.less';
import Dashbord from './Dashbord';


const editUrl = parent.APP.kbservcenterUrl + '/sale/index.htm?mode=modify#/shop/edit/';
const qualityScoreMap = {
  SHOP_BASE_INFO_SCORE: {
    SHOP_NAME_SCORE: ['门店名称不符合标准', '顾客搜不到你的店了', '马上去改', '?mode=modify#/shop/edit/', editUrl],
    SHOP_ADDRESS_SCORE: ['门店地址不正确', '顾客找不到你的店了', '马上去改', '?mode=modify#/shop/edit/', editUrl],
    SHOP_DISTRICT_SCORE: ['地理定位不正确', '顾客找不到你的店了', '马上去改', '?mode=modify#/shop/edit/', editUrl],
    SHOP_TEL_SCORE: ['门店电话不正确', '顾客联系不到你了', '马上去改', '?mode=modify#/shop/edit/', editUrl],
    SHOP_LICENSE_SCORE: ['经营许可证及营业执照', '你的门店存在政策风险', '立即添加', '?mode=modify#/shop/edit/', editUrl],
  },
  SHOP_CONTENT_SCORE: {
    SHOP_BUSINESS_TIME_SCORE: ['营业时间', '快来填一下吧，让顾客更了解你～', '立即添加', '?mode=modify#/shop/edit/', editUrl],
    SHOP_AVG_PRICE_SCORE: ['人均价格', '快来填一下吧，让顾客更了解你～', '立即添加', '?mode=modify#/shop/edit/', editUrl],
    SHOP_EXT_SERVICE_SCORE: ['其他服务信息', '不想因为没有Wi-Fi等信息让顾客流失吧？快来填一下吧～', '立即添加', '?mode=modify#/shop/edit/', editUrl],
    SHOP_GOODS_NUM_SCORE: {
      first: ['菜单管理', '没有菜单，顾客没办法在手机上看到菜品信息', '新建菜单模板', '#/decoration/${cagegoryId}/menu/menu-create', '#/decoration'],
      second: ['菜品数量不达标', '菜单里的菜品还不够丰富，告诉你一个秘密，15张以上才是极好的', '修改菜单模板', '#/decoration/${cagegoryId}/menu/menu-edit/', '#/decoration'],
      third: ['作品', '上传作品可迅速提高门店质量分，上传3份作品可得3分，少于3份作品不得分，满分15分', '立即上传', '#/decoration/${cagegoryId}', '#/decoration'],
    },
    SHOP_GOODS_INFO_SCORE: ['菜品信息', '菜品还不够丰富，再告诉你一个秘密，6个以上才是极好的', '立即添加', '#/decoration/${cagegoryId}/menu/dish', '#/decoration'],
    SHOP_ENV_PIC_SCORE: ['环境图数量', '顾客还不知道你的门店什么样，快来上传展示一下吧～', '立即添加', '#/decoration/${cagegoryId}/environment/create', '#/decoration'],
    SHOP_COMMENT_SCORE: ['优质用户评论', '吸引一名用户给出四星以上的', '，可得3分，满分12分', ''],
    SHOP_SELLING_POINT_SCORE: ['本店特色', '用三句话介绍一下门店特色', '立即添加', 'shop/kbshopspecial/pageQuery.htm', 'shop/kbshopspecial/pageQuery.htm'],
  },
  SHOP_DECORATION_SCORE: {
    SHOP_BRAND_STORY_SCORE: {
      first: ['品牌故事', '说出品牌背后的故事，打动吃货的胃，上传视频得分更高哦', '立即添加', 'shop/brandStory/query.htm', 'shop/brandStory/query.htm'],
      second: ['品牌故事视频', '上传视频得分更高哦', '立即添加', 'shop/brandStory/query.htm', 'shop/brandStory/query.htm'],
    },
    SHOP_PIC_QUALITY_SCORE: ['提升图片质量', '图片太糊啦，重新上传一下吧', '马上修改', '#/decoration/${cagegoryId}/menu/dish', '#/decoration'],
    SHOP_MARKETING_SCORE: ['通过ISV插件订购服务', '订购一个得5分，满分10分。', '立即订购', 'commodity/onlineCommodity.htm', 'commodity/onlineCommodity.htm'],
  },
};

const ShopQualityScoreDetail = React.createClass({
  propTypes: {
    params: PropTypes.any,
  },
  getInitialState() {
    const content = window._fd_special_right_content;
    return {
      data: {},
      loading: true,
      showQrcode: false,
      showButton: false,
      changeText: false,
      visible: false,
      shop: [],
      specialRightScore: content.score,
      title1: content.titleOne,
      title2: content.titleTwo,
      shops: content.shops,
      date: content.date,
      rankContent: content.rankContent,
      activeContent: content.activeContent,
      src: content.pictureSrc,
      srcUniversal: content.pictureSrcUniversal,
      code: content.code,
      isRestuarant: '',
      isUniversal: '',
      rootCategory: {},
    };
  },

  componentDidMount() {
    this.fetch();
  },
  fetch() {
    const params = {
      shopId: this.props.params.shopId,
    };
    this.setState({
      loading: true,
    });
    const url = '/shop/queryQualityScore.json';
    ajax({
      url: url,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            loading: false,
            data: this.dealData(result.qualityScore),
            isUniversal: result.cateLables.indexOf('UNIVERSAL') !== -1 ? true : '',
            isRestuarant: result.cateLables.indexOf('RESTAURANT') !== -1 ? true : '',
            rootCategory: result.rootCategory || {},
          });
        }
      },
    });
    const logoUrl = '/shop/crm/shopDetail.json';
    ajax({
      url: logoUrl,
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        if (!result) {
          return;
        }
        if (result.status && result.status === 'succeed') {
          this.setState({
            shop: result.shop,
          });
        }
      },
    });
  },
  dealData(data) {
    const shopScoreItem = data.shopScoreItem;
    const qualityScore = {};
    qualityScore.fullScore = shopScoreItem.fullScore;
    qualityScore.scoreDt = shopScoreItem.scoreDt;
    qualityScore.scoreValue = shopScoreItem.scoreValue;
    qualityScore.shopId = shopScoreItem.shopId;
    data.childCollection.map(item1 => {
      const itemScore = {};
      const shopScoreItem1 = item1.shopScoreItem;
      qualityScore[shopScoreItem1.scoreCode] = itemScore; // 大类信息
      itemScore.fullScore = shopScoreItem1.fullScore;
      itemScore.scoreDt = shopScoreItem1.scoreDt;
      itemScore.scoreValue = shopScoreItem1.scoreValue;
      itemScore.shopId = shopScoreItem1.shopId;
      const scoreItems = [];
      const childCollection1 = item1.childCollection;
      childCollection1.map(item2 => {
        itemScore.scoreItems = scoreItems; // 各分类信息汇总
        const shopScoreItem2 = item2.shopScoreItem;
        scoreItems.push({
          fullScore: shopScoreItem2.fullScore,
          scoreCode: shopScoreItem2.scoreCode,
          scoreDt: shopScoreItem2.scoreDt,
          scoreReason: shopScoreItem2.scoreReason,
          scoreValue: shopScoreItem2.scoreValue,
          shopId: shopScoreItem2.shopId,
        });
      });
    });
    return qualityScore;
  },
  showQrcode() {
    this.setState({
      showQrcode: true,
    });
  },
  hideButton() {
    this.setState({
      showButton: false,
    });
    this.refs.top.scrollIntoView(true);
  },
  toggleText() {
    const {changeText} = this.state;
    this.setState({
      changeText: !changeText,
    });
  },
  goToAnchor(text) {
    if (text === 'rank') {
      this.refs.rank.scrollIntoView(true);
    } else {
      this.refs.sample.scrollIntoView(true);
    }
    this.setState({
      showButton: true,
    });
    return false;
  },
  showModal() {
    this.setState({
      visible: true,
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },
  showTable(obj1, obj2, obj3) {
    const rule = (obj1.scoreValue !== obj1.fullScore && obj1.fullScore > 0) ||
      (obj2.scoreValue !== obj2.fullScore && obj2.fullScore > 0) ||
      (obj3.scoreValue !== obj3.fullScore && obj3.fullScore > 0);
    if (rule) {
      return (<div>
        <div style={{marginTop: 20, marginBottom: 38, fontSize: 16}}>
            <span className="quality-mark-title">如何提升分数？</span>
        </div>
        <table className="quality-mark-table">
          <tbody>
            {this.showQualityScore('SHOP_BASE_INFO_SCORE')}
            {this.showQualityScore('SHOP_CONTENT_SCORE')}
            {this.showQualityScore('SHOP_DECORATION_SCORE')}
          </tbody>
        </table>
      </div>);
    }
  },
  showQualityScore(block) {
    const {data} = this.state;
    const dataObj = data[block];
    const mapObj = qualityScoreMap[block];
    const scoreItems = dataObj.scoreItems;
    const trArr1 = [];
    const rule1 = (dataObj.scoreValue !== dataObj.fullScore && dataObj.fullScore !== 0);
    if (rule1) {
      trArr1.push(
        <tr>
          <td>{this.changeTitle(block)}</td>
          <td><span>{dataObj.scoreValue} </span><span>/{dataObj.fullScore}分</span></td>
          <td colSpan="4" style={{width: 700}}>
            <div className="quality-mark-progress">
              <Tooltip placement="topRight" title={this.dealToolTip(dataObj)}>
                <div style={{cursor: 'pointer', width: this.dealToolTip(dataObj), backgroundColor: this.changeColor(dataObj)}}></div>
              </Tooltip>
            </div>
          </td>
        </tr>
      );
    }

    let borderType = '1px solid #eee';
    const arr = [];
    scoreItems.map(item => {
      if (item.fullScore !== 0 && item.fullScore !== item.scoreValue) {
        arr.push(item);
      }
      return arr;
    });

    const trArr2 = arr.map(item => {
      const newArr = [];
      const scoreCode = item.scoreCode;
      const scoreValue = item.scoreValue;
      const fullScore = item.fullScore;
      const scoreReason = item.scoreReason;
      const obj = mapObj[scoreCode];
      if (item === arr[arr.length - 1]) {
        borderType = '1px solid #fff !important';
      }
      const rule2 = (scoreValue !== fullScore) && (Object.keys(mapObj).indexOf(scoreCode) !== -1);
      const rule3 = (scoreCode !== 'SHOP_GOODS_INFO_SCORE') || (!this.state.isUniversal);
      if (rule2 && rule3) {
        newArr.push(
          <tr className="quality-mark-table-row">
            <td style={{borderBottom: '1px solid #fff'}}></td>
            <td style={{borderBottom: '1px solid #fff'}}>{this.dealKey(scoreCode)}</td>
            <td style={{borderBottom: borderType}}>{this.dealTitle(obj, scoreCode, scoreValue)}</td>
            <td style={{borderBottom: borderType}}>+{this.dealScore(obj, scoreCode, scoreValue, fullScore)}分</td>
            <td style={{borderBottom: borderType, width: 355}}>{this.dealDescription(obj, scoreCode, scoreValue)}</td>
            <td style={{borderBottom: borderType}}>{this.dealButton(obj, scoreCode, scoreValue, scoreReason)}</td>
          </tr>
        );
      }
      return newArr;
    });
    trArr1.push(trArr2);
    return trArr1;
  },
  changeTitle(data) {
    let text = '基础服务分';
    if (data === 'SHOP_CONTENT_SCORE') {
      text = '内容完整分';
    } else if (data === 'SHOP_DECORATION_SCORE') {
      text = '门店营销分';
    }
    return text;
  },
  dealKey(scoreCode) {
    let label = '';
    if (scoreCode === 'SHOP_COMMENT_SCORE' || scoreCode === 'SHOP_GOODS_NUM_SCORE') {
      label = (<div style = {{width: '84px', height: '21px', paddingTop: '4px', position: 'relative', left: '20px', backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/vsGGFZURosPAvmH.png)' }}>
        <div style = {{width: '60px', height: '12px', fontFamily: 'PingFangSC-Regular', fontSize: '12px', color: '#fff', lineHeight: '12px', textAlign: 'center', marginLeft: '7px'}}>重要加分项</div>
      </div>);
    } else {
      label = null;
    }
    return label;
  },
  dealTitle(obj, scoreCode, scoreValue) {
    let value = '';
    if (scoreCode === 'SHOP_GOODS_NUM_SCORE') {
      if (this.state.isRestuarant === true) {
        if (scoreValue < 3) {
          value = obj.first[0];
        } else {
          value = obj.second[0];
        }
      } else if (this.state.isUniversal === true) {
        value = obj.third[0];
      }
    } else if (scoreCode === 'SHOP_BRAND_STORY_SCORE') {
      if (scoreValue === 0) {
        value = obj.first[0];
      } else {
        value = obj.second[0];
      }
    } else if (scoreCode === 'SHOP_MARKETING_SCORE') {
      const content = (
        <div style={{width: 150}}>
          <span>例如开通CRM、点菜、预约、预订等功能</span>
        </div>
      );
      value = (<div>
        {obj[0]}
        <Popover placement="bottomLeft" content={content} trigger="hover">
          <Icon style={{color: '#2db7f5', fontSize: '18px', marginLeft: '2px'}} type="info-circle" />
        </Popover>
      </div>);
    } else {
      value = obj[0];
    }
    return value;
  },
  dealScore(obj, scoreCode, scoreValue, fullScore) {
    let value = fullScore;
    if (scoreCode === 'SHOP_EXT_SERVICE_SCORE' || scoreCode === 'SHOP_ENV_PIC_SCORE' || scoreCode === 'SHOP_PIC_QUALITY_SCORE' || scoreCode === 'SHOP_BRAND_STORY_SCORE') {
      value = fullScore - scoreValue;
    }
    if (scoreCode === 'SHOP_GOODS_NUM_SCORE' || scoreCode === 'SHOP_GOODS_INFO_SCORE' || scoreCode === 'SHOP_COMMENT_SCORE') {
      if (scoreValue < 3) {
        value = fullScore;
      } else {
        value = fullScore - scoreValue;
      }
    }
    return value;
  },
  dealDescription(obj, scoreCode, scoreValue) {
    let value = obj[1];
    if (scoreCode === 'SHOP_PIC_QUALITY_SCORE') {
      value = (<div>
        {obj[1]}
        <a onClick={this.showModal} style={{display: 'inline', backgroundColor: '#fff', color: '#0ae', float: 'right'}}>优秀图片</a>
        <Modal title="优秀图片" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel} width="554px" footer={false}>
          <img src="https://zos.alipayobjects.com/rmsportal/nYlWyUMKDjMCFLE.png" width="522" height="478"/>
        </Modal>
      </div>);
    }
    if (scoreCode === 'SHOP_COMMENT_SCORE') {
      const content = (
        <div style={{width: 150}}>
          <span>优质评论：至少2张图片及不少于20个字的文字评论</span>
        </div>
      );
      value = (<div>
        {obj[1]}
        <Popover content={content} placement="bottom">
          <a style={{display: 'inline', backgroundColor: '#fff', color: '#0ae'}}>优质评论</a>
        </Popover>
        {obj[2]}
      </div>);
    }
    if (scoreCode === 'SHOP_GOODS_NUM_SCORE') {
      if (this.state.isRestuarant === true) {
        if (scoreValue < 3) {
          value = obj.first[1];
        } else {
          value = obj.second[1];
        }
      } else if (this.state.isUniversal === true) {
        value = obj.third[1];
      }
    } else if (scoreCode === 'SHOP_BRAND_STORY_SCORE') {
      if (scoreValue === 0) {
        value = obj.first[1];
      } else {
        value = obj.second[1];
      }
    }
    return value;
  },
  dealButtonMethod(obj, scoreCode, scoreValue, scoreReason, k, reason, id) {
    let value;
    if (scoreCode === 'SHOP_COMMENT_SCORE') {
      value = null;
    } else if (scoreCode === 'SHOP_SELLING_POINT_SCORE') {
      value = (<a href={obj[k]} target="_blank">{obj[2]}</a>);
    } else if (scoreCode === 'SHOP_MARKETING_SCORE') {
      value = (<a href={obj[k]} target="_blank">{obj[2]}</a>);
    } else if (scoreCode === 'SHOP_GOODS_NUM_SCORE') {
      if (this.state.isRestuarant === true) {
        if (scoreValue < 3) {
          value = (<a href={obj.first[k]} target="_blank">{obj.first[2]}</a>);
        } else {
          value = (<a href={k === 3 ? (obj.second[k] + scoreReason.split('=')[1]) : obj.second[k]} target="_blank">{obj.second[2]}</a>);
        }
      } else if (this.state.isUniversal === true) {
        value = (<a href={obj.third[k]} target="_blank">{obj.third[2]}</a>);
      }
    } else if (scoreCode === 'SHOP_BRAND_STORY_SCORE') {
      if (scoreValue === 0) {
        value = (<a href={obj.first[k]} target="_blank">{obj.first[2]}</a>);
      } else {
        value = (<a href={obj.second[k]} target="_blank">{obj.second[2]}</a>);
      }
    } else if (scoreCode === 'SHOP_GOODS_INFO_SCORE' || scoreCode === 'SHOP_ENV_PIC_SCORE') {
      value = (<a href={obj[k]} target="_blank">{obj[2]}</a>);
    } else if (scoreCode === 'SHOP_PIC_QUALITY_SCORE') {
      value = (<a href={obj[k] + reason} target="_blank">{obj[2]}</a>);
    } else {
      value = (<a href={obj[k] + id + reason} target="_blank">{obj[2]}</a>);
    }
    return value;
  },
  dealButton(obj, scoreCode, scoreValue, scoreReason) {
    const id = this.props.params.shopId;
    const node = document.getElementById('J_isFromKbServ');
    let isFromKb = false;
    let buttonContent;
    let k = 3;
    let reason = '';
    if (node) {
      isFromKb = node.value === 'true';
    }
    if (isFromKb) {
      k = 4;
    }
    if (scoreReason) {
      reason = '?cmsg=' + scoreReason;
    }
    // url处理
    let _obj = obj;
    if (obj instanceof Array) {
      _obj = _obj.map(this.replaceUrl);
    } else {
      Object.keys(_obj).forEach(v => _obj[v] = _obj[v].map(this.replaceUrl));
    }
    buttonContent = this.dealButtonMethod(_obj, scoreCode, scoreValue, scoreReason, k, reason, id);
    return buttonContent;
  },
  replaceUrl(v, i) {
    const {rootCategory} = this.state;
    let res = v;
    // crmhome门店内容url动态生成，销售中台写死
    if (i === 3) {
      if ('id' in rootCategory) {
        res = v.replace('${cagegoryId}', rootCategory.id);
      } else {
        res = v.replace(/^(#\/decoration)\/.*$/, '$1');
      }
    }
    return res;
  },
  changeColor(data) {
    if (data.scoreValue / data.fullScore < 0.6) {
      return '#ff5800';
    }
    return '#ffc600';
  },
  dealToolTip(text) {
    return ((text.scoreValue / text.fullScore * 100).toFixed(0, 10) + '%');
  },
  render() {
    const {changeText, showButton, data, loading, shop, specialRightScore, title1, title2, shops, src, srcUniversal, code, rankContent, activeContent} = this.state;
    const {SHOP_BASE_INFO_SCORE, SHOP_CONTENT_SCORE, SHOP_DECORATION_SCORE} = data;
    const content = (
      <div>
        <div style={{fontSize: 100, textAlign: 'center'}}><img src={code} style={{width: 150}}/></div>
        <p style={{color: '#666', textAlign: 'center'}}>店铺详情页二维码</p>
        <p style={{color: '#666', textAlign: 'center'}}>扫描后可在手机上查看</p>
      </div>
    );
    let universalDetail = '';
    let examplePicSrc = '';
    if (this.state.isUniversal === true) {
      universalDetail = '';
      // universalDetail = (<div style={{width: '902px', height: '74px', marginBottom: 25, fontFamily: 'PingFangSC-Light', fontSize: '12px', color: '#333333', letterSpacing: 0, lineHeight: '18px', paddingLeft: 15}}>
      //           优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优秀案例的解释说明文案优解释说明文解释说明文解释说明文解解
      //         </div>);
      examplePicSrc = srcUniversal;
    } else {
      universalDetail = '';
      examplePicSrc = src;
    }
    const score = data.scoreValue;
    const shopMainImgSrc = shop && shop.mainImage && shop.mainImage.resourceUrl.replace(/&amp;/g, '&');
    return (<div>
      {!loading && (<div>
        <div className="kb-page-title" style={{fontSize: 14}} ref="top">
          <span style={{display: 'inline-block', width: 10}}></span>
          <span style={{color: '#999'}}>门店管理</span>
          <span style={{display: 'inline-block', width: 20, color: '#d9d9d9', textAlign: 'center'}}>></span>
          <a href={'#/shop/detail/' + this.props.params.shopId} style={{color: '#999'}}>门店信息</a>
          <span style={{display: 'inline-block', width: 20, color: '#d9d9d9', textAlign: 'center'}}>></span>
          <span style={{color: '#333'}}>门店质量分</span>
        </div>
        <div className="kb-detail-mainwrap">
          <Row style={{marginBottom: 17}}>
            <Col span="16">
              <img src={shopMainImgSrc} style={{float: 'left', border: '1px solid #ccc', width: 36, height: 36, borderRadius: 18, marginRight: 15}}/>
              <div style={{float: 'left', height: 36, fontSize: 16, lineHeight: '36px', color: '#333'}}>
                {shop.shopName}
              </div>
            </Col>
          </Row>
          <div style={{width: '100%', height: 280, border: '1px solid #ebebeb', backgroundColor: '#f8f8fc'}}>
            <div style={{textAlign: 'center', display: 'inline-block', float: 'left', margin: '33px 93px 39px 80px'}}>
              <Dashbord score={score} specialRightScore={specialRightScore}/>
              <span style={{color: '#999'}}>评估时间每日更新:{data.scoreDt}</span>
            </div>
            <div className="quality-mark-anchor" style={{display: 'inline-block', float: 'left', width: 456, marginTop: 68}}>
              {
                score < specialRightScore ?
                <div style={{fontSize: 24, color: '#ff5800', marginBottom: 36}}>门店质量分较低，已影响了你的搜索排名！</div> :
                <div style={{fontSize: 24, color: '#70b14e', marginBottom: 36}}>干的不错 ! 您将有机会获得以下特权 :</div>
              }
              <div style={{marginBottom: 16, fontSize: 14, color: '#333'}}>
                <img src="https://zos.alipayobjects.com/rmsportal/EHzZnCWndSDhmhX.png" width="24px" height="24px" style={{verticalAlign: 'top', borderRadius: 12}}/>
                {
                  score < specialRightScore ?
                  <p style={{display: 'inline-block', marginLeft: 10}} onClick={this.goToAnchor.bind(this, 'rank')}>达到 <span style={{color: '#ff5800'}}>{specialRightScore}分</span> 就有机会提升搜索排名</p> :
                  <div style={{display: 'inline-block', marginLeft: 10}}>
                    <p onClick={this.goToAnchor.bind(this, 'rank')}>搜索排名提升</p>
                    <div style={{fontSize: 12, color: '#666'}}>店铺质量分越高，搜索排名越可能靠前哦！</div>
                  </div>
                }
              </div>
              <div>
                <div style={{marginBottom: 8, fontSize: 14, color: '#333'}}>
                  <img src="https://zos.alipayobjects.com/rmsportal/reBgGlGaREUVMxR.png" width="24px" height="24px" style={{verticalAlign: 'top', borderRadius: 12}}/>
                  <div style={{display: 'inline-block', marginLeft: 10}}>
                    {
                      score < specialRightScore ?
                      <div>
                        <p onClick={this.goToAnchor.bind(this, 'rank')} style={{cursor: 'pointer'}}>{title1}</p>
                        <div style={{fontSize: 12, color: '#666'}}>{shops}，快去提高分数吧！</div>
                      </div> :
                      <div>
                        <p onClick={this.goToAnchor.bind(this, 'rank')} style={{cursor: 'pointer'}}>{title2}</p>
                        <div style={{fontSize: 12, color: '#666'}}>{shops}(<a onClick={this.goToAnchor.bind(this, 'sample')}>优秀门店</a>)</div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{padding: '0 10px'}}>
            {this.showTable(SHOP_BASE_INFO_SCORE, SHOP_CONTENT_SCORE, SHOP_DECORATION_SCORE)}
            <div style={{paddingTop: 25, marginBottom: 21, fontSize: 16}} ref="rank">
                <span className="quality-mark-title">高分门店的特权</span>
            </div>
            <div className="quality-mark-special">
              <img src="https://zos.alipayobjects.com/rmsportal/EHzZnCWndSDhmhX.png"/>
              <div style={{display: 'inline-block', width: 354, marginLeft: 15}}>
                <p>搜索权重排名优化</p>
                <p style={{fontSize: 12, color: '#a5a5a5'}}>{rankContent}</p>
              </div>
            </div>
            <div className="quality-mark-special" style={{float: 'right', marginLeft: 28}}>
              <img src="https://zos.alipayobjects.com/rmsportal/reBgGlGaREUVMxR.png"/>
              <div style={{display: 'inline-block', width: 354, marginLeft: 15}}>
                <p>{title2}</p>
                <p style={{fontSize: 12, color: '#a5a5a5'}}>{activeContent}</p>
              </div>
            </div>

            <div style={{marginTop: 20, marginBottom: 8, fontSize: 16}}>
                <a ref="sample" className="quality-mark-title">优秀案例</a>
            </div>
            <div>{universalDetail}</div>
            <div style={{paddingTop: 8, paddingLeft: 12, fontSize: 12}}>
              <Affix offsetTop={300} style={{position: 'absolute', right: 157, backgroundColor: '#fff'}}>
                <Popover placement="bottomLeft" content={content} trigger="hover">
                  <Icon type="qrcode" style={{fontSize: 41}}/>
                </Popover>
              </Affix>
              {examplePicSrc ? <img src={examplePicSrc} alt="" style={{width: 550, marginRight: 0}} /> : null}
            </div>
          </div>
        </div>
        {
          showButton &&
          <Affix offsetBottom={20} onMouseEnter={this.toggleText} onMouseLeave={this.toggleText} onClick={this.hideButton}>
            <div className="qualit-mark-button">
              {changeText ? <div>回到顶部</div> : <img src="https://zos.alipayobjects.com/rmsportal/oLtxefBWkmpQyBi.png" width="22" height="22"/>}
             </div>
          </Affix>
        }
      </div>)
      }
    </div>);
  },
});

export default ShopQualityScoreDetail;
