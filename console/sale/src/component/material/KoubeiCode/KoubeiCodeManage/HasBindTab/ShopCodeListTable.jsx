import React, { Component, PropTypes } from 'react';
import { Table, Menu, Dropdown, Icon, message, Popover } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { API_STATUS, TEMPLATE_CATE } from '../../common/enums';
import ajax from 'Utility/ajax';
import { appendOwnerUrlIfDev } from '../../../../../common/utils';
import BatchInfoCard from './BatchInfoCard';
import ImagePreview from 'Library/ImagePreview';
import moment from 'moment';

const MenuItem = Menu.Item;

class ShopCodeListTable extends Component {
  static propTypes = {
    bindTargetId: PropTypes.string.isRequired,
    bindTargetName: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.onTableChange = this.onTableChange.bind(this);
  }

  state = {
    loading: true,
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  };

  componentDidMount() {
    this.fetch();
  }

  onTableChange(pagination) {
    this.setState({
      pagination,
    }, this.fetch);
  }

  fetch() {
    const { bindTargetId } = this.props;
    const { pagination } = this.state;
    const { current, pageSize } = pagination;
    this.setState({
      loading: true,
    });
    ajax({
      url: appendOwnerUrlIfDev('/proxy.json'),
      method: 'get',
      data: {
        mappingValue: 'kbasset.pageQueryKBCodeBindTargetCodes',
        bindTargetId,
        pageNum: current,
        pageSize,
      },
      type: 'json',
    }).then(res => {
      this.setState({
        loading: false,
      });
      if (res && res.status === API_STATUS.SUCCEED) {
        this.setState({
          data: res.data.data,
          pagination: {
            ...pagination,
            total: res.data.totalSize,
          },
        });
      }
    }).catch(() => {
      this.setState({
        loading: false,
        data: [],
      });
    });
  }

  singleQrcodeUrl(record) {
    const dName = `${this.props.bindTargetName}_${record.templateName}_${record.qrCode}`;
    // 下载服务要求对`shopName`进行两次encode，否则乱码
    return `${record.coreURL}&dName=${encodeURIComponent(encodeURIComponent(dName))}&d`;
  }

  columns = [{
    title: '二维码编号',
    key: 'qrCode',
    dataIndex: 'qrCode',
  }, {
    title: '物料图',
    key: 'templateImageURL',
    dataIndex: 'templateImageURL',
    render: thumb => (
      <ImagePreview
        imgSrc={thumb}
        imgTitle="物料图预览"
        style={{ maxHeight: 60 }}
      />
    ),
  }, {
    title: '物料模板',
    key: 'templateName',
    dataIndex: 'templateName',
  }, {
    title: '绑定人/时间',
    key: 'staffPrincipalName',
    dataIndex: 'staffPrincipalName',
    render: (text, record) => <span>{record.staffPrincipalName}<br />{moment(record.gmtModified).format('YYYY-MM-DD HH:mm:ss')}</span>,
  }, {
    title: '绑定编号',
    key: 'bindTargetValue',
    dataIndex: 'bindTargetValue',
  }, {
    title: '生成批次',
    key: 'batchId',
    dataIndex: 'batchId',
    render: (batchId, record) => (
      <Popover
        title={`批次${batchId}`}
        content={<BatchInfoCard record={record}/>}
      >
        <a>{batchId}</a>
      </Popover>
    ),
  }, {
    title: '操作',
    key: 'actions',
    render: (text, record) => {
      try {
        const templateInfo = JSON.parse(record.extInfo).kbCodeTemplateInfo;
        const {templateCate} = templateInfo;
        // 独立二维码不显示下载单独二维码链接
        const isSingleCode = templateCate === TEMPLATE_CATE.SINGLE_CODE;
        return (
          <span>
            <a download={`${record.qrCode}.png`} href={record.resourceURL} target="_blank">下载整图</a>
            <span className="ant-divider"/>
            {isSingleCode &&
            <CopyToClipboard
              text={record.coreURL}
              onCopy={() => message.success('URL复制成功')}
            >
              <a>复制码的URL</a>
            </CopyToClipboard>
            }
            {isSingleCode ||
            <Dropdown overlay={(
              <Menu>
                <MenuItem key="0">
                  {
                    /**
                     * 此处黑科技：http://mobilecodec.stable.alipay.net/show.htm?code=lpx09190yheemwtv0vybp28 此类地址需要加参数`d`以
                     * 实现下载（原理：HTTP Response Header中指定`Content-Disposition`字段）
                     */
                  }
                  <a href={this.singleQrcodeUrl(record)} target="_blank">下载单独二维码</a>
                </MenuItem>
                <MenuItem key="1">
                  <CopyToClipboard
                    text={record.coreURL}
                    onCopy={() => message.success('URL复制成功')}
                  >
                    <a>复制码的URL</a>
                  </CopyToClipboard>
                </MenuItem>
              </Menu>
            )}>
              <a className="ant-dropdown-link">
                更多 <Icon type="down"/>
              </a>
            </Dropdown>
            }
          </span>
        );
      } catch (e) {
        return null;
      }
    },
  }]

  render() {
    const { data, loading, pagination } = this.state;
    return (
      <Table
        columns={this.columns}
        rowKey={record => record.qrCode}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={this.onTableChange}
      />
    );
  }
}

export default ShopCodeListTable;
