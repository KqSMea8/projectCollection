import React from 'react';
import { Form, Breadcrumb, message } from 'antd';
import { Link } from 'react-router';
import { GroupsAddName, GroupsAddBasic, GroupAddIndustry, GroupsAddSubmit, convert, validate,
  filter } from '../../../common/GroupsAdd';
import ajax from '../../../../../common/ajax';

import './style.less';

const createForm = Form.create;

class BrandsGroupsAdd extends React.Component {
  static propTypes = {
    form: React.PropTypes.object.isRequired,
  }

  state = { tagsCount: 0 }

  componentWillReceiveProps(nextProps) {
    const { getFieldsValue } = nextProps.form;
    const values = getFieldsValue();
    const values2 = filter(values);
    const tagsCount = convert(values2).length;
    this.setState({ tagsCount });
  }

  onSubmit(e) {
    e.preventDefault();
    const { form, history } = this.props;
    const { validateFieldsAndScroll } = form;
    const { tagsCount } = this.state;
    if (tagsCount === 0) {
      message.error('至少选定一个标签');
      return;
    }
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const values2 = filter(values);
        if (validate(values2)) {
          ajax({
            url: '/promo/brand/crowd/create.json',
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
              setTimeout(() => history.pushState(null, '/marketing/brands'), 2000);
            },
          });
        }
      }
    });
  }

  getParam() {
    const query = {};
    location.search.slice(1).split('&').forEach(equation => {
      const [key, value] = equation.split('=');
      if (value !== undefined) {
        query[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return query;
  }

  render() {
    const { form } = this.props;
    const { tagsCount } = this.state;
    const pid = this.getParam().op_merchant_id;
    return (
      <brands-groups-add>
        <h2>精准营销</h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to="/marketing/brands">精准营销</Link></Breadcrumb.Item>
          <Breadcrumb.Item>创建自定义人群</Breadcrumb.Item>
        </Breadcrumb>
        <Form horizontal form={form} onSubmit={::this.onSubmit}>
          <GroupsAddName form={form} type="brands" />
          <div><strong>{tagsCount}</strong> 个标签已选</div>
          <GroupsAddBasic form={form} type="brands" pid={pid} />
          <GroupAddIndustry form={form} type="brands" />
          <GroupsAddSubmit />
        </Form>
      </brands-groups-add>
    );
  }
}

export default createForm()(BrandsGroupsAdd);
