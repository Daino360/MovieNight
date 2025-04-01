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
	} else {
        console.log('Nome del film vuoto, nessuna azione eseguita.');
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


// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Configura Firebase (usa i tuoi dati presi da Firebase Console)
const firebaseConfig = {
	  apiKey: "AIzaSyDOhGsE_267uJnYL62mS3FIV6guTN0YQws",
	  authDomain: "movienight-4dad9.firebaseapp.com",
	  projectId: "movienight-4dad9",
	  storageBucket: "movienight-4dad9.firebasestorage.app",
	  messagingSenderId: "156742392317",
	  appId: "1:156742392317:web:bf3c17ae72cdedde872194",
	  measurementId: "G-TNQXW9YRPW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const moviesCollection = collection(db, "movies");

// Funzione per aggiungere un film
async function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieName = movieInput.value.trim();
    if (movieName !== '') {
        await addDoc(moviesCollection, { name: movieName });
        movieInput.value = '';
        updateMovieList();
    }
}

// Funzione per aggiornare la lista dei film
async function updateMovieList() {
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = '';
    const querySnapshot = await getDocs(moviesCollection);
    
    querySnapshot.forEach((docSnap) => {
        const li = document.createElement('li');
        li.textContent = docSnap.data().name;

        // Bottone per rimuovere il film
        const removeButton = document.createElement('button');
        removeButton.textContent = '❌';
        removeButton.classList.add('remove-btn');
        removeButton.onclick = async () => {
            await deleteDoc(doc(db, "movies", docSnap.id));
            updateMovieList();
        };

        li.appendChild(removeButton);
        movieListElement.appendChild(li);
    });
}

// Carica la lista all'avvio
document.addEventListener("DOMContentLoaded", updateMovieList);
