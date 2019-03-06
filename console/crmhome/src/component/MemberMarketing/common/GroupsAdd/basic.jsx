// 部分内容延期，注释内容别删!
import React from 'react';
import { Form, Radio, Select, Slider, TreeSelect, DatePicker, Row, Col, Icon } from 'antd';
import ajax from '../../../../common/ajax';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const ageMarks = {
  13: '1',
  18: '18',
  20: '20',
  25: '25',
  30: '30',
  35: '35',
  40: '40',
  50: '50',
  60: '60',
  65: '100',
};

class Gender extends React.Component {
  render() {
    const { genderProps, formItemLayout } = this.props;
    return (
      <div data-gender>
        <FormItem { ...formItemLayout } label="性别：">
          <RadioGroup { ...genderProps }>
            <Radio value={1}>男</Radio>
            <Radio value={2}>女</Radio>
            <Radio value="all">全部</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    );
  }
}

class Age extends React.Component {
  render() {
    const { formItemLayout, ageProps } = this.props;
    return (
      <div data-age>
        <FormItem { ...formItemLayout } label=" ">
          <Slider { ...ageProps } range marks={ageMarks} step={null} min={13} max={65} />
        </FormItem>
      </div>
    );
  }
}

class AgeType extends React.Component {
  render() {
    const { formItemLayout, ageTypeProps } = this.props;
    return (
      <div data-age-type>
        <FormItem { ...formItemLayout } label="年龄：">
          <RadioGroup { ...ageTypeProps }>
            <Radio value="range">自定义</Radio>
            <Radio value="all">不限制</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    );
  }
}

class BirthdayMonth extends React.Component {
  render() {
    const { formItemLayout, birthdayMonthProps } = this.props;
    return (
      <div data-birthday-month>
        <FormItem { ...formItemLayout } label="生日：">
          <Select { ...birthdayMonthProps } multiple style={{ width: 400 }} placeholder="请选择生日月份">
            <Option value={1}>1月</Option>
            <Option value={2}>2月</Option>
            <Option value={3}>3月</Option>
            <Option value={4}>4月</Option>
            <Option value={5}>5月</Option>
            <Option value={6}>6月</Option>
            <Option value={7}>7月</Option>
            <Option value={8}>8月</Option>
            <Option value={9}>9月</Option>
            <Option value={10}>10月</Option>
            <Option value={11}>11月</Option>
            <Option value={12}>12月</Option>
          </Select>
        </FormItem>
      </div>
    );
  }
}

class Constellation extends React.Component {
  render() {
    const { formItemLayout, constellationProps } = this.props;
    return (
      <div data-constellation>
        <FormItem { ...formItemLayout } label="星座：">
          <Select { ...constellationProps } multiple style={{ width: 400 }} placeholder="请选择星座">
            <Option value="摩羯座">摩羯座</Option>
            <Option value="水瓶座">水瓶座</Option>
            <Option value="双鱼座">双鱼座</Option>
            <Option value="白羊座">白羊座</Option>
            <Option value="金牛座">金牛座</Option>
            <Option value="双子座">双子座</Option>
            <Option value="巨蟹座">巨蟹座</Option>
            <Option value="狮子座">狮子座</Option>
            <Option value="处女座">处女座</Option>
            <Option value="天秤座">天秤座</Option>
            <Option value="天蝎座">天蝎座</Option>
            <Option value="射手座">射手座</Option>
          </Select>
        </FormItem>
      </div>
    );
  }
}

class Behaviour extends React.Component {
  state = {
    isVerify: false,
  };

  changeBehaviour(value) {
    this.setState({
      isVerify: value !== '0',
    });
  }

