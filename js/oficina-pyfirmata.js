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
            
            // 15 Desafios: 3 introdutórios (sintaxe) + 12 completos/extensos
            levels: [
                // --- INTRODUÇÃO À SINTAXE ---
                {
                    id: 1, concept: "Instanciação do Objeto Placa",
                    story: "No Python, tratamos o hardware como um objeto. O primeiro passo é importar a biblioteca, conectar à porta serial e mapear um pino digital como saída ('o').",
                    instruction: "Importe o Arduino, instancie a placa na porta COM3, configure o pino 13 como saída e acenda o LED.",
                    blocks: [
                        { id: 'b1', text: 'from pyfirmata2 import Arduino' },
                        { id: 'b2', text: 'placa = Arduino("COM3")' },
                        { id: 'b3', text: 'led = placa.get_pin("d:13:o")' },
                        { id: 'b4', text: 'led.write(1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Objeto placa criado e pino digital acionado com sucesso!"
                },
                {
                    id: 2, concept: "O Tempo no Python (Sleep)",
                    story: "Como o Python não possui a função delay() do C++, usamos a biblioteca nativa 'time'. Lembre-se: o tempo é medido em segundos, e a identação define o loop.",
                    instruction: "Importe o time, crie um loop infinito 'while True:', acenda o LED, espere 1 segundo, apague e espere outro segundo.",
                    blocks: [
                        { id: 'b1', text: 'import time' },
                        { id: 'b2', text: 'while True:' },
                        { id: 'b3', text: '    led.write(1)' },
                        { id: 'b4', text: '    time.sleep(1.0)' },
                        { id: 'b5', text: '    led.write(0)' },
                        { id: 'b6', text: '    time.sleep(1.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], successLog: "Pisca-pisca funcionando usando time.sleep em segundos!"
                },
                {
                    id: 3, concept: "Amostragem Assíncrona (Sampling)",
                    story: "Diferente do C++, para ler dados contínuos de um pino de entrada ('i'), precisamos instruir o pyfirmata2 a iniciar a amostragem de dados para não travar a porta serial.",
                    instruction: "Ative o samplingOn(), mapeie o pino analógico A0 como entrada, dê uma breve pausa e faça a leitura para uma variável.",
                    blocks: [
                        { id: 'b1', text: 'placa.samplingOn()' },
                        { id: 'b2', text: 'sensor = placa.get_pin("a:0:i")' },
                        { id: 'b3', text: 'time.sleep(0.5)' },
                        { id: 'b4', text: 'valor = sensor.read()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Amostragem ativada e primeira leitura recebida!"
                },

                // --- SCRIPTS COMPLETOS E AVANÇADOS ---
                {
                    id: 4, concept: "Repetição Finita com FOR",
                    story: "O Python oferece estruturas mais limpas. Vamos fazer um alerta visual que pisca o LED exatamente 5 vezes e depois para, sem travar em loop infinito.",
                    instruction: "Construa o bloco FOR com range de 5, intercalando ligar e desligar o LED com pausas de 0.5s.",
                    blocks: [
                        { id: 'b1', text: 'for i in range(5):' },
                        { id: 'b2', text: '    led.write(1)' },
                        { id: 'b3', text: '    time.sleep(0.5)' },
                        { id: 'b4', text: '    led.write(0)' },
                        { id: 'b5', text: '    time.sleep(0.5)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Estrutura FOR perfeitamente identada e executada!"
                },
                {
                    id: 5, concept: "Segurança de Encerramento (Try/Except)",
                    story: "Uma boa prática de automação em Python é garantir que, ao interromper o código, a porta COM não fique bloqueada. Usamos o bloco Try/Except para isso.",
                    instruction: "Envolva o loop num bloco try, e caso ocorra um KeyboardInterrupt, chame o encerramento da placa.",
                    blocks: [
                        { id: 'b1', text: 'try:' },
                        { id: 'b2', text: '    while True: time.sleep(1)' },
                        { id: 'b3', text: 'except KeyboardInterrupt:' },
                        { id: 'b4', text: '    placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Controle seguro de exceção de hardware implementado!"
                },
                {
                    id: 6, concept: "Lógica Condicional com Botão",
                    story: "Integração completa: vamos ler o estado de um botão (0 ou 1) e utilizar um if/else para comandar um LED, controlando o hardware diretamente pela identação.",
                    instruction: "Leia o botão. Se for igual a 1, acenda o LED, caso contrário, certifique-se de que ele fique apagado.",
                    blocks: [
                        { id: 'b1', text: 'estado = btn.read()' },
                        { id: 'b2', text: 'if estado == 1:' },
                        { id: 'b3', text: '    led.write(1)' },
                        { id: 'b4', text: 'else:' },
                        { id: 'b5', text: '    led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Lógica condicional if/else aplicada com sucesso no atuador!"
                },
                {
                    id: 7, concept: "Filtragem de Tipo de Dado (NoneType)",
                    story: "Na leitura serial, os primeiros milissegundos podem retornar valores nulos (None). Tentar fazer contas com 'None' quebra o script Python.",
                    instruction: "Leia o sensor. Verifique se o valor não é nulo. Apenas se for válido, verifique se ultrapassa 0.5 para ligar o atuador.",
                    blocks: [
                        { id: 'b1', text: 'val = sensor.read()' },
                        { id: 'b2', text: 'if val is not None:' },
                        { id: 'b3', text: '    if val > 0.5:' },
                        { id: 'b4', text: '        led.write(1)' },
                        { id: 'b5', text: '    else: led.write(0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Tratamento de dados nulos operante!"
                },
                {
                    id: 8, concept: "Modulação PWM (Fade-In Dinâmico)",
                    story: "Configurando o pino no modo PWM ('p'), podemos variar a intensidade elétrica fracionando o valor de 0.0 até 1.0 utilizando matemática no loop.",
                    instruction: "Obtenha o pino 6 em PWM. Crie um loop range(11) para escrever o valor dividido por 10.0, seguido de delay.",
                    blocks: [
                        { id: 'b1', text: 'led_pwm = placa.get_pin("d:6:p")' },
                        { id: 'b2', text: 'for i in range(11):' },
                        { id: 'b3', text: '    led_pwm.write(i / 10.0)' },
                        { id: 'b4', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], successLog: "Rampa de tensão PWM finalizada com sucesso!"
                },
                {
                    id: 9, concept: "Dimmer Analógico em Tempo Real",
                    story: "Vamos amarrar um sensor analógico (potenciômetro) diretamente à saída PWM. Como o sensor vai de 0.0 a 1.0, a conversão é direta e instantânea.",
                    instruction: "Dentro do loop infinito, leia o potenciômetro e passe a leitura validada diretamente para o pino PWM.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    brilho = pot.read()' },
                        { id: 'b3', text: '    if brilho is not None:' },
                        { id: 'b4', text: '        led_pwm.write(brilho)' },
                        { id: 'b5', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Transferência contínua (analog-to-PWM) operacional!"
                },
                {
                    id: 10, concept: "Automação Crepuscular Inversa (LDR)",
                    story: "Um sensor de luz (LDR) aumenta sua leitura com a luz. Queremos o inverso: quanto mais escuro, mais o LED de iluminação pública deve brilhar.",
                    instruction: "Leia o LDR dentro do loop. Se for válido, subtraia a leitura de 1.0 para inverter o sinal e grave no PWM.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    luz = ldr.read()' },
                        { id: 'b3', text: '    if luz is not None:' },
                        { id: 'b4', text: '        led_pwm.write(1.0 - luz)' },
                        { id: 'b5', text: '    time.sleep(0.1)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Lógica matemática inversamente proporcional configurada!"
                },
                {
                    id: 11, concept: "Controle de Servomotor Posicional",
                    story: "O modo servomotor ('s') aceita valores em graus, geralmente de 0 a 180. Ele é ideal para cancelas, travas mecânicas e braços robóticos.",
                    instruction: "Obtenha o pino 10 como servo, defina o ângulo para 90 graus, pause 1.0s, retorne para 0 e pause novamente.",
                    blocks: [
                        { id: 'b1', text: 'servo = placa.get_pin("d:10:s")' },
                        { id: 'b2', text: 'servo.write(90)' },
                        { id: 'b3', text: 'time.sleep(1.0)' },
                        { id: 'b4', text: 'servo.write(0)' },
                        { id: 'b5', text: 'time.sleep(1.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Posicionamento angular validado com precisão!"
                },
                {
                    id: 12, concept: "Mapeamento Angulado de Sensor",
                    story: "Para controlar o eixo do servo manualmente, temos que mapear a escala analógica (0.0-1.0) para a escala angular (0-180) usando multiplicação no Python.",
                    instruction: "Se a leitura do potenciômetro não for nula, multiplique por 180, force para inteiro (int) e envie ao servo.",
                    blocks: [
                        { id: 'b1', text: 'while True:' },
                        { id: 'b2', text: '    leitura = pot.read()' },
                        { id: 'b3', text: '    if leitura is not None:' },
                        { id: 'b4', text: '        angulo = int(leitura * 180)' },
                        { id: 'b5', text: '        servo.write(angulo)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Conversão escalar Analógico para Graus funcional!"
                },
                {
                    id: 13, concept: "Acionamento de Motor DC (Ponte H)",
                    story: "O motor de corrente contínua gira ao se criar uma diferença de potencial. Em uma Ponte H, configuramos dois pinos digitais com estados opostos para ditar o sentido de giro.",
                    instruction: "Inicie IN1 e IN2 como saídas. Escreva 1 (ALTO) no IN1 e 0 (BAIXO) no IN2 para girar o eixo, segurando por 2s.",
                    blocks: [
                        { id: 'b1', text: 'in1 = placa.get_pin("d:4:o")' },
                        { id: 'b2', text: 'in2 = placa.get_pin("d:5:o")' },
                        { id: 'b3', text: 'in1.write(1)' },
                        { id: 'b4', text: 'in2.write(0)' },
                        { id: 'b5', text: 'time.sleep(2.0)' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Motor tracionado no sentido horário com sucesso!"
                },
                {
                    id: 14, concept: "Criação de Funções de Hardware",
                    story: "Na automação, costumamos agrupar ações repetitivas de motores em Funções Python (def).",
                    instruction: "Crie a função marcha_atras que inverta os pinos (IN1=0, IN2=1), faça um print e, ao fim, invoque a função.",
                    blocks: [
                        { id: 'b1', text: 'def marcha_atras():' },
                        { id: 'b2', text: '    in1.write(0)' },
                        { id: 'b3', text: '    in2.write(1)' },
                        { id: 'b4', text: '    print("Revertendo...")' },
                        { id: 'b5', text: 'marcha_atras()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], successLog: "Rotina funcional agrupada em Python concluída!"
                },
                {
                    id: 15, concept: "Projeto Final de Cancela (Completo)",
                    story: "Uma aplicação real! Um bloco protegido por exceções (try/except) roda o loop principal monitorando um botão para abrir uma cancela mecânica, saindo limpo se abortado pelo usuário.",
                    instruction: "Use try/except. No loop, se botão for 1 abra o servo (90). Se sofrer interrupção de teclado, chame placa.exit().",
                    blocks: [
                        { id: 'b1', text: 'try:' },
                        { id: 'b2', text: '    while True:' },
                        { id: 'b3', text: '        if btn.read() == 1:' },
                        { id: 'b4', text: '            servo.write(90)' },
                        { id: 'b5', text: '        time.sleep(0.1)' },
                        { id: 'b6', text: 'except KeyboardInterrupt:' },
                        { id: 'b7', text: '    placa.exit()' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']], successLog: "APLICAÇÃO INDUSTRIAL VALIDADA COM SUCESSO! Você concluiu!"
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
        this.addLog("Procurando placas Arduino conectadas via protocolo Firmata...", "log-info");
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
            await this.typeWriter(`Carregando Laboratório ${this.currentLevel.id}/15: ${this.currentLevel.concept}...`, "log-info");
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
                this.feedbackMsg = "Sintaxe Válida! Script executado com sucesso.";
                this.levelComplete = true; 
                await this.typeWriter(this.currentLevel.successLog, "log-success");
                setTimeout(() => { this.nextLevel(); }, 2500);
            } else {
                this.chances--; 
                this.totalErros++; 
                this.salvarProgresso();
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `IndentationError ou SyntaxError: Tentativas restantes: ${this.chances}. Revise o fluxo e a identação!`;
                    this.addLog(`Traceback (most recent call last). Falhas cometidas: ${3 - this.chances}.`, "log-error");
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Falha crítica na compilação!";
                    this.addLog("AttributeError: Revelando gabarito de correção...", "log-error");
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
                this.addLog("Todos os laboratórios foram concluídos! Parabéns!", "log-success");
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
                this.addLog("Limpando memória RAM do interpretador...", "log-info");
                setTimeout(() => this.loadLevel(), 1000);
            }
        },

        exportarPDF() {
            const elemento = document.getElementById('relatorio-pdf');
            elemento.style.display = 'block'; 
            
            // Corrige problema do html2canvas gerando cortes estranhos na impressão
            window.scrollTo(0, 0);

            const opt = {
                margin:       10,
                filename:     `relatorio-oficina-${Date.now()}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
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