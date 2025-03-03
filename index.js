const amqp = require("amqplib");
const { fork } = require("child_process");

// Start the consumer as a child process
const worker = fork("./child.js");

async function sendMessage() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "test_queue";

    await channel.assertQueue(queue, { durable: true });

    for (let i = 1; i <= 5; i++) {
      const message = `Message ${i}`;
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
      console.log(`✅ Sent: ${message}`);
    }

    setTimeout(() => {
      connection.close();
      console.log("🔴 Producer closed connection");
    }, 1000);
  } catch (error) {
    console.error("❌ Error in producer:", error);
  }
}

sendMessage();
