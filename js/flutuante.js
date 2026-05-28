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

        // --- Banco de Questões (Aritmética de Ponto Flutuante) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Ponto Fixo vs. Flutuante",
                scenario: "Durante a modelagem de uma rede neural, você precisa escolher entre as arquiteturas de armazenamento numérico: ponto fixo ou ponto flutuante.",
                text: "Qual é a principal vantagem e o respectivo custo ao adotar o sistema de ponto flutuante?",
                options: [
                    "Ganha-se velocidade de processamento, mas perde-se capacidade de armazenamento no banco de dados.",
                    "Ganha-se capacidade de representar uma gama muito maior de números, mas perde-se precisão (arredondamento/truncamento).",
                    "Ganha-se precisão absoluta, mas perde-se a possibilidade de representar números negativos ou decimais.",
                    "Não há custo, o ponto flutuante é superior e consome menos memória RAM em todas as métricas."
                ],
                answer: "Ganha-se capacidade de representar uma gama muito maior de números, mas perde-se precisão (arredondamento/truncamento)."
            },
            {
                id: 2,
                instruction: "Equação Fundamental do Ponto Flutuante",
                scenario: "Você está definindo a arquitetura de baixo nível de um compilador e precisa codificar a fórmula base que rege a criação dos números na máquina.",
                text: "Como é definida a Equação Geral de um Número de Máquina (X) no ponto flutuante?",
                options: [
                    "X = d / β^e",
                    "X = (d + β) ^ e",
                    "X = ± d · β^e",
                    "X = ± e · β^d"
                ],
                answer: "X = ± d · β^e"
            },
            {
                id: 3,
                instruction: "O Princípio da Normalização",
                scenario: "Para que o sistema opere corretamente com as potências alocadas, requer-se que o valor 1,38 seja normalizado na base decimal.",
                text: "Qual é o resultado da normalização e o que ocorre com o expoente ao mover a vírgula para a esquerda?",
                options: [
                    "13.8 × 10^-1 (Expoente diminui negativo)",
                    "0.138 × 10^1 (Expoente cresce positivo)",
                    "0.0138 × 10^2 (Expoente diminui progressivamente)",
                    "1.38 × 10^0 (Expoente inalterado, mantissa preservada)"
                ],
                answer: "0.138 × 10^1 (Expoente cresce positivo)"
            },
            {
                id: 4,
                instruction: "Truncamento vs. Arredondamento",
                scenario: "Um sistema computacional operando com um limite máximo de t=5 casas precisa armazenar o número 0.920637 × 10².",
                text: "Quais são os resultados armazenados na memória se o sistema aplicar Truncamento e Arredondamento, respectivamente?",
                options: [
                    "0.92064 × 10² (Truncamento) e 0.92063 × 10² (Arredondamento)",
                    "0.92060 × 10² (Truncamento) e 0.92065 × 10² (Arredondamento)",
                    "0.92063 × 10² (Truncamento) e 0.92064 × 10² (Arredondamento)",
                    "Ambos resultarão inexoravelmente em 0.92064 × 10²"
                ],
                answer: "0.92063 × 10² (Truncamento) e 0.92064 × 10² (Arredondamento)"
            },
            {
                id: 5,
                instruction: "Fronteiras da Máquina: Overflow e Underflow",
                scenario: "Um algoritmo matemático tenta elevar o valor 10 a uma potência extrema decrescente. Como resultado, o número gerado é tão microscópico que o sistema acaba registrando-o como zero.",
                text: "Avaliando os limites da máquina, qual é a definição correta do erro gerado?",
                options: [
                    "Overflow, pois o expoente ultrapassou o limite superior máximo suportado.",
                    "Underflow, pois o expoente atingiu um valor inferior ao limite mínimo suportado pela arquitetura.",
                    "Truncamento severo na seção de armazenamento da mantissa.",
                    "Erro fatal de normalização binária com perda total de sinal."
                ],
                answer: "Underflow, pois o expoente atingiu um valor inferior ao limite mínimo suportado pela arquitetura."
            },
            {
                id: 6,
                instruction: "Padrão IEEE 754 (32 bits)",
                scenario: "Durante o pré-processamento de Big Data, você decide otimizar a alocação de memória convertendo as matrizes do Pandas para precisão simples (Float32).",
                text: "Como os 32 bits são distribuídos na arquitetura segundo a padronização IEEE 754?",
                options: [
                    "1 bit para o sinal, 11 bits para o expoente, 20 bits para a fração.",
                    "2 bits para o sinal, 10 bits para o expoente, 20 bits para a fração.",
                    "1 bit para o sinal, 15 bits para o expoente, 16 bits para a fração.",
                    "1 bit para o sinal, 8 bits para o expoente, 23 bits para a fração."
                ],
                answer: "1 bit para o sinal, 8 bits para o expoente, 23 bits para a fração."
            },
            {
                id: 7,
                instruction: "Boas Práticas em Ciência de Dados",
                scenario: "Você está elaborando um teste unitário para validar o custo computacional de um modelo de Deep Learning e precisa verificar se a taxa de erro chegou a zero absoluto.",
                text: "Qual é a recomendação de boas práticas para realizar a checagem de igualdade com dados em ponto flutuante?",
                options: [
                    "Utilizar 'if erro == 0.0:' diretamente no condicional.",
                    "Utilizar 'math.isclose(erro, 0.0)' ou 'np.isclose()'.",
                    "Converter o número float para string e testar a igualdade com a string '0.0'.",
                    "Utilizar 'if erro === 0:' seguindo o controle de tipagem rigorosa."
                ],
                answer: "Utilizar 'math.isclose(erro, 0.0)' ou 'np.isclose()'."
            },
            {
                id: 8,
                instruction: "Decomposição Base Binária",
                scenario: "A maioria dos sistemas operam internamente na base binária (β=2). Para ser processado, o valor numérico decimal 37 precisa ser decomposto em linguagem de máquina.",
                text: "Qual é a equação de decomposição correta do número 37 (decimal) utilizando potências de base 2?",
                options: [
                    "2^4 + 2^3 + 2^1 (Equivalente a 16 + 8 + 2)",
                    "2^6 + 2^1 (Equivalente a 64 + 2)",
                    "2^5 + 2^2 + 2^0 (Equivalente a 32 + 4 + 1)",
                    "2^5 + 2^1 + 2^0 (Equivalente a 32 + 2 + 1)"
                ],
                answer: "2^5 + 2^2 + 2^0 (Equivalente a 32 + 4 + 1)"
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal ---
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
                }, 15);
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Analisando Bloco de Processamento ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Auditoria Numérica concluída. Emitindo certificado no formato PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Arquitetura numérica validada.";
                addLog("Status 200: Validação matemática precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Excedeu tentativas de compilação. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Erro Crítico: Estouro de Pilha (Stack Overflow).", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Ciclos de CPU restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Alerta de Truncamento: Falha na validação - Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos fundamentos da arquitetura computacional.";
            if (score.value < 5) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de base, mantissa e expoentes.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Auditoria em Ponto Flutuante</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Arquitetura Numérica</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Registro de Sistema:</strong> ${data}</p>
                    <p>Este log atesta a avaliação crítica do engenheiro envolvendo os processos de limites, normalizações, mantissas binárias, e uso do padrão IEEE 754.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho de Compilação</h3>
                        <p style="font-size: 28px; color: ${score.value >= 5 ? '#10B981' : (score.value >= 3 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Validações Bem-sucedidas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado e assinado via Simulador FLOAT.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Float_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando Kernel Matemático...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Float_System_v1.0...", "log-info");
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