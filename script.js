// Medical Referrals System JavaScript

// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';
let borderCrossings = [];
let statistics = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeEventListeners();
    loadBorderCrossings();
    loadStatistics();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggle();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeToggle();
}

function updateThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
}

// Event Listeners
function initializeEventListeners() {
    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // FAQ toggles
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => toggleFAQ(question));
    });

    // Auto-refresh border crossings and statistics every 2 seconds for real-time updates
    setInterval(loadBorderCrossings, 2000);
    setInterval(loadStatistics, 2000);
}

// Search functionality
async function handleSearch(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const patientId = formData.get('patientId').trim();
    const referralNumber = formData.get('referralNumber').trim();
    
    if (!patientId && !referralNumber) {
        showAlert('يرجى إدخال رقم الهوية أو رقم التحويلة للبحث', 'warning');
        return;
    }
    
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '<div class="loading"></div>';
    searchResults.classList.add('show');
    
    try {
        const params = new URLSearchParams();
        if (patientId) params.append('patientId', patientId);
        if (referralNumber) params.append('referralNumber', referralNumber);
        
        const response = await fetch(`/api/referrals/search?${params}`);
        
        if (!response.ok) {
            throw new Error('فشل في البحث');
        }
        
        const referrals = await response.json();
        displaySearchResults(referrals);
        
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = `
            <div class="alert-info" style="background: #fee2e2; border-color: #fecaca;">
                <div class="alert-icon">⚠️</div>
                <p>حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.</p>
            </div>
        `;
    }
}

function displaySearchResults(referrals) {
    const searchResults = document.getElementById('searchResults');
    
    if (referrals.length === 0) {
        searchResults.innerHTML = `
            <div class="alert-info" style="background: #fef3c7; border-color: #fcd34d;">
                <div class="alert-icon">🔍</div>
                <p>لا توجد تحويلات طبية مطابقة لمعايير البحث.</p>
            </div>
        `;
        return;
    }
    
    const resultsHTML = referrals.map(referral => `
        <div class="referral-item">
            <div class="referral-header">
                <div class="referral-info">
                    <h4>${referral.patientName}</h4>
                    <p>رقم الهوية: ${referral.patientId} | رقم التحويلة: ${referral.referralNumber}</p>
                    <p>الوجهة: ${referral.destination}</p>
                    <p>الحالة الطبية: ${referral.medicalCondition}</p>
                </div>
                <div class="status-badge status-${referral.status}">
                    ${getStatusText(referral.status)}
                </div>
            </div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
                <p>تاريخ الإنشاء: ${formatDate(referral.createdAt)}</p>
                ${referral.approvalDate ? `<p>تاريخ الموافقة: ${formatDate(referral.approvalDate)}</p>` : ''}
            </div>
        </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد المراجعة',
        'approved': 'موافق عليها',
        'local_followup': 'متابعة محلية',
        'rejected': 'مرفوضة'
    };
    return statusMap[status] || status;
}

// Border Crossings
async function loadBorderCrossings() {
    try {
        const response = await fetch('/api/border-crossings');
        
        if (!response.ok) {
            throw new Error('فشل في تحميل بيانات المعابر');
        }
        
        borderCrossings = await response.json();
        displayBorderCrossings();
        
    } catch (error) {
        console.error('Border crossings error:', error);
        document.getElementById('borderCrossings').innerHTML = `
            <div class="alert-info" style="background: #fee2e2; border-color: #fecaca;">
                <div class="alert-icon">⚠️</div>
                <p>خطأ في تحميل بيانات المعابر</p>
            </div>
        `;
    }
}

function displayBorderCrossings() {
    const container = document.getElementById('borderCrossings');
    
    const crossingsHTML = borderCrossings.map(crossing => `
        <div class="crossing-item" data-crossing-id="${crossing.id}">
            <div class="crossing-info">
                <h4>${crossing.name}</h4>
                <p>${crossing.nameEn}</p>
                <p>ساعات العمل: ${crossing.workingHours || 'غير محددة'}</p>
                ${crossing.notes ? `<p>ملاحظات: ${crossing.notes}</p>` : ''}
                <p style="font-size: 0.75rem; color: var(--text-muted);">
                    آخر تحديث: ${formatDate(crossing.lastUpdate)}
                    <span class="update-indicator" style="color: #16a34a; font-weight: 500;">🔴 مباشر</span>
                </p>
            </div>
            <div class="crossing-status crossing-${crossing.status}" id="status-${crossing.id}">
                ${getCrossingStatusText(crossing.status)}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = crossingsHTML;
    
    // Add visual indication of live updates
    const indicators = document.querySelectorAll('.update-indicator');
    indicators.forEach(indicator => {
        indicator.style.animation = 'pulse 1s infinite';
    });
}

function getCrossingStatusText(status) {
    const statusMap = {
        'open': 'مفتوح',
        'closed': 'مغلق',
        'restricted': 'مقيد'
    };
    return statusMap[status] || status;
}

// Statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/statistics');
        
        if (!response.ok) {
            throw new Error('فشل في تحميل الإحصائيات');
        }
        
        statistics = await response.json();
        displayStatistics();
        
    } catch (error) {
        console.error('Statistics error:', error);
        document.getElementById('statistics').innerHTML = `
            <div class="alert-info" style="background: #fee2e2; border-color: #fecaca;">
                <div class="alert-icon">⚠️</div>
                <p>خطأ في تحميل الإحصائيات</p>
            </div>
        `;
    }
}

