// Preference form submission
const prefForm = document.querySelector('.preference-form');

if (prefForm) {
    prefForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const preference = this.querySelector('select').value;

        if (name && preference && preference !== 'Choose Your Preferences') {
            // FIRST: Save to localStorage with correct keys
            localStorage.setItem('prefName', name);
            localStorage.setItem('prefChoice', preference);
            
            console.log('Saved to localStorage:', name, preference);
            
            // Check if user is logged in
            fetch('/api/check-auth/')
                .then(response => response.json())
                .then(authData => {
                    if (!authData.is_authenticated) {
                        // Not logged in - redirect to login with preference in URL
                        window.location.href = `/login/?pref=${encodeURIComponent(preference)}&name=${encodeURIComponent(name)}`;
                        return;
                    }
                    
                    // Logged in - save to session via API
                    fetch('/api/save-preference/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: name, preference: preference })
                    }).then(() => {
                        alert(`Thank you, ${name}! Your preferences for "${preference}" are saved.`);
                        this.reset();
                        window.location.href = '/home/';
                    });
                });
        } else {
            alert("Please fill out your name and choose a preference.");
        }
    });
}