import React from 'react';
import objectAssign from 'object-assign';
import PhotoPicker from './OldPhotoPicker/PhotoPicker';

function getCookie(key) {
  const m = new RegExp('\\b' + key + '\\=([^;]+)').exec(document.cookie);
  return m ? m[1] : '';
}

export function formatUrl(url, size = '170x180') {
  const str = url.replace(/&amp;/g, '&');
  const replace = str.substr(str.indexOf('zoom'));
  return str.replace(replace, 'zoom=' + size);
}

export function formatName(file) {
  const array = file.split('.');
  const suffix = array.pop();
  const name = array.join('.');
  const data = {
    name,
    suffix,
  };
  return data;
}

const MyPhotoPicker = React.createClass({
  render() {
    const merchantIdInput = document.getElementById('J_crmhome_merchantId');
    const merchantId = merchantIdInput ? merchantIdInput.value : '';
    const props = objectAssign({
      modalTitle: '选择图片',
      listUrl: (window.APP.ownUrl || '') + '/material/pageMaterial.json',
      listParams: {
        op_merchant_id: merchantId,
      },
      transformListData(data) {
        if (data.materialVOList) {
          data.data = data.materialVOList.map((row) => {
            return {
              id: row.sourceId,
              thumbUrl: formatUrl(row.url, '90x90'),
              url: formatUrl(row.url, '700x700'),
            };
          });
        }
        return data;
      },
      uploadUrl: (window.APP.ownUrl || '') + '/material/picUpload.json',
      uploadParams: {
        op_merchant_id: merchantId,
        ctoken: getCookie('ctoken'),
      },
      transformUploadData(data) {
        if (data.imgModel && data.imgModel.materialList) {
          data.data = data.imgModel.materialList.map((row) => {
            return {
              id: row.sourceId,
              thumbUrl: formatUrl(row.url, '90x90'),
              url: formatUrl(row.url, '700x700'),
            };
          });
        }
        return data;
      },
    }, this.props);
    return <PhotoPicker {...props}/>;
  },
});

export default MyPhotoPicker;
