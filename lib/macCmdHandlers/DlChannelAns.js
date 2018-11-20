const BluebirdPromise = require('bluebird');
const { utils, consts } = require('../lora-lib');
const DLCHANNELANS_PARAM = consts.DLCHANNELANS;

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        DlChannelAns: {
          Status: status,
        },
      },
    });

    let channelFrequency = utils.bitwiseFilter(status, DLCHANNELANS_PARAM.CHANNELFREQUENCY_START, DLCHANNELANS_PARAM.CHANNELFREQUENCY_START + DLCHANNELANS_PARAM.CHANNELFREQUENCY_LEN, true);
    let uplinkFrequency = utils.bitwiseFilter(status, DLCHANNELANS_PARAM.UPLINKFREQUENCY_START, DLCHANNELANS_PARAM.UPLINKFREQUENCY_START + DLCHANNELANS_PARAM.UPLINKFREQUENCY_LEN, true);

    if (channelFrequency === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          DlChannelAns: {
            ChannelFrequency: 'Device can use the setted frequency',
          }
        }
      })
    }

    if (uplinkFrequency === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          DlChannelAns: {
            uplinkFrequency: 'The channel uplink frequency is legal',
          }
        }
      })
    }

    resolve();
  });
};
