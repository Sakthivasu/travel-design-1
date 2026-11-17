
/* =========================================================
   VELMORA HOTELS & RESORTS
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       1. PRELOADER - CIRCULAR 0% TO 100%
       ===================================================== */

    const preloader = document.getElementById("preloader");
    const preloaderPercent = document.getElementById("preloader-percent");
    const preloaderProgress = document.getElementById("preloader-progress");
    const preloaderText = document.getElementById("preloader-text");

    let loadingProgress = 0;
    let preloaderInterval = null;
    const preloaderStartedAt = Date.now();

    const loadingMessages = [
        "Preparing Your Experience",
        "Discovering Luxury",
        "Creating Comfort",
        "Almost Ready"
    ];

    function updatePreloader() {
        if (!preloader) return;

        loadingProgress += Math.floor(Math.random() * 5) + 2;

        if (loadingProgress > 100) {
            loadingProgress = 100;
        }

        if (preloaderPercent) {
            preloaderPercent.textContent = `${loadingProgress}%`;
        }

        if (preloaderProgress) {
            preloaderProgress.style.width = `${loadingProgress}%`;
        }

        if (preloaderText) {
            if (loadingProgress < 30) {
                preloaderText.textContent = loadingMessages[0];
            } else if (loadingProgress < 55) {
                preloaderText.textContent = loadingMessages[1];
            } else if (loadingProgress < 85) {
                preloaderText.textContent = loadingMessages[2];
            } else {
                preloaderText.textContent = loadingMessages[3];
            }
        }

        if (loadingProgress >= 100) clearInterval(preloaderInterval);
    }

    if (preloader) {
        document.body.classList.add("loading-active");
        preloaderInterval = setInterval(updatePreloader, 65);

        const finishPreloader = () => {
            const elapsed = Date.now() - preloaderStartedAt;
            const delay = Math.max(0, 650 - elapsed);
            loadingProgress = 100;
            if (preloaderPercent) preloaderPercent.textContent = "100%";
            if (preloaderProgress) preloaderProgress.style.width = "100%";
            if (preloaderText) preloaderText.textContent = "Your stay begins now";
            clearInterval(preloaderInterval);
            window.setTimeout(() => {
                preloader.classList.add("loaded");
                document.body.classList.remove("loading-active");
                window.setTimeout(() => preloader.remove(), 750);
            }, delay);
        };

        if (document.readyState === "complete") {
            finishPreloader();
        } else {
            window.addEventListener("load", finishPreloader, { once: true });
        }
    }


    /* =====================================================
       2. AOS ANIMATION INITIALIZATION
       ===================================================== */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 850,
            once: true,
            offset: 80,
            easing: "ease-out-cubic",
            mirror: false
        });
    }


    /* =====================================================
       3. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    function closeMobileMenu() {
        if (!menuToggle || !navMenu) return;

        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            document.body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", event => {
            if (
                navMenu.classList.contains("active") &&
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 991) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================================
       4. ACTIVE NAVIGATION LINK
       ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    document.querySelectorAll("#nav-menu a").forEach(link => {
        const linkPage = link.getAttribute("href");

        if (!linkPage) return;

        const normalizedLink = linkPage.split("?")[0].toLowerCase();

        if (
            normalizedLink === currentPage ||
            (currentPage === "" && normalizedLink === "index.html")
        ) {
            link.classList.add("active");
        }
    });


    /* =====================================================
       5. HEADER SCROLL EFFECT
       ===================================================== */

    const header = document.querySelector(".site-header, header");

    function handleHeaderScroll() {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleHeaderScroll, {
        passive: true
    });

    handleHeaderScroll();


    /* =====================================================
       6. BACK TO TOP BUTTON
       ===================================================== */

    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("show", window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* =====================================================
       7. TOAST NOTIFICATION
       ===================================================== */

    const toastContainer = document.getElementById("toast-container");
    const toastText = document.getElementById("toast-text");
    let toastTimer;

    function showToast(message, type = "success") {
        if (toastText) {
            toastText.textContent = message;
        }

        if (toastContainer) {
            toastContainer.className = `toast-container show ${type}`;

            clearTimeout(toastTimer);

            toastTimer = setTimeout(() => {
                toastContainer.classList.remove("show");
            }, 3500);
        } else {
            alert(message);
        }
    }

    window.showToast = showToast;


    /* =====================================================
       8. FOOTER CURRENT YEAR
       ===================================================== */

    const yearElements = document.querySelectorAll(
        "#current-year, .current-year"
    );

    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });


    /* =====================================================
       9. ROOM FILTERS
       ===================================================== */

    const roomFilterButtons = document.querySelectorAll(".room-filter-btn");
    const roomCards = document.querySelectorAll(".room-card");
    const roomsCount = document.querySelector(".rooms-count");

    function updateRoomCount(visibleCount) {
        if (!roomsCount) return;

        roomsCount.textContent = `${visibleCount} Rooms Available`;
    }

    if (roomFilterButtons.length && roomCards.length) {
        roomFilterButtons.forEach(button => {
            button.addEventListener("click", () => {
                const selectedFilter = button.dataset.filter || "all";
                let visibleCount = 0;

                roomFilterButtons.forEach(filterButton => {
                    filterButton.classList.remove("active");
                });

                button.classList.add("active");

                roomCards.forEach(card => {
                    const category = card.dataset.category || "";
                    const shouldShow =
                        selectedFilter === "all" ||
                        category === selectedFilter;

                    card.style.display = shouldShow ? "" : "none";

                    if (shouldShow) {
                        visibleCount++;
                    }
                });

                updateRoomCount(visibleCount);

                if (typeof AOS !== "undefined") {
                    AOS.refresh();
                }
            });
        });
    }


    /* =====================================================
       10. ROOM WISHLIST
       ===================================================== */

    document.querySelectorAll(".room-wishlist-btn").forEach(button => {
        button.addEventListener("click", () => {
            const isSaved = button.classList.toggle("saved");

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-solid", isSaved);
                icon.classList.toggle("fa-regular", !isSaved);
            }

            showToast(
                isSaved
                    ? "Room added to your wishlist."
                    : "Room removed from your wishlist."
            );
        });
    });


    /* =====================================================
       11. OFFER SAVE BUTTONS
       ===================================================== */

    document.querySelectorAll(".offer-save-btn").forEach(button => {
        button.addEventListener("click", () => {
            const isSaved = button.classList.toggle("saved");

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-solid", isSaved);
                icon.classList.toggle("fa-regular", !isSaved);
            }

            showToast(
                isSaved
                    ? "Offer saved successfully."
                    : "Offer removed from saved list."
            );
        });
    });


    /* =====================================================
       12. HOME BOOKING SEARCH
       ===================================================== */

    const homeBookingForm = document.getElementById("home-booking-form");

    if (homeBookingForm) {
        const checkin = document.getElementById("home-checkin");
        const checkout = document.getElementById("home-checkout");
        const guests = document.getElementById("home-guests");

        const today = new Date().toISOString().split("T")[0];

        if (checkin) {
            checkin.min = today;

            checkin.addEventListener("change", () => {
                if (!checkout) return;

                checkout.min = checkin.value;

                if (
                    checkout.value &&
                    checkout.value <= checkin.value
                ) {
                    checkout.value = "";
                }
            });
        }

        if (checkout) {
            checkout.min = today;
        }

        homeBookingForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!checkin || !checkout || !guests) {
                showToast("Please complete all booking details.", "error");
                return;
            }

            if (!checkin.value || !checkout.value) {
                showToast("Please select your check-in and check-out dates.", "error");
                return;
            }

            if (new Date(checkout.value) <= new Date(checkin.value)) {
                showToast("Check-out date must be after check-in date.", "error");
                return;
            }

            const params = new URLSearchParams({
                checkin: checkin.value,
                checkout: checkout.value,
                guests: guests.value || "2"
            });

            window.location.href = `booking.html?${params.toString()}`;
        });
    }


    /* =====================================================
       13. NEWSLETTER FORM
       ===================================================== */

    const newsletterForm = document.getElementById("newsletter-form");

    if (newsletterForm) {
        newsletterForm.addEventListener("submit", event => {
            event.preventDefault();

            const emailInput = document.getElementById("newsletter-email");
            const message = document.getElementById("newsletter-message");

            if (!emailInput || !emailInput.value.trim()) {
                showToast("Please enter your email address.", "error");
                return;
            }

            if (!emailInput.checkValidity()) {
                showToast("Please enter a valid email address.", "error");
                return;
            }

            if (message) {
                message.textContent =
                    "Thank you for subscribing to VELMORA updates.";
            }

            newsletterForm.reset();

            showToast("Thank you for subscribing!");

        });
    }


    /* =====================================================
       14. VIDEO MODAL
       ===================================================== */

    const videoModal = document.getElementById("video-modal");
    const watchVideoButton = document.getElementById("watch-video-btn");
    const closeVideoButton = document.getElementById("video-modal-close");

    function openVideoModal() {
        if (!videoModal) return;

        videoModal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeVideoModal() {
        if (!videoModal) return;

        videoModal.classList.remove("active");
        document.body.classList.remove("modal-open");

        const iframe = videoModal.querySelector("iframe");

        if (iframe) {
            const currentSrc = iframe.src;
            iframe.src = "";
            iframe.src = currentSrc;
        }
    }

    if (watchVideoButton) {
        watchVideoButton.addEventListener("click", openVideoModal);
    }

    if (closeVideoButton) {
        closeVideoButton.addEventListener("click", closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener("click", event => {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });
    }


    /* =====================================================
       15. CONTACT FORM
       ===================================================== */

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("contact-name");
            const email = document.getElementById("contact-email");
            const phone = document.getElementById("contact-phone");
            const subject = document.getElementById("contact-subject");
            const message = document.getElementById("contact-message");
            const privacy = document.getElementById("contact-privacy");
            const status = document.getElementById("contact-form-status");

            if (!name || !email || !message) {
                showToast("Some form fields are missing.", "error");
                return;
            }

            if (
                !name.value.trim() ||
                !email.value.trim() ||
                !message.value.trim()
            ) {
                showToast("Please fill in all required fields.", "error");
                return;
            }

            if (!email.checkValidity()) {
                showToast("Please enter a valid email address.", "error");
                return;
            }

            if (privacy && !privacy.checked) {
                showToast("Please accept the privacy terms.", "error");
                return;
            }

            if (phone && phone.value.trim()) {
                const phoneDigits = phone.value.replace(/\D/g, "");

                if (phoneDigits.length < 7) {
                    showToast("Please enter a valid phone number.", "error");
                    return;
                }
            }

            const reference = "VEL-" + Math.floor(
                100000 + Math.random() * 900000
            );

            if (status) {
                status.textContent =
                    `Thank you, ${name.value.trim()}. Your enquiry reference is ${reference}.`;
                status.classList.add("success");
            }

            contactForm.reset();

            showToast("Your enquiry has been submitted successfully.");

            console.info("Demo contact enquiry:", {
                name: name.value,
                email: email.value,
                subject: subject ? subject.value : "",
                reference
            });
        });
    }


    /* =====================================================
       16. BOOKING PAGE - URL PARAMETERS
       ===================================================== */

    const bookingForm = document.getElementById("booking-form");

    if (bookingForm) {
        const params = new URLSearchParams(window.location.search);

        const roomSelect = document.getElementById("booking-room");
        const priceInput = document.getElementById("booking-price");
        const checkinInput = document.getElementById("booking-checkin");
        const checkoutInput = document.getElementById("booking-checkout");
        const guestsInput = document.getElementById("booking-guests");

        const today = new Date().toISOString().split("T")[0];

        if (checkinInput) {
            checkinInput.min = today;
        }

        if (checkoutInput) {
            checkoutInput.min = today;
        }

        if (roomSelect && params.has("room")) {
            const requestedRoom = params.get("room");

            const matchingOption = Array.from(roomSelect.options).find(option => {
                return (
                    option.value.toLowerCase() === requestedRoom.toLowerCase() ||
                    option.textContent.toLowerCase().includes(requestedRoom.toLowerCase())
                );
            });

            if (matchingOption) {
                roomSelect.value = matchingOption.value;
            }
        }

        if (checkinInput && params.has("checkin")) {
            checkinInput.value = params.get("checkin");
            checkoutInput && (checkoutInput.min = params.get("checkin"));
        }

        if (checkoutInput && params.has("checkout")) {
            checkoutInput.value = params.get("checkout");
        }

        if (guestsInput && params.has("guests")) {
            guestsInput.value = params.get("guests");
        }

        if (roomSelect && params.has("offer")) {
            const offer = params.get("offer");
            const offerField = document.getElementById("booking-offer");

            if (offerField) {
                offerField.value = offer;
            }
        }

        if (roomSelect && priceInput) {
            roomSelect.addEventListener("change", () => {
                updateBookingPrice();
            });
        }

        function updateBookingPrice() {
            if (!roomSelect || !priceInput) return;

            const selectedOption = roomSelect.options[roomSelect.selectedIndex];

            if (!selectedOption) return;

            const price =
                selectedOption.dataset.price ||
                selectedOption.getAttribute("data-price") ||
                "";

            priceInput.value = price;
            calculateBookingTotal();
        }

        function calculateBookingTotal() {
            const totalElement = document.getElementById("booking-total");

            if (!totalElement || !priceInput || !checkinInput || !checkoutInput) {
                return;
            }

            const price = Number(
                String(priceInput.value).replace(/[^\d.]/g, "")
            );

            const startDate = new Date(checkinInput.value);
            const endDate = new Date(checkoutInput.value);

            if (
                !Number.isFinite(price) ||
                !checkinInput.value ||
                !checkoutInput.value ||
                endDate <= startDate
            ) {
                totalElement.textContent = "₹0";
                return;
            }

            const nights = Math.ceil(
                (endDate - startDate) / (1000 * 60 * 60 * 24)
            );

            const total = price * nights;

            totalElement.textContent = `₹${total.toLocaleString("en-IN")}`;
        }

        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener("change", () => {
                checkoutInput.min = checkinInput.value;

                if (
                    checkoutInput.value &&
                    checkoutInput.value <= checkinInput.value
                ) {
                    checkoutInput.value = "";
                }

                calculateBookingTotal();
            });

            checkoutInput.addEventListener("change", calculateBookingTotal);
        }

        if (priceInput) {
            priceInput.addEventListener("input", calculateBookingTotal);
        }

        if (roomSelect) {
            updateBookingPrice();
        }

        calculateBookingTotal();


        /* Booking form submission */

        bookingForm.addEventListener("submit", event => {
            event.preventDefault();

            const name = document.getElementById("booking-name");
            const email = document.getElementById("booking-email");
            const phone = document.getElementById("booking-phone");
            const confirmation = document.getElementById("booking-confirmation");
            const confirmationReference = document.getElementById("booking-confirmation-reference");
            const confirmationName = document.getElementById("booking-confirmation-name");

            if (
                !name ||
                !email ||
                !phone ||
                !checkinInput ||
                !checkoutInput
            ) {
                showToast("Booking form fields are incomplete.", "error");
                return;
            }

            if (
                !name.value.trim() ||
                !email.value.trim() ||
                !phone.value.trim() ||
                !checkinInput.value ||
                !checkoutInput.value
            ) {
                showToast("Please complete all required booking details.", "error");
                return;
            }

            if (!email.checkValidity()) {
                showToast("Please enter a valid email address.", "error");
                return;
            }

            if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
                showToast("Check-out must be after check-in.", "error");
                return;
            }

            const bookingReference = "VEL" + Date.now()
                .toString()
                .slice(-8);

            if (confirmation) {
                if (confirmationReference) confirmationReference.textContent = bookingReference;
                if (confirmationName) confirmationName.textContent = name.value.trim();
                confirmation.setAttribute("aria-hidden", "false");
                confirmation.classList.add("active");
                document.body.classList.add("modal-open");
            }

            const bookingStatus = document.getElementById("booking-form-status");
            if (bookingStatus) {
                bookingStatus.textContent = "Booking Successfully Confirmed! Your reference is " + bookingReference + ".";
                bookingStatus.classList.add("success");
                bookingStatus.classList.remove("error");
            }

            console.info("Demo booking request:", {
                reference: bookingReference,
                guest: name.value.trim(),
                email: email.value,
                phone: phone.value
            });

            bookingForm.reset();

            if (priceInput) {
                priceInput.value = "";
            }

            calculateBookingTotal();
        });
    }

    /* Booking confirmation modal controls */
    const bookingConfirmation = document.getElementById("booking-confirmation");
    const bookingConfirmationClose = document.getElementById("booking-confirmation-close");
    const bookingConfirmationDone = document.getElementById("booking-confirmation-done");

    function closeBookingConfirmation() {
        if (!bookingConfirmation) return;
        bookingConfirmation.classList.remove("active");
        bookingConfirmation.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    if (bookingConfirmationClose) bookingConfirmationClose.addEventListener("click", closeBookingConfirmation);
    if (bookingConfirmationDone) bookingConfirmationDone.addEventListener("click", closeBookingConfirmation);
    if (bookingConfirmation) {
        bookingConfirmation.addEventListener("click", event => {
            if (event.target === bookingConfirmation || event.target.classList.contains("booking-confirmation-backdrop")) {
                closeBookingConfirmation();
            }
        });
    }


    /* =====================================================
       17. BOOKING PRICE DISPLAY HELPER
       ===================================================== */

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return entities[character];
        });
    }


    /* =====================================================
       18. SMOOTH SCROLL FOR INTERNAL LINKS
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });


    /* =====================================================
       19. IMAGE FALLBACK
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");
            image.style.opacity = "0.4";
            image.alt = "Image unavailable";
        });
    });


    /* =====================================================
       20. PREVENT EMPTY FORM SUBMISSION
       ===================================================== */

    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", event => {
            const submitButton = form.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

            if (submitButton && submitButton.dataset.processing === "true") {
                event.preventDefault();
            }
        });
    });


    /* =====================================================
       21. ESCAPE KEY - CLOSE OPEN ELEMENTS
       ===================================================== */

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;

        closeMobileMenu();
        closeVideoModal();
        closeBookingConfirmation();

        if (videoModal) {
            videoModal.classList.remove("active");
        }
    });


    /* =====================================================
       22. FINAL INITIALIZATION
       ===================================================== */

    document.body.classList.add("site-ready");

    console.log(
        "%c VELMORA HOTELS & RESORTS ",
        "background:#142B32;color:#D6B779;padding:10px;font-size:14px;font-weight:bold;"
    );

    console.log("VELMORA website JavaScript initialized successfully.");

});
