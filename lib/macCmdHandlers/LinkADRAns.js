const BluebirdPromise = require('bluebird');
const { consts, utils } = require('../lora-lib');
const LINKADRANS_PARAM = consts.LINKADRANS;

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        LinkADRAns: {
          Status: status,
        },
      },
    });

    let ChannelMaskACK = utils.bitwiseFilter(status, LINKADRANS_PARAM.CHANNELMASKACK_START, LINKADRANS_PARAM.CHANNELMASKACK_START + LINKADRANS_PARAM.CHANNELMASKACK_LEN);
    let DataRateACK = utils.bitwiseFilter(status, LINKADRANS_PARAM.DATARATEACK_START, LINKADRANS_PARAM.DATARATEACK_START + LINKADRANS_PARAM.DATARATEACK_LEN);
    let PowerACK = utils.bitwiseFilter(status, LINKADRANS_PARAM.POWERACK_START, LINKADRANS_PARAM.POWERACK_LEN + LINKADRANS_PARAM.POWERACK_START);

    if (ChannelMaskACK === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          LinkADRAns: {
            ChannelMaskACK: 'Channel Mask set Success',
          },
        }
      })
    }

    if (DataRateACK === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          LinkADRAns: {
            DataRateACK: 'Data Rate set Success',
          },
        }
      })
    }

    if (PowerACK === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          LinkADRAns: {
            PowerACK: 'Power set Success',
          },
        }
      })
    }

    resolve();
  });
};
