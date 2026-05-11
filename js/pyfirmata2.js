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
            
            // Variáveis de Progresso e Certificado
            totalErros: 0,
            dataAtual: new Date().toLocaleDateString('pt-BR'),
            
            // 3 Desafios baseados no código do sensor LDR
            levels: [
                {
                    id: 1, 
                    concept: "Importação e Conexão", 
                    story: "Para iniciar nosso sistema de luminosidade, precisamos importar as bibliotecas, conectar a placa e definir os pinos do LED e do LDR.", 
                    instruction: "Importe as bibliotecas, instancie a placa na COM4 e mapeie os pinos d:9:o e a:5:i.",
                    blocks: [
                        { id: 'b1', text: 'from pyfirmata2 import Arduino' },
                        { id: 'b2', text: 'import time' },
                        { id: 'b3', text: 'placa = Arduino("COM4")' },
                        { id: 'b4', text: 'led = placa.get_pin("d:9:o")' },
                        { id: 'b5', text: 'ldr = placa.get_pin("a:5:i")' }
                    ],
                    // Aceita variações na ordem dos imports e na ordem de definição dos pinos
                    solutions: [
                        ['b1', 'b2', 'b3', 'b4', 'b5'], 
                        ['b2', 'b1', 'b3', 'b4', 'b5'],
                        ['b1', 'b2', 'b3', 'b5', 'b4'],
                        ['b2', 'b1', 'b3', 'b5', 'b4']
                    ], 
                    successLog: "Bibliotecas carregadas e hardware conectado com sucesso!"
                },
                {
                    id: 2, 
                    concept: "Amostragem e Callback", 
                    story: "Precisamos dizer à placa para começar a ler os dados continuamente e registrar a nossa função 'atualizar_luz' para ser ativada sempre que o valor do LDR mudar.", 
                    instruction: "Ligue a amostragem, registre o callback e ative o reporte de dados do LDR.",
                    blocks: [
                        { id: 'b1', text: 'placa.samplingOn()' },
                        { id: 'b2', text: 'ldr.register_callback(atualizar_luz)' },
                        { id: 'b3', text: 'ldr.enable_reporting()' }
                    ],
                    // A amostragem geralmente vem antes, e a ordem do callback/reporting pode variar levemente
                    solutions: [
                        ['b1', 'b2', 'b3'], 
                        ['b1', 'b3', 'b2']
                    ], 
                    successLog: "Fluxo de dados do sensor habilitado e atrelado à função!"
                },
                {
                    id: 3, 
                    concept: "Loop de Execução e Segurança", 
                    story: "O sistema precisa ficar rodando indefinidamente. Mas, se o usuário pressionar Ctrl+C (KeyboardInterrupt), devemos liberar a porta COM para ela não travar.", 
                    instruction: "Crie o bloco try/except com um loop infinito e encerre a placa em caso de interrupção.",
                    blocks: [
                        { id: 'b1', text: 'try:' },
                        { id: 'b2', text: '    while True:' },
                        { id: 'b3', text: '        time.sleep(0.1)' },
                        { id: 'b4', text: 'except KeyboardInterrupt:' },
                        { id: 'b5', text: '    placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Sistema completo, loop rodando e segurança implementada! VOCÊ CONCLUIU O LABORATÓRIO!"
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
        this.carregarProgresso();
        this.addLog("Iniciando interpretador Python 3.10...", "log-info");
        this.addLog("Procurando placas Arduino conectadas...", "log-info");
        setTimeout(() => { this.loadLevel(); }, 1000);
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
            await this.typeWriter(`Carregando Laboratório ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            
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
            if (this.levelComplete || this.isTyping) return;

            const userSequence = this.selectedBlocks.map(b => b.id);
            const isCorrect = this.currentLevel.solutions.some(solution => {
                return JSON.stringify(solution) === JSON.stringify(userSequence);
            });

            if (isCorrect) {
                this.feedbackType = "success";
                this.feedbackMsg = "Sintaxe Válida! Script executado.";
                this.levelComplete = true; 
                await this.typeWriter(this.currentLevel.successLog, "log-success");
                setTimeout(() => { this.nextLevel(); }, 2000);
            } else {
                this.chances--; 
                this.totalErros++; 
                this.salvarProgresso();
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `IndentationError ou SyntaxError: Tentativas restantes: ${this.chances}. Revise o código!`;
                    this.addLog(`Traceback (most recent call last). Vidas estouradas: ${3 - this.chances}.`, "log-error");
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Falha crítica na compilação!";
                    this.addLog("AttributeError: Revelando gabarito...", "log-error");
                    this.displaySolution();
                }
            }
        },

        displaySolution() {
            this.showSolution = true;
            const solutionIds = this.currentLevel.solutions[0];
            this.currentSolutionDisplay = solutionIds.map(id => {
                return this.currentLevel.blocks.find(b => b.id === id);
            });
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.levelComplete = false;
                this.salvarProgresso();
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
                this.salvarProgresso();
            }
        },

        salvarProgresso() {
            const saveDado = { nivel: this.currentLevelIndex, erros: this.totalErros };
            localStorage.setItem('pyfirmata2_save', JSON.stringify(saveDado));
        },

        carregarProgresso() {
            const saveSalvo = localStorage.getItem('pyfirmata2_save');
            if (saveSalvo) {
                try {
                    const dados = JSON.parse(saveSalvo);
                    this.currentLevelIndex = parseInt(dados.nivel, 10) || 0;
                    this.totalErros = parseInt(dados.erros, 10) || 0;
                    if(this.currentLevelIndex > 0 && this.currentLevelIndex < this.levels.length) {
                        this.addLog(`[SISTEMA] Progresso restaurado a partir do Nível ${this.currentLevelIndex + 1}.`, "log-success");
                    }
                } catch(e) {
                    console.error("Erro ao ler o arquivo de save:", e);
                }
            }
        },

        resetGame() {
            if(confirm("Isso apagará todo o seu progresso. Tem certeza?")) {
                localStorage.removeItem('pyfirmata2_save');
                this.currentLevelIndex = 0;
                this.totalErros = 0;
                this.levelComplete = false;
                this.logs = [];
                this.addLog("Limpando memória do interpretador...", "log-info");
                setTimeout(() => this.loadLevel(), 1000);
            }
        },

        exportarPDF() {
            const elemento = document.getElementById('relatorio-pdf');
            elemento.style.display = 'block'; 
            const opt = {
                margin:       10,
                filename:     `Certificado-pyFirmata2-${Date.now()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(elemento).save().then(() => {
                elemento.style.display = 'none';
            });
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
                }, 15); 
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 50);
                }
            });
        }
    }
}).mount('#app');