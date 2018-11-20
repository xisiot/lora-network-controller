const BluebirdPromise = require('bluebird');
const { consts, utils } = require('../lora-lib');
const RESTIND_PARAM = consts.RESETIND;
const MacCommandIssuers = require('../macCmdIssuers');

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        ResetInd: {
          Status: status,
        },
      },
    });

    let Minor = utils.bitwiseFilter(status, RESTIND_PARAM.MINOR_START, RESTIND_PARAM.MINOR_START + RESTIND_PARAM.MINOR_LEN);
    if (Minor === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          ResetInd: {
            Minor: 'Minor=1 set Success',
          }
        }
      })
    }

    return MacCommandIssuers[consts.RESET_CID].bind(devAddr, Minor);

    resolve();
  });
};
