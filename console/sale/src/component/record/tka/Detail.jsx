import React from 'react';
import { Alert, Tag } from 'antd';
import { DetailTable } from 'hermes-react';
import { Page, Block } from '@alipay/kb-framework-components/lib/layout';
import moment from 'moment';
import { getRecordDetail } from './common/api';
import {
  DigitalGroupingType,
  DigitalFeedbackTypeGrouped,
  DigitalGroupingText,
  DigitalFeedbackAllText,
  DigitalFeedbackStatusText,
} from './common/enum';
import { visitWayMap } from './ListTable';
import AuditControlButtons from './component/AuditControlButtons';
import ExpandText from './component/ExpandText';
import './tka-record-detail.less';

const VISIT_PURPOSE_TKA_MAP = {
  NEED_INTENT_TALK: '需求&意向沟通',
  SIGN_PLAN_TALK: '签约计划沟通',
  ACTIVITY_REPLAY: '活动复盘',
  OTHER_TKA: '其他',
};

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.recordId = this.props.params.recordId;
    this.state = {
      loading: false,
      data: {},
      labelValue: {},
      digitalFeedbackGroupData: {},
    };
  }

  componentDidMount() {
    getRecordDetail(this.recordId)
      .then(res => {
        const digitalFeedBack = res.data.digitalFeedBack || {};
        const digitalFeedbackGroupData = {}; // 格式： { 分组类型: { 条目1: 值, 条目2: 值 } };
        Object.keys(DigitalGroupingType).forEach(groupType => {
          const groupValueObj = {};
          Object.keys(DigitalFeedbackTypeGrouped[groupType]).forEach(
            digitalFeedBackCode => {
              groupValueObj[digitalFeedBackCode] =
                digitalFeedBack[digitalFeedBackCode];
            }
          );
          digitalFeedbackGroupData[groupType] = groupValueObj;
        });
        this.setState({
          loading: false,
          data: res.data,
          digitalFeedbackGroupData,
          hasDigitalFeedBackData:
            Object.values(digitalFeedBack).filter(v => v).length > 0,
        });
      })
      .catch(e => console.warn(e));
  }

  getContactsText() {
    const { data } = this.state;
    if (!data.contacts || data.contacts.length === 0) return null;
    function getPositionTest(contact) {
      return `${
        contact.position === 'OTHER' ? contact.remark : contact.positionDesc
      }`;
    }
    return data.contacts
      .map(
        contact =>
          `${getPositionTest(contact)}-${contact.name}` +
          (contact.tel ? `(${contact.tel || ''})` : '')
      )
      .join('、');
  }

  render() {
    const {
      loading,
      data,
      digitalFeedbackGroupData,
      hasDigitalFeedBackData,
    } = this.state;
    return (
      <div className="tka-record-detail">
        <Page
          spinning={loading}
          breadcrumb={[
            {
              title: '拜访小记',
              link: '#/tka-record',
            },
            {
              title: '查看详情',
            },
          ]}
        >
          {data.invalidReason && (
            <Alert
              message="无效原因"
              description={<ExpandText text={data.invalidReason} />}
              type="error"
              showIcon
            />
          )}
          <div className="detail-box">
            <div>
              <a
                href={`/sale/index.htm#/tka/merchant/detail/${data.customerId}`}
                className="ft-16"
                target="_blank"
                style={{ verticalAlign: 'middle' }}
              >
                {data.customerName}
              </a>
              {data.auditResult === '0' && (
                <Tag color="red" className="fn-ml8">
                  无效
                </Tag>
              )}
              {data.auditResult === '1' && (
                <Tag color="green" className="fn-ml8">
                  有效
                </Tag>
              )}
            </div>
            <div className="ft-gray">{data.customerId}</div>
            <div className="ft-gray">
              拜访人：
              <span className="ft-black">{data.creatorName}</span>
            </div>
            {data.restVisitUser && (
              <div className="ft-gray">
                陪访人：
                <span className="ft-black">{data.restVisitUser}</span>
              </div>
            )}
            <div className="detail-tags fn-mt8">
              {data.visitPurposes &&
                data.visitPurposes.map((purpose, i) => (
                  <Tag color="yellow" key={i}>
                    {VISIT_PURPOSE_TKA_MAP[purpose]}
                  </Tag>
                ))}
            </div>
          </div>

          <Block title="拜访详情">
            <DetailTable
              dataSource={[
                {
                  label: '拜访分公司',
                  value: data.companyName,
                  colSpan: 5,
                  isSkipped: !data.companyName,
                },
                {
                  label: '拜访时间',
                  value:
                    data.visitTime &&
                    moment(new Date(data.visitTime)).format('YYYY/MM/DD'),
                  colSpan: 5,
                },
                {
                  label: '拜访对象',
                  value: this.getContactsText(),
                  colSpan: 5,
                },
                {
                  label: '拜访方式',
                  value: visitWayMap[data.visitWay],
                  colSpan: 5,
                },
              ]}
            />
          </Block>

          {hasDigitalFeedBackData && (
            <Block title="数字化程度反馈">
              {Object.entries(DigitalGroupingText).map(
                ([groupType, groupName]) => (
                  <div key={groupType}>
                    <p
                      style={{
                        color: '#999',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                      }}
                    >
                      {groupName}
                    </p>
                    <DetailTable
                      dataSource={Object.entries(
                        digitalFeedbackGroupData[groupType] || {}
                      ).map(([key, value]) => ({
                        label: DigitalFeedbackAllText[key],
                        value: DigitalFeedbackStatusText[value],
                      }))}
                    />
                  </div>
                )
              )}
            </Block>
          )}

          <Block title="具体拜访内容">
            <DetailTable
              dataSource={[
                {
                  label: '需求&意向沟通-沟通结果',
                  value: data.needTalkResult,
                  colSpan: 5,
                  isSkipped: !data.needTalkResult,
                },
                {
                  label: '签约计划沟通-沟通结果',
                  value: data.signTalkResult,
                  colSpan: 5,
                  isSkipped: !data.signTalkResult,
                },
                {
                  label: '活动复盘-沟通结果',
                  value: data.activityTalkResult,
                  colSpan: 5,
                  isSkipped: !data.activityTalkResult,
                },
                {
                  label: '其他-沟通结果',
                  value: data.otherTalkResult,
                  colSpan: 5,
                  isSkipped: !data.otherTalkResult,
                },
                {
                  label: '下一步计划',
                  value: data.followPlan,
                  colSpan: 5,
                  isSkipped: !data.followPlan,
                },
                {
                  label: '其他备注',
                  value: data.visitDesc,
                  colSpan: 5,
                  isSkipped: !data.visitDesc,
                },
              ]}
            />
          </Block>

          {data.isAudit === '1' && (
            <div>
              审阅拜访记录：
              <AuditControlButtons
                recordId={this.recordId}
                approveFinish={() => location.reload()}
              />
            </div>
          )}
        </Page>
      </div>
    );
  }
}

export default Detail;
