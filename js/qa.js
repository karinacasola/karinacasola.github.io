const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            userSelection: null,
            attemptsLeft: 3,
            score: 0,
            logs: [],
            isTyping: false,
            transitionDelay: false,
            feedbackMsg: "",
            feedbackType: "",
            quizFinished: false,
            userAnswersReport: [], // Para o export JSON
            
            // Suas 20 questões mapeadas
            questions: [
                {
                    id: 1,
                    text: "A principal diferença entre os processos de Verificação e Validação no desenvolvimento de software é que:",
                    options: [
                        "A verificação testa o software em execução com o cliente, enquanto a validação revisa o código-fonte.",
                        "A verificação avalia se os artefatos estão sendo construídos corretamente, enquanto a validação avalia se o software atende às necessidades do usuário.",
                        "A verificação é focada na interface gráfica, e a validação foca exclusivamente no banco de dados.",
                        "Ambos são sinônimos e representam a execução de testes automatizados no final do projeto."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 2,
                    text: "Durante a etapa de 'Planejamento' de testes para um sistema, qual é o principal benefício alcançado pela equipe?",
                    options: [
                        "Corrigir falhas diretamente no código de produção.",
                        "Executar o sistema na prática para encontrar inconsistências.",
                        "Mapear antecipadamente as exigências normativas através de um plano preliminar de testes.",
                        "Substituir a necessidade de documentação de requisitos pelo plano de testes."
                    ],
                    correctAnswer: 2
                },
                {
                    id: 3,
                    text: "Um analista de qualidade (QA) está revisando a documentação de requisitos antes do início da programação para checar se a regra de validade dos EPIs está descrita de forma lógica. Essa atividade é um exemplo prático de:",
                    options: ["Verificação.", "Validação.", "Teste Funcional.", "Teste de Desempenho."],
                    correctAnswer: 0
                },
                {
                    id: 4,
                    text: "Um testador acessa o sistema de EPIs e tenta registrar a entrega de um equipamento com a validade expirada para confirmar se o sistema bloqueia a ação. Essa atividade é um exemplo prático de:",
                    options: ["Verificação estrutural.", "Validação.", "Revisão de artefatos.", "Teste de integração de hardware."],
                    correctAnswer: 1
                },
                {
                    id: 5,
                    text: "Durante os testes, a equipe descobriu que o sistema permite realizar empréstimos de EPIs para colaboradores inativos. Esse problema é classificado primariamente como uma falha de:",
                    options: ["Desempenho do servidor.", "Interface gráfica do usuário.", "Hardware.", "Lógica ou de regra de negócio."],
                    correctAnswer: 3
                },
                {
                    id: 6,
                    text: "Para identificar especificamente que o sistema permite ações indevidas com 'colaboradores inativos', a metodologia mais adequada a ser aplicada pela equipe de testes é:",
                    options: [
                        "O Teste Funcional, prevendo em seu roteiro o uso de dados de funcionários inativos.",
                        "O Teste Estrutural (Caixa Branca), focado na arquitetura do servidor.",
                        "O Teste de Usabilidade, verificando as cores da interface.",
                        "O Teste de Carga, simulando milhares de acessos."
                    ],
                    correctAnswer: 0
                },
                {
                    id: 7,
                    text: "Ao encontrar o erro do 'colaborador inativo', a equipe propõe uma solução técnica. Qual das alternativas abaixo representa a abordagem técnica mais segura para corrigir a falha?",
                    options: [
                        "Ocultar o botão 'Salvar' na interface gráfica usando CSS.",
                        "Implementar uma validação no back-end que consulte o status do colaborador no banco de dados antes de gravar o registro.",
                        "Treinar os funcionários do RH para não emprestarem EPIs para demitidos.",
                        "Criar um teste automatizado de interface que pule os inativos."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 8,
                    text: "O documento 'Plano de Teste' é essencial para a organização do trabalho. Quais são elementos obrigatórios na composição deste documento formal?",
                    options: [
                        "Código-fonte e modelagem de banco de dados.",
                        "Objetivo do teste, estratégia de execução e definição dos casos de teste.",
                        "Manuais do usuário e guias de identidade visual.",
                        "Relatórios de bug e diagramas de infraestrutura."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 9,
                    text: "Iniciar a execução de testes sem um roteiro (script) previamente definido e documentado é uma má prática porque pode resultar em:",
                    options: [
                        "Redução do tempo necessário para achar bugs.",
                        "Aumento da confiabilidade do processo.",
                        "Inconsistência na validação dos resultados, impedindo o rastreamento das falhas.",
                        "Redução do custo do projeto."
                    ],
                    correctAnswer: 2
                },
                {
                    id: 10,
                    text: "A definição de 'Critérios de Aceitação' dentro de uma estratégia de teste serve para:",
                    options: [
                        "Avaliar o desempenho financeiro do projeto.",
                        "Determinar as condições exatas que o software deve satisfazer para que a entrega seja aprovada.",
                        "Definir qual linguagem de programação será usada.",
                        "Aceitar ou rejeitar o layout proposto pelo designer."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 11,
                    text: "Durante a execução de um caso de teste, o profissional de QA anota o que o sistema fez na prática e compara com o que o documento de requisitos dizia que ele deveria fazer. Esse profissional está comparando:",
                    options: [
                        "O código-fonte com o banco de dados.",
                        "O ambiente de desenvolvimento com o ambiente de produção.",
                        "O resultado obtido (real) com o resultado esperado.",
                        "A regra de negócio com a interface gráfica."
                    ],
                    correctAnswer: 2
                },
                {
                    id: 12,
                    text: "Reconhecer e aplicar normas técnicas, métodos e boas práticas de testes no processo de desenvolvimento é fundamental para:",
                    options: [
                        "Dispensar a etapa de homologação com o cliente.",
                        "Garantir que o processo seja auditável, consistente, padronizado e confiável.",
                        "Substituir totalmente os programadores por testadores.",
                        "Garantir que o software nunca apresentará falhas no futuro."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 13,
                    text: "A descoberta de que o sistema de gerenciamento permite que a empresa realize empréstimos duplicados do mesmo EPI, para o mesmo colaborador no mesmo dia, é uma violação clara de:",
                    options: [
                        "Segurança de rede.",
                        "Requisito não-funcional de desempenho.",
                        "Regra de negócio e fluxo de trabalho da empresa.",
                        "Normalização de banco de dados."
                    ],
                    correctAnswer: 2
                },
                {
                    id: 14,
                    text: "Uma Estratégia de Teste bem definida se diferencia de um simples roteiro de testes porque ela deve:",
                    options: [
                        "Conter apenas o passo a passo de cliques na tela.",
                        "Estabelecer as diretrizes fundamentais, definindo abordagem, tipos de teste e critérios de aceitação com clareza.",
                        "Focar exclusivamente nos testes exploratórios manuais.",
                        "Ser aplicada somente na última semana de desenvolvimento do software."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 15,
                    text: "Qual é o papel da etapa de 'Aplicação' no processo que garante a qualidade do software?",
                    options: [
                        "Planejar a documentação técnica.",
                        "Comparar os resultados gerenciais com as metas financeiras.",
                        "Executar o sistema na prática para identificar inconsistências e testar sua robustez frente ao uso real.",
                        "Compilar o código fonte do sistema para o ambiente de produção."
                    ],
                    correctAnswer: 2
                },
                {
                    id: 16,
                    text: "O teste responsável por avaliar se uma funcionalidade específica realiza exatamente o que o requisito descreve é o:",
                    options: ["Teste de Carga.", "Teste Estrutural.", "Teste Exploratório livre.", "Teste Funcional."],
                    correctAnswer: 3
                },
                {
                    id: 17,
                    text: "Na etapa de 'Análise' do processo de testes, a equipe consolida os dados e corrige as falhas encontradas. Isso garante diretamente a:",
                    options: [
                        "Rastreabilidade e a conformidade com as normas (ex: normas de segurança do trabalho).",
                        "Exclusão de logs antigos do sistema.",
                        "Melhoria na identidade visual das telas do sistema.",
                        "Redução do escopo inicial do projeto."
                    ],
                    correctAnswer: 0
                },
                {
                    id: 18,
                    text: "Qual das sentenças abaixo melhor exemplifica uma solução técnica focada em REST/Back-end para evitar o empréstimo de EPIs com validade vencida?",
                    options: [
                        "Colocar uma cor vermelha na data da interface caso esteja vencida.",
                        "Criar uma restrição lógica na API que consulte a data e retorne HTTP 400 (Bad Request) caso esteja menor que hoje.",
                        "Escrever um manual de instruções orientando o estoquista a olhar a data.",
                        "Criar um teste funcional para reportar o bug."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 19,
                    text: "Um Teste Funcional é frequentemente chamado de 'Teste de Caixa Preta'. Isso ocorre porque:",
                    options: [
                        "O testador analisa minuciosamente as linhas de código fonte.",
                        "O testador foca nas entradas fornecidas e nas saídas geradas, verificando o cumprimento das regras sem ver o código.",
                        "O teste é executado com o monitor desligado para avaliar a acessibilidade.",
                        "O teste lida apenas com bancos de dados criptografados."
                    ],
                    correctAnswer: 1
                },
                {
                    id: 20,
                    text: "Se um defeito de 'Validação' chega ao ambiente de produção, o que isso geralmente indica sobre o processo de qualidade da equipe?",
                    options: [
                        "Que o processo de codificação foi perfeitamente executado.",
                        "Que a equipe testou exaustivamente as regras de negócio.",
                        "Que houve falha em testar se o software resolvia corretamente o problema proposto e atendia às necessidades reais.",
                        "Que o cliente alterou o código fonte sozinho."
                    ],
                    correctAnswer: 2
                }
            ]
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        }
    },
    mounted() {
        this.addLog("Inicializando módulo de Qualidade de Software...", "log-info");
        setTimeout(() => {
            this.loadQuestion();
        }, 1000);
    },
    methods: {
        getLetter(index) {
            return String.fromCharCode(65 + index); // Converte 0, 1, 2 para A, B, C...
        },

        selectOption(idx) {
            if (this.transitionDelay) return;
            this.userSelection = idx;
            this.feedbackMsg = "";
        },

        async submitAnswer() {
            if (this.userSelection === null || this.transitionDelay) return;
            this.transitionDelay = true;

            const isCorrect = this.userSelection === this.currentQuestion.correctAnswer;
            
            // Registra a tentativa para o relatório
            const attemptData = {
                questionId: this.currentQuestion.id,
                questionText: this.currentQuestion.text,
                selectedAnswer: this.currentQuestion.options[this.userSelection],
                correctAnswer: this.currentQuestion.options[this.currentQuestion.correctAnswer],
                isCorrect: isCorrect,
                attemptsRemaining: isCorrect ? this.attemptsLeft : this.attemptsLeft - 1
            };

            if (isCorrect) {
                this.feedbackType = "success";
                this.feedbackMsg = "Resposta Correta! Validação bem sucedida.";
                this.score++;
                this.addLog(`Questão ${this.currentQuestion.id} validada com sucesso. Avançando...`, "log-success");
                
                this.userAnswersReport.push(attemptData);
                
                setTimeout(() => {
                    this.nextQuestion();
                }, 2000);

            } else {
                this.attemptsLeft--;
                this.feedbackType = "error";
                
                if (this.attemptsLeft > 0) {
                    this.feedbackMsg = `Resposta Incorreta. Você tem mais ${this.attemptsLeft} tentativa(s).`;
                    this.addLog(`Erro de execução na Questão ${this.currentQuestion.id}. Tentativas restantes: ${this.attemptsLeft}`, "log-warning");
                    this.transitionDelay = false;
                } else {
                    this.feedbackMsg = `Zero tentativas restantes. A resposta correta era: ${this.getLetter(this.currentQuestion.correctAnswer)}.`;
                    this.addLog(`Falha crítica na Questão ${this.currentQuestion.id}. Movendo para o próximo escopo...`, "log-error");
                    
                    this.userAnswersReport.push(attemptData);

                    setTimeout(() => {
                        this.nextQuestion();
                    }, 3000);
                }
            }
        },

        nextQuestion() {
            this.userSelection = null;
            this.feedbackMsg = "";
            this.attemptsLeft = 3;
            this.transitionDelay = false;

            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.loadQuestion();
            } else {
                this.finishQuiz();
            }
        },

        async loadQuestion() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Casos de Teste da Questão ${this.currentQuestion.id}...`, "log-info");
            this.isTyping = false;
        },

        finishQuiz() {
            this.quizFinished = true;
            this.addLog("Simulação finalizada. Gerando relatório de execução...", "log-info");
        },

        exportJSON() {
            const report = {
                timestamp: new Date().toISOString(),
                finalScore: `${this.score}/${this.questions.length}`,
                details: this.userAnswersReport
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "qa_test_report.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        },

        addLog(text, type = "log-info") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                
                const interval = setInterval(() => {
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 20); // Velocidade do terminal
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                }
            });
        },

        resetGame() {
            this.currentQuestionIndex = 0;
            this.userSelection = null;
            this.attemptsLeft = 3;
            this.score = 0;
            this.logs = [];
            this.userAnswersReport = [];
            this.quizFinished = false;
            this.addLog("Reiniciando ambiente de testes...", "log-warning");
            setTimeout(() => this.loadQuestion(), 1000);
        }
    }
}).mount('#app');