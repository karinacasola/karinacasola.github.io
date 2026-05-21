const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            score: 0,
            attemptsLeft: 6,
            gameOver: false,
            showAnswer: false,
            feedbackMsg: '',
            feedbackType: '',
            userSelections: [],
            
            heuristics: [
                "1. Visibilidade do status do sistema",
                "2. Correspondência entre o sistema e o mundo real",
                "3. Controle e liberdade do usuário",
                "4. Consistência e padrões",
                "5. Prevenção de erros",
                "6. Reconhecimento em vez de memorização",
                "7. Flexibilidade e eficiência de uso",
                "8. Estética e design minimalista",
                "9. Ajudar os usuários a reconhecer, diagnosticar e se recuperar de erros",
                "10. Ajuda e documentação"
            ],

            questions: [
                {
                    title: "Envio de Arquivos",
                    context: "O usuário selecionou um arquivo pesado e clicou em Enviar. A tela está assim há 3 minutos.",
                    correctId: 0, // Visibilidade do Status
                    explanation: "Falta feedback visual (como um spinner ou barra de progresso) mostrando que o sistema está processando. O usuário não sabe se travou ou se está carregando.",
                    htmlMockup: `
                        <h3>Upload de Relatório Anual</h3>
                        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
                            <i class="bi bi-file-earmark-pdf" style="font-size: 24px;"></i> relatorio_final_2025.pdf (500 MB)
                        </div>
                        <div class="mock-btn blue" style="opacity: 0.8; cursor: wait;">Enviar Arquivo...</div>
                    `
                },
                {
                    title: "Agendamento Médico",
                    context: "A idosa Dona Maria tentou desmarcar uma consulta e recebeu este aviso.",
                    correctId: 1, // Correspondência com o mundo real
                    explanation: "A mensagem exibe linguagem técnica de banco de dados em vez de falar a linguagem do usuário (ex: 'Sua consulta foi cancelada').",
                    htmlMockup: `
                        <div class="mock-modal">
                            <h3 style="color: #d9534f;"><i class="bi bi-exclamation-triangle"></i> ALERT_SYSTEM_MSG</h3>
                            <p style="font-family: monospace; background: #f4f4f4; padding: 10px;">
                                UPDATE consultas_db SET status='CANCELLED' WHERE paciente_id=4021;<br>
                                Query executada com sucesso. Row affected: 1.
                            </p>
                            <div class="mock-btn blue">OK_BUTTON</div>
                        </div>
                    `
                },
                {
                    title: "Assinatura Acidental",
                    context: "O usuário clicou sem querer no banner e ativou um plano pago. Agora ele quer desfazer a ação.",
                    correctId: 2, // Controle e liberdade
                    explanation: "O usuário ativou algo acidentalmente e o sistema não oferece um botão de 'Desfazer', 'Cancelar' ou fechar (X) na tela de sucesso.",
                    htmlMockup: `
                        <div class="mock-alert success" style="height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <i class="bi bi-check-circle" style="font-size: 40px; margin-bottom: 10px;"></i>
                            <h2>PLANO PREMIUM ATIVADO!</h2>
                            <p>O valor de R$99,90 já foi cobrado no seu cartão.</p>
                            </div>
                    `
                },
                {
                    title: "Painel de Configurações",
                    context: "O usuário está preenchendo seu perfil e se depara com estes botões no final da página.",
                    correctId: 3, // Consistência e padrões
                    explanation: "Cores e convenções invertidas. O botão verde (normalmente de ação positiva/salvar) está sendo usado para deletar, e o vermelho para salvar, confundindo o usuário.",
                    htmlMockup: `
                        <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 10px;">Configurações da Conta</h3>
                        <p>Deseja manter as alterações no seu perfil?</p>
                        <br>
                        <div class="mock-btn red">Salvar Alterações</div>
                        <div class="mock-btn green">Excluir Conta Permanentemente</div>
                    `
                },
                {
                    title: "Formulário de Cadastro",
                    context: "O usuário tentou digitar sua data de nascimento, mas recebeu um erro brusco após enviar.",
                    correctId: 4, // Prevenção de erros
                    explanation: "O sistema permitiu o erro por não oferecer uma máscara, formatação ou dica visual no campo de data de nascimento antes do envio.",
                    htmlMockup: `
                        <h3>Seus Dados</h3>
                        <label>Data de Nascimento:</label>
                        <input type="text" class="mock-input" value="15/08/1990">
                        <div class="mock-alert error" style="padding: 8px; margin-top: -5px; font-size: 12px;">
                            <i class="bi bi-x-circle"></i> O formato deve ser AAAA-MM-DD. Tente novamente.
                        </div>
                        <div class="mock-btn blue">Continuar Cadastro</div>
                    `
                },
                {
                    title: "Carrinho de Compras",
                    context: "O site gerou um código de desconto na página anterior e agora, no checkout, pede o código.",
                    correctId: 5, // Reconhecimento vs Memorização
                    explanation: "O sistema obriga o usuário a decorar uma informação da tela anterior em vez de apresentá-la novamente ou aplicá-la automaticamente.",
                    htmlMockup: `
                        <h3>Finalizar Compra</h3>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 4px;">
                            <strong>Total: R$ 150,00</strong>
                            <hr>
                            <label>Digite o código de 16 dígitos que foi mostrado na tela inicial:</label>
                            <input type="text" class="mock-input" placeholder="XXXX-XXXX-XXXX-XXXX">
                        </div>
                        <div class="mock-btn green" style="margin-top: 15px;">Pagar Agora</div>
                    `
                },
                {
                    title: "Sistema ERP para Contadores",
                    context: "Um contador lança 500 notas fiscais por dia. Para CADA nota, ele precisa passar por essa tela.",
                    correctId: 6, // Flexibilidade e eficiência
                    explanation: "Não há atalhos de teclado (aceleradores) ou opções em lote para usuários experientes. Todos são obrigados a usar o mouse num passo-a-passo demorado.",
                    htmlMockup: `
                        <h3>Lançamento de Nota (Passo 1 de 5)</h3>
                        <p>Bem-vindo ao assistente de criação de Notas Fiscais!</p>
                        <p>Clique no botão 'Avançar com o mouse' para prosseguir para a etapa de Valores.</p>
                        <br>
                        <div class="mock-btn" style="background: #ccc; color: #666;">Voltar</div>
                        <div class="mock-btn blue">Avançar (Clique Aqui)</div>
                        <p style="font-size: 10px; color: #999; margin-top: 20px;">* Atalhos de teclado desativados por segurança.</p>
                    `
                },
                {
                    title: "Portal de Notícias",
                    context: "O usuário só quer ler a manchete do dia, mas a interface apresenta este cenário caótico.",
                    correctId: 7, // Estética e design minimalista
                    explanation: "A interface contém excesso de informações irrelevantes, anúncios piscantes e poluição visual que competem com o conteúdo principal.",
                    htmlMockup: `
                        <div class="mock-annoying">💥 COMPRE AGORA!!! 50% OFF 💥</div>
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <div style="flex: 1; background: #ffeb3b; padding: 10px; font-size: 10px;">Assine a Newsletter!</div>
                            <div style="flex: 2; padding: 10px; border: 1px solid #ccc;">
                                <h4 style="margin:0;">Manchete Oculta</h4>
                                <p style="font-size: 12px;">Texto espremido no meio da tela...</p>
                            </div>
                            <div style="flex: 1; background: #000; color: #fff; padding: 10px; font-size: 10px;">Vídeo Autoplay ▶️</div>
                        </div>
                    `
                },
                {
                    title: "Página Não Encontrada",
                    context: "O usuário digitou um link antigo que não existe mais e o servidor devolveu esta tela.",
                    correctId: 8, // Diagnosticar e recuperar de erros
                    explanation: "A mensagem de erro é puramente técnica (código quebrado), não explica de forma amigável o que houve e não sugere nenhum link para o usuário voltar à home.",
                    htmlMockup: `
                        <div class="mock-code-error">
FATAL ERROR: Uncaught TypeError: Cannot read properties of null (reading 'fetchData')
    at /var/www/html/app/controllers/MainController.php:404
    at Router->resolve() in /var/www/html/core/Router.php:12
    at Kernel->handle() in /var/www/html/index.php:5
                        </div>
                    `
                },
                {
                    title: "Software de Edição de Vídeo",
                    context: "O usuário não sabe como exportar o vídeo, clica no botão 'Ajuda e Suporte' e vê isso.",
                    correctId: 9, // Ajuda e documentação
                    explanation: "A documentação está vazia. O sistema deveria oferecer tutoriais claros, barra de pesquisa ou passos concretos voltados às tarefas principais do usuário.",
                    htmlMockup: `
                        <h3>Central de Ajuda</h3>
                        <div style="text-align: center; padding: 40px 10px;">
                            <i class="bi bi-cone-striped" style="font-size: 40px; color: #f39c12;"></i>
                            <h4 style="margin-top: 10px;">Página em Construção</h4>
                            <p style="color: #666;">Nossa equipe ainda está escrevendo os manuais deste software. Tente descobrir sozinho por enquanto!</p>
                        </div>
                    `
                }
            ]
        };
    },
    computed: {
        currentQuestion() { return this.questions[this.currentQuestionIndex]; },
        progressPercentage() { return ((this.currentQuestionIndex) / this.questions.length) * 100; }
    },
    methods: {
        selectOption(selectedIndex) {
            if (this.showAnswer || this.userSelections.includes(selectedIndex)) return;

            this.userSelections.push(selectedIndex);

            if (selectedIndex === this.currentQuestion.correctId) {
                this.score++;
                this.showAnswer = true;
                this.feedbackType = 'success';
                this.feedbackMsg = `A heurística violada é a <strong>${this.heuristics[selectedIndex]}</strong>.<br><br>${this.currentQuestion.explanation}`;
            } else {
                this.attemptsLeft--;
                
                if (this.attemptsLeft > 0) {
                    this.feedbackType = 'warning';
                    this.feedbackMsg = `Heurística incorreta. Olhe a interface simulada novamente. Você ainda tem <strong>${this.attemptsLeft} tentativas</strong> para esta página.`;
                } else {
                    this.showAnswer = true;
                    this.feedbackType = 'error';
                    this.feedbackMsg = `Tentativas esgotadas! A falha era na heurística: <strong>${this.heuristics[this.currentQuestion.correctId]}</strong>.<br><br>${this.currentQuestion.explanation}`;
                }
            }
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.resetTurn();
            } else {
                this.gameOver = true;
            }
        },
        resetTurn() {
            this.showAnswer = false;
            this.feedbackMsg = '';
            this.feedbackType = '';
            this.userSelections = [];
            this.attemptsLeft = 6;
        },
        resetGame() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.gameOver = false;
            this.resetTurn();
        }
    }
}).mount('#app');