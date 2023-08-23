document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem('username');
    if (!username) {
        username = prompt('Please enter your username:');
        if (!username) {
            username = 'Anonymous';
        }
        localStorage.setItem('username', username);
    }

    function handleFormSubmission(event) {
        event.preventDefault();

        const postText = postInput.value;
        const mediaFile = mediaInput.files[0];

        if (postText.trim() !== "" || mediaFile) {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            let content = `
                <div class="user-info">
                    <img src="images/openai.jpg" alt="User Image">
                    <p>${username}</p>
                </div>
            `;

            if (postText.trim() !== "") {
                content += `<p class="post-text">${postText}</p>`;
            }

            if (mediaFile) {
                if (mediaFile.type.includes("image")) {
                    content += `<img class="post-image" src="${URL.createObjectURL(mediaFile)}" style="width: 100%; margin-top: 5px;" alt="Posted Image">`;
                } else if (mediaFile.type.includes("video")) {
                    content += `<video class="post-video" controls>
                                   <source src="${URL.createObjectURL(mediaFile)}" type="video/mp4">
                                 </video>`;
                }
            }

            postElement.innerHTML = content;
            feed.insertBefore(postElement, feed.firstChild);

            postInput.value = "";
            mediaInput.value = null;
        }
    }

    const postForm = document.getElementById("postForm");
    const postInput = document.getElementById("postInput");
    const mediaInput = document.getElementById("mediaInput");
    const feed = document.getElementById("feed");

    postForm.addEventListener("submit", handleFormSubmission);

    const photoIcon = document.querySelector(".photo");
    photoIcon.addEventListener("click", function () {
        mediaInput.click();
    });

    function updateConnectionStrength() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        const wifiButton = document.getElementById("wifi");
        if (!connection) {
            const randomConnectionStrength = Math.floor(Math.random() * 101);
            wifiButton.innerHTML = `<i class="fa-solid fa-wifi"></i> ${
                randomConnectionStrength >= 70 ? "Strong" : randomConnectionStrength >= 30 ? "Moderate" : "Weak"
            } WiFi`;

            const connectionStrengthElement = document.getElementById("connectionStrength");
            connectionStrengthElement.textContent = `Connection Strength: ${randomConnectionStrength}%`;

            return;
        }

        const downlink = connection.downlink;
        const connectionStrength = Math.min(100, Math.floor((downlink / 8) * 100));

        wifiButton.innerHTML = `<i class="fa-solid fa-wifi"></i> ${
            connectionStrength >= 70 ? "Strong" : connectionStrength >= 30 ? "Moderate" : "Weak"
        } WiFi`;

        const connectionStrengthElement = document.getElementById("connectionStrength");
        connectionStrengthElement.textContent = `Connection Strength: ${connectionStrength}%`;
    }

    updateConnectionStrength();
    setInterval(updateConnectionStrength, 10000); // Update every 10 seconds.

    const buttons = document.querySelectorAll(".navbar a");

    buttons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            buttons.forEach(btn => {
                btn.querySelector("i").classList.remove("active");
            });

            button.querySelector("i").classList.add("active");

            const href = button.getAttribute("href");
            if (href) {
                window.location.href = href;
            }
        });
    });
});


// Chatbox
const messagesContainer = document.querySelector('.messages');
const inputField = document.querySelector('.input-area input');
const sendButton = document.querySelector('.input-area button');

function addMessage(message, isSender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (isSender) {
        messageElement.classList.add('message-sender');
        messageElement.innerHTML = `
            <div class="message-text">${message.replace(/\n/g, '<br>')}</div>`;
    } else {
        messageElement.classList.add('message-receiver');
        messageElement.innerHTML = `
            <div class="message-info" style="display: flex; align-items: center; gap: 5px;">
                <img src="images/openai.jpg" style="width: 30px; height: 30px; border-radius: 50%;" alt="Kabe Image">
                <p style="text-transform: uppercase; font-size: 12px;">Kabe Bot</p>
            </div>
            <div class="message-text">${message.replace(/\n/g, '<br>')}</div>`;
    }

    messagesContainer.appendChild(messageElement);
}

function addSampleResponse() {
    const response = `helloWorld("print")`;
    addMessage(response, false);
}

sendButton.addEventListener('click', () => {
    const message = inputField.value.trim();
    
    if (message !== '') {
        addMessage(message, true);
        inputField.value = '';
        
        setTimeout(addSampleResponse, 1000); 
    }
});




