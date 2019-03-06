import React, { Component, PropTypes } from 'react';
import { Table, Dropdown, Menu, Icon } from 'antd';
import FlexText from '../../common/FlexText';
import { CODE_STATUS_TEXT, CODE_STATUS, BIND_SCENE, TEMPLATE_CATE } from '../../common/enums';
import { MALL_AI_FILE } from '../../common/constants';
import { getCookie } from '../../../../../common/utils';
import moment from 'moment';

const MenuItem = Menu.Item;

class RecordTable extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '提交时间/ID',
        dataIndex: 'gmtCreate',
        render: (value, record) => <span>{moment(value).format('YYYY-MM-DD HH:mm:ss')}<br/>生成批次：{record.id}</span>,
      },
      {
        title: '提交人',
        dataIndex: 'applicant',
      },
      {
        title: '物料类型',
        dataIndex: 'stuffAttrName',
      },
      {
        title: '物料模板',
        dataIndex: 'templateName',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: value => CODE_STATUS_TEXT[value],
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        render: value => <FlexText limit={60} text={value}/>
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.status !== CODE_STATUS.COMPLETED) {
            return null;
          }
          try {
            const templateInfo = JSON.parse(record.extInfo).kbCodeTemplateInfo;
            const { bindScene, templateCate } = templateInfo;
            // 商圈码中，除了独立二维码之外均提供AI源文件下载
            // @see http://demo.alibaba-inc.com/system/ids_extracted/d8/e3/07/98/4c45ec4029124f6b0586dd84/%E5%8F%A3%E7%A2%91%E7%A0%81%E4%BA%8C%E6%9C%9F%E9%9C%80%E6%B1%82CX_0426/index.html#g=1&p=码管理-生成记录✨🍀
            const showAILink = bindScene === BIND_SCENE.BIND_MALL && templateCate !== TEMPLATE_CATE.SINGLE_CODE;
            const showDropDown = showAILink;
            return (
              <span>
              <a onClick={() => this.props.onDownCode(record.fileUrl)}>打包下载码</a>
              <span className="ant-divider"/>
                {showDropDown ?
                  <Dropdown overlay={(
                    <Menu>
                      {
                        showAILink && (
                          <MenuItem key="0">
                            <a href={`${MALL_AI_FILE}&ctoken=${getCookie('ctoken')}`} target="_blank">下载AI源文件</a>
                          </MenuItem>
                        )
                      }
                      <MenuItem key="1">
                        <a onClick={() => this.props.onDownCodeUrl(record.id, bindScene)}>打包下载码URL</a>
                      </MenuItem>
                    </Menu>
                  )}>
                    <a className="ant-dropdown-link">
                      更多 <Icon type="down" />
                    </a>
                  </Dropdown>
                  :
                  <a onClick={() => this.props.onDownCodeUrl(record.id, bindScene)}>打包下载码URL</a>
                }
            </span>
            );
          } catch (e) {
            return null;
          }
        },
      },
    ];
  }

  render() {
    const { data, loading, pagination, onChange } = this.props;

    return (
      <Table
        columns={this.columns}
        dataSource={data}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        rowKey={(record, index) => index}
      />
    );
  }
}

RecordTable.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
};

export default RecordTable;
