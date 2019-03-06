import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { page } from '@alipay/page-wrapper';
import { Page } from '@alipay/kb-biz-components';
import { Form, Input, Row, Col, Table } from 'antd';
import moment from 'moment';
import framework from '../common/framework';
import store from './store';
import { indexType } from './prop-type';
import spmConfig from './spm.config';
import './style.less';

const { shape, object, func, string } = PropTypes;
const createForm = Form.create;
const FormItem = Form.Item;
@framework()
@page({ store, spmConfig })
class Index extends PureComponent {
  static propTypes = {
    initData: shape(indexType),
    list: object,
    dispatch: func,
    id: string,
    type: string,
    logListData: object,
    form: object,
  };

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({ type: 'queryLogList', payload: { bizId: id, bizType: 'SPI_MANAGE' } });
  }

  versionRollback = (dispatch, id) => {
    dispatch({ type: 'rollBackSpiConfig', payload: { id } });
  }

  render() {
    const { logListData: { bizType, bizLog }, id, form: { getFieldProps } } = this.props;
    const breadcrumb = [
      {
        title: 'SPI详情',
        link: `#/spi/spiDetail/${id}`,
      },
      {
        title: '操作日志',
      },
    ];
    const columns = [
      {
        title: '操作人',
        width: '100',
        dataIndex: 'operatorName',
      },
      {
        title: '操作类型',
        width: '100',
        dataIndex: 'action',
      },
      {
        title: '操作时间',
        width: '150',
        dataIndex: 'gmtModified',
        render: (text) => (
          <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: '原值',
        width: '150',
        dataIndex: 'oldContent',
      },
      {
        title: '现值',
        width: '150',
        dataIndex: 'newContent',
      },
    ];

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    return (
      <Page id="spiOperationLog" title="操作日志" breadcrumb={breadcrumb}>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={7}>
              <FormItem {...formItemLayout} label="业务类型" hasFeedback>
                <Input {...getFieldProps('bizType', {
                  initialValue: bizType || undefined,
                })} placeholder="请输入业务类型" />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table columns={columns}
                dataSource={bizLog}
                bordered
                pagination={false} />
            </Col>
          </Row>
        </Form>
      </Page>
    );
  }
}

export default createForm()(Index);
