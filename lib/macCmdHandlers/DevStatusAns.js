const BluebirdPromise = require('bluebird');
const { utils, consts } = require('../lora-lib');
const DEVSTATUSANS_PARAM = consts.DEVSTATUSANS;

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        DevStatusAns: {
          Status: status,
        },
      },
    });

    let battery = utils.bufferSlice(status, DEVSTATUSANS_PARAM.BATTERY_START, DEVSTATUSANS_PARAM.BATTERY_START + DEVSTATUSANS_PARAM.BATTERY_LEN, true);
    let margin = utils.bufferSlice(status, DEVSTATUSANS_PARAM.MARGIN_START, DEVSTATUSANS_PARAM.MARGIN_START + DEVSTATUSANS_PARAM.MARGIN_LEN, true);
    let Battery = utils.bitwiseFilter(battery, 0, 7); //change buffer to num
    let Margin = utils.bitwiseFilter(margin, 0, 7); //change buffer to num

    if (Battery === 0) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          DevStatusAns: {
            Battery: 'Device had connect to extra battery',
            Margin: 'Margin is ' + Margin,
          }
        }
      })
    }

    if (Battery === 255) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          DevStatusAns: {
            Battery: 'Device can not measure the battery',
            Margin: 'Margin is ' + Margin,
          }
        }
      })
    }

    resolve();
  });
};
