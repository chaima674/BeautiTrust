document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".nav-links a");
    let glowTimeout = null;

    const userAnswers = {};

    // ===== CART & WISHLIST =====
    let cart = [];
    let wishlist = [];
    
    // ===== LOAD CART & WISHLIST FROM DATABASE =====
    function loadUserCart() {
        fetch('/api/get-user-cart/')
            .then(res => res.json())
            .then(data => {
                cart.length = 0;
                if (data.cart && data.cart.length > 0) {
                    data.cart.forEach(item => {
                        cart.push(item);
                    });
                }
                updateCartBadge();
                console.log("Cart loaded from database:", cart.length, "items");
            })
            .catch(err => console.log("Error loading cart:", err));
    }

    function loadUserWishlist() {
        fetch('/api/get-user-wishlist/')
            .then(res => res.json())
            .then(data => {
                wishlist.length = 0;
                if (data.wishlist && data.wishlist.length > 0) {
                    data.wishlist.forEach(item => {
                        wishlist.push(item);
                    });
                }
                console.log("Wishlist loaded from database:", wishlist.length, "items");
            })
            .catch(err => console.log("Error loading wishlist:", err));
    }
    
    // Show number on cart icon
    function updateCartBadge() {
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (!cartIcon) return;
        
        const oldBadge = document.querySelector('.cart-badge');
        if (oldBadge) oldBadge.remove();
        
        if (cart.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = cart.length;
            badge.style.cssText = 'position: absolute; top: -8px; right: -8px; background: #EF78C4; color: white; border-radius: 50%; padding: 2px 6px; font-size: 11px; font-weight: bold;';
            
            const parent = cartIcon.parentElement;
            if (parent) {
                parent.style.position = 'relative';
                parent.appendChild(badge);
            }
        }
    }
    
    // Check if user is logged in and load data
    function checkAuthAndLoad() {
        fetch('/api/check-auth/')
            .then(res => res.json())
            .then(data => {
                if (data.is_authenticated) {
                    loadUserCart();
                    loadUserWishlist();
                }
            });
    }
    
    // Initial load
    checkAuthAndLoad();

    // ===== GLOBAL DATA =====
    let globalBeautySpots = [];
    let globalProducts = [];

    // Load data from API
    Promise.all([
        fetch('/api/spots/').then(r => r.json()),
        fetch('/api/products/').then(r => r.json())
    ]).then(([spots, prods]) => {
        globalBeautySpots = spots;
        globalProducts = prods;
        window.beautySpotsData = spots;
        window.productsData = prods;
        window.beautySpots = spots;
        window.products = prods;
        console.log('Data loaded:', spots.length, 'spots,', prods.length, 'products');
    });

    // ===== USER PREFERENCE =====
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
        
        return spots.filter(spot => {
            if (spot.services && spot.services.length) {
                return spot.services.some(service => 
                    keywords.some(keyword => service.toLowerCase().includes(keyword.toLowerCase()))
                );
            }
            return false;
        });
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
        
        return filtered;
    }

    // ===== Commission Logic =====
    let platformEarnings = 0;
    const COMMISSION_RATE = 0.05;

    // ===== Store original content =====
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

                // ===== Beauty Spots =====
                if (target === "beauty-spots") {
                    fetch('/api/spots/')
                        .then(response => response.json())
                        .then(spotsData => {
                            globalBeautySpots = spotsData;
                            window.beautySpots = spotsData;
                            let spotsToShow = filterBeautySpotsByPreference(spotsData);
                            spotsToShow.forEach(spot => {
                                container.innerHTML += `
                                    <div class="card" data-spot-id="${spot.id}" style="cursor: pointer;">
                                        <img src="${spot.image_url}">
                                        <h3>${spot.name}</h3>
                                        <p>${spot.description}</p>
                                        <div class="card-buttons">
                                            <button class="cart-btn" data-type="spot" data-id="${spot.id}" style="background:#EF78C4; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">🛒</button>
                                            <button class="wishlist-btn" data-type="spot" data-id="${spot.id}" style="background:#AD2555; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">❤️</button>
                                        </div>
                                    </div>
                                `;
                            });
                            addFinishedButton(container, target);
                            
                            document.querySelectorAll('.cart-btn').forEach(btn => {
                                btn.onclick = (e) => {
                                    e.stopPropagation();
                                    addToCart(btn.dataset.type, parseInt(btn.dataset.id));
                                };
                            });
                            document.querySelectorAll('.wishlist-btn').forEach(btn => {
                                btn.onclick = (e) => {
                                    e.stopPropagation();
                                    addToWishlist(btn.dataset.type, parseInt(btn.dataset.id));
                                };
                            });
                            
                            document.querySelectorAll('.card[data-spot-id]').forEach(card => {
                                card.onclick = (e) => {
                                    if (e.target.tagName !== 'BUTTON') {
                                        const spotId = card.dataset.spotId;
                                        if (spotId) window.location.href = `/spot/${spotId}/`;
                                    }
                                };
                            });
                        });
                }

                // ===== Products =====
                if (target === "products") {
                    fetch('/api/products/')
                        .then(response => response.json())
                        .then(productsData => {
                            globalProducts = productsData;
                            window.products = productsData;
                            let productsToShow = filterProductsByPreference(productsData);
                            
                            if (productsToShow.length === 0) {
                                container.innerHTML += `
                                    <div style="text-align: center; padding: 40px; background: white; border-radius: 15px; margin: 20px 0;">
                                        <p style="font-size: 18px; color: #AD2555;">😊 No products available for "${userPreference}" yet.</p>
                                        <p style="color: #666;">Please check back soon or try a different preference!</p>
                                    </div>
                                `;
                            } else {
                                productsToShow.forEach(product => {
                                    container.innerHTML += `
                                        <div class="card" data-product-id="${product.id}" style="cursor: pointer;">
                                            <img src="${product.image_url}">
                                            <h3>${product.name}</h3>
                                            <p>${product.description}</p>
                                            <p>💰 ${product.price} DT</p>
                                            <div class="card-buttons">
                                                <button class="cart-btn" data-type="product" data-id="${product.id}" style="background:#EF78C4; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">🛒</button>
                                                <button class="wishlist-btn" data-type="product" data-id="${product.id}" style="background:#AD2555; color:white; border:none; padding:8px 12px; border-radius:5px; cursor:pointer;">❤️</button>
                                            </div>
                                        </div>
                                    `;
                                });
                            }
                            
                            addFinishedButton(container, target);
                            
                            document.querySelectorAll('.cart-btn').forEach(btn => {
                                btn.onclick = (e) => {
                                    e.stopPropagation();
                                    addToCart(btn.dataset.type, parseInt(btn.dataset.id));
                                };
                            });
                            document.querySelectorAll('.wishlist-btn').forEach(btn => {
                                btn.onclick = (e) => {
                                    e.stopPropagation();
                                    addToWishlist(btn.dataset.type, parseInt(btn.dataset.id));
                                };
                            });
                            
                            document.querySelectorAll('.card[data-product-id]').forEach(card => {
                                card.onclick = (e) => {
                                    if (e.target.tagName !== 'BUTTON') {
                                        const productId = card.dataset.productId;
                                        if (productId) window.location.href = `/product/${productId}/`;
                                    }
                                };
                            });
                        });
                }

                // ===== Personalized Advice (FIXED: saves answers to backend) =====
                if (target === "personalized-advice") {
                    let currentAdviceIndex = 0;
                    // Clear previous answers
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

                    // Define questions (used for display and for saving)
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

                    // NEW: Function to save answers to backend (only if logged in)
                    function saveAnswersToBackend() {
                        fetch('/api/check-auth/')
                            .then(res => res.json())
                            .then(auth => {
                                if (auth.is_authenticated) {
                                    // Loop through all answered questions
                                    for (let i = 1; i <= adviceQuestions.length; i++) {
                                        const answer = userAnswers[i];
                                        if (answer) {
                                            const questionText = adviceQuestions[i-1].question;
                                            fetch('/api/save-advice-response/', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    question_text: questionText,
                                                    answer_text: answer
                                                })
                                            }).catch(err => console.error("Error saving advice:", err));
                                        }
                                    }
                                    console.log("Advice answers saved to database.");
                                }
                            });
                    }

                    function showFinalRecommendation() {
                        // First save answers to backend (if logged in)
                        saveAnswersToBackend();

                        liveAdviceEl.innerHTML = `<h4>Your Personalized Recommendations ✨</h4>`;
                        
                        let recommendedSpots = [];
                        let recommendedProducts = [];
                        
                        const relaxationNeed = userAnswers[3];
                        const budget = userAnswers[4];
                        const skinType = userAnswers[1];
                        const hairCondition = userAnswers[2];
                        
                        if (relaxationNeed === 'Massage') {
                            recommendedSpots = beautySpots.filter(spot => 
                                spot.services && spot.services.some(s => s.toLowerCase().includes('massage'))
                            );
                        } else if (relaxationNeed === 'New Hair Look') {
                            recommendedSpots = beautySpots.filter(spot => 
                                spot.services && spot.services.some(s => s.toLowerCase().includes('haircut') || s.toLowerCase().includes('hair styling') || s.toLowerCase().includes('hair coloring'))
                            );
                        } else if (relaxationNeed === 'Glow Up') {
                            recommendedSpots = beautySpots.filter(spot => 
                                spot.services && spot.services.some(s => s.toLowerCase().includes('facial') || s.toLowerCase().includes('makeup') || s.toLowerCase().includes('skincare'))
                            );
                        } else if (relaxationNeed === 'Face Treatment') {
                            recommendedSpots = beautySpots.filter(spot => 
                                spot.services && spot.services.some(s => s.toLowerCase().includes('facial'))
                            );
                        }
                        
                        if (recommendedSpots.length === 0) {
                            recommendedSpots = [...beautySpots].sort((a, b) => b.rating - a.rating).slice(0, 3);
                        } else {
                            recommendedSpots = recommendedSpots.slice(0, 3);
                        }
                        
                        let filteredByBudget = [...products];
                        if (budget === 'Low') {
                            filteredByBudget = products.filter(p => p.price <= 30);
                        } else if (budget === 'Medium') {
                            filteredByBudget = products.filter(p => p.price > 30 && p.price <= 80);
                        } else if (budget === 'High') {
                            filteredByBudget = products.filter(p => p.price > 80);
                        }
                        
                        if (skinType && filteredByBudget.length > 0) {
                            recommendedProducts = filteredByBudget.filter(p => 
                                p.category && p.category.toLowerCase().includes('skincare')
                            );
                        } else if (hairCondition && filteredByBudget.length > 0) {
                            recommendedProducts = filteredByBudget.filter(p => 
                                p.category && p.category.toLowerCase().includes('haircare')
                            );
                        }
                        
                        if (recommendedProducts.length === 0) {
                            recommendedProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
                        } else {
                            recommendedProducts = recommendedProducts.slice(0, 3);
                        }
                        
                        if (recommendedSpots.length > 0) {
                            liveAdviceEl.innerHTML += '<h5 style="margin-top: 20px;">🌟 Recommended Beauty Spots:</h5>';
                            recommendedSpots.forEach(spot => {
                                liveAdviceEl.innerHTML += `
                                    <div class="card" style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                                        <img src="${spot.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
                                        <h4 style="margin: 10px 0;">${spot.name}</h4>
                                        <p style="margin: 5px 0;">${spot.description ? spot.description.substring(0, 100) : ''}...</p>
                                    </div>
                                `;
                            });
                        }
                        
                        if (recommendedProducts.length > 0) {
                            liveAdviceEl.innerHTML += '<h5 style="margin-top: 20px;">🛍️ Recommended Products:</h5>';
                            recommendedProducts.forEach(product => {
                                liveAdviceEl.innerHTML += `
                                    <div class="card" style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                                        <img src="${product.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;">
                                        <h4 style="margin: 10px 0;">${product.name}</h4>
                                        <p style="margin: 5px 0;">${product.description ? product.description.substring(0, 100) : ''}...</p>
                                        <p style="margin: 5px 0;">💰 ${product.price} DT</p>
                                    </div>
                                `;
                            });
                        }
                        
                        liveAdviceEl.innerHTML += `<button onclick="restartAdvice()" style="margin-top: 20px; padding: 10px 20px; background: #EF78C4; color: white; border: none; border-radius: 8px; cursor: pointer;">🔄 Get New Advice</button>`;
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

    // ===== CHECK AUTHENTICATION FOR ADVICE BUTTON =====
    function checkAuthAndShowAdvice() {
        fetch('/api/check-auth/')
            .then(res => res.json())
            .then(data => {
                if (data.is_authenticated) {
                    // Trigger the existing advice section
                    const adviceBtn = document.querySelector('[data-target="personalized-advice"]');
                    if (adviceBtn) {
                        adviceBtn.click();
                    } else {
                        activateSection('personalized-advice');
                    }
                } else {
                    alert("Please login to receive personalized advice.");
                    window.location.href = '/login/';
                }
            })
            .catch(err => console.error("Auth check failed:", err));
    }

    // ===== ADD TO CART FUNCTION =====
    window.addToCart = function (type, id) {
        console.log("addToCart called:", type, id);
        
        fetch('/api/check-auth/')
            .then(res => res.json())
            .then(auth => {
                if (!auth.is_authenticated) {
                    alert("Please login to add items to cart!");
                    window.location.href = '/login/';
                    return;
                }
                
                fetch('/api/add-to-cart/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item_type: type, item_id: id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("✅ Added to cart!");
                        loadUserCart();
                    } else {
                        alert("Error: " + data.error);
                    }
                });
            });
    };

    // ===== ADD TO WISHLIST FUNCTION =====
    window.addToWishlist = function (type, id) {
        console.log("addToWishlist called:", type, id);
        
        fetch('/api/check-auth/')
            .then(res => res.json())
            .then(auth => {
                if (!auth.is_authenticated) {
                    alert("Please login to add to wishlist!");
                    window.location.href = '/login/';
                    return;
                }
                
                fetch('/api/add-to-wishlist/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item_type: type, item_id: id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert("❤️ Added to wishlist!");
                        loadUserWishlist();
                    } else {
                        alert("Error: " + data.error);
                    }
                });
            });
    };

    window.submitWish = function () {
        const input = document.getElementById("wishInput");
        if (input.value.trim()) {
            fetch('/api/check-auth/')
                .then(res => res.json())
                .then(auth => {
                    if (!auth.is_authenticated) {
                        alert("Please login to submit feedback!");
                        window.location.href = '/login/';
                        return;
                    }
                    
                    fetch('/api/add-feedback/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: input.value })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            alert("Thank you for your feedback!");
                            input.value = "";
                        } else {
                            alert("Error: " + data.error);
                        }
                    });
                });
        } else {
            alert("Please write something");
        }
    };

    // ===== SEARCH =====
    document.querySelector(".fa-magnifying-glass").onclick = () => {
        const term = prompt("Enter search term:");
        if (!term) return;
        Promise.all([
            fetch('/api/spots/').then(r => r.json()),
            fetch('/api/products/').then(r => r.json())
        ]).then(([spots, prods]) => {
            const results = [...spots, ...prods].filter(i => i.name.toLowerCase().includes(term.toLowerCase()));
            openModal("Search Results", results.length ? results.map(i => `<p>✔ ${i.name}</p>`).join("") : "<p>No results found.</p>");
        });
    };

    // ===== VIEW WISHLIST =====
    document.querySelector(".fa-heart").onclick = () => {
        if (wishlist.length === 0) {
            openModal("Wishlist", "<p>Your wishlist is empty.</p>");
        } else {
            let html = wishlist.map(item => `<p>❤️ ${item.name}</p>`).join('');
            openModal("Wishlist", html);
        }
    };

    // ===== VIEW CART (UPDATED with transaction creation) =====
    document.querySelector(".fa-shopping-cart").onclick = () => {
        if (cart.length === 0) {
            openModal("Cart", "<p>Your cart is empty.</p>");
            return;
        }
        
        let html = cart.map((item, index) => {
            const isProduct = item.price !== undefined && item.price !== null;
            const displayPrice = isProduct ? `${item.price} DT` : 'Pay at salon';
            const buttonText = isProduct ? 'Buy Now' : 'Confirm Booking';
            
            return `
                <div class="cart-item" style="margin-bottom:10px; padding:10px; border:1px solid #ddd; border-radius:5px;">
                    <p><strong>${item.name}</strong> - ${displayPrice}</p>
                    <button class="remove-from-cart" data-cart-id="${item.cart_item_id}" data-index="${index}" style="margin-top:8px; padding:5px 10px; background:#ff4444; color:white; border:none; border-radius:5px; cursor:pointer;">Remove</button>
                    <button class="checkout-btn" data-cart-id="${item.cart_item_id}" data-index="${index}" data-type="${isProduct ? 'product' : 'spot'}" style="margin-top:8px; margin-left:5px; padding:5px 10px; background:#EF78C4; color:white; border:none; border-radius:5px; cursor:pointer;">${buttonText}</button>
                </div>
            `;
        }).join("");
        
        openModal("Cart", html);
        
        // Remove from cart buttons
        document.querySelectorAll(".remove-from-cart").forEach(btn => {
            btn.onclick = () => {
                const cartItemId = btn.dataset.cartId;
                const index = parseInt(btn.dataset.index);
                
                fetch('/api/remove-cart-item/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart_item_id: cartItemId })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        cart.splice(index, 1);
                        modal.style.display = "none";
                        alert("Item removed from cart");
                        updateCartBadge();
                    } else {
                        alert("Error: " + data.error);
                    }
                })
                .catch(err => alert("Error: " + err));
            };
        });
        
        // Checkout buttons (Buy Now / Confirm Booking) with transaction creation
        document.querySelectorAll(".checkout-btn").forEach(btn => {
            btn.onclick = async () => {
                const authResponse = await fetch('/api/check-auth/');
                const authData = await authResponse.json();
                
                if (!authData.is_authenticated) {
                    alert("Please login first!");
                    window.location.href = '/login/';
                    return;
                }
                
                const cartItemId = btn.dataset.cartId;
                const index = parseInt(btn.dataset.index);
                const item = cart[index];
                const isProduct = btn.dataset.type === 'product';
                
                // 1. Create transaction record
                const transactionRes = await fetch('/api/create-transaction/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        item_type: isProduct ? 'product' : 'spot',
                        item_id: item.id,
                        price: item.price || 50
                    })
                });
                const transactionData = await transactionRes.json();
                
                if (!transactionData.success) {
                    alert("Transaction failed: " + transactionData.error);
                    return;
                }
                
                // 2. Remove cart item from database
                fetch('/api/remove-cart-item/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cart_item_id: cartItemId })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        cart.splice(index, 1);
                        updateCartBadge();
                        modal.style.display = "none";
                        
                        if (isProduct) {
                            alert(`🛍️ Purchase completed for ${item.name} - ${item.price} DT`);
                        } else {
                            platformEarnings += (item.price || 0) * COMMISSION_RATE;
                            alert(`✅ Booking confirmed for ${item.name}! You will pay at the salon.`);
                        }
                    } else {
                        alert("Error removing cart item: " + data.error);
                    }
                })
                .catch(err => alert("Error: " + err));
            };
        });
    };

    attachSectionButtons();

});