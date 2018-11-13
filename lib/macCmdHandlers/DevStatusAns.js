const BluebirdPromise = require('bluebird');

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

    let Battery = status.Battery;
    let Margin = status.Margin;

    if(Battery==0){
      _this.log.debug({
        label:'MAC Command Ans',
        message:{
          DevStatusAns:{
            Battery:'Device had connect to extra battery'
          }
        }
      })
    }
    resolve();
  });
};
