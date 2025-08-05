
// Portfolio Website JavaScript
class Portfolio {
    constructor() {
        this.currentSection = 'home';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }
    ...
});

document.addEventListener('DOMContentLoaded', () => new Portfolio());
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        new Portfolio().navigateToSection(hash);
    }
});
