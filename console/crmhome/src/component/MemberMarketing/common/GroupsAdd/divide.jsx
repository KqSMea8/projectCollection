import React from 'react';
import { Form, Checkbox, Icon, message, Popover } from 'antd';
import Template from './DivideTemplate.jsx';
import ajax from '../../../../common/ajax';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const checkboxOpts = [
  {label: 'VIP', value: 0},
  {label: '常客', value: 1},
  {label: '新客', value: 2},
  {label: '过客', value: 3},
  {label: '流失客', value: 4},
];

class GroupDivide extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object,
    form: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 },
    },
  }

  state = {
    data: null,
  }

  componentWillMount() {
    ajax({
      url: (window.ownUrl || '') + '/promo/merchant/crowd/grade.json',
      method: 'GET',
      type: 'json',
      error: (res, errorMsg) => {
        message.error(errorMsg, 3);
      },
    }).then(({status, data, errorMsg}) => {
      if (status === 'success') {
        this.setState({ data });
      } else if (errorMsg) {
        message.error(errorMsg, 3);
      }
    });
  }

  render() {
    const { form, formItemLayout } = this.props;
    const { getFieldProps } = form;
    const { data } = this.state;
    return (
      <groups-custom-divide>
        <div>
          <span>会员分层</span>
        </div>
        <FormItem { ...formItemLayout } label="会员分层：">
          <CheckboxGroup options={checkboxOpts}
            {...getFieldProps('memberGrade', { initialValue: [] }) }
            />
          <div style={{ display: 'inline-block' }}>
            <Popover
              trigger="click" title={<h4>会员分层</h4>}
              content={ data && <Template data={data} />}
              >
              <Icon type="info-circle"
                style={{ cursor: 'pointer', color: '#2db7f5', marginRight: 5, fontSize: 18, verticalAlign: 'middle' }}
                />
            </Popover>
          </div>
        </FormItem>
      </groups-custom-divide>
    );
  }
}

export default GroupDivide;
