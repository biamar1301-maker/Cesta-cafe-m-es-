// Função para rolar suavemente até uma seção
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Contagem regressiva para o Dia das Mães
function updateCountdown() {
    // Define a data do Dia das Mães (segundo domingo de maio)
    const currentYear = new Date().getFullYear();
    const mothersDay = getMothersDay(currentYear);
    
    const now = new Date().getTime();
    const distance = mothersDay - now;
    
    if (distance < 0) {
        // Se já passou o Dia das Mães deste ano, calcula para o próximo ano
        const nextYear = currentYear + 1;
        const nextMothersDay = getMothersDay(nextYear);
        const nextDistance = nextMothersDay - now;
        updateCountdownDisplay(nextDistance);
    } else {
        updateCountdownDisplay(distance);
    }
}

// Função para calcular o segundo domingo de maio (Dia das Mães no Brasil)
function getMothersDay(year) {
    const may = new Date(year, 4, 1); // Maio é mês 4 (0-indexed)
    const firstDay = may.getDay();
    let secondSunday;
    
    if (firstDay === 0) { // Se 1º de maio é domingo
        secondSunday = new Date(year, 4, 8); // Segundo domingo é 8 de maio
    } else {
        const daysUntilSunday = 7 - firstDay;
        secondSunday = new Date(year, 4, daysUntilSunday + 8); // Segundo domingo
    }
    
    return secondSunday.getTime();
}

// Função para atualizar o display da contagem regressiva
function updateCountdownDisplay(distance) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Manipulação do formulário de mensagem
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const messageSent = document.getElementById('messageSent');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtém os valores do formulário
            const name = document.getElementById('name').value;
            const motherName = document.getElementById('motherName').value;
            const message = document.getElementById('message').value;
            
            // Validação simples
            if (!name || !motherName || !message) {
                showNotification('Por favor, preencha todos os campos!', 'error');
                return;
            }
            
            // Simula o envio da mensagem
            setTimeout(() => {
                // Esconde o formulário e mostra a mensagem de sucesso
                form.style.display = 'none';
                messageSent.style.display = 'block';
                
                // Salva a mensagem no localStorage (opcional)
                saveMessage(name, motherName, message);
                
                // Mostra notificação
                showNotification('Mensagem enviada com sucesso! ❤️', 'success');
                
                // Reseta o formulário após 5 segundos
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    messageSent.style.display = 'none';
                }, 5000);
            }, 1000);
        });
    }
    
    // Manipulação do formulário de pedido
    const orderForm = document.getElementById('orderForm');
    const orderSuccess = document.getElementById('orderSuccess');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtém os valores do formulário
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                cpf: document.getElementById('cpf').value,
                birthDate: document.getElementById('birthDate').value,
                cep: document.getElementById('cep').value,
                houseNumber: document.getElementById('houseNumber').value,
                state: document.getElementById('state').value,
                city: document.getElementById('city').value
            };
            
            // Validação simples
            if (!formData.fullName || !formData.email || !formData.cpf || !formData.birthDate || 
                !formData.cep || !formData.houseNumber || !formData.state || !formData.city) {
                showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
                return;
            }
            
            // Validação de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showNotification('Por favor, insira um e-mail válido!', 'error');
                return;
            }
            
            // Validação de CPF
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(formData.cpf)) {
                showNotification('Por favor, insira um CPF válido (000.000.000-00)!', 'error');
                return;
            }
            
            // Validação de CEP
            const cepRegex = /^\d{5}-\d{3}$/;
            if (!cepRegex.test(formData.cep)) {
                showNotification('Por favor, insira um CEP válido (00000-000)!', 'error');
                return;
            }
            
            // Abre o modal PIX (única forma de pagamento)
            openPixModal(formData, orderNumber);
        });
    }
    
    // Configuração do modal
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProductModal();
            }
        });
    }
    
    // Formatação de campos
    setupFieldFormatting();
    
    // Inicia a contagem regressiva
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Adiciona animações de entrada quando os elementos entram na tela
    addScrollAnimations();
    
    // Adiciona efeito de confete ao clicar nos presentes
    addGiftInteractions();
});

