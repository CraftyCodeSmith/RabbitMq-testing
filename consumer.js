const amqp = require("amqplib");

async function consumeMessage() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "test_queue";

    await channel.assertQueue(queue, { durable: true });
    console.log("📥 Waiting for messages...");

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`🔵 Received: ${msg.content.toString()}`);
        channel.ack(msg); // Acknowledge message
      }
    });
  } catch (error) {
    console.error("❌ Error in consumer:", error);
  }
}

consumeMessage();
