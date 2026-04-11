const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentLevelIndex = ref(0);
        const attempts = ref(0);
        const maxAttempts = 3;
        const correctCount = ref(0);
        const gameFinished = ref(false);
        const isQuestionLocked = ref(false);
        const feedbackMessage = ref('');
        const feedbackType = ref('');

        // --- Efeito Sonoro de Erro ---
        const playErrorSound = () => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const ctx = new AudioContext();
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(300, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.2);
            } catch (e) {
                console.warn("API de Áudio não suportada.");
            }
        };

        // --- BANCO DE DADOS (20 Questões Baseadas nos PDFs) ---
        const allQuestions = [
            {
                question: "O que é um sensor LDR?",
                options: [
                    { text: "Resistor dependente de luz", isCorrect: true },
                    { text: "Diodo emissor de luz", isCorrect: false },
                    { text: "Sensor de infravermelho passivo", isCorrect: false },
                    { text: "Atuador mecânico", isCorrect: false }
                ]
            },
            {
                question: "Como a resistência do LDR reage à luz?",
                options: [
                    { text: "Aumenta no escuro e diminui com muita luz", isCorrect: true },
                    { text: "Diminui no escuro e aumenta com luz", isCorrect: false },
                    { text: "Mantém-se constante independente da luz", isCorrect: false },
                    { text: "Só funciona em ambientes com luz ultravioleta", isCorrect: false }
                ]
            },
            {
                question: "Qual a principal diferença entre um Fotodiodo e um Fototransistor?",
                options: [
                    { text: "Fotodiodo detecta luz ambiente e infravermelha; Fototransistor apenas infravermelha", isCorrect: true },
                    { text: "Fototransistor é usado apenas para espectro ultravioleta", isCorrect: false },
                    { text: "Fotodiodo não é capaz de detectar luz infravermelha", isCorrect: false },
                    { text: "Não há diferença, são sinônimos na eletrônica", isCorrect: false }
                ]
            },
            {
                question: "O que caracteriza os sensores digitais?",
                options: [
                    { text: "Emitem apenas dois estados lógicos: 0 ou 1", isCorrect: true },
                    { text: "Fornecem valores contínuos conforme a intensidade do estímulo", isCorrect: false },
                    { text: "São atuadores que convertem luz em movimento", isCorrect: false },
                    { text: "São componentes analógicos que necessitam de portas PWM", isCorrect: false }
                ]
            },
            {
                question: "Qual é o princípio de funcionamento de um sensor PIR?",
                options: [
                    { text: "Detectar alterações na radiação infravermelha emitida por corpos vivos ou objetos", isCorrect: true },
                    { text: "Medir os níveis de umidade do ar através do calor", isCorrect: false },
                    { text: "Detectar níveis de luminosidade usando um resistor variável", isCorrect: false },
                    { text: "Controlar automaticamente o disparo de flashes fotográficos", isCorrect: false }
                ]
            },
            {
                question: "Quais são as opções de ajuste mecânico no módulo PIR HC-SR501?",
                options: [
                    { text: "Sensibilidade/Distância e Tempo de Retardo", isCorrect: true },
                    { text: "Apenas o ângulo do campo de visão horizontal", isCorrect: false },
                    { text: "Cor, brilho e frequência de rádio", isCorrect: false },
                    { text: "A tensão de entrada e a taxa de bauds seriais", isCorrect: false }
                ]
            },
            {
                question: "O que define um atuador em sistemas de automação?",
                options: [
                    { text: "Componente que executa uma ação física (movimento, som) em resposta a um sinal elétrico", isCorrect: true },
                    { text: "Dispositivo passivo que lê dados físicos do ambiente", isCorrect: false },
                    { text: "Uma placa microcontroladora similar ao Arduino", isCorrect: false },
                    { text: "Um componente utilizado exclusivamente para armazenar energia", isCorrect: false }
                ]
            },
            {
                question: "Qual a diferença de hardware entre um Buzzer Ativo e um Buzzer Passivo?",
                options: [
                    { text: "O ativo possui oscilador interno (gera som ao energizar); o passivo requer sinal de frequência PWM", isCorrect: true },
                    { text: "O passivo consome 10x mais energia que o ativo", isCorrect: false },
                    { text: "O ativo só funciona se alimentado com tensão superior a 12V", isCorrect: false },
                    { text: "O ativo gera apenas luz, enquanto o passivo gera apenas som", isCorrect: false }
                ]
            },
            {
                question: "Quantas portas digitais e entradas analógicas possui nativamente o Arduino Mega 2560?",
                options: [
                    { text: "54 portas digitais e 16 entradas analógicas", isCorrect: true },
                    { text: "14 portas digitais e 6 entradas analógicas", isCorrect: false },
                    { text: "20 portas digitais e 10 entradas analógicas", isCorrect: false },
                    { text: "54 entradas analógicas e 16 portas digitais", isCorrect: false }
                ]
            },
            {
                question: "O que é uma Breadboard (também conhecida como Protoboard)?",
                options: [
                    { text: "Placa de ensaio para prototipagem rápida de circuitos sem a necessidade de solda", isCorrect: true },
                    { text: "Microcontrolador avançado para processamento de sinais de áudio", isCorrect: false },
                    { text: "Uma matriz de LEDs programável", isCorrect: false },
                    { text: "Uma placa de circuito impresso com trilhas definitivas fixadas a calor", isCorrect: false }
                ]
            },
            {
                question: "Como se comportam os sensores definidos como Analógicos?",
                options: [
                    { text: "Fornecem um valor contínuo de tensão que varia gradualmente conforme o estímulo medido", isCorrect: true },
                    { text: "Emitem apenas os estados binários LOW e HIGH para o microcontrolador", isCorrect: false },
                    { text: "Precisam de um sinal PWM de entrada para começar a funcionar", isCorrect: false },
                    { text: "Exibem obrigatoriamente leituras em formato I2C e SPI nativos", isCorrect: false }
                ]
            },
            {
                question: "Na lógica de programação padrão de um sensor PIR, quais estados digitais são lidos?",
                options: [
                    { text: "HIGH (se houver movimento detectado) ou LOW (se não houver movimento)", isCorrect: true },
                    { text: "Qualquer valor numérico de 0 a 1023", isCorrect: false },
                    { text: "Pulsos rápidos variáveis no pino analógico A0", isCorrect: false },
                    { text: "Caracteres em texto contínuo via barramento Serial", isCorrect: false }
                ]
            },
            {
                question: "Qual é o alcance aproximado normal de detecção do sensor PIR HC-SR501?",
                options: [
                    { text: "Entre 3 e 7 metros, dependendo do ajuste do potenciômetro", isCorrect: true },
                    { text: "Pode chegar a detectar sinais limpos em até 12 metros", isCorrect: false },
                    { text: "Fixo em 3 metros estritos, sem nenhuma forma de ajuste fino", isCorrect: false },
                    { text: "Superior a 20 metros em espaços abertos com baixa luminosidade", isCorrect: false }
                ]
            },
            {
                question: "Qual o papel do componente ADC em sensores Analógico-Digitais?",
                options: [
                    { text: "Captar os sinais analógicos físicos e convertê-los em sinais digitais para a placa", isCorrect: true },
                    { text: "Atuar amplificando sinais de rádio frequência (RF) do ambiente", isCorrect: false },
                    { text: "Filtrar unicamente sinais binários que contenham oscilações (ruído)", isCorrect: false },
                    { text: "Permitir a comunicação direta com os atuadores via Wi-Fi", isCorrect: false }
                ]
            },
            {
                question: "Qual é o papel da plataforma Wokwi nos ensaios de hardware?",
                options: [
                    { text: "Simular virtualmente a montagem em breadboard permitindo o teste seguro das conexões", isCorrect: true },
                    { text: "É um software exclusivo para desenhar e imprimir placas PCB", isCorrect: false },
                    { text: "Limitar a programação gerando apenas código sem painel visual para o usuário", isCorrect: false },
                    { text: "Permitir apenas a simulação da placa lógica do Arduino, ignorando componentes elétricos externos", isCorrect: false }
                ]
            },
            {
                question: "Em um circuito típico, qual leitura analógica um LDR solto gera em um cenário de 'pouca luz'?",
                options: [
                    { text: "Pode chegar próximo do valor 1023, dependendo da configuração do circuito", isCorrect: true },
                    { text: "Sempre registrará e enviará o valor 0 absoluto", isCorrect: false },
                    { text: "Se estabiliza no valor mediano de 500", isCorrect: false },
                    { text: "Gera e transmite um sinal de tensão inversamente negativo", isCorrect: false }
                ]
            },
            {
                question: "Qual a função prática primária da inclusão de um Buzzer em projetos IoT?",
                options: [
                    { text: "Atuar gerando retorno de som para criar alertas estruturados e notificações", isCorrect: true },
                    { text: "Emitir calor para derreter filamentos termoplásticos", isCorrect: false },
                    { text: "Aferir os dados vitais ou de temperatura do próprio Arduino", isCorrect: false },
                    { text: "Atuar fisicamente movendo fechaduras e servos motores de pequeno porte", isCorrect: false }
                ]
            },
            {
                question: "Qual desses modelos de sensor PIR é conhecido pela alta qualidade e alcance ampliado de até 12 metros?",
                options: [
                    { text: "Modelo PIR Parallax", isCorrect: true },
                    { text: "Modelo PIR HC-SR501", isCorrect: false },
                    { text: "Modelo PIR HC-SR505", isCorrect: false },
                    { text: "LDR passivo infravermelho", isCorrect: false }
                ]
            },
            {
                question: "Ao comprar um LDR, qual a principal diferença de hardware entre um solto e o LDR em Módulo?",
                options: [
                    { text: "O Módulo já traz um resistor adequado soldado na placa; o solto exige adicionar esse resistor no circuito", isCorrect: true },
                    { text: "O formato dos terminais: LDR solto usa três hastes de pino; o módulo apenas fios de tensão direta", isCorrect: false },
                    { text: "A incompatibilidade tecnológica, visto que o módulo não comunica de forma nativa com placas Arduino", isCorrect: false },
                    { text: "A inversão lógica nativa obrigatória, presente de fábrica exclusivamente nos LDRs soltos", isCorrect: false }
                ]
            },
            {
                question: "Em projetos de Automação Residencial, qual o benefício instrucional primário de se utilizar a simulação?",
                options: [
                    { text: "Permite configurar componentes, ajustar códigos lógicos e depurar virtualmente antes de cometer erros físicos caros", isCorrect: true },
                    { text: "Permite que a placa real seja substituída de modo definitivo pelo computador em projetos corporativos longos", isCorrect: false },
                    { text: "Facilita a vida pois elimina em absoluto a necessidade de se aprender codificação lógica em C++", isCorrect: false },
                    { text: "Tem a função primária exclusiva de atuar restrita a arquitetura e testes do hardware do Arduino Mega", isCorrect: false }
                ]
            }
        ];

        // --- Embaralhar Opções e Iniciar ---
        const levels = ref([]);

        const shuffleArray = (array) => {
            const newArr = [...array];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            return newArr;
        };

        const loadLevels = () => {
            levels.value = allQuestions.map(q => {
                return {
                    question: q.question,
                    options: shuffleArray(q.options).map(opt => ({ ...opt, status: null }))
                };
            });
            resetTurn();
        };

        const currentLevel = computed(() => {
            // Prevenção de erro caso os níveis não tenham carregado ainda
            return levels.value[currentLevelIndex.value] || { question: '', options: [] };
        });
        
        const progressPercentage = computed(() => (currentLevelIndex.value / levels.value.length) * 100);

        const resetTurn = () => {
            attempts.value = 0;
            isQuestionLocked.value = false;
            feedbackMessage.value = '';
            feedbackType.value = '';
        };

        const revealAnswer = () => {
            currentLevel.value.options.forEach(opt => {
                if (opt.isCorrect) opt.status = 'correct';
            });
        };

        // --- Lógica de Resposta ---
        const selectOption = (index) => {
            if (isQuestionLocked.value) return;

            const selected = currentLevel.value.options[index];
            
            // Ignora se já clicou nessa errada
            if (selected.status === 'wrong') return;

            if (selected.isCorrect) {
                // ACERTOU
                selected.status = 'correct';
                isQuestionLocked.value = true;
                
                // Só pontua se for a primeira tentativa
                if (attempts.value === 0) {
                    correctCount.value++;
                    feedbackMessage.value = '<i class="bi bi-check-lg"></i> Resposta Exata! Você garantiu o ponto.';
                    feedbackType.value = 'success';
                } else {
                    feedbackMessage.value = '<i class="bi bi-check-lg"></i> Correto! Avançando para a próxima.';
                    feedbackType.value = 'success';
                }

            } else {
                // ERROU
                selected.status = 'wrong';
                attempts.value++;
                playErrorSound();

                if (attempts.value < maxAttempts) {
                    const chances = maxAttempts - attempts.value;
                    feedbackMessage.value = `<i class="bi bi-exclamation-triangle"></i> Incorreto. Você tem mais <strong>${chances} tentativa(s)</strong>.`;
                    feedbackType.value = 'error';
                } else {
                    // ESGOTOU TENTATIVAS
                    isQuestionLocked.value = true;
                    revealAnswer();
                    feedbackMessage.value = '<i class="bi bi-info-circle-fill"></i> Limite de tentativas atingido. A resposta correta foi exibida.';
                    feedbackType.value = 'info';
                }
            }
        };

        const nextLevel = () => {
            if (currentLevelIndex.value < levels.value.length - 1) {
                currentLevelIndex.value++;
                resetTurn();
            } else {
                gameFinished.value = true;
            }
        };

        const resetGame = () => {
            currentLevelIndex.value = 0;
            correctCount.value = 0;
            gameFinished.value = false;
            loadLevels();
        };

        // Carrega as questões imediatamente de forma síncrona para evitar a tela preta
        loadLevels();

        return {
            levels,
            currentLevelIndex,
            currentLevel,
            progressPercentage,
            correctCount,
            gameFinished,
            attempts,
            isQuestionLocked,
            feedbackMessage,
            feedbackType,
            selectOption,
            nextLevel,
            resetGame
        };
    }
}).mount('#app');