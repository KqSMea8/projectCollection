// 品牌门店组详情页
import React from 'react';
import { Button, Tabs, Form, Row } from 'antd';
import { Page } from '@alipay/kb-framework-components/lib/layout';
import { PageNoAuth } from '@alipay/kb-framework-components';
import BrandShopConfig from './brandShopConfig';
import { queryShopGroupDetail, batchTask } from '../common/api';
import permission from '@alipay/kb-framework/framework/permission';
import './brandShopDetail.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
/* eslint-disable */
class BrandShopDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalTitle: '',
      detailData: {},
      hiddenOperationButton: true,
    };
  }

  componentDidMount() {
    // 判断权限
    if (
      !permission('BIZ_GROUP_OPERATE_AUTH') &&
      !permission('SUPER_OPERATE_ADMIN')
    ) {
      this.setState({
        hiddenOperationButton: false,
      });
    }
    const groupId = this.props.params.id;
    this.getDetailData(groupId);
  }

  // huoqu shuju
  getDetailData = groupId => {
    this.setState({
      groupId,
    });
    queryShopGroupDetail({ groupId })
      .then(res => {
        this.setState({
          detailData: res.data,
        });
      })
      .catch(res => {
        if (!res.success) {
          message.error('系统错误');
        }
        this.setState({ deleteLoading: false });
        return res;
      });
  };

  // 查看上传进度
  findUploadProgress = () => {
    window.location.hash =
      '/batchFileManager?scene=SHOP_GROUP_RELATION_BATCH_UPDATE';
  };

  // 配置门店
  configShop = text => {
    // 点击配置门店显示弹框
    this.setState({
      visible: true,
      modalTitle: text,
    });
    if (!text) {
      this.setState({
        visible: false,
      });
    }
  };

  // 下载门店
  downShop = groupId => {
    this.setState({
      groupId,
    });
    batchTask({ groupId }).then(res => {
      if (res.status === 'succeed') {
        window.open(`${window.APP.kbsalesUrl}${res.data}`);
      } else {
        message.error('请确定是否配置过门店');
      }
    });
  };
  render() {
    const {
      detailData,
      hiddenOperationButton,
      modalTitle,
      visible,
      groupId,
    } = this.state;
    if (
      !permission('BIZ_GROUP_QUERY_AUTH') &&
      !permission('SUPER_QUERY_ADMIN')
    ) {
      return <PageNoAuth authCodes={['BIZ_GROUP_QUERY_AUTH']} />;
    }
    const breadcrumb = [
      {
        title: '品牌门店组管理',
        link: '#/brandShopGroup',
      },
      {
        title: '品牌门店组详情',
      },
    ];
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 5 },
    };
    return (
      <Page id="brandShopDetail" breadcrumb={breadcrumb}>
        <div className="detail-banner">
          <div className="detail-left">
            <p>{detailData.groupName}</p>
            <span className="detail-left-id">{detailData.groupId}</span>
          </div>
          <div className="detail-right">
            {detailData.shopGroupConfigStatus === 'NOT_UPLOAD' ? (
              <div className="detail-right-button">
                {hiddenOperationButton && (
                  <Button
                    type="primary"
                    onClick={() => {
                      this.configShop('配置门店', detailData);
                    }}
                  >
                    配置门店
                  </Button>
                )}
              </div>
            ) : detailData.shopGroupConfigStatus === 'UPLOADING_SHOPS' ? (
              <div className="detail-right-button">
                <Button type="primary" onClick={this.findUploadProgress}>
                  查看门店上传进度
                </Button>
              </div>
            ) : (
              <div className="detail-right-button">
                <Button
                  type="primary"
                  onClick={() => {
                    this.downShop(this.props.params.id);
                  }}
                >
                  下载门店
                </Button>
                {hiddenOperationButton && (
                  <Button
                    type="primary"
                    onClick={() => {
                      this.configShop('修改门店');
                    }}
                  >
                    修改门店
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="detail-tabs">
          <Tabs defaultActiveKey="3" onChange={this.callback}>
            {/* <TabPane tab="门店组业绩" key="1">
              选项卡一内容
            </TabPane>
            <TabPane tab="详细数据" key="2">
              选项卡二内容
            </TabPane> */}
            <TabPane tab="基本信息" key="3">
              <Form horizontal onSubmit={this.handleSubmit}>
                <Row>
                  <FormItem {...formItemLayout} label="管理BD">
                    <p className="ant-form-text" id="userName" name="userName">
                      {`${detailData.ownerName}(${detailData.ownerNickName})`}
                    </p>
                  </FormItem>
                </Row>

                {detailData.brandName && (
                  <Row>
                    <FormItem {...formItemLayout} label="门店组品牌">
                      <p
                        className="ant-form-text"
                        id="userName"
                        name="userName"
                      >
                        {detailData.brandName}
                      </p>
                    </FormItem>
                  </Row>
                )}

                {detailData.memo && (
                  <Row>
                    <FormItem {...formItemLayout} label="备注">
                      <p
                        className="ant-form-text"
                        id="userName"
                        name="userName"
                      >
                        {detailData.memo}
                      </p>
                    </FormItem>
                  </Row>
                )}

                {detailData.shopGroupConfigStatus !== 'NOT_UPLOAD' &&
                  detailData.shopGroupConfigStatus !== 'UPLOADING_SHOPS' && (
                    <Row>
                      <FormItem {...formItemLayout} label="门店数量">
                        <p
                          className="ant-form-text"
                          id="userName"
                          name="userName"
                        >
                          {detailData.shopCount}
                        </p>
                      </FormItem>
                    </Row>
                  )}
                <Row>
                  <FormItem {...formItemLayout} label="更新时间">
                    <p className="ant-form-text" id="userName" name="userName">
                      {detailData.gmtModified &&
                        detailData.gmtModified.slice(0, 10).replace(/-/g, '/')}
                    </p>
                  </FormItem>
                </Row>
              </Form>
            </TabPane>
          </Tabs>
        </div>

        {visible && (
          <BrandShopConfig
            visible={visible}
            record={detailData}
            modalTitle={modalTitle}
            configShop={this.configShop}
            getDetailData={() => {
              this.getDetailData(groupId);
            }}
          />
        )}
      </Page>
    );
  }
}

export default BrandShopDetail;
