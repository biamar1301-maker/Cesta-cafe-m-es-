// Configurações do proprietário - EDITE ESTES VALORES
const _a = atob;
const CONFIG = {
    // Link de checkout DentPeg (pagamento via PIX/DePix)
    get dentpegCheckoutUrl() { return _a("aHR0cHM6Ly9kZW50cGVnLmNvbS9jaGVja291dC9tYXJpYW5hYXZlbGFy"); },
    
    // Seu número de WhatsApp (com DDD, sem o 55)
    get whatsappNumber() { return _a("MTE5ODA5MjQ3MDQ="); },
    
    // Mensagem personalizada para WhatsApp
    whatsappMessage: "Olá! Acabei de fazer um pedido no site Dia das Mães. Número do pedido: #{orderNumber}. Por favor, confirmem o recebimento.",
    
    // Configurações de produtos
    products: {
        complete: {
            name: "Cesta Dia das Mães Especial",
            price: 49.99,
            description: "Buquê de flores frescas, urso de pelúcia, pães, bolo, croissant, suco natural, iogurte, granola, frutas, queijo, geleia, manteiga e caneca personalizada"
        }
    },
    
    // Configurações de urgência
    freeShippingLimit: 100, // Frete grátis para as primeiras X compras
    currentOrders: 87, // Quantidade atual de pedidos (inicia com este valor)
    
    // Nomes para simular compras (pode adicionar mais)
    customerNames: [
        "Maria Silva", "João Santos", "Ana Oliveira", "Carlos Costa", 
        "Fernanda Lima", "Roberto Mendes", "Juliana Pereira", "Pedro Henrique",
        "Camila Souza", "Lucas Ferreira", "Isabella Almeida", "Gabriel Costa"
    ]
};

// Exporta configurações
window.CONFIG = CONFIG;
