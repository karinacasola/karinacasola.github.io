const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
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

        // 20 Questões de Análise Combinatória com Resoluções e Feedbacks
        const questions = ref([
            {
                id: 1,
                instruction: "Identificação do Método (Arranjo vs Combinação)",
                scenario: "A base de uma análise combinatória é descobrir se a ordem altera o produto. O servidor fará uma escolha de registros.",
                text: "Se a ordem de escolha dos elementos ALTERA o resultado final (ex: senhas, pódios), qual cálculo devemos aplicar?",
                options: ["Combinação Simples", "Arranjo Simples", "Fatorial Puro", "Permutação Circular"],
                answer: "Arranjo Simples",
                resolution: "<strong>Certo!</strong> No <strong>Arranjo</strong>, a ordem importa (A-B é diferente de B-A). Na Combinação, a ordem não importa (A-B é igual a B-A)."
            },
            {
                id: 2,
                instruction: "Cálculo Básico de Arranjo",
                scenario: "Um sistema de segurança exige a criação de uma senha.",
                text: "Quantas senhas de 4 dígitos distintos podemos formar usando os algarismos de 0 a 9?",
                options: ["210", "5.040", "10.000", "24"],
                answer: "5.040",
                resolution: "<strong>Resolução:</strong> Temos 10 opções para o 1º dígito, 9 para o 2º, 8 para o 3º e 7 para o 4º. Como a ordem importa, é um arranjo: A(10,4) = 10 × 9 × 8 × 7 = <strong>5.040</strong>."
            },
            {
                id: 3,
                instruction: "Cálculo Básico de Combinação",
                scenario: "A equipe de TI possui 8 desenvolvedores.",
                text: "De quantas maneiras diferentes podemos escolher um comitê de 3 desenvolvedores para revisar um código?",
                options: ["336", "56", "24", "512"],
                answer: "56",
                resolution: "<strong>Resolução:</strong> Em um comitê, a ordem dos escolhidos não importa (João, Maria e José formam o mesmo comitê que Maria, José e João). Usamos Combinação: C(8,3) = 8! / (3! * 5!) = (8×7×6) / (3×2×1) = <strong>56</strong>."
            },
            {
                id: 4,
                instruction: "Permutação Simples",
                scenario: "O algoritmo de criptografia embaralha letras.",
                text: "Quantos anagramas diferentes podemos formar com as letras da palavra LÓGICA (6 letras distintas)?",
                options: ["36", "120", "720", "5.040"],
                answer: "720",
                resolution: "<strong>Resolução:</strong> Permutação de 6 elementos distintos. P(6) = 6! = 6 × 5 × 4 × 3 × 2 × 1 = <strong>720</strong>."
            },
            {
                id: 5,
                instruction: "Combinação Múltipla (Princípio Multiplicativo)",
                scenario: "Sua startup tem 5 engenheiros Front-end e 6 engenheiros Back-end.",
                text: "Quantas equipes de projeto podem ser formadas contendo exatamente 2 Front-ends e 3 Back-ends?",
                options: ["100", "200", "300", "600"],
                answer: "200",
                resolution: "<strong>Resolução:</strong> Separamos em duas combinações: <br>Front: C(5,2) = 10.<br>Back: C(6,3) = 20.<br>Multiplicamos as possibilidades: 10 × 20 = <strong>200 equipes</strong>."
            },
            {
                id: 6,
                instruction: "Permutação com Repetição",
                scenario: "O analista de dados quer analisar combinações de palavras.",
                text: "Quantos anagramas possui a palavra DADOS (5 letras, sendo dois 'D')?",
                options: ["120", "60", "24", "10"],
                answer: "60",
                resolution: "<strong>Resolução:</strong> Temos 5 letras no total, mas a letra 'D' se repete 2 vezes. Para corrigir a contagem, dividimos o fatorial total pelo fatorial da repetição: P = 5! / 2! = 120 / 2 = <strong>60</strong>."
            },
            {
                id: 7,
                instruction: "Análise Analítica de Fórmulas",
                scenario: "O software computa combinações, mas a memória está cheia.",
                text: "Matematicamente, qual é a diferença entre a fórmula da Combinação C(n,p) e do Arranjo A(n,p)?",
                options: [
                    "A combinação multiplica o resultado por p!",
                    "A combinação divide o resultado do arranjo por p! para remover as repetições",
                    "O arranjo divide por n! e a combinação por p!",
                    "Não há diferença matemática, apenas interpretativa"
                ],
                answer: "A combinação divide o resultado do arranjo por p! para remover as repetições",
                resolution: "<strong>Resolução:</strong> A fórmula da Combinação tem o <em>p!</em> no denominador: n! / (p!(n-p)!). Isso acontece justamente para eliminar agrupamentos que possuem os mesmos elementos em ordens diferentes."
            },
            {
                id: 8,
                instruction: "Arranjo em Contexto Real",
                scenario: "Um torneio de e-sports tem 10 jogadores finalistas.",
                text: "De quantas formas podemos ter o pódio de Campeão, Vice-Campeão e Terceiro Lugar?",
                options: ["120", "720", "1.000", "30"],
                answer: "720",
                resolution: "<strong>Resolução:</strong> A ordem altera totalmente o valor do prêmio, logo é Arranjo. A(10,3) = 10 × 9 × 8 = <strong>720</strong>."
            },
            {
                id: 9,
                instruction: "Combinação (Aperto de Mão/Conexões)",
                scenario: "Em uma topologia de rede Mesh, todos os nós se conectam diretamente entre si.",
                text: "Se a rede possui 15 computadores, quantos cabos (conexões de 2 em 2) são necessários?",
                options: ["105", "210", "225", "150"],
                answer: "105",
                resolution: "<strong>Resolução:</strong> Conectar o PC 1 ao PC 2 é a mesma coisa que conectar o PC 2 ao PC 1 (a ordem não importa). Usamos Combinação: C(15,2) = (15 × 14) / (2 × 1) = <strong>105</strong>."
            },
            {
                id: 10,
                instruction: "Arranjo com Restrições",
                scenario: "Gerando identificadores de banco de dados.",
                text: "Quantos códigos de 3 letras distintas podem ser criados se o alfabeto possui 26 letras?",
                options: ["2.600", "15.600", "17.576", "1.000"],
                answer: "15.600",
                resolution: "<strong>Resolução:</strong> A ordem das letras muda o código. A(26,3) = 26 × 25 × 24 = <strong>15.600</strong>."
            },
            {
                id: 11,
                instruction: "Combinação na Análise de Testes",
                scenario: "Um testador QA tem 12 casos de teste escritos, mas hoje só tem tempo para rodar 4.",
                text: "De quantas maneiras ele pode escolher o lote de 4 testes que executará hoje?",
                options: ["495", "11.880", "48", "240"],
                answer: "495",
                resolution: "<strong>Resolução:</strong> A ordem em que ele escolhe os testes para colocar no lote não importa. Combinação: C(12,4) = (12×11×10×9) / (4×3×2×1) = <strong>495</strong>."
            },
            {
                id: 12,
                instruction: "Problema Misto (Análise Condicional)",
                scenario: "Uma senha deve conter exatamente 2 vogais distintas e 3 algarismos ímpares distintos.",
                text: "Sabendo que existem 5 vogais e 5 algarismos ímpares (1,3,5,7,9), quantas combinações de grupos podemos escolher (ignorando a permutação da senha)?",
                options: ["100", "50", "25", "200"],
                answer: "100",
                resolution: "<strong>Resolução:</strong> O enunciado pede apenas a 'escolha' dos grupos, então é Combinação.<br>Vogais: C(5,2) = 10.<br>Ímpares: C(5,3) = 10.<br>Total: 10 × 10 = <strong>100 agrupamentos</strong>."
            },
            {
                id: 13,
                instruction: "Arranjo vs Combinação no Mesmo Cenário",
                scenario: "Uma empresa vai sortear viagens. Cenário A: Sorteio de 1 viagem pra Paris e 1 pra NY. Cenário B: Sorteio de 2 pacotes iguais para NY.",
                text: "Para 20 funcionários participantes, qual o cálculo para o Cenário A e Cenário B, respectivamente?",
                options: [
                    "A(20,2) e C(20,2)", 
                    "C(20,2) e A(20,2)", 
                    "Ambos usam Arranjo", 
                    "Ambos usam Combinação"
                ],
                answer: "A(20,2) e C(20,2)",
                resolution: "<strong>Resolução:</strong> No Cenário A, os prêmios são diferentes (Paris x NY), a ordem de quem é sorteado primeiro importa (Arranjo). No Cenário B, os prêmios são iguais, a ordem não importa (Combinação)."
            },
            {
                id: 14,
                instruction: "Permutação Circular",
                scenario: "Reunião de Stakeholders.",
                text: "De quantas formas podemos acomodar 6 pessoas ao redor de uma mesa de reuniões redonda?",
                options: ["720", "120", "36", "360"],
                answer: "120",
                resolution: "<strong>Resolução:</strong> Em permutação circular, rotacionar as pessoas não gera uma nova configuração se as posições relativas continuarem iguais. Fórmula: (n-1)! -> (6-1)! = 5! = <strong>120</strong>."
            },
            {
                id: 15,
                instruction: "Anagramas com restrição",
                scenario: "O sistema busca padrões em strings.",
                text: "Quantos anagramas da palavra PYTHON começam obrigatoriamente com a letra P?",
                options: ["720", "120", "24", "600"],
                answer: "120",
                resolution: "<strong>Resolução:</strong> Como a letra 'P' deve estar fixa na primeira posição, sobram as outras 5 letras (Y,T,H,O,N) para permutarmos nas 5 posições restantes. P(5) = 5! = <strong>120</strong>."
            },
            {
                id: 16,
                instruction: "Combinação (O paradoxo do Campeonato)",
                scenario: "Um torneio de xadrez com 8 participantes, onde todos jogam contra todos em turno e returno (duas partidas por dupla).",
                text: "Como podemos calcular o total de partidas?",
                options: [
                    "C(8,2)",
                    "A(8,2)",
                    "P(8)",
                    "C(8,2) / 2"
                ],
                answer: "A(8,2)",
                resolution: "<strong>Resolução:</strong> Uma partida normal seria Combinação C(8,2) pois A jogar com B é o mesmo que B jogar com A. PORÉM, como há turno e returno (ida e volta, brancas e pretas), a ordem importa ou multiplicamos por 2. C(8,2) * 2 é matematicamente igual a <strong>A(8,2)</strong>."
            },
            {
                id: 17,
                instruction: "Combinação (Subconjuntos)",
                scenario: "Preparando um dataset para testes (Machine Learning).",
                text: "O analista quer escolher exatamente 5 features (variáveis) de um banco que possui 7 features. Quantas opções de dataset ele tem?",
                options: ["21", "42", "2.520", "504"],
                answer: "21",
                resolution: "<strong>Resolução:</strong> A ordem em que as variáveis entram no modelo de árvore de decisão não importa. C(7,5) = C(7,2) (Propriedade complementar). C(7,2) = (7×6)/(2×1) = <strong>21</strong>."
            },
            {
                id: 18,
                instruction: "Arranjo (Estante de Servidores)",
                scenario: "Instalação física em Rack.",
                text: "Temos 4 servidores diferentes para alocar em um rack que possui 6 slots vazios disponíveis. De quantas maneiras podemos encaixá-los?",
                options: ["15", "24", "360", "1.296"],
                answer: "360",
                resolution: "<strong>Resolução:</strong> Os servidores são diferentes e os slots têm posições diferentes (topo, base, meio). A ordem altera a configuração térmica e física. A(6,4) = 6 × 5 × 4 × 3 = <strong>360</strong>."
            },
            {
                id: 19,
                instruction: "Arranjo - Princípio Fundamental da Contagem",
                scenario: "Validação de rotas de entrega.",
                text: "Para ir da cidade A até B existem 3 estradas, e de B para C existem 4 estradas. Quantas rotas diferentes existem de A para C passando por B?",
                options: ["7", "12", "64", "81"],
                answer: "12",
                resolution: "<strong>Resolução:</strong> Pelo princípio multiplicativo clássico, multiplicamos as possibilidades de cada etapa: 3 × 4 = <strong>12</strong> caminhos."
            },
            {
                id: 20,
                instruction: "Desafio Final: Lógica Pura",
                scenario: "Avaliando a eficiência de um algoritmo que gera cartelas de loteria.",
                text: "Em um jogo escolhem-se 6 números de 60 possíveis. O programador usou a função de Arranjo A(60,6) em vez da Combinação C(60,6). O que ocorrerá?",
                options: [
                    "Vai travar, o Arranjo é infinito.",
                    "O programa gerará muito mais cartelas, tratando a sequência 1-2-3 e 3-2-1 como cartelas diferentes.",
                    "Gerará o mesmo número, loterias consideram a ordem.",
                    "O programa gerará menos cartelas, cortando os fatoriais."
                ],
                answer: "O programa gerará muito mais cartelas, tratando a sequência 1-2-3 e 3-2-1 como cartelas diferentes.",
                resolution: "<strong>Resolução:</strong> Na Loteria, o que ganha é o conjunto de números, independentemente da ordem do sorteio. Ao usar Arranjo, o algoritmo tratou a ordem como importante, causando explosão combinatória desnecessária e gerando cartelas duplicadas no sentido do jogo."
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Terminal e Scroll ---
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
            await typeWriter(`Iniciando análise lógica: Desafio ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(currentQuestion.value.scenario, "log-default");
            
            // Re-render MathJax se o script existir
            nextTick(() => {
                if(window.MathJax) {
                    MathJax.typesetPromise();
                }
            });
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
                addLog("Auditoria concluída. Processando resultados para emissão de relatório PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                // ACERTOU
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Lógica Inquestionável! Resposta Correta.";
                addLog("Sucesso: Expressão combinatória resolvida com exatidão.", "log-success");
                showAnswer.value = true;
            } else {
                // ERROU
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Falha Crítica. A reposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Erro Crítico: Limite de iterações atingido no compilador matemático.", "log-error");
                    showAnswer.value = true; // Mostra resolução
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Inconsistente. Tentativas restantes: ${maxAttempts - attempts.value}. Reavalie se a ordem importa!`;
                    addLog(`Aviso de Sintaxe: Lógica incorreta. Recalculando... (${attempts.value}/${maxAttempts})`, "log-warning");
                }
            }
            
            nextTick(() => {
                if(window.MathJax && showAnswer.value) {
                    MathJax.typesetPromise();
                }
            });
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente domínio em Arranjos, Combinações e Permutações.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão das fórmulas matemáticas e do conceito de ordem em agrupamentos.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Análise Combinatória</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Lógica Algorítmica</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelos ${questions.value.length} testes matemáticos envolvendo permutações, arranjos com/sem repetição e combinações complexas.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Engine MATH.LOGIC
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Combinatoria_Resultados_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando Máquina de Lógica...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador MATH_ENGINE_v1.0...", "log-info");
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
            resetGame,
            nextQuestion
        };
    }
}).mount('#app');