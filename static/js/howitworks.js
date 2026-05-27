// Preference form submission
const prefForm = document.querySelector('.preference-form');

if (prefForm) {
    prefForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const preference = this.querySelector('select').value;

        if (name && preference && preference !== 'Choose Your Preferences') {
            // Save to localStorage for immediate use (filtering on home page)
            localStorage.setItem('prefName', name);
            localStorage.setItem('prefChoice', preference);

            // Check if user is logged in
            fetch('/api/check-auth/')
                .then(res => res.json())
                .then(auth => {
                    if (auth.is_authenticated) {
                        // User is logged in – save to database
                        fetch('/api/save-user-preference/', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name, preference })
                        })
                        .then(() => {
                            alert(`Thank you, ${name}! Your preferences for "${preference}" are saved.`);
                            window.location.href = '/home/';
                        })
                        .catch(() => {
                            alert("Preferences saved locally. Could not save to database.");
                            window.location.href = '/home/';
                        });
                    } else {
                        // Not logged in – store pending preference and redirect to login
                        sessionStorage.setItem('pendingPreference', JSON.stringify({ name, preference }));
                        alert("Please login to save your preferences permanently.");
                        window.location.href = '/login/?next=/home/';
                    }
                })
                .catch(() => {
                    // Fallback if auth check fails
                    window.location.href = '/home/';
                });
        } else {
            alert("Please enter your name and select a valid preference.");
        }
    });
}