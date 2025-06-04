// APP.js
let movieList = JSON.parse(localStorage.getItem('movieList')) || [];

document.addEventListener("DOMContentLoaded", updateMovieList);

// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Configura Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDOhGsE_267uJnYL62mS3FIV6guTN0YQws",
    authDomain: "movienight-4dad9.firebaseapp.com",
    projectId: "movienight-4dad9",
    storageBucket: "movienight-4dad9.appspot.com",
    messagingSenderId: "156742392317",
    appId: "1:156742392317:web:bf3c17ae72cdedde872194",
    measurementId: "G-TNQXW9YRPW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const moviesCollection = collection(db, "movies");

// Funzione per aggiungere un film
function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieName = movieInput.value.trim();
    const movieLength = document.getElementById('movieLength').value;
    const movieImportance = parseInt(document.getElementById('movieImportance').value);

    if (movieName !== '') {
        // Aggiungi un film in Firestore
        addDoc(moviesCollection, { 
            name: movieName,
            length: movieLength,
            importance: movieImportance
        }).then(() => {
            movieInput.value = '';  // Pulisci l'input
            updateMovieList();      // Ricarica la lista dei film
        }).catch((error) => {
            console.error('Errore durante l\'aggiunta del film: ', error);
        });
    }
}

// Funzione per aggiornare la lista dei film
function updateMovieList() {
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = '';

    // Recupera i film da Firestore
    getDocs(moviesCollection).then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
            const movie = docSnap.data();
            const li = document.createElement('li');
            
            // Nome del film
            const nameSpan = document.createElement('span');
            nameSpan.textContent = movie.name;
            li.appendChild(nameSpan);
            
            // Info aggiuntive (durata e importanza)
            const infoDiv = document.createElement('div');
            infoDiv.className = 'movie-info';
            
            const lengthSpan = document.createElement('span');
            lengthSpan.textContent = movie.length === 'short' ? 'Corto' : 
                                    movie.length === 'medium' ? 'Medio' : 'Lungo';
            infoDiv.appendChild(lengthSpan);
            
            const importanceSpan = document.createElement('span');
            importanceSpan.textContent = `Importanza: ${movie.importance}`;
            infoDiv.appendChild(importanceSpan);
            
            li.appendChild(infoDiv);
            
            // Bottone per rimuovere il film
            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-btn');
            removeButton.onclick = () => {
                deleteDoc(doc(db, "movies", docSnap.id)).then(() => {
                    updateMovieList();  // Ricarica la lista dei film
                }).catch((error) => {
                    console.error('Errore durante la rimozione del film: ', error);
                });
            };

            li.appendChild(removeButton);
            movieListElement.appendChild(li);
        });
    }).catch((error) => {
        console.error('Errore durante l\'ottenimento dei film da Firestore: ', error);
    });
}

function chooseRandomMovie() {
    // Ottieni i film da Firestore
    getDocs(moviesCollection).then((querySnapshot) => {
        const movies = [];
        const selectedLengths = getSelectedLengths();

        querySnapshot.forEach((docSnap) => {
            const movie = docSnap.data();
            // Filtra per durata selezionata
            if (selectedLengths.includes(movie.length)) {
                movies.push({
                    id: docSnap.id,
                    ...movie
                });
            }
        });

        // Se non ci sono film, mostra un messaggio
        if (movies.length === 0) {
            document.getElementById('randomMovie').textContent = 'Nessun film trovato con i filtri selezionati!';
            return;
        }

        // Calcola il peso totale in base all'importanza
        const totalWeight = movies.reduce((sum, movie) => sum + movie.importance, 0);
        
        // Seleziona un film casuale con probabilità basata sull'importanza
        let randomValue = Math.random() * totalWeight;
        let chosenMovie = null;

        for (const movie of movies) {
            randomValue -= movie.importance;
            if (randomValue <= 0) {
                chosenMovie = movie;
                break;
            }
        }

        // Mostra il film selezionato
        const lengthMap = {
            short: 'Corto',
            medium: 'Medio',
            long: 'Lungo'
        };
        
        document.getElementById('randomMovie').innerHTML = `
            <h3>Film scelto:</h3>
            <p><strong>${chosenMovie.name}</strong></p>
            <p>Durata: ${lengthMap[chosenMovie.length]}</p>
            <p>Importanza: ${chosenMovie.importance}/10</p>
        `;
    }).catch((error) => {
        console.error("Errore nel recuperare i film: ", error);
    });
}

// Ottieni le durate selezionate
function getSelectedLengths() {
    const checkboxes = document.querySelectorAll('.length-filter:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

// Aggiungi gli event listener
document.getElementById('addMovieButton').addEventListener('click', addMovie);
document.getElementById('chooseRandomMovieButton').addEventListener('click', chooseRandomMovie);

// Carica la lista all'avvio
document.addEventListener("DOMContentLoaded", updateMovieList);