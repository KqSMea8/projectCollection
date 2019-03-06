import React, { PropTypes, Component } from 'react';
import { Button, Icon, Modal, message, Pagination } from 'antd';
import fetch from '@alipay/kb-fetch';
import './index.less';

const deleteIdArr = [];
class MaterialDelete extends Component {
  static propTypes = {
    fileList: PropTypes.array,
    merchantId: PropTypes.string,
    onRefresh: PropTypes.func,
    pagination: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      fileList: this.props.fileList,
      deleteLen: 0,
      deleteLoading: false,
      pagination: this.props.pagination,
      groupId: this.props.groupId,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({
        fileList: nextProps.fileList,
        groupId: nextProps.groupId,
        pagination: nextProps.pagination,
      });
    }
    if (this.props.groupId !== nextProps.groupId) {
      this.modelShowHide();
    }
  }
  modelShowHide = () => {
    Array.prototype.slice.call(document.getElementsByClassName('delete-model')).map((v, k) => {
      const displayEle = document.getElementsByClassName('delete-model')[k];
      if (displayEle.style.display === 'block') {
        displayEle.style.display = 'none';
      }
    });
    this.setState({
      deleteLen: 0,
    });
  };
  // 分页查询
  searchList = () => {
    const { pagination, loading, groupId } = this.state;
    if (!loading) {
      this.setState({ loading: true });
      return fetch({
        url: 'crmhome.materialCenterManageSpiProcesser.pageQueryMaterials',
        param: {
          groupId,
          pageSize: pagination.itemsPerPage,
          pageNo: pagination.page,
        },
        gwServer: `${window.APP.crmhomeUrl}/spigw.json`,
        devServer: ['crmhome-zth-9.gz00b.dev.alipay.net'],
      })
        .then(res => {
          if (res && res.data.success && res.data.pageInfo) {
            const { page, items, itemsPerPage = 20, pages } = res.data.pageInfo;
            this.setState({
              loading: false,
              pagination: { ...pagination, items, page, itemsPerPage, pages },
              fileList: res.data.values,
            });
          } else {
            message.error('系统错误');
            this.setState({ loading: false });
          }
        })
        .catch(err => {
          if (!err.success) {
            message.error('系统错误');
          }
          if (err && err.resultMsg) {
            message.error(err.resultMsg);
          }
          this.setState({ loading: false });
        });
    }
  };
  // 点击取消
  cancelClick = () => {
    this.props.deleteFlagClick(false);
  };
  // 删除模版
  deleteModal = materialId => {
    // 判断数组中有没有要删除的
    if (materialId.length) {
      Modal.confirm({
        title: '是否删除该素材？',
        content: '删除后，不影响已经在使用的场景。',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.deleteBatchesClick(materialId);
        },
        onCancel: () => {
          this.setState({ deleteLoading: false });
        },
      });
    } else {
      Modal.confirm({
        content: '请选择要删除的素材图片',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.setState({ deleteLoading: false });
        },
        onCancel: () => {
          this.setState({ deleteLoading: false });
        },
      });
    }
  };
  // 批量删除
  deleteBatchesClick = materialIds => {
    // 批量删除
    const { deleteLoading } = this.state;
    const { onRefresh } = this.props;
    if (!deleteLoading) {
      this.setState({ deleteLoading: true });
      return fetch({
        url: 'kbmaterialcenter.materialManageWrapperService.batchDeleteMaterial',
        param: [materialIds],
        gwServer: `${window.APP.crmhomeUrl}/spigw.json`,
        devServer: ['kbservcenter-ztt-1.gz00b.dev.alipay.net'],
      })
        .then(res => {
          if (res.data.success) {
            this.setState({
              deleteLen: 0,
            });
            Array.prototype.slice
              .call(document.getElementsByClassName('delete-model'))
              .map((v, k) => {
                const displayEle = document.getElementsByClassName('delete-model')[k];
                if (displayEle.style.display === 'block') {
                  displayEle.style.display = 'none';
                }
              });
            message.success('删除成功');
            setTimeout(() => {
              onRefresh(true);
            }, 0);
          } else {
            message.error('系统错误');
          }
          this.setState({ deleteLoading: false });
          return res;
        })
        .catch(res => {
          if (!res.success) {
            message.error('系统错误');
          }
          this.setState({ deleteLoading: false });
          return res;
        });
    }
  };
  // 选中删除
  checkDelete = (key, materialId) => {
    deleteIdArr.push(materialId);
    const modelDisplay = document.getElementsByClassName(`delete-model${key}`)[0].style.display;
    if (modelDisplay === 'none') {
      document.getElementsByClassName(`delete-model${key}`)[0].style.display = 'block';
      this.setState({
        deleteLen: this.state.deleteLen + 1,
      });
    } else {
      document.getElementsByClassName(`delete-model${key}`)[0].style.display = 'none';
      this.setState({
        deleteLen: this.state.deleteLen - 1,
      });
    }
  };
  render() {
    const { fileList, pagination } = this.state;
    return (
      <div
        className="material-center-main-right"
        style={{ paddingTop: '10px', paddingRight: '20px', paddingLeft: '12px' }}
      >
        <div>
          <Button
            type="ghost"
            size="large"
            style={{ marginLeft: '632px' }}
            onClick={this.cancelClick}
          >
            取消
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ marginLeft: '20px' }}
            onClick={() => {
              this.deleteModal(deleteIdArr);
            }}
          >
            {this.state.deleteLen > 0 ? `删除(${this.state.deleteLen})` : '删除'}
          </Button>
        </div>
        <div className="add-shop-goods" style={{ marginTop: '10px' }}>
          <div
            className="upload-btn"
            style={{
              height: '96px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              marginRight: '10px',
              backgroundColor: 'rgba(242, 242, 242, 1)',
              borderColor: 'rgba(228, 228, 228, 1)',
            }}
          >
            <Icon
              type="plus"
              style={{
                fontSize: '24px',
                color: '#ccc',
                marginLeft: '50px',
                marginTop: '30px',
                fontWeight: 'bold',
              }}
            />
            <div
              className="ant-upload-text"
              style={{ textAlign: 'center', color: '#ccc', fontSize: '12px' }}
            >
              添加图片
            </div>
          </div>
          {fileList &&
            fileList.map((val, key) => {
              const materialId = val.materialId;
              return (
                <a
                  target="_blank"
                  className="upload-example"
                  key={key}
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    this.checkDelete(key, materialId);
                  }}
                >
                  <img alt={val.name} src={val.outMaterialUrl} />
                  <span
                    className={`delete-model delete-model${key}`}
                    style={{
                      width: '126px',
                      height: '96px',
                      background: '#333',
                      opacity: 0.8,
                      left: 0,
                      bottom: '-2px',
                      display: 'none',
                    }}
                  >
                    <Icon
                      type="check-circle-o"
                      style={{
                        fontSize: '30px',
                        fontWeight: 'blod',
                        marginLeft: '6px',
                        marginTop: '32px',
                      }}
                    />
                  </span>
                </a>
              );
            })}
        </div>
        {fileList && fileList.length ? (
          <Pagination
            style={{ float: 'right' }}
            total={pagination.items}
            pageSize={pagination.itemsPerPage}
            defaultCurrent={pagination.page}
            current={pagination.page}
            onChange={page => {
              const newPagination = { ...pagination, page };
              this.setState({ pagination: newPagination }, () => {
                this.searchList();
                this.modelShowHide();
              });
            }}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default MaterialDelete;
