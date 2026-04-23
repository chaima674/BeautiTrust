document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".section:not(#home)");

    if (!sections.length) return; 

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            } else {
                entry.target.classList.remove("show");
            }

        });

    }, {
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));

});