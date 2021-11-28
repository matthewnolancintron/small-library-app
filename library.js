/**
 * todo:
    make is such that when a new book is added
    it has a random color for background
    and text color but the colors though
    random will insure there is enough
    constrast such that the text will be 
    readable
*/


 let myLibrary = [
    
];

class Book{
    constructor(title,author,numPages,hasBeenRead){
        this.title = title;
        this.author = author;
        this.numPages = numPages;
        this.hasBeenRead = hasBeenRead;
    }
}

function bookObjectToBookMarkup(bookObject){
    // turn object data into markup
    //for the recent book in library
    let newestBookInLibrary = bookObject;

    //container element 
    let bookElement = document.createElement("li");
    bookElement.className = 'book';

    //header for the title and author
    let bookHeader = document.createElement('header');
    bookHeader.className = 'bookHeader';

    //title element 
    let bookTitleElement = document.createElement('h2');
    bookTitleElement.className = 'title';
    bookTitleElement.textContent = newestBookInLibrary.title;
        
    //author element 
    let bookAuthorElement = document.createElement('p');
    bookAuthorElement.className = 'author';
    bookAuthorElement.textContent = 'by ' + newestBookInLibrary.author;
    
    let bookInfo = document.createElement('div');
    bookInfo.classList = 'bookInfo';

    //page count element
    let bookPageElement = document.createElement('p');
    bookPageElement.className = 'numPages';
    bookPageElement.textContent = newestBookInLibrary.numPages + ' Pages'; 
        
    //has been read element
    let bookBeenReadElement = document.createElement('p');
    bookBeenReadElement.className = 'hasBeenRead';
    bookBeenReadElement.textContent = 'has been read?: '+ newestBookInLibrary.hasBeenRead;
    
    let bookButtons = document.createElement('div');
    bookButtons.className = 'bookButtons';

    //removeBookButton
    let removeBookButton = document.createElement('button');
    removeBookButton.className = 'removeBookButton'
    removeBookButton.textContent = 'remove book';
    removeBookButton.setAttribute('data-book-remove','');

    //add event listner to button
    removeBookButton.addEventListener('click',() => {
        let titleContent = removeBookButton.closest('.book').children[0].children[0].textContent;
        let authorContent = removeBookButton.closest('.book').children[0].children[1].textContent;    
        let pagesInfo = removeBookButton.closest('.book').children[1].children[0].textContent;
        let BeenReadInfo = removeBookButton.closest('.book').children[1].children[1].textContent;
      
        //update library array
        myLibrary = myLibrary.filter(book => {
            if(book.title != titleContent &&
               book.author != authorContent &&
               book.numPages != pagesInfo &&
               book.hasBeenRead != BeenReadInfo
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
    changeBookReadStatusButton.className = 'changeHasBeenReadStatusButton';
    changeBookReadStatusButton.textContent = 'change status';
    changeBookReadStatusButton.setAttribute('data-book-status','');

    changeBookReadStatusButton.addEventListener('click', () => {
        //console.log(changeBookReadStatusButton.closest('.book'));
        //toggle book's read status on book prototype instance
        //console.log(bookObject.hasBeenRead,'before toggle');
        if(bookObject.hasBeenRead){
            bookObject.hasBeenRead = false;
        } else{
            bookObject.hasBeenRead = true;
        }
        //console.log(bookObject.hasBeenRead,'after toggle');

        //update
        saveLibraryToLocalStorage();
        
        //update display
        bookButtons.closest('.book').children[1].children[1].textContent = 'has been read?: '+ bookObject.hasBeenRead

    });

    //place title and author into bookheader
    bookHeader.appendChild(bookTitleElement);
    bookHeader.appendChild(bookAuthorElement);

    //place page count and has been read
    //into bookinfo
    bookInfo.appendChild(bookPageElement);
    bookInfo.appendChild(bookBeenReadElement);

    //place button into bookbuttons
    bookButtons.appendChild(removeBookButton);
    bookButtons.appendChild(changeBookReadStatusButton);

    //add sub books elements to book element
    // which book element acts as container
    bookElement.appendChild(bookHeader);
    bookElement.appendChild(bookInfo);
    bookElement.appendChild(bookButtons);

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
            myLibrary = storageLib;
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
            document.getElementById('librarySection').appendChild(libraryElement);
        })(myLibrary); 
    }
    
    //adding a new book from user
    const modalOpenButtons = document.querySelectorAll('[data-modal-target]');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    const overlay = document.getElementById('overlay');
    
    modalOpenButtons.forEach(button => {
        button.addEventListener('click', () => {
            let header = document.getElementById('librarySection').children[0];
            header.style.setProperty('--page-fold','25%');
            //
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
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal(modal) {
        if(modal == null){
            return;
        }
        let header = document.getElementById('librarySection').children[0];
        header.style.setProperty('--page-fold','0%');
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    let form = document.querySelector('#newBookForm');

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let submitter = event.submitter;
        let handler = submitter.id;
      
        if (handler) {
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
            let newBook = new Book(newBookTitle,newBookAuthor,newBookPageCount,NewBookHasBeenRead);
           
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