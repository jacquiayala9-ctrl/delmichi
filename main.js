// CART SYSTEM
let cartCount = 0;
const cartDisplay = document.getElementById('cart-count');

function addToCart(productName) {
    cartCount++;
    cartDisplay.innerText = cartCount;
    
    // Simple visual feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "¡AÑADIDO!";
    btn.style.backgroundColor = "var(--accent)";
    btn.style.color = "white";
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "transparent";
        btn.style.color = "var(--text-secondary)";
    }, 1500);

    console.log(`Producto añadido: ${productName}`);
}

// HEADER SCROLL EFFECT
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.padding = '15px 0';
        header.style.background = 'rgba(5, 5, 5, 0.9)';
    }
});

// SMOOTH SCROLL FOR ANCHORS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
