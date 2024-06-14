const amqp = require('amqplib');

async function sendToQueue(queueName, data) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), { persistent: true });
  console.log("Pesan dikirim ke antrean:", queueName);
}

module.exports = { sendToQueue };
