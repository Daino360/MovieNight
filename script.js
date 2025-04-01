let movieList = JSON.parse(localStorage.getItem('movieList')) || [];

document.addEventListener("DOMContentLoaded", updateMovieList);

function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieName = movieInput.value.trim();
    if (movieName !== '') {
        movieList.push(movieName);
        movieInput.value = '';
        updateMovieList();
        saveMoviesToLocalStorage();
    }
}

function updateMovieList() {
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = '';

    movieList.forEach((movie, index) => {
        const li = document.createElement('li');
        li.textContent = movie;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.classList.add('remove-btn');
        removeButton.onclick = () => removeMovie(index);

        li.appendChild(removeButton);
        movieListElement.appendChild(li);
    });
}

function removeMovie(index) {
    movieList.splice(index, 1);
    updateMovieList();
    saveMoviesToLocalStorage();
}

function chooseRandomMovie() {
    if (movieList.length === 0) {
        document.getElementById('randomMovie').textContent = 'La lista è vuota!';
    } else {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        document.getElementById('randomMovie').textContent = `Film scelto: ${movieList[randomIndex]}`;
    }
}

function saveMoviesToLocalStorage() {
    localStorage.setItem('movieList', JSON.stringify(movieList));
}
