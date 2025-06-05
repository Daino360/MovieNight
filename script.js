// Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDOhGsE_267uJnYL62mS3FIV6guTN0YQws",
            authDomain: "movienight-4dad9.firebaseapp.com",
            projectId: "movienight-4dad9",
            storageBucket: "movienight-4dad9.appspot.com",
            messagingSenderId: "156742392317",
            appId: "1:156742392317:web:bf3c17ae72cdedde872194",
            measurementId: "G-TNQXW9YRPW"
        };

        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const db = firebase.firestore();
        const moviesCollection = db.collection("movies");

        // DOM elements
        const movieListElement = document.getElementById('movieList');
        const randomMovieElement = document.getElementById('randomMovie');
        const addButton = document.getElementById('addMovieButton');
        const randomButton = document.getElementById('chooseRandomMovieButton');
        const movieInput = document.getElementById('movieInput');
        const movieLength = document.getElementById('movieLength');
        const movieImportance = document.getElementById('movieImportance');
        const notification = document.getElementById('notification');

        // Show notification
        function showNotification(message, isError = false) {
            notification.textContent = message;
            notification.style.backgroundColor = isError ? '#e53935' : '#43a047';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Initialize the app
        function init() {
            // Set up real-time listener for movies
            moviesCollection.orderBy("createdAt", "desc").onSnapshot((snapshot) => {
                // Clear current list
                movieListElement.innerHTML = '';
                
                if (snapshot.empty) {
                    movieListElement.innerHTML = '<li class="empty-state">Nessun film nella lista. Aggiungi il tuo primo film!</li>';
                    return;
                }
                
                snapshot.forEach(doc => {
                    const movie = doc.data();
                    const id = doc.id;
                    addMovieToList(id, movie);
                });
            }, (error) => {
                console.error("Error loading movies: ", error);
                showNotification("Errore nel caricamento dei film", true);
            });
        }

        // Add movie to the list
        function addMovieToList(id, movie) {
            const li = document.createElement('li');
            
            // Movie info
            const movieInfo = document.createElement('div');
            movieInfo.className = 'movie-info';
            
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
            
            movieInfo.appendChild(nameDiv);
            movieInfo.appendChild(detailsDiv);
            
            li.appendChild(movieInfo);
            
            // Remove button
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
            removeBtn.onclick = () => removeMovie(id);
            
            li.appendChild(removeBtn);
            movieListElement.appendChild(li);
        }

        // Function to add a movie
        async function addMovie() {
            const name = movieInput.value.trim();
            const length = movieLength.value;
            const importance = parseInt(movieImportance.value) || 5;

            if (!name) {
                showNotification("Inserisci il titolo del film!", true);
                return;
            }

            try {
                // Add movie to Firestore
                await moviesCollection.add({
                    name: name,
                    length: length,
                    importance: importance,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Clear input fields
                movieInput.value = '';
                movieImportance.value = '5';
                showNotification("Film aggiunto con successo!");
                
                // Debug: Log success
                console.log("Movie added successfully to Firestore");
            } catch (error) {
                console.error("Error adding movie: ", error);
                showNotification("Errore durante l'aggiunta del film", true);
            }
        }

        // Function to remove a movie
        async function removeMovie(id) {
            if (!confirm("Sei sicuro di voler rimuovere questo film?")) return;
            
            try {
                await moviesCollection.doc(id).delete();
                showNotification("Film rimosso con successo!");
            } catch (error) {
                console.error("Error removing movie: ", error);
                showNotification("Errore durante la rimozione del film!", true);
            }
        }

        // Choose a random movie
        async function chooseRandomMovie() {
            try {
                const snapshot = await moviesCollection.get();
                const movies = [];
                const selectedLengths = getSelectedLengths();
                
                snapshot.forEach(doc => {
                    const movie = doc.data();
                    if (selectedLengths.includes(movie.length)) {
                        movies.push({
                            id: doc.id,
                            ...movie
                        });
                    }
                });
                
                if (movies.length === 0) {
                    randomMovieElement.innerHTML = `
                        <p class="empty-state">Nessun film trovato con i filtri selezionati!</p>
                    `;
                    return;
                }
                
                // Calculate total weight (sum of importance)
                const totalWeight = movies.reduce((sum, movie) => sum + movie.importance, 0);
                let randomValue = Math.random() * totalWeight;
                let chosenMovie = null;
                
                for (const movie of movies) {
                    randomValue -= movie.importance;
                    if (randomValue <= 0) {
                        chosenMovie = movie;
                        break;
                    }
                }
                
                // Display the chosen movie
                const lengthMap = {
                    short: 'Corto',
                    medium: 'Medio',
                    long: 'Lungo'
                };
                
                randomMovieElement.innerHTML = `
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
            } catch (error) {
                console.error("Error getting movies: ", error);
                showNotification("Errore nel caricamento dei film", true);
            }
        }

        // Get selected length filters
        function getSelectedLengths() {
            const checkboxes = document.querySelectorAll('.length-filter:checked');
            return Array.from(checkboxes).map(checkbox => checkbox.value);
        }

        // Event listeners
        addButton.addEventListener('click', addMovie);
        randomButton.addEventListener('click', chooseRandomMovie);

        // Initialize the app
        document.addEventListener('DOMContentLoaded', init);