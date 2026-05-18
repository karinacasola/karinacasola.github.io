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
        const showAnswer = ref(false); // Controla a exibição da área de explicação
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        const maxAttempts = 3;

        // --- Banco de Questões (20 Questões baseadas estritamente no PDF) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Conceito Fundamental de Álgebra Linear.",
                scenario: "A Álgebra Linear é a base para o processamento de imagens, gráficos 3D e Inteligência Artificial.",
                text: "O que a Álgebra Linear estuda segundo o material?",
                options: [
                    "Somente sistemas de equações de primeiro grau.",
                    "Espaços vetoriais e as transformações lineares entre eles.",
                    "A geometria de formas circulares em jogos 3D.",
                    "As métricas de redes e servidores para armazenamento de dados."
                ],
                answer: "Espaços vetoriais e as transformações lineares entre eles.",
                explanation: "A definição clássica e exata contida no slide 4 do material é que a Álgebra Linear é o ramo da matemática que estuda espaços vetoriais e as transformações lineares entre eles."
            },
            {
                id: 2,
                instruction: "Definição de Vetor.",
                scenario: "Ao programar um motor físico de um jogo, o desenvolvedor precisa definir a posição e o movimento dos personagens usando vetores.",
                text: "Como um vetor é definido computacionalmente?",
                options: [
                    "Uma lista ordenada de dados (um array).",
                    "Uma seta com direção, sentido e magnitude.",
                    "Uma matriz quadrada com determinante zero.",
                    "Um número único (um escalar)."
                ],
                answer: "Uma lista ordenada de dados (um array).",
                explanation: "Geometricamente, um vetor é uma seta. Porém, computacionalmente, ele é definido como uma lista ordenada de dados, comumente implementada como um 'array' (Slide 6)."
            },
            {
                id: 3,
                instruction: "Adição de Vetores.",
                scenario: "Um robô aspirador inteligente registra seus movimentos em vetores coluna. A partir da base, ele realiza u = [1, 2]. Depois, para desviar do sofá, realiza v = [3, 1].",
                text: "Qual o vetor resultante r que representa a posição final do robô?",
                options: [
                    "r = [4, 4]",
                    "r = [3, 2]",
                    "r = [4, 3]",
                    "r = [2, 1]"
                ],
                answer: "r = [4, 3]",
                explanation: "Para somar vetores, somamos as componentes correspondentes (Regra do Polígono):<br><br>r = u + v<br>r = [1, 2] + [3, 1]<br>r = [1+3, 2+1]<br>r = [4, 3]"
            },
            {
                id: 4,
                instruction: "Subtração de Vetores.",
                scenario: "A posição atual de um drone é dada pelo vetor p = [5, 5]. O cliente alvo está na coordenada representada pelo vetor a = [2, 1].",
                text: "Calcule o vetor de deslocamento d (onde d = a - p) que o software deve aplicar aos motores.",
                options: [
                    "d = [3, 4]",
                    "d = [-3, -4]",
                    "d = [7, 6]",
                    "d = [-2, -1]"
                ],
                answer: "d = [-3, -4]",
                explanation: "Subtraímos as coordenadas de onde o drone está (p) de onde ele quer ir (a):<br><br>d = a - p<br>d = [2, 1] - [5, 5]<br>d = [2-5, 1-5]<br>d = [-3, -4]"
            },
            {
                id: 5,
                instruction: "Norma do Vetor.",
                scenario: "Sabendo que o vetor de deslocamento do drone é d = [-3, -4], e que ele perde 1% de bateria a cada unidade de distância em linha reta.",
                text: "Calcule a norma do vetor d para saber a distância total percorrida.",
                options: [
                    "7 unidades",
                    "5 unidades",
                    "25 unidades",
                    "-7 unidades"
                ],
                answer: "5 unidades",
                explanation: "A norma é calculada pelo Teorema de Pitágoras:<br><br>||d|| = &radic;((-3)² + (-4)²)<br>||d|| = &radic;(9 + 16)<br>||d|| = &radic;25<br>||d|| = 5"
            },
            {
                id: 6,
                instruction: "Produto Escalar (Conceito).",
                scenario: "O algoritmo de recomendação de uma plataforma avalia vetores que representam gostos dos usuários.",
                text: "Na Inteligência Artificial, o que o Produto Escalar mede?",
                options: [
                    "A magnitude absoluta do vetor no espaço 3D.",
                    "A Similaridade (o quão 'na mesma direção' dois dados estão apontando).",
                    "A diferença de distância euclidiana entre dois perfis.",
                    "A área esticada pela matriz de recomendação."
                ],
                answer: "A Similaridade (o quão 'na mesma direção' dois dados estão apontando).",
                explanation: "O Produto Escalar multiplica dois vetores e retorna um número único. Na IA, ele serve para medir a Similaridade matemática (Slide 16)."
            },
            {
                id: 7,
                instruction: "Produto Escalar (Cálculo).",
                scenario: "Os gostos de dois usuários são representados pelos vetores u1 = [4, 2] (Gosta muito de ação) e u2 = [3, 1] (Gosta de ação).",
                text: "Calcule o produto escalar (u1 · u2) entre eles.",
                options: [
                    "10",
                    "12",
                    "14",
                    "8"
                ],
                answer: "14",
                explanation: "Multiplicamos as posições correspondentes e somamos:<br><br>u1 · u2 = (4 * 3) + (2 * 1)<br>u1 · u2 = 12 + 2<br>u1 · u2 = 14"
            },
            {
                id: 8,
                instruction: "Definição de Matriz.",
                scenario: "Matrizes são fundamentais para representar os pixels de uma tela ou os pesos de uma rede neural.",
                text: "O que é uma Matriz?",
                options: [
                    "Uma lista unidimensional contendo apenas escalares.",
                    "Uma tabela de números organizada em linhas e colunas.",
                    "O resultado de um produto escalar.",
                    "Um espaço vetorial de uma única dimensão."
                ],
                answer: "Uma tabela de números organizada em linhas e colunas.",
                explanation: "Conforme o slide 20, uma matriz é uma tabela bidimensional de números organizada através de linhas e colunas."
            },
            {
                id: 9,
                instruction: "Regra da Adição de Matrizes.",
                scenario: "Para sobrepor dois efeitos visuais, o sistema precisa somar duas matrizes de imagem.",
                text: "Qual é a 'Regra de Ouro' para a adição de matrizes?",
                options: [
                    "A primeira matriz precisa ter colunas iguais às linhas da segunda.",
                    "Ambas as matrizes precisam ser matrizes identidade.",
                    "As matrizes podem ter tamanhos diferentes, preenchendo o vazio com zeros.",
                    "Ambas as matrizes precisam ter o mesmo número de linhas e colunas."
                ],
                answer: "Ambas as matrizes precisam ter o mesmo número de linhas e colunas.",
                explanation: "Para somar matrizes ocorre a sobreposição de dados (elemento com elemento na mesma posição). Portanto, ambas precisam ter o exato mesmo tamanho."
            },
            {
                id: 10,
                instruction: "Adição de Matrizes (Cálculo).",
                scenario: "Para aumentar o brilho da imagem, a placa de vídeo soma a Matriz da Imagem (A) com a Matriz de Brilho (B). Sendo A = [[10, 20], [30, 40]] e B = [[50, 50], [50, 50]].",
                text: "Qual é a matriz resultante C = A + B?",
                options: [
                    "C = [[60, 60], [80, 80]]",
                    "C = [[60, 70], [80, 90]]",
                    "C = [[50, 70], [80, 50]]",
                    "C = [[500, 1000], [1500, 2000]]"
                ],
                answer: "C = [[60, 70], [80, 90]]",
                explanation: "Somamos os elementos de cada posição correspondente:<br><br>Posição 11: 10 + 50 = 60<br>Posição 12: 20 + 50 = 70<br>Posição 21: 30 + 50 = 80<br>Posição 22: 40 + 50 = 90<br><br>Resultado: [[60, 70], [80, 90]]"
            },
            {
                id: 11,
                instruction: "Subtração de Matrizes (Motion Tracking).",
                scenario: "Um sistema de segurança detecta movimento subtraindo o Frame atual (F2) do Frame anterior (F1). Sendo F2 = [[55, 40], [30, 25]] e F1 = [[55, 40], [30, 20]].",
                text: "Calcule a matriz R = F2 - F1.",
                options: [
                    "R = [[0, 0], [0, -5]]",
                    "R = [[0, 0], [0, 5]]",
                    "R = [[110, 80], [60, 45]]",
                    "R = [[0, 0], [30, 5]]"
                ],
                answer: "R = [[0, 0], [0, 5]]",
                explanation: "Subtraímos elemento por elemento:<br><br>(55 - 55) = 0<br>(40 - 40) = 0<br>(30 - 30) = 0<br>(25 - 20) = 5<br><br>Resultado: [[0, 0], [0, 5]]"
            },
            {
                id: 12,
                instruction: "Multiplicação por Escalar.",
                scenario: "Um engenheiro de som dobra o volume multiplicando a matriz de áudio M = [[3, -1], [0, 4], [2, 5]] pelo escalar k = 2.",
                text: "Calcule a matriz resultante R = k * M.",
                options: [
                    "R = [[5, 1], [2, 6], [4, 7]]",
                    "R = [[3, -2], [0, 8], [2, 10]]",
                    "R = [[6, -2], [0, 8], [4, 10]]",
                    "R = [[6, -1], [0, 8], [4, 5]]"
                ],
                answer: "R = [[6, -2], [0, 8], [4, 10]]",
                explanation: "O escalar (número real) entra na matriz multiplicando TODOS os seus elementos internos:<br><br>2*3 = 6 | 2*-1 = -2<br>2*0 = 0 | 2*4 = 8<br>2*2 = 4 | 2*5 = 10"
            },
            {
                id: 13,
                instruction: "Multiplicação de Matrizes (Conceito).",
                scenario: "Ao treinar uma rede neural, uma matriz de entrada (pixels) é multiplicada pela matriz de Pesos.",
                text: "Como é feita a multiplicação entre a matriz A e a matriz B?",
                options: [
                    "Multiplicamos cada elemento de A pelo elemento na mesma posição em B.",
                    "Multiplicamos as diagonais de A e somamos ao determinante de B.",
                    "Somamos os elementos de A e multiplicamos por um vetor B.",
                    "Multiplicamos cada linha de A por cada coluna de B."
                ],
                answer: "Multiplicamos cada linha de A por cada coluna de B.",
                explanation: "O coração computacional da multiplicação matricial aplica a lógica do produto escalar: multiplicamos os elementos de cada Linha de A pela respectiva Coluna de B e somamos os resultados."
            },
            {
                id: 14,
                instruction: "Multiplicação de Matrizes (Cálculo).",
                scenario: "Em um Neurônio Artificial Simples, temos A = [[1, 2], [3, 4]] e B = [[5], [0]].",
                text: "Calcule o produto C = A x B.",
                options: [
                    "C = [[5], [15]]",
                    "C = [[5, 0], [15, 0]]",
                    "C = [[6], [7]]",
                    "C = [[15], [5]]"
                ],
                answer: "C = [[5], [15]]",
                explanation: "Aplicamos a regra Linha x Coluna:<br><br>Linha 1 x Coluna 1: (1*5) + (2*0) = 5<br>Linha 2 x Coluna 1: (3*5) + (4*0) = 15<br><br>Matriz final C = [[5], [15]]"
            },
            {
                id: 15,
                instruction: "Determinantes (Geometria).",
                scenario: "Em um motor de renderização 3D, verificar o determinante da matriz da câmera previne que o jogo 'trave' ou colapse a dimensão.",
                text: "Geometricamente, o que o determinante nos diz?",
                options: [
                    "Se o vetor resultante possui massa positiva.",
                    "Se uma transformação matricial encolhe ou estica a área de um objeto.",
                    "Se o ponto de origem [0,0] foi movido no espaço.",
                    "Se a matriz não pode ser somada com o escalar."
                ],
                answer: "Se uma transformação matricial encolhe ou estica a área de um objeto.",
                explanation: "O determinante é um valor único que mede o fator de escala de uma transformação matricial, ou seja, o quanto ela estica ou encolhe a área original."
            },
            {
                id: 16,
                instruction: "Determinantes (Cálculo).",
                scenario: "Dada a matriz de transformação do jogo M = [[3, 2], [1, 4]].",
                text: "Calcule o determinante da matriz M.",
                options: [
                    "det(M) = 14",
                    "det(M) = 10",
                    "det(M) = 7",
                    "det(M) = 0"
                ],
                answer: "det(M) = 10",
                explanation: "Para matrizes 2x2, multiplica-se a diagonal principal e subtrai-se a secundária:<br><br>det(M) = (3 * 4) - (2 * 1)<br>det(M) = 12 - 2<br>det(M) = 10"
            },
            {
                id: 17,
                instruction: "Sistemas Lineares: Regra de Cramer.",
                scenario: "A Regra de Cramer é um método clássico para resolução algébrica.",
                text: "Qual é a fórmula da Regra de Cramer para descobrir o valor de x e y?",
                options: [
                    "Zerar os elementos da diagonal e somar as linhas.",
                    "Dividir o determinante principal pela matriz identidade.",
                    "x = det(Ax) / det(A) e y = det(Ay) / det(A).",
                    "Multiplicar o escalar pelo vetor dos resultados."
                ],
                answer: "x = det(Ax) / det(A) e y = det(Ay) / det(A).",
                explanation: "A Regra de Cramer resolve o sistema isolando variáveis através da divisão de determinantes de matrizes modificadas (Ax e Ay) pelo determinante principal da matriz de coeficientes (A)."
            },
            {
                id: 18,
                instruction: "Sistemas Lineares: Cálculo com Cramer.",
                scenario: "Dado o sistema: 2x + y = 5 e x - y = 1. Já calculamos que o determinante principal det(A) = -3, e o det(Ax) = -6.",
                text: "Utilize a fórmula de Cramer para encontrar o valor de x.",
                options: [
                    "x = -2",
                    "x = 2",
                    "x = 3",
                    "x = -9"
                ],
                answer: "x = 2",
                explanation: "Aplicando a fórmula direta de Cramer:<br><br>x = det(Ax) / det(A)<br>x = -6 / -3<br>x = 2"
            },
            {
                id: 19,
                instruction: "Eliminação de Gauss.",
                scenario: "Como calcular determinantes grandes trava a máquina, computadores utilizam a Eliminação de Gauss.",
                text: "Qual é o objetivo principal da Eliminação de Gauss?",
                options: [
                    "Fazer operações entre as linhas até transformar a matriz em um triângulo (zerar os números abaixo da diagonal).",
                    "Transformar todos os valores da matriz original em números negativos.",
                    "Garantir que todas as colunas sejam vetores unitários de norma 1.",
                    "Converter matrizes quadradas em equações circulares de geometria."
                ],
                answer: "Fazer operações entre as linhas até transformar a matriz em um triângulo (zerar os números abaixo da diagonal).",
                explanation: "O algoritmo faz o 'escalonamento'. Ele cria uma Matriz Triangular zerando os componentes abaixo da diagonal principal, permitindo a resolução final de baixo para cima."
            },
            {
                id: 20,
                instruction: "Método de Gauss-Jordan.",
                scenario: "O algoritmo de Gauss-Jordan é a evolução da Eliminação de Gauss, não parando apenas no formato de triângulo.",
                text: "O que o método de Gauss-Jordan busca gerar no lado esquerdo da matriz para solucionar as equações diretamente?",
                options: [
                    "Uma Matriz Tripla",
                    "O Determinante Máximo",
                    "A Matriz Identidade",
                    "O Vetor Carga"
                ],
                answer: "A Matriz Identidade",
                explanation: "O Gauss-Jordan zera tanto abaixo quanto acima da diagonal principal e transforma a diagonal em números '1', construindo a Matriz Identidade. Isso revela os resultados diretamente do lado direito sem precisar de contas de substituição."
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
                }, 10); // Velocidade de digitação mais rápida para o quiz
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Carregando Desafio Computacional ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Processamento Linear concluído. Emitindo log de resultados...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                addLog("Sucesso: Cálculo Matricial Correto.", "log-success");
                showAnswer.value = true; // Exibe a explicação!
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    addLog("Falha: Estouro de limite computacional.", "log-error");
                    showAnswer.value = true; // Força exibir a explicação após estourar as chances
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Operação Inválida. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Operação Incorreta. Loop ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade de processamento algébrico e resolução matricial.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada das Operações Matriciais e Sistemas Lineares.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório do Simulador Matemático</h1>
                    <h2 style="color: #555; margin: 5px 0;">Álgebra Linear Aplicada</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do usuário pelas ${questions.value.length} operações críticas envolvendo vetores, matrizes, determinantes e algoritmos de escalonamento.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Algorítmico</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento processado via kernel MATH.SIMULATOR
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `AlgebraLinear_Log_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando sistema matricial...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando MATH_KERNEL_v1.0...", "log-info");
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
            nextQuestion,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');