const BluebirdPromise = require('bluebird');
const MacCommandHandler = require('./macCmdHandlers');
const AdrControlScheme = require('./controlSchemes/adrControlScheme');
const constants = require('./lora-lib/constants');

// const DeviceRXInfo = require('../lib/converter/deviceRXInfo');
// const MacCommand = require('../lib/converter/macCommand');

class ProcessFlow {

  constructor(mysqlConn, redisConn, log) {

    this.mysqlConn = mysqlConn;
    this.redisConn = redisConn;
    this.log = log;
    this.cmdHandler = MacCommandHandler;
    this.adrControlScheme = new AdrControlScheme(mysqlConn, redisConn, log);
  }

  /**
   * process mac command and uplink status report of adr device sequentially
   */
  process(messageObj) {

    if (!messageObj.hasOwnProperty('DevAddr') || !messageObj.hasOwnProperty('adr') ||
      !messageObj.hasOwnProperty('data') || !messageObj.hasOwnProperty('devtx') ||
      !messageObj.hasOwnProperty('gwrx')) {
      return BluebirdPromise.reject(
        new Error(`Invalid message from kafka, Message ${JSON.stringify(messageObj)}`));
    }

    let devAddr = messageObj.DevAddr.toString('hex');
    let isAdr = messageObj.adr;
    let cmds = messageObj.data;
    let remains = {
      devtx: messageObj.devtx,
      gwrx: messageObj.gwrx,
    };

    let _this = this;
    let dlkCmdQue = this.redisConn.DownlinkCmdQueue;
    let log = this.log;
    let processFlow = [];

    /* process mac commands (req and ans) */

    if (!devAddr || !cmds) {
      return BluebirdPromise.reject(new Error('Lack of devAddr or data from kafka message'));
    }

    // get all commands in downlink queue
    const mqKey = constants.MACCMDQUEREQ_PREFIX + devAddr;
    return dlkCmdQue.getAll(mqKey)
      .then((dlkArr) => {

        // misMatchIndex is index in downlink queue
        // first cmd answer in uplink array mismatched cmd req in downlink que
        let misMatchIndex = -1;
        let matchIndex = 0;

        // validate and process cmd in uplink array 'cmds'
        for (let i = 0; i < cmds.length; i++) {
          let cid;
          for (let key in cmds[i]) {
            if (cmds[i].hasOwnProperty(key)) {
              cid = parseInt(key, 16);
            }
          }

          // process cmd req from device (cid = 0x01 0x02 0x0B 0x0D)
          if (constants.QUEUE_CMDANS_LIST.indexOf(cid) !== -1) {
            processFlow.push(_this.__getCmdHandlerFunc(devAddr, cid, cmds[i][cid], remains));
            continue;
          }

          // match cmd answers from device with req in downlink queue
          let dlkcid = null;
          if (dlkArr.length > 0 && matchIndex < dlkArr.length) {
            let dlkobj = JSON.parse(dlkArr[matchIndex]);
            for (let key in dlkobj) {
              if (dlkobj.hasOwnProperty(key)) {
                dlkcid = key;
              }
            }
          }

          if (matchIndex < dlkArr.length && cid === dlkcid) {
            matchIndex++;
            processFlow.push(_this.__getCmdHandlerFunc(devAddr, cid, cmds[i][cid], remains));
          } else {
            if (misMatchIndex === -1) {
              log.debug({
                label: 'uplink cmd mismatched with downlink cmd queue',
                message: {
                  uplinkIndex: i,
                  uplinkCid: cid,
                  downlinkIndex: matchIndex,
                  downlinkCid: dlkcid,
                },
              });
            }

            misMatchIndex = misMatchIndex === -1 ? matchIndex : misMatchIndex;
          }

        }

        // cmds in uplink array more than cmds in downlink queue
        if (misMatchIndex > dlkArr.length) {
          misMatchIndex = dlkArr.length;
        }

        // trim (repush downlink cmd request into queue)
        let startPos = misMatchIndex === -1 ? matchIndex : misMatchIndex;
        return dlkCmdQue.trim(mqKey, startPos, -1);
      }).then(() => {

        /* process uplink status of adr device */

        // push adr device status handler function
        if (isAdr) {
          processFlow.push(_this.adrControlScheme.adrHandler.bind(
            _this.adrControlScheme, devAddr, remains.devtx));
        }

        /* process all command and adr report sequentially */
        return BluebirdPromise.map(processFlow, function (process) {
          return process();
        });
      }).catch((err) => {
        log.error(err.stack);
      });

  }

  /**
   * return promise of uplink command handler
   */
  __getCmdHandlerFunc(devaddr, cid, payload, remains) {

    let _this = this;

    // switch cid to select 'devtx', 'gwrx' in remains
    // and to select command handler
    // fn.bind(_this, ...) is to use 'mysqlConn', 'redisConn' and 'log' of processFlow
    let fn = MacCommandHandler[cid];

    let cmdHandlerFuncs = {

      // LoRaWAN 1.0 Device Request
      [constants.LINKCHECK_CID]: fn.bind(_this, devaddr, remains.devtx, remains.gwrx),

      // LoRaWAN 1.0 Device Answer
      // TODO add 'payload' in fn.bind
      [constants.LINKADR_CID]: fn.bind(_this, devaddr, payload),
      [constants.DEVSTATUS_CID]: fn.bind(_this, devaddr ),
      [constants.RXPARAMSETUP_CID]: fn.bind(_this, devaddr, payload),
      [constants.RXTIMINGSETUP_CID]: fn.bind(_this, devaddr, payload),
      [constants.NEWCHANNEL_CID]: fn.bind(_this, devaddr, payload),
      [constants.DUTYCYCLE_CID]: fn.bind(_this, devaddr, payload),

      // LoRaWAN 1.1 Device Request
      // TODO
      [constants.RESET_CID]: fn.bind(_this, devaddr, payload),
      [constants.REKEY_CID]: fn.bind(_this, devaddr, payload),
      [constants.DEVICETIME_CID]: fn.bind(_this, devaddr, payload, remains.gwrx),

      // LoRaWAN 1.1 Device Answer
      // TODO add 'payload' in fn.bind
      [constants.ADRPARAMSETUP_CID]: fn.bind(_this, devaddr),
      [constants.DLCHANNEL_CID]: fn.bind(_this, devaddr),
      [constants.TXPARAMSETUP_CID]: fn.bind(_this, devaddr),
      [constants.REJOINPARAMSETUP_CID]: fn.bind(_this, devaddr),
      default: BluebirdPromise.resolve(),
    };

    return cmdHandlerFuncs[cid] || cmdHandlerFuncs['default'];
  }
}

module.exports = ProcessFlow;
