
var titleH2 = document.querySelector('.h2');
var title = document.querySelector('.title');
var content = document.getElementById('content');
var container = document.getElementById('myBooks');
var resultDivMessage = document.createElement('div');

var search = [];
var pochList = [];

//btn1 'Ajouter un livre' 
var btn1 = document.createElement('div');
btn1.innerHTML = `
  <div class="addB">
    <button onclick="addB()" type="button" class="btn-add btn">Ajouter un livre</button>
  </div>`;
titleH2.after(btn1);
var addBDiv = document.querySelector('.addB');




var searchResults = document.createElement('div');
searchResults.classList.add('results');
btn1.after(searchResults);

//Create PochList
var pochListDiv = document.createElement('div');
pochListDiv.classList.add('pochList');
content.after(pochListDiv);

console.log(sessionStorage.getItem("savedBooks"));

//display the saved books

if (sessionStorage.getItem("savedBooks")) {
  pochList = JSON.parse(sessionStorage.getItem("savedBooks"));
  showPochlist();
}
console.log(sessionStorage.getItem("savedBooks"));

//Create alert
var alertMessage = document.createElement('div');
titleH2.after(alertMessage);


//Add Search Form 
function addB() {
  addBDiv.innerHTML = `
  <form>
    <div class="row-11 form-group">
      <label class="row-s-3 form-label" for="title">Titre du Livre</label><br></br>

    
      <input class="row-s-8 form-control" type="text" name="title" id="title" placeholder="Titre" size="40%"><br></br>
    
    
      <label class="row-s-3 form-label" for="author">Auteur</label><br></br>
    
    
  
      <input class="row-s-8 form-control" type="text" name="author" id="author" placeholder="Auteur" size="40%> <br></br>
    
    <div class="btn2"><br></br>
    <button onclick="searchB()" type="button" class="btn-search btn">Rechercher</button>
    </div><br></br>
    <div class="btn3">
    <button onclick="cancel()" type="button" class="btn-cancel btn">Cancel</button>
    </div><br></br>
    </div>
  </form>`

}

//Use GoogleBooksAPI to search books with title and author
const apiKey = 'AIzaSyBPZvvxdYcbjBtm5DLEH9UpR6sxR0_GA64';
function searchB() {
  
  resultDivMessage.innerHTML = `
  <div class="resultMessage">
  <h3><strong>Résultats de recherche</strong></h3>
  </div>`;
  var addBDiv = document.querySelector('.addB');
  addBDiv.after(resultDivMessage);

  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  let title = titleInput.value;
  let author = authorInput.value;
  searchResults.innerHTML = '';

  if(title === '' || author === '' || title=== null || author === null) {
    alert('Vous devez fournir une valeur aux deux champs pour lancer la recherche !');
  } else {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}+inauthor:${author}&key=${apiKey}`)
    .then((results) => {
      console.log(results);
      search = results.data.items;
      if (results.data.totalItems === 0) {
        alert('Aucun livre n\'a été trouvé...');
      } else {
        for (let i = 0; i < results.data.items.length; i++) {

          let image;
          if (results.data.items[i].volumeInfo.imageLinks === undefined) {
            image = "assets/unavailable.png"
          } else {
            image = results.data.items[i].volumeInfo.imageLinks.thumbnail;
          }
          
          let description = results.data.items[i].volumeInfo.description;
          description = (results.data.items[i].volumeInfo.description === undefined) ? description = "Informations manquantes..." : description = (results.data.items[i].volumeInfo.description.length > 200) ?
          (results.data.items[i].volumeInfo.description.substring(0, 200) + "...") : 
          results.data.items[i].volumeInfo.description;
        
          searchResults.innerHTML += `
          <div class="card row-3 row-s-5">
              <div class="card-body row-8">
                <h3 class="card-title">${results.data.items[i].volumeInfo.title}</h3>
                <p class="id">Id : ${results.data.items[i].id}</p>
                <p class="auteur">Auteur : <strong>${results.data.items[i].volumeInfo.authors[0]}</strong></p>
                <p class="description">${description}</p>
              </div>
              <div class="card-content">
              <div class="card-img row-4">
              <svg class="icon" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-bookmark-fill" fill="#40C3AC" xmlns="http://www.w3.org/2000/svg">
              <path onclick="storeB('${results.data.items[i].id}')" fill-rule="evenodd" d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5V2z"/>
              </svg>
                <img src="${image}" class="card-img-top" alt="${results.data.items[i].volumeInfo.title}">
              </div>
            </div>
          </div>`
        }
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }
}


//Cancel the search and the result
function cancel() {
  addBDiv.innerHTML = `
    <button onclick="addB()" type="button" class="btn-add btn btn-info">Ajouter un livre</button>`;
  searchResults.innerHTML = '';
  search = [];
  resultDivMessage.innerHTML = '';
}

function deleteB(bookId) {
  pochList = pochList.filter(book => book.id !== bookId);
  sessionStorage.setItem('savedBooks', JSON.stringify(pochList));
  showMessage('danger', "Le livre a été supprimmé de votre Poch'List ");
  showPochlist();
}

//Store a Book
function storeB(bookId) {
  console.log(bookId);
  let book = search.filter(book => book.id === bookId);
  console.log(book);
  let title = book[0].volumeInfo.title;
  let author = book[0].volumeInfo.authors[0];
  let id = book[0].id;
  let image;
  if (book[0].volumeInfo.imageLinks === undefined) {
    image = "assets/unavailable.png"
  } else {
    image = book[0].volumeInfo.imageLinks.thumbnail;
  }

  let description = book[0].volumeInfo.description;
  if (description === undefined) {
    description = "Informations manquantes...";
  }

  const bookSaved = {
    id: id,
    title: title,
    author: author,
    image: image,
    description: description
  }

  console.log(bookSaved);
  if (pochList !== undefined) {
    console.log(pochList);
    if (pochList.some(book => book.id === bookSaved.id)) {
      showMessage("danger", "Vous ne pouvez ajouter deux fois le même livre !");
    } else {
      pochList.push(bookSaved);
      sessionStorage.setItem('savedBooks', JSON.stringify(pochList));
      showMessage("success", "Votre nouveau livre est dans votre Poch'List !");
    }
  } 
  showPochlist();
}


function showPochlist() {
  pochListDiv.innerHTML = '';
  for (let i = 0; i < pochList.length; i++) {
    pochListDiv.innerHTML += `
          <div class="card row-3 row-s-5">
            <svg class="icon" width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="red" xmlns="http://www.w3.org/2000/svg">
              <path onclick="deleteB('${pochList[i].id}')" fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
            </svg>
            <div class="card-content">
             
              <div class="card-body row-8">
                <h3 class="card-title">${pochList[i].title}</h3>
                <p class="id">Id : ${pochList[i].id}</p>
                <p class="auteur">Auteur : <strong>${pochList[i].author}</strong></p>
                <p class="description">${pochList[i].description}</p>
              </div>
              <div class="card-img row-4">
              <img src="${pochList[i].image}" class="card-img-top" alt="${pochList[i].title}">
            </div>
            </div>
          </div>`
  }
}

function showMessage(type, message) {
  alertMessage.innerHTML = `
  <div class="alert-${type}" role="alert">
    ${message}
  </div>`;
  setTimeout(() => {alertMessage.innerHTML = ''}, 4000);
}