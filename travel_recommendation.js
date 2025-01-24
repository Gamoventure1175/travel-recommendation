// Fetch and display recommendations based on user input
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsContainer = document.createElement('div');
resultsContainer.id = 'results';

// Append results container to the body or main container
document.body.appendChild(resultsContainer);

// Fetch recommendations from the JSON file
async function fetchRecommendations() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        console.log('Fetched Data:', data); // For debugging purposes
        return data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Display recommendations
function displayRecommendations(recommendations) {
    resultsContainer.innerHTML = ''; // Clear previous results
    if (recommendations.length === 0) {
        resultsContainer.innerHTML = '<p>No recommendations found.</p>';
        return;
    }

    recommendations.forEach(item => {
        const recommendationCard = document.createElement('div');
        recommendationCard.className = 'recommendation-card';

        recommendationCard.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="recommendation-image">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        `;

        resultsContainer.appendChild(recommendationCard);
    });
}

// Search functionality
async function searchRecommendations() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (!keyword) {
        alert('Please enter a keyword to search.');
        return;
    }

    const data = await fetchRecommendations();
    const filteredRecommendations = [];

    // Filter data by keyword
    if (data) {
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(keyword)) {
                    filteredRecommendations.push(city);
                }
            });
        });

        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword)) {
                filteredRecommendations.push(temple);
            }
        });

        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword)) {
                filteredRecommendations.push(beach);
            }
        });
    }

    displayRecommendations(filteredRecommendations);

    // Scroll to the results section
    if (filteredRecommendations.length > 0) {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// Clear functionality
function clearResults() {
    searchInput.value = '';
    resultsContainer.innerHTML = ''; // Clear displayed results
}

// Event Listeners
searchBtn.addEventListener('click', searchRecommendations);
clearBtn.addEventListener('click', clearResults);

// Optional: Display current time in a specific country
function displayCountryTime(timeZone) {
    const options = {
        timeZone: timeZone,
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const currentTime = new Date().toLocaleTimeString('en-US', options);
    console.log(`Current time in ${timeZone}:`, currentTime);
}
