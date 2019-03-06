import React from 'react';
import { Form, Modal, Button, message } from 'antd';
import { set } from 'lodash';
import { ImgCropModal, ImgPickerModal } from 'hermes-react';
import BaseFormComponent from '../BaseFormComponent';
import ajax from '../../../../common/ajax';
import objectAssign from 'object-assign';
import { Defer } from '../../../../common/utils';
import ImageUploader from './ImageUploader';

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
export default class GoodsFirstImageV2 extends BaseFormComponent {
  static propTypes = {
    ...BaseFormComponent.propTypes,
    label: React.PropTypes.string.isRequired,
  }
  static defaultProps = {
    defaultValue: '',
    rules: [],
    disableFirst: false,
    disableTaobao: false,
  }
  state = {
    ratio: '',
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
      success: (result) => {
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
      rules: [(r, v, cb) => {
        if (!v || !v.itemImage) {
          return cb('请上传 4:3 首图');
        }
        cb();
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

  clickUpload = ratio => {
    this.setState({ visible: true, ratio });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      imgUrl: sampleImg,
      disabled: true,
    });
  }

  changeInfo = cropInfo => {
    this.setState({
      cropInfo,
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
  submit = () => {
    const { cropInfo, imgUrl, imgType, ratio } = this.state;
    if (!cropInfo.imgWidth) {
      message.warning('请分别移动裁剪框进行裁剪', 5);
      return;
    }

    const { field } = this.props;
    const task1 = new Defer();
    const data = {
      xx: cropInfo.X,
      yy: cropInfo.Y,
      width: cropInfo.width,
      height: cropInfo.height,
      orgWidth: cropInfo.imgWidth,
      orgHeight: cropInfo.imgHeight,
      avatarImage: imgUrl,
      fileType: imgType,
    };

    if (ratio === '4:3') {
      data.xx = cropInfo.valid.X;
      data.yy = cropInfo.valid.Y;
      data.width = cropInfo.valid.width;
      data.height = cropInfo.valid.height;
    }

    this.setState({ buttonLoading: true });
    ajax({
      url: window.APP.ownUrl + '/goods/itempromo/cutPicture.json',
      method: 'post',
      type: 'json',
      data,
      success: (res) => {
        if (res.status === 'succeed') {
          task1.resolve(res);
        } else {
          task1.reject(res.resultMsg || '裁剪失败');
        }
      },
      error: (res) => {
        task1.reject(res.resultMsg || '裁剪失败');
      },
    });
    task1.promise.then(res1 => {
      const isTaobao = this.state.ratio === '1:1';
      this.setState({
        visible: false,
        buttonLoading: false,
        imgUrl: sampleImg,
      });
      const currentValue = set({ ...this.form.getFieldValue(field) }, isTaobao ? 'taobaoCoverImage' : 'itemImage', res1.fileId);
      this.form.setFieldsValue({
        [field]: currentValue,
      });

      message.success('裁剪成功');
    }).catch(err => {
      this.setState({
        buttonLoading: false,
      });
      message.warning(err);
    });
  }

  render() {
    const { label, extra, required, labelCol, wrapperCol, disableFirst, disableTaobao } = this.props;
    const { visible, showPhotoView, imgUrl, disabled, buttonLoading } = this.state;
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
              <ImageUploader
                form={this.form}
                ratio="4:3"
                imageType={this.state.imgType}
                field={['firstImage', 'itemImage']}
                onUpload={this.clickUpload}
                style={{ display: 'inline-block' }}
                isDisabled={disableFirst}
              />
              <ImageUploader
                form={this.form}
                ratio="1:1"
                imageType={this.state.imgType}
                field={['firstImage', 'taobaoCoverImage']}
                style={{ marginRight: 10, display: 'inline-block' }}
                onUpload={this.clickUpload}
                isDisabled={disableTaobao}
              />
            </div>
          </FormItem>
          <p style={{ lineHeight: '16px', color: '#999', marginTop: '25px' }}>{React.Children.toArray([extra], d => d)}</p>
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
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>商品封面图片的重要信息在<span style={{ color: '#f60' }}>{this.state.ratio}尺寸</span>比例下均展示完整，且裁剪后主体展示清晰。</p>
              <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
                <ImgCropModal
                  url={imgUrl}
                  isModal={false}
                  style={this.state.ratio === '4:3' ? { width: 370, height: 350 } : { width: 350 }}
                  rate={this.state.ratio === '4:3' ? 4 / 3 : 1}
                  init={this.state.ratio === '4:3' ? { X: 70, Y: 30, width: 320, height: 240 } : { X: 105, Y: 25, width: 250, height: 250 }}
                  over={this.state.ratio === '4:3'}
                  onChange={this.changeInfo}
                />
              </div>
              <div style={{ display: 'inline-block', marginLeft: 20 }}>
                <div style={{ fontSize: '16px' }}>{this.state.ratio}比例展示效果</div>
                <Preview
                  url={imgUrl}
                  fillType="auto"
                  style={{ width: this.state.ratio === '4:3' ? 200 : 150, height: 150, background: '#888' }}
                  crop={this.state.cropInfo}
                />
                <p>该图片将在<span style={{ color: '#f60' }}>{this.state.ratio === '4:3' ? '商品详情页、商品列表页' : '淘抢购、聚划算、大牌抢购'}</span>进行展示</p>
                <a
                  href={this.state.ratio === '4:3' ? 'https://gw.alipayobjects.com/zos/rmsportal/zKNOmvHRsBxbujTSgBtr.png' : 'https://gw.alipayobjects.com/zos/rmsportal/gADQlzIVpeWWpTHNFAMU.png'}
                  target="_blank"
                >查看示例</a>
              </div>
            </div>
          </div>
        </Modal> : null}
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
