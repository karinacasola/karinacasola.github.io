const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            attempts: 0,
            score: 0,
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            showAnswer: false,
            gameOver: false,
            userSelection: null,
            
            // 20 Exercícios baseados no PDF "Interação Humano-Computador"
            questions: [
                {
                    id: 1,
                    instruction: "Analise a diferença entre UX e Usabilidade.",
                    scenario: "O Gerente de Produto pergunta: 'Por que nosso sistema tem boa usabilidade, mas uma UX ruim?' Você precisa explicar a diferença conceitual baseada na Teoria.",
                    text: "Qual a definição correta segundo o material?",
                    options: [
                        "Usabilidade foca na métrica objetiva (completar tarefa); UX foca no sentimento e percepção holística.",
                        "Usabilidade é subjetiva; UX é métrica objetiva focada na velocidade do sistema.",
                        "Não há diferença, ambos avaliam o número de cliques para uma ação.",
                        "Usabilidade avalia a credibilidade da marca, UX avalia a eficácia dos botões."
                    ],
                    answer: "Usabilidade foca na métrica objetiva (completar tarefa); UX foca no sentimento e percepção holística."
                },
                {
                    id: 2,
                    instruction: "Identifique a Heurística de Nielsen violada.",
                    scenario: "Um usuário preenche um longo formulário de cadastro. Ao clicar em 'Enviar', a página recarrega em branco apagando tudo, exibindo apenas: 'Erro 4X-90'.",
                    text: "Além da falta de prevenção de erros, qual heurística falhou miseravelmente na mensagem apresentada?",
                    options: [
                        "Estética e design minimalista",
                        "Visibilidade do status do sistema",
                        "Correspondência entre o sistema e o mundo real",
                        "Reconhecimento em vez de recordação"
                    ],
                    answer: "Correspondência entre o sistema e o mundo real"
                },
                {
                    id: 3,
                    instruction: "Conceito de Carga Cognitiva.",
                    scenario: "A nova interface de um software de contabilidade exige que o usuário decore códigos numéricos de 6 dígitos para acessar cada menu, não possuindo busca.",
                    text: "Qual princípio de usabilidade e cognição está sendo diretamente ferido?",
                    options: [
                        "Oferecer feedback imediato",
                        "Minimizar a carga cognitiva",
                        "Utilizar modelos mentais",
                        "Estética minimalista"
                    ],
                    answer: "Minimizar a carga cognitiva"
                },
                {
                    id: 4,
                    instruction: "Heurísticas de Scapin e Bastien.",
                    scenario: "O avaliador anotou: 'O sistema não diz de onde o usuário veio nem para onde ele pode ir a partir desta tela'.",
                    text: "Qual heurística de Scapin e Bastien foi violada?",
                    options: [
                        "Carga de trabalho",
                        "Controle explícito",
                        "Orientação",
                        "Gestão de erros"
                    ],
                    answer: "Orientação"
                },
                {
                    id: 5,
                    instruction: "Processo de Avaliação Heurística.",
                    scenario: "Sua equipe vai realizar uma avaliação heurística em um site de e-commerce seguindo as boas práticas do material.",
                    text: "Quantos avaliadores especialistas são recomendados para esta tarefa?",
                    options: [
                        "1 avaliador experiente",
                        "3 a 5 avaliadores",
                        "Mais de 15 usuários finais",
                        "Apenas o desenvolvedor líder"
                    ],
                    answer: "3 a 5 avaliadores"
                },
                {
                    id: 6,
                    instruction: "Reconhecimento vs Recordação.",
                    scenario: "Em vez de fazer o usuário digitar de cabeça o código de um produto, o sistema oferece uma lista com fotos e nomes dos produtos visitados recentemente.",
                    text: "Qual o benefício desta abordagem segundo Nielsen?",
                    options: [
                        "Previne a ineficiência estética",
                        "Aumenta a carga de trabalho explícita",
                        "Permite o reconhecimento em vez de recordação",
                        "Garante consistência e padrões de hardware"
                    ],
                    answer: "Permite o reconhecimento em vez de recordação"
                },
                {
                    id: 7,
                    instruction: "Heurística de Nielsen: Visibilidade do status.",
                    scenario: "O usuário faz o upload de um arquivo de 5GB. A tela não exibe barra de progresso, apenas um botão congelado.",
                    text: "O que diz a heurística 'Visibilidade do status do sistema' sobre isso?",
                    options: [
                        "O sistema deve ser flexível para uploaders avançados.",
                        "O usuário deve saber o que está acontecendo no sistema.",
                        "O sistema deve pedir confirmação antes de congelar.",
                        "A linguagem deve ser voltada para redes e servidores."
                    ],
                    answer: "O usuário deve saber o que está acontecendo no sistema."
                },
                {
                    id: 8,
                    instruction: "Heurísticas Clássicas.",
                    scenario: "Você percebe que em uma tela o botão 'Confirmar' é verde e quadrado, mas na tela seguinte é azul e redondo.",
                    text: "Qual heurística (Nielsen) foi claramente esquecida?",
                    options: [
                        "Liberdade e controle do usuário",
                        "Estética e design minimalista",
                        "Prevenção de erros",
                        "Consistência e padrões"
                    ],
                    answer: "Consistência e padrões"
                },
                {
                    id: 9,
                    instruction: "Componentes da Experiência do Usuário.",
                    scenario: "Para argumentar a favor de um redesenho completo, você lista os componentes de UX para a diretoria.",
                    text: "Segundo o slide 4, quais são os componentes da UX?",
                    options: [
                        "Usabilidade + emoção, valor, credibilidade, utilidade, acessibilidade",
                        "Eficiência, eficácia, aprendizado, memorização",
                        "Heurísticas, relatórios, testes de carga",
                        "Modelos mentais, orientação e controle explícito"
                    ],
                    answer: "Usabilidade + emoção, valor, credibilidade, utilidade, acessibilidade"
                },
                {
                    id: 10,
                    instruction: "Planejamento da Avaliação.",
                    scenario: "Após a navegação individual, os avaliadores se reúnem para discutir descobertas e priorizar problemas.",
                    text: "Como é chamada esta etapa do processo de avaliação?",
                    options: [
                        "Brainstorming Criativo",
                        "Sessão de Consolidação (Debriefing)",
                        "Análise Individual",
                        "Entrevista com o Usuário"
                    ],
                    answer: "Sessão de Consolidação (Debriefing)"
                },
                {
                    id: 11,
                    instruction: "Gestão de Erros.",
                    scenario: "O usuário digita a data de nascimento no formato errado. O sistema apaga e bloqueia a conta.",
                    text: "Segundo Scapin e Bastien, a 'Gestão de Erros' deveria ajudar o usuário a...",
                    options: [
                        "Ignorar o erro e processar silenciosamente.",
                        "Mudar a linguagem para códigos explícitos.",
                        "Prevenir, detectar e corrigir erros.",
                        "Adaptar a interface para usuários flexíveis."
                    ],
                    answer: "Prevenir, detectar e corrigir erros."
                },
                {
                    id: 12,
                    instruction: "Liberdade do Usuário.",
                    scenario: "Você abre um pop-up promocional no site, mas não existe um botão de 'X' ou 'Fechar' visível.",
                    text: "Qual heurística de Nielsen trata especificamente de saídas de emergência e desfazer ações?",
                    options: [
                        "Liberdade e controle do usuário",
                        "Flexibilidade e eficiência de uso",
                        "Estética e design minimalista",
                        "Reconhecimento em vez de recordação"
                    ],
                    answer: "Liberdade e controle do usuário"
                },
                {
                    id: 13,
                    instruction: "Conceito Básico.",
                    scenario: "Durante uma aula, um aluno pergunta: 'Afinal, o que é uma heurística de usabilidade?'",
                    text: "Qual a melhor definição com base na aula?",
                    options: [
                        "São testes obrigatórios feitos com usuários reais vendados.",
                        "São regras gerais ou dicas para identificar problemas de forma sistemática.",
                        "É o código-fonte que gera a responsividade do site.",
                        "São métricas de performance do banco de dados (tempo de resposta)."
                    ],
                    answer: "São regras gerais ou dicas para identificar problemas de forma sistemática."
                },
                {
                    id: 14,
                    instruction: "Heurística de Scapin e Bastien.",
                    scenario: "O software emite um bipe e mostra a mensagem 'Operação salva com sucesso' no canto da tela.",
                    text: "A qual heurística de Scapin e Bastien essa ação de informar o resultado atende?",
                    options: [
                        "Feedback",
                        "Controle explícito",
                        "Orientação",
                        "Carga de trabalho"
                    ],
                    answer: "Feedback"
                },
                {
                    id: 15,
                    instruction: "Modelos Mentais.",
                    scenario: "Sua equipe discute que ícone usar para representar a função de 'Imprimir'.",
                    text: "Por que usar o ícone de uma impressora atende à utilização de Modelos Mentais?",
                    options: [
                        "Porque exige alto processamento do usuário para decorar atalhos.",
                        "Porque o usuário já espera que funcione baseando-se no mundo real.",
                        "Porque previne erros de hardware.",
                        "Porque aumenta a eficácia matemática do sistema."
                    ],
                    answer: "Porque o usuário já espera que funcione baseando-se no mundo real."
                },
                {
                    id: 16,
                    instruction: "Documentação de IHC.",
                    scenario: "Você está elaborando o relatório final da inspeção heurística e precisa montar a tabela de problemas.",
                    text: "Quais colunas devem obrigatoriamente compor a tabela de documentação de erros (slide 13)?",
                    options: [
                        "ID, Problema, Heurística Violada, Prioridade",
                        "Nome do Avaliador, Data, Código Fonte, Custo",
                        "Print da Tela, Sentimento do Usuário, Cores Utilizadas",
                        "ID, Sugestão de Código, Assinatura do Diretor"
                    ],
                    answer: "ID, Problema, Heurística Violada, Prioridade"
                },
                {
                    id: 17,
                    instruction: "Flexibilidade e Eficiência.",
                    scenario: "Um sistema de edição de imagens permite clicar em botões no menu, mas também oferece atalhos como CTRL+C, CTRL+V.",
                    text: "Esta prática atende a qual heurística de Nielsen?",
                    options: [
                        "Flexibilidade e eficiência de uso",
                        "Estética e design minimalista",
                        "Prevenção de erros",
                        "Visibilidade do status"
                    ],
                    answer: "Flexibilidade e eficiência de uso"
                },
                {
                    id: 18,
                    instruction: "Estética Minimalista.",
                    scenario: "Um site do governo apresenta 4 banners animados, 6 colunas de texto espremido e dezenas de links coloridos que distraem da tarefa principal.",
                    text: "O que a heurística de 'Estética e design minimalista' recomenda nesses casos?",
                    options: [
                        "Aumentar o número de cores para manter consistência.",
                        "Evitar informações irrelevantes ou desnecessárias na interface.",
                        "Colocar mensagens de erro maiores.",
                        "Exigir confirmação antes de ler o texto."
                    ],
                    answer: "Evitar informações irrelevantes ou desnecessárias na interface."
                },
                {
                    id: 19,
                    instruction: "Prevenção de Erros vs Gestão.",
                    scenario: "O motor de busca do Google sugere 'Você quis dizer: X?' quando você digita uma palavra errada, em vez de mostrar 0 resultados.",
                    text: "Essa funcionalidade brilhante é focada principalmente em:",
                    options: [
                        "Controle explícito e visibilidade do servidor",
                        "Ajudar usuários a reconhecerem, diagnosticarem e recuperarem-se de erros",
                        "Design minimalista removendo botões",
                        "Orientação de rotas e mapas GPS"
                    ],
                    answer: "Ajudar usuários a reconhecerem, diagnosticarem e recuperarem-se de erros"
                },
                {
                    id: 20,
                    instruction: "O limite das Heurísticas.",
                    scenario: "O Gerente diz: 'Fizemos a avaliação heurística. Agora não precisamos mais testar com usuários, certo?'",
                    text: "Com base no material (slide 6), qual é a resposta correta para o gerente?",
                    options: [
                        "Correto, heurísticas garantem 100% de usabilidade.",
                        "Incorreto. Avaliação Heurística não substitui testes com usuários.",
                        "Correto, desde que tenham sido usados mais de 5 avaliadores.",
                        "Incorreto, as heurísticas só servem para sistemas antigos."
                    ],
                    answer: "Incorreto. Avaliação Heurística não substitui testes com usuários."
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
        this.addLog("Inicializando Simulador IHC_EVAL_v2...", "log-info");
        setTimeout(() => {
            this.loadQuestion();
        }, 1000);
    },
    methods: {
        selectOption(option) {
            if (this.showAnswer || this.gameOver || this.isTyping) return;
            
            this.userSelection = option;

            if (option === this.currentQuestion.answer) {
                // Acertou
                this.score++;
                this.feedbackType = "success";
                this.feedbackMsg = "Resposta Correta! Vulnerabilidade de UX contornada.";
                this.addLog("Sucesso: Diagnóstico heurístico preciso.", "log-success");
                this.showAnswer = true;
                setTimeout(this.nextQuestion, 2500);
            } else {
                // Errou
                this.attempts++;
                if (this.attempts >= 3) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `Tentativas esgotadas. A resposta era: ${this.currentQuestion.answer}`;
                    this.addLog("Falha Crítica: Usuário abandonou o sistema.", "log-error");
                    this.showAnswer = true;
                    setTimeout(this.nextQuestion, 4000);
                } else {
                    this.feedbackType = "warning";
                    this.feedbackMsg = `Incorreto. Tentativas restantes: ${3 - this.attempts}`;
                    this.addLog(`Aviso: Diagnóstico incorreto. Tentativa ${this.attempts}/3`, "log-error");
                }
            }
        },

        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.resetTurn();
                this.loadQuestion();
            } else {
                this.finishGame();
            }
        },

        resetTurn() {
            this.userSelection = null;
            this.attempts = 0;
            this.showAnswer = false;
            this.feedbackMsg = "";
            this.feedbackType = "";
        },

        async loadQuestion() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Desafio ${this.currentQuestion.id}...`, "log-info");
            await this.typeWriter(this.currentQuestion.scenario, "log-default");
            this.isTyping = false;
        },

        finishGame() {
            this.gameOver = true;
            this.addLog("Simulação concluída. Gerando relatório...", "log-info");
        },

        addLog(text, type = "log-default") {
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
                }, 15); // Velocidade mais rápida para o texto do terminal
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

        saveResult() {
            const data = new Date().toLocaleString();
            let content = `======================================\n`;
            content += ` RELATÓRIO DE AVALIAÇÃO HEURÍSTICA IHC \n`;
            content += `======================================\n\n`;
            content += `Data da Simulação: ${data}\n`;
            content += `Pontuação Final: ${this.score} de 20 acertos\n\n`;
            content += `Avaliação concluída pelo Especialista UX.\n`;
            
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `IHC_Relatorio_Desempenho.txt`;
            a.click();
            URL.revokeObjectURL(url);
        },

        resetGame() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.logs = [];
            this.gameOver = false;
            this.resetTurn();
            this.addLog("Reiniciando simulação de IHC...", "log-info");
            setTimeout(() => this.loadQuestion(), 1000);
        }
    }
}).mount('#app');