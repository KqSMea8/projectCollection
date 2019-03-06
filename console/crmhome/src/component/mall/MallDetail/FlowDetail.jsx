import React, {PropTypes} from 'react';
import {Breadcrumb, Form, Checkbox, Alert, Row, Col, Tag, Spin, message, Modal} from 'antd';
import ajax from '../../../common/ajax';
import {format} from '../../../common/dateUtils';
import {logFlowStatusMap, logResultMap} from '../../../common/OperationLogMap';
import AgreeFlow from '../common/AgreeFlow';
import RejectFlow from '../common/RejectFlow';
import './FlowDetail.less';

const FlowDetail = React.createClass({
  propTypes: {
    form: PropTypes.object,
    params: PropTypes.object,
  },

  getInitialState() {
    return {
      data: [],
      loading: true,
      visible: false,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  fetch() {
    const params = {
      id: this.props.params.orderId,
      action: this.props.params.action, // INFO, CREATE_SHOP, SURROUND_SHOP, REMOVE_SHOP
    };
    this.setState({
      loading: true,
    });
    let url;
    if (this.props.params.action === 'CREATE_SHOP' || this.props.params.action === 'INFO') {
      url = '/shop/crm/shopOrderDetail.json';
    } else {
      url = '/shop/queryRelationOrderInfo.json';
    }
    ajax({
      url,
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
            data: result,
          });
        } else {
          this.setState({loading: false});
          if (result.errorMsg) {
            message.error(result.errorMsg, 3);
          }
        }
      },
    });
  },

  showModal() {
    this.setState({
      visible: true,
    });
  },

  handleOk() {
    this.setState({
      visible: false,
    });
  },
  /*eslint-disable */
  render() {
    /*eslint-enable */
    const {getFieldProps, getFieldValue} = this.props.form;
    const {data, loading} = this.state;
    const {orderId, action} = this.props.params;
    data.shop = data.order || {};
    const {shop} = data;
    const shopName = (shop.headShopName || '') + (shop.shopName ? ('(' + shop.shopName + ')') : '');
    let resultColor = '';
    if (shop) {
      if ( /WAIT_CERTIFY/.test(shop.status) || /LICENSE_AUDITING/.test(shop.status) || /RISK_AUDITING/.test(shop.status) || /WAIT_SIGN/.test(shop.status)) {
        resultColor = 'blue';
      } else if ( /FAIL/.test(shop.status) ) {
        resultColor = 'red';
      } else {
        resultColor = 'green';
      }
    }

    const protocolEl = (
      <div className="mainContent">
        <h1>口碑商户服务协议</h1>
        <p>本协议是您（以下称“甲方”）与口碑（上海）信息技术有限公司、杭州口口相传网络技术有限公司（以下合称“乙方”）就甲方使用口碑平台服务相关事项所订立的有效合约。甲方通过网络页面点击确认或以其他乙方认可的方式接受本协议，即表示甲方与乙方就本协议达成一致并同意接受本协议的全部约定内容。如您不同意接受本协议的任意内容，或者无法准确理解相关条款含义的，请不要进行后续操作。</p>
        <h2>目录</h2>
        <ol>
          <li>第一条 定义</li>
          <li>第二条 口碑服务</li>
          <li>第三条 一般性权利义务</li>
          <li>第四条 运营合作</li>
          <li>第五条 支付宝授权条款</li>
          <li>第六条 免责及有限责任</li>
          <li>第七条 违约责任</li>
          <li>第八条 协议终止</li>
          <li>第九条 其他约定</li>
        </ol>
        <p>甲方和乙方一、乙方二（本协议中合称乙方）在平等、自愿、公平的基础上，经过友好协商，就口碑运营的口碑平台合作事宜所达成以下共识：</p>
        <dl>
          <dt>第一条 定义</dt>
          <dd>1、口碑平台，是指乙方提供网络信息服务及相应软件技术服务的平台，口碑平台包括但不限于网址www.koubei.com，或乙方根据业务需要不时修改的URL，以及甲方使用的相应口碑客户端软件（如有）、口碑平台后台系统等，以下简称口碑平台。</dd>
          <dd>2、支付宝公司，是支付宝（中国）网络技术有限公司的简称。</dd>
          <dd>3、交易流量，指由支付宝公司所统计的甲方通过附件约定支付宝服务所完成交易的金额。</dd>
          <dd>4、商户制度：指口碑在口碑平台或其他渠道上已发布或将来发布的各类制度、规则及/或规则条款（详见网址：支付宝企业帮助中心——线下业务——公告区，
            https://cshall.alipay.com/enterprise/cateQuestion.htm?cateType=EE&cateId=258464&pcateId=25362）的统称。 其包括但不限于《口碑城市服务机具管理制度》、《口碑平台商户管理制度》、《口碑品牌管理规范》、《服务窗规则》、《爱生活平台使用规则》。所有制度是本协议重要组成部分，口碑有权调整。如商户制度的发布位置发生变化的，乙方将通过“支付宝企业帮助中心——线下业务——公告区”（URL地址同上）公告的方式提前通知甲方。</dd>
          <dd>5、综合体：是指在同一建筑物内或同一区域内集合了零售、餐饮、休闲娱乐、美容美发等各种消费场所，向消费者提供综合性服务的是指在同一建筑物内或同一区域内集合了零售、餐饮、休闲娱乐、美容美发等各种消费场所，向消费者提供综合性服务的商业集合体。具体以乙方判断为准。</dd>
          <dd>6、 综合体范围内商户：是指在综合体内开店并向消费者提供服务的个人或公司，具体以乙方判断为准。</dd>
          <dd>7、口碑店铺：是指口碑商户在口碑平台开设的与实体店铺对应的虚拟店铺。</dd>

          <dt>第二条 口碑服务</dt>
          <dd>1、口碑平台服务，乙方基于口碑平台为甲方提供的网络信息服务及相应软件技术服务。甲方如使用口碑平台服务的，除遵守本协议及商户制度约定外，还需遵守口碑商户制度。</dd>
          <dd>2、口碑运营服务，甲方可通过乙方运营的工具或平台（包括但不限于服务窗、 “life.alipay.com”平台--爱生活平台、商户APP等，具体的运营工具、运营平台，乙方可根据实际情况调整）向用户展示和/或互动相关信息、配置甲方优惠活动等。甲方如使用口碑运营服务的，还需要遵守相关运营服务规则，如《服务窗规则》、《爱生活平台使用规则》等。</dd>

          <dt>第三条 一般性权利义务</dt>
          <dd>1、本协议项下，口碑（上海）信息技术有限公司向甲方提供与口碑平台相关网络技术及软件技术服务，杭州口口相传网络技术有限公司向甲方提供与口碑平台相关的网络信息服务。</dd>
          <dd>2、甲方应保证其为一家合法成立并有效存续的法人或其它商事主体，能够独立承担法律责任，并具有履行本合同所需的一切权利及能力；同时甲方应当按乙方要求提供有效身份资料。</dd>
          <dd>3、甲方同意，对于甲方在使用口碑平台过程中提供、形成的信息（包括经营情况、优惠信息、优惠核销信息等），乙方具有所有权和使用权，且乙方有权将上述信息授权给支付宝等其他相关服务提供者使用。</dd>
          <dd>4、甲方同意，乙方可将甲方数据与其他商户数据进行比较分析，并在不向其他商户透露甲方具体信息的情况下，将分析结果（例如某一区域内口碑平台商户的折扣券核销率等）提供给其他商户和甲方。但分析结果仅供甲方参考，如甲方使用分析结果而产的任何损失与乙方无关。</dd>
          <dd>5、甲方不得向乙方或乙方关联公司的员工、顾问提供任何形式的不正当利益，不得贿赂或以其他不正当方式收买、企图收买乙方或乙方关联企业之员工、顾问为甲方提供不正当利益。</dd>
          <dd>6、甲方应按照国家法律法规规定取得从事本合同项下经营活动应具有的所有证照及资质条件并合法经营，承诺按照在口碑平台发布的优惠信息接待口碑用户并履行法律规定的售前售后义务，经营过程中不得侵犯任何第三方的合法权利（包括但不限于商标权、专利权、名称权、名誉权等等），否则若因用户纠纷或侵权纠纷导致乙方或可能导致乙方卷入该纠纷的，乙方有权（该权利为甲方不可撤销的授权）通知支付宝公司冻结甲方收款账号内与纠纷当事方（用户或被侵权人）主张的金额直至纠纷解决。</dd>
          <dd>7、如甲方在乙方平台开设的店铺中，需要展示综合体范围内商户的具体门店信息的，甲方须保证其展示的具体门店信息是在综合体管理范围内的门店，且在展示前已经取得了综合体范围内具体商户的同意和授权。如因甲方在其口碑店铺展示内容而遭受综合体范围内商户投诉、产生纠纷的，均由甲方自行解决；且保证不得因此使乙方造受任何损失。</dd>
          <dd>8、甲方通过本服务所获得的用户信息（如用户标签等）仅能用于口碑及其关联公司有关的运营活动，而不得用于其他任何商业或非商业场景。否则，乙方有权要求甲方赔偿因此给乙方或用户造成的损失。</dd>

          <dt>第四条 运营合作</dt>
          <dd>1、甲方可通过口碑平台自行或联合综合体范围内商户一起开展运营活动。</dd>
          <dd>2、无论甲方是自行或联合综合体范围内商户一起开展运营活动，如涉及需要综合体范围内商户配合的，甲方都须和综合体范围内商户针对甲方发起活动的规则、费用承担、活动方案、活动时间等内容达成一致。如因上述内容未达成一致，或综合体范围内商户未实际让用户参加活动或享受优惠，而造成综合体范围内商户、用户投诉、纠纷等，均由甲方自行解决。</dd>
          <dd>
            <p>3、甲方自行或联合综合体范围内商户一起开展的运营活动，甲方必须保证活动内容符合以下要求：</p>
            <ul>
              <li>（1）不得发布含有危害国家安全统一、社会稳定、公序良俗、社会公德，或含有淫秽、色情、不道德、欺诈、诽谤（包括商业诽谤）、恶意竞争、非法恐吓或非法骚扰的内容；</li>
              <li>（2）不得侵犯任何第三方享有的合法权利或权益的行为，包括但不限于名誉权、肖像权、知识产权（包括但不限于商标权、专利权、著作权）、商业秘密、个人隐私；</li>
              <li>（3）运营活动的营销信息或广告宣传内容均真实、有效、合法，不得侵害第三方的合法权益，不得存在恶意竞争、夸大宣传、虚假宣传或使用违反广告法规定的宣传语，或包含任何损害口碑形象的内容（包含但不限于借用口碑名义宣传与口碑不相关联的活动等）；</li>
              <li>（4）甲方应保证甲方自己应按照其发布的活动中的说明，且保证综合体范围内的商户应按照其参加的活动中的说明向用户提供完整、真实的服务，否则因此给乙方或用户造成的损失由甲方承担赔偿责任。本条款在本协议终止但甲方发布或综合体参加的优惠活动截止前继续有效。如参加甲方发起活动的综合体范围内商户未遵守上述要求而给用户、乙方等造成损失的，由甲方承担责任；</li>
              <li>（5）如在甲方发起的活动中存在用户投诉和纠纷，乙方统一转交甲方处理。</li>
            </ul>
          </dd>

          <dt>第五条  支付宝授权条款</dt>
          <dd>本协议一旦生效，即表示甲方已充分理解并同意不可撤销地授权支付宝公司可根据乙方指令对甲方支付宝账户或甲方设定的甲方门店收款支付宝账户中的保证金（如有）、余额进行如下操作，包括但不限于对保证金、账户余额进行冻结、解冻、划扣。</dd>

          <dt>第六条   免责及有限责任</dt>
          <dd>
            <p>1、乙方将按现有技术提供口碑服务，但以下情况下乙方不需要承担责任：</p>
            <ul>
              <li>（1）口碑平台系统停机维护；</li>
              <li>（2）因通信公司有线或无线通信系统、设备的检修、维护或不稳定，或黑客攻击，或电力部门技术调整或故障，或银行方面的问题等原因，或由于不可抗力事件导致乙方服务中断或不稳定，不视为乙方违约。</li>
            </ul>
          </dd>
          <dd>2、乙方不对甲方产品或服务的真实性、合法性和有效性作任何明示或暗示的担保，也不承担任何责任。</dd>

          <dt>第七条   违约责任</dt>
          <dd>1、在使用口碑平台的过程中，如甲方存在侵犯第三方（如用户、知识产权权利人）权益、违反国家法律法规或其他违反本协议的行为时，除根据本协议应向乙方支付违约金（如有）外，还应赔偿乙方因此遭受的直接损失，包括但不限于因遭受行政处罚或需向第三方承担民事责任造成的损失。</dd>
          <dd>2、乙方因故意或重大过失导致甲方利益受损时，乙方对甲方的违约和/或赔偿责任以甲方遭受的直接损失为限。</dd>

          <dt>第八条  协议终止</dt>
          <dd>1、提前解除：甲乙双方均可以提前解除本协议，但须通过合理方式提前30天通知对方。如甲方发起的活动仍在活动期限内（或具体优惠仍在有效期内的），甲方不得提前解除协议。</dd>
          <dd>
            <p>2、甲方发生下述情形时，乙方有权单方解除本协议：</p>
            <ul>
              <li>（1）违反商户制度规定且达到终止合作的程度；</li>
              <li>（2）提交的信息或文件不真实、不合法、已失效或甲方无法证明其信息或文件的真实性、合法性、有效性</li>
              <li>（3）甲方存在违反本协议或商户制度的情形，经乙方通知后，在限定的期限内未能改正。</li>
            </ul>
          </dd>

          <dt>第九条  其他约定</dt>
          <dd>1、甲乙双方合作期间，基于本协议目的，甲乙双方可以合理地使用对方的相应知识产权，包括但不限于商标、标识、产品或服务名称、LOGO等知识产权；但未经一方授权，另一方不得将一方的知识产权用于本协议目的之外的场合。</dd>
          <dd>2、就本协议的签订、履行或解释发生争议的，甲乙双方同意由杭州口口相传网络技术有限公司住所地（杭州市余杭区）人民法院管辖审理。</dd>
          <dd>3、本协议自甲方和乙方签字或盖章之日起生效，有效期一年。协议到期前三十日内，除非甲乙双方任意一方有异议的，否则本协议将自动续签一年，以此类推，反复适用。</dd>
          <dd>4、乙方有权将本协议项下的权利义务一并转让给具备履约能力的第三方，但乙方应事先通过网站公告、邮件通知等方式通知甲方。</dd>
          <dd>5、本协议所称的“通知”，包括纸质盖章文件形式，或通过甲方在乙方或乙方关联公司平台上预留的邮箱（或通过本协议约定的指定邮箱）发送邮件，或通过甲方在签约过程中在乙方或乙方关联公司平台上预留的手机号码发送短信，或通过网站、APP页面公告等方式。</dd>
          <dd>6、本协议自甲方在乙方或乙方关联公司平台点击确认的方式来确认本协议之日起生效，且该点击确认行为与甲方加盖公章或签字的行为具有相同法律效力。</dd>
          <dd>7、乙方有权随时对本协议内容进行单方面的变更，并以在www.koubei.com网站或支付宝钱包予以公布，无需另行通知甲方；若甲方在本协议内容变更公告后继续使用口碑平台服务，则表示甲方已充分阅读、理解并接受修改后的协议，也将遵循修改后的协议；若甲方不同意修改后的协议内容，甲方应停止使用口碑平台服务。</dd>
          <dd>8、双方签订本线上协议或其他在线协议后，甲方因内部管理等原因需要签订纸质协议进行确认或存档的，双方可再行签订纸质协议，但不能因此视为双方存在两个协议关系，纸质协议的内容必须与在线签署的协议内容一致，协议的生效与履行依照在线签署的协议约定执行，在线签署的协议内容与纸质协议的约定不一致的，以前者的约定为准。</dd>
        </dl>
      </div>
    );

    return (<div>
        <div className="app-detail-header" style={{borderBottom: 0}}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><a href="#/shop/backlog">待开门店</a></Breadcrumb.Item>
            <Breadcrumb.Item>流水详情</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="kb-detail-main" style={{minHeight: 500}}>
          <div>
            {
              loading && <Row style={{textAlign: 'center', marginTop: 80}}><Spin/></Row>
            }
            {
              !loading && (
                <div>
                  {(action === 'CREATE_SHOP' && shop.subStatus === 'WAIT_MERCHANT_CONFIRM') &&
                    <Alert
                    message="待商户确认"
                    description={shop.operator && ((shop.operator.name + ' 服务商邀请您加入口碑') || '')}
                    type="info"
                    showIcon />}
                  {(action === 'CREATE_SHOP' && shop.subStatus !== 'WAIT_MERCHANT_CONFIRM') &&
                  <Alert
                    message="已确认"
                    type="info"
                    showIcon />}
                  {action === 'SURROUND_SHOP' &&
                    <Alert
                    message={'“' + shopName + '”门店添加'}
                    description={shop.operator && (('本门店由 ' + shop.operator.name + ' 服务商为您添加，请你根据实际情况确认或驳回') || '')}
                    type="info"
                    showIcon />}
                  {action === 'REMOVE_SHOP' &&
                    <Alert
                    message={'“' + shopName + '”门店移除'}
                    description={shop.operator && (('本门店已由 ' + shop.operator.name + ' 服务商为您移出' + shopName + '，请你根据实际情况确认或驳回') || '')}
                    type="warning"
                    showIcon />}
                  <div>
                    <Row>
                      <Col span="24">
                        <div style={{float: 'left', marginRight: 15}}>
                          <a href={(shop.logo && shop.logo.resourceUrl) ? shop.logo.resourceUrl.replace(/&amp;/g, '&') : '#'} target="_blank" key={(shop.logo && shop.logo.resourceUrl) ? shop.logo.resourceUrl : ''}>
                            <img src={(shop.logo && shop.logo.resourceUrl) ? shop.logo.resourceUrl.replace(/&amp;/g, '&') : ''} width="130" height="100" alt="" />
                          </a>
                        </div>
                        <div>
                          <div style={{margin: '10px 0', fontSize: 14}}>{shopName}</div>
                          <div style={{margin: '10px 0'}}>
                            {shop.provinceName || ''}-
                            {shop.cityName || ''}-
                            {shop.districtName || ''}&nbsp;
                            {shop.address || ''}
                            {shop.addressDesc ? '(' + shop.addressDesc + ')' : ''}
                          </div>
                          {action === 'CREATE_SHOP' ? (
                            <div style={{margin: '15px 0'}}>
                              <Tag color={resultColor}>{logResultMap[shop.status] || shop.status}</Tag>
                            </div>
                          ) : (
                            <div style={{margin: '15px 0'}}>
                              <Tag color={resultColor}>{logFlowStatusMap[shop.statusCode] || shop.statusCode}</Tag>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <h3 className="kb-page-sub-title">基本信息</h3>
                    <table className="kb-detail-table-4">
                      <tbody>
                      <tr>
                        <td className="kb-detail-table-label">品类</td>
                        <td>{shop.categoryLabel ? (<span style={{color: '#FF6600'}}>[{shop.categoryLabel}]</span>) : ''} {shop.category || ''}</td>
                        <td className="kb-detail-table-label">提交时间</td>
                        <td>{shop.createTime ? format(new Date(shop.createTime)) : ''}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">品牌</td>
                        <td>
                          {shop.brandLevel && (shop.brandLevel === 'K1' || shop.brandLevel === 'K2') ? (<span style={{color: '#FF6600'}}>[{shop.brandLevel}]</span>) : ''}
                          {shop.brandName || ''}
                        </td>
                        <td className="kb-detail-table-label">提交人</td>
                        <td>{shop.opName || ''}{shop.opNickName && ('(' + shop.opNickName + ')')}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">品牌LOGO</td>
                        <td>
                          {(shop.logo && shop.logo.resourceUrl) && (<a href={shop.logo.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={(shop.logo && shop.logo.resourceUrl) ? shop.logo.resourceUrl : ''}>
                            <img src={(shop.logo && shop.logo.resourceUrl) ? shop.logo.resourceUrl.replace(/&amp;/g, '&') : ''}/>
                          </a>)}
                        </td>
                        <td className="kb-detail-table-label">营业时间</td>
                        <td>{shop.businessTime || ''}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">服务商</td>
                        <td>{shop.operator && (shop.operator.name || '')}</td>
                        <td className="kb-detail-table-label">联系方式</td>
                        <td>{shop.mobileNo && shop.mobileNo[0]}{(shop.mobileNo && shop.mobileNo[1]) ? (<span>/{shop.mobileNo[1]}</span>) : ''}</td>
                      </tr>
                      <tr>
                        <td className="kb-detail-table-label">门店内景</td>
                        <td colSpan="3">
                          {
                            (shop.imageList || []).map((p)=> {
                              return (
                                <a href={p.resourceUrl.replace(/&amp;/g, '&')} target="_blank" key={p.resourceUrl}>
                                  <img src={p.resourceUrl.replace(/&amp;/g, '&')}/>
                                </a>
                              );
                            })
                          }
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  {(action === 'CREATE_SHOP' && shop.subStatus === 'WAIT_MERCHANT_CONFIRM') && <div style={{marginTop: 24}}>
                    <div style={{marginBottom: 24}}>
                      <Checkbox {...getFieldProps('agreeLicense')}>同意
                        <a
                          onClick={this.showModal}
                        >《口碑商户服务协议（综合体版）》</a></Checkbox>
                    </div>
                    <AgreeFlow buttonText="同意入驻口碑" id={orderId} action={action} disabled={!getFieldValue('agreeLicense')}/>
                    <RejectFlow buttonText="驳 回" id={orderId} action={action}/>
                    <Modal
                      title="口碑综合体商户合作协议"
                      visible={this.state.visible}
                      onOk={this.handleOk}
                      onCancel={this.handleOk}
                      okText="确定"
                      cancelText="取消"
                      width="820"
                    >
                      {protocolEl}
                    </Modal>
                  </div>}
                  {(action === 'SURROUND_SHOP' && shop.subStatus === 'WAIT_MERCHANT_CONFIRM') && <div style={{marginTop: 24}}>
                    <AgreeFlow buttonText="同意添加" id={orderId} action={action}/>
                    <RejectFlow buttonText="驳 回" id={orderId} action={action}/>
                  </div>}
                  {(action === 'REMOVE_SHOP' && shop.subStatus === 'WAIT_MERCHANT_CONFIRM') && <div style={{marginTop: 24}}>
                    <AgreeFlow buttonText="同意移除" id={orderId} action={action}/>
                    <RejectFlow buttonText="驳 回" id={orderId} action={action}/>
                  </div>}
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  },
});

export default Form.create()(FlowDetail);