  render() {
    const { formItemLayout, form, initData, pid } = this.props;
    const { getFieldProps, getFieldValue} = form;

    const applyVoucherProps = getFieldProps('applyVoucher', {
      initialValue: initData.applyVoucher,
      onChange: this.changeBehaviour.bind(this),
    });
    let userId = '';
    if (window.GLOBAL_NAV_DATA && window.GLOBAL_NAV_DATA.userId) {
      userId = window.GLOBAL_NAV_DATA.userId;
    } else if (pid) {
      userId = pid;
    }

    return (
        <div data-behaviour>
          <FormItem { ...formItemLayout } label="人群行为：">
            <Select { ...applyVoucherProps } style={{ width: 400 }} placeholder="请选择人群行为">
              <Option value="0">已领券</Option>
              <Option value="1">已领券未使用券</Option>
              <Option value="2">已领券已使用券</Option>
            </Select>
            {getFieldValue('applyVoucher') && <input type="hidden" { ...getFieldProps('userIdVoucher', {initialValue: initData.userIdVoucher || userId}) } value={userId} /> }
            { this.state.isVerify && <input type="hidden" { ...getFieldProps('verifyVoucher', {
              initialValue: initData.verifyVoucher || '0',
            }) } value="0"/> }
          </FormItem>
        </div>
    );
  }
}

class HaveBaby extends React.Component {
  render() {
    const { formItemLayout, haveBabyProps } = this.props;
    return (
      <div data-have-baby>
        <FormItem { ...formItemLayout } label="是否有小孩：">
          <RadioGroup { ...haveBabyProps }>
            <Radio value={1}>有</Radio>
            <Radio value={0}>否</Radio>
            <Radio value="all">不限制</Radio>
          </RadioGroup>
        </FormItem>
      </div>
    );
  }
}

class Occupation extends React.Component {
  render() {
    const { formItemLayout, occupationProps } = this.props;
    return (
      <div data-occupation>
        <FormItem { ...formItemLayout } label="职业：">
          <Select { ...occupationProps } multiple style={{ width: 300 }} placeholder="请选择">
            <Option value="白领">白领</Option>
            <Option value="大学生">大学生</Option>
          </Select>
        </FormItem>
      </div>
    );
  }
}

class ConsumeLevel extends React.Component {
  render() {
    const { formItemLayout, consumeLevelProps } = this.props;
    return (
      <div data-consume-level>
        <FormItem { ...formItemLayout } label="年消费能力：">
          <Select { ...consumeLevelProps } size="large" style={{ width: 300 }} placeholder="请选择">
            <Option value="低">低档</Option>
            <Option value="中">中档</Option>
            <Option value="高">高档</Option>
            <Option value="all">不限制</Option>
          </Select>
        </FormItem>
      </div>
    );
  }
}

class FirstLinkDate extends React.Component {
  render() {
    const { formItemLayout, firstLinkProps, firstLinkDateProps } = this.props;
    return (
      <div data-consume-level>
        <FormItem { ...formItemLayout } label="首次关联日期：">
          <Row key="1">
            <Col span="4">
            <Select { ...firstLinkProps } size="large" placeholder="请选择" style={{ width: 70 }}>
              <Option value="LT">早于</Option>
              <Option value="GTEQ">晚于</Option>
            </Select>
            </Col>
            <Col span="19">
            <DatePicker {...firstLinkDateProps}format="yyyy-MM-dd" size="large" style={{ width: 250, margin: 2}}/>
            </Col>
          </Row>
          <p>
          <Icon type="info-circle"
                style={{ color: '#2db7f5', marginRight: 5, fontSize: 14, verticalAlign: 'middle' }}/>
                用户成为支付会员或储值卡会员或关注服务窗口的最早时间
          </p>
        </FormItem>
      </div>
    );
  }
}

class ResidentPlace extends React.Component {
  render() {
    const { district, formItemLayout, residentPlaceProps } = this.props;
    return (
      <div data-resident-place>
        <FormItem { ...formItemLayout } label="常住地：">
          <TreeSelect { ...residentPlaceProps } treeData={district} style={{ width: 400 }}
            placeholder="请选择" multiple treeCheckable
            dropdownStyle={{ height: '300px', overflow: 'auto' }} />
        </FormItem>
      </div>
    );
  }
}

class NativePlace extends React.Component {
  render() {
    const { district, formItemLayout, nativePlaceProps } = this.props;
    return (
      <div data-resident-place>
        <FormItem { ...formItemLayout } label="籍贯：">
          <TreeSelect { ...nativePlaceProps } treeData={district} style={{ width: 400 }}
            placeholder="请选择" multiple treeCheckable
            dropdownStyle={{ height: '300px', overflow: 'auto' }} />
        </FormItem>
      </div>
    );
  }
}

