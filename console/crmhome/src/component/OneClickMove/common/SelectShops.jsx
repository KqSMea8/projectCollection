import React from 'react';
import { Input, Button, Modal, Form, Alert, Spin } from 'antd';
import Tree from 'hermes-treeselect';
import { pick } from 'lodash';
import './selectShops.less';
import { saveJumpTo } from '../../../common/utils';
import RepastShopListModal from '../Catering/RepastShopListModal';

function notFoundContent() {
  return <div style={{ textAlign: 'center' }}>暂无数据</div>;
}

function searchTree(searchValue, item) {
  return item.name.indexOf(searchValue) !== -1;
}

const disabledLabelStyle = {
  display: 'inline-block', borderRadius: '4px', padding: '3px 4px',
  color: '#fff', backgroundColor: 'orange', lineHeight: '12px',
};

function renderNode(node) {
  return (
    <span>{node.name} {
      node.leafCount === 0 && node.shopLicenseUnpublished && (
        <span style={disabledLabelStyle}>
          {node.shopCanNotPubItem ? '无证' : '无证(90天试用)'}
        </span>
      )}
    </span>
  );
}

function jumpTo() {
  saveJumpTo(window.APP.kbservcenterUrl + '/sale/index.htm#/shop', '_blank');
}

class SelectShop extends React.Component {
  static contextTypes = {
    form: React.PropTypes.object.isRequired,
  }
  static defaultProps = {
    label: '',
    placeholder: null,
    extra: null,
    required: false,
    rules: [],
    shopList: [],
    disabledIds: [],
    defaultExpandLevel: 1,
    className: '',
    shopLoading: true,
    goodsLock: false,
    shopName: [],
  }
  constructor(props, ctx) {
    super(props);
    this.form = ctx.form;
    this.state = {
      visible: false,
      innerChecked: this.form.getFieldValue(props.field) || [],
      searchValue: '',
      shopListModal: false,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.form = nextContext.form;
    this.setState({ innerChecked: this.form.getFieldValue(nextProps.field) || [] });
  }

  onOk = () => {
    const { field } = this.props;
    this.form.setFieldsValue({
      [field]: this.state.innerChecked,
    });
    this.setState({
      visible: false,
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onChange = (models) => {
    this.setState({
      innerChecked: models.checked(),
    });
  }

  get footer() {
    return (
      <div>
        <Button onClick={this.onCancel}>取 消</Button>
        <Button
          onClick={this.onOk}
          type="primary"
        >
          确 定 ({this.state.innerChecked.length})
        </Button>
      </div>
    );
  }

  searchValueChange = e => {
    this.setState({
      searchValue: e.target.value,
    });
  }

  cancelShopListModal = () => {
    this.setState({
      shopListModal: false,
    });
  }

  render() {
    const { shopList, disabledIds, defaultExpandLevel, className, rules, extra, shopLoading, shopName, goodsLock } = this.props;
    const formItemProps = pick(this.props, ['label', 'labelCol', 'wrapperCol', 'help', 'extra', 'required']);
    return (
      <Form.Item
        extra={extra}
        {...formItemProps}
      >
        <input type="hidden" {...this.form.getFieldProps(this.props.field, { rules }) } />
        {shopLoading && <Spin/>}
        {this.state.innerChecked.length > 0 && !shopLoading ? `已选 ${(this.form.getFieldValue(this.props.field) || []).length} 家门店` : ''}
        {extra && !shopLoading && this.state.innerChecked.length === 0 ? '选择门店' : ''}
        {!extra && !shopLoading && !goodsLock && <a onClick={() => this.setState({ visible: true })}>{this.state.innerChecked.length > 0 ? '修改' : '选择门店'}</a>}
        {!extra && !shopLoading && goodsLock && <a onClick={() => this.setState({ shopListModal: true })}>{this.state.innerChecked.length > 0 ? '查看' : '查看门店'}</a>}
        {!shopLoading && <Modal
          className={className}
          width="700"
          visible={this.state.visible}
          title="选择门店"
          cancelText="取消"
          onOk={this.onOk}
          onCancel={this.onCancel}
          footer={this.footer}
          closable={false}
        >
          <Alert message="部分门店可能未达要求，无法选择参加活动" type="info" showIcon />
          <div style={{ marginBottom: '12px', display: 'inline-block' }}>
            门店名称：
            <div style={{ display: 'inline-block' }}>
              <Input
                onKeyPress={this.enterHandler}
                type="text"
                placeholder="过滤门店名称"
                onChange={this.searchValueChange}
              />
            </div>
          </div>
          <Tree
            disabled={disabledIds}
            defaultExpandLevel={defaultExpandLevel}
            notFoundContent={notFoundContent}
            treeData={shopList}
            checked={this.state.innerChecked}
            onChange={this.onChange}
            search={searchTree}
            nodeText={renderNode}
            searchValue={this.state.searchValue}
          />
          <div style={{ paddingTop: '10px' }}>
            <span style={disabledLabelStyle}>
              无证
            </span>&nbsp;
            打标门店未上传证照信息，不符合活动参与要求，请先到“<a onClick={jumpTo}>我的门店</a>”中上传证照
          </div>
        </Modal>}
        {!shopLoading && <RepastShopListModal
          visible={this.state.shopListModal}
          shops={shopName}
          hide={this.cancelShopListModal}
        />}
      </Form.Item>
    );
  }
}

export default SelectShop;