// Função para salvar pedidos no localStorage
function saveOrder(formData, orderNumber) {
    const orders = JSON.parse(localStorage.getItem('mothersDayOrders') || '[]');
    orders.push({
        ...formData,
        orderNumber,
        timestamp: new Date().toISOString(),
        product: 'Cesta Café da Manhã + Chocolates',
        price: 'R$ 24,99'
    });
    localStorage.setItem('mothersDayOrders', JSON.stringify(orders));
}

// Função para configurar formatação de campos
function setupFieldFormatting() {
    // Formatação de CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            if (value.length > 9) {
                value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
            } else if (value.length > 6) {
                value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
            } else if (value.length > 3) {
                value = value.slice(0, 3) + '.' + value.slice(3);
            }
            
            e.target.value = value;
        });
    }
    
    // Formatação de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            
            e.target.value = value;
        });
    }
    
    // Busca de CEP real usando API ViaCEP
    if (cepInput) {
        cepInput.addEventListener('blur', function(e) {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                showNotification('Buscando endereço...', 'info');
                
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.erro) {
                            showNotification('CEP não encontrado!', 'error');
                        } else {
                            const streetInput = document.getElementById('street');
                            const neighborhoodInput = document.getElementById('neighborhood');
                            const cityInput = document.getElementById('city');
                            const stateInput = document.getElementById('state');
                            
                            if (streetInput) streetInput.value = data.logradouro || '';
                            if (neighborhoodInput) neighborhoodInput.value = data.bairro || '';
                            if (cityInput) cityInput.value = data.localidade;
                            if (stateInput) stateInput.value = data.uf;
                            showNotification('Endereço encontrado com sucesso!', 'success');
                        }
                    })
                    .catch(error => {
                        showNotification('Erro ao buscar CEP. Tente novamente.', 'error');
                    });
            }
        });
    }
}

