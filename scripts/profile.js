let teamData = {};

const fetchTeamData = async () => {
    try {
        const res = await fetch("https://grow-pakistan-api.netlify.app/api/teamMembers/");
        const dataArray = await res.json(); // Array from backend
        
        // Clear old properties if re-fetching
        Object.keys(teamData).forEach(key => delete teamData[key]);

        // Convert array to object format using each member's unique slug as the key
        dataArray.forEach(member => {
            teamData[member.slug] = member;
        });

        console.log("Converted Team Data Object:", teamData); 
        
    } catch (error) {
        console.error("Error fetching or formatting data:", error);
    }
};

function switchProfile(key) {
    const member = teamData[key];
    if (!member) {
        console.warn(`Member with key "${key}" not found in teamData.`);
        return;
    }

    // Safely update DOM Elements
    const photoEl = document.getElementById('profilePhoto');
    const nameEl = document.getElementById('profileName');
    const titleEl = document.getElementById('profileTitle');
    const bioEl = document.getElementById('profileBio');

    if (photoEl) {
        photoEl.src = member.photo || '';
        photoEl.alt = member.name || 'Team Member';
    }
    if (nameEl) nameEl.innerText = member.name || '';
    if (titleEl) titleEl.innerText = member.title || '';
    if (bioEl) bioEl.innerText = member.bio || '';
    
    // Optional: Render quote if it exists
    const quoteEl = document.getElementById('profileQuote');
    if (quoteEl) {
        quoteEl.innerText = member.quote ? `"${member.quote}"` : '';
    }

    // Clear and Render Tags
    const tagsContainer = document.getElementById('profileTags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        if (member.tags && Array.isArray(member.tags)) {
            member.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = "bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200/60";
                tagSpan.innerText = tag;
                tagsContainer.appendChild(tagSpan);
            });
        }
    }
}

function initializeProfileRoute() {
    const urlParams = new URLSearchParams(window.location.search);
    const memberKey = urlParams.get('member');
    const selectorEl = document.getElementById('memberSelector');

    // 1. Clear the dropdown and generate fresh options from backend data
    if (selectorEl) {
        selectorEl.innerHTML = ''; // Wipe out any lingering placeholders

        // Loop over database object values to create options dynamically
        Object.values(teamData).forEach(member => {
            const option = document.createElement('option');
            option.value = member.slug; // Value matches database unique slug path
            option.textContent = `${member.name} (${member.title})`; // Displays Name (Role)
            selectorEl.appendChild(option);
        });

        // ✅ Dynamic Event Listener for User Selection Changes
        selectorEl.addEventListener('change', (e) => {
            const selectedSlug = e.target.value;
            switchProfile(selectedSlug);
            // Update browser URL query without causing a page reload
            window.history.pushState({}, '', `?member=${selectedSlug}`);
        });
    }

    // 2. Determine which profile layout to load first
    if (memberKey && teamData[memberKey]) {
        if (selectorEl) selectorEl.value = memberKey; // Synchronize visual state
        switchProfile(memberKey);
    } else {
        // Fallback: Automatically load the first team member returned by database
        const totalKeys = Object.keys(teamData);
        if (totalKeys.length > 0) {
            const firstAvailableMember = totalKeys[0]; // Grab index 0
            if (selectorEl) selectorEl.value = firstAvailableMember;
            switchProfile(firstAvailableMember);
        } else {
            console.error("No team members found in the backend payload.");
        }
    }
}

// MULTI-DIRECTION INTERSECTION OBSERVER
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.50 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animationSelectors = ".reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale";
    document.querySelectorAll(animationSelectors).forEach(el => observer.observe(el));
});

// STARTUP SEQUENCE
const init = async () => {
    await fetchTeamData();        // Wait for database download
    initializeProfileRoute();     // Render layout and route options
};

init();
