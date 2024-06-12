// rabbitmq.js
const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = 'amqps://oivdhjnl:ie48w2fZFEvqWq-mIY7sb1jFbo8YiMgE@puffin.rmq2.cloudamqp.com/oivdhjnl';

let channel = null;

amqp.connect(RABBITMQ_URL, (err, connection) => {
  if (err) {
    throw err;
  }
  connection.createChannel((err, ch) => {
    if (err) {
      throw err;
    }
    channel = ch;
    console.log('Connected to RabbitMQ');
  });
});

const publishToQueue = (queueName, message) => {
  channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
};

module.exports = {
  publishToQueue,
};
