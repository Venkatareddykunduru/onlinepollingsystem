document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve the token from localStorage
    const authToken = localStorage.getItem('token');

    if (!authToken) {
        console.error('No auth token found');
        return;
    }

    try {
        const response = await axios.get('http://18.206.175.180:3000/auth/userinfo', {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const userInfo = response.data;

        // Update the user information on the page
        document.querySelector('.card-title').textContent = `Username: ${userInfo.name}`;
        document.querySelector('.card-text').textContent = `Email: ${userInfo.email}`;

        // Populate the created polls
        const createdPollsList = document.getElementById('createdPollsList');
        userInfo.createdPolls.forEach(pollId => {
            const li = document.createElement('li');
            li.textContent = `Poll ID: ${pollId}`; // You can display the poll title if available.
            createdPollsList.appendChild(li);
        });

        // Populate the voted polls
        const votedPollsList = document.getElementById('votedPollsList');
        userInfo.votedPolls.forEach(pollId => {
            const li = document.createElement('li');
            li.textContent = `Poll ID: ${pollId}`; // You can display the poll title if available.
            votedPollsList.appendChild(li);
        });

    } catch (error) {
        console.error('Error fetching user info:', error);
    }
});
