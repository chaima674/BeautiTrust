// Preference form submission
const prefForm = document.querySelector('.preference-form');

if (prefForm) {
    prefForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const preference = this.querySelector('select').value;

        if (name && preference) {
            // Save preferences in localStorage
            localStorage.setItem('prefName', name);
            localStorage.setItem('prefChoice', preference);

            // Show alert
            alert(`Thank you, ${name}! Your preferences for "${preference}" are saved.`);

            // Reset form
            this.reset();

            // redirect to Home page 
            window.location.href = '/home/';
        } else {
            alert("Please fill out your name and choose a preference.");
        }
    });
}