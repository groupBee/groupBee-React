import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useChat, useMaybeLayoutContext } from "@livekit/components-react";
import './ChatComponent.css';

export function ChatComponent({
                                  messageFormatter,
                                  messageDecoder,
                                  messageEncoder,
                                  channelTopic,
                                  onNewMessage,
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
        if (chatMessages.length > 0 && onNewMessage) {
            const latestMessage = chatMessages[chatMessages.length - 1];
            onNewMessage(latestMessage.timestamp);
        }
    }, [chatMessages, onNewMessage]);

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

    // 타임스탬프를 표시할 조건
    const shouldShowTimestamp = (allMessages, index) => {
        if (index === allMessages.length - 1) {
            return true; // 마지막 메시지는 항상 타임스탬프 표시
        }

        const currentMsg = allMessages[index];
        const nextMsg = allMessages[index + 1];

        // 다음 메시지가 같은 사람이거나 1분 이내에 보내지 않은 경우 타임스탬프 표시
        return (
            JSON.parse(currentMsg.message).author !== JSON.parse(nextMsg.message).author ||
            new Date(currentMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) !==
            new Date(nextMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
    };

    // 이름을 표시할 조건
    const showName = (allMessages, index) => {
        if (index === 0) {
            return true; // 첫 번째 메시지는 항상 이름 표시
        }

        const currentMsg = allMessages[index];
        const prevMsg = allMessages[index - 1];

        // 이전 메시지와 발신자가 다르거나 1분 이상의 차이가 나면 이름 표시
        return (
            JSON.parse(currentMsg.message).author !== JSON.parse(prevMsg.message).author ||
            new Date(currentMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) !==
            new Date(prevMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
    };

    return (
        <div {...props} className="lk-chat" style={{ width: '100%', height: '100%' }}>
            <div className="lk-chat-header">Messages</div>

            <ul className="lk-list lk-chat-messages" ref={ulRef}>
                {chatMessages.map((msg, idx, allMessages) => {
                    let parsedMessage;
                    try {
                        parsedMessage = JSON.parse(msg.message);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                        parsedMessage = { text: msg.message, author: 'Unknown' };
                    }

                    const isCurrentUser = parsedMessage.author === currentUser;

                    return (
                        <li key={msg.id ?? idx} className={`lk-chat-entry ${isCurrentUser ? 'lk-chat-entry-self' : ''}`}>
                            {showName(allMessages, idx) && (
                                <div className="lk-chat-entry-metadata">
                                    <span className="lk-chat-entry-author">{parsedMessage.author}</span>
                                </div>
                            )}
                            <div className="lk-chat-entry-container">
                                <div className="lk-chat-entry-bubble">{parsedMessage.text}</div>
                                {shouldShowTimestamp(allMessages, idx) && (
                                    <div className="lk-chat-entry-timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
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