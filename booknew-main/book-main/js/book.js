const books = [
  { id: 1, title: "Beautiful", author: "Danielle Steel", genre: "romance", price: 10, imageUrl: "./images/book1.jpeg" },
  { id: 2, title: "Triangle", author: "Danielle Steel", genre: "non-fiction", price: 15, imageUrl: "./images/book2.jpeg" },
  { id: 3, title: "Complications", author: "Danielle Steel", genre: "mystery", price: 20, imageUrl: "./images/book3.jpeg" },
  { id: 4, title: "Vanished Birds", author: "Simon Jimenez", genre: "fiction", price: 12, imageUrl: "./images/book7.jpg" },
  { id: 5, title: "Otello", author: "Shakespeare", genre: "fantasy", price: 18, imageUrl: "./images/book5.jpg" },
  { id: 6, title: "Hamlet", author: "Shakespeare", genre: "romance", price: 18, imageUrl: "./images/book4.jpg" }

];

function loadBooks(genre = "") {
  const bookList = document.getElementById("book-list");
  if (!bookList) {
    console.error("Element with ID 'book-list' not found.");
    return;
  }

  bookList.innerHTML = "";  

  const filteredBooks = genre ? books.filter(book => book.genre === genre) : books;

  filteredBooks.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("col-md-4");
    bookCard.innerHTML = `
      <div class="card mb-4 book-card">
          <img src="${book.imageUrl}" class="card-img-top" alt="${book.title}">
          <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text">by ${book.author}</p>
              <p class="card-text">$${(book.price || 0).toFixed(2)}</p>
              <button class="btn btn-success" onclick="addToCart(${book.id})">Add to Cart</button>
          </div>
      </div>
    `;
    bookList.appendChild(bookCard);
  });
}

function filterBooksByGenre() {
  const genre = document.getElementById("genre-filter").value;
  loadBooks(genre);
}

document.addEventListener("DOMContentLoaded", function () {
  loadBooks(); 
  updateCartButton();
});