import { Ollama } from "ollama";
import readline from "readline";

const ollama = new Ollama();

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Conversation history (to keep context)
const messages = [];

async function askQuestion() {
  rl.question("You: ", async (userInput) => {
    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    // Add user input to messages
    messages.push({ role: "user", content: userInput });

    // Get AI response (streaming)
    const response = await ollama.chat({
      model: "gpt-oss:120b-cloud",
      messages,
      stream: true,
    });

    let fullResponse = "";

    for await (const part of response) {
      process.stdout.write(part.message.content);
      fullResponse += part.message.content;
    }

    console.log("\n");

    // Add assistant's reply to history
    messages.push({ role: "assistant", content: fullResponse });

    // Ask again
    askQuestion();
  });
}

// Start conversation
console.log("Chat started (type 'exit' to quit)");
askQuestion();