// Função para abrir modal DentPeg
function openPixModal(formData, orderNumber) {
    const modal = document.getElementById('pixModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Atualiza valor no modal
    const price = window.selectedProduct ? window.selectedProduct.price : 49.99;
    const formattedPrice = `R$ ${price.toFixed(2).replace('.', ',')}`;
    
    const modalAmount = document.getElementById('modalDentpegAmount');
    const instructionAmount = document.getElementById('instructionAmount');
    if (modalAmount) modalAmount.textContent = formattedPrice;
    if (instructionAmount) instructionAmount.textContent = formattedPrice;
    
    // Salva dados do pedido temporariamente
    window.currentOrder = { formData, orderNumber };
}

// Função para fechar modal PIX
function closePixModal() {
    const modal = document.getElementById('pixModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para gerar QR Code (melhorado)
function generateQRCode() {
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 180;
    canvas.height = 180;
    
    // Limpa o canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha um QR Code mais realista com padrões
    ctx.fillStyle = '#000';
    const cellSize = 4;
    const modules = 45;
    
    // Gera padrão mais estruturado para parecer real
    for (let row = 0; row < modules; row++) {
        for (let col = 0; col < modules; col++) {
            // Cria padrões de posicionamento (cantos)
            if ((row < 7 && col < 7) || (row < 7 && col >= modules-7) || (row >= modules-7 && col < 7)) {
                if ((row < 2 || row >= 5) && (col < 2 || col >= 5)) {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                } else if (row >= 2 && row < 5 && col >= 2 && col < 5) {
                    // Centro vazio
                } else {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            } else {
                // Padrão aleatório para o resto
                if (Math.random() > 0.45) {
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }
    }
    
    // Adiciona texto "PIX" no centro
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PIX', canvas.width / 2, canvas.height / 2);
}

// Função para copiar chave PIX
function copyPixKey() {
    const pixKey = window.CONFIG ? window.CONFIG.pixKey : document.getElementById('pixKey').textContent;
    navigator.clipboard.writeText(pixKey).then(() => {
        showNotification('Chave PIX copiada com sucesso!', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar chave PIX', 'error');
    });
}

// Função para enviar comprovante via WhatsApp
function sendReceiptWhatsApp() {
    const price = window.selectedProduct ? window.selectedProduct.price : 49.99;
    const formattedPrice = `R$ ${price.toFixed(2).replace('.', ',')}`;
    const orderNumber = window.currentOrder ? window.currentOrder.orderNumber : 'N/A';
    const productName = window.selectedProduct && window.selectedProduct.type === 'complete' 
        ? 'Cesta Dia das Mães Especial' 
        : 'Cesta Personalizada';
    
    const whatsappNumber = window.CONFIG ? window.CONFIG.whatsappNumber : '11999999999';
    
    const message = `Olá! Acabei de realizar o pagamento de ${formattedPrice} pelo pedido #${orderNumber} - ${productName}. Segue meu comprovante de pagamento e meu NOME COMPLETO para verificação. Aguardo confirmação, por favor!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Função para confirmar pagamento PIX
function confirmPixPayment() {
    if (window.currentOrder) {
        const { formData, orderNumber } = window.currentOrder;
        
        // Salva o pedido
        saveOrder(formData, orderNumber);
        
        // Fecha o modal PIX
        closePixModal();
        
        // Mostra sucesso
        showOrderSuccess(orderNumber);
        
        // Abre WhatsApp
        openWhatsApp(orderNumber);
    }
}

// Função para processar pagamento com cartão
function processCardPayment(formData, orderNumber) {
    // Simula processamento do cartão
    showNotification('Processando pagamento...', 'info');
    
    setTimeout(() => {
        // Salva o pedido
        saveOrder(formData, orderNumber);
        
        // Mostra sucesso
        showOrderSuccess(orderNumber);
        
        // Abre WhatsApp
        openWhatsApp(orderNumber);
    }, 2000);
}

// Função para mostrar sucesso do pedido
function showOrderSuccess(orderNumber) {
    const orderForm = document.getElementById('orderForm');
    const orderSuccess = document.getElementById('orderSuccess');
    
    orderForm.style.display = 'none';
    orderSuccess.style.display = 'block';
    document.getElementById('orderNumber').textContent = orderNumber;
    
    showNotification('Pedido confirmado com sucesso! 🎉', 'success');
    
    // Reseta o formulário após 10 segundos
    setTimeout(() => {
        orderForm.reset();
        orderForm.style.display = 'block';
        orderSuccess.style.display = 'none';
    }, 10000);
}

// Função para abrir WhatsApp com número do pedido
function openWhatsApp(orderNumber) {
    const config = window.CONFIG || {};
    const message = (config.whatsappMessage || "Olá! Acabei de fazer um pedido no site Dia das Mães. Número do pedido: #{orderNumber}. Por favor, confirmem o recebimento.").replace('{orderNumber}', orderNumber);
    const whatsappNumber = config.whatsappNumber || '11999999999';
    const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Abre WhatsApp em nova janela
    window.open(whatsappUrl, '_blank');
    
    showNotification('WhatsApp aberto com número do pedido! 📱', 'success');
}

// Função para salvar mensagens no localStorage
function saveMessage(name, motherName, message) {
    const messages = JSON.parse(localStorage.getItem('mothersDayMessages') || '[]');
    messages.push({
        name,
        motherName,
        message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('mothersDayMessages', JSON.stringify(messages));
}

// Função para mostrar notificações
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilo da notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        ${type === 'success' ? 'background: linear-gradient(135deg, #4caf50, #66bb6a);' : 'background: linear-gradient(135deg, #f44336, #e91e63);'}
    `;
    
    document.body.appendChild(notification);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adiciona animações de scroll
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observa elementos que devem animar
    const animatedElements = document.querySelectorAll('.card, .gift-item, .countdown-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Adiciona interações aos presentes
function addGiftInteractions() {
    const giftItems = document.querySelectorAll('.gift-item');
    
    giftItems.forEach(item => {
        const giftImage = item.querySelector('.gift-image img');
        if (giftImage) {
            giftImage.addEventListener('click', function(e) {
                e.stopPropagation();
                // Abre o modal com a imagem e valor
                openProductModal();
            });
        }
        
        item.addEventListener('click', function() {
            // Cria efeito de confete
            createConfetti(event);
            
            // Mostra detalhes do presente
            const giftName = this.querySelector('h3').textContent;
            const giftPrice = this.querySelector('.gift-price').textContent;
            showGiftDetails(giftName, giftPrice);
        });
    });
}

// Função para abrir o modal do produto
function openProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para fechar o modal do produto
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Função para criar efeito de confete
function createConfetti(event) {
    const colors = ['#e91e63', '#f48fb1', '#ff4081', '#ff80ab', '#c2185b'];
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${event.clientX}px;
            top: ${event.clientY}px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall 1s ease-out forwards;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove o confete após a animação
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 1000);
    }
}

// Função para mostrar detalhes do presente
function showGiftDetails(name, price) {
    const modal = document.createElement('div');
    modal.className = 'gift-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${name}</h3>
            <p>Preço: ${price}</p>
            <p>Um presente perfeito para mostrar todo o seu amor!</p>
            <button onclick="this.parentElement.parentElement.remove()">Fechar</button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    modal.querySelector('.modal-content').style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        max-width: 400px;
        animation: slideInUp 0.3s ease-out;
    `;
    
    modal.querySelector('button').style.cssText = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 1rem;
    `;
    
    document.body.appendChild(modal);
    
    // Fecha o modal ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Adiciona animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 200 - 100}px, 200px) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
    
    .gift-modal .modal-content h3 {
        color: var(--primary-color);
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .gift-modal .modal-content p {
        color: var(--text-light);
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);

// Função para compartilhar nas redes sociais
function shareOnSocial(platform) {
    const url = window.location.href;
    const title = 'Celebre o Dia das Mães com muito amor! ❤️';
    const text = 'Veja este site especial para o Dia das Mães!';
    
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Adiciona botões de compartilhamento
function addShareButtons() {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-container';
    shareContainer.innerHTML = `
        <p>Compartilhe este site:</p>
        <button onclick="shareOnSocial('facebook')">Facebook</button>
        <button onclick="shareOnSocial('twitter')">Twitter</button>
        <button onclick="shareOnSocial('whatsapp')">WhatsApp</button>
    `;
    
    shareContainer.style.cssText = `
        text-align: center;
        margin: 2rem 0;
        padding: 1rem;
        background: var(--bg-light);
        border-radius: 10px;
    `;
    
    shareContainer.querySelector('p').style.cssText = `
        margin-bottom: 1rem;
        color: var(--text-dark);
        font-weight: 600;
    `;
    
    shareContainer.querySelectorAll('button').forEach(btn => {
        btn.style.cssText = `
            margin: 0 0.5rem;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 20px;
            background: var(--primary-color);
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = 'var(--shadow-hover)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
        });
    });
    
    // Adiciona ao footer
    const footer = document.querySelector('.footer .container');
    if (footer) {
        footer.appendChild(shareContainer);
    }
}

// Inicializa os botões de compartilhamento quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', addShareButtons);

// Função para mostrar opções de produtos
function showProductOption(option) {
    // Remove classe active de todas as tabs e opções
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.product-option').forEach(opt => opt.classList.remove('active'));
    
    // Adiciona classe active na tab e opção selecionada
    if (option === 'complete') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('completeOption').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('customOption').classList.add('active');
    }
}

// Função para calcular total da cesta personalizada
function calculateCustomTotal() {
    const checkboxes = document.querySelectorAll('#customOption input[type="checkbox"]:checked');
    let total = 0;
    
    checkboxes.forEach(checkbox => {
        total += parseFloat(checkbox.value);
    });
    
    // Atualiza o display do total
    const totalElement = document.getElementById('customTotal');
    if (totalElement) {
        totalElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    return total;
}

// Função para selecionar produto
function selectProduct(type, price) {
    // Salva a seleção do produto
    window.selectedProduct = {
        type: type,
        price: price,
        items: type === 'custom' ? getSelectedItems() : null
    };
    
    // Atualiza o preço no resumo do pedido
    updateOrderSummary(price);
    
    // Rola para a seção de pagamento
    scrollToSection('payment');
    
    // Mostra notificação
    const productName = type === 'complete' ? 'Cesta Dia das Mães Especial' : 'Cesta Personalizada';
    showNotification(`${productName} selecionada! Valor: R$ ${price.toFixed(2).replace('.', ',')}`, 'success');
}

// Função para obter itens selecionados
function getSelectedItems() {
    const items = [];
    const checkboxes = document.querySelectorAll('#customOption input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const label = document.querySelector(`label[for="${checkbox.id}"]`).textContent;
        items.push({
            name: label,
            price: parseFloat(checkbox.value)
        });
    });
    
    return items;
}

// Função para atualizar resumo do pedido
function updateOrderSummary(price) {
    const summaryProductName = document.getElementById('summaryProductName');
    const summaryProductPrice = document.getElementById('summaryProductPrice');
    const summaryTotalPrice = document.getElementById('summaryTotalPrice');
    
    if (summaryProductName && summaryProductPrice && summaryTotalPrice) {
        if (window.selectedProduct && window.selectedProduct.type === 'custom') {
            summaryProductName.textContent = 'Cesta Personalizada';
        } else if (window.selectedProduct && window.selectedProduct.type === 'complete') {
            summaryProductName.textContent = 'Cesta Dia das Mães Especial';
        } else {
            summaryProductName.textContent = 'Selecione um produto';
        }
        
        const formattedPrice = price > 0 ? `R$ ${price.toFixed(2).replace('.', ',')}` : 'R$ 0,00';
        summaryProductPrice.textContent = formattedPrice;
        summaryTotalPrice.textContent = formattedPrice;
        
        // Atualiza valor no checkout DentPeg
        const dentpegAmount = document.getElementById('dentpegAmount');
        if (dentpegAmount) {
            dentpegAmount.textContent = formattedPrice;
        }
    }
}

// Configura event listeners para checkboxes da cesta personalizada
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('#customOption input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateCustomTotal);
    });
});

// Inicializa funcionalidades de urgência e confiança
document.addEventListener('DOMContentLoaded', function() {
    if (window.CONFIG) {
        // Atualiza chave PIX no HTML
        const pixKeyElement = document.getElementById('pixKey');
        if (pixKeyElement && window.CONFIG.pixKey) {
            pixKeyElement.textContent = window.CONFIG.pixKey;
        }
    }
    
    // Inicia contador de pessoas online
    updateOnlineCount();
    setInterval(updateOnlineCount, 30000); // Atualiza a cada 30 segundos
    
    // Inicia contador de frete grátis
    updateFreeShippingCount();
    
    // Inicia notificações de compras
    startPurchaseNotifications();
});

// Função para atualizar contador de pessoas online
function updateOnlineCount() {
    const onlineElement = document.getElementById('onlineCount');
    if (onlineElement) {
        // Gera número aleatório entre 25 e 87
        const count = Math.floor(Math.random() * 63) + 25;
        onlineElement.textContent = count;
    }
}

// Função para atualizar contador de frete grátis
function updateFreeShippingCount() {
    const freeShippingElement = document.getElementById('freeShippingCount');
    if (freeShippingElement && window.CONFIG) {
        const limit = window.CONFIG.freeShippingLimit || 100;
        const current = window.CONFIG.currentOrders || 0;
        const remaining = Math.max(0, limit - current);
        freeShippingElement.textContent = remaining;
    }
}

// Função para iniciar notificações de compras
function startPurchaseNotifications() {
    // Primeira notificação após 5 segundos
    setTimeout(showPurchaseNotification, 5000);
    
    // Notificações subsequentes a cada 15-25 segundos
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% de chance de mostrar notificação
            showPurchaseNotification();
        }
    }, Math.random() * 10000 + 15000);
}

// Função para mostrar notificação de compra
function showPurchaseNotification() {
    const container = document.getElementById('purchaseNotifications');
    if (!container) return;
    
    const config = window.CONFIG || {};
    const names = config.customerNames || ['Cliente'];
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Curitiba'];
    
    const customerName = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const time = 'há poucos segundos';
    
    const notification = document.createElement('div');
    notification.className = 'purchase-notification';
    notification.innerHTML = `
        <div class="purchase-customer">${customerName} acabou de garantir!</div>
        <div class="purchase-location">📍 ${city}</div>
        <div class="purchase-time">Comprou a Cesta Café da Manhã + Chocolates</div>
    `;
    
    container.appendChild(notification);
    
    // Remove a notificação após 8 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 8000);
    
    // Limita a 3 notificações no máximo
    const notifications = container.querySelectorAll('.purchase-notification');
    if (notifications.length > 3) {
        notifications[0].remove();
    }
}

// Função para calcular o total da cesta personalizada
function updateCustomTotal() {
    const checkboxes = document.querySelectorAll('.custom-checkbox:checked');
    let total = 0;
    const allItems = document.querySelectorAll('.custom-checkbox');
    const allChecked = document.querySelectorAll('.custom-checkbox:checked');
    
    checkboxes.forEach(checkbox => {
        total += parseFloat(checkbox.dataset.price);
    });
    
    const totalElement = document.getElementById('custom-total');
    if (totalElement) {
        totalElement.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    }
    
    // Mostra oferta especial se todos os itens estiverem selecionados
    const offerElement = document.getElementById('complete-offer');
    if (offerElement) {
        if (allChecked.length === allItems.length && allItems.length > 0) {
            offerElement.style.display = 'block';
        } else {
            offerElement.style.display = 'none';
        }
    }
}

// Função para comprar cesta personalizada
function buyCustomBasket() {
    const checkboxes = document.querySelectorAll('.custom-checkbox:checked');
    const allItems = document.querySelectorAll('.custom-checkbox');
    const allChecked = document.querySelectorAll('.custom-checkbox:checked');
    
    if (checkboxes.length === 0) {
        alert('Selecione pelo menos um item para montar sua cesta!');
        return;
    }
    
    // Se todos os itens estiverem selecionados, oferece a cesta completa com desconto
    if (allChecked.length === allItems.length && allItems.length > 0) {
        const confirmBuy = confirm('🎉 OFERTA ESPECIAL!\n\nVocê selecionou TODOS os itens!\n\nTotal individual: R$ 144,91\nCesta Completa: R$ 49,99\nEconomia: R$ 94,92\n\nDeseja comprar a Cesta Completa com desconto?');
        if (confirmBuy) {
            selectProduct('complete', 49.99);
            return;
        }
    }
    
    let total = 0;
    const items = [];
    checkboxes.forEach(checkbox => {
        total += parseFloat(checkbox.dataset.price);
        items.push(checkbox.dataset.name);
    });
    
    const itemList = items.join(', ');
    const confirmBuy = confirm('Itens selecionados:\n' + itemList + '\n\nTotal: R$ ' + total.toFixed(2).replace('.', ',') + '\n\nDeseja continuar com a compra?');
    if (confirmBuy) {
        selectProduct('custom', total);
    }
}
