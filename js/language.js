// Language management system
let currentLanguage = 'nl'; // Default to Dutch

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load saved language from localStorage
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage && (savedLanguage === 'ti' || savedLanguage === 'nl')) {
    currentLanguage = savedLanguage;
  }
  
  // Apply translations
  updateTranslations();
  
  // Update language toggle buttons
  updateLanguageButtons();
});

// Set language and save to localStorage
function setLanguage(lang) {
  if (lang !== 'ti' && lang !== 'nl') return;
  
  currentLanguage = lang;
  localStorage.setItem('selectedLanguage', lang);
  
  // Update all translations
  updateTranslations();
  
  // Update language toggle buttons
  updateLanguageButtons();
  
  // Add smooth transition effect
  document.body.style.opacity = '0.8';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 150);
}

// Update all elements with data-translate attribute
function updateTranslations() {
  const elements = document.querySelectorAll('[data-translate]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      const text = translations[currentLanguage][key];
      
      // Handle different element types
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = text;
      } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    }
  });
}

// Update language toggle button states
function updateLanguageButtons() {
  const tiButton = document.getElementById('lang-ti');
  const nlButton = document.getElementById('lang-nl');
  
  if (tiButton && nlButton) {
    if (currentLanguage === 'ti') {
      tiButton.classList.add('bg-blue-600', 'text-white');
      tiButton.classList.remove('bg-gray-100', 'text-gray-700');
      nlButton.classList.add('bg-gray-100', 'text-gray-700');
      nlButton.classList.remove('bg-blue-600', 'text-white');
    } else {
      nlButton.classList.add('bg-blue-600', 'text-white');
      nlButton.classList.remove('bg-gray-100', 'text-gray-700');
      tiButton.classList.add('bg-gray-100', 'text-gray-700');
      tiButton.classList.remove('bg-blue-600', 'text-white');
    }
  }
}

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

