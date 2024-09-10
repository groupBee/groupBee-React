import React, { useRef, useEffect, useMemo, useState } from 'react';
import { ChatEntry, useChat, useMaybeLayoutContext } from "@livekit/components-react";
import './Chat.css';

export function ChatComponent({
                                  messageFormatter,
                                  messageDecoder,
                                  messageEncoder,
                                  channelTopic,
                                  ...props
                              }) {
    const [infoData, setInfoData] = useState(null);
    const [currentUser, setCurrentUser] = useState('');
    const [displayName, setDisplayName] = useState('');

    const inputRef = useRef(null);
    const ulRef = useRef(null);

    const chatOptions = useMemo(() => {
        return { messageDecoder, messageEncoder, channelTopic };
    }, [messageDecoder, messageEncoder, channelTopic]);

    const { send, chatMessages, isSending } = useChat(chatOptions);

    const layoutContext = useMaybeLayoutContext();
    const lastReadMsgAt = useRef(0);

    async function handleSubmit(event) {
        event.preventDefault();
        if (inputRef.current && inputRef.current.value.trim() !== '') {
            if (send) {
                await send(JSON.stringify({ text: inputRef.current.value, author: currentUser }));
                inputRef.current.value = '';
                inputRef.current.focus();
            }
        }
    }

    const fetchData = async () => {
        try {
            const response = await fetch('/api/employee/info');
            const data = await response.json();
            setInfoData(data);
            setCurrentUser(data.name);
            console.log(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (ulRef.current) {
            ulRef.current.scrollTo({ top: ulRef.current.scrollHeight });
        }
    }, [ulRef, chatMessages]);

    useEffect(() => {
        if (!layoutContext || chatMessages.length === 0) {
            return;
        }

        if (
            layoutContext.widget.state?.showChat &&
            chatMessages.length > 0 &&
            lastReadMsgAt.current !== chatMessages[chatMessages.length - 1]?.timestamp
        ) {
            lastReadMsgAt.current = chatMessages[chatMessages.length - 1]?.timestamp;
            return;
        }

        const unreadMessageCount = chatMessages.filter(
            (msg) => !lastReadMsgAt.current || msg.timestamp > lastReadMsgAt.current,
        ).length;

        const { widget } = layoutContext;
        if (unreadMessageCount > 0 && widget.state?.unreadMessages !== unreadMessageCount) {
            widget.dispatch?.({ msg: 'unread_msg', count: unreadMessageCount });
        }
    }, [chatMessages, layoutContext?.widget]);

    return (
        <div {...props} className="lk-chat" style={{width:'100%', height:'100%'}}>
            <div className="lk-chat-header">
                Messages
            </div>

            <ul className="lk-list lk-chat-messages" ref={ulRef}>
                {chatMessages.map((msg, idx, allMsg) => {
                    let parsedMessage;
                    try {
                        parsedMessage = JSON.parse(msg.message);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                        parsedMessage = { text: msg.message, author: 'Unknown' };
                    }

                    const isCurrentUser = parsedMessage.author === currentUser;
                    const hideTimestamp = idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;

                    return (
                        <li key={msg.id ?? idx} className={`lk-chat-entry ${isCurrentUser ? 'lk-chat-entry-self' : ''}`}>
                            <div className="lk-chat-entry-metadata">
                                <span className="lk-chat-entry-author">{parsedMessage.author}</span>
                                {!hideTimestamp && (
                                    <span className="lk-chat-entry-timestamp">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                                )}
                            </div>
                            <div className="lk-chat-entry-bubble">
                                {parsedMessage.text}
                            </div>
                        </li>
                    );
                })}
            </ul>
            <form className="lk-chat-form" onSubmit={handleSubmit}>
                <input
                    className="lk-form-control lk-chat-form-input"
                    disabled={isSending}
                    ref={inputRef}
                    type="text"
                    placeholder="Enter a message..."
                    onInput={(ev) => ev.stopPropagation()}
                    onKeyDown={(ev) => ev.stopPropagation()}
                    onKeyUp={(ev) => ev.stopPropagation()}
                />
                <button type="submit" className="lk-button lk-chat-form-button" disabled={isSending}>
                    Send
                </button>
            </form>
        </div>
    );
}