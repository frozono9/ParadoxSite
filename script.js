/**
 * Paradox - JavaScript
 * Tab switching and interactivity for the magic trick tutorial site
 */

// ========================================
// Initialize on DOM Load
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeTabSwitching();
    initializeAccessibility();
    initializeAnalytics();
});

// ========================================
// Tab Switching Logic
// ========================================

/**
 * Initialize tab button click handlers
 * Switches between Performance, Tutorial, and Guide tabs
 */
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            handleTabClick(event, button);
        });
        
        // Keyboard accessibility: Enter and Space keys
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleTabClick(event, button);
            }
        });
    });
}

/**
 * Handle tab button click event
 * @param {Event} event - The click event
 * @param {HTMLElement} button - The clicked tab button
 */
function handleTabClick(event, button) {
    event.preventDefault();
    
    const tabId = button.getAttribute('data-tab');
    
    // Remove active class from all buttons and tab contents
    removeAllActiveClasses();
    
    // Add active class to clicked button
    button.classList.add('active');
    
    // Add active class to corresponding tab content
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
        
        // Scroll to content smoothly
        tabContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Announce tab change to screen readers
    announceTabChange(tabId);
}

/**
 * Remove active class from all tab buttons and content
 */
function removeAllActiveClasses() {
    // Remove from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Remove from all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
}

// ========================================
// Accessibility Features
// ========================================

/**
 * Initialize accessibility features
 * Adds ARIA labels and keyboard support
 */
function initializeAccessibility() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Set ARIA roles and attributes
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        button.id = `tab-${button.getAttribute('data-tab')}`;
    });
    
    tabContents.forEach(content => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', `tab-${content.id}`);
    });
    
    // Add keyboard navigation (Arrow keys)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            handleTabKeyNavigation(event);
        }
    });
}

/**
 * Handle arrow key navigation between tabs
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleTabKeyNavigation(event) {
    const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
    const activeButton = document.querySelector('.tab-button.active');
    const currentIndex = tabButtons.indexOf(activeButton);
    
    let nextIndex = currentIndex;
    
    if (event.key === 'ArrowLeft' && currentIndex > 0) {
        nextIndex = currentIndex - 1;
        event.preventDefault();
    } else if (event.key === 'ArrowRight' && currentIndex < tabButtons.length - 1) {
        nextIndex = currentIndex + 1;
        event.preventDefault();
    }
    
    if (nextIndex !== currentIndex) {
        const nextButton = tabButtons[nextIndex];
        nextButton.focus();
        nextButton.click();
    }
}

/**
 * Announce tab change to screen readers
 * @param {string} tabId - The ID of the active tab
 */
function announceTabChange(tabId) {
    const tabNames = {
        'performance': 'The Effect',
        'tutorial': 'Learn the Secret',
        'guide': 'In-Depth Guide'
    };
    
    const tabName = tabNames[tabId] || tabId;
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${tabName} tab is now active`;
    
    document.body.appendChild(announcement);
    
    // Remove the announcement after it's read
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ========================================
// Smooth Scroll Behavior
// ========================================

/**
 * Add smooth scrolling for internal links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========================================
// Performance Monitoring
// ========================================

/**
 * Log page load performance metrics
 */
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;
        
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Connection Time: ${connectTime}ms`);
        console.log(`DOM Render Time: ${renderTime}ms`);
    }
}

// Log performance on load
window.addEventListener('load', logPerformanceMetrics);

// ========================================
// Analytics & Event Tracking
// ========================================

/**
 * Initialize basic analytics tracking
 * Tracks tab switches and user interactions
 */
function initializeAnalytics() {
    // Track tab switches
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            trackEvent('tab_switch', {
                tab: tabName,
                timestamp: new Date().toISOString()
            });
        });
    });
    
    // Track video plays (if YouTube tracking is available)
    document.querySelectorAll('.responsive-iframe').forEach(iframe => {
        iframe.addEventListener('play', () => {
            const videoTitle = iframe.getAttribute('title');
            trackEvent('video_play', {
                video: videoTitle,
                timestamp: new Date().toISOString()
            });
        });
    });
}

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {object} eventData - Data associated with the event
 */
function trackEvent(eventName, eventData) {
    // This is a placeholder for analytics integration
    // You can connect this to Google Analytics, Mixpanel, etc.
    console.log(`Event: ${eventName}`, eventData);
    
    // Example: Send to Google Analytics (if available)
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventData);
    }
}

// ========================================
// Utility Functions
// ========================================

/**
 * Get the current active tab
 * @returns {string} The ID of the active tab
 */
function getActiveTab() {
    const activeButton = document.querySelector('.tab-button.active');
    return activeButton ? activeButton.getAttribute('data-tab') : null;
}

/**
 * Switch to a specific tab programmatically
 * @param {string} tabId - The ID of the tab to switch to
 */
function switchToTab(tabId) {
    const button = document.querySelector(`[data-tab="${tabId}"]`);
    if (button) {
        button.click();
    }
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is mobile
 * @returns {boolean} True if device is mobile
 */
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

// ========================================
// Additional Enhancements
// ========================================

/**
 * Add loading animation to iframes
 */
document.querySelectorAll('.responsive-iframe').forEach(iframe => {
    iframe.addEventListener('load', () => {
        iframe.style.opacity = '1';
        iframe.style.transition = 'opacity 0.3s ease';
    });
    
    iframe.style.opacity = '0';
});

/**
 * Observe intersection for lazy loading (future enhancement)
 */
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Placeholder for lazy loading logic
                console.log('Element is in view:', entry.target);
            }
        });
    });
    
    // Observe guide sections
    document.querySelectorAll('.guide-section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Console message for developers
 */
console.log(
    '%cParadox - A Modern Magic Trick Tutorial',
    'color: #8b5cf6; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cBy Alex Latorre & Judah Gabriel',
    'color: #06b6d4; font-size: 12px;'
);
