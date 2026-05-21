const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            score: 0,
            attemptsLeft: 6, // 6 chances exigidas por exercício
            gameOver: false,
            showAnswer: false,
            feedbackMsg: '',
            feedbackType: '',
            userSelections: [], // Guarda quais IDs o usuário já clicou nesta rodada
            
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
                    description: "O usuário seleciona um arquivo de vídeo de 5GB para anexar e clica em 'Enviar'. O botão perde o clique e nada muda na tela. Ele espera 5 minutos olhando para a mesma interface sem saber se travou ou se está carregando.",
                    visualHint: "A tela congela. Não há barra de carregamento ou mensagem de 'Aguarde...'",
                    correctId: 0, // 1. Visibilidade do status
                    explanation: "O sistema deve manter o usuário informado sobre o que está acontecendo por meio de feedbacks apropriados e em tempo razoável."
                },
                {
                    description: "Em um aplicativo de agendamento de consultas médicas para idosos, ao tentar cancelar uma consulta, o sistema exibe um alerta dizendo: 'Deseja executar um Drop na Query de agendamento?'.",
                    visualHint: "Alerta: DROP QUERY executado com sucesso.",
                    correctId: 1, // 2. Mundo real
                    explanation: "O sistema deve falar a linguagem do usuário, com palavras e conceitos familiares a ele, e não jargões técnicos de banco de dados."
                },
                {
                    description: "Um usuário clica acidentalmente em um banner de 'Assinar Plano Premium'. A assinatura é ativada instantaneamente, mas não existe nenhum botão de 'Desfazer' ou aba para cancelar no painel, obrigando-o a ligar para o suporte.",
                    visualHint: "Aviso: Plano ativado. (Falta botão de cancelamento).",
                    correctId: 2, // 3. Liberdade do usuário
                    explanation: "Usuários frequentemente escolhem funções por engano e precisam de uma 'saída de emergência' clara (como Desfazer ou Cancelar) sem passar por processos longos."
                },
                {
                    description: "O site possui botões de 'Salvar' verdes na página de perfil. No entanto, na página de pagamentos, o botão de 'Salvar' é vermelho, e o de 'Cancelar' é verde.",
                    visualHint: "Botão Salvar = Vermelho | Botão Cancelar = Verde",
                    correctId: 3, // 4. Consistência e padrões
                    explanation: "Os usuários não deveriam ter que se perguntar se palavras, situações ou ações diferentes significam a mesma coisa. Padrões de cores e posição devem ser mantidos."
                },
                {
                    description: "Um formulário de cadastro pede a data de nascimento. Não há máscara ou instrução. O usuário digita '15/08/1990' e clica em enviar, mas a página recarrega e apaga tudo, mostrando o erro 'Use o formato MM-DD-AAAA'.",
                    visualHint: "Campo [ Data de Nascimento ] vazio sem placeholders.",
                    correctId: 4, // 5. Prevenção de erros
                    explanation: "Ainda melhor que uma boa mensagem de erro é um design cuidadoso que previne o problema. O campo deveria ter máscara ou regras claras de formatação visíveis."
                },
                {
                    description: "Um e-commerce gera um 'Código de Desconto' de 12 dígitos em uma janela. Na tela seguinte do carrinho, ele exige que o usuário digite o código de memória, mas o código não aparece mais na tela atual.",
                    visualHint: "Input exigindo código gerado três telas atrás.",
                    correctId: 5, // 6. Reconhecimento ao invés de memorização
                    explanation: "Minimize a carga de memória do usuário. Objetos, ações e opções devem ser visíveis ou facilmente recuperáveis quando necessários."
                },
                {
                    description: "Um software utilizado 8 horas por dia por contadores experientes obriga que, para cada nota fiscal gerada, eles passem por um tutorial wizard de 5 etapas com o mouse, sem permitir atalhos de teclado.",
                    visualHint: "Passo 1 de 5 - Clique em avançar para continuar (Sem atalho CTRL+N).",
                    correctId: 6, // 7. Flexibilidade e eficiência
                    explanation: "Aceleradores (como atalhos de teclado) podem não ser vistos pelo usuário novato, mas aceleram a interação do usuário experiente, permitindo que o sistema atenda ambos."
                },
                {
                    description: "A página principal de um buscador possui 3 colunas de anúncios piscantes, um vídeo tocando automaticamente, 40 links no rodapé e pop-ups de newsletter, ofuscando a própria barra de pesquisa no meio.",
                    visualHint: "Interface com carga visual extrema e excesso de informações irrelevantes.",
                    correctId: 7, // 8. Estética e design minimalista
                    explanation: "Os diálogos não devem conter informações irrelevantes. Cada unidade extra de informação compete com as unidades relevantes de informação, diminuindo sua visibilidade."
                },
                {
                    description: "Ao tentar acessar uma página excluída, em vez de sugerir links úteis ou uma barra de busca para voltar ao início, o sistema exibe apenas: 'HTTP Status 404 - Exception Null Pointer at Root'.",
                    visualHint: "Tela Branca com Erro Técnico",
                    correctId: 8, // 9. Recuperação de erros
                    explanation: "Mensagens de erro devem ser expressas em linguagem clara (sem códigos), indicando precisamente o problema e sugerindo construtivamente uma solução."
                },
                {
                    description: "Um sistema robusto de edição de vídeo em 3D possui dezenas de ferramentas complexas. O usuário tenta entender como renderizar o projeto, mas ao clicar no ícone de 'Ajuda (?)', a página exibe o texto 'Em construção'.",
                    visualHint: "Seção de Documentação Vazia.",
                    correctId: 9, // 10. Ajuda e documentação
                    explanation: "Embora seja melhor que o sistema possa ser usado sem documentação, é necessário prover ajuda focada nas tarefas do usuário, fácil de pesquisar e com passos concretos."
                }
            ]
        };
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex) / this.questions.length) * 100;
        }
    },
    methods: {
        selectOption(selectedIndex) {
            // Se já revelou a resposta ou já clicou nesta opção, ignora
            if (this.showAnswer || this.userSelections.includes(selectedIndex)) return;

            this.userSelections.push(selectedIndex);

            if (selectedIndex === this.currentQuestion.correctId) {
                // Acertou
                this.score++;
                this.showAnswer = true;
                this.feedbackType = 'success';
                this.feedbackMsg = `Você acertou! <strong>${this.currentQuestion.explanation}</strong>`;
            } else {
                // Errou
                this.attemptsLeft--;
                
                if (this.attemptsLeft > 0) {
                    this.feedbackType = 'warning';
                    this.feedbackMsg = `Heurística incorreta. Avalie o cenário novamente. Você ainda tem <strong>${this.attemptsLeft} tentativas</strong> para esta página.`;
                } else {
                    // Zerou as chances para esta página
                    this.showAnswer = true;
                    this.feedbackType = 'error';
                    const correctName = this.heuristics[this.currentQuestion.correctId];
                    this.feedbackMsg = `Tentativas esgotadas! A falha era na heurística: <strong>${correctName}</strong>.<br><br>${this.currentQuestion.explanation}`;
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
            this.attemptsLeft = 6; // Restaura as 6 chances para a nova página
        },
        resetGame() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.gameOver = false;
            this.resetTurn();
        }
    }
}).mount('#app');