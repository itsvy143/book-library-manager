
// Get the HTML elements
const bookForm = document.getElementById("book-form");
const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const bookStatus = document.getElementById("book-status");
const bookList = document.getElementById("book-list");
const bookCount = document.getElementById("book-count");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");

// Load saved books from Local Storage
let books = JSON.parse(localStorage.getItem("books")) || [];

// Save books to Local Storage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Display books based on search and filter
function displayBooks() {
    bookList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    // Search and filter books
    const filteredBooks = books.filter(function (book) {
        const matchesSearch =
            book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "all" || book.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Display a message if no books match
    if (filteredBooks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";

        if (books.length === 0) {
            message.textContent = "Your library is empty. Add your first book!";
        } else {
            message.textContent = "No matching books found.";
        }

        bookList.appendChild(message);
        bookCount.textContent = "Showing 0 of " + books.length + " books";
        return;
    }

    // Display each matching book
    filteredBooks.forEach(function (book) {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = `Author: ${book.author}`;

        const status = document.createElement("p");
        status.className = "book-status";
        status.textContent = book.status;

        const actions = document.createElement("div");
        actions.className = "book-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.dataset.id = book.id;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.dataset.id = book.id;

        actions.append(editButton, deleteButton);
        bookCard.append(title, author, status, actions);

        bookList.appendChild(bookCard);
    });

    bookCount.textContent =
        "Showing " + filteredBooks.length + " of " + books.length + " books";
}

// Add a new book
bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newBook = {
        id: Date.now(),
        title: bookTitle.value.trim(),
        author: bookAuthor.value.trim(),
        status: bookStatus.value
    };

    books.push(newBook);

    saveBooks();
    displayBooks();
    bookForm.reset();
});

// Handle Edit and Delete buttons
bookList.addEventListener("click", function (event) {
    const bookId = Number(event.target.dataset.id);

    if (event.target.classList.contains("edit-button")) {
        editBook(bookId);
    }

    if (event.target.classList.contains("delete-button")) {
        deleteBook(bookId);
    }
});

// Edit a book
function editBook(bookId) {
    const book = books.find(function (item) {
        return item.id === bookId;
    });

    if (!book) {
        return;
    }

    const newTitle = prompt("Enter the new book title:", book.title);

    if (newTitle === null || newTitle.trim() === "") {
        return;
    }

    const newAuthor = prompt("Enter the new author:", book.author);

    if (newAuthor === null || newAuthor.trim() === "") {
        return;
    }

    const newStatus = prompt(
        "Enter status: Want to Read, Currently Reading, or Finished",
        book.status
    );

    const validStatuses = [
        "Want to Read",
        "Currently Reading",
        "Finished"
    ];

    if (newStatus === null || !validStatuses.includes(newStatus.trim())) {
        alert("Invalid reading status. Please try again.");
        return;
    }

    book.title = newTitle.trim();
    book.author = newAuthor.trim();
    book.status = newStatus.trim();

    saveBooks();
    displayBooks();
}

// Delete a book
function deleteBook(bookId) {
    const confirmed = confirm("Are you sure you want to delete this book?");

    if (!confirmed) {
        return;
    }

    books = books.filter(function (book) {
        return book.id !== bookId;
    });

    saveBooks();
    displayBooks();
}

// Search books while typing
searchInput.addEventListener("input", displayBooks);

// Filter books when status changes
statusFilter.addEventListener("change", displayBooks);

// Display saved books when the page loads
displayBooks();
