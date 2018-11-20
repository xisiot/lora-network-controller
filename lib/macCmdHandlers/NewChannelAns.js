const BluebirdPromise = require('bluebird');
const { utils, consts } = require('../lora-lib');
const NEWCHANNLANS_PARAM = consts.NEWCHANNELANS;

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        NewChannelAns: {
          Status: status,
        },
      },
    });

    let channelFrequency = utils.bitwiseFilter(status, NEWCHANNLANS_PARAM.CHANNELFREQUENCY_START, NEWCHANNLANS_PARAM.CHANNELFREQUENCY_START + NEWCHANNLANS_PARAM.CHANNEKFREQUENCY_LEN, true);
    let dataRateRange = utils.bitwiseFilter(status, NEWCHANNLANS_PARAM.DATARATERANGE_START, NEWCHANNLANS_PARAM.DATARATERANGE_START + NEWCHANNLANS_PARAM.DATARATERANGE_LEN, true);

    if (channelFrequency === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          NewChannelAns: {
            ChannelFrequency: 'Device can use the setted frequency',
          }
        }
      })
    }

    if (dataRateRange === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          NewChannelAns: {
            DataRateRange: 'The data rate range is consistent with the device',
          }
        }
      })
    }

    if (channelFrequency === 0 || dataRateRange === 0) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          NewChannelAns: 'NewChannelReq not carry out ',
        }
      })
    }

    resolve();
  });
};
