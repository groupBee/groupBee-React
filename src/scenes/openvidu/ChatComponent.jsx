import * as React from "react"

import {ChatEntry, useChat, useMaybeLayoutContext} from "@livekit/components-react";

export function ChatComponent({...props}) {
    const inputRef = React.useRef(null)
    const ulRef = React.useRef(null)


    const { send, chatMessages, isSending } = useChat();

    const layoutContext = useMaybeLayoutContext()
    const lastReadMsgAt = React.useRef(0)

    async function handleSubmit(event) {
        event.preventDefault()
        if (inputRef.current && inputRef.current.value.trim() !== "") {
            if (send) {
                await send(inputRef.current.value)
                inputRef.current.value = ""
                inputRef.current.focus()
            }
        }
    }

    React.useEffect(() => {
        if (ulRef) {
            ulRef.current?.scrollTo({ top: ulRef.current.scrollHeight })
        }
    }, [ulRef, chatMessages])

    React.useEffect(() => {
        if (!layoutContext || chatMessages.length === 0) {
            return
        }

        if (
            layoutContext.widget.state?.showChat &&
            chatMessages.length > 0 &&
            lastReadMsgAt.current !== chatMessages[chatMessages.length - 1]?.timestamp
        ) {
            lastReadMsgAt.current = chatMessages[chatMessages.length - 1]?.timestamp
            return
        }

        const unreadMessageCount = chatMessages.filter(
            msg => !lastReadMsgAt.current || msg.timestamp > lastReadMsgAt.current
        ).length

        const { widget } = layoutContext
        if (
            unreadMessageCount > 0 &&
            widget.state?.unreadMessages !== unreadMessageCount
        ) {
            widget.dispatch?.({ msg: "unread_msg", count: unreadMessageCount })
        }
    }, [chatMessages, layoutContext?.widget])

    return (
        <div {...props} className="lk-chat" style={{width:"100%",height:"37vh",position:"static"}}>
            <div className="lk-chat-header">
                채팅방
            </div>

            <ul className="lk-list lk-chat-messages" ref={ulRef} style={{scroll}}>
                {/* eslint-disable-next-line react/prop-types */}
                {props.children
                    ? chatMessages.map((msg, idx) =>
                        // eslint-disable-next-line react/prop-types
                        (msg)
                    )
                    : chatMessages.map((msg, idx, allMsg) => {
                        const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from
                        // If the time delta between two messages is bigger than 60s show timestamp.
                        const hideTimestamp =
                            idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000

                        return (
                            <ChatEntry
                                key={msg.id ?? idx}
                                hideName={hideName}
                                // If we show the name always show the timestamp as well.
                                hideTimestamp={hideName === false ? false : hideTimestamp}
                                entry={msg}
                            />
                        )
                    })}
            </ul>
            <form className="lk-chat-form" onSubmit={handleSubmit}>
                <input
                    className="lk-form-control lk-chat-form-input"
                    disabled={isSending}
                    ref={inputRef}
                    type="text"
                    placeholder="Enter a message..."
                    onInput={ev => ev.stopPropagation()}
                    onKeyDown={ev => ev.stopPropagation()}
                    onKeyUp={ev => ev.stopPropagation()}
                />
                <button
                    type="submit"
                    className="lk-button lk-chat-form-button"
                    disabled={isSending}
                >
                    전송
                </button>
            </form>
        </div>
    )
}