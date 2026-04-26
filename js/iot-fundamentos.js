const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            correctCount: 0,
            attempts: 0,
            isQuestionLocked: false,
            feedbackMessage: '',
            feedbackType: '',
            // Questões puramente conceituais sobre Arduino Uno R3
            levels: [
                {
                    question: "Do ponto de vista arquitetônico, qual é a principal função do microcontrolador ATmega328P no Arduino Uno R3?",
                    options: [
                        { text: "Fornecer energia ininterrupta e estabilizada de 5V para os sensores.", isCorrect: false, status: 'default' },
                        { text: "Atuar como o 'cérebro' do sistema, interpretando entradas e executando a lógica do código.", isCorrect: true, status: 'default' },
                        { text: "Converter exclusivamente sinais de rádio para comunicação sem fio com a nuvem.", isCorrect: false, status: 'default' },
                        { text: "Armazenar dados permanentemente, como um disco rígido ou banco de dados.", isCorrect: false, status: 'default' }
                    ]
                },
                {
                    question: "Na estrutura de programação padrão do Arduino, qual é a diferença fundamental entre as funções setup() e loop()?",
                    options: [
                        { text: "O setup() roda continuamente enquanto houver energia; o loop() roda apenas uma vez.", isCorrect: false, status: 'default' },
                        { text: "O setup() define a velocidade do processador; o loop() gerencia o consumo de bateria.", isCorrect: false, status: 'default' },
                        { text: "O setup() executa configurações iniciais uma única vez; o loop() executa o código principal em ciclo infinito.", isCorrect: true, status: 'default' },
                        { text: "Não há diferença técnica, é apenas uma convenção visual para organizar o código.", isCorrect: false, status: 'default' }
                    ]
                },
                {
                    question: "Ao conectar componentes ao Arduino Uno R3, qual é a principal diferença conceitual entre usar uma porta Digital (ex: Pino 7) e uma Analógica (ex: A0)?",
                    options: [
                        { text: "A porta digital só entende dois estados (LIGADO/DESLIGADO), enquanto a analógica compreende um espectro contínuo de variações.", isCorrect: true, status: 'default' },
                        { text: "Portas digitais são usadas apenas para motores pesados, e analógicas apenas para LEDs.", isCorrect: false, status: 'default' },
                        { text: "A porta digital envia dados pela internet, a analógica não possui conectividade.", isCorrect: false, status: 'default' },
                        { text: "Não existe diferença, ambas leem exatamente os mesmos tipos de dados elétricos.", isCorrect: false, status: 'default' }
                    ]
                },
                {
                    question: "Em um projeto de Internet das Coisas (IoT), o que define o papel de um 'Atuador' conectado ao Arduino?",
                    options: [
                        { text: "É o componente responsável por medir grandezas físicas, como temperatura e luz.", isCorrect: false, status: 'default' },
                        { text: "É a peça que fornece energia elétrica para a placa principal.", isCorrect: false, status: 'default' },
                        { text: "É o dispositivo que transmite os dados locais para um servidor na nuvem.", isCorrect: false, status: 'default' },
                        { text: "É o agente que converte um sinal elétrico em uma ação física no ambiente, como um motor girando ou uma válvula abrindo.", isCorrect: true, status: 'default' }
                    ]
                },
                {
                    question: "Para que um circuito elétrico funcione corretamente conectado ao Arduino, os componentes precisam estar ligados ao pino GND. O que este pino representa?",
                    options: [
                        { text: "Ground (Terra): É a referência de potencial zero, necessária para fechar o circuito elétrico e permitir o fluxo de corrente.", isCorrect: true, status: 'default' },
                        { text: "Generator (Gerador): É a tensão máxima de 12V da placa.", isCorrect: false, status: 'default' },
                        { text: "Gateway: É o canal de comunicação direto com a interface USB.", isCorrect: false, status: 'default' },
                        { text: "General Node: Um pino de reserva para casos de curto-circuito.", isCorrect: false, status: 'default' }
                    ]
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        },
        gameFinished() {
            return this.currentLevelIndex >= this.levels.length;
        },
        progressPercentage() {
            return (this.currentLevelIndex / this.levels.length) * 100;
        }
    },
    methods: {
        selectOption(index) {
            if (this.isQuestionLocked) return;
            
            this.attempts++;
            const option = this.currentLevel.options[index];

            if (option.isCorrect) {
                option.status = 'correct';
                this.feedbackMessage = "<i class='bi bi-check-circle'></i> Exato! Resposta correta.";
                this.feedbackType = "success";
                this.isQuestionLocked = true;
                
                // CORREÇÃO: O ponto agora é contabilizado independentemente do número de tentativas
                this.correctCount++; 
            } else {
                option.status = 'wrong';
                if (this.attempts >= 3) {
                    this.feedbackMessage = "Tentativas esgotadas. A resposta correta foi destacada.";
                    this.feedbackType = "error";
                    this.isQuestionLocked = true;
                    // Destaca a correta para o usuário aprender
                    const correctIndex = this.currentLevel.options.findIndex(o => o.isCorrect);
                    this.currentLevel.options[correctIndex].status = 'correct';
                } else {
                    this.feedbackMessage = `<i class='bi bi-exclamation-circle'></i> Incorreto. Tens mais ${3 - this.attempts} tentativa(s).`;
                    this.feedbackType = "error";
                }
            }
        },
        nextLevel() {
            if (this.currentLevelIndex < this.levels.length) {
                this.currentLevelIndex++;
                this.attempts = 0;
                this.isQuestionLocked = false;
                this.feedbackMessage = '';
                this.feedbackType = '';
            }
        },
        resetGame() {
            this.currentLevelIndex = 0;
            this.correctCount = 0;
            this.attempts = 0;
            this.isQuestionLocked = false;
            this.feedbackMessage = '';
            this.feedbackType = '';
            this.levels.forEach(level => {
                level.options.forEach(opt => opt.status = 'default');
            });
        },
        gerarCertificado() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            // Fundo escuro
            doc.setFillColor(10, 10, 10);
            doc.rect(0, 0, 297, 210, "F");

            // Borda decorativa azul
            doc.setDrawColor(62, 142, 255);
            doc.setLineWidth(2);
            doc.rect(15, 15, 267, 180);

            // Título
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(30);
            doc.text("CERTIFICADO DE CONHECIMENTO", 148.5, 60, { align: "center" });

            // Texto de certificação
            doc.setFont("helvetica", "normal");
            doc.setFontSize(18);
            doc.setTextColor(160, 160, 160);
            doc.text("Certificamos a conclusão do desafio técnico:", 148.5, 90, { align: "center" });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(62, 142, 255); 
            doc.text("FUNDAMENTOS ARDUINO UNO R3", 148.5, 105, { align: "center" });

            // Resultado
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.setTextColor(224, 224, 224);
            doc.text(`Desempenho Final: ${this.correctCount} acertos de ${this.levels.length} questões.`, 148.5, 130, { align: "center" });

            // Rodapé / Data
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Emitido em: ${dataAtual}`, 148.5, 180, { align: "center" });

            doc.save("certificado-arduino-uno.pdf");
        }
    }
}).mount('#app');