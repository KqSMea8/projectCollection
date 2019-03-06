const createCampaign = require('./createCampaign');
const campaignDetail = require('./campaignDetail');
const picUpload = require('./picUpload');

module.exports =  Object.assign({}, createCampaign, campaignDetail, picUpload);
