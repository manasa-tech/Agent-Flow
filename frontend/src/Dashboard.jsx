
const sendMessage = async () => {
    const userText = inputRef.current?.value?.trim();

    if (!userText || loading) return;

    // Clear the input field
    inputRef.current.value = "";

    // Add the user's message to the chat
    const updatedMessages = [
        ...messages,
        {
            role: "user",
            content: userText,
        },
    ];

    setMessages(updatedMessages);
    setLoading(true);
    setError("");

    try {
        // Connect to the FastAPI backend
        const response = await fetch(
            "http://127.0.0.1:8000/api/test-generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: userText,
                    message: userText,
                    model: model || "qwen3:latest",
                }),
            }
        );

        // Convert the response into JSON
        const data = await response.json();

        // Handle backend errors
        if (!response.ok) {
            throw new Error(
                data.detail || "AI request failed"
            );
        }

        // Extract the AI-generated answer
        const answer = data.response;

        // Add the AI response to the chat
        const finalMessages = [
            ...updatedMessages,
            {
                role: "assistant",
                content: answer,
            },
        ];

        setMessages(finalMessages);

        // Update recent chats, if supported
        if (typeof setRecentChats === "function") {
            setRecentChats((previous) =>
                previous.map((chat) =>
                    chat.id === chatId
                        ? {
                              ...chat,
                              messages: finalMessages,
                          }
                        : chat
                )
            );
        }
    } catch (err) {
        console.error("AI request failed:", err);

        setError(
            `Couldn't connect to the AI backend: ${err.message}`
        );
    } finally {
        setLoading(false);
        inputRef.current?.focus();
    }
};