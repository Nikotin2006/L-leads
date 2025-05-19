// DOM Elements
const header = document.getElementById('header');
const productCards = document.querySelectorAll('.product-card');
const cartCountElement = document.getElementById('cart-count');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.querySelector('.close-modal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const currentYearElement = document.getElementById('current-year');
const checkoutForm = document.getElementById('checkout-form');
const checkoutButton = document.querySelector('.checkout-button');

// Global Variables
let cartCount = 0;
let cart = [];
let selectedProduct = null;

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Smooth scroll function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  window.scrollTo({
    top: section.offsetTop - 80,
    behavior: 'smooth'
  });
}

// Initialize the product cards
productCards.forEach(card => {
  const productId = card.getAttribute('data-product-id');
  const colorOptions = card.querySelectorAll('.color-option');
  const selectedColorText = card.querySelector('.selected-color');
  const imageDots = card.querySelectorAll('.image-dot');
  const images = card.querySelectorAll('.product-images img');
  const addToCartBtn = card.querySelector('.add-to-cart-btn');
  const buyNowBtn = card.querySelector('.buy-now-btn');
  
  // Product object structure
  const product = {
    id: productId,
    name: card.querySelector('h3').textContent,
    description: card.querySelector('p').textContent,
    price: parseFloat(card.querySelector('.product-price span').textContent.replace('$', '')),
    images: Array.from(images).map(img => img.src),
    color: {
      name: colorOptions[0].getAttribute('data-color'),
      value: colorOptions[0].style.backgroundColor
    }
  };
  
  // Color selection
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      colorOptions.forEach(opt => opt.classList.remove('active'));
      // Add active class to selected option
      option.classList.add('active');
      // Update selected color text
      selectedColorText.textContent = option.getAttribute('data-color');
      // Update product color
      product.color = {
        name: option.getAttribute('data-color'),
        value: option.style.backgroundColor
      };
    });
  });
  
  // Image navigation
  imageDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = dot.getAttribute('data-index');
      
      // Remove active class from all dots and images
      imageDots.forEach(d => d.classList.remove('active'));
      images.forEach(img => img.classList.remove('active'));
      
      // Add active class to selected dot and image
      dot.classList.add('active');
      images[index].classList.add('active');
    });
  });
  
  // Add to Cart functionality
  addToCartBtn.addEventListener('click', () => {
    // Add to cart logic
    cart.push({...product});
    cartCount++;
    cartCountElement.textContent = cartCount;
    
    // Show toast notification
    showToast(`${product.name} in ${product.color.name} added to cart`);
    
    // Optional: You can animate the button to provide feedback
    addToCartBtn.classList.add('clicked');
    setTimeout(() => addToCartBtn.classList.remove('clicked'), 300);
  });
  
  // Buy Now functionality
  buyNowBtn.addEventListener('click', () => {
    selectedProduct = {...product};
    openCheckoutModal(product);
  });
  
  // Add 3D effect on mouse move
  card.addEventListener('mousemove', handleCardMouseMove);
  card.addEventListener('mouseleave', resetCardRotation);
});

// 3D Card effect
function handleCardMouseMove(e) {
  const card = this;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateY = ((x - centerX) / centerX) * 5; // Reduced intensity
  const rotateX = -((y - centerY) / centerY) * 5; // Reduced intensity
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetCardRotation() {
  this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// Checkout Modal
function openCheckoutModal(product) {
  // Set modal content
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-color').textContent = product.color.name;
  document.getElementById('checkout-image').src = product.images[0];
  document.getElementById('checkout-product-name').textContent = product.name;
  document.getElementById('checkout-product-color').textContent = product.color.name;
  document.getElementById('checkout-price').textContent = `$${product.price.toFixed(2)}`;
  
  // Update checkout button text
  checkoutButton.textContent = `Pay $${product.price.toFixed(2)}`;
  
  // Show modal
  checkoutModal.classList.add('active');
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

// Close modal event
closeModal.addEventListener('click', () => {
  checkoutModal.classList.remove('active');
  document.body.style.overflow = '';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Checkout form submission
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Simulate processing
  checkoutButton.textContent = 'Processing...';
  checkoutButton.disabled = true;
  
  setTimeout(() => {
    // Close modal
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Show success message
    showToast(`Thank you for your purchase of the ${selectedProduct.name}!`);
    
    // Reset form
    checkoutForm.reset();
    checkoutButton.textContent = 'Pay';
    checkoutButton.disabled = false;
  }, 1500);
});

// Toast notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Intersection Observer for animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.section-header, .product-card, .story-logo, .story-block, .story-card, .business-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Add different delays to create a sequence effect
        if (entry.target.classList.contains('product-card')) {
          entry.target.style.animationDelay = '0.2s';
        }
        
        if (entry.target.classList.contains('business-card')) {
          const cards = document.querySelectorAll('.business-card');
          const index = Array.from(cards).indexOf(entry.target);
          entry.target.style.animationDelay = `${0.1 * index}s`;
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
};

// Initialize animations once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
});
