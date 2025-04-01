let movieList = JSON.parse(localStorage.getItem('movieList')) || [];

document.addEventListener("DOMContentLoaded", updateMovieList);

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

// Funzione per aggiungere un film (non asincrona)
function addMovie() {
    const movieInput = document.getElementById('movieInput');
    const movieName = movieInput.value.trim();

    if (movieName !== '') {
        // Aggiungi un film in Firestore senza utilizzare async/await
        addDoc(moviesCollection, { name: movieName }).then(() => {
            movieInput.value = '';  // Pulisci l'input
            updateMovieList();  // Ricarica la lista dei film
        }).catch((error) => {
            console.error('Errore durante l\'aggiunta del film: ', error);
        });
    }
}

// Funzione per aggiornare la lista dei film (senza async/await)
function updateMovieList() {
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = '';

    // Recupera i film da Firestore senza async/await
    getDocs(moviesCollection).then((querySnapshot) => {
        querySnapshot.forEach((docSnap) => {
            const li = document.createElement('li');
            li.textContent = docSnap.data().name;

            // Bottone per rimuovere il film
            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-btn');
            removeButton.onclick = () => {
                // Rimuovi il film da Firestore
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

// Aggiungi l'event listener al bottone 'Aggiungi Film'
document.getElementById('addMovieButton').addEventListener('click', addMovie);

// Carica la lista all'avvio
document.addEventListener("DOMContentLoaded", updateMovieList);
