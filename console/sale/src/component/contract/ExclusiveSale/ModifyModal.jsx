import React, {PropTypes} from 'react';
import { Modal, Upload, message, Button, Icon, Form } from 'antd';
import ajax from 'Utility/ajax';
import Tree from '@alipay/hermes-asynctree';
import '@alipay/hermes-asynctree/tree.css';
const FormItem = Form.Item;

const ModifyModal = React.createClass({
  propTypes: {
    form: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    record: PropTypes.object,
  },
  getInitialState() {
    const { record } = this.props;
    const _this = this;
    const shopAsyncTree = new Tree({
      controls: true,
      ajax: (option) => {
        const p = ajax(option);
        p.done = p.then;
        return p;
      },
      ajaxOpts(node) {
        let result = {};
        if (node.id === '#') {
          result = {
            url: window.APP.crmhomeUrl + '/goods/contract/getShopCountGroupByCity.json',
            data: {
              partnerId: record.partnerId,
              shopIds: record.participateShopIds,
            },
          };
        } else {
          result = {
            url: window.APP.crmhomeUrl + '/goods/contract/getShopCityInfo.json',
            data: {
              partnerId: record.partnerId,
              cityCodes: node.cityCode,
            },
          };
        }

        return result;
      },
      parse(data, node) {
        // node 为发起请求的节点
        // 此处this 其实是B.model
        let parseResult;
        if (node.id === '#') {
          this.initChecked(data.selectdShopUnionByProvinces);
          parseResult = data.shopUnionByProvinces;
        } else {
          parseResult = data.shopComps;
        }
        return parseResult;
      },
      transformOpts: [
        {id: 'provinceCode', text: 'provinceName', count: 'cityNum', children: 'shopCountGroupByCitys'},
        {id: 'cityCode', text: 'cityName', count: 'shopCount', children: 'shops'},
        {id: 'shopId', text: 'shopName'},
      ],
      onChange(node) {
        if (this.model.level(node.id) === 2) {
          if (this.model.fetch(node.id) !== undefined) {
            this.model.fetch(node.id).then(() => {
              _this.setState({
                shopIds: this.model.checked('LAST'),
              });
            });
          }
        } else {
          _this.setState({
            shopIds: this.model.checked('LAST'),
          });
        }
      },
    });

    return ({
      asyncTree: shopAsyncTree.$xBox.render(),
      fileObj: {},
      fileList: [],
    });
  },
  componentDidMount() {
    this.dada.appendChild(this.state.asyncTree.element[0].querySelector('.J-tree-container'));
  },
  onOK() {
    const { shopIds, fileObj } = this.state;
    const { record } = this.props;
    this.props.onOk(shopIds, record, fileObj);
  },
  onUploadChange(info) {
    if (info.file.status === 'done') {
      if (info.file.response.status === 'succeed') {
        message.success(`${info.file.name} 上传成功。`);
        this.setState({
          fileObj: info.file.response,
          fileList: [info.file],
        });
      } else {
        message.error(`${info.file.name} 上传失败。`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败。`);
    }
  },
  onCancel() {
    this.props.onCancel();
  },
  render() {
    const props = {
      name: 'attachmentFileName',
      action: '/isale/contract/uploadAttachment.json',
      fileList: this.state.fileList,
      onChange: this.onUploadChange,
      accept: '.rar,.zip,.doc,.pdf,.jpg',
    };

    return (<Modal width={700} title="调整参与门店（打款前需先调整门店）" visible onOk={this.onOK} onCancel={this.onCancel}>
      <div ref = {node => this.dada = node} />
      <Form horizontal onSubmit={this.handleSubmit} >
        <FormItem
          label="logo图："
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 16 }}
          help="限传一个文件（截图、邮件等），最大不超过10M，支持扩展名：.rar .zip .doc .pdf .jpg">
          <Upload {...props}>
            <Button type="ghost">
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        </FormItem>
      </Form>
    </Modal>);
  },
});

export default Form.create()(ModifyModal);
