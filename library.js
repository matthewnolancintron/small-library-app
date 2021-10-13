/**
 * todo:
 * style it
 */
 let myLibrary = [
    
];

function Book(title,author,numPages,hasBeenRead) {
    // the constructor
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.hasBeenRead = hasBeenRead;
}

function bookObjectToBookMarkup(bookObject){
    // turn object data into markup
    //for the recent book in library
    let newestBookInLibrary = bookObject;

    //container element 
    let bookElement = document.createElement("li");
    bookElement.className = 'book';

    //title element 
    let bookTitleElement = document.createElement('h2');
    bookTitleElement.className = 'title';
    bookTitleElement.textContent = newestBookInLibrary.title;
        
    //author element 
    let bookAuthorElement = document.createElement('p');
    bookAuthorElement.className = 'author';
    bookAuthorElement.textContent = 'by ' + newestBookInLibrary.author;
        
    //page count element
    let bookPageElement = document.createElement('p');
    bookPageElement.className = 'numPages';
    bookPageElement.textContent = newestBookInLibrary.numPages + ' Pages'; 
        
    //has been read element
    let bookBeenReadElement = document.createElement('p');
    bookBeenReadElement.className = 'hasBeenRead';
    bookBeenReadElement.textContent = 'has book been read?: '+ newestBookInLibrary.hasBeenRead;
    
    //removeBookButton
    let removeBookButton = document.createElement('button');
    removeBookButton.textContent = 'x remove this book';
    removeBookButton.setAttribute('data-book-remove','');

    //add event listner to button
    removeBookButton.addEventListener('click',() => {
        //update library array
        myLibrary = myLibrary.filter(book => {
            if(book.title != removeBookButton.closest('.book').children[0].textContent &&
               book.author != removeBookButton.closest('.book').children[1].textContent &&
               book.numPages != removeBookButton.closest('.book').children[2].textContent &&
               book.hasBeenRead != removeBookButton.closest('.book').children[3].textContent
             ){
                return book;
             }
        });
        //update localstorage
        saveLibraryToLocalStorage();
        
        //
        removeBookButton.closest('.book').remove();
    });

    let changeBookReadStatusButton = document.createElement('button');
    changeBookReadStatusButton.textContent = 'press to change status';
    changeBookReadStatusButton.setAttribute('data-book-status','');

    changeBookReadStatusButton.addEventListener('click', () => {
        console.log(changeBookReadStatusButton.closest('.book'));
        //toggle book's read status on book prototype instance
        console.log(bookObject.hasBeenRead,'before toggle');
        if(bookObject.hasBeenRead){
            bookObject.hasBeenRead = false;
        } else{
            bookObject.hasBeenRead = true;
        }
        console.log(bookObject.hasBeenRead,'after toggle');

        //update
        saveLibraryToLocalStorage();

        //update display
        changeBookReadStatusButton.closest('.book').children[3].textContent = 'has book been read?: '+ bookObject.hasBeenRead

    });

    //add sub books elements to book element
    // which book element acts as container
    bookElement.appendChild(bookTitleElement);
    bookElement.appendChild(bookAuthorElement);
    bookElement.appendChild(bookPageElement);
    bookElement.appendChild(bookBeenReadElement);

    bookElement.appendChild(removeBookButton);

    bookElement.appendChild(changeBookReadStatusButton);

    //add book to library element
    document.getElementById('library').appendChild(bookElement);
 
    // call function that saves
    //library array to local storage
    saveLibraryToLocalStorage();
}

function addBookToLibrary(bookToAdd) {
    //add book object data to library array
    myLibrary.push(bookToAdd);

    //call function to generate markup
    //from object data
    bookObjectToBookMarkup(bookToAdd);
}

function saveLibraryToLocalStorage(){
 /**
  * call function that checks if 
  * local storage is supported and available
  */
   if(storageAvailable('localStorage')){
    //storage is available
    //save library array to local storage or update it
    localStorage.setItem('library',JSON.stringify(myLibrary));
   } else{
       // can not use storage
        console.log('no storage');
   }
}

function storageAvailable(type) {
    let storage;

    try {
        storage = window[type];
        let x = '_storage_test_';
        storage.setItem(x,x);
        storage.removeItem(x);
        return true;
    } catch(e) {
        return e instanceof DOMException && (
            // everything except firefox
            e.code == 22 ||

            //firefox
            e.code == 1014 ||
            //test name field too
            e.name == 'QuotaExceededError'||
            //Firefox
            e.name == 'NS_ERROR_DOM_QUOTA_REACHED') &&
            //acknowledge QuotaExceededError only if there's
            (storage && storage.length !== 0);
    }
}

function loadLibraryFromStorage(){    
    if(storageAvailable('localStorage')){
        //storage is available
        //if item in local storage is not null,it exist
        if(localStorage.getItem('library') != null){
            let storageLib = JSON.parse(localStorage.getItem('library'));
            console.log(storageLib,'s');
            myLibrary = storageLib;
            console.log(myLibrary,'l')
        }
    } else{
        // can not use storage
       }  
}

//load dynamic content once the html and css is ready
document.addEventListener('DOMContentLoaded', (event) => {
    //
    console.log('dom is ready');

    //
    let libraryElement = document.getElementById('library');

    // add function that looks for library array in localStorage
    // when your app is first loaded.
    loadLibraryFromStorage();

    //if myLibrary has elements display it
    if(myLibrary != undefined){
        //display library when page is first loaded
        (function displayLibrary(library){
            // add books to the library element
            library.forEach((book) => {
                //
                bookObjectToBookMarkup(book);
            });
            //add library element to the page
            document.body.appendChild(libraryElement);
        })(myLibrary); 
    }
    
    //adding a new book from user
    const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    const overlay = document.getElementById('overlay');
    
    modalOpenButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            closeModal(modal);
        });
    })

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal =  button.closest('.modal');
            closeModal(modal);
        });
    });

    function openModal(modal) {
        if(modal == null){
            return;
        }
        console.log('?');
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal(modal) {
        if(modal == null){
            return;
        }
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    let form = document.querySelector('#newBookForm');

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let submitter = event.submitter;
        let handler = submitter.id;
      
        if (handler) {
            console.log('did submit?',submitter,handler,form);
            console.log(form.children);
            
            //gather form data
            //title
            let newBookTitle = form.children[0].children[1].value;
            //console.log(form.children[0].children[1].value);
            
            //author
            let newBookAuthor = form.children[1].children[1].value;
            //console.log(form.children[1].children[1].value);

            //pageCount
            let newBookPageCount = form.children[2].children[1].value;
            //console.log(form.children[2].children[1].value);

            //has been read
            let NewBookHasBeenRead = ((form.children[3].children[1].value) == 'True' ? true : false);
            //console.log(form.children[3].children[1].value);
            
            //instantiate book from form data
            let newBook = Object.create(Book);
            newBook.title = newBookTitle;
            newBook.author = newBookAuthor;
            newBook.numPages = newBookPageCount;
            newBook.hasBeenRead = NewBookHasBeenRead;

            //add new book object to the library
            addBookToLibrary(newBook);

            //close modal form
            closeModal(modal);

            // clear form data...
            //clear title
            form.children[0].children[1].value = "";
            //clear author
            form.children[1].children[1].value = "";
            //clear pagecount
            form.children[2].children[1].value = "";
            //reset selection
            form.children[3].children[1].value = "";

        } else {
          showAlertMessage("?");
        }
    });
});