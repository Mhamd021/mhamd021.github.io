const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");

document.querySelectorAll(".project-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        const targetId = tab.dataset.projectTab;

        document.querySelectorAll(".project-tab").forEach((button) => {
            const isActive = button === tab;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
        });

        document.querySelectorAll(".project-panel").forEach((panel) => {
            panel.classList.toggle("active", panel.id === targetId);
        });
    });
});

function setActiveNav(id) {
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
}

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
        }
    });
}, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
});

sections.forEach((section) => navObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
});

revealItems.forEach((item) => revealObserver.observe(item));

function openmodal(modalid) {
    const modal = document.getElementById(modalid);
    if (!modal) return;

    modal.style.display = "flex";
    document.body.classList.add("modal-open");

    const slider = modal.querySelector(".image-slider");
    if (slider) {
        const sliderKey = slider.dataset.sliderId || `${modal.id}-slider`;
        slideIndexes[sliderKey] = slideIndexes[sliderKey] || 1;
        showSlides(slideIndexes[sliderKey], sliderKey);
    }
}

function closeModal(modalid) {
    const modal = document.getElementById(modalid);
    if (!modal) return;

    modal.style.display = "none";
    document.body.classList.remove("modal-open");
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox-modal");
    const image = document.getElementById("lightbox-img");
    if (!lightbox || !image) return;

    lightbox.style.display = "none";
    image.src = "";
}

let slideIndexes = {};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".image-slider").forEach((slider, index) => {
        const sliderKey = slider.dataset.sliderId || `slider-${index}`;
        slideIndexes[sliderKey] = 1;
        showSlides(1, sliderKey);
    });
});

function plusSlides(n, sliderKey) {
    const key = String(sliderKey);
    slideIndexes[key] = (slideIndexes[key] || 1) + n;
    showSlides(slideIndexes[key], key);
}

function showSlides(n, sliderKey) {
    const key = String(sliderKey);
    const slider = Array.from(document.querySelectorAll(".image-slider")).find((item) => String(item.dataset.sliderId || "") === key) || document.querySelectorAll(".image-slider")[Number(key)];
    if (!slider) return;

    const slides = slider.getElementsByClassName("slide");
    if (!slides.length) return;

    if (n > slides.length) slideIndexes[key] = 1;
    if (n < 1) slideIndexes[key] = slides.length;

    Array.from(slides).forEach((slide) => {
        slide.style.display = "none";
        const video = slide.querySelector("video");
        if (video) video.pause();
    });

    const activeSlide = slides[slideIndexes[key] - 1];
    if (activeSlide) activeSlide.style.display = "block";
}

document.querySelectorAll(".image-slider .slide img, .architecture-image img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (event) => {
        const lightbox = document.getElementById("lightbox-modal");
        const lightboxImage = document.getElementById("lightbox-img");
        if (!lightbox || !lightboxImage) return;

        event.stopPropagation();
        lightboxImage.src = img.src;
        lightbox.style.display = "flex";
    });
});

document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document.querySelectorAll(".modal").forEach((modal) => {
        if (modal.style.display === "flex") closeModal(modal.id);
    });
    closeLightbox();
});
