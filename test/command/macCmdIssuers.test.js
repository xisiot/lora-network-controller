const path_dir = '../..';
const path = require('path');
const expect = require('chai').expect;
const ADRParamSetupReqTest = require('../../lib/macCmdIssuers/ADRParamSetupReq');
const DeviceTimeAnsTest = require('../../lib/macCmdIssuers/DeviceTimeAns');
const DevStatusReqTest = require('../../lib/macCmdIssuers/DevStatusReq');
const DlChannelReqTest = require('../../lib/macCmdIssuers/DlChannelReq');
const DutyCycleReqTest = require('../../lib/macCmdIssuers/DutyCycleReq');
const ForceRejoinReqTest = require('../../lib/macCmdIssuers/ForceRejoinReq');
const LinkADRReqTest = require('../../lib/macCmdIssuers/LinkADRReq');
const NewChannelReqTest = require('../../lib/macCmdIssuers/NewChannelReq');
const RejoinParamSetupreqTest = require('../../lib/macCmdIssuers/RejoinParamSetupreq');
const RekeyConfTest = require('../../lib/macCmdIssuers/RekeyConf');
const ResetConfTest = require('../../lib/macCmdIssuers/ResetConf');
const RXParamSetupReqTest = require('../../lib/macCmdIssuers/RXParamSetupReq');
const RXTimingSetupReqTest = require('../../lib/macCmdIssuers/RXTimingSetupReq');
const TxParamSetupReqTest = require('../../lib/macCmdIssuers/TxParamSetupReq');
const { utils, consts } = require('../../lib/lora-lib');
const DbClient = require(path.join(path_dir, '/lib/lora-lib/dbClient'));
const DbModels = require(path.join(path_dir, '/models'));
const dbModels = new DbModels(DbClient);
const redisConn = dbModels.redisConn;
const mysqlConn = dbModels.mysqlConn;
const loraLib = require(path.join(path_dir, '/lib/lora-lib'));
const { Log } = loraLib;
const log = new Log();
const obj = {
  mysqlConn: mysqlConn,
  redisConn: redisConn,
  log: log,
};


