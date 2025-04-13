// script.js
let books = JSON.parse(localStorage.getItem('books')) || [];

document.getElementById('searchInput').addEventListener('input', renderBooks);
document.getElementById('bookForm').addEventListener('submit', saveBook);

function openAddModal() {
  document.getElementById('bookForm').reset();
  document.getElementById('bookId').value = '';
  document.querySelector('.modal-title').innerText = 'Add Book';
}

function saveBook(e) {
  e.preventDefault();
  const id = document.getElementById('bookId').value || crypto.randomUUID();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const genre = document.getElementById('genre').value.trim();
  const status = document.getElementById('status').value;
  const imageInput = document.getElementById('image');

  if (!imageInput.files.length && !document.getElementById('bookId').value) return alert("Please upload a book image.");

  const reader = new FileReader();
  reader.onloadend = function () {
    const image = imageInput.files.length ? reader.result : books.find(b => b.id === id)?.image;
    const newBook = { id, title, author, genre, status, favorite: false, image };

    const index = books.findIndex(book => book.id === id);
    if (index > -1) books[index] = newBook;
    else books.push(newBook);

    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
    bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide();
  }

  if (imageInput.files.length) reader.readAsDataURL(imageInput.files[0]);
  else reader.onloadend();
}

function renderBooks() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const filtered = books.filter(book => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search));

  const sections = {
    all: filtered,
    favorites: filtered.filter(book => book.favorite),
    unread: filtered.filter(book => book.status === 'Unread'),
    read: filtered.filter(book => book.status === 'Read'),
  };

  Object.entries(sections).forEach(([key, list]) => {
    const container = document.getElementById(key);
    container.innerHTML = '<div class="row">' + list.map(book => `
      <div class="col-md-3 mb-3">
        <div class="card book-card">
          <img src="${book.image}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">${book.author}<br>${book.genre}</p>
            <button class="btn btn-sm btn-primary" onclick="editBook('${book.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
            <button class="btn btn-sm btn-outline-info favorite-icon" onclick="toggleFavorite('${book.id}')">
              ${book.favorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        </div>
      </div>`).join('') + '</div>';
  });
}

function editBook(id) {
  const book = books.find(b => b.id === id);
  document.getElementById('bookId').value = book.id;
  document.getElementById('title').value = book.title;
  document.getElementById('author').value = book.author;
  document.getElementById('genre').value = book.genre;
  document.getElementById('status').value = book.status;
  document.getElementById('image').required = false;
  document.querySelector('.modal-title').innerText = 'Edit Book';
  new bootstrap.Modal(document.getElementById('bookModal')).show();
}

function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book?')) {
    books = books.filter(book => book.id !== id);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
  }
}

function toggleFavorite(id) {
  const book = books.find(b => b.id === id);
  book.favorite = !book.favorite;
  localStorage.setItem('books', JSON.stringify(books));
  renderBooks();
}

renderBooks();
