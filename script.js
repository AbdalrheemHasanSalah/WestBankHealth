// Medical Referrals System JavaScript - Static Version

// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';

// Static data for demonstration
const staticReferrals = [
    {
        id: '1',
        patientId: 'PAT001',
        patientName: 'أحمد محمد علي',
        referralNumber: 'REF2024001',
        destination: 'مستشفى القدس - القدس',
        status: 'approved',
        approvalDate: '2024-09-20T10:30:00.000Z',
        medicalCondition: 'جراحة القلب',
        createdAt: '2024-09-15T08:00:00.000Z'
    },
    {
        id: '2',
        patientId: 'PAT002',
        patientName: 'فاطمة أحمد حسن',
        referralNumber: 'REF2024002',
        destination: 'مستشفى الشفاء - غزة',
        status: 'pending',
        medicalCondition: 'علاج الأورام',
        createdAt: '2024-09-18T14:20:00.000Z'
    },
    {
        id: '3',
        patientId: 'PAT003',
        patientName: 'محمد عبد الله قاسم',
        referralNumber: 'REF2024003',
        destination: 'مستشفى الملك حسين - عمان',
        status: 'local_followup',
        approvalDate: '2024-09-23T16:45:00.000Z',
        medicalCondition: 'جراحة العظام',
        createdAt: '2024-09-10T11:00:00.000Z'
    },
    {
        id: '4',
        patientId: 'PAT004',
        patientName: 'سارة محمود خليل',
        referralNumber: 'REF2024004',
        destination: 'مستشفى الملك فيصل التخصصي - الرياض',
        status: 'approved',
        approvalDate: '2024-09-24T09:15:00.000Z',
        medicalCondition: 'زراعة الكلى',
        createdAt: '2024-09-05T13:30:00.000Z'
    }
];

const staticBorderCrossings = [
    {
        id: '1',
        name: 'معبر الكرامة',
        nameEn: 'King Hussein Bridge',
        status: 'open',
        workingHours: '24 ساعة',
        notes: 'مفتوح للمرضى والمرافقين',
        lastUpdate: '2024-09-25T12:00:00.000Z'
    },
    {
        id: '2',
        name: 'معبر رفح',
        nameEn: 'Rafah Crossing',
        status: 'closed',
        workingHours: 'مغلق مؤقتاً',
        notes: 'مغلق بسبب الأوضاع الأمنية',
        lastUpdate: '2024-09-25T10:30:00.000Z'
    },
    {
        id: '3',
        name: 'معبر بيت حانون',
        nameEn: 'Erez Crossing',
        status: 'restricted',
        workingHours: '8:00 - 16:00',
        notes: 'مفتوح للحالات الطبية الطارئة فقط',
        lastUpdate: '2024-09-25T14:15:00.000Z'
    },
    {
        id: '4',
        name: 'معبر القنيطرة',
        nameEn: 'Quneitra Crossing',
        status: 'open',
        workingHours: '6:00 - 18:00',
        notes: 'مفتوح للحالات الطبية المعتمدة',
        lastUpdate: '2024-09-25T11:20:00.000Z'
    }
];

const staticStatistics = {
    totalReferrals: 1247,
    completedTravels: 892,
    monthlyReferrals: 156,
    pendingReferrals: 234,
    approvalRate: 78,
    averageProcessingDays: 12,
    lastUpdated: '2024-09-25T14:00:00.000Z'
};

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
}

// Search functionality with static data
function handleSearch(event) {
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
    
    // Simulate API delay
    setTimeout(() => {
        try {
            let referrals = staticReferrals;
            
            // Filter referrals based on search criteria
            if (patientId) {
                referrals = referrals.filter(referral => 
                    referral.patientId.includes(patientId)
                );
            }
            
            if (referralNumber) {
                referrals = referrals.filter(referral => 
                    referral.referralNumber.includes(referralNumber)
                );
            }
            
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
    }, 500);
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

// Border Crossings with static data
function loadBorderCrossings() {
    try {
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
    
    const crossingsHTML = staticBorderCrossings.map(crossing => `
        <div class="crossing-item">
            <div class="crossing-info">
                <h4>${crossing.name}</h4>
                <p>${crossing.nameEn}</p>
                <p>ساعات العمل: ${crossing.workingHours || 'غير محددة'}</p>
                ${crossing.notes ? `<p>ملاحظات: ${crossing.notes}</p>` : ''}
                <p style="font-size: 0.75rem; color: var(--text-muted);">
                    آخر تحديث: ${formatDate(crossing.lastUpdate)}
                </p>
            </div>
            <div class="crossing-status crossing-${crossing.status}">
                ${getCrossingStatusText(crossing.status)}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = crossingsHTML;
}

function getCrossingStatusText(status) {
    const statusMap = {
        'open': 'مفتوح',
        'closed': 'مغلق',
        'restricted': 'مقيد'
    };
    return statusMap[status] || status;
}

// Statistics with static data
function loadStatistics() {
    try {
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
        <div class="stat-item">
            <div class="stat-value">${staticStatistics.totalReferrals.toLocaleString('ar')}</div>
            <div class="stat-label">إجمالي التحويلات</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${staticStatistics.completedTravels.toLocaleString('ar')}</div>
            <div class="stat-label">السفرات المكتملة</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${staticStatistics.monthlyReferrals.toLocaleString('ar')}</div>
            <div class="stat-label">تحويلات هذا الشهر</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${staticStatistics.pendingReferrals.toLocaleString('ar')}</div>
            <div class="stat-label">في الانتظار</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">%${staticStatistics.approvalRate.toLocaleString('ar')}</div>
            <div class="stat-label">معدل الموافقة</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${staticStatistics.averageProcessingDays.toLocaleString('ar')} يوم</div>
            <div class="stat-label">متوسط المعالجة</div>
        </div>
    `;
    
    container.innerHTML = statsHTML;
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
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
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
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
});

// Update aria-expanded when FAQ is toggled
const originalToggleFAQ = toggleFAQ;
function toggleFAQ(questionElement) {
    const wasActive = questionElement.parentElement.classList.contains('active');
    originalToggleFAQ(questionElement);
    questionElement.setAttribute('aria-expanded', !wasActive);
}