const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentQuestionIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const showAnswer = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        const maxAttempts = 3;

        // --- Banco de Questões (3 Perguntas baseadas nos Slides de Indústria 4.0) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Identifique o Middleware de Rede.",
                scenario: "Milhares de sensores industriais precisam enviar dados de forma simultânea e leve para um servidor central, porém a rede da fábrica sofre com instabilidades constantes.",
                text: "Qual protocolo é utilizado na arquitetura PoC para atuar como mediador (Broker) focado no modelo de envio Pub/Sub?",
                options: [
                    "HTTP (Requisição/Resposta Padrão)",
                    "MQTT (Message Queuing Telemetry Transport)",
                    "Modbus TCP",
                    "Protocolo de Camada Scikit-Learn"
                ],
                answer: "MQTT (Message Queuing Telemetry Transport)"
            },
            {
                id: 2,
                instruction: "Integração Hardware/Software no Edge.",
                scenario: "O engenheiro de automação tenta rodar o pipeline Python importando a biblioteca pyFirmata2, mas o Arduino Uno ignora completamente os comandos lógicos enviados pela porta serial.",
                text: "Qual o pré-requisito obrigatório que deve ser gravado no microcontrolador para que ele atue como tradutor dos comandos do Python?",
                options: [
                    "Modelo Isolation Forest instanciado",
                    "Interface Brython",
                    "Driver CH340 exclusivamente",
                    "Firmware StandardFirmata (em C++)"
                ],
                answer: "Firmware StandardFirmata (em C++)"
            },
            {
                id: 3,
                instruction: "Detecção de Anomalias com IA Edge.",
                scenario: "O dado do sensor LDR percorreu o pipeline, foi normalizado e acaba de entrar no algoritmo de Machine Learning. O modelo de inferência executa a função `.predict()`.",
                text: "De acordo com a configuração base do Isolation Forest da arquitetura estudada, o que significa quando essa função retorna o valor numérico '-1'?",
                options: [
                    "Dado Normal validado - Volta a ler o sensor LDR.",
                    "Anomalia detectada - Envia comando de feedback para o atuador.",
                    "Calibração (fit) não inicializada - Falta de baseline histórica.",
                    "Perda de conexão MQTT - Retornando ao Início."
                ],
                answer: "Anomalia detectada - Envia comando de feedback para o atuador."
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal (Terminal e Fluxo de Jogo) ---
        const scrollToBottom = () => {
            nextTick(() => {
                if (terminalBody.value) { 
                    terminalBody.value.scrollTop = terminalBody.value.scrollHeight; 
                }
            });
        };

        const addLog = (text, type = "log-default") => {
            logs.value.push({ text, type });
            scrollToBottom();
        };

        const typeWriter = (text, type) => {
            return new Promise(resolve => {
                logs.value.push({ text: "", type });
                let currentLogIndex = logs.value.length - 1; 
                let i = 0;
                
                const interval = setInterval(() => {
                    logs.value[currentLogIndex].text += text.charAt(i);
                    scrollToBottom(); 
                    i++;
                    
                    if (i === text.length) { 
                        clearInterval(interval); 
                        resolve(); 
                    }
                }, 20); // Velocidade de digitação
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Iniciando aquisição do bloco ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(currentQuestion.value.scenario, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userSelection.value = null; 
            attempts.value = 0; 
            showAnswer.value = false; 
            feedbackMsg.value = ""; 
            feedbackType.value = "";
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < questions.value.length - 1) {
                currentQuestionIndex.value++;
                resetTurn();
                loadQuestion();
            } else {
                gameOver.value = true;
                addLog("Validação de arquitetura finalizada. Gerando relatório técnico...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Integração Correta! Parâmetro arquitetural validado.";
                addLog("Status 200: Validação estrutural confirmada.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Falha Crítica. Timeout esgotado. A configuração correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Erro 500: Falha de arquitetura do pipeline detectada.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Parâmetro Inválido. Nova tentativa: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso 400: Parâmetro incompatível. Retentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString('pt-BR');
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente domínio da Arquitetura IoT e Indústria 4.0.";
            if (score.value < 3) performanceMsg = "Recomenda-se revisão das camadas de comunicação (MQTT) e algoritmos de Edge AI.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório Técnico - Indústria 4.0</h1>
                    <h2 style="color: #555; margin: 5px 0;">Avaliação de Arquitetura de Sistemas</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Auditoria:</strong> ${data}</p>
                    <p>Este documento atesta a análise dos conceitos estruturais de integração IoT envolvendo hardware (Arduino), protocolos de mensageria (MQTT) e inferência na borda com modelos de Machine Learning (Scikit-Learn).</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador de Performance</h3>
                        <p style="font-size: 28px; color: ${score.value === 3 ? '#10B981' : (score.value === 2 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Pontos Válidos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento processado pelo Simulador INDUSTRIA.4.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Industria40_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        const resetGame = () => {
            currentQuestionIndex.value = 0; 
            score.value = 0; 
            logs.value = []; 
            gameOver.value = false;
            resetTurn();
            addLog("Reiniciando serviços e limpando pipeline MQTT...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Módulo de Arquitetura Edge_IA_v1.0...", "log-info");
            setTimeout(() => { loadQuestion(); }, 1000);
        });

        return {
            questions,
            currentQuestionIndex,
            currentQuestion,
            progressPercentage,
            attempts,
            score,
            logs,
            isTyping,
            feedbackMsg,
            feedbackType,
            showAnswer,
            gameOver,
            userSelection,
            terminalBody,
            selectOption,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');