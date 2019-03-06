import React from 'react';
import { Form, Breadcrumb, message } from 'antd';
import { Link } from 'react-router';
import { GroupsAddName, GroupsAddBasic, GroupAddIndustry, GroupsAddSubmit, GroupsAddConsumer,
  GroupsAddLocation, convert, validate, filter, GroupCustomerDivide, GroupsAddTarget } from '../../../common/GroupsAdd';
import ajax from '../../../../../common/ajax';
import './style.less';

const createForm = Form.create;
class RetailersGroupsAdd extends React.Component {
  static propTypes = {
    form: React.PropTypes.object.isRequired,
  }

  state = { count: -1, tagsCount: 0, memberCount: 0, memberType: '', showCheck: true, memberNumber: {} }

  componentWillReceiveProps(nextProps) {
    const { getFieldsValue } = nextProps.form;
    const { memberCount } = this.state;
    const values = getFieldsValue();
    const values2 = filter(values);
    const tagsCount = convert(values2).length + memberCount;
    this.setState({ tagsCount });
  }

  onSubmit(e) {
    e.preventDefault();
    const { history, form } = this.props;
    const { validateFieldsAndScroll } = form;
    const { tagsCount, memberType, showCheck } = this.state;
    if (tagsCount === 0) {
      message.error('至少选定一个标签');
      return;
    } else if (showCheck && !memberType) {
      message.error('请至少选择1个类型');
      return;
    }
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const values2 = filter(values);
        if (showCheck) {
          values2.memberType = memberType || 'member_pay';
        }
        if (validate(values2)) {
          ajax({
            url: '/promo/merchant/crowd/create.json',
            method: 'POST',
            data: {
              jsonDataStr: JSON.stringify({
                crowdName: values.name,
                crowdCondition: convert(values2),
              }),
            },
            type: 'json',
            success: () => {
              message.success('人群创建成功，即将跳转到人群列表页', 2);
              setTimeout(() => history.pushState(null, '/marketing/retailers'), 2000);
            },
          });
        }
      }
    });
  }

  onClick(e) {
    e.preventDefault();
    const { getFieldsValue } = this.props.form;
    const { tagsCount, memberType, showCheck } = this.state;
    if (tagsCount === 0) {
      message.error('至少选定一个标签');
      return;
    } else if (showCheck && !memberType) {
      message.error('请至少选择1个类型');
      return;
    }
    const values = getFieldsValue();
    const values2 = filter(values);
    if (showCheck && memberType) {
      values2.memberType = memberType;
    }
    if (validate(values2)) {
      ajax({
        url: '/promo/merchant/crowd/calculation.json',
        method: 'POST',
        data: {
          jsonDataStr: JSON.stringify({
            crowdCondition: convert(values2),
          }),
        },
        type: 'json',
        success: response => {
          const { data } = response;
          this.setState({ count: data });
        },
      });
    }
  }

  handleTarget(text) {
    const { getFieldsValue } = this.props.form;
    const values = getFieldsValue();
    const values2 = filter(values);
    const count = convert(values2).length;
    this.setState({ memberType: text });
    if (text) {
      this.setState({
        memberCount: 1,
        tagsCount: count + 1,
      });
    } else {
      this.setState({
        memberCount: 0,
        tagsCount: count,
      });
    }
  }

  handleCheck() {
    this.setState({
      showCheck: false,
    });
  }
  render() {
    const { form } = this.props;
    const { count, tagsCount, showCheck } = this.state;
    return (
      <retailers-groups-add>
        <h2>会员营销</h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/marketing/retailers">会员营销</Link></Breadcrumb.Item>
          <Breadcrumb.Item>创建自定义人群</Breadcrumb.Item>
        </Breadcrumb>
        <Form horizontal form={form} onSubmit={::this.onSubmit}>
          <GroupsAddName form={form} count={count} onClick={::this.onClick} type="retailers" />
          <div><strong>{tagsCount}</strong> 个标签已选</div>
          <GroupsAddTarget handleTarget={::this.handleTarget} handleCheck={::this.handleCheck}/>
          <GroupsAddBasic form={form} type="retailers" showLinkDate={showCheck}/>
          <GroupsAddConsumer form={form} />
          <GroupsAddLocation form={form} />
          <GroupAddIndustry form={form} type="retailers" />
          { window.APP.isSuperMarket === 'true' && <GroupCustomerDivide form={form} /> }
          <GroupsAddSubmit />
        </Form>
      </retailers-groups-add>
    );
  }
}

export default createForm()(RetailersGroupsAdd);
