import React, {PropTypes} from 'react';
import {Breadcrumb, Row, Col, Spin, Popover, message} from 'antd';
import moment from 'moment';
import ajax from 'Utility/ajax';
import {queryPurposeMap} from '../common/queryVisitPurpose';
import RecordImgModal from '../common/RecordImgModal';
import {format, formatTime} from '../../../common/dateUtils';
import {queryRecordEditorDetail} from '../common/queryRecordEditorDetail';
import {visitWayMap, positionMap} from '../common/RecordSelect';

import './recordEditorDetail.less';

const RecordEditorDeatil = React.createClass({

  propTypes: {
    data: PropTypes.object,
    params: PropTypes.object
  },
  getInitialState() {
    return {
      loading: true,
      visitPurposeMap: {},
      typeMap: {},
      purposeMaploading: true
    };
  },
  componentDidMount() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
    this.fetchMaterialTypeList();
    const recordId = this.props.params.recordId;
    queryPurposeMap().then(visitPurposeMap => this.setState({ visitPurposeMap, purposeMaploading: false }));
    queryRecordEditorDetail({recordId}).then(data => {
      this.setState({data, loading: false});
    }).catch(() => {
      this.setState({loading: false});
    });
  },

  fetchMaterialTypeList() {
    ajax({
      url: '/sale/visitrecord/queryStuffTypeList.json',
      method: 'get',
      type: 'json',
      success: (results) => {
        if (results.status === 'succeed') {
          this.setState({
            typeMap: results.data
          });
        } else {
          message.error(results.resultMsg, 3);
        }
      },
    });
  },

  filterPictures(pictures, title) {
    return pictures.filter((v) => {
      return (v.title === title);
    }).map((v) => {
      return v.url;
    });
  },

  stuffTypeItem(pics, name, i, desc, noFirst) {
    const pictures = this.filterPictures(pics, name);
    return (<span key={i}>{noFirst && <span className="line"> | </span>}{`${desc} `}{pictures.length > 0 ? <RecordImgModal data={pictures} title={desc} desc="查看照片"/> : null}</span>);
  },

  render() {
    const { data, loading, visitPurposeMap } = this.state;
    const { typeMap } = this.state;
    const { isPosSale, type } = this.props.params;
    let visitList = ''; // 拜访目的
    let otherList = ''; // 拜访目的-其他
    let hasPosSale = false; // 是否选择“POS销售”
    let hasShopPosCheck = false; // 是否选择“门店及POS验收”
    let stuffTypeArray = []; // 拜访目的-物料铺设类型
    let hasLayingMaterial = false; // 是否选择“物料铺设类型”
    let layingMaterialPictures = []; // 门头照片
    let fieldPictures = []; // 现场照片
    if (data && data.visitPurposes) {
      fieldPictures = this.filterPictures(data.pictures, '口碑小记附件');
      (data.visitPurposes).map((v) => {
        if (v === 'POS_SALE') {
          hasPosSale = true;
        }
        if (v === 'SHOP_POS_CHECK') {
          hasShopPosCheck = true;
        }
        if (v === 'LAYING_MATERIAL') { // 过滤掉拜访目的中的物料铺设
          hasLayingMaterial = true;
          layingMaterialPictures = this.filterPictures(data.pictures, 'SHOPFRONT');
          if (data.stuffType) {
            stuffTypeArray = (data.stuffType).split(',');
          }
        }
        if (v === 'OTHER') {
          otherList = `其他${data.visitPurposeDesc ? '（' + data.visitPurposeDesc + '）' : null}`;
        }
      });
      (data.visitPurposes).filter((v) => {
        return v !== 'LAYING_MATERIAL' && v !== 'OTHER';
      }).map((p, index) => {
        if (index === 0) {
          visitList += (visitPurposeMap[p] || p);
        } else {
          visitList += ',' + (visitPurposeMap[p] || p);
        }
      });
    }
    const content = data ? (
      <div>
        <p>时间: {format(new Date(data.signTime))} {formatTime(new Date(data.signTime))}</p>
        <p>距离: 当前门店约<span style={{color: '#f50'}}>{data.distance}m</span></p>
      </div>
    ) : null;
    const popoverHtml = data && data.distance !== '0' ? <span>距离当前门店约<span style={{color: '#f50'}}>{data.distance}m</span></span> : <span>准确签到</span>;
    return (<div>
      <div className="app-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item href="#/record">拜访小记</Breadcrumb.Item>
          <Breadcrumb.Item>拜访小记详情</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    {loading ? (<div className="loading"><Spin/></div>)
      : <div className="app-detail-content-padding detailContent">
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访人:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{ `${data.creatorName}` }</span>
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访时间:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{moment(new Date(data.visitTime)).format('YYYY-MM-DD HH:mm')}</span>
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>{(isPosSale === 'true' && type === 'SHOP') ? '代运营归属人:' : '归属人:'}</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{ `${data.ownerName}` }</span>
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访门店:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{data.customerName}</span>
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>门店ID:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{data.customerId}</span>
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访对象:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>
                {data.contact ? data.contact.name : ''}
                {data.contact ? '(' + positionMap[data.contact.position] + ')' : ''}
                {data.contact && data.contact.tel ? <span className="line"> | </span> : null}
                {data.contact ? data.contact.tel : null}
              </span>
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访目的:</span>
            </Col>
            <Col span="10" className="textLeft">
              <div>{!this.state.purposeMaploading && visitList}</div>
              {stuffTypeArray.length > 0 && <div>物料铺设类型（{
                stuffTypeArray.map((p, index) => {
                  if (index === 0) {
                    if (p === 'ACTIVITY' && data.activityDesc && data.activityName) {
                      const activityDescArr = (data.activityDesc).split(',');
                      const activityNameArr = (data.activityName).split(',');
                      return activityDescArr.map((v, i) => {
                        if (i === 0) {
                          return this.stuffTypeItem(data.pictures, activityNameArr[i], i, v, false);
                        }
                        return this.stuffTypeItem(data.pictures, activityNameArr[i], i, v, true);
                      });
                    }
                    return this.stuffTypeItem(data.pictures, p, index, typeMap[p], false);
                  }
                  if (p === 'ACTIVITY' && data.activityDesc && data.activityName) {
                    const activityDescArr = (data.activityDesc).split(',');
                    const activityNameArr = (data.activityName).split(',');
                    return activityDescArr.map((v, i) => {
                      return this.stuffTypeItem(data.pictures, activityNameArr[i], i, v, true);
                    });
                  }
                  return this.stuffTypeItem(data.pictures, p, index, typeMap[p], true);
                })}）</div>}
              <div>{otherList}</div>
            </Col>
          </Row>
          {
            hasPosSale &&
            <Row className="linePad">
              <Col span="3" className="textRight">
                <span>购买POS意愿:</span>
              </Col>
              <Col span="10" className="textLeft">
                <span>{data.purposePosSaleResult === '1' ? '有' : '没有'}</span>
              </Col>
            </Row>
          }
          {
            hasShopPosCheck &&
            <div>
              <Row className="linePad">
                <Col span="3" className="textRight">
                  <span>门店是否能通过POS或盒子走通一笔点餐交易:</span>
                </Col>
                <Col span="10" className="textLeft">
                  <span>{data.isShopPassPos === '1' ? '正常' : '不正常'}</span>
                  {data.isShopPassPos !== '1' && <div className="gray">{data.noPassPosDesc}</div>}
                </Col>
              </Row>
              <Row className="linePad">
                <Col span="3" className="textRight">
                  <span>是否有口碑码物料:</span>
                </Col>
                <Col span="10" className="textLeft">
                  <span>{data.isKbCodeMaterial === '1' ? '正常' : '不正常'}</span>
                  {data.isKbCodeMaterial !== '1' && <div className="gray">{data.noMaterialDesc}</div>}
                </Col>
              </Row>
              <Row className="linePad">
                <Col span="3" className="textRight">
                  <span>完成点餐交易后打印机是否能出小票(包含前台和后厨):</span>
                </Col>
                <Col span="10" className="textLeft">
                  <span>{data.isCanPrinter === '1' ? '正常' : '不正常'}</span>
                  {data.isCanPrinter !== '1' && <div className="gray">{data.noPrinterDesc}</div>}
                </Col>
              </Row>
            </div>
          }
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访方式:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{`${visitWayMap[data.visitWay]}`}</span>
            </Col>
          </Row>
          {
            data.visitWay === 'VISIT_DOOR' &&
            <Row className="linePad">
              <Col span="3" className="textRight">
                <span>签到信息:</span>
              </Col>
              <Col span="10" className="textLeft">
                { data.signStatus === '1' ? <span>
                  {popoverHtml}
                  <Popover overlayStyle={{width: 'auto'}} content={content} title={data.signAddress}>
                    <a style={{marginLeft: '5px'}}>查看</a>
                  </Popover>
                </span> : <span>无签到信息</span>}
              </Col>
            </Row>
          }
          {/* <Row className="linePad">
            <Col span="3" className="textRight">
              <span>竞对信息:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>来自美团、大众点评 | 日交易占比 65% {data.visitPics.length > 0 ? <RecordImgModal data={data.visitPics} title="竞对信息" desc="查看照片"/> : null}</span>
              <div>来自微信 | 日交易占比 32% {data.visitPics.length > 0 ? <RecordImgModal data={data.visitPics} title="竞对信息" desc="查看照片"/> : null}</div>
              <div>来自聚合支付(收银码等插件) | 日交易占比 11% {data.visitPics.length > 0 ? <RecordImgModal data={data.visitPics} title="竞对信息" desc="查看照片"/> : null}</div>
            </Col>
          </Row> */}
          {
            (hasLayingMaterial && layingMaterialPictures.length > 0) &&
            <Row className="linePad">
              <Col span="3" className="textRight">
                <span>门头照片:</span>
              </Col>
              <Col span="10" className="textLeft">
                <RecordImgModal data={layingMaterialPictures} title="门头照片"/>
              </Col>
            </Row>
          }
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>现场照片:</span>
            </Col>
            <Col span="10" className="textLeft">
              {fieldPictures.length > 0 ? <RecordImgModal data={fieldPictures} title="现场照片"/> : '--'}
            </Col>
          </Row>
          <Row className="linePad">
            <Col span="3" className="textRight">
              <span>拜访描述:</span>
            </Col>
            <Col span="10" className="textLeft">
              <span>{data.visitDesc}</span>
            </Col>
          </Row>
      </div>}
    </div>);
  },
});
export default RecordEditorDeatil;
