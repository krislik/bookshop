document.addEventListener("DOMContentLoaded", function() {
    loadUserName();
    updateCartButton();
    loadBooks();
    checkLoginStatus();
});

function loadUserName() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        if (loggedInUser && loggedInUser.email) {
           
            const username = loggedInUser.email.split('@')[0];
            document.getElementById("user-name").textContent = `Welcome, ${username}`;
        } else {
            document.getElementById("user-name").textContent = `Welcome, Guest`;
        }
        document.getElementById("user-name-item").style.display = "block";
        document.getElementById("login-link").style.display = "none";
        document.getElementById("register-link").style.display = "none";
        document.getElementById("account-details-link").style.display = "block";  
        document.getElementById("order-history-link").style.display = "block"; 
        document.getElementById("logout-item").style.display = "block";  
    }
}

function updateCartButton() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
        document.getElementById("cart-btn").textContent = `Cart (${userCart.length})`;
    }
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const bookListContainer = document.getElementById("book-list");
    bookListContainer.innerHTML = '';
    books.forEach((book, index) => {
        const bookCard = document.createElement("div");
        bookCard.classList.add("col-md-4");
        bookCard.innerHTML = `
            <div class="card mb-4">
                <img src="${book.imageUrl}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">${book.author}</p>
                    <p class="card-text">$${book.price.toFixed(2)}</p>
                    <button class="btn btn-primary" onclick="addToCart(${index})">Add to Cart</button>
                </div>
            </div>
        `;
        bookListContainer.appendChild(bookCard);
    });
}

function addToCart(index) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("You must be logged in to add items to the cart!");
        window.location.href = "login.html";
        return;
    }

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const bookToAdd = { ...books[index], quantity: 1 };

    let userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
    const existingBookIndex = userCart.findIndex(item => item.id === bookToAdd.id);

    if (existingBookIndex !== -1) {
        userCart[existingBookIndex].quantity += 1;
    } else {
        userCart.push(bookToAdd);
    }

    localStorage.setItem(`${loggedInUser.username}_cart`, JSON.stringify(userCart));
    updateCartButton();
    alert(`${bookToAdd.title} has been added to your cart.`);
}

function openCart() {
    window.location.href = "cart.html";
}

function showAccountDetails() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Please log in to view your account details.");
        return;
    }

    
    let email = loggedInUser.email || 'Not provided';
    const validEmail = email.split('@').slice(0, 2).join('@'); 
    const username = validEmail.includes('@') ? validEmail.split('@')[0] : 'Unknown';

    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
        <h2 class="text-center mb-4">Account Details</h2>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Username: ${username}</h5>
                <p class="card-text">Email: ${validEmail}</p>
                <p class="card-text">Member since: ${loggedInUser.memberSince || 'Unknown'}</p>
            </div>
        </div>
    `;
}


function showOrderHistory() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Please log in to view your order history.");
        return;
    }

    const orders = JSON.parse(localStorage.getItem(`${loggedInUser.username}_orders`)) || [];

    const mainContent = document.querySelector("main");
    mainContent.innerHTML = `
        <h2 class="text-center mb-4">Order History</h2>
        ${orders.length === 0 ? '<p class="text-center text-muted">You have no previous orders.</p>' : ''}
        <div class="accordion" id="orderHistoryAccordion">
            ${orders.map((order, index) => {
                const orderTotal = order.total || 0; 
                const paymentMethod = order.paymentMethod ? order.paymentMethod : 'Not provided'; 
                return `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${index}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="${index === 0}" aria-controls="collapse-${index}">
                            Order #${order.id} - ${new Date(order.date).toLocaleDateString()} - $${orderTotal.toFixed(2)}
                        </button>
                    </h2>
                    <div id="collapse-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading-${index}" data-bs-parent="#orderHistoryAccordion">
                        <div class="accordion-body">
                            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                            <p><strong>Total:</strong> $${orderTotal.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> ${paymentMethod}</p> <!-- Updated here -->
                            <h6>Items:</h6>
                            <ul>
                                ${(order.items || []).map(item => `
                                    <li>${item.title || 'Unknown'} (x${item.quantity || 1}) - $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            }).join('')}
        </div>
    `;
}


function checkLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const userNameItem = document.getElementById("user-name-item");
    const logoutItem = document.getElementById("logout-item");
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");

    if (loggedInUser) {
        if (userNameItem) {
            userNameItem.style.display = "block";
            document.getElementById("user-name").textContent = `Welcome, ${loggedInUser.username}`;
        }
        if (logoutItem) logoutItem.style.display = "block";
        if (loginLink) loginLink.style.display = "none";
        if (registerLink) registerLink.style.display = "none";
    } else {
        if (userNameItem) userNameItem.style.display = "none";
        if (logoutItem) logoutItem.style.display = "none";
        if (loginLink) loginLink.style.display = "block";
        if (registerLink) registerLink.style.display = "block";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    window.location.href = "index.html";
}

document.getElementById("logout-btn")?.addEventListener("click", logout);

document.querySelector('.navbar-toggler')?.addEventListener('click', function() {
    document.getElementById('sidebar-wrapper').classList.toggle('show');
});

