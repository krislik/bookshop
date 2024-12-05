document.addEventListener("DOMContentLoaded", function() {
  loadCartItems();
  calculateCartSummary();
});

function loadCartItems() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
      alert("You must be logged in to view your cart.");
      window.location.href = "login.html";
      return;
  }

  const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  if (userCart.length === 0) {
      cartItemsContainer.innerHTML = "<tr><td colspan='6' class='text-center'>Your cart is empty.</td></tr>";
      return;
  }

  userCart.forEach((item, index) => {
      const price = item.price || 0; 
      const quantity = item.quantity || 1;
      const total = price * quantity;

      const cartRow = document.createElement("tr");
      cartRow.innerHTML = `
          <td><img src="${item.imageUrl}" alt="${item.title}" class="img-fluid" style="width: 50px; height: auto;"></td>
          <td>${item.title}</td>
          <td>$${price.toFixed(2)}</td>
          <td>
              <input type="number" class="form-control" value="${quantity}" min="1" id="quantity-${index}" onchange="updateQuantity(${index})">
          </td>
          <td id="total-${index}">$${total.toFixed(2)}</td>
          <td><button class="btn btn-danger" onclick="removeItem(${index})">Remove</button></td>
      `;
      cartItemsContainer.appendChild(cartRow);
  });
}

function calculateCartSummary() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];

  let subtotal = userCart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById("cart-subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("cart-tax").textContent = `$${tax.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(index) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
  const quantity = parseInt(document.getElementById(`quantity-${index}`).value) || 1;

  // Ensure that price and quantity are valid
  const price = userCart[index].price || 0;
  userCart[index].quantity = quantity;
  localStorage.setItem(`${loggedInUser.username}_cart`, JSON.stringify(userCart));

  const totalCell = document.getElementById(`total-${index}`);
  totalCell.textContent = `$${(price * quantity).toFixed(2)}`;

  calculateCartSummary();
  updateCartButton();
}


function removeItem(index) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];

  userCart.splice(index, 1);
  localStorage.setItem(`${loggedInUser.username}_cart`, JSON.stringify(userCart));

  loadCartItems();
  calculateCartSummary();
  updateCartButton();
}

function updateCartButton() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
      const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
      const cartCount = userCart.reduce((total, item) => total + item.quantity, 0);
      document.getElementById("cart-btn").textContent = `Cart (${cartCount})`;
  }
}

function openCheckoutModal() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
      alert("Please log in to complete your purchase.");
      return;
  }

  const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
  if (userCart.length === 0) {
      alert("Your cart is empty. Add some items before checking out.");
      return;
  }

  // Open the modal
  const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  checkoutModal.show();
}

function submitOrder() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const customerName = document.getElementById("customer-name").value;
  const customerAddress = document.getElementById("customer-address").value;
  const paymentMethod = document.getElementById("payment-method").value;

  if (!customerName || !customerAddress || paymentMethod !== "Cash") {
      alert("Please complete the form and select cash payment.");
      return;
  }

  const userCart = JSON.parse(localStorage.getItem(`${loggedInUser.username}_cart`)) || [];
  const total = userCart.reduce((total, item) => total + item.price * item.quantity, 0);

  const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: {
          name: customerName,
          address: customerAddress
      },
      items: userCart,
      total: total,
      paymentMethod: paymentMethod
  };

  let orders = JSON.parse(localStorage.getItem(`${loggedInUser.username}_orders`)) || [];
  orders.push(order);
  localStorage.setItem(`${loggedInUser.username}_orders`, JSON.stringify(orders));

  // Clear the cart
  localStorage.setItem(`${loggedInUser.username}_cart`, JSON.stringify([]));

  alert("Thank you for your purchase! Your order has been placed.");
  window.location.href = "index.html";
}

document.getElementById("checkout-btn").addEventListener("click", openCheckoutModal);
document.getElementById("submit-order-btn").addEventListener("click", submitOrder);
