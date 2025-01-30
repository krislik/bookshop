document.addEventListener("DOMContentLoaded", function () {
  loadBooks(); 
  updateCartButton();
});

function loadBooks(genre = "") {
  fetch("http://localhost/booknew-main/backend/books.php")  // Change this path if needed
      .then(response => response.json())
      .then(books => {
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
                      <img src="${book.image_url}" class="card-img-top" alt="${book.title}">
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
      })
      .catch(error => console.error("Error fetching books:", error));
}

function filterBooksByGenre() {
  const genre = document.getElementById("genre-filter").value;
  loadBooks(genre);
}
