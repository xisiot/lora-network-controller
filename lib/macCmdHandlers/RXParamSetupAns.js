const BluebirdPromise = require('bluebird');

module.exports = function (devAddr, status) {
  let _this = this;
  return new BluebirdPromise((resolve, reject) => {
    _this.log.debug({
      label: 'MAC Command Ans',
      message: {
        RXParamSetupAns: {
          Status: status,
        },
      },
    });

    let RX1DRoffsetACK = status.substring(5, 6);
    let RX2DataRateACK = status.substring(6, 7);
    let ChannelACK = status.substring(7);

    if (RX1DRoffsetACK == 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          RXParamSetupAns: {
            RX1DRoffsetACK: 'RX1DRoffset set Success'
          },
        }
      })
    }

    if (RX2DataRateACK == 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          RXParamSetupAns: {
            RX2DataRateACK: 'RX2DataRate set Success'
          }
        }
      })
    }

    if (ChannelACK == 1) {
      _this.log.debug({
        label: 'MAC Command Ans',
        message: {
          RXParamSetupAns: {
            ChannelACK: 'Channel set Success'
          }
        }
      })
    }

    resolve();
  });
};
