// Chờ cho toàn bộ nội dung HTML được tải xong trước khi chạy script
document.addEventListener('DOMContentLoaded', () => {
    // --- Các phần tử DOM ---
    const themeToggleButton = document.getElementById('header-button');
    const searchInput = document.getElementById('search');
    const searchButton = document.querySelector('.search-bar__button'); // Chọn bằng class vì không có ID
    const errorMessage = document.getElementById('search-err');
    const body = document.body;

    // Các phần tử trong thẻ hồ sơ
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

    // URL API của GitHub
    const API_URL = 'https://api.github.com/users/';

    

    // Hàm cập nhật giao diện (văn bản và biểu tượng)
    const updateThemeUI = (theme) => {
        const themeText = theme === 'light' ? 'Dark' : 'Light';
        const themeIcon = theme === 'light' ? 'icon_moon.svg' : 'icon_sun.svg';

        // Cập nhật nội dung của nút
        themeToggleButton.innerHTML = `
            ${themeText}
            <img class="header__mode-icon" src="./assets/images/${themeIcon}" alt="icon-${theme}-mode" />
        `;
        body.className = `container ${theme}`; // Áp dụng class 'light' hoặc 'dark' cho <body>
        localStorage.setItem('theme', theme);
    };

    // Khởi tạo giao diện khi tải trang
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        updateThemeUI(savedTheme);
    };

    // Sự kiện click để chuyển đổi giao diện
    themeToggleButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        updateThemeUI(newTheme);
    });

    // --- LOGIC TÌM KIẾM GITHUB API ---

    // Hàm để lấy dữ liệu người dùng
    const fetchUser = async (username) => {
        if (!username) return;

        errorMessage.style.display = 'none'; // Ẩn thông báo lỗi

        try {
            const response = await fetch(API_URL + username);

            if (!response.ok) {
                if (response.status === 404) {
                    errorMessage.style.display = 'block'; // Hiển thị lỗi "No results"
                }
                return;
            }

            const data = await response.json();
            updateProfileCard(data);

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
            errorMessage.style.display = 'block';
        }
    };

    // Hàm để định dạng ngày tham gia
    const formatJoinDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-GB', { month: 'short' }); // Dùng 'en-GB' cho định dạng "26 Jan 2011"
        const year = date.getFullYear();
        return `Joined ${day} ${month} ${year}`;
    };
    
    // Hàm để cập nhật thẻ hồ sơ với dữ liệu người dùng
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

        // Cập nhật các liên kết mạng xã hội và xử lý giá trị trống
        updateSocialLink(locationEl, user.location);
        updateSocialLink(websiteEl, user.blog, true);
        updateSocialLink(twitterEl, user.twitter_username, true, `https://twitter.com/${user.twitter_username}`);
        updateSocialLink(companyEl, user.company, true);
    };
    
    // Hàm phụ trợ để cập nhật các liên kết xã hội
    const updateSocialLink = (element, value, isLink = false, linkHref = '') => {
        const listItem = element.closest('li'); // Tìm phần tử <li> cha
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


    // --- BỘ LẮNG NGHE SỰ KIỆN cho TÌM KIẾM ---
    searchButton.addEventListener('click', () => {
        fetchUser(searchInput.value.trim());
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            fetchUser(searchInput.value.trim());
        }
    });

    // --- KHỞI TẠO ---
    initTheme();
    fetchUser('octocat'); // Lấy người dùng mặc định "octocat" khi tải trang
});