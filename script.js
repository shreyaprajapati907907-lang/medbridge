const askButton = document.getElementById("askButton");
const navAskButton = document.getElementById("navAskButton");
const featureAsk = document.getElementById("featureAsk");
const learnButton = document.getElementById("learnButton");

const questionInput = document.getElementById("questionInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");


// Open the chat input when the main buttons are clicked
function focusChat() {
    questionInput.focus();
    questionInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

askButton.addEventListener("click", focusChat);
navAskButton.addEventListener("click", focusChat);
featureAsk.addEventListener("click", focusChat);

learnButton.addEventListener("click", function () {
    document.getElementById("features").scrollIntoView({
        behavior: "smooth"
    });
});


// Add user's message
function addUserMessage(question) {

    const message = document.createElement("div");

    message.className = "user-chat-message";

    message.innerHTML = `
        <p>${escapeHTML(question)}</p>
    `;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Add AI response
function addAIMessage(answer) {

    const message = document.createElement("div");

    message.className = "ai-response-message";

    message.innerHTML = `
        <div class="chat-avatar">✦</div>

        <div class="message-content">
            <strong>MedBridge AI</strong>
            <p>${escapeHTML(answer).replace(/\n/g, "<br>")}</p>

            <small>
                Educational information only — not a diagnosis.
            </small>
        </div>
    `;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Show typing animation
function showTyping() {

    const typing = document.createElement("div");

    typing.className = "ai-response-message";
    typing.id = "typingMessage";

    typing.innerHTML = `
        <div class="chat-avatar">✦</div>

        <div class="message-content">
            <strong>MedBridge AI</strong>

            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(typing);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Remove typing animation
function removeTyping() {

    const typing = document.getElementById("typingMessage");

    if (typing) {
        typing.remove();
    }
}


// Send question to backend
async function sendQuestion() {

    const question = questionInput.value.trim();

    if (!question) {
        questionInput.focus();
        return;
    }

    addUserMessage(question);

    questionInput.value = "";

    sendButton.disabled = true;
    questionInput.disabled = true;

    showTyping();

    try {

        const response = await fetch("/api/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        removeTyping();

        addAIMessage(data.answer);

    } catch (error) {

        console.error(error);

        removeTyping();

        addAIMessage(
            "Sorry, I couldn't process your question right now. Please try again."
        );

    } finally {

        sendButton.disabled = false;
        questionInput.disabled = false;

        questionInput.focus();
    }
}


// Send when button is clicked
sendButton.addEventListener("click", sendQuestion);


// Send when Enter is pressed
questionInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        sendQuestion();
    }

});


// Prevent HTML injection in displayed messages
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}
