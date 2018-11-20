const BluebirdPromise = require('bluebird');
const { utils, consts } = require('../lora-lib');
const REJOINPARAMSETUPANS_PARAM = consts.REJOINPARAMSETUPANS;

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        RejoinParamSetupAns: {
          Status: status,
        },
      },
    });

    let TimeOK = utils.bitwiseFilter(status, REJOINPARAMSETUPANS_PARAM.TIMEOK_START, REJOINPARAMSETUPANS_PARAM.TIMEOK_START + REJOINPARAMSETUPANS_PARAM.TIMEOK_LEN, true);

    if (TimeOK === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          RejoinParamSetupAns: {
            TimeOK: 'The device accepted the time and quantity limit',
          }
        }
      })
    }

    resolve();
  });
};
