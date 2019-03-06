import React from 'react';
import { Form, Icon, Modal, Button, message } from 'antd';
import BaseFormComponent from './BaseFormComponent';
import { ImgCropModal, ImgPickerModal } from 'hermes-react';
import ajax from '../../../common/ajax';
import objectAssign from 'object-assign';
import { getImageById, Defer } from '../../../common/utils';


const FormItem = Form.Item;
const Preview = ImgCropModal.Preview;

function formatUrl(url, size = 'original') {
  const str = url.replace(/&amp;/g, '&');
  const replace = str.substr(str.indexOf('zoom'));
  return str.replace(replace, 'zoom=' + size);
}

function transformListData(data) {
  if (data.materialVOList) {
    data.data = data.materialVOList.map((row) => {
      return {
        id: row.sourceId,
        name: row.name,
        thumbUrl: formatUrl(row.url, 'original'),
        url: formatUrl(row.url, 'original'),
      };
    });
  }
  return data;
}
function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}
const sampleImg = 'https://gw.alipayobjects.com/zos/rmsportal/xGGWgTNalLOkBkWpgyWD.png';
export default class GoodsFirstImage extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    defaultValue: '',
    rules: [],
  }
  state = {
    visible: false,
    positionInfo1: null,
    positionInfo2: null,
    showPhotoView: false,
    previewVisible: false,
    imgUrl: sampleImg,
    firstImage: {},
    file: {},
    disabled: true,
    filepositionInfo1: {},
    filepositionInfo2: {},
    buttonLoading: false,
    imgType: 'jpg',
  };
  componentDidMount() {
    this.getInitValue();
    this.getData();
  }
  getInitValue = () => {
    const { getFieldValue } = this.form;
    this.setState({
      firstImage: getFieldValue(this.props.field),
    });
  }
  getData = () => {
    const listUrl = (window.APP.ownUrl || '') + '/material/pageMaterial.json';
    ajax({
      url: listUrl,
      success: (result)=> {
        const newResult = transformListData(result);
        if (newResult.success) {
          let allData = newResult.data;
          const tmpMap = {};
          allData.forEach(item => {
            tmpMap[item.id] = item;
          });
          allData = [];
          Object.keys(tmpMap).forEach((i) => {
            allData.push(tmpMap[i]);
          });
          this.update(allData);
        }
      },
    });
  }
  get fieldProps() {
    const { getFieldProps } = this.form;
    const { field } = this.props;
    return getFieldProps(field, {
      rules: [{
        required: true, message: '请上传一张图片',
      }],
    });
  }
  clickShowModal = () => {
    this.setState({
      showPhotoView: true,
      visible: false,
    });
  }
  hideModal = () => {
    this.setState({
      showPhotoView: false,
      imgUrl: sampleImg,
      disabled: true,
    });
  }

  addFiles = (file) => {
    let type = 'jpg';
    if (file && file[0] && file[0].name) {
      type = file[0].name.split('.').pop();
    }
    this.setState({
      showPhotoView: false,
      imgUrl: file[0].thumbUrl,
      file: file[0],
      visible: true,
      disabled: false,
      imgType: type,
    });
  }

  beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
      if (['image/jpeg', 'image/gif', 'image/png', 'image/bmp'].indexOf(file.type) < 0) {
        message.error(`${file.name}图片格式错误`);
        reject(`${file.name}图片格式错误`);
      } else if (file.size > 5 * 1024 * 1024) {
        message.error('图片大小不超过5M');
        reject('图片大小不超过5M');
      } else {
        resolve();
      }
    });
  }

  clickUpload = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      imgUrl: sampleImg,
      disabled: true,
    });
  }

  changeInfo = (infoName) => (info) => {
    this.setState({
      [infoName]: info.valid,
      ['file' + infoName]: info,
    });
  }
  handlePreview = () => {
    this.setState({
      previewVisible: true,
    });
  }
  previewCancel = () => {
    this.setState({ previewVisible: false });
  }
  deleteImg = () => {
    const { field } = this.props;
    this.setState({
      firstImage: {},
      imgUrl: sampleImg,
      disabled: true,
    });
    this.form.setFieldsValue({[field]: undefined});
  }
  submit = () => {
    const { filepositionInfo1, filepositionInfo2, imgUrl, imgType } = this.state;
    if (!filepositionInfo1.imgWidth || !filepositionInfo2.imgWidth) {
      message.warning('请分别移动裁剪框进行裁剪', 5);
      return;
    }
    const { field } = this.props;
    const p1 = new Defer();
    const p2 = new Defer();
    const cutParams1 = {
      xx: filepositionInfo1.X,
      yy: filepositionInfo1.Y,
      width: filepositionInfo1.width,
      height: filepositionInfo1.height,
      orgWidth: filepositionInfo1.imgWidth,
      orgHeight: filepositionInfo1.imgHeight,
      avatarImage: imgUrl,
      fileType: imgType,
    };
    const cutParams2 = {
      xx: filepositionInfo2.X,
      yy: filepositionInfo2.Y,
      width: filepositionInfo2.width,
      height: filepositionInfo2.height,
      orgWidth: filepositionInfo2.imgWidth,
      orgHeight: filepositionInfo2.imgHeight,
      avatarImage: imgUrl,
      fileType: imgType,
    };
    this.setState({buttonLoading: true});
    ajax({
      url: '/goods/itempromo/cutPicture.json',
      method: 'post',
      type: 'json',
      data: cutParams1,
      success: (res) => {
        if (res.status === 'succeed') {
          p1.resolve(res);
        } else {
          p1.reject(res.resultMsg || '裁剪失败');
        }
      },
      error: (res) => {
        p1.reject(res.resultMsg || '裁剪失败');
      },
    });
    ajax({
      url: '/goods/itempromo/cutPicture.json',
      method: 'post',
      type: 'json',
      data: cutParams2,
      success: (res) => {
        if (res.status === 'succeed') {
          p2.resolve(res);
        } else {
          p2.reject(res.resultMsg || '裁剪失败');
        }
      },
      error: (res) => {
        p2.reject(res.resultMsg || '裁剪失败');
      },
    });
    Promise.all([p1.promise, p2.promise]).then(([res1, res2]) => {
      this.setState({
        visible: false,
        buttonLoading: false,
        firstImage: {
          itemImage: res1.fileId,
          taobaoCoverImage: res2.fileId,
        },
      });
      this.form.setFieldsValue({[field]: {
        itemImage: res1.fileId,
        taobaoCoverImage: res2.fileId,
      }});
      message.success('裁剪成功');
    }).catch(err => {
      this.setState({
        buttonLoading: false,
      });
      message.warning(err);
    });
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol } = this.props;
    const { positionInfo1, positionInfo2, visible, showPhotoView, imgUrl, disabled, firstImage, previewVisible, buttonLoading } = this.state;
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const merchantId = merchantIdInput ? merchantIdInput.value : '';
    const props = objectAssign({
      title: '商品封面图',
      uploadUrl: (window.APP.ownUrl || '') + '/material/picUpload.json',
      uploadParams: {
        op_merchant_id: merchantId,
        ctoken: getCookie('ctoken'),
      },
      fetch: (cb) => {
        this.update = cb;
      },
      uploadChange: (data) => {
        let newData;
        if (data.imgModel && data.imgModel.materialList) {
          newData = data.imgModel.materialList.map((row) => {
            return {
              id: row.sourceId,
              thumbUrl: formatUrl(row.url, 'original'),
              url: formatUrl(row.url, 'original'),
            };
          });
        }
        this.getData();
        return {
          success: true,
          data: newData.length && newData[0],
        };
      },
    });
    return (
      <div>
        <FormItem
        label={label}
        required={required}
        labelCol={labelCol}
        wrapperCol={wrapperCol}
      >
        <FormItem>
          <div {...this.fieldProps}>
            {firstImage && firstImage.itemImage ? <div key="waistBannerDTOurl" className="ant-upload-list ant-upload-list-picture-card">
              <div className="ant-upload-list-item ant-upload-list-item-done">
                <div className="ant-upload-list-item-info">
                  <a className="ant-upload-list-item-thumbnail">
                    <img src={getImageById(firstImage.itemImage)}/>
                  </a>
                  <span>
                    <a onClick={this.handlePreview}>
                      <i className=" anticon anticon-eye-o"></i>
                    </a>
                    <i className=" anticon anticon-delete" onClick={this.deleteImg}></i>
                  </span>
                </div>
              </div>
            </div> :
            <div className="ant-upload ant-upload-select ant-upload-select-picture-card" onClick={this.clickUpload}>
              <span className="rc-upload"><Icon type="plus" /></span>
            <div className="ant-upload-text">上传图片</div>
          </div>}
        </div>
        </FormItem>
      <p style={{lineHeight: '16px', color: '#999', marginTop: '25px'}}>{extra}</p>
      </FormItem>
      {visible ? <Modal
        title="商品封面图"
        width={800}
        visible={visible}
        footer={[
          <Button key="submit" type="primary" size="large" loading={buttonLoading} disabled={disabled} onClick={this.submit}>
            确认使用图片
          </Button>,
        ]}
        onCancel={this.handleCancel}
        >
          <div>
            <Button type="primary" onClick={this.clickShowModal}>上传封面图</Button>
            <div style={{ lineHeight: '2em', marginTop: '10px' }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>商品封面图片的重要信息在<span style={{ color: '#f60' }}>4:3、1:1尺寸</span>比例下均展示完整，且裁剪后主体展示清晰。</p>
              <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                <ImgCropModal
                  url={imgUrl}
                  isModal={false}
                  style={{width: 370, height: 350}}
                  rate={4 / 3}
                  init={{X: 70, Y: 30, width: 320, height: 240}}
                  over
                  onChange={this.changeInfo('positionInfo1')}
                />
              </div>
              <div style={{display: 'inline-block', marginLeft: 20}}>
                <div style={{ fontSize: '16px'}}>4:3比例展示效果</div>
                <Preview
                  url={imgUrl}
                  fillType="auto"
                  style={{width: 200, height: 150, background: '#888'}}
                  crop={positionInfo1}
                />
                <p>该图片将在<span style={{color: '#f60'}}>商品详情页、商品列表页</span>进行展示</p>
                <a href="https://gw.alipayobjects.com/zos/rmsportal/zKNOmvHRsBxbujTSgBtr.png" target="_blank">查看示例</a>
              </div>
              <div style={{display: 'inline-block', verticalAlign: 'top', marginTop: 20 }}>
                <ImgCropModal
                  url={imgUrl}
                  isModal={false}
                  style={{width: 370, height: 350}}
                  rate={1}
                  init={{X: 130, Y: 45, width: 200, height: 200}}
                  over
                  onChange={this.changeInfo('positionInfo2')}
                />
              </div>
              <div style={{display: 'inline-block', margin: 20}}>
                <div style={{ fontSize: '16px'}}>1:1比例的展示效果</div>
                <Preview
                  url={imgUrl}
                  fillType="auto"
                  style={{width: 150, height: 150, background: '#888'}}
                  crop={positionInfo2}
                />
                <p>该图片将在<span style={{color: '#f60'}}>淘抢购、聚划算、大牌抢购</span>等渠道展示</p>
                <a href="https://gw.alipayobjects.com/zos/rmsportal/gADQlzIVpeWWpTHNFAMU.png" target="_blank">查看示例</a>
              </div>
            </div>
          </div>
        </Modal> : null}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.previewCancel}
          width="750"
        >
          <div style={{height: '345px', marginTop: '20px'}}>
            <div style={{width: '56%', float: 'left'}}>
              <p style={{ fontSize: '16px'}}>4:3尺寸展示效果</p>
              <p>该图片将在<span style={{color: '#f60'}}>商品详情页、商品列表页</span>进行展示</p>
              {firstImage && firstImage.itemImage && <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(firstImage.itemImage)} /></div>}
            </div>
            <div style={{width: '44%', float: 'left', paddingLeft: '15px'}}>
              <p style={{ fontSize: '16px'}}>1:1尺寸展示效果</p>
              <p>该图片将在<span style={{color: '#f60'}}>淘抢购、聚划算、大牌抢购</span>等渠道展示</p>
              {firstImage && firstImage.taobaoCoverImage ? <div style={{height: '301px', overflow: 'hidden'}}><img style={{ width: '100%' }} src={getImageById(firstImage.taobaoCoverImage)} /></div> :
              <div style={{ textAlign: 'center', fontSize: '16px', color: '#999', paddingTop: '140px', backgroundColor: '#eee', height: '301px'}}>暂无图片</div>}
            </div>
          </div>
        </Modal>
        <ImgPickerModal
          {...props}
          visible={showPhotoView}
          multiple={false}
          onOk={this.addFiles}
          onCancel={this.hideModal}
          beforeUpload={this.beforeUpload}
        />
      </div>
    );
  }
}