class GroupsAddBasic extends React.Component {
  static propTypes = {
    formItemLayout: React.PropTypes.object,
    form: React.PropTypes.object.isRequired,
    type: React.PropTypes.oneOf(['brands', 'retailers', 'cate7']).isRequired,
    initData: React.PropTypes.object.isRequired,
  };

  static defaultProps = {
    formItemLayout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 12, offset: 1 },
    },
    initData: {},
  };

  state = { district: [] };

  componentWillMount() {
    ajax({
      url: '/district.json?level=C',
      method: 'GET',
      type: 'json',
      success: data => {
        const { district } = data;
        this.setState({ district: this.convert(district) });
      },
    });
  }

  convert(district, deep = 0) {
    return district.map(({ n: label, i: code, c: children }) => {
      if (children && deep === 0) {
        return ({
          label,
          value: code,
          key: code,
          children: this.convert(children, deep + 1),
        });
      }
      return { label, value: code, key: code };
    });
  }

  render() {
    const { form, formItemLayout, type, initData, showLinkDate, pid } = this.props;
    const { getFieldProps } = form;
    const { district } = this.state;
    const { gender, age, birthdayMonth, constellation, residentPlace, nativePlace, haveBaby,
      occupation, consumeLevel, fistLink, firstLinkDate } = initData;
    const genderProps = getFieldProps('gender', { initialValue: gender });
    const ageProps = getFieldProps('age', {
      initialValue: age,
      rules: [
        {
          validator: (rule, value, callback) => {
            const errors = [];
            if (value && value[0] === value[1]) {
              errors.push(new Error('请选择年龄区间'));
            }
            if (value && value[0] === 13 && value[1] === 65) {
              errors.push(new Error('自定义年龄区间不能全选'));
            }
            callback(errors);
          },
        },
      ],
    });

    const ageTypeProps = getFieldProps('ageType', { initialValue: age && 'range' });
    const birthdayMonthProps = getFieldProps('birthdayMonth', { initialValue: birthdayMonth });
    const constellationProps = getFieldProps('constellation', { initialValue: constellation });
    const residentPlaceProps = getFieldProps('residentPlace', { initialValue: residentPlace });
    const nativePlaceProps = getFieldProps('nativePlace', { initialValue: nativePlace });
    const haveBabyProps = getFieldProps('haveBaby', { initialValue: haveBaby });
    const occupationProps = getFieldProps('occupation', { initialValue: occupation });
    const consumeLevelProps = getFieldProps('consumeLevel', { initialValue: consumeLevel });
    const firstLinkProps = getFieldProps('firstLink', {initialValue: fistLink || 'LT'});
    const firstLinkDateProps = getFieldProps('firstLinkDate', { initialValue: firstLinkDate });

    return (
      <groups-add-basic>
        <div><span>基本特征</span></div>
        <Gender genderProps={genderProps} formItemLayout={formItemLayout} />
        <AgeType ageTypeProps={ageTypeProps} formItemLayout={formItemLayout} />
        {ageTypeProps.value === 'range' &&
          <Age ageProps={ageProps} formItemLayout={formItemLayout} />
        }
        <BirthdayMonth birthdayMonthProps={birthdayMonthProps} formItemLayout={formItemLayout} />
        <Constellation constellationProps={constellationProps} formItemLayout={formItemLayout} />
        {
          type === 'brands' &&
            <Behaviour form={form} initData={initData} formItemLayout={formItemLayout} pid={pid} />
        }
        <ResidentPlace residentPlaceProps={residentPlaceProps} formItemLayout={formItemLayout}
          district={district} />
        {
          type === 'cate7' &&
          <NativePlace nativePlaceProps={nativePlaceProps} formItemLayout={formItemLayout}
            district={district} />
        }
        <HaveBaby haveBabyProps={haveBabyProps} formItemLayout={formItemLayout} />
        <Occupation occupationProps={occupationProps} formItemLayout={formItemLayout} />
        <ConsumeLevel consumeLevelProps={consumeLevelProps} formItemLayout={formItemLayout} />
        {showLinkDate && <FirstLinkDate firstLinkProps={firstLinkProps}
          firstLinkDateProps={firstLinkDateProps} formItemLayout={formItemLayout} />}
      </groups-add-basic>
    );
  }
}

export default GroupsAddBasic;
