// This is a template config file
// Please COPY this file when deploying a new server
'use strict';
const nsid = 1;

module.exports = {
  database: {
    mysql: {
      username: 'username',
      password: 'password',
      database: 'mysql',
      host: 'localhost',
      port: 3306,
      dialect: 'mysql',
      operatorsAliases: false,
      logging: false,
      timezone: '+08:00',
      define: {
        'freezeTableName': true,
        'timestamp': true,
        'charset': 'utf8',
      },
    },
    redis: {
      cluster: false,
      options: [{
        host: 'localhost',
        port: 6379,
        retryStrategy: function (times) {
          var delay = Math.min(times * 50, 30000);
          if (delay >= 30000) {
            console.log('---------------Redis Retry close---------------');
            return 'close';
          }
          return delay;
        }
      }],
    },
  },
  mocha: {
    timeout: 5000,
    longTimeOut: 15000,
  },
  nsid: nsid,
  mqClient_nct: {
    nsid: `${nsid}`, // if exist in topic schema
    consumerGroup: {
      options: {
        kafkaHost: 'localhost:9092',
        groupId: `lora-network-controller-message-dispatch-in-${nsid}`,
        sessionTimeout: 15000,
        protocol: ['roundrobin'],
        fromOffset: 'latest'
      },
      topics: ['CS-sub']
    },
    client: {
      kafkaHost: 'localhost:9092',
      clientId: `lora-network-controller-message-dispatch-out-${nsid}`
    },
    producer: {
      requireAcks: 1,
      ackTimeoutMs: 100,
      partitionerType: 2
    },
    schemaPath: {
      messages: 'config/messages.json',
      common: 'config/common.json'
    },
    topics: {
      pubToServer: 'CS-pub',
      subFromServer: 'CS-sub',
    },
  },
  log: {
    level: 'debug',
    colorize: true,
  },
};
