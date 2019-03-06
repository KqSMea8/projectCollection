import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { Input, message, Form, Modal } from 'antd';
import PicViewer from '../../common/PicViewer';
import ajax from '../../../../common/ajax';
import copy from '../../../../common/copy';
import Item from './item';
const FormItem = Form.Item;

const PicList = React.createClass({
  propTypes: {
    inkb: PropTypes.bool,
    standard: PropTypes.bool,
    list: PropTypes.array,
    merchantId: PropTypes.string,
    onRefresh: PropTypes.func,
  },

  getInitialState() {
    const { name } = this.props;
    return {
      name,
      deleteLoading: false,
      copyModal: false,
      modifyModal: false,
      modifyName: '',
      modifyLoading: false,
      showPicViewer: false,
      edit: {},
    };
  },

  getList(list) {
    const splitCount = 5;
    const { standard } = this.props;
    const items = list.map((item, index) => {
      const { sourceId, url, id, name, auditMessage, source } = item;

      return (
        <li key={`material${index}`} span={4}>
          <Item
            id={id}
            src={url}
            ser={sourceId}
            standard={standard}
            name={name}
            auditMessage={auditMessage}
            source={source}
            onDelete={() => {
              if (standard) {
                this.deleteModal(id);
              } else {
                this.delete(id);
              }
            }}
            onView={() => {
              this.setState({ showPicViewer: true, edit: { ...item } });
            }}
            onModify={() => {
              this.setState({ modifyModal: true, modifyName: name, edit: { ...item } });
            }}
            onCopy={() => {
              this.setState({ copyModal: true, edit: { ...item } });
            }}
          />
        </li>
      );
    });
    return Array.from({ length: Math.ceil(items.length / splitCount) }).map((_, i) => {
      const start = splitCount * i;
      return <ul key={`pics${i}`}>{items.slice(start, start + splitCount)}</ul>;
    });
  },

  delete(id) {
    const { deleteLoading } = this.state;
    const { merchantId, inkb, onRefresh } = this.props;
    if (!deleteLoading) {
      this.setState({ deleteLoading: true });
      return ajax({
        url: `/material/delMaterial.json${inkb ? '.kb' : ''}`,
        data: { id, timestamp: Date.now(), materalID: id, op_merchant_id: merchantId },
      })
        .then(res => {
          if (res.success) {
            message.success('删除成功');
            setTimeout(() => {
              onRefresh();
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
  },

  deleteModal(id) {
    Modal.confirm({
      title: '是否删除该素材？',
      content: '删除后，不影响已经在使用的场景。',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        this.delete(id);
      },
      onCancel: () => {
        this.setState({ deleteLoading: false });
      },
    });
  },

  modify(id, name) {
    console.log('修改id', id);
    const { modifyLoading } = this.state;
    const { merchantId, inkb, onRefresh } = this.props;
    if (!modifyLoading) {
      this.setState({ modifyLoading: true });
      ajax({
        url: `/material/editMaterial.json${inkb ? '.kb' : ''}`,
        data: { id, name, timestamp: Date.now(), op_merchant_id: merchantId },
        success: res => {
          if (res.success) {
            message.success('修改成功');
            onRefresh(true);
          } else {
            message.error('系统错误');
          }
          this.setState({ modifyLoading: false, modifyModal: false });
        },
        error: res => {
          if (!res.success) {
            message.error('系统错误');
          } else if (res && !res.resultMsg) {
            message.error(res.resultMsg);
          }
          this.setState({ modifyLoading: false, modifyModal: false });
        },
      });
    }
  },

  render() {
    const { list, standard } = this.props;
    const { copyModal, modifyModal, modifyName, edit = {}, showPicViewer } = this.state;
    return (
      <div className="material-list">
        {list && list.length ? (
          this.getList(list)
        ) : (
          <div className="material-list">{`没有${standard ? '有' : '无'}效的素材`}</div>
        )}
        <Modal
          title="复制编号"
          wrapClassName="vertical-center-modal"
          visible={copyModal}
          okText="复制"
          onOk={() => {
            copy(edit.sourceId);
            this.setState({ copyModal: false });
          }}
          onCancel={() => {
            this.setState({ copyModal: false });
          }}
        >
          <p>素材编号：{edit.sourceId}</p>
        </Modal>
        <Modal
          title="修改"
          wrapClassName="material-modify-modal"
          visible={modifyModal}
          onOk={() => {
            if (modifyName) {
              this.modify(edit.id, modifyName);
            }
          }}
          onCancel={() => {
            this.setState({ modifyModal: false });
          }}
        >
          <FormItem
            label="素材名称："
            validateStatus={classnames({ error: !modifyName })}
            help={!modifyName ? '请填写素材名称' : ''}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
          >
            <Input
              placeholder="请填写素材名称"
              value={modifyName}
              onChange={e => {
                this.setState({ modifyName: e.target.value });
              }}
            />
          </FormItem>
        </Modal>
        {showPicViewer ? (
          <PicViewer
            url={`/material/view.htm?fileId=${edit.sourceId}&zoom=original`}
            onClose={() => {
              this.setState({ showPicViewer: false });
            }}
          />
        ) : null}
      </div>
    );
  },
});

export default PicList;
