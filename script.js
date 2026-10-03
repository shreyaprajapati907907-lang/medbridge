const askButton = document.getElementById("askButton");

askButton.addEventListener("click", async function () {
    const question = prompt("What would you like to ask MedBridge?");

    if (!question) {
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Thinking...";

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

        alert(data.answer);

    } catch (error) {
        console.error(error);
        alert("Sorry, MedBridge could not answer right now.");
    }

    askButton.disabled = false;
    askButton.textContent = "Ask MedBridge";
});
