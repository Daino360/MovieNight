// Mock data for demonstration
        const mockMovies = [
            { id: "1", name: "Inception", length: "long", importance: 9 },
            { id: "2", name: "The Shawshank Redemption", length: "medium", importance: 10 },
            { id: "3", name: "Pulp Fiction", length: "medium", importance: 8 },
            { id: "4", name: "The Dark Knight", length: "long", importance: 10 },
            { id: "5", name: "Fight Club", length: "medium", importance: 8 },
            { id: "6", name: "Parasite", length: "medium", importance: 9 },
            { id: "7", name: "Spirited Away", length: "medium", importance: 7 },
            { id: "8", name: "Whiplash", length: "short", importance: 8 },
            { id: "9", name: "La La Land", length: "long", importance: 7 },
            { id: "10", name: "Get Out", length: "short", importance: 8 },
            { id: "11", name: "The Matrix", length: "medium", importance: 9 },
            { id: "12", name: "Goodfellas", length: "long", importance: 9 },
            { id: "13", name: "Her", length: "medium", importance: 7 },
            { id: "14", name: "Mad Max: Fury Road", length: "medium", importance: 8 },
            { id: "15", name: "Interstellar", length: "long", importance: 9 },
        ];

        // DOM elements
        const movieListElement = document.getElementById('movieList');
        const randomMovieElement = document.getElementById('randomMovie');
        const addButton = document.getElementById('addMovieButton');
        const randomButton = document.getElementById('chooseRandomMovieButton');
        const movieInput = document.getElementById('movieInput');
        const movieLength = document.getElementById('movieLength');
        const movieImportance = document.getElementById('movieImportance');

        // Current movies array
        let movies = [];

        // Initialize the app
        function init() {
            // For demo, use mock data
            movies = [...mockMovies];
            updateMovieList();
        }

        // Function to add a movie
        function addMovie() {
            const name = movieInput.value.trim();
            const length = movieLength.value;
            const importance = parseInt(movieImportance.value) || 5;

            if (name) {
                const newMovie = {
                    id: Date.now().toString(),
                    name,
                    length,
                    importance
                };
                
                movies.push(newMovie);
                updateMovieList();
                movieInput.value = '';
                movieImportance.value = '5';
            } else {
                alert("Inserisci il titolo del film!");
            }
        }

        // Function to remove a movie
        function removeMovie(id) {
            if (confirm("Sei sicuro di voler rimuovere questo film?")) {
                movies = movies.filter(movie => movie.id !== id);
                updateMovieList();
            }
        }

        // Update movie list display
        function updateMovieList() {
            if (movies.length === 0) {
                movieListElement.innerHTML = '<li class="empty-state">Nessun film nella lista. Aggiungi il tuo primo film!</li>';
                return;
            }
            
            movieListElement.innerHTML = '';
            
            movies.forEach(movie => {
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
                removeBtn.onclick = () => removeMovie(movie.id);
                
                li.appendChild(removeBtn);
                movieListElement.appendChild(li);
            });
        }

        // Choose a random movie
        function chooseRandomMovie() {
            const selectedLengths = getSelectedLengths();
            
            // Filter movies by selected lengths
            const filteredMovies = movies.filter(movie => 
                selectedLengths.includes(movie.length)
            );
            
            if (filteredMovies.length === 0) {
                randomMovieElement.innerHTML = `
                    <p class="empty-state">Nessun film trovato con i filtri selezionati!</p>
                `;
                return;
            }
            
            // Calculate total weight (sum of importance)
            const totalWeight = filteredMovies.reduce(
                (sum, movie) => sum + movie.importance, 0
            );
            
            // Select a random movie with weighted probability
            let randomValue = Math.random() * totalWeight;
            let chosenMovie = null;
            
            for (const movie of filteredMovies) {
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
        init();