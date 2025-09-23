document.addEventListener('DOMContentLoaded', function() {
    // Handle all forms with class 'telegram-form'
    const forms = document.querySelectorAll('.telegram-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
            
            try {
                const formData = new FormData(form);
                const data = {};
                
                // Convert FormData to object
                formData.forEach((value, key) => {
                    data[key] = value;
                });
                
                // Add form type based on form ID or class
                if (form.id) {
                    data.formType = form.id;
                } else if (form.classList.contains('contact-form')) {
                    data.formType = 'contact';
                } else if (form.classList.contains('callback-form')) {
                    data.formType = 'callback';
                }
                
                // Handle multistep form data
                if (form.classList.contains('multistep-form')) {
                    const selectedOptions = form.querySelectorAll('.form-option.selected');
                    selectedOptions.forEach(option => {
                        data[option.dataset.value] = true;
                    });
                }
                
                const response = await fetch('/send_telegram.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'alert alert-success';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Дякуємо! Ваше повідомлення відправлено.';
                    form.insertBefore(successMessage, form.firstChild);
                    
                    // Reset form
                    form.reset();
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                } else {
                    throw new Error(result.message || 'Помилка відправки');
                }
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-danger';
                errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
                form.insertBefore(errorMessage, form.firstChild);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    });
    
    // Handle multistep form navigation
    const multistepForms = document.querySelectorAll('.multistep-form');
    multistepForms.forEach(form => {
        const steps = form.querySelectorAll('.form-step');
        const progressFill = form.querySelector('.progress-fill');
        const nextButtons = form.querySelectorAll('.next-step');
        const prevButtons = form.querySelectorAll('.prev-step');
        
        function updateProgress() {
            const currentStep = form.querySelector('.form-step.active');
            const stepNumber = parseInt(currentStep.dataset.step);
            const totalSteps = steps.length;
            const progress = ((stepNumber - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = form.querySelector('.form-step.active');
                const nextStep = form.querySelector(`.form-step[data-step="${parseInt(currentStep.dataset.step) + 1}"]`);
                
                if (nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                    updateProgress();
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = form.querySelector('.form-step.active');
                const prevStep = form.querySelector(`.form-step[data-step="${parseInt(currentStep.dataset.step) - 1}"]`);
                
                if (prevStep) {
                    currentStep.classList.remove('active');
                    prevStep.classList.add('active');
                    updateProgress();
                }
            });
        });
        
        // Handle form options
        const options = form.querySelectorAll('.form-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const parent = option.parentElement;
                parent.querySelectorAll('.form-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        // Initialize progress
        updateProgress();
    });
}); 