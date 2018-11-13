const BluebirdPromise = require('bluebird');

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

    let ChannelMaskACK = status.substring(5, 6);
    let DataRateACK = status.substring(6, 7);
    let PowerACK = status.substring(7);

    if (ChannelMaskACK == 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          LinkADRAns: {
            ChannelMaskACK: 'Channel Mask set Success',
          },
        }
      })
    }

    if (DataRateACK == 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          LinkADRAns: {
            DataRateACK: 'Data Rate set Success',
          },
        }
      })
    }

    if (PowerACK == 1) {
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
