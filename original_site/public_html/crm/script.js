/*
 * Client-side logic for the Telegram Web App form.
 *
 * When the user submits the form, the collected data is serialized to JSON
 * and sent back to the bot via Telegram.WebApp.sendData(). After sending,
 * the form is hidden and a confirmation message is displayed. The app
 * respects the current Telegram color scheme for better user experience.
 */

// Ensure the script runs after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    // Request the app to expand (useful for mobile devices)
    if (typeof tg.expand === 'function') {
        tg.expand();
    }

    // Adapt background to Telegram theme
    document.body.style.backgroundColor = tg.backgroundColor || '#f5f5f5';

    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const container = document.querySelector('.container');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Disable button to prevent multiple submissions
        submitBtn.disabled = true;

        const data = {
            service: document.getElementById('service').value,
            description: document.getElementById('description').value.trim(),
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            city: document.getElementById('city').value.trim(),
            preferred_time: document.getElementById('preferred_time').value,
        };

        // Validate minimal length for phone
        if (data.phone.length < 5) {
            alert('Будь ласка, введіть коректний номер телефону.');
            submitBtn.disabled = false;
            return;
        }

        // Send data to the bot. Telegram.WebApp.sendData() can be called once.
        try {
            tg.sendData(JSON.stringify(data));
        } catch (err) {
            console.error('Помилка надсилання даних:', err);
        }
        // Show confirmation
        container.innerHTML =
            '<h2>Дякуємо!</h2><p>Ваша заявка відправлена. Наші спеціалісти зв’яжуться з вами найближчим часом.</p>';
    });
});