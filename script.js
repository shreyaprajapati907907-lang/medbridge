const askButton = document.getElementById("askButton");
const navAskButton = document.getElementById("navAskButton");
const featureAsk = document.getElementById("featureAsk");
const learnButton = document.getElementById("learnButton");

function askMedBridge() {
    const question = prompt("What would you like to ask MedBridge?");

    if (!question) {
        return;
    }

    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    fetch("/api/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: question
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            alert(data.answer);
        })
        .catch(error => {
            console.error(error);
            alert("Sorry, MedBridge could not answer right now.");
        })
        .finally(() => {
            askButton.disabled = false;
            askButton.textContent = "Ask MedBridge";
        });
}

askButton.addEventListener("click", askMedBridge);

navAskButton.addEventListener("click", askMedBridge);

featureAsk.addEventListener("click", askMedBridge);

learnButton.addEventListener("click", function () {
    document.getElementById("features").scrollIntoView({
        behavior: "smooth"
    });
});
