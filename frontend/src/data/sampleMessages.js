/**
 * generateSampleMessages Function
 * -------------------------------
 * Generates an array of sample messages for a given conversation.
 *
 * Exports:
 *   - generateSampleMessages: Returns an array of mock message objects.
 *
 * Parameters:
 *   - conversation: The conversation object containing details like `lastMessage`.
 *
 * Returns:
 *   - An array of message objects, each containing:
 *       - id: Unique identifier for the message.
 *       - content: The text content of the message.
 *       - timestamp: The time the message was sent (ISO string).
 *       - isSentByCurrentUser: Boolean indicating if the message was sent by the current user.
 *
 * Usage:
 *   - Used within the `MessagesList` component to display placeholder messages.
 *   - Can be replaced with real messages when integrating with an API.
 *
 * Example:
 *   - generateSampleMessages(conversation);
 *   - Returns:
 *       [
 *           {
 *               id: 1,
 *               content: "Hi there! How are you doing?",
 *               timestamp: "2023-10-01T12:30:00.000Z",
 *               isSentByCurrentUser: false,
 *           },
 *           ...
 *       ]
 */

const generateSampleMessages = (conversation) => {
    const messages = [];
    const now = Date.now();

    for (let i = 1; i <= 30; i++) {
        messages.push({
            id: i,
            content:
                i % 2 === 0
                    ? `Message ${i} from you.`
                    : `Message ${i} from ${conversation?.name || "User"}.`,
            timestamp: new Date(now - i * 1000 * 60).toISOString(), // Each message is 1 minute apart
            isSentByCurrentUser: i % 2 === 0, // Alternate between current user and other user
        });
    }

    return messages;
};

export default generateSampleMessages;
