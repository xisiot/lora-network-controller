const BluebirdPromise = require('bluebird');
const { consts, utils } = require('../lora-lib');
const MacCommandIssuers = require('../macCmdIssuers');

module.exports = function (devAddr, status, gwrx) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        DeviceTimeReq: {
          Status: status,
        },
      },
    });

    let seconds = gwrx.time;
    let fractionalsec = gwrx.time;
    return MacCommandIssuers[consts.DEVICETIME_CID].bind(devAddr, seconds, fractionalsec);

    resolve();
  });
};
