

let teamData = []

const INITIAL_VISIBLE_COUNT = 4;

const fetchTeamData = async () => {
    const res = await fetch("https://grow-pakistan-api.netlify.app/api/teamMembers/")
    teamData = await res.json()
    console.log(teamData)
}

function renderTeamSection() {
    const teamGrid = document.getElementById('team-grid');

    teamGrid.innerHTML = teamData.map((member, index) => `
        <div class="team-card relative group bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:border-brand/30 transition-all duration-300 ${index >= INITIAL_VISIBLE_COUNT ? 'hidden' : ''}" data-slug="${member.slug}" data-id="${member._id}">
            <a href="./profile.html?member=${member.slug}" class="block">
                <div class="w-full aspect-square bg-slate-200 rounded-xl overflow-hidden mb-4 shadow-inner">
                    <img src="${member.photo}" alt="${member.name}" class="w-full h-full object-cover object-top">
                </div>
                <h4 class="font-bold text-lg text-slate-900">${member.title}</h4>
                <p class="text-xs font-semibold text-brand tracking-wider uppercase mt-1">${member.name}</p>
            </a>        
        </div>
    `).join('');
}


// MOBILE MENU TOGGLE
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        icon.className = "fa-solid fa-xmark text-2xl";
    } else {
        menu.classList.add('hidden');
        icon.className = "fa-solid fa-bars text-2xl";
    }
}

// PREMIUM GALLERY FILTERING (Tailwind Grid Safe)
function filterGallery(category, buttonEl) {
    const buttons = buttonEl.parentElement.children;
    for (let btn of buttons) { btn.classList.remove('active-tab'); }
    buttonEl.classList.add('active-tab');

    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        const matchesCategory = category === 'all' || item.getAttribute('data-category') === category;
        if (matchesCategory) {
            item.classList.remove('hidden');
            setTimeout(() => { item.classList.add('reveal-visible'); }, 50);
        } else {
            item.classList.add('hidden');
            item.classList.remove('reveal-visible');
        }
    });
}

// MULTI-DIRECTION INTERSECTION OBSERVER
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.50 // Triggers when 12% of the element hits the screen
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select and observe all variations of our design tokens
    const animationSelectors = ".reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale";
    document.querySelectorAll(animationSelectors).forEach(el => observer.observe(el));
});

document.getElementById('see-more-btn').addEventListener('click', function() {
    // Find all team cards that are hidden
    const hiddenCards = document.querySelectorAll('#team-grid .team-card.hidden');
    
    if (hiddenCards.length > 0) {
        // Reveal all remaining hidden cards
        hiddenCards.forEach(card => {
            card.classList.remove('hidden');
        });
        
        // Change button text and change the arrow direction to up
        this.innerHTML = `
            Show Less
            <svg class="ml-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
        `;
    } else {
        // If already fully expanded, hide everything after the first 4 profiles again
        const allCards = document.querySelectorAll('#team-grid .team-card');
        allCards.forEach((card, index) => {
            if (index >= 4) {
                card.classList.add('hidden');
            }
        });
        
        // Reset button text back to original
        this.innerHTML = `
            See More Team Members
            <svg class="ml-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        `;
        
        // Optional: Smoothly scroll back to the top of the team grid section
        document.getElementById('team').scrollIntoView({ behavior: 'smooth' });
    }
});

const init = async () => {
    await fetchTeamData(); // Wait for data to arrive completely
    renderTeamSection();   // Run only after teamData is populated Initialize your modal events
};

init();

// Functionality for the "See More Team Members" button
document.addEventListener('DOMContentLoaded', () => {
    const seeMoreBtn = document.getElementById('see-more-btn');
    const extraTeamMembers = document.getElementById('extra-team-members');

    if (seeMoreBtn && extraTeamMembers) {
        seeMoreBtn.addEventListener('click', () => {
            // Toggle the visibility
            extraTeamMembers.classList.toggle('hidden');
            
            // Change the button text and flip the arrow based on state
            if (extraTeamMembers.classList.contains('hidden')) {
                seeMoreBtn.innerHTML = `
                    See More Team Members
                    <svg class="ml-2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                `;
            } else {
                seeMoreBtn.innerHTML = `
                    See Less Team Members
                    <svg class="ml-2 h-4 w-4 text-slate-500 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                `;
            }
        });
    }
});
