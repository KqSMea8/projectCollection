import React, {PropTypes} from 'react';
import {Form, Input, Icon, message} from 'antd';
import ajax from 'Utility/ajax';
import {formatName} from '../../../common/PhotoPicker';

const PhotoTitle = React.createClass({
  propTypes: {
    form: PropTypes.object,
    id: PropTypes.number,
    name: PropTypes.string,
    pid: PropTypes.string,
  },

  getInitialState() {
    return {
      editing: false,
    };
  },

  componentWillMount() {
    this.prevName = formatName(this.props.name).name;
    this.suffix = formatName(this.props.name).suffix;
  },

  showInput(e) {
    e.preventDefault();
    this.setState({
      editing: true,
    });
  },

  hideInput() {
    this.setState({
      editing: false,
    });
  },

  postData(e) {
    e.preventDefault();
    let name = this.props.form.getFieldValue('name');
    if (name.trim() === '') {
      name = this.prevName;
    }
    this.props.form.setFieldsValue({name});
    this.prevName = name;
    ajax({
      url: window.APP.crmhomeUrl + '/material/koubei/editMaterial.json',
      method: 'get',
      data: {
        merchantPid: this.props.pid,
        id: this.props.id,
        name: name + '.' + this.suffix,
      },
      success: (data) => {
        if (!data.success) {
          message.error('修改失败');
        } else {
          message.success('修改成功');
        }
        this.hideInput();
      },
      error: () => {
        message.error('修改失败');
        this.hideInput();
      },
    });
  },

  render() {
    const {editing} = this.state;
    const {getFieldProps} = this.props.form;
    return (<Form style={{
      position: 'relative',
      padding: '0 30px 0 5px',
      height: 34,
      lineHeight: '34px',
      textAlign: 'left',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 14,
    }}>
      {editing && (<Input style={{width: 130, lineHeight: 1.5, height: 28}}
        {...getFieldProps('name', {
          initialValue: formatName(this.props.name).name,
        })}/>)}
      {!editing && (this.props.form.getFieldValue('name') || this.props.name)}
      {editing && (<a href="#"
        style={{position: 'absolute', right: 6, top: 0, fontSize: 18, color: '#666'}}
        onClick={this.postData}><Icon type="save" /></a>)}
      {!editing && (<a href="#"
        style={{position: 'absolute', right: 6, top: 0, fontSize: 18, color: '#666'}}
        onClick={this.showInput}><Icon type="edit" /></a>)}
    </Form>);
  },
});

export default Form.create()(PhotoTitle);
