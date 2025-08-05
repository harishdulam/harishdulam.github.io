// Portfolio Website JavaScript
class Portfolio {
    constructor() {
        this.currentSection = 'home';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupAnimations();
        this.setupFilters();
        this.setupSearch();
        this.setupForms();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.navigateToSection(target);
            });
        });
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        // Smooth anchor scroll
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
        // Scroll & resize
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }

    navigateToSection(sectionId) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        this.currentSection = sectionId;
        history.pushState(null, null, `#${sectionId}`);
        this.animateSection(sectionId);
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const icon = document.querySelector('#themeToggle i');
        icon.className = this.theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => document.body.style.transition = '', 300);
    }

    setupAnimations() {
        const obsOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('loaded');
            });
        }, obsOptions);

        document.querySelectorAll('.project-card, .blog-card, .skill-category').forEach(el => {
            el.classList.add('loading');
            observer.observe(el);
        });
        this.setupTypingAnimation();
    }

    setupTypingAnimation() {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }

    animateSection(sectionId) {
        const section = document.getElementById(sectionId);
        section.querySelectorAll('.project-card, .blog-card, .skill-category').forEach((el, i) => {
            el.style.animationDelay = `${i * 0.1}s`;
            el.classList.add('fade-in');
        });
    }

    setupFilters() {
        // Project filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const f = btn.getAttribute('data-filter');
                this.filterProjects(f);
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        // Blog filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const c = btn.getAttribute('data-category');
                this.filterBlogPosts(c);
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    filterProjects(filter) {
        document.querySelectorAll('.project-card').forEach(card => {
            const cat = card.getAttribute('data-category');
            if (filter === 'all' || cat === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterBlogPosts(category) {
        document.querySelectorAll('.blog-card').forEach(post => {
            const cat = post.getAttribute('data-category');
            if (category === 'all' || cat === category) {
                post.style.display = 'block';
                post.style.animation = 'fadeIn 0.5s ease';
            } else {
                post.style.display = 'none';
            }
        });
    }

    setupSearch() {
        const inp = document.querySelector('.search-input');
        if (!inp) return;
        inp.addEventListener('input', e => this.searchBlogPosts(e.target.value));
    }

    searchBlogPosts(q) {
        const term = q.trim().toLowerCase();
        document.querySelectorAll('.blog-card').forEach(post => {
            const title = post.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = post.querySelector('.blog-excerpt').textContent.toLowerCase();
            const tags = Array.from(post.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
            const match = title.includes(term) || excerpt.includes(term) || tags.some(t => t.includes(term));
            post.style.display = (match || term === '') ? 'block' : 'none';
        });
    }

    setupForms() {
        const contact = document.querySelector('.contact-form');
        if (contact) contact.addEventListener('submit', e => {
            e.preventDefault();
            this.handleContactForm(contact);
        });
        const news = document.querySelector('.newsletter-form');
        if (news) news.addEventListener('submit', e => {
            e.preventDefault();
            this.handleNewsletterForm(news);
        });
        this.setupFormValidation();
    }

    handleContactForm(form) {
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 2000);
    }

    handleNewsletterForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        if (this.validateEmail(email)) {
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
        } else {
            this.showNotification('Please enter a valid email address.', 'error');
        }
    }

    setupFormValidation() {
        document.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) this.validateField(field);
            });
        });
    }

    validateField(f) {
        const v = f.value.trim();
        let ok = true, msg = '';
        if (f.hasAttribute('required') && !v) {
            ok = false; msg = 'This field is required.';
        }
        if (ok && f.type === 'email' && v && !this.validateEmail(v)) {
            ok = false; msg = 'Please enter a valid email address.';
        }
        if (ok) {
            f.classList.remove('error');
            this.removeFieldError(f);
        } else {
            f.classList.add('error');
            this.showFieldError(f, msg);
        }
        return ok;
    }

    validateEmail(e) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    }

    showFieldError(field, message) {
        this.removeFieldError(field);
        const div = document.createElement('div');
        div.className = 'field-error';
        div.textContent = message;
        field.parentNode.appendChild(div);
    }

    removeFieldError(field) {
        const err = field.parentNode.querySelector('.field-error');
        if (err) err.remove();
    }

    showNotification(message, type='info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type==='success'?'fa-check-circle':'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 100);
        setTimeout(() => this.hideNotification(notif), 5000);
        notif.querySelector('.notification-close').addEventListener('click', () => this.hideNotification(notif));
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }

    setupMobileMenu() {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-toggle';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        Object.assign(btn.style, {
            display:'none', position:'fixed', top:'20px', left:'20px',
            zIndex:1001, background: 'var(--accent-primary)', border:'none',
            borderRadius:'50%', width:'50px', height:'50px', color:'#fff',
            fontSize:'1.2rem', cursor:'pointer', transition:'all 0.3s ease'
        });
        document.body.appendChild(btn);

        btn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('active');
            const icon = btn.querySelector('i');
            icon.className = sidebar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    document.querySelector('.sidebar').classList.remove('active');
                    btn.querySelector('i').className = 'fas fa-bars';
                }
            });
        });

        this.handleResize();
    }

    handleScroll() {
        const scroll = window.pageYOffset;
        const bg = document.querySelector('.code-background');
        if (bg) bg.style.transform = `translateY(${scroll * 0.1}px)`;
    }

    handleResize() {
        const btn = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth <= 1024) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
            sidebar.classList.remove('active');
        }
    }
}

// Additional CSS for notifications & animations
const extraStyles = `
.notification {
    position: fixed; top:20px; right:20px; z-index:10000;
    min-width:300px; background:var(--bg-secondary);
    border-radius:8px; box-shadow:0 10px 30px var(--shadow-color);
    transform:translateX(400px); transition:transform 0.3s ease;
}
.notification.show { transform:translateX(0); }
.notification-content {
    display:flex; align-items:center; padding:1rem; gap:0.5rem;
}
.notification-success { border-left:4px solid #00ff00; }
.notification-error { border-left:4px solid #ff6b6b; }
.notification-close {
    margin-left:auto; background:none; border:none;
    color:var(--text-secondary); font-size:1.2rem;
    cursor:pointer; padding:0; width:20px; height:20px; display:flex;
    align-items:center; justify-content:center;
}
.field-error {
    color:#ff6b6b; font-size:0.8rem; margin-top:0.25rem;
}
.form-group input.error, .form-group textarea.error {
    border-color:#ff6b6b;
}
@keyframes fadeIn {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
}
.fade-in { animation:fadeIn 0.6s ease forwards; }
@media (max-width:1024px) {
    .mobile-menu-toggle { display:block!important; }
}
`;
const styleTag = document.createElement('style');
styleTag.textContent = extraStyles;
document.head.appendChild(styleTag);

document.addEventListener('DOMContentLoaded', () => new Portfolio());
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        new Portfolio().navigateToSection(hash);
    }
});
