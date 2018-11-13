const BluebirdPromise = require('bluebird');

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

    let Minor = status.substring(3);
    if (Minor == 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          ResetInd: {
            Minor: 'Minor=1 set Success'
          }
        }
      })
    }

    resolve();
  });
};
