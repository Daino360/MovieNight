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
        try {
            await addDoc(moviesCollection, { name: movieName });
            console.log(`Film "${movieName}" aggiunto con successo.`);
            movieInput.value = '';  // Pulisce l'input
            updateMovieList();  // Ricarica la lista aggiornata
        } catch (error) {
            console.error("Errore nell'aggiungere il film:", error);
        }
    } else {
        console.log('Nome del film vuoto, nessuna azione eseguita.');
    }
}

// Funzione per aggiornare la lista dei film
async function updateMovieList() {
    const movieListElement = document.getElementById('movieList');
    movieListElement.innerHTML = '';  // Pulisce la lista esistente

    try {
        const querySnapshot = await getDocs(moviesCollection);
        if (querySnapshot.empty) {
            console.log("Nessun film trovato nella collezione.");
        }
        querySnapshot.forEach((docSnap) => {
            const li = document.createElement('li');
            li.textContent = docSnap.data().name;  // Aggiungi il nome del film

            // Bottone per rimuovere il film
            const removeButton = document.createElement('button');
            removeButton.textContent = '❌';
            removeButton.classList.add('remove-btn');
            removeButton.onclick = async () => {
                try {
                    await deleteDoc(doc(db, "movies", docSnap.id));
                    console.log(`Film "${docSnap.data().name}" rimosso con successo.`);
                    updateMovieList();  // Ricarica la lista dopo la rimozione
                } catch (error) {
                    console.error("Errore nella rimozione del film:", error);
                }
            };

            li.appendChild(removeButton);
            movieListElement.appendChild(li);
        });
    } catch (error) {
        console.error("Errore nel recupero dei film:", error);
    }
}

// Carica la lista all'avvio
document.addEventListener("DOMContentLoaded", updateMovieList);