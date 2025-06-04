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
                    alert("Si è verificato un errore durante l'aggiunta del film.");
                });
            } else {
                alert("Inserisci il titolo del film!");
            }
        }

        // Funzione per aggiornare la lista dei film
        function updateMovieList() {
            const movieListElement = document.getElementById('movieList');
            
            // Recupera i film da Firestore
            getDocs(moviesCollection).then((querySnapshot) => {
                if (querySnapshot.empty) {
                    movieListElement.innerHTML = '<li class="empty-state">Nessun film nella lista. Aggiungi il tuo primo film!</li>';
                    return;
                }
                
                movieListElement.innerHTML = '';
                
                querySnapshot.forEach((docSnap) => {
                    const movie = docSnap.data();
                    const li = document.createElement('li');
                    
                    // Contenuto film
                    const movieContent = document.createElement('div');
                    movieContent.className = 'movie-info';
                    
                    const nameDiv = document.createElement('div');
                    nameDiv.className = 'movie-name';
                    nameDiv.textContent = movie.name;
                    
                    const detailsDiv = document.createElement('div');
                    detailsDiv.className = 'movie-details';
                    
                    const lengthSpan = document.createElement('span');
                    lengthSpan.className = `movie-length ${movie.length}`;
                    lengthSpan.textContent = movie.length === 'short' ? 'Corto' : 
                                            movie.length === 'medium' ? 'Medio' : 'Lungo';
                    
                    const importanceSpan = document.createElement('span');
                    importanceSpan.className = 'movie-importance';
                    importanceSpan.textContent = `Importanza: ${movie.importance}/10`;
                    
                    detailsDiv.appendChild(lengthSpan);
                    detailsDiv.appendChild(importanceSpan);
                    
                    movieContent.appendChild(nameDiv);
                    movieContent.appendChild(detailsDiv);
                    
                    li.appendChild(movieContent);
                    
                    // Bottone per rimuovere il film
                    const removeButton = document.createElement('button');
                    removeButton.className = 'remove-btn';
                    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
                    removeButton.onclick = () => {
                        if (confirm(`Sei sicuro di voler rimuovere "${movie.name}" dalla lista?`)) {
                            deleteDoc(doc(db, "movies", docSnap.id)).then(() => {
                                updateMovieList();
                            }).catch((error) => {
                                console.error('Errore durante la rimozione del film: ', error);
                                alert("Si è verificato un errore durante la rimozione del film.");
                            });
                        }
                    };

                    li.appendChild(removeButton);
                    movieListElement.appendChild(li);
                });
            }).catch((error) => {
                console.error('Errore durante l\'ottenimento dei film da Firestore: ', error);
                movieListElement.innerHTML = '<li class="empty-state">Errore nel caricamento dei film. Riprova più tardi.</li>';
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
                    document.getElementById('randomMovie').innerHTML = `
                        <p class="empty-state">Nessun film trovato con i filtri selezionati!</p>
                    `;
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
                    <h3>Film Scelto:</h3>
                    <div class="random-result">${chosenMovie.name}</div>
                    <div class="result-details">
                        <div class="result-detail">
                            <i class="fas fa-clock"></i> ${lengthMap[chosenMovie.length]}
                        </div>
                        <div class="result-detail">
                            <i class="fas fa-star"></i> Importanza: ${chosenMovie.importance}/10
                        </div>
                    </div>
                `;
            }).catch((error) => {
                console.error("Errore nel recuperare i film: ", error);
                document.getElementById('randomMovie').innerHTML = `
                    <p class="empty-state">Errore nel recupero dei film. Riprova più tardi.</p>
                `;
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