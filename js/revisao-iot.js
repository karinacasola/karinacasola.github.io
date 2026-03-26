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
            userAnswersReport: [],
            
            // 30 Questões elaboradas a partir dos slides da Imersão IoT
            questions: [
                { id: 1, text: "O que é a Internet das Coisas (IoT)?", options: ["Uma linguagem de programação focada em hardware.", "A rede de objetos físicos incorporados a sensores, software e conectividade que trocam dados pela internet.", "Um protocolo de segurança exclusivo para servidores industriais.", "Um banco de dados local para armazenar informações de máquinas offline."], correctAnswer: 1 },
                { id: 2, text: "Qual foi o primeiro objeto conectado à internet na década de 1980?", options: ["Uma televisão analógica.", "Um relógio digital corporativo.", "Uma máquina de Coca-Cola na Universidade Carnegie Mellon.", "Um servidor de e-mail doméstico."], correctAnswer: 2 },
                { id: 3, text: "O termo 'Internet das Coisas' foi cunhado em 1999 por Kevin Ashton em qual contexto?", options: ["No lançamento do primeiro smartphone comercial.", "Durante uma apresentação sobre implementação de etiquetas RFID na cadeia de suprimentos da P&G.", "Na criação da primeira rede sem fio (Wi-Fi).", "Durante o desenvolvimento dos primeiros sensores ópticos da NASA."], correctAnswer: 1 },
                { id: 4, text: "Na arquitetura baseada em 4 pilares fundamentais da IoT, quais são eles?", options: ["Monitoramento, Bateria, Hardware e Armazenamento.", "Design, Front-end, Back-end e Banco de Dados.", "Sensores/Dispositivos, Conectividade, Processamento de Dados e Interface de Usuário.", "Redes cabeadas, Processadores multicore, SO Linux e Antivírus."], correctAnswer: 2 },
                { id: 5, text: "Na pirâmide de valor da IoT, qual a diferença técnica entre Dados e Informação?", options: ["Dados são organizados em planilhas; Informação é salva na nuvem.", "Dados são valores brutos e isolados (ex: 180°C); Informação são dados contextualizados (ex: temperatura 10% acima do limite).", "Ambos representam a mesma coisa, alterando apenas o local de armazenamento.", "Dados são coletados pelo usuário; Informação é criada por Inteligência Artificial."], correctAnswer: 1 },
                { id: 6, text: "O que representa o 'Conhecimento (Insights)' na pirâmide de valor da IoT?", options: ["A capacidade de instalar novos sensores na máquina.", "Os valores isolados emitidos por um atuador elétrico.", "O histórico de logs deletados pelo sistema.", "Compreensão aplicada baseada na informação, gerando ação (ex: reduzir velocidade do motor para evitar falhas)."], correctAnswer: 3 },
                { id: 7, text: "O que caracteriza o 'Edge Computing' (Computação de Borda) na análise de dados IoT?", options: ["Armazenamento exclusivo na nuvem centralizada.", "Processamento local no próprio dispositivo ou roteador próximo, garantindo baixa latência e respostas em tempo real.", "Exclusão automática de dados antigos para liberar espaço.", "O uso de inteligência artificial apenas nos servidores da Amazon ou Google."], correctAnswer: 1 },
                { id: 8, text: "O que é o 'Risco de Reidentificação' no contexto ético e de privacidade da IoT?", options: ["A dificuldade de conectar um dispositivo antigo em uma rede moderna.", "O perigo de esquecer a senha do dispositivo.", "A possibilidade de que dados cruzados revelem a identidade do indivíduo, mesmo que originalmente anonimizados (ex: dados de GPS).", "Um problema de hardware onde sensores perdem seu número de IP."], correctAnswer: 2 },
                { id: 9, text: "Em relação à Responsabilidade Civil, se um carro autônomo conectado falha, como o direito aborda o dilema?", options: ["Analisa-se a cadeia de responsabilidade (fabricante, software e rede), exigindo contratos e normas claras.", "A culpa é invariavelmente apenas do usuário que comprou o carro.", "O governo cobre todos os danos causados por dispositivos IoT.", "A empresa de conectividade (provedor de internet) paga todos os custos."], correctAnswer: 0 },
                { id: 10, text: "Por que a Segurança ('Security by Design') é apontada como o maior dilema e foco inicial na IoT?", options: ["Porque as senhas sempre expiram muito rápido.", "Devido ao fato de que dispositivos IoT têm baixo poder de processamento para criptografias pesadas, virando alvos de botnets.", "Porque nenhum dispositivo IoT permite acesso à internet direta.", "Sensores físicos são fáceis de serem furtados nas fábricas."], correctAnswer: 1 },
                { id: 11, text: "No desenvolvimento de um projeto, qual a principal função de uma Prova de Conceito (PoC)?", options: ["Finalizar e empacotar o produto para venda em massa.", "Testar a viabilidade tecnológica e de negócios em pequena escala antes de grandes investimentos.", "Substituir a necessidade de escrever código no servidor.", "Mapear apenas a cor e o design do aplicativo final."], correctAnswer: 1 },
                { id: 12, text: "O que significa AIoT no contexto das perspectivas futuras?", options: ["Acessibilidade de Internet para Objetos Temporários.", "A convergência da IA com a IoT, permitindo decisões autônomas e preditivas sem intervenção humana.", "Armazenamento Isolado de Operações Técnicas.", "A rede militar de proteção para dispositivos conectados."], correctAnswer: 1 },
                { id: 13, text: "As Redes 5G e 6G impactarão a IoT viabilizando:", options: ["Menos dispositivos conectados, porém com telas maiores.", "O fim do uso de baterias recarregáveis em sensores.", "Conexão de bilhões de dispositivos por km² com latência quase zero, viabilizando operações críticas como cirurgias remotas.", "Apenas melhoria na velocidade de download de vídeos HD."], correctAnswer: 2 },
                { id: 14, text: "No uso básico do ESP32, o que o projeto 'Pisca-Pisca' ensina fundamentalmente?", options: ["Conectar o dispositivo em bancos de dados relacionais.", "Estrutura básica de código e controle de saídas digitais (GPIO).", "Comunicação por voz nativa.", "Uso de protocolos de segurança avançados como HTTPS."], correctAnswer: 1 },
                { id: 15, text: "Ao realizar a leitura de um potenciômetro no ESP32, qual conceito principal é ensinado?", options: ["A diferença entre sinais digitais (0 e 1) e sinais analógicos (faixa contínua).", "Como conectar o aparelho ao Wi-Fi.", "A formatação de textos em HTML.", "A criptografia de ponta a ponta."], correctAnswer: 0 },
                { id: 16, text: "Na Camada de Percepção, enquanto os sensores coletam dados, qual é a função dos Atuadores?", options: ["Gerar gráficos bonitos em um site.", "Emitir ondas de rádio 5G.", "Guardar os logs na nuvem.", "Realizar ações no ambiente físico com base em instruções (ex: ligar máquinas, abrir válvulas)."], correctAnswer: 3 },
                { id: 17, text: "Bluetooth, Wi-Fi, Sigfox e LoRaWAN pertencem a qual camada da Arquitetura IoT?", options: ["Camada de Percepção.", "Camada de Rede/Conexão.", "Camada de Negócios.", "Camada de Firmware."], correctAnswer: 1 },
                { id: 18, text: "Na Camada de Middleware/Firmware, qual é a responsabilidade técnica do Firmware?", options: ["Fabricar as placas de circuito impresso.", "Inicializar componentes, realizar testes de integridade e controlar fisicamente o hardware.", "Apresentar a interface gráfica para o usuário final em um smartphone.", "Cobrar o cliente pelo uso dos serviços de internet mensalmente."], correctAnswer: 1 },
                { id: 19, text: "O que ocorre na 'Camada de Aplicação' em um projeto IoT?", options: ["Os dados são armazenados de forma bruta em formato binário.", "Conectam-se os cabos de energia na placa.", "Os dados transmitidos são efetivamente utilizados para fornecer valor aos usuários (ex: Smart Cities, Automação Industrial).", "Faz-se a soldagem de componentes RFID."], correctAnswer: 2 },
                { id: 20, text: "Como a IoT soluciona desafios na Agricultura moderna?", options: ["Eliminando totalmente o trabalho no campo.", "Produzindo fertilizantes químicos autônomos dentro do laboratório.", "Monitorando o solo com sensores e realizando análises aéreas com drones (agricultura de precisão).", "Proibindo o uso de tratores tradicionais."], correctAnswer: 2 },
                { id: 21, text: "No cenário de 'Cidades Inteligentes', como a IoT ajuda na gestão de congestionamentos?", options: ["Construindo novas rodovias de forma autônoma.", "Através de sistemas de monitoramento de tráfego, gestão inteligente e energia sincronizada.", "Desligando a internet dos celulares para focar na direção.", "Proibindo a venda de veículos manuais."], correctAnswer: 1 },
                { id: 22, text: "O que a legislação, como a LGPD, exige rigorosamente na coleta de dados de um smartwatch?", options: ["Que os dados sejam enviados anonimamente para a Receita Federal.", "Coleta consentida e informada, o consentimento deve ser explícito e transparente.", "Que a pulseira não tire fotos.", "Que o usuário compre licenças adicionais para liberar a privacidade."], correctAnswer: 1 },
                { id: 23, text: "Durante a escolha de Rede de Hardware para o projeto, qual protocolo é recomendado para campo aberto e baixo gasto de bateria?", options: ["Wi-Fi", "Bluetooth", "Cabo de Rede (Ethernet)", "LoRa / LoRaWAN"], correctAnswer: 3 },
                { id: 24, text: "Hoje em dia, a evolução histórica da IoT descreve uma transição do paradigma M2M (Machine-to-Machine) para o quê?", options: ["Ecossistema fechado local.", "Um ecossistema global de bilhões de dispositivos conectados que interagem.", "Uso exclusivo de máquinas desconectadas operando em silos.", "Mecanização pesada de fábricas de software."], correctAnswer: 1 },
                { id: 25, text: "Como a Transformação Digital via IoT afeta a 'Eficiência Operacional' das indústrias?", options: ["Aumentando o trabalho manual e uso de papel.", "Permitindo a automação de processos, controle de dispositivos e otimização em tempo real.", "Exigindo mais gerentes humanos na linha de produção.", "Diminuindo a comunicação entre setores."], correctAnswer: 1 },
                { id: 26, text: "Na Gestão Ambiental, qual contribuição valiosa a IoT traz com a Eficiência Energética?", options: ["Apagando sistemas de segurança aleatoriamente para economizar.", "Contribuindo para uma gestão eficiente de energia em edifícios, reduzindo o consumo e emissões de carbono.", "Aumentando a tensão elétrica para que aparelhos funcionem mais rápido.", "Produzindo baterias infinitas."], correctAnswer: 1 },
                { id: 27, text: "Segundo o princípio da pirâmide de valor industrial, instalar sensores na fábrica é:", options: ["O fim absoluto de um projeto IoT.", "Inútil se não houver Wi-Fi em todo o galpão.", "O meio, mas não o fim, sendo necessário processar para extrair conhecimento valioso.", "Uma perda de dinheiro caso a máquina seja nova."], correctAnswer: 2 },
                { id: 28, text: "Na inovação, a diferença entre Produtos Inteligentes e Serviços Personalizados via IoT é que produtos abrangem bens como carros, e serviços buscam:", options: ["Vender garantias estendidas inúteis.", "Melhorar a satisfação do cliente criando experiências pautadas nos dados recebidos.", "Substituir o SAC por robôs lentos.", "Apagar as memórias dos usuários ao encerrar o contrato."], correctAnswer: 1 },
                { id: 29, text: "Dentro da estrutura da IoT, componentes como botões (push-buttons) e potenciômetros estão vinculados primariamente a funções de:", options: ["Protocolos de rede complexos.", "Saídas para mover motores pesados.", "Entrada de dados (Analógicos ou Digitais).", "Inteligência Artificial Nativa."], correctAnswer: 2 },
                { id: 30, text: "Sistemas como o de leitura RFID que captam informações de etiquetas passivas situam-se em qual camada IoT?", options: ["Camada de Percepção.", "Camada de Negócio.", "Camada de Aplicação.", "Camada de Middleware."], correctAnswer: 0 }
            ]
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        }
    },
    mounted() {
        this.addLog("Inicializando Gateway IoT e calibrando sensores...", "log-info");
        setTimeout(() => {
            this.loadQuestion();
        }, 1000);
    },
    methods: {
        getLetter(index) {
            return String.fromCharCode(65 + index);
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
            
            const attemptData = {
                questionText: this.currentQuestion.text,
                selectedAnswer: this.currentQuestion.options[this.userSelection],
                correctAnswer: this.currentQuestion.options[this.currentQuestion.correctAnswer],
                isCorrect: isCorrect
            };

            if (isCorrect) {
                this.feedbackType = "success";
                this.feedbackMsg = `Pacote validado! Resposta correta: <strong>${this.getLetter(this.currentQuestion.correctAnswer)}</strong>.`;
                this.score++;
                this.addLog(`Dado IoT recebido com integridade. Sensor ${this.currentQuestion.id} respondendo.`, "log-success");
                
                this.userAnswersReport.push(attemptData);
                
                setTimeout(() => { this.nextQuestion(); }, 2000);

            } else {
                this.attemptsLeft--;
                
                if (this.attemptsLeft > 0) {
                    this.feedbackType = "warning";
                    this.feedbackMsg = `Pacote corrompido ou colisão de rede. Você tem mais <strong>${this.attemptsLeft}</strong> tentativa(s).`;
                    this.addLog(`Falha na comunicação (Timeout). Tentativas restantes: ${this.attemptsLeft}`, "log-warning");
                    this.transitionDelay = false;
                } else {
                    this.feedbackType = "error";
                    
                    // Captura a resposta correta de forma legível
                    const respostaValida = `${this.getLetter(this.currentQuestion.correctAnswer)}) ${this.currentQuestion.options[this.currentQuestion.correctAnswer]}`;
                    
                    // Mostra na caixa de feedback
                    this.feedbackMsg = `Conexão Perdida. Zero tentativas restantes.<br><br><span style="color: var(--success);"><strong>Resolução Válida:</strong> ${respostaValida}</span>`;
                    
                    // Registra a resposta correta de forma permanente no terminal
                    this.addLog(`Sinal interrompido. A resolução válida era: ${respostaValida}`, "log-error");
                    
                    this.userAnswersReport.push(attemptData);

                    // Aumentado para 8 segundos para dar tempo de leitura confortável
                    setTimeout(() => { this.nextQuestion(); }, 8000); 
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
            await this.typeWriter(`Carregando telemetria da porta [${this.currentQuestion.id}/30]...`, "log-info");
            this.isTyping = false;
        },

        finishQuiz() {
            this.quizFinished = true;
            this.addLog("Rede totalmente mapeada. Finalizando relatórios de diagnóstico IoT.", "log-info");
        },

        // Função alterada para gerar PDF conforme solicitado
        exportPDF() {
            const reportDiv = document.createElement('div');
            reportDiv.style.padding = '20px';
            reportDiv.style.fontFamily = 'Arial, sans-serif';
            reportDiv.style.color = '#333';
            
            let htmlContent = `
                <h1 style="color: #008b8b; text-align: center;">Relatório de Desempenho - IoT Escape Room</h1>
                <h3 style="text-align: center;">Score Final: <span style="color: ${this.score >= 15 ? 'green' : 'red'};">${this.score} / ${this.questions.length}</span></h3>
                <hr style="margin-bottom: 20px;">
            `;

            this.userAnswersReport.forEach((q, index) => {
                htmlContent += `
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                        <p style="font-weight: bold; font-size: 14px; margin: 0 0 5px 0;">${index + 1}. ${q.questionText}</p>
                        <p style="margin: 0 0 5px 0; font-size: 13px;">
                            <strong>Sua Resposta:</strong> <span style="color: ${q.isCorrect ? 'green' : 'red'};">${q.selectedAnswer}</span>
                        </p>
                        ${!q.isCorrect ? `<p style="margin: 0; font-size: 13px; color: #555;"><strong>Correta:</strong> ${q.correctAnswer}</p>` : ''}
                    </div>
                `;
            });

            reportDiv.innerHTML = htmlContent;

            // Opções do HTML2PDF
            const opt = {
                margin:       10,
                filename:     'resultado-iot.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Gera e baixa o PDF
            html2pdf().set(opt).from(reportDiv).save();
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
                }, 20); 
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
            this.addLog("Reiniciando sistema de gateway...", "log-warning");
            setTimeout(() => this.loadQuestion(), 1000);
        }
    }
}).mount('#app');