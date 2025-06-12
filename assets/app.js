// Wait for the entire HTML content to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
   // --- DOM Elements ---
    const themeToggleButton = document.getElementById('header-button');
    const searchInput = document.getElementById('search');
    const searchButton = document.querySelector('.search-bar__button'); 
    const errorMessage = document.getElementById('search-err');
    const body = document.body;

     // Elements within the profile card
    const avatar = document.getElementById('obj-avatar');
    const userName = document.getElementById('obj-name');
    const userLogin = document.getElementById('obj-username');
    const joinDate = document.getElementById('obj-date');
    const bio = document.getElementById('obj-bio');
    const repos = document.getElementById('obj-repos');
    const followers = document.getElementById('obj-followers');
    const following = document.getElementById('obj-following');
    const locationEl = document.getElementById('obj-location');
    const websiteEl = document.getElementById('obj-website');
    const twitterEl = document.getElementById('obj-twitter');
    const companyEl = document.getElementById('obj-company');

    // URL API GitHub
    const API_URL = 'https://api.github.com/users/';

    
 // Function to update the UI theme
    const updateThemeUI = (theme) => {
        const themeText = theme === 'light' ? 'Dark' : 'Light';
        const themeIcon = theme === 'light' ? 'icon_moon.svg' : 'icon_sun.svg';

        
        themeToggleButton.innerHTML = `
            ${themeText}
            <img class="header__mode-icon" src="./assets/images/${themeIcon}" alt="icon-${theme}-mode" />
        `;
        
        // Update theme class and data attribute
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        themeToggleButton.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

   
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        updateThemeUI(savedTheme);
    };
 // Click event to toggle theme
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = themeToggleButton.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        updateThemeUI(newTheme);
    });

    // --- GITHUB API SEARCH LOGIC ---

    // Function to fetch user data
    const fetchUser = async (username) => {
        if (!username || username.trim() === '') {
            errorMessage.style.display = 'block';
            return;
        }

        errorMessage.style.display = 'none'; 

        try {
            const response = await fetch(API_URL + username);

            if (!response.ok) {
                if (response.status === 404) {
                    errorMessage.style.display = 'block'; // Display "No results" error
                }
                return;
            }

            const data = await response.json();
            updateProfileCard(data);

        } catch (error) {
            console.error("Error fetching user data:", error);
            errorMessage.style.display = 'block';
        }
    };

     // Function to format the join date
    const formatJoinDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'short' }); 
        const year = date.getFullYear();
        return `Joined ${day} ${month} ${year}`;
    };
    
     // Function to update the profile card with user data
    const updateProfileCard = (user) => {
        avatar.src = user.avatar_url;
        userName.textContent = user.name || user.login;
        userLogin.textContent = `@${user.login}`;
        userLogin.href = user.html_url;
        joinDate.textContent = formatJoinDate(user.created_at);
        bio.textContent = user.bio || 'This profile has no bio';
        repos.textContent = user.public_repos;
        followers.textContent = user.followers;
        following.textContent = user.following;
        // Update social links and handle empty values
        updateSocialLink(locationEl, user.location);
        updateSocialLink(websiteEl, user.blog, true);
        updateSocialLink(twitterEl, user.twitter_username, true, `https://twitter.com/${user.twitter_username}`);
        updateSocialLink(companyEl, user.company, true);
    };
    
    
    // Helper function to update social links
    const updateSocialLink = (element, value, isLink = false, linkHref = '') => {
        const listItem = element.closest('li'); // Find the parent <li> element
        if (value) {
            element.textContent = value;
            if (isLink) {
                element.href = linkHref || value;
            }
            listItem.classList.remove('not-available');
        } else {
            element.textContent = 'Not Available';
            if (isLink) {
                element.removeAttribute('href');
            }
            listItem.classList.add('not-available');
        }
    };


    // --- EVENT LISTENERS for SEARCH ---
    searchButton.addEventListener('click', () => {
        fetchUser(searchInput.value.trim());
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            fetchUser(searchInput.value.trim());
        }
    });

    initTheme();
    fetchUser('octocat'); // Fetch default user "octocat" on page load
});