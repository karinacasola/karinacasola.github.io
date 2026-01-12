document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    const statusMessage = document.getElementById('newsletter-message');
    const btnSubmit = document.getElementById('btn-newsletter');
    const inputEmail = document.getElementById('newsletter-email');
    const inputGroup = document.getElementById('input-group-newsletter');

    // Função de validação via Regex
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailValue = inputEmail.value.trim();

            // --- VALIDAÇÃO CLIENT-SIDE ---
            if (!validateEmail(emailValue)) {
                statusMessage.style.color = "#FF5252";
                statusMessage.innerHTML = '<i class="bi bi-x-circle"></i> Formato de e-mail inválido.';
                inputEmail.style.borderColor = "#FF5252";
                return; // Interrompe o envio aqui
            }

            // Se passar na validação, prossegue com o envio
            inputEmail.style.borderColor = "var(--border-color)";
            btnSubmit.innerText = "Enviando...";
            btnSubmit.disabled = true;

            const formData = new URLSearchParams(new FormData(newsletterForm)).toString();

            fetch("https://api.staticforms.xyz/submit", {
                method: 'POST',
                body: formData,
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(() => {
                // SUCESSO NA INTERFACE
                statusMessage.style.color = "#4CAF50";
                statusMessage.innerHTML = '<i class="bi bi-check-circle-fill"></i> Inscrição confirmada!';
                btnSubmit.innerText = "Concluído";

                if (inputGroup) {
                    inputGroup.style.opacity = "0";
                    setTimeout(() => {
                        inputGroup.style.display = "none";
                        newsletterForm.reset();
                    }, 500);
                }
            })
            .catch((error) => {
                console.error("Erro de conexão:", error);
                statusMessage.style.color = "#FF5252";
                statusMessage.innerText = "Erro de conexão. Tente novamente.";
                btnSubmit.disabled = false;
                btnSubmit.innerText = "Inscrever-se";
            });
        });

        // Limpa o erro visual quando o usuário volta a digitar
        inputEmail.addEventListener('input', () => {
            statusMessage.innerText = "";
            inputEmail.style.borderColor = "var(--border-color)";
        });
    }
});