const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            userSelection: null,
            inventory: [],
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            // 20 Exercícios focados em Fluxogramas (Blocos Visuais)
            levels: [
                {
                    id: 1,
                    concept: "Terminal (Início)",
                    story: "O núcleo está apagado. Todo diagrama de fluxo precisa de um ponto de partida.",
                    instruction: "Identifique o bloco que indica o começo do algoritmo.",
                    flowTemplate: [
                        "<div class='flow-node flow-oval'>???</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>Ligar Tela</div>"
                    ],
                    options: ["INÍCIO", "FIM", "LEIA", "PROCESSO"],
                    correctAnswer: "INÍCIO",
                    successLog: "Sinal de início identificado. Mapeamento iniciado."
                },
                {
                    id: 2,
                    concept: "Entrada Manual",
                    story: "O sistema precisa que você insira o seu crachá. Como representamos uma Entrada de Dados?",
                    instruction: "Preencha o paralelogramo com o comando de leitura.",
                    flowTemplate: [
                        "<div class='flow-node flow-oval'>INÍCIO</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-para'><span>??? crachá</span></div>"
                    ],
                    options: ["Escreva", "Calcule", "Leia", "Mostre"],
                    correctAnswer: "Leia",
                    successLog: "Dados do crachá recebidos no diagrama."
                },
                {
                    id: 3,
                    concept: "Processamento (Atribuição)",
                    story: "A porta está travada. O sistema precisa definir a variável 'status' como 'destrancado'.",
                    instruction: "Use o bloco retângulo para processar a atribuição.",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>status <- ???</div>",
                        "<div class='flow-arrow'>↓</div>"
                    ],
                    options: ["Leia", "Verdadeiro", "Falso", "\"destrancado\""],
                    correctAnswer: "\"destrancado\"",
                    successLog: "Atribuição executada no processador."
                },
                {
                    id: 4,
                    concept: "Saída Visual",
                    story: "Um LED precisa acender para confirmar que a porta abriu.",
                    instruction: "No paralelogramo de saída, qual comando exibe a mensagem?",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>status <- \"aberto\"</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-para'><span>??? \"Porta Aberta\"</span></div>"
                    ],
                    options: ["Leia", "Escreva", "Processo", "Fim"],
                    correctAnswer: "Escreva",
                    successLog: "LED aceso. Saída de dados validada.",
                    reward: "Diagrama Básico"
                },
                {
                    id: 5,
                    concept: "Terminal (Fim)",
                    story: "Para evitar vazamento de memória, este subprocesso deve ser encerrado corretamente.",
                    instruction: "Qual bloco oval finaliza o diagrama?",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-para'><span>Escreva \"OK\"</span></div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-oval'>???</div>"
                    ],
                    options: ["PAUSA", "RETORNO", "FIM", "STOP"],
                    correctAnswer: "FIM",
                    successLog: "Subprocesso finalizado com segurança."
                },
                {
                    id: 6,
                    concept: "Decisão Simples",
                    story: "Um sensor térmico detecta calor. O fluxograma deve desviar a rota se a temperatura for alta.",
                    instruction: "O losango representa uma decisão. Complete a condição lógica.",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>temp > ???</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Ligar Ventoinha</div>"
                    ],
                    options: ["Leia", "Escreva", "50", "Início"],
                    correctAnswer: "50",
                    successLog: "Condição de temperatura ajustada para > 50 graus."
                },
                {
                    id: 7,
                    concept: "Caminho Falso (Senão)",
                    story: "E se a temperatura estiver normal? Precisamos de um caminho alternativo no fluxograma.",
                    instruction: "O que acontece se a condição do losango for Falsa?",
                    flowTemplate: [
                        "<div class='flow-node flow-diamond'>temp > 50</div>",
                        "<div class='flow-arrow'>↘ (Não)</div>",
                        "<div class='flow-node flow-rect'>???</div>"
                    ],
                    options: ["Ligar Alarme", "Manter Desligado", "Leia temp", "Fim"],
                    correctAnswer: "Manter Desligado",
                    successLog: "Rota do caminho Falso mapeada com sucesso."
                },
                {
                    id: 8,
                    concept: "Operador de Igualdade",
                    story: "Uma checagem de segurança verifica se a senha digitada é igual à salva no banco.",
                    instruction: "Qual o símbolo correto dentro da decisão para 'igual a'?",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>senha ??? \"123\"</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>"
                    ],
                    options: ["=", "<-", "==", "=>"],
                    correctAnswer: "==",
                    successLog: "Operador de comparação posicionado no losango."
                },
                {
                    id: 9,
                    concept: "Operador Diferente",
                    story: "Uma tranca secundária exige que a chave digital NÃO SEJA nula.",
                    instruction: "Como representamos 'diferente' numa decisão lógica?",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>chave ??? nulo</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Acesso Liberado</div>"
                    ],
                    options: ["!=", "==", "<-", "="],
                    correctAnswer: "!=",
                    successLog: "Verificação de nulidade aprovada no nó.",
                    reward: "Chave Lógica"
                },
                {
                    id: 10,
                    concept: "Repetição (Loop de Condição)",
                    story: "Um vírus corrompeu 5 arquivos. O sistema traça uma seta de volta ao topo para limpar um por um.",
                    instruction: "Qual condição mantém o fluxo retornando (repetição)?",
                    flowTemplate: [
                        "<div class='flow-node flow-rect'>arquivos_sujos <- 5</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>arquivos_sujos > ???</div>",
                        "<div class='flow-arrow'>↺ (Sim, volta)</div>"
                    ],
                    options: ["5", "10", "0", "Leia"],
                    correctAnswer: "0",
                    successLog: "Loop ativado. Limpeza contínua iniciada."
                },
                {
                    id: 11,
                    concept: "Atualizando a Variável no Loop",
                    story: "Se a variável do loop não mudar, teremos um 'Loop Infinito' e o sistema vai travar!",
                    instruction: "Dentro do loop, use um retângulo para diminuir os arquivos sujos.",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Limpar Arquivo</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>arquivos_sujos <- ???</div>",
                        "<div class='flow-arrow'>↺ (Volta à Decisão)</div>"
                    ],
                    options: ["arquivos_sujos", "0", "arquivos_sujos - 1", "5"],
                    correctAnswer: "arquivos_sujos - 1",
                    successLog: "Decremento inserido. Loop infinito evitado."
                },
                {
                    id: 12,
                    concept: "Operador Lógico (E)",
                    story: "Dois sensores precisam estar online simultaneamente para a válvula abrir.",
                    instruction: "Como juntamos as duas condições no losango?",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>s1 == 1 ??? s2 == 1</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Abrir Válvula</div>"
                    ],
                    options: ["OU", "E", "NAO", "->"],
                    correctAnswer: "E",
                    successLog: "Porta lógica AND configurada no hardware."
                },
                {
                    id: 13,
                    concept: "Operador Lógico (OU)",
                    story: "O alarme de incêndio deve soar se houver FUMAÇA ou CALOR extremo.",
                    instruction: "Complete a decisão lógica inclusiva.",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>fumaca == 1 ??? calor > 80</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Tocar Alarme</div>"
                    ],
                    options: ["E", "NAO", "OU", "=="],
                    correctAnswer: "OU",
                    successLog: "Porta lógica OR conectada. Sensores de emergência ativos."
                },
                {
                    id: 14,
                    concept: "Acumulador no Fluxograma",
                    story: "Para somar o uso de banda, o diagrama deve acumular o valor dos pacotes recebidos.",
                    instruction: "Como escrever o bloco de processo (retângulo) para somar 'pacote' ao 'total'?",
                    flowTemplate: [
                        "<div class='flow-node flow-para'><span>Leia pacote</span></div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>total <- total + ???</div>"
                    ],
                    options: ["1", "pacote", "0", "total"],
                    correctAnswer: "pacote",
                    successLog: "Soma em cascata validada. Totalizador funcional."
                },
                {
                    id: 15,
                    concept: "Contador vs Acumulador",
                    story: "Agora o diagrama precisa contar QUANTOS pacotes passaram, não o tamanho deles.",
                    instruction: "Um contador sempre sobe de 1 em 1. Preencha o retângulo.",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>contagem <- contagem + ???</div>",
                        "<div class='flow-arrow'>↓</div>"
                    ],
                    options: ["pacote", "1", "0", "contagem"],
                    correctAnswer: "1",
                    successLog: "Contador iterativo configurado."
                },
                {
                    id: 16,
                    concept: "Decisões Aninhadas (Nested)",
                    story: "O diagrama desvia para 'Usuário'. Dentro desse caminho, precisa checar se é 'Admin'.",
                    instruction: "É possível colocar um losango logo após outro caminho de losango?",
                    flowTemplate: [
                        "<div class='flow-node flow-diamond'>tipo == \"User\"</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-diamond'>nivel == ???</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Acesso Total</div>"
                    ],
                    options: ["\"Admin\"", "0", "\"User\"", "Falso"],
                    correctAnswer: "\"Admin\"",
                    successLog: "Sub-árvore de decisão mapeada perfeitamente.",
                    reward: "Nó de Root"
                },
                {
                    id: 17,
                    concept: "Operação de Resto (Modulo)",
                    story: "O núcleo precisa distribuir tarefas. Processos PARES vão para a CPU 1.",
                    instruction: "No fluxograma, como calculamos o resto da divisão por 2 no losango?",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>tarefa_id ??? 2 == 0</div>",
                        "<div class='flow-arrow'>↓ (Sim)</div>",
                        "<div class='flow-node flow-rect'>Mandar pra CPU 1</div>"
                    ],
                    options: ["/", "%", "*", "-"],
                    correctAnswer: "%",
                    successLog: "Roteamento de divisão (Módulo) configurado."
                },
                {
                    id: 18,
                    concept: "Inicialização de Variáveis",
                    story: "O diagrama está dando erro pois 'soma' começou vazia (lixo de memória).",
                    instruction: "Antes de qualquer loop (antes do losango), precisamos inicializar no retângulo.",
                    flowTemplate: [
                        "<div class='flow-node flow-oval'>INÍCIO</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>soma <- ???</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-diamond'>i < 10</div>"
                    ],
                    options: ["10", "Leia", "0", "Fim"],
                    correctAnswer: "0",
                    successLog: "Memória limpa e alocada corretamente na raiz."
                },
                {
                    id: 19,
                    concept: "Chamada de Sub-rotina",
                    story: "Um fluxograma complexo pode chamar OUTRO fluxograma. Visualmente é um retângulo com traços laterais duplos.",
                    instruction: "Complete a chamada para a sub-rotina de criptografia.",
                    flowTemplate: [
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect' style='border-left: 6px solid var(--accent-blue); border-right: 6px solid var(--accent-blue);'>Executar ???()</div>",
                        "<div class='flow-arrow'>↓</div>"
                    ],
                    options: ["Início", "Criptografia", "Decisão", "Loop"],
                    correctAnswer: "Criptografia",
                    successLog: "Diagramas modulares interligados."
                },
                {
                    id: 20,
                    concept: "Visão Geral do Diagrama",
                    story: "O último fio do núcleo foi religado. Para testar, valide a sequência Início -> Processo -> Fim.",
                    instruction: "Qual é a última peça obrigatória de qualquer fluxograma bem construído?",
                    flowTemplate: [
                        "<div class='flow-node flow-oval'>INÍCIO</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-rect'>Restaurar Sistema</div>",
                        "<div class='flow-arrow'>↓</div>",
                        "<div class='flow-node flow-oval'>???</div>"
                    ],
                    options: ["FIM", "VOLTA", "PROCESSA", "ESCREVA"],
                    correctAnswer: "FIM",
                    successLog: "Arquitetura do Fluxograma validada. Sistema 100% online!"
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        this.addLog("Analisando blueprint do sistema...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
    },
    methods: {
        formatCodeLine(line) {
            if (line.includes("???")) {
                if (this.userSelection) {
                    return line.replace("???", `<span class="code-slot filled">${this.userSelection}</span>`);
                }
                return line.replace("???", `<span class="code-slot">?</span>`);
            }
            return line;
        },

        selectOption(option) {
            this.userSelection = option;
            this.feedbackMsg = ""; 
        },

        async runCode() {
            if (!this.userSelection) return;

            if (this.userSelection === this.currentLevel.correctAnswer) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Fluxo correto. Validando nó...";
                this.levelComplete = true;
                
                if (this.currentLevel.reward && !this.inventory.includes(this.currentLevel.reward)) {
                    this.inventory.push(this.currentLevel.reward);
                }

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                // ERRO
                this.feedbackType = "error";
                this.feedbackMsg = `Erro Estrutural: '${this.userSelection}' rompe o diagrama.`;
                this.addLog("Curto-circuito lógico detectado. Tente novamente.", "log-error");
            }
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.userSelection = null;
                this.levelComplete = false;
                this.feedbackMsg = "";
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.userSelection = null;
            }
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Reparando Setor ${this.currentLevel.id}/20: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            this.isTyping = false;
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
                }, 25); 
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => {
                        terminal.scrollTop = terminal.scrollHeight;
                    }, 50);
                }
            });
        },

        resetGame() {
            this.currentLevelIndex = 0;
            this.userSelection = null;
            this.inventory = [];
            this.logs = [];
            this.levelComplete = false;
            this.addLog("Reiniciando diagnóstico de hardware...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');