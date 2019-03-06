import React, {PropTypes} from 'react';
import { Row, Col, Form, Select, Radio, Button, message, Modal, Input} from 'antd';
import Table from '../../../common/Table';
import ajax from 'Utility/ajax';
import '../record.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

const RecordConfigIndex = React.createClass({
  propTypes: {
    children: PropTypes.any,
    params: PropTypes.object,
    location: PropTypes.any,
  },
  getInitialState() {
    const data = [{
      title: '111111',
      type: 'ssss',
      necessary: 'safafafaf',
      options: 'adfasdfasdf',
      notes: 'hahahaha',
    }];
    const columns = [
      {
        title: '字段标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '是否必填',
        dataIndex: 'necessary',
        key: 'necessary',
      },
      {
        title: '选项',
        dataIndex: 'options',
        key: 'options',
        // render: (t) => {
        //   return (<span>{activityTypeMap[t]}</span>);
        // },
      },
      {
        title: '控件填写提示文案',
        dataIndex: 'notes',
        key: 'notes',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        render: (v, row) => {
          return (
            <span>
              <a onClick={this.doDelete}>删除</a>
              <span className="ft-bar">|</span>
              <a onClick={this.addField.bind(this, row)}>修改</a>
            </span>
          );
        },
      },
    ];
    return {
      columns,
      data,
      loading: false,
      pagination: {
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      visible: false,
    };
  },

  componentDidMount() {
    this.fetch();
  },

  onSearch(params) {
    const {role} = this.state;
    if (role[1] === 'bd') {
      params.customerType = 'SHOP';
      if (this.props.children) {
        if (this.props.children.key === 'leads') {
          params.customerType = 'PRIVATE_LEADS';
        } else if (this.props.children.key === 'shop') {
          params.customerType = 'SHOP';
        }
      }
    } else {
      params.customerType = 'BRAND';
    }
    this.setState({
      params,
    });
  },
  doDelete(row) {
    // 删除操作
    confirm({
      title: '你是否确认删除这项内容',
      content: '删除后，该模板不再出现此选项',
      onOk: () => {
        ajax({
          url: '/market/deleteActivityPlan.json',
          method: 'post',
          data: {
            id: row.id,
          },
          type: 'json',
          success: (res) => {
            if (res.status === 'succeed') {
              message.success(res.resultMsg || '删除成功');
              this.props.onRefresh(res);
            }
          },
        });
      },
    });
  },
  handleOk() {
    this.props.form.validateFieldsAndScroll((errors) => {
      if (!errors) {
        const {campId, campStatusFlag, merchantId} = this.state;
        this.handleOffline(campId, campStatusFlag, merchantId);
      }
    });
  },
  handleCancel() {
    this.setState({
      visible: false,
    });
  },
  addField(rowData, e) {
    e.preventDefault();
    this.setState({visible: true});
  },
  fetch() {
    ajax({
      url: '/sale/visitrecord/queryLoginRole.json',
      method: 'get',
      success: (result) => {
        this.setState({
          role: result.data,
          userType: result.userChannel,
          isExportVisitRecord: result.isExportVisitRecord === 'Y',
        });
      },
    });
    if (this.props.params.brandId) {
      this.onSearch({customerId: this.props.params.brandId});
    }
  },

  render() {
    const {columns, data, loading, pagination, visible} = this.state;
    const {getFieldProps, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: { span: '4', offset: 1 },
      wrapperCol: { span: '16'},
    };
    const showSelection = getFieldValue('followUp') === 'S' || getFieldValue('followUp') === 'M';
    const optionData = [
      {
        n: 'afaf',
        i: '0'
      },
      {
        n: 'afafaaf',
        i: '1'
      },
      {
        n: 'afafdafaf',
        i: '2'
      }
    ];
    const options = optionData.map(row => <Option values={row.n} key={row.i}>{row.n}</Option>);
    return (<div>
      <div className="app-detail-header">小记模板配置</div>
      <div className="app-detail-content-padding">
        <Form className="advanced-search-form" horizontal>
          <Row>
            <Col span="4">
              <FormItem
               { ...formItemLayout }>
                  <Select
                    onChange={this.heandleSelect}
                    size="large"
                    placeholder="浙江/杭州"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.values.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    style={{ width: 200 }}
                  >
                    {options}
                  </Select>
              </FormItem>
            </Col>
            <Col span="16">
            <FormItem { ...formItemLayout }>
              <RadioGroup {...getFieldProps('followUp', { initialValue: ''})}>
                <RadioButton value="">物料铺设模板</RadioButton>
                <RadioButton value="T">门店维护模板</RadioButton>
                <RadioButton value="F">营销活动模板</RadioButton>
                <RadioButton value="S">签约开店模板</RadioButton>
              </RadioGroup>
            </FormItem>
          </Col>
          </Row>
        </Form>
        <div className="word-intro">
          <p className="word-intro-title">固定字段</p>
        </div>
        <div style={{paddingLeft: '6px'}}>拜访门店、拜访时间、拜访对象、拜访目的、拜访描述、现场照片</div>
        <div className="word-intro">
          <p className="word-intro-title" style={{float: 'left'}}>自定义字段</p>
          <Button onClick={this.addField.bind(this, {})} type="primary" size="large" style={{float: 'right'}} >新增字段</Button>
        </div>
        <div style={{marginTop: '10px'}}>
          <Table columns={columns}
          rowKey={r => r.campId}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={this.onTableChange}
          bordered/>
        </div>
        <Modal title="新增字段" visible={visible} width="1060"
          onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form horizontal>
              <FormItem label="字段标题：" extra="不超过6个字" {...formItemLayout}>
                <Input type="text" {...getFieldProps('reason', {
                  rules: [
                    { required: true, message: '此处必填'},
                    { max: 6, message: '不超过6个字'},
                  ],
                })}/>
              </FormItem>

              <FormItem label="类型：" {...formItemLayout}>
                <RadioGroup {...getFieldProps('followUp', {
                  initialValue: 'C',
                  rules: [
                    { required: true, message: '此处必填'},
                  ],
                })}>
                <RadioButton value="D">日期时间型</RadioButton>
                <RadioButton value="C">普通文本型</RadioButton>
                <RadioButton value="S">单选型</RadioButton>
                <RadioButton value="M">多选项</RadioButton>
              </RadioGroup>
              </FormItem>
            { showSelection && <div>
              <FormItem label="选项：" required {...formItemLayout}>
                  <Input type="text" addonBefore="选项一" {...getFieldProps('optionsOne', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '此处必填'},
                      { max: 10, message: '不超过10个字'},
                    ],
                  })}/>
              </FormItem>

              <FormItem required {...formItemLayout} wrapperCol={{span: 16, offset: 5}}>
                <Input type="text" addonBefore="选项二" {...getFieldProps('optionsTwo', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '此处必填'},
                    { max: 10, message: '不超过10个字'},
                  ],
                })}/>
              </FormItem>

              <FormItem required {...formItemLayout} wrapperCol={{span: 16, offset: 5}}>
                <Input type="text" addonBefore="选项三" {...getFieldProps('optionsThree', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '此处必填'},
                    { max: 10, message: '不超过10个字'},
                  ],
                })}/>
              </FormItem>

              <FormItem required {...formItemLayout} wrapperCol={{span: 16, offset: 5}}>
                <Input type="text" addonBefore="选项四" {...getFieldProps('optionsFour', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '此处必填'},
                    { max: 10, message: '不超过10个字'},
                  ],
                })}/>
              </FormItem>

              <FormItem required {...formItemLayout} wrapperCol={{span: 16, offset: 5}}>
                <Input type="text" addonBefore="选项五" {...getFieldProps('optionsFive', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '此处必填'},
                    { max: 10, message: '不超过10个字'},
                  ],
                })}/>
              </FormItem></div>
            }
              <FormItem
              label="是否需要营销方案："
              required
              {...formItemLayout}>
                <RadioGroup {...getFieldProps('needTemplate', {
                  initialValue: 'false',
                  rules: [
                    { required: true, message: '此处必填'},
                  ],
                })}>
                  <Radio value="false" >必填</Radio>
                  <Radio value="true">非必填</Radio>
                </RadioGroup>
            </FormItem>

            <FormItem label="填写提示文案：" placeholder="选填" extra="限10个字" {...formItemLayout}>
                <Input type="text" {...getFieldProps('notes', {
                  rules: [
                    { required: false},
                    { max: 10, message: '不超过10个字'},
                  ],
                })}/>
              </FormItem>
            </Form>
        </Modal>
      </div>
    </div>);
  },
});

export default Form.create()(RecordConfigIndex);
