// Dom Elements
const modalShow = document.querySelector('.add-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const form = document.querySelector('#form');
const books = document.querySelector('.books');
const modal = document.querySelector('.modal');

let myLibrary = [];

function Book(title, author, pages, isRead, id) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.isRead = isRead;
	this.id = id;
}

Book.prototype.toggleReadStatus = function (id) {
	if (this.id === id) this.isRead = !this.isRead;
};

// Remove spaces and checking for isn't empty string '';
const validForm = () => {
	const allInputs = form.querySelectorAll('input');

	return Array.from(allInputs).every((input) => {
		const trimmedValue = input.value.replace(/\s{2,}/g, ' ').trim();
		input.value = trimmedValue;
		if (!trimmedValue) {
			input.setCustomValidity(
				'This field cannot be empty or contain only spaces!',
			);
			input.reportValidity();
			return false;
		}
		input.setCustomValidity('');
		return true;
	});
};

const displayBooks = () => {
	books.textContent = '';

	myLibrary.forEach((book) => {
		// Create elements for describe a book
		const bookCard = document.createElement('div');
		bookCard.classList.add('book-card');

		const title = document.createElement('h3');
		title.classList.add('title_book');
		const author = document.createElement('p');
		const pages = document.createElement('span');
		const toggleRead = document.createElement('button');
		const removeBtn = document.createElement('button');
		title.textContent = `${book.title}`;
		author.textContent = `Written by ${book.author}`;
		pages.textContent = `${book.pages} pages`;
		toggleRead.textContent = `Already read: ${book.isRead ? 'Yes' : 'Not Yet'}`;
		removeBtn.textContent = `Remove`;
		removeBtn.addEventListener('click', () => removeBook(book.id));
		toggleRead.addEventListener('click', () => {
			book.toggleReadStatus(book.id);
			displayBooks();
		});

		bookCard.append(title, author, pages, toggleRead, removeBtn);
		books.appendChild(bookCard);
	});
};

const removeBook = (id) => {
	myLibrary = myLibrary.filter((book) => book.id !== id);
	displayBooks();
};

// Add book to the Library from data user
const addBookToLibrary = (e) => {
	e.preventDefault();

	if (!validForm()) {
		return;
	}

	// Take user data
	const dataUser = new FormData(e.target);
	const formDataObj = Object.fromEntries(dataUser.entries());

	const newBook = new Book(
		formDataObj.title_book,
		formDataObj.author_book,
		formDataObj.pages,
		formDataObj.read === 'yes',
		crypto.randomUUID(),
	);
	myLibrary = [...myLibrary, newBook];
	form.reset();
	displayBooks();
	modal.classList.remove('open');
};

const openModal = () => {
	modal.classList.add('open');
	const firstInput = form.querySelector('input');

	if (firstInput) firstInput.focus();
};

modalShow.addEventListener('click', openModal);
form.addEventListener('submit', addBookToLibrary);
cancelBtn.addEventListener('click', () => modal.classList.remove('open'));
