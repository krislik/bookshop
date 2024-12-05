document.getElementById("register-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some(user => user.username === username)) {
        alert("Username already exists! Please choose a different username.");
    } else {
        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
    }
});