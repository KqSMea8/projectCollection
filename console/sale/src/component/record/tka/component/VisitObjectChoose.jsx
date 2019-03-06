import React, { PropTypes } from 'react';
import { TreeSelect, Popconfirm } from 'antd';
import { queryContacts, deleteContacts } from '../common/api';
import VisitObjectAddLink from './VisitObjectAddLink';
import VisitObjectEditLink from './VisitObjectEditLink';
import './visit-object-choose.less';

export function validator(rule, value, callback) {
  if (!value) {
    callback(); // 未填写由另一个 rule 校验
    return;
  }
  if (value.filter(item => item.tel).length === 0) {
    callback(new Error('至少有一个拜访对象的电话'));
    return;
  }
  callback();
}

class VisitObjectChoose extends React.Component {

  static propTypes = {
    value: PropTypes.array, // [item]
    onChange: PropTypes.func,
    merchantId: PropTypes.string,
  };

  state = {
    treeData: [],
    idMapData: {},
  };

  componentDidUpdate(prevProps) {
    if (prevProps.merchantId !== this.props.merchantId && this.props.merchantId) {
      if (this.props.onChange && this.props.value && this.props.value.length) {
        this.props.onChange(undefined);
      }
      this.loadData();
    }
  }

  onConfirmDelete(item) {
    const { value, onChange } = this.props;
    const id = String(item.contactId);
    const ids = this.getValueIds();
    if (ids.indexOf(id) !== -1) {
      const index = ids.indexOf(id);
      const newValue = value.concat();
      newValue.splice(index, 1);
      onChange(newValue);
    }
    deleteContacts(id).then(() => {
      this.loadData();
    });
  }

  onChange(v) {
    const { idMapData } = this.state;
    if (v && this.props.onChange) {
      this.props.onChange(v.map(id => idMapData[id]));
    }
  }

  getValueIds() {
    const { value } = this.props;
    if (value) {
      return value.map(item => String(item.contactId));
    }
    return [];
  }

  loadData = () => {
    const { merchantId } = this.props;
    this.setState({ dataLoading: true });
    queryContacts(merchantId).then(res => {
      const idMapData = {};
      let data = res.data || [];

      // 后端返回的其他职务分组，要按具体的职务分组展示
      const expandOtherGroup = {}; // {remark, [contact]}
      data = data.filter(group => {
        if (group.position === 'OTHER') {
          group.visitContactDTOs.forEach(contact => {
            const contacts = expandOtherGroup[contact.remark] || [];
            expandOtherGroup[contact.remark] = contacts;
            contacts.push(contact);
          });
          return false;
        }
        return true;
      });
      data = data.concat(Object.keys(expandOtherGroup).map(groupName => ({
        positionDesc: groupName,
        visitContactDTOs: expandOtherGroup[groupName],
      })));

      // 构建 tree 数据
      const treeData = data.map(group => ({
        label: group.positionDesc,
        children: group.visitContactDTOs && group.visitContactDTOs.map(item => {
          const displayText = item.name + (item.tel ? `(${item.tel})` : '');
          item.otherPosition = item.remark;
          idMapData[item.contactId] = item;
          return {
            value: String(item.contactId),
            label: (<div>
              <span className="visit-object-item-group-prefix">{group.positionDesc}-</span>
              {displayText}
              <div className="visit-object-item-label">
                <VisitObjectEditLink data={item} merchantId={merchantId} onEditSuc={this.loadData} />
                <span style={{ color: '#666', margin: '0 8px' }}>|</span>
                <Popconfirm title="确定要删除这个拜访对象吗？" onConfirm={() => this.onConfirmDelete(item)}>
                  <span>删除</span>
                </Popconfirm>
              </div>
            </div>),
            key: displayText, // key 用于搜索
          };
        })
      }));

      this.setState({
        treeData,
        idMapData,
        dataLoading: false,
      }, () => {
        if (this.props.value) {
          this.onChange(this.getValueIds()); // 更新已选中的 value
        }
      });
    }).catch(() => {
      this.setState({ dataLoading: false });
    });
  };

  render() {
    const { merchantId } = this.props;
    let treeData = this.state.treeData;
    if (treeData.length === 0 && this.state.dataLoading) treeData = [{ label: '加载中', disabled: true }];
    return (<div className="visit-object-choose">
      <TreeSelect
        dropdownStyle={{ zIndex: 999 }}
        value={merchantId ? this.getValueIds() : undefined}
        style={{ width: '80%' }}
        searchPlaceholder="请选择，可多选"
        treeData={treeData}
        onChange={this.onChange.bind(this)}
        multiple
        treeCheckable
        treeDefaultExpandAll
        filterTreeNode={(inputValue, treeNode) => String(treeNode.key).indexOf(inputValue) !== -1}
        disabled={!merchantId}
      />
      <VisitObjectAddLink style={{ marginLeft: 12 }} onAddSuc={this.loadData.bind(this)} merchantId={merchantId} />
    </div>);
  }
}

VisitObjectChoose.validator = validator;

export default VisitObjectChoose;