function displayStatistics() {
    const container = document.getElementById('statistics');
    
    const statsHTML = `
        <div class="stat-item" data-stat="total">
            <div class="stat-value">${statistics.totalReferrals.toLocaleString('ar')}</div>
            <div class="stat-label">إجمالي التحويلات</div>
        </div>
        <div class="stat-item" data-stat="completed">
            <div class="stat-value">${statistics.completedTravels.toLocaleString('ar')}</div>
            <div class="stat-label">السفرات المكتملة</div>
        </div>
        <div class="stat-item" data-stat="monthly">
            <div class="stat-value">${statistics.monthlyReferrals.toLocaleString('ar')}</div>
            <div class="stat-label">تحويلات هذا الشهر</div>
        </div>
        <div class="stat-item" data-stat="pending">
            <div class="stat-value">${statistics.pendingReferrals.toLocaleString('ar')}</div>
            <div class="stat-label">في الانتظار</div>
        </div>
        <div class="stat-item" data-stat="approval">
            <div class="stat-value">%${statistics.approvalRate.toLocaleString('ar')}</div>
            <div class="stat-label">معدل الموافقة</div>
        </div>
        <div class="stat-item" data-stat="processing">
            <div class="stat-value">${statistics.averageProcessingDays.toLocaleString('ar')} يوم</div>
            <div class="stat-label">متوسط المعالجة</div>
        </div>
    `;
    
    container.innerHTML = statsHTML;
    
    // Add visual indication that data is updating in real-time
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.style.position = 'relative';
        // Add a small indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: absolute;
            top: 5px;
            left: 5px;
            width: 8px;
            height: 8px;
            background: #16a34a;
            border-radius: 50%;
            animation: pulse 1s infinite;
        `;
        item.appendChild(indicator);
    });
}

// FAQ functionality
function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // If it wasn't active, open it
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'غير محدد';
    
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    } catch (error) {
        return 'تاريخ غير صحيح';
    }
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert-${type}`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '1000';
    alert.style.padding = 'var(--spacing-md)';
    alert.style.borderRadius = 'var(--radius-md)';
    alert.style.boxShadow = 'var(--shadow-lg)';
    alert.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--spacing-sm);">
            <span>${type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close active FAQ
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // Enter key on FAQ questions
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
        toggleFAQ(e.target);
    }
});

// Add keyboard navigation to FAQ questions
document.querySelectorAll('.faq-question').forEach(question => {
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
});

// Update aria-expanded when FAQ is toggled
const originalToggleFAQ = window.toggleFAQ;
window.toggleFAQ = function(questionElement) {
    const wasActive = questionElement.parentElement.classList.contains('active');
    originalToggleFAQ(questionElement);
    questionElement.setAttribute('aria-expanded', !wasActive);
};
