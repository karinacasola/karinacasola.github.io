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
            
            // 20 Desafios de pyFirmata2 focados na sintaxe do PDF
            levels: [
                {
                    id: 1, concept: "Conexão Básica", story: "Antes de mais nada, precisamos instanciar a placa usando a porta USB (COM3).", instruction: "Importe o pyfirmata2 e conecte a placa.",
                    blocks: [
                        { id: 'b1', text: 'from pyfirmata2 import Arduino' },
                        { id: 'b2', text: 'placa = Arduino("COM3")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Conexão serial estabelecida na COM3."
                },
                {
                    id: 2, concept: "Definição de Pinos (A forma moderna)", story: "Para controlar o LED no pino 13, usamos o get_pin('d:13:o').", instruction: "Instancie o pino 13 como digital e saída.",
                    blocks: [
                        { id: 'b1', text: 'led = placa.get_pin("d:13:o")' }
                    ],
                    solutions: [['b1']], successLog: "Pino 13 mapeado como Output (Saída)."
                },
                {
                    id: 3, concept: "Ligar o LED", story: "Para acender o LED, passamos o valor lógico 1 usando o método write().", instruction: "Escreva o valor 1 no objeto led.",
                    blocks: [
                        { id: 'b1', text: 'led.write(1)' }
                    ],
                    solutions: [['b1']], successLog: "Sinal elétrico enviado. LED aceso!"
                },
                {
                    id: 4, concept: "Pausa (Delay em Python)", story: "Diferente do C++, o tempo no Python é em segundos.", instruction: "Importe time, pause por 1 segundo e desligue o LED.",
                    blocks: [
                        { id: 'b1', text: 'import time' },
                        { id: 'b2', text: 'time.sleep(1)' },
                        { id: 'b3', text: 'led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Pausa de 1 segundo executada via thread local."
                },
                {
                    id: 5, concept: "Simulando o void loop()", story: "No Arduino C++, usamos loop(). No Python, criamos um laço infinito.", instruction: "Crie um loop while True para exibir uma mensagem.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    print("Rodando para sempre...")' },
                        { id: 'b3', text: '    time.sleep(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Loop infinito estabelecido. Identação correta."
                },
                {
                    id: 6, concept: "Pisca LED Contínuo", story: "Junte tudo para criar o clássico Blink contínuo.", instruction: "Ligue, espere, desligue e espere dentro do loop.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: '    time.sleep(1)' },
                        { id: 'b4', text: '    led.write(0)' },
                        { id: 'b5', text: '    time.sleep(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Blink contínuo operando. Lógica escrava perfeita."
                },
                {
                    id: 7, concept: "Configurando Entradas (Push Button)", story: "Vamos preparar o pino 2 para ler um botão.", instruction: "Use get_pin para definir o pino 2 como digital e entrada (i).",
                    blocks: [
                        { id: 'b1', text: 'btn = placa.get_pin("d:2:i")' }
                    ],
                    solutions: [['b1']], successLog: "Pino 2 mapeado como Input (Entrada)."
                },
                {
                    id: 8, concept: "Amostragem de Dados (Vital)", story: "Sem ativar a amostragem, a leitura dos botões sempre retornará None.", instruction: "Ative o sampling na placa.",
                    blocks: [
                        { id: 'b1', text: 'placa.samplingOn()' }
                    ],
                    solutions: [['b1']], successLog: "Fluxo contínuo de dados assíncronos ativado."
                },
                {
                    id: 9, concept: "Lendo o Botão", story: "Leia o estado atual do botão usando read() e exiba na tela.", instruction: "Atribua a leitura a uma variável e imprima.",
                    blocks: [
                        { id: 'b1', text: 'estado = btn.read()' },
                        { id: 'b2', text: 'print(estado)' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Valor digital lido com sucesso (True/False)."
                },
                {
                    id: 10, concept: "Botão controla LED", story: "Se o botão for apertado, o LED acende. Senão, apaga.", instruction: "Use a estrutura de controle if/else.",
                    blocks: [
                        { id: 'b1', text: 'if btn.read():' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: 'else:' },
                        { id: 'b4', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Condicional aplicada com base na leitura física."
                },
                {
                    id: 11, concept: "Alívio de CPU (Estabilidade)", story: "Ler um botão em um loop Python consumirá 100% do seu PC.", instruction: "Adicione um pequeno sleep ao final do seu while True.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    if btn.read():' },
                        { id: 'b3', text: '        led.write(1)' },
                        { id: 'b4', text: '    time.sleep(0.01)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Uso da CPU estabilizado. Polling eficiente."
                },
                {
                    id: 12, concept: "Paralelismo Lógico (Alarme)", story: "Como o envio serial é muito rápido, podemos ligar LED e Buzzer 'ao mesmo tempo'.", instruction: "Ligue o led e o buzzer antes de dar o sleep.",
                    blocks: [
                        { id: 'b1', text: 'led.write(1)' },
                        { id: 'b2', text: 'buzzer.write(1)' },
                        { id: 'b3', text: 'time.sleep(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3'], ['b2', 'b1', 'b3']], successLog: "Acionamento simultâneo via USB realizado."
                },
                {
                    id: 13, concept: "Controle Interativo por Teclado", story: "O programa pode esperar o usuário digitar algo no PC para acionar a placa.", instruction: "Use input() para pedir um comando e travar o fluxo.",
                    blocks: [
                        { id: 'b1', text: 'comando = input("Digite 1 para ligar: ")' },
                        { id: 'b2', text: 'print("Comando recebido!")' }
                    ],
                    solutions: [['b1', 'b2']], successLog: "Interrupção por teclado aguardando input."
                },
                {
                    id: 14, concept: "Teclado + LED", story: "Verifique se a string digitada é '1' para acender o LED.", instruction: "Crie a condicional if avaliando o texto do input.",
                    blocks: [
                        { id: 'b1', text: 'if comando == "1":' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: 'elif comando == "0":' },
                        { id: 'b4', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Teclado do PC operando hardware físico remotamente."
                },
                {
                    id: 15, concept: "Semáforo (Múltiplos LEDs)", story: "Ligue e desligue o verde, depois passe para o amarelo.", instruction: "Desligue o verde e ligue o amarelo na mesma lógica.",
                    blocks: [
                        { id: 'b1', text: 'verde.write(1)' },
                        { id: 'b2', text: 'time.sleep(5)' },
                        { id: 'b3', text: 'verde.write(0)' },
                        { id: 'b4', text: 'amarelo.write(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Sequência temporal de semáforo acionada."
                },
                {
                    id: 16, concept: "Entrada Analógica (LDR)", story: "Pinos analógicos medem variações. Instancie o pino analógico 0 (A0).", instruction: "Use get_pin('a:0:i') para o sensor de luz.",
                    blocks: [
                        { id: 'b1', text: 'ldr = placa.get_pin("a:0:i")' },
                        { id: 'b2', text: 'placa.samplingOn()' }
                    ],
                    solutions: [['b1', 'b2'], ['b2', 'b1']], successLog: "Canal ADC ativado para leitura analógica."
                },
                {
                    id: 17, concept: "Fotocélula Inteligente", story: "O valor lido vai de 0.0 a 1.0. Se for menor que 0.3 (escuro), acenda o LED.", instruction: "Leia o LDR e avalie o limiar.",
                    blocks: [
                        { id: 'b1', text: 'valor = ldr.read()' },
                        { id: 'b2', text: 'if valor is not None and valor < 0.3:' },
                        { id: 'b3', text: '    led.write(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], successLog: "Ponto de corte de luminosidade testado e validado."
                },
                {
                    id: 18, concept: "Temporizador For Loop", story: "Em Python, laços for são ótimos para contagens finitas (ex: piscar 5 vezes).", instruction: "Use for i in range(5) para piscar o LED.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(5):' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: '    time.sleep(0.5)' },
                        { id: 'b4', text: '    led.write(0)' },
                        { id: 'b5', text: '    time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Iteração finita substituindo loops gigantescos."
                },
                {
                    id: 19, concept: "Segurança de Saída (try/except)", story: "Ao parar o script, é crucial fechar a serial, senão a porta COM fica travada.", instruction: "Envolva o loop em try e feche no finally.",
                    blocks: [
                        { id: 'b1', text: 'try:' },
                        { id: 'b2', text: '    while True: pass' },
                        { id: 'b3', text: 'finally:' },
                        { id: 'b4', text: '    placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Porta serial liberada adequadamente pelo sistema operacional."
                },
                {
                    id: 20, concept: "O Mestre do pyFirmata", story: "Junte a importação, conexão, amostragem e loop num script seguro.", instruction: "Construa o esqueleto base definitivo.",
                    blocks: [
                        { id: 'b1', text: 'from pyfirmata2 import Arduino' },
                        { id: 'b2', text: 'placa = Arduino("COM3")' },
                        { id: 'b3', text: 'placa.samplingOn()' },
                        { id: 'b4', text: 'while True:' },
                        { id: 'b5', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "SISTEMA COMPLETO CONCLUÍDO! VOCÊ ZEROU O LABORATÓRIO PYFIRMATA2!"
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