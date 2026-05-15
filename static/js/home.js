document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".nav-links a");
    let glowTimeout = null;

    const cart = [];
    const wishlist = [];
    const userAnswers = {};

    // ===== USER PREFERENCE FOR FILTERING =====
    const userPreference = localStorage.getItem('prefChoice');
    
    function filterBeautySpotsByPreference(spots) {
        if (!userPreference) return spots;
        
        const keywordMap = {
            'Hair': ['Haircut', 'Hair Coloring', 'Hair Styling', 'Hair'],
            'Skin': ['Facial', 'Skin', 'Massage', 'Wellness', 'Body Scrub', 'Relaxation'],
            'Nails': ['Manicure', 'Pedicure', 'Nail Art', 'Gel Polish', 'Nail'],
            'Makeup': ['Makeup', 'Beauty']
        };
        
        const keywords = keywordMap[userPreference] || [];
        if (keywords.length === 0) return spots;
        
        const filtered = spots.filter(spot => {
            if (spot.services && spot.services.length) {
                return spot.services.some(service => 
                    keywords.some(keyword => service.toLowerCase().includes(keyword.toLowerCase()))
                );
            }
            return false;
        });
        
        return filtered.length > 0 ? filtered : spots;
    }
    
    function filterProductsByPreference(prods) {
        if (!userPreference) return prods;
        
        const categoryMap = {
            'Hair': 'Haircare',
            'Skin': 'Skincare',
            'Nails': 'Nails',
            'Makeup': 'Makeup'
        };
        
        const targetCategory = categoryMap[userPreference];
        if (!targetCategory) return prods;
        
        const filtered = prods.filter(product => 
            product.category && product.category.toLowerCase() === targetCategory.toLowerCase()
        );
        
        return filtered.length > 0 ? filtered : prods;
    }

    // ===== Commission Logic =====
    let platformEarnings = 0;
    const COMMISSION_RATE = 0.05;

    // ===== Store original content for Close button =====
    const originalContent = {};
    sections.forEach(section => {
        originalContent[section.id] = section.innerHTML;
    });

    // ===== Modal =====
    const modal = document.getElementById("modal");
    const modalBody = modal?.querySelector(".modal-body");
    const modalClose = modal?.querySelector(".modal-close");

    function openModal(title, html) {
        if (!modal) return;
        modalBody.innerHTML = `<h3>${title}</h3>${html}`;
        modal.style.display = "block";
    }

    if (modalClose) {
        modalClose.onclick = () => modal.style.display = "none";
        window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
    }

    function activateSection(targetId) {
        if (glowTimeout) clearTimeout(glowTimeout);
        sections.forEach(section => section.classList.remove("active"));

        const target = document.getElementById(targetId);
        if (!target) return;

        const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
        const targetTop = target.offsetTop - navbarHeight - 10;

        window.scrollTo({ top: targetTop, behavior: "smooth" });
        target.classList.add("active");

        glowTimeout = setTimeout(() => target.classList.remove("active"), 3000);
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            activateSection(link.getAttribute("href").substring(1));
        });
    });

    function addFinishedButton(container, sectionId) {
        const btn = document.createElement("button");
        btn.className = "close-btn";
        btn.textContent = "Close";

        btn.addEventListener("click", () => {
            if (originalContent[sectionId]) {
                container.innerHTML = originalContent[sectionId];
            }
            attachSectionButtons();
        });

        container.appendChild(btn);
    }

    function attachSectionButtons() {
        document.querySelectorAll(".content-text button").forEach(button => {
            button.onclick = () => {
                const target = button.dataset.target;
                activateSection(target);

                const container = document.getElementById(target);
                if (!container) return;

                container.innerHTML = "";

                // ===== Beauty Spots (WITH FILTERING) =====
                if (target === "beauty-spots") {
                    let spotsToShow = filterBeautySpotsByPreference(beautySpots);
                    console.log('Showing', spotsToShow.length, 'spots out of', beautySpots.length);
                    spotsToShow.forEach(spot => {
                        container.innerHTML += `
                            <div class="card">
                                <img src="${spot.image}">
                                <h3>${spot.name}</h3>
                                <p>${spot.description}</p>
                                <p>⭐ ${spot.rating}</p>
                                <p>${spot.services.join(", ")}</p>
                                <button onclick="addToCart('spot', ${spot.id})">🛒</button>
                                <button onclick="addToWishlist('spot', ${spot.id})">❤️</button>
                            </div>
                        `;
                    });
                    addFinishedButton(container, target);
                }

                // ===== Products (WITH FILTERING) =====
                if (target === "products") {
                    let productsToShow = filterProductsByPreference(products);
                    console.log('Showing', productsToShow.length, 'products out of', products.length);
                    productsToShow.forEach(prod => {
                        container.innerHTML += `
                            <div class="card">
                                <img src="${prod.image}">
                                <h3>${prod.name}</h3>
                                <p>${prod.description}</p>
                                <p>${prod.price} DT</p>
                                <button onclick="addToCart('product', ${prod.id})">🛒</button>
                                <button onclick="addToWishlist('product', ${prod.id})">❤️</button>
                            </div>
                        `;
                    });
                    addFinishedButton(container, target);
                }

                // ===== Personalized Advice =====
                if (target === "personalized-advice") {
                    currentAdviceIndex = 0;
                    Object.keys(userAnswers).forEach(k => delete userAnswers[k]);

                    container.innerHTML = `
                        <div id="advice-container"></div>
                        <div id="advice-question"></div>
                        <div id="advice-options"></div>
                        <div id="live-advice" style="margin-top:20px;"></div>
                    `;

                    const questionEl = document.getElementById("advice-question");
                    const optionsEl = document.getElementById("advice-options");
                    const liveAdviceEl = document.getElementById("live-advice");

                    const adviceQuestions = [
                        { id: 1, question: "What's your skin type?", options: ["Dry", "Oily", "Normal", "Mixed"] },
                        { id: 2, question: "Your hair condition?", options: ["Dry", "Damaged", "Curly", "Healthy"] },
                        { id: 3, question: "Relaxation needs?", options: ["Massage", "New Hair Look", "Glow Up", "Face Treatment"] },
                        { id: 4, question: "Budget?", options: ["Low", "Medium", "High"] }
                    ];

                    function showAdviceQuestion() {
                        if (currentAdviceIndex >= adviceQuestions.length) {
                            showFinalRecommendation();
                            return;
                        }
                        const q = adviceQuestions[currentAdviceIndex];
                        questionEl.innerHTML = `<h4>${q.question}</h4>`;
                        optionsEl.innerHTML = q.options.map(opt =>
                            `<button onclick="saveAnswer(${q.id}, '${opt}')">${opt}</button>`
                        ).join("");
                    }

                    window.saveAnswer = function (id, value) {
                        userAnswers[id] = value;
                        currentAdviceIndex++;
                        showAdviceQuestion();
                    };

                    function showFinalRecommendation() {
                        liveAdviceEl.innerHTML = `<h4>Your Personalized Recommendations ✨</h4>`;
                        liveAdviceEl.innerHTML += `<button onclick="restartAdvice()">Get New Advice</button>`;
                    }

                    window.restartAdvice = function () {
                        liveAdviceEl.innerHTML = "";
                        currentAdviceIndex = 0;
                        Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
                        showAdviceQuestion();
                    };

                    showAdviceQuestion();
                    addFinishedButton(container, target);
                }

                // ===== Feedback =====
                if (target === "feedback") {
                    container.innerHTML = `
                        <div class="feedback-form">
                            <textarea id="wishInput" placeholder="Write your wish..."></textarea>
                            <button onclick="submitWish()">Submit</button>
                        </div>
                    `;
                    addFinishedButton(container, target);
                }
            };
        });
    }

    window.addToCart = function (type, id) {
        const item = type === "spot" ? beautySpots.find(s => s.id === id) : products.find(p => p.id === id);
        if (!cart.includes(item)) cart.push(item);
        alert("Added to cart");
    };

    window.addToWishlist = function (type, id) {
        const item = type === "spot" ? beautySpots.find(s => s.id === id) : products.find(p => p.id === id);
        if (!wishlist.includes(item)) wishlist.push(item);
        alert("Added to wishlist");
    };

    window.submitWish = function () {
        const input = document.getElementById("wishInput");
        if (input.value.trim()) {
            wishlist.push({ name: input.value });
            alert("Wish submitted!");
            input.value = "";
        }
    };

    document.querySelector(".fa-magnifying-glass").onclick = () => {
        const term = prompt("Enter search term:");
        if (!term) return;
        const results = [...beautySpots, ...products].filter(i => i.name.toLowerCase().includes(term.toLowerCase()));
        openModal("Search Results", results.length ? results.map(i => `<p>✔ ${i.name}</p>`).join("") : "<p>No results found.</p>");
    };

    document.querySelector(".fa-heart").onclick = () => {
        openModal("Wishlist", wishlist.length ? wishlist.map(i => `<p>✔ ${i.name}</p>`).join("") : "<p>Your wishlist is empty.</p>");
    };

    document.querySelector(".fa-shopping-cart").onclick = () => {
        if (!cart.length) {
            openModal("Cart", "<p>Your cart is empty.</p>");
            return;
        }
        let html = cart.map((item, index) => `
            <div class="cart-item" style="margin-bottom:10px;">
                <p>✔ ${item.name} - ${item.price || 50} DT</p>
                <button class="confirm-item-btn" data-index="${index}">Confirm Booking</button>
            </div>
        `).join("");
        openModal("Cart", html);

        document.querySelectorAll(".confirm-item-btn").forEach(btn => {
            btn.onclick = async () => {
                // Check if user is logged in
                const authResponse = await fetch('/api/check-auth/');
                const authData = await authResponse.json();
                
                if (!authData.is_authenticated) {
                    alert("Please login first to confirm booking!");
                    window.location.href = '/login/';
                    return;
                }
                
                const index = btn.dataset.index;
                const item = cart[index];
                platformEarnings += (item.price || 50) * COMMISSION_RATE;
                cart.splice(index, 1);
                alert(`Booking confirmed for ${item.name}!`);
                modal.style.display = "none";
                console.log("Platform commission earned:", platformEarnings.toFixed(2), "DT");
            };
        });
    };

    attachSectionButtons();

});