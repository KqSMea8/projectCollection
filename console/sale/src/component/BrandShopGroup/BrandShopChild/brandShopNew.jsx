// 新增品牌门店组
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal, message } from 'antd';
import { PageNoAuth } from '@alipay/kb-framework-components';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import DefaultSelfUserSelect from '../component/DefaultSelfUserSelect';
import { UserSelect } from '@alipay/kb-biz-components';
import permission from '@alipay/kb-framework/framework/permission';
import BrandSelect from '../../../common/BrandSelect';
import {
  createNewShopGroup,
  modifyShopGroup,
  queryShopGroupDetail,
} from '../common/api';
import './brandShopNew.less';

const createForm = Form.create;
const FormItem = Form.Item;
const { object } = PropTypes;
/* eslint-disable */
class BrandShopNew extends React.Component {
  static propTypes = {
    form: object,
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleButton: true,
      detailData: {},
      ownerId: '',
    };
  }

  componentDidMount() {
    if (this.props.params.id) {
      // 为修改门店分组
      queryShopGroupDetail({ groupId: this.props.params.id })
        .then(res => {
          this.setState({
            detailData: res.data,
            groupId: res.data.groupId,
          });
        })
        .catch(res => {
          if (!res.success) {
            message.error('系统错误');
          }
          this.setState({ deleteLoading: false });
          return res;
        });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      // 判断校验是否通过
      if (!!errors) {
        message.error('提交失败');
        const getFieldError = this.props.form.getFieldError;
        const errMsgs = Object.keys(errors).map(
          key => getFieldError(key) && getFieldError(key)[0]
        );
        Modal.error({
          title: '提交失败',
          content: `失败原因：${errMsgs.join('、')}`,
        });
        return;
      }
      if (values.memo && !values.memo.trim()) {
        // 全是空格的情况
        message.error('提交失败');
        Modal.error({
          title: '提交失败',
          content: `失败原因：输入的备注不可全是空字符串`,
        });
        return false;
      }

      const obj = {
        groupId: this.state.groupId,
        groupName: values.groupName,
        ownerId: values.insideTheSmall2.id,
        brandId: values.brandId,
        memo: values.memo,
      };
      if (!this.props.params.id) {
        // 新增页面提交
        createNewShopGroup(obj)
          .then(res => {
            message.success('提交成功');
            // 之后刷新页面进入详情页
            this.props.history.push(`/brandShopGroup/detail/${res.data}`);
          })
          .catch(e => {
            Modal.error({
              title: '提交失败',
              content: `失败原因：${e.message}`,
            });
          });
      } else {
        // 修改页面提交
        modifyShopGroup(obj)
          .then(res => {
            message.success('提交成功');
            // 回到列表页
            this.props.history.push('/brandShopGroup');
          })
          .catch(e => {
            Modal.error({
              title: '提交失败',
              content: `失败原因：${e.message}`,
            });
          });
      }
    });
  };

  render() {
    let breadcrumb;
    const { detailData } = this.state;
    const isEdit = !!this.props.params.id;
    if (isEdit) {
      breadcrumb = [
        {
          title: '品牌门店组管理',
          link: '#/brandShopGroup',
        },
        {
          title: '修改品牌门店组',
        },
      ];
    } else {
      breadcrumb = [
        {
          title: '品牌门店组管理',
          link: '#/brandShopGroup',
        },
        {
          title: '新增品牌门店组',
        },
      ];
    }
    if (
      !permission('BIZ_GROUP_QUERY_AUTH') &&
      !permission('SUPER_QUERY_ADMIN')
    ) {
      return <PageNoAuth authCodes={['BIZ_GROUP_QUERY_AUTH']} />;
    }
    const { getFieldProps, getFieldValue, getFieldError } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 5 },
    };
    const storeGroupNameProps = getFieldProps('groupName', {
      initialValue: detailData.groupName,
      rules: [{ required: true, max: 40, message: '请输入不超过40个字符' }],
    });
    const noteProps = getFieldProps('memo', {
      initialValue: detailData.memo,
      rules: [{ max: 100, message: '请输入不超过100个字符' }],
    });
    return (
      <Page id="brandShopNew" breadcrumb={breadcrumb}>
        <Form horizontal onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="门店组名称" hasFeedback>
            <Input
              name="groupName"
              {...storeGroupNameProps}
              placeholder="请输入不超过40个字符"
            />
          </FormItem>

          <FormItem {...formItemLayout} required label="管理BD">
            <DefaultSelfUserSelect
              className="insideTheSmall2"
              {...getFieldProps('insideTheSmall2', {
                initialValue: detailData.ownerId && {
                  id: detailData.ownerId,
                  realName: detailData.ownerName,
                  nickName: detailData.ownerNickName,
                  displayName: detailData.ownerNickName
                    ? `${detailData.ownerName}(${detailData.ownerNickName})`
                    : detailData.ownerName,
                },
                rules: [{ required: true, message: '请填写正确的小二名称' }],
              })}
              loadSelf={!isEdit}
              kbsalesUrl={window.APP.kbsalesUrl}
              style={{ width: 250 }}
              role={UserSelect.UserRole.BD}
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <span>
                门店组品牌<span className="optional">（可选）</span>
              </span>
            }
          >
            <BrandSelect
              placeholder="请输入品牌"
              {...getFieldProps('brandId', {
                initialValue: detailData.brandId || undefined,
                rules: [
                  {
                    message: '请输入品牌',
                  },
                ],
              })}
              disabled={!!getFieldValue('leadsId')}
              brandName={detailData.brandName}
              onSelect={(id, elem) =>
                (detailData.brandName = elem.props.children)
              }
            />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={
              <span>
                备注<span className="optional">（可选）</span>
              </span>
            }
            help={
              getFieldValue('memo') && getFieldValue('memo').length > 100
                ? getFieldError('memo')
                : null
            }
          >
            <Input
              name="memo"
              {...noteProps}
              type="textarea"
              placeholder="请输入不超过100个字符"
              id="textarea"
            />
          </FormItem>
          {this.state.visibleButton && (
            <FormItem wrapperCol={{ span: 5, offset: 4 }}>
              <Button type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
            </FormItem>
          )}
        </Form>
      </Page>
    );
  }
}

export default createForm()(BrandShopNew);
