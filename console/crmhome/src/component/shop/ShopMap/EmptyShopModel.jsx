import React, {PropTypes} from 'react';
import {Modal, Input, Form, message, Button} from 'antd';
import ajax from '../../../common/ajax';
import classnames from 'classnames';

const FormItem = Form.Item;

const EmptyShopModel = React.createClass({
  propTypes: {
    form: PropTypes.object,
    map: PropTypes.object,
    shopDate: PropTypes.object,
    edit: PropTypes.bool,
    params: PropTypes.object,
    visibleType: PropTypes.func,
  },

  getInitialState() {
    return {
      visible: false,
    };
  },

  setTimeoutFunc() {
    setTimeout(() => {
      const params = this.props.params;
      if ( params.buildingId && params.shopId) {
        location.href = '#/shop/map';
      } else {
        location.reload();
      }
    }, 1000);
  },

  handleCancel() {
    this.setState({
      visible: false,
    });
    this.props.visibleType();
  },

  showEmptyShop() {
    this.setState({
      visible: true,
    });
  },

  handleOk() {
    const self = this;
    const shopDate = self.props.shopDate;
    const buildingIdKey = localStorage.getItem('buildingId');
    const {switchBool} = this.props;
    if (switchBool) {
      ajax({
        url: 'https://indoorreaper.amap.com/api/getapplystatus/?poiid=' + (buildingIdKey || this.props.buildingId) + '&key=1c8441e2d9e4fe2ba6fbbeefc0c0179f&callback=aaa',
        method: 'get',
        type: 'jsonp',
        success: (resl) => {
          if (resl.status === '0' || resl.status === '1' || resl.status === '3') {
            this.props.form.submit(() => {
              this.props.form.validateFields((error, values)=> {
                if (error) {
                  return;
                }
                self.props.map.EditService.updateShop({'ft_name_cn': values.ShopName, 'ft_sourceid': shopDate.ft_sourceid || shopDate.data[0].ft_sourceid, 'ft_typecode': '000400'}, function fn(e) {
                  if ( e.msg === 'SUCCESS' ) {
                    const data = {
                      oldAreaId: shopDate.ft_sourceid || shopDate.data[0].ft_sourceid,
                      remarks: values.ShopName,
                    };
                    self.handleAjax(data, data.oldAreaId);
                  }
                });
              });
            });
          } else {
            message.error('地图更新中，暂时无法编辑，请稍后再试。');
          }
        },
      });
    } else {
      this.props.form.submit(() => {
        this.props.form.validateFields((error, values)=> {
          if (error) {
            return;
          }
          const data = {
            oldAreaId: shopDate.ft_sourceid || shopDate.data[0].ft_sourceid,
            remarks: values.ShopName,
          };
          self.handleAjax(data, data.oldAreaId);
        });
      });
    }
    self.setState({
      visible: false,
    });
    self.props.visibleType();
  },

  handleAjax(data, id) {
    const self = this;
    ajax({
      url: window.APP.kbretailprod + '/gaodeMap.json?action=/shopRelation/delete',
      method: 'get',
      type: 'json',
      data: {
        data: JSON.stringify(data),
      },
      withCredentials: true,
      success: (res) => {
        if (res.success === true) {
          message.success(self.props.edit ? '修改成功' : '配置成功');
          setTimeout(()=> {
            self.props.map.setShopStyle(id, {fillColor: '#ddd', color: '#d1ccc0', fontColor: '#000'});
            self.props.map.reload();
          }, 1000);
        } else {
          message.error( res.errorMsg || '操作失败');
          setTimeout(()=> {
            self.props.map.reload();
          }, 1000);
        }
      },
    });
  },

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    return (<span>
      <Button type="default" style={{marginLeft: '10px'}} onClick={this.showEmptyShop}>置空门店</Button>
      <Modal title="置空门店" visible={this.state.visible} onCancel={this.handleCancel} width={500} okText={'确定'} cancelText={'取消'} onOk={this.handleOk}>
        <Form horizontal>
          <FormItem
            required
            validateStatus={
              classnames({
                error: !!getFieldError('ShopName'),
              })}
            help={getFieldError('ShopName')}
            labelCol={{span: 4}}
            wrapperCol={{span: 12}}>
            <Input style={{width: '400px'}} {...getFieldProps('ShopName', {
              initialValue: '',
              validateFirst: true,
              rules: [{
                message: '此处必填',
                required: true,
              }, {
                max: 10,
                message: '限10个字',
              }],
            })}
            placeholder="输入置空门店原因，如装修中，已关店及其他门店名称"/>
          </FormItem>
        </Form>
      </Modal>
    </span>);
  },
});

export default Form.create()(EmptyShopModel);
