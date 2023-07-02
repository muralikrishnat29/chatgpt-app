import { openai, unsafeWords } from './config/config.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
    console.log(colors.bold.green('Hello! Hope you are doing great..'));
    console.log(colors.bold.green('You can now start chatting with the bot..'));

    const chatHistory = []; // Store conversation history

    while(true) {
        const userInput = readlineSync.question(colors.yellow('You: '));

        try {
            var searchExp = new RegExp(unsafeWords.join("|"),"gi");
            // regularExpression.test(string) returns true or false
            if(searchExp.test(userInput)) {
                console.log(colors.red("You have an unsafe word in the input. This question will not be sent to gpt server. Don't worry. It will not be stored in the history too."));
            } else {
                const messages = chatHistory.map(([role, content]) => ({ role, content }))

                // Add user input
                messages.push({ role: 'user', content: userInput });
                // API Call for the given input
                const completion = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                });

                // Get completion text content
                const completionText = completion.data.choices[0].message.content;

                if (userInput.toLowerCase() === 'exit') {
                    console.log(colors.green('Bot: ') + completionText);
                    return;
                }

                console.log(colors.green('Bot: ') + completionText);

                //Update history
                chatHistory.push(['user', userInput]);
                chatHistory.push(['assistant', completionText]);
            }
        } catch (error) {
            console.log(colors.red(error));
        }
    }
}

main();