const devAddr = '0x00046354';
const version = 0x01;
const result_output_ResetConf = {
  '01': {
    Version: Buffer.from([1], 'hex'),
  }
}
describe('Test ResetConf', () => {
  it('send downlink ResetConf', (done) => {
    ResetConfTest.call(obj, devAddr, version)
      .then((data) => {
        expect(data).to.deep.equal(result_output_ResetConf);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const dr = 0xa;
const tx = 0x8;
const chmask = 0x7a88;
const ChMaskCntl = 0x7;
const NbTrans = 0xf;
const datarateTxpower = 0xa8;
const redundancy = 0x7f;
const result_output_LinkADRReq = {
  '03': {
    TXPower: utils.numToHexBuf(datarateTxpower, 1),
    ChMask: Buffer.from('7a88', 'hex'),
    Redundancy: utils.numToHexBuf(redundancy, 1),
  }
}
describe('Test LinkADRReq', () => {
  it('send downlink LinkADRReq', done => {
    LinkADRReqTest.call(obj, devAddr, dr, tx, chmask, ChMaskCntl, NbTrans)
      .then((data) => {
        expect(data).to.deep.equal(result_output_LinkADRReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const DutyCyclePL = 0xa;
const result_output_DutyCycleReq = {
  '04': {
    DutyCyclePL: Buffer.from([10], 'hex'),
  }
}
describe('Test DutyCycleReq', () => {
  it('send downlink DutyCycleReq', done => {
    DutyCycleReqTest.call(obj, devAddr, DutyCyclePL)
      .then((data) => {
        expect(data).to.deep.equal(result_output_DutyCycleReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const RX1DRoffset = 0x5;
const RX2DataRate = 0x7;
const frequency = 0x89afe7;
const DLSettings = 0x57;
const result_output_RXParamSetupReq = {
  '05': {
    DLSettings: utils.numToHexBuf(DLSettings, 1),
    Frequency: Buffer.from('89afe7', 'hex'),
  }
}
describe('Test RXParamSetupReq', () => {
  it('send downlink RXParamSetupReq', done => {
    RXParamSetupReqTest.call(obj, devAddr, RX1DRoffset, RX2DataRate, frequency)
      .then((data) => {
        expect(data).to.deep.equal(result_output_RXParamSetupReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const result_output_DevStatusReq = {
  '06': {
  }
}
describe('Test DevStatusReq', () => {
  it('send downlink DevStatusReq', done => {
    DevStatusReqTest.call(obj, devAddr)
      .then((data) => {
        expect(data).to.deep.equal(result_output_DevStatusReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const chindex = 0x8a;
const freq = 0x8898af;
const maxDR = 0x7;
const minDR = 0xf;
const DrRange = 0x7f;
const result_output_NewChannelReq = {
  '07': {
    ChIndex: Buffer.from('8a', 'hex'),
    Freq: Buffer.from('8898af', 'hex'),
    DrRange: utils.numToHexBuf(DrRange, 1),
  }
}
describe('Test NewChannelReq', () => {
  it('send downlink NewChannelReq', done => {
    NewChannelReqTest.call(obj, devAddr, chindex, freq, maxDR, minDR)
      .then((data) => {
        expect(data).to.deep.equal(result_output_NewChannelReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const settings = 0x07;
const result_output_RXTimingSetupReq = {
  '08': {
    Settings: Buffer.from('07', 'hex'),
  }
}
describe('Test RXTimingSetupReq', () => {
  it('send downlink RXTimingSetupReq', done => {
    RXTimingSetupReqTest.call(obj, devAddr, settings)
      .then((data) => {
        expect(data).to.deep.equal(result_output_RXTimingSetupReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const DownlinkDwellTime = 0x1;
const UplinkDwellTime = 0x0;
const MaxEIRP = 0x7;
const MaxDwellTime = 0x27;
const result_output_TxParamSetupReq = {
  '09': {
    DwellTime: utils.numToHexBuf(MaxDwellTime, 1),
  }
}
describe('Test TxParamSetupReq', () => {
  it('send downlink TxParamSetupReq', done => {
    TxParamSetupReqTest.call(obj, devAddr, DownlinkDwellTime, UplinkDwellTime, MaxEIRP)
      .then((data) => {
        expect(data).to.deep.equal(result_output_TxParamSetupReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const chindex_dlchannelreq = 0x9a;
const freq_dlchannelreq = 0x33056a;
const result_output_DlChannelReq = {
  '0a': {
    ChIndex: Buffer.from('9a', 'hex'),
    Freq: Buffer.from('33056a', 'hex'),
  }
}
describe('Test DlChannelReq', () => {
  it('send downlink DlChannelReq', done => {
    DlChannelReqTest.call(obj, devAddr, chindex_dlchannelreq, freq_dlchannelreq)
      .then((data) => {
        expect(data).to.deep.equal(result_output_DlChannelReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const version_rekey = 0x01;
const result_output_RekeyConf = {
  '0b': {
    Version: Buffer.from('01', 'hex'),
  }
}
describe('Test RekeyConf', () => {
  it('send downlink RekeyConf', done => {
    RekeyConfTest.call(obj, devAddr, version_rekey)
      .then((data) => {
        expect(data).to.deep.equal(result_output_RekeyConf);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const Limit_exp = 0x02;
const Delay_exp = 0x0f;
const result_output_ADRParamSetupReq = {
  '0c': {
    ADRparam: Buffer.from('2f', 'hex'),
  }
}
describe('Test ADRParamSetupReq', () => {
  it('send downlink ADRParamSetupReq', done => {
    ADRParamSetupReqTest.call(obj, devAddr, Limit_exp, Delay_exp)
      .then((data) => {
        expect(data).to.deep.equal(result_output_ADRParamSetupReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const seconds = 0x9fde788a;
const fractionalsec = 0x88;
const result_output_DeviceTimeAns = {
  '0d': {
    Seconds: Buffer.from('9fde788a', 'hex'),
    FractionalSec: Buffer.from('88', 'hex'),
  }
}
describe('Test DeviceTimeAns', () => {
  it('send downlink DeviceTimeAns', done => {
    DeviceTimeAnsTest.call(obj, devAddr, seconds, fractionalsec)
      .then((data) => {
        expect(data).to.deep.equal(result_output_DeviceTimeAns);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const Period = 0x7;
const Max_Retries = 0x6;
const RejoinType = 0x7;
const DR = 0xf;
const ForcerRejoinREQ = 0x227f;
const result_output_ForceRejoinReq = {
  '0e': {
    ForcerRejoinReq: utils.numToHexBuf(ForcerRejoinREQ, consts.FORCEREJOINREQ_LEN),
  }
}
describe('Test ForceRejoinReq', () => {
  it('send downlink ForceRejoinReq', done => {
    ForceRejoinReqTest.call(obj, devAddr, Period, Max_Retries, RejoinType, DR)
      .then((data) => {
        expect(data).to.deep.equal(result_output_ForceRejoinReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

const MaxTimeN = 0x8;
const MaxCountN = 0xa;
const RejoinParamSetupReq = 0x8a;
const result_output_RejoinParamSetupReq = {
  '0f': {
    RejoinParamSetupReq: utils.numToHexBuf(RejoinParamSetupReq, consts.REJOINPARAMSETUPREQ_LEN),
  }
}
describe('Test RejoinParamSetupReq', () => {
  it('send downlink RejoinParamSetupReq', done => {
    RejoinParamSetupreqTest.call(obj, devAddr, MaxTimeN, MaxCountN)
      .then((data) => {
        expect(data).to.deep.equal(result_output_RejoinParamSetupReq);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});

afterEach('Delete the data in Redis', done => {
  setTimeout(() => {
    // delete test cmd req from the queue
    const mqKey_test = consts.MACCMDQUEREQ_PREFIX + devAddr;
    redisConn.DownlinkCmdQueue.delete(mqKey_test).then((data) => {
      log.debug({
        label: 'MAC Command Req Delete',
        message: {
          macCommand: mqKey_test,
          payload: data,
        },
      });
    });
    done();
  }, 100);
});

after('Close connection after 50000ms', done => {
  setTimeout(() => {
    dbModels.close().then(function () {
      done();
    });
  }, 100);
});