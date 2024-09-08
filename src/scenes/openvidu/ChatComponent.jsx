import React, {useRef, useEffect, useMemo, useState} from 'react';
import {ChatEntry, useChat, useMaybeLayoutContext} from "@livekit/components-react";

export function ChatComponent({
                         messageFormatter,
                         messageDecoder,
                         messageEncoder,
                         channelTopic,
                         ...props
                     }) {
    const [infoData, setInfoData] = useState(null);
    const [currentUser, setCurrentUser] = useState('');

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
                await send(inputRef.current.value);
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
        if (ulRef) {
            ulRef.current?.scrollTo({ top: ulRef.current.scrollHeight });
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
        <div {...props} className="lk-chat" style={{width:'100%',height:'100%'}}>
            <div className="lk-chat-header">
                Messages
            </div>

            <ul className="lk-list lk-chat-messages" ref={ulRef}>
                {props.children
                    ? chatMessages.map((msg, idx) =>
                        (msg)
                    )
                    : chatMessages.map((msg, idx, allMsg) => {
                        const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from;
                        const hideTimestamp = idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;

                        return (
                            <ChatEntry
                                key={msg.id ?? idx}
                                hideName={hideName}
                                hideTimestamp={hideName === false ? false : hideTimestamp}
                                entry={msg}
                                messageFormatter={messageFormatter}
                            />
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
