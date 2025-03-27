// Recupera la lista dei film dal LocalStorage (se esiste) all'inizio
let movieList = JSON.parse(localStorage.getItem('movieList')) || [];

function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieName = movieInput.value.trim();
    if (movieName !== '') {
        movieList.push(movieName);
        movieInput.value = ''; // pulisce il campo di input
        updateMovieList();
        saveMoviesToLocalStorage(); // Salva la lista nel LocalStorage
    }
}

function updateMovieList() {
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = ''; // svuota la lista esistente

    movieList.forEach((movie, index) => {
        const li = document.createElement('li');
        li.textContent = movie;
        movieListElement.appendChild(li);
    });
}

function chooseRandomMovie() {
    if (movieList.length === 0) {
        document.getElementById('randomMovie').textContent = 'La lista è vuota!';
    } else {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        const randomMovie = movieList[randomIndex];
        document.getElementById('randomMovie').textContent = `Film scelto: ${randomMovie}`;
    }
}

// Salva la lista di film nel LocalStorage
function saveMoviesToLocalStorage() {
    localStorage.setItem('movieList', JSON.stringify(movieList));
}

// Carica la lista dei film quando la pagina si carica
window.onload = updateMovieList;
