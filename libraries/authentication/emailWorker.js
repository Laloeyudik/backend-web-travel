const amqp = require('amqplib');
const nodemailer = require('nodemailer');

async function processQueue() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'emailQueue';
  await channel.assertQueue(queue, { durable: true });
  
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { batch, judul, message } = JSON.parse(msg.content.toString());

      const transportMailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const sendEmailPromises = batch.map((email) => {
        return transportMailer.sendMail({
          from: process.env.EMAIL_SENDER,
          subject: judul,
          to: email,
          html: `<div class="flex flex-col gap-2"><h1>${judul}</h1><p>${message}</p></div>`,
        });
      });

      try {
        await Promise.all(sendEmailPromises);
        console.log(`Berhasil mengirim batch dari ${batch.length} email.`);
        channel.ack(msg);
      } catch (err) {
        console.error(`Gagal mengirim batch dari ${batch.length} email:`, err);
        channel.nack(msg, false, true); // Requeue pesan
      }
    }
  }, { noAck: false });
}

processQueue().catch(console.error);
