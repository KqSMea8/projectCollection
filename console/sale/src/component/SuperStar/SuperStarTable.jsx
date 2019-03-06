import React, {PropTypes} from 'react';
import {Table, Dropdown, Menu, Icon, Popconfirm, message, Tooltip} from 'antd';
import {Link} from 'react-router';
import ajax from 'Utility/ajax';
import ImgModal from './ImgModal';
// const MenuItem = Menu.Item;

export default class SuperStarTable extends React.Component {


  static propTypes = {
    params: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '品牌名称',
        width: 100,
        key: 'name',
        dataIndex: 'name',
      }, {
        title: '品牌id',
        width: 150,
        key: 'brandId',
        dataIndex: 'brandId',
      }, {
        title: '品牌logo',
        key: 'logo',
        dataIndex: 'logoUrl',
        width: 100,
        render: (r) => {
          const coverImg = {};
          if (r) {
            coverImg.fileUrl = r;
            // coverImg.fileUrl = `http://oalipay-dl-django.alicdn.com/rest/1.0/image?fileIds=${r}`;
          }
          return (
            <ImgModal coverImg={coverImg}/>
          );
        }
      }, {
        title: '商户pid',
        width: 140,
        key: 'partnerId',
        dataIndex: 'partnerId',
      }, {
        title: '覆盖城市',
        width: 90,
        dataIndex: 'cityList',
        key: 'cityList',
        render: (r) => {
          const cities = r;
          const {cityList} = this.props;
          const list = [];
          cityList.map((item) => {
            if (item.children.length > 0) {
              item.children.map((items) => {
                r.map(i => {
                  if (i === items.value) {
                    list.push(items.label);
                  }
                });
              });
            }
          });

          let TEXT = '';
          if (list.length > 3) {
            TEXT = (<div>
              <Tooltip title={list.join(',')}>
                <p>{list.slice(0, 3).join(',')}...</p>
              </Tooltip>

              <br/>
              <p>等{cities.length}个城市</p>
            </div>);
          } else {
            TEXT = (<div>
              <p>{list.join(',')}</p>
              <br/>
              <p>共{cities.length}个城市</p>
            </div>);
          }
          return TEXT;
        }
      }, {
        title: '状态',
        width: 80,
        dataIndex: 'status',
        key: 'status',
        render: (t) => {
          let active = '草稿';
          if (t === 'ONSHELF') {
            // 状态已上架
            active = '已上架';
          } else if (t === 'OFFSHELF') {
            // 状态已下架
            active = '已下架';
          }
          return active;
        }
      }, {
        title: '操作',
        width: 80,
        render: (t) => {
          const status = t.status;
          let active = '投放';
          if (status === 'ONSHELF') {
            // 状态已上架
            active = '下架';
          } else if (status === 'OFFSHELF') {
            // 状态已下架
            active = '上架';
          }

          return (<div>
            <Popconfirm title={`确定${active}吗？`} onConfirm={() => this.confirm(t.id)} okText="确定" cancelText="取消">
              <a>{active} | </a>
            </Popconfirm>

            <Dropdown overlay={
              <Menu>
                <Menu.Item>
                  <Link to={`superstar/create/${t.id}`} target="_blank">编辑</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to={`superstarview/${t.id}`} target="_blank">详情</Link>
                </Menu.Item>
                {status !== 'ONSHELF' && <Menu.Item>
                  <a onClick={() => this.deleteSuperBrand(t.id)} >删除</a>
                </Menu.Item>}
              </Menu>
            } trigger={['click']}>
              <a className="ant-dropdown-link"> 更多<Icon type="down" style={{marginRight: 8, fontSize: 10}}/></a>
            </Dropdown>
          </div>);
        },
      }
    ];
    this.state = {
      type: '',
      visible: false,
      data: [],
      isAllowModifyShop: false,
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        showTotal: (total) => {
          return `共${total}个记录`;
        },
        current: 1,
      },
      loading: true,
    };
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.onTableChange({
        current: 1,
        pageSize: this.state.pagination.pageSize,
      });
    }
  }

  onTableChange = pagination => {
    this.fetch({
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    });
    this.setState({pagination});
  }

  confirm = (id) => {
    this.setState({loading: true});
    ajax({
      url: '/manage/superbrand/updateSuperBrandStatus.json',
      method: 'get',
      data: {
        id: id,
      },
      type: 'json',
      success: () => {
        this.setState({loading: false});
        this.fetch();
      },
    });
  }

  deleteSuperBrand = (id) => {
    this.setState({loading: true});
    ajax({
      url: '/manage/superbrand/deleteSuperBrand.json',
      method: 'get',
      data: {
        id: id,
      },
      type: 'json',
      success: () => {
        this.setState({loading: false});

        this.fetch();
      },
    });
  }

  fetch = (pageParams = {pageNum: 1, pageSize: 10}) => {
    const params = {
      ...this.props.params,
      ...pageParams,
    };
    this.setState({loading: true});
    ajax({
      url: '/manage/superbrand/pageQuerySuperBrandByCondition.json',
      method: 'get',
      data: params,
      type: 'json',
      success: (res) => {
        if (res.status === 'succeed') {
          const data = res.data.data;
          const pagination = {...this.state.pagination};
          pagination.total = data.count;
          this.setState({
            loading: false,
            data: data.superBrandList,
            pagination,
          });
        } else {
          this.setState({
            loading: false,
            data: [],
          });
          message.error(res && res.errorMsg);
        }
      },
      error: (res) => {
        this.setState({
          loading: false,
          data: [],
        });
        message.error(res && res.errorMsg);
      },
    });
  }

  render() {
    const {pagination, loading, data} = this.state;

    return (
      <div style={{marginTop: 20}}>
        <Table bordered
               columns={this.columns}
               dataSource={data}
               pagination={pagination}
               loading={loading}
               onChange={this.onTableChange}
        />
      </div>

    );
  }
}
