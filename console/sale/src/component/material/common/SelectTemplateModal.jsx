import React, { Component } from 'react';
import { Modal, Form, Table, Input, Select, Row, Col, DatePicker, Button, message } from 'antd';
import moment from 'moment';
import { getStuffTemplateList } from './api';
import { StuffType, StuffTypeText, TemplateStatusText } from './enum';
import { getUrlByResourceId } from 'Common/utils';
import ImagePreview from 'Library/ImagePreview';
import trim from 'lodash/trim';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class TemplatePicker extends Component {
  constructor() {
    super();
  }
  state = {
    list: [],
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0
    },
    loading: false
  };
  componentDidMount() {
    this.loadList();
  }
  loadList = next => {
    const { pagination } = this.state;
    const filterFormData = this.props.form.getFieldsValue();
    filterFormData.name = trim(filterFormData.name);
    const params = {
      ...pagination,
      ...filterFormData,
      templateIdsFilter: 1, // 只查询有价格的模板
      pageNum: next || pagination.current
    };
    const createTime = filterFormData.createTime;
    if (filterFormData.createTime) {
      params.startTime = moment(createTime[0]).hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
      params.endTime = moment(createTime[1]).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
    }
    this.setState({loading: true});
    getStuffTemplateList(params)
      .then(res => {
        this.setState({
          loading: false,
          pagination: {
            ...pagination,
            current: next || pagination.current,
            total: res.data.pager.totalSize
          },
          list: res.data.values
        });
      })
      .catch(
        () => this.setState({
          loading: false,
          pagination: {
            ...pagination,
            current: 1,
            total: 0,
          },
          list: []
        })
      );
  };
  reset = () => {
    this.props.form.resetFields();
  };
  handleSearch = () => {
    this.loadList(1);
  };
  handleSelectTemplate = (selectedRowKeys, selectedRows) => {
    this.props.onChange(selectedRows[0]);
  };
  render() {
    const { list, loading, pagination } = this.state;
    const { getFieldProps } = this.props.form;
    const columns = [
      {
        title: '模板名称/ID',
        dataIndex: '',
        render: (text, record) => (<div><span>{record.templateName}</span><br/><span>{record.templateId}</span></div>)
      },
      {
        title: '模板状态',
        dataIndex: 'status',
        render: t => TemplateStatusText[t]
      },
      {
        title: '模板创建人/时间',
        dataIndex: '',
        render: (text, record) => (<div><span>{record.creatorName}</span><br/><span>{moment(record.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</span></div>)
      },
      {
        title: '物料类型/属性/尺寸',
        dataIndex: '',
        render: (text, record) => (<div><span>{record.stuffAttrName}</span>/<span>{StuffTypeText[record.stuffType]}</span>/<span>{record.sizeName}</span></div>)
      },
      {
        title: '示例图',
        dataIndex: '',
        render: (text, record) => {
          const [imgId, ] = record.resourceIds;
          return imgId ? <ImagePreview imgSrc={getUrlByResourceId(imgId)} style={{width: 80}}/> : null;
        }
      }
    ];
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };
    const renderPagination = {
      ...pagination,
      onChange: next => this.loadList(next),
      showQuickJumper: true,
      showTotal: total => `共${total}条`
    };
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.props.selected ? [this.props.selected] : [],
      onChange: this.handleSelectTemplate
    };
    return (
      <div>
        <Form horizontal className="ant-advanced-search-form" style={{marginBottom: 20}}>
          <Row gutter={16}>
            <Col sm={8}>
              <FormItem
                label="模板名称"
                {...formItemLayout}
              >
                <Input
                  {...getFieldProps('name', {
                    initialValue: ''
                  })}
                  placeholder="请输入模板名称"
                  size="default"
                />
              </FormItem>
              <FormItem
                label="模板ID"
                {...formItemLayout}
              >
                <Input
                  {...getFieldProps('templateId', {
                    initialValue: ''
                  })}
                  placeholder="请输入模板ID"
                  size="default"
                />
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem
                label="创建人"
                {...formItemLayout}
              >
                <Input
                  {...getFieldProps('creator', {
                    initialValue: ''
                  })}
                  placeholder="请输入创建人"
                  size="default"
                />
              </FormItem>
              <FormItem
                label="创建时间"
                {...formItemLayout}
              >
                <RangePicker {...getFieldProps('createTime', {
                  initialValue: ''
                })} size="default" />
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem
                label="物料类型"
                {...formItemLayout}
              >
                <Input
                  {...getFieldProps('stuffAttrName', {
                    initialValue: ''
                  })}
                  placeholder="请输入物料类型"
                  size="default"
                />
              </FormItem>
              <FormItem
                label="物料属性"
                {...formItemLayout}
              >
                <Select
                  {...getFieldProps('stuffType', {initialValue: ''})}
                  size="default">
                  <Option value="">全部</Option>
                  {Object.keys(StuffType).map(k => <Option value={k} key={k}>{StuffTypeText[k]}</Option>)}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12} offset={12} style={{ textAlign: 'right' }}>
              <Button loading={loading} type="primary" onClick={this.handleSearch}>搜索</Button>
              <Button style={{marginLeft: 10}} onClick={this.reset}>清除条件</Button>
            </Col>
          </Row>
        </Form>
        <Table dataSource={list} columns={columns} pagination={renderPagination} rowSelection={rowSelection} rowKey="templateId"/>
      </div>
    );
  }
}

TemplatePicker = Form.create()(TemplatePicker);

export default class SelectTemplateModal extends Component {
  constructor() {
    super();
  }

  state = {
    selected: ''
  };

  componentWillReceiveProps(next) {
    if (next.selected !== this.state.selected) {
      this.setState({selected: next.selected});
    }
  }

  selectedTemplateObject = null;

  handleClickOk = () => {
    const selected = this.state.selected;
    const { onChange, close } = this.props;
    if (!selected) {
      message.error('请选择模板');
      return;
    }
    onChange(this.selectedTemplateObject);
    close();
  };

  handleChange = template => {
    this.setState({selected: template.templateId});
    this.selectedTemplateObject = template;
  };

  render() {
    const { visible, close } = this.props;
    return (
      <Modal
        visible={visible}
        title="选择模板"
        width={960}
        onOk={this.handleClickOk}
        onCancel={close}
      >
        <TemplatePicker onChange={this.handleChange} selected={this.state.selected}/>
      </Modal>
    );
  }
}
