document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    fetch("http://localhost/booknew-main/backend/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data);  // Debugging log
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            alert("Success: " + data.success);
            window.location.href = "login.html";
        }
    })
    .catch(error => console.error("Error:", error));
});
