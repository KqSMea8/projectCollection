import React, { Component } from 'react';
import { Table, Input, Select, Icon } from 'antd';
import { StuffTypeText } from '../../common/enum';
import { SubmitStatus } from 'Utility/ajax';
const Option = Select.Option;

export default class TemplateEditTable extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.getMaterialList(this.props);
  }

  componentWillReceiveProps(next) {
    this.getMaterialList(next);
  }

  // 在组件挂载和更新props时获取新的材料列表
  getMaterialList = (props) => {
    // material list
    const { stuffAttrList, data } = props;
    const stuffAttr = stuffAttrList.find(s => s.stuffAttrId === data.stuffAttrId);
    this.materialList = stuffAttr ? stuffAttr.material : [];
  };

  materialList = [];

  handleMaterialChange = (code) => {
    const material = this.materialList.find(m => m.code === code);
    this.props.onMaterialChange(material);
  };

  render() {
    const {data, checkedMaterial, quantity, price, queryPriceStatus,
      totalPrice, onApplyQuantityChange, onClickPickTemplate} = this.props;
    const renderFooter = () => {
      return (<span className="price">申请预估金额：<em>{totalPrice}元</em></span>);
    };
    const renderPriceHelp = () => {
      if (!checkedMaterial) {
        return null;
      }
      if (queryPriceStatus === SubmitStatus.SUBMITTING) {
        return <div style={{color: '#f04134'}}>正在查询物料材质价格</div>;
      }
      if (queryPriceStatus === SubmitStatus.DONE) {
        if (price) {
          return <div style={{color: '#009900'}}>预估单价{price.amount}元</div>;
        }
        return <div style={{color: '#f04134'}}>该物料材质暂不支持申请</div>;
      }
      if (queryPriceStatus === SubmitStatus.FAILED) {
        return <div style={{color: '#f04134'}}>物料材质价格查询失败</div>;
      }
    };
    const columns = [
      {
        title: '模板ID/名称',
        dataIndex: 'id',
        render: (text, record) => <div><span>{record.id}</span><br/><span>{record.name}</span></div>
      },
      {title: '物料属性', dataIndex: 'stuffAttrName'},
      {title: '物料类型', dataIndex: 'stuffType', render: t => StuffTypeText[t]},
      {title: '规格尺寸', dataIndex: 'sizeName'},
      {
        title: '物料材质', dataIndex: '', render: () => {
          return (
            <div>
              <Select
                style={{width: 300}}
                onChange={this.handleMaterialChange}
                value={checkedMaterial ? checkedMaterial.code : ''}
              >
                {this.materialList.map(m => <Option key={m.code} value={m.code}>{m.name}</Option>)}
              </Select>
              {renderPriceHelp()}
            </div>
          );
        }
      },
      {
        title: '申请数量', dataIndex: '', render: () => {
          return (<Input type="number" style={{width: 100}} value={quantity} onChange={onApplyQuantityChange}/>);
        }
      },
      {title: '操作', dataIndex: '_null', render: () => <a onClick={onClickPickTemplate}><Icon type="edit" />修改</a>},
    ];
    return (
      <div className="template-editor">
        <Table dataSource={[data]} columns={columns} footer={renderFooter} pagination={false}/>
      </div>
    );
  }
}
