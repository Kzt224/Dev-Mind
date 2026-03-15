import { create } from "zustand";
import { createMessage } from "@/assets/db/messages.model.js";
import { createChats } from "@/assets/db/chatHeader.model.js";
import { deleteMessagesById } from "@/assets/db/messages.model.js";
import { deleteChatsById } from "@/assets/db/chatHeader.model.js";


export const useChatStore = create((set, get) => ({
    messages: [],
    chatTitle: "",
    chatHeader: '',

    deleteHistory: async (chatId) => {
        if (!chatId) return;
        try {
            await deleteMessagesById(chatId);
            await deleteChatsById(chatId);
            if (get().chatHeader === chatId) {
                set({ chatHeader: '' });
            }
            return true;
        } catch (err) {
            console.log('Error deleting history:', err);
            return false;
        }
    },

    sentMessage: async (newMessage, type, headerIdFromComponent, ownerUserIdFromComponent) => {
        try {
            const messagesArray = Array.isArray(newMessage) ? newMessage : [newMessage];
            if (!messagesArray.length) return;

            // detect if message items are objects (from GiftedChat) or plain strings (AI)
            const first = messagesArray[0];
            const isObjectMessage = typeof first === 'object' && first !== null;

            // owner id for chat header should be the actual user id (not 'ai') when creating a new header
            const ownerUserId = ownerUserIdFromComponent
                ? String(ownerUserIdFromComponent)
                : (isObjectMessage && first.user && first.user._id
                    ? String(first.user._id)
                    : String(get().chatHeader || '0'));

            // normalize sender id for message rows
            const initialSenderId = type === 'ai' ? 'ai' : (isObjectMessage && first.user && first.user._id ? String(first.user._id) : ownerUserId);

            let headerId = headerIdFromComponent || get().chatHeader;

            if (!headerId) {
                const newHeader = await createChats({
                    title: "Chat " + Date.now(),
                    project_id: null,
                    user_id: ownerUserId
                });

                if (!newHeader?.id) {
                    console.log("Failed to create chat header");
                    return;
                }

                set({ chatHeader: newHeader.id });
                headerId = newHeader.id;
            }

            for (const msg of messagesArray) {
                // if msg is object (GiftedChat message), pass the object so createMessage can extract .text
                // if msg is string (AI response), pass the string directly
                const payload = (typeof msg === 'object' && msg !== null) ? msg : String(msg);
                const isMessageObject = typeof msg === 'object' && msg !== null;
                const messageSenderId = type === 'ai'
                    ? 'ai'
                    : (isMessageObject && msg.user && msg.user._id ? String(msg.user._id) : ownerUserId);
                await createMessage(payload, messageSenderId, type, headerId);
            }

            return headerId; // optional: useful if caller needs it
        } catch (err) {
            console.log("Error in sentMessage:", err);
        }
    },
}));
