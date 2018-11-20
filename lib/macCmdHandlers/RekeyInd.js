const BluebirdPromise = require('bluebird');
const { consts, utils } = require('../lora-lib');
const REKEYIND_PARAM = consts.REKEYIND;
const MacCommandIssuers = require('../macCmdIssuers');

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        RekeyInd: {
          Status: status,
        },
      },
    });

    const minor = utils.bitwiseFilter(status, REKEYIND_PARAM.MINOR_START, REKEYIND_PARAM.MINOR_START + REKEYIND_PARAM.MINOR_LEN);
    if (minor === 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          RekeyInd: {
            Minor: 'Minor=1 set Success',
          }
        }
      })
    }

    return MacCommandIssuers[consts.REKEY_CID].bind(devAddr, minor);

    resolve();
  });
};
