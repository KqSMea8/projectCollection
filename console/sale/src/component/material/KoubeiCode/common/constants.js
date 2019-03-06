import { appendOwnerUrlIfDev } from '../../../../common/utils';
/**
 * 门店列表 Excel 模板
 */
export const EXCEL_TEMPLATE_URL = appendOwnerUrlIfDev('/sale/kbcode/bindCodeTemplateDownload.json');

/**
 * 商圈海报模板 AI 源文件下载地址
 */
export const MALL_AI_FILE = window.APP.kbretailprodUrl + '/redirect.htm?data=mallAiDownload';

/**
 * 门店列表 Excel 上传地址
 */
export const EXCEL_UPLOAD_URL = appendOwnerUrlIfDev('/sale/kbcode/bindCodeExcelUpload.json');

/**
 * 门店列表 ISV 导入地址
 * @type {string}
 */
export const IMPORT_FROM_ISV_URL = appendOwnerUrlIfDev('/sale/kbcode/bindCodeAppImport.json');

/**
 * 模糊查询门店列表
 */
export const SEARCH_SHOP_URL = appendOwnerUrlIfDev('/sale/kbcode/searchAgentShops.json');

/**
 * 模糊查询商户
 */
export const SEARCH_MERCHANT_URL = appendOwnerUrlIfDev('/sale/merchant/queryByName.json');

/**
 * 打包下载URL接口
 */
export const DOWN_KOUBEI_CODE_URL_URL = appendOwnerUrlIfDev('/sale/kbcode/exportKbCodeUrl.json');

/**
 * 打包下载码 postMessage type
 * @type {string}
 */
export const BATCH_CODE_DOWNLOAD = 'BATCH_CODE_DOWNLOAD';

/**
 * 打包下载码 window document ready type
 * @type {string}
 */
export const DOWNLOAD_WINDOW_READY = 'DOWNLOAD_WINDOW_READY';

/**
 * 生成码时备注信息长度限制
 */
export const REMARK_MAX_LEN = 1000;

/**
 * 物料材质要求文档下载链接
 */
export const DOWNLOAD_GUIDE__URL = 'http://p.tb.cn/rmsportal_6887__E7_A0_81_E7_89_A9_E6_96_99_E5_88_B6_E4_BD_9C_E6_A0_87_E5_87_865_E6_9C_8818_E6_97_A5.pdf';

/**
 * 商圈独立二维码的模板 nickname
 * NOTE: 硬编码（后端也是硬编码……）
 */
export const MALL_SINGLE_QRCODE_TEMPLATE_NICKNAME = 'MALL_DOOR_PASTER_296_320';
