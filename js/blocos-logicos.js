const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            availableBlocks: [], 
            selectedBlocks: [],  
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            // Variáveis da Mecânica de Vidas (Chances)
            chances: 3,
            showSolution: false,
            currentSolutionDisplay: [],
            
            levels: [
                {
                    id: 1,
                    concept: "Números Pares",
                    story: "Precisamos calibrar o motor imprimindo apenas números pares de 0 a 10.",
                    instruction: "Construa um algoritmo que imprima pares até 10.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(11):' },
                        { id: 'b2', text: '    if i % 2 == 0:' },
                        { id: 'b3', text: '        print(i)' },
                        { id: 'b4', text: 'for i in range(0, 11, 2):' },
                        { id: 'b5', text: '    print(i)' },
                        { id: 'b6', text: 'i = 0' },
                        { id: 'b7', text: 'while i <= 10:' },
                        { id: 'b8', text: '    i += 2' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3'],       
                        ['b4', 'b5'],             
                        ['b6', 'b7', 'b5', 'b8']  
                    ],
                    successLog: "Motor calibrado com os números pares!"
                },
                {
                    id: 2,
                    concept: "Decisão: Maior de Dois",
                    story: "O sistema tem duas variáveis (A e B). Ele precisa descobrir e imprimir qual é a maior.",
                    instruction: "Crie a lógica para encontrar o maior número.",
                    blocks: [
                        { id: 'b1', text: 'if A > B:' },
                        { id: 'b2', text: '    print(A)' },
                        { id: 'b3', text: 'else:' },
                        { id: 'b4', text: '    print(B)' },
                        { id: 'b5', text: 'maior = A' },
                        { id: 'b6', text: 'if B > A:' },
                        { id: 'b7', text: '    maior = B' },
                        { id: 'b8', text: 'print(maior)' },
                        { id: 'b9', text: 'maior = B' },
                        { id: 'b10', text: 'if A > B:' },
                        { id: 'b11', text: '    maior = A' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3', 'b4'],    
                        ['b5', 'b6', 'b7', 'b8'],    
                        ['b9', 'b10', 'b11', 'b8']   
                    ],
                    successLog: "Comparador lógico ativado. Maior número isolado."
                },
                {
                    id: 3,
                    concept: "Acumulador: Soma Simples",
                    story: "Precisamos saber a soma exata dos números 1, 2 e 3 para desbloquear a porta.",
                    instruction: "Construa um algoritmo que resulte na soma de 1 a 3.",
                    blocks: [
                        { id: 'b1', text: 'soma = 0' },
                        { id: 'b2', text: 'for i in range(1, 4):' },
                        { id: 'b3', text: '    soma += i' },
                        { id: 'b4', text: 'print(soma)' },
                        { id: 'b5', text: 'soma = 1 + 2 + 3' },
                        { id: 'b6', text: 'soma = sum([1, 2, 3])' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3', 'b4'], 
                        ['b5', 'b4'],             
                        ['b6', 'b4']              
                    ],
                    successLog: "Soma calculada corretamente. Trava liberada."
                },
                {
                    id: 4,
                    concept: "Condicionais Encadeadas",
                    story: "O sensor lê um número 'n'. Ele precisa avisar se é Positivo, Negativo ou Zero.",
                    instruction: "Ordene os blocos if/elif/else para classificar o número.",
                    blocks: [
                        { id: 'b1', text: 'if n > 0:' },
                        { id: 'b2', text: '    print("Positivo")' },
                        { id: 'b3', text: 'elif n < 0:' },
                        { id: 'b4', text: '    print("Negativo")' },
                        { id: 'b5', text: 'else:' },
                        { id: 'b6', text: '    print("Zero")' },
                        { id: 'b7', text: 'if n == 0:' },
                        { id: 'b8', text: 'elif n > 0:' },
                        { id: 'b9', text: 'if n < 0:' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'], 
                        ['b7', 'b6', 'b8', 'b2', 'b5', 'b4'], 
                        ['b9', 'b4', 'b8', 'b2', 'b5', 'b6']  
                    ],
                    successLog: "Leitura de espectro concluída. Valores classificados."
                },
                {
                    id: 5,
                    concept: "Varrendo Listas",
                    story: "Os administradores 'Ana' e 'Bob' entraram. O painel deve cumprimentá-los.",
                    instruction: "Construa a lógica para imprimir 'Oi, Ana' e depois 'Oi, Bob'.",
                    blocks: [
                        { id: 'b1', text: 'for u in ["Ana", "Bob"]:' },
                        { id: 'b2', text: '    print("Oi, " + u)' },
                        { id: 'b3', text: 'i = 0' },
                        { id: 'b4', text: 'while i < 2:' },
                        { id: 'b5', text: '    print("Oi, " + ["Ana", "Bob"][i])' },
                        { id: 'b6', text: '    i += 1' },
                        { id: 'b7', text: 'print("Oi, Ana")' },
                        { id: 'b8', text: 'print("Oi, Bob")' }
                    ],
                    solutions: [
                        ['b1', 'b2'],                   
                        ['b3', 'b4', 'b5', 'b6'],       
                        ['b7', 'b8']                    
                    ],
                    successLog: "Administradores reconhecidos. Acesso Total concedido!"
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
        this.addLog("Iniciando ambiente de blocos visuais...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
    },
    methods: {
        shuffleArray(array) {
            let shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Desafio ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            
            // Reseta Estado do Nível e Chances
            this.chances = 3;
            this.showSolution = false;
            this.currentSolutionDisplay = [];
            
            this.selectedBlocks = [];
            this.availableBlocks = this.shuffleArray(this.currentLevel.blocks);
            this.feedbackMsg = "";
            this.isTyping = false;
        },

        selectBlock(block) {
            this.availableBlocks = this.availableBlocks.filter(b => b.id !== block.id);
            this.selectedBlocks.push(block);
            this.feedbackMsg = "";
        },

        removeBlock(index) {
            const block = this.selectedBlocks.splice(index, 1)[0];
            this.availableBlocks.push(block);
            this.feedbackMsg = "";
        },

        clearBlocks() {
            this.availableBlocks.push(...this.selectedBlocks);
            this.selectedBlocks = [];
            this.feedbackMsg = "";
        },

        async runCode() {
            const userSequence = this.selectedBlocks.map(b => b.id);
            
            const isCorrect = this.currentLevel.solutions.some(solution => {
                return JSON.stringify(solution) === JSON.stringify(userSequence);
            });

            if (isCorrect) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Lógica Perfeita! Algoritmo válido encontrado.";
                this.levelComplete = true;

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                // ERRO
                this.chances--; // Perde uma vida
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `Erro Lógico. Restam ${this.chances} tentativa(s). Limpe e tente novamente!`;
                    this.addLog(`Algoritmo falhou. ${this.chances} chances restantes.`, "log-error");
                } else {
                    // ZEROU AS CHANCES - MOSTRA SOLUÇÃO
                    this.feedbackType = "error";
                    this.feedbackMsg = "Tentativas esgotadas!";
                    this.addLog("Falha Crítica. Extraindo diagrama da solução autorizada...", "log-error");
                    this.displaySolution();
                }
            }
        },

        displaySolution() {
            this.showSolution = true;
            
            // Pega a Primeira solução válida (índice 0) como gabarito
            const solutionIds = this.currentLevel.solutions[0];
            
            // Mapeia os IDs para os textos dos blocos originais
            this.currentSolutionDisplay = solutionIds.map(id => {
                return this.currentLevel.blocks.find(b => b.id === id);
            });
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.levelComplete = false;
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
            }
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
            this.levelComplete = false;
            this.logs = [];
            this.addLog("Reiniciando treinamento de Lógica...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');