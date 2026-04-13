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

        // Banco de 30 Questões: 10 Teoria, 10 Prática PFC, 10 Prática Mista
        const questions = ref([
            // --- BLOCO 1: TEORIA BÁSICA (10 Questões) ---
            { id: 1, instruction: "Teoria: Princípio Multiplicativo", scenario: "Avaliando opções de escolha sucessivas.", text: "No Princípio Fundamental da Contagem (PFC), quando temos que tomar uma decisão 'E' depois outra decisão, o que fazemos com o número de opções?", options: ["Somamos os valores.", "Multiplicamos os valores.", "Subtraímos os valores.", "Dividimos um pelo outro."], answer: "Multiplicamos os valores.", explanation: "Quando os eventos ocorrem em sequência (Regra do 'E'), nós multiplicamos as possibilidades. Exemplo: escolher 1 calça E 1 camisa." },
            { id: 2, instruction: "Teoria: Arranjo vs Combinação", scenario: "Entendendo a importância da ordem.", text: "Qual é a principal diferença prática entre Arranjo e Combinação?", options: ["No Arranjo a ordem dos elementos importa; na Combinação, não.", "Na Combinação a ordem dos elementos importa; no Arranjo, não.", "Arranjo é usado para somar, Combinação para multiplicar.", "Não há diferença, são sinônimos."], answer: "No Arranjo a ordem dos elementos importa; na Combinação, não.", explanation: "Arranjo: A ordem muda o resultado (ex: senhas, pódio). Combinação: A ordem não muda o resultado (ex: fazer uma vitamina de frutas, formar um grupo)." },
            { id: 3, instruction: "Teoria: O que é Fatorial?", scenario: "Definição matemática básica.", text: "O que significa o símbolo de exclamação em matemática, como em 4! (lê-se 4 fatorial)?", options: ["Somar o número com seus antecessores até 0.", "Multiplicar o número por 4.", "Elevar o número ao quadrado.", "Multiplicar o número por todos os seus antecessores maiores que zero."], answer: "Multiplicar o número por todos os seus antecessores maiores que zero.", explanation: "Fatorial significa a multiplicação decrescente: 4! = 4 × 3 × 2 × 1." },
            { id: 4, instruction: "Teoria: Fatorial de Zero", scenario: "Regras especiais da matemática.", text: "Por convenção matemática, qual é o valor de 0! (zero fatorial)?", options: ["0", "1", "10", "Indefinido"], answer: "1", explanation: "Por definição matemática (para que as fórmulas de combinação funcionem), o fatorial de 0 é sempre igual a 1." },
            { id: 5, instruction: "Teoria: Permutação Simples", scenario: "Trocando elementos de lugar.", text: "O que significa 'Permutar' elementos em Análise Combinatória?", options: ["Excluir metade dos elementos.", "Apenas misturar, trocando a ordem de TODOS os elementos disponíveis.", "Escolher apenas 2 elementos de um grupo maior.", "Somar os elementos."], answer: "Apenas misturar, trocando a ordem de TODOS os elementos disponíveis.", explanation: "Permutar vem de permuta (troca). É descobrir de quantas formas podemos organizar/embaralhar todos os itens de um conjunto." },
            { id: 6, instruction: "Teoria: Permutação com Repetição", scenario: "Letras repetidas em palavras.", text: "Quando fazemos os anagramas de uma palavra que tem letras repetidas (como 'OVO'), o que devemos fazer no cálculo?", options: ["Ignorar as letras repetidas.", "Multiplicar tudo por 2.", "Dividir o total pelo fatorial das quantidades de letras que se repetem.", "Somar o número de letras."], answer: "Dividir o total pelo fatorial das quantidades de letras que se repetem.", explanation: "Como trocar dois 'O's de lugar não gera uma palavra nova, dividimos o resultado para retirar essas contagens duplicadas." },
            { id: 7, instruction: "Teoria: Identificando um Arranjo", scenario: "Situações do dia a dia.", text: "Qual das situações abaixo é claramente um problema de ARRANJO?", options: ["Escolher 3 amigos para ir ao cinema.", "Criar uma senha de 4 algarismos para o banco.", "Fazer um suco com 2 frutas diferentes.", "Sortear 2 pessoas para ganharem o mesmo prêmio."], answer: "Criar uma senha de 4 algarismos para o banco.", explanation: "Na senha do banco, a ordem importa (1234 é diferente de 4321). Se a ordem importa, usamos Arranjo ou PFC." },
            { id: 8, instruction: "Teoria: Identificando uma Combinação", scenario: "Situações do dia a dia.", text: "Qual das situações abaixo é claramente um problema de COMBINAÇÃO?", options: ["Escolher quem será o Presidente e o Vice de um clube.", "A ordem de chegada em uma corrida.", "Escolher 2 sabores de sorvete para colocar no copinho.", "Organizar 5 livros diferentes em uma prateleira."], answer: "Escolher 2 sabores de sorvete para colocar no copinho.", explanation: "No sorvete, escolher Morango e Chocolate é a mesma coisa que escolher Chocolate e Morango. A ordem não importa, logo é Combinação." },
            { id: 9, instruction: "Teoria: Princípio Aditivo", scenario: "Opções excludentes.", text: "Quando você deve escolher UMA opção de transporte: ir de carro (2 opções) OU ir de ônibus (3 opções). O que você faz com os números?", options: ["Multiplica (2 x 3).", "Soma (2 + 3).", "Subtrai (3 - 2).", "Calcula o fatorial."], answer: "Soma (2 + 3).", explanation: "Quando as escolhas são independentes e você só pode escolher UMA delas (Regra do 'OU'), você soma as opções: 2 + 3 = 5 formas." },
            { id: 10, instruction: "Teoria: Anagramas", scenario: "Formação de palavras.", text: "O que é um Anagrama?", options: ["Qualquer palavra que rima com outra.", "Uma palavra formada mudando a ordem das letras de outra palavra.", "Apenas palavras com letras diferentes.", "Um tipo de combinação."], answer: "Uma palavra formada mudando a ordem das letras de outra palavra.", explanation: "Anagrama é toda permutação (troca de ordem) das letras de uma palavra para formar outras, tendo elas sentido na linguagem ou não." },

            // --- BLOCO 2: PRÁTICA - PRINCÍPIO FUNDAMENTAL DA CONTAGEM (10 Questões) ---
            { id: 11, instruction: "Prática PFC: Roupas", scenario: "Montando um look.", text: "Uma pessoa tem 4 blusas diferentes e 3 calças diferentes. De quantas formas ela pode montar um conjunto escolhendo 1 blusa e 1 calça?", options: ["7", "12", "14", "24"], answer: "12", explanation: "Multiplicamos as opções de cada etapa: 4 (blusas) × 3 (calças) = 12 conjuntos." },
            { id: 12, instruction: "Prática PFC: Restaurante", scenario: "Escolhendo o cardápio.", text: "Um restaurante oferece 3 opções de entrada, 4 de prato principal e 2 de sobremesa. Quantas refeições completas (entrada + prato + sobremesa) podem ser montadas?", options: ["9", "18", "24", "48"], answer: "24", explanation: "Aplicando a regra da multiplicação: 3 (entradas) × 4 (pratos) × 2 (sobremesas) = 24 opções." },
            { id: 13, instruction: "Prática PFC: Rotas", scenario: "Viagem entre cidades.", text: "Existem 3 caminhos diferentes ligando a cidade A à cidade B, e 2 caminhos ligando B à cidade C. De quantas formas possíveis podemos ir de A até C, passando obrigatoriamente por B?", options: ["5", "6", "8", "9"], answer: "6", explanation: "PFC direto: 3 caminhos (A->B) × 2 caminhos (B->C) = 6 rotas." },
            { id: 14, instruction: "Prática PFC: Prova de Múltipla Escolha", scenario: "Chutando respostas.", text: "Um pequeno questionário possui 3 perguntas, e cada pergunta tem 4 opções de resposta (A, B, C, D). De quantas formas diferentes a prova pode ser respondida?", options: ["7", "12", "64", "81"], answer: "64", explanation: "São 3 etapas (perguntas), com 4 opções em cada. PFC: 4 × 4 × 4 = 64 formas." },
            { id: 15, instruction: "Prática PFC: Verdadeiro ou Falso", scenario: "Chutando respostas.", text: "Uma provinha tem 4 questões de Verdadeiro ou Falso. De quantas maneiras diferentes um aluno pode preencher a prova inteira?", options: ["8", "12", "16", "24"], answer: "16", explanation: "Cada questão tem 2 opções (V ou F). Como são 4 questões independentes: 2 × 2 × 2 × 2 = 16." },
            { id: 16, instruction: "Prática PFC: Jogos de Azar", scenario: "Lançamento simultâneo.", text: "Se você jogar um dado comum (6 faces) e uma moeda comum (Cara ou Coroa) ao mesmo tempo, quantos resultados diferentes podem ocorrer?", options: ["8", "12", "18", "36"], answer: "12", explanation: "O dado tem 6 resultados possíveis e a moeda tem 2. Pelo PFC: 6 × 2 = 12 combinações." },
            { id: 17, instruction: "Prática PFC: Senhas com Repetição", scenario: "Criando um PIN bancário.", text: "Um cofre exige uma senha de 3 algarismos. Sabendo que você só pode usar os números 1, 2, 3, 4 e 5, e que PODE REPETIR os números, quantas senhas existem?", options: ["15", "60", "125", "243"], answer: "125", explanation: "São 3 posições e 5 opções para cada (pois pode repetir). Logo: 5 × 5 × 5 = 125." },
            { id: 18, instruction: "Prática PFC: Senhas Sem Repetição", scenario: "Criando um PIN seguro.", text: "Usando os mesmos números (1 a 5), quantas senhas de 3 algarismos DISTINTOS (sem repetir nenhum) podemos criar?", options: ["15", "60", "120", "125"], answer: "60", explanation: "Primeira posição: 5 opções. Segunda: 4 (não pode repetir o anterior). Terceira: 3. PFC: 5 × 4 × 3 = 60." },
            { id: 19, instruction: "Prática PFC: Montando um Sorvete", scenario: "Sobremesa de verão.", text: "Você monta seu sorvete escolhendo: 2 tipos de casquinha, 5 sabores de massa e 3 tipos de cobertura. Quantas combinações (1 de cada) existem?", options: ["10", "15", "30", "60"], answer: "30", explanation: "Multiplicamos as etapas da decisão: 2 (casquinhas) × 5 (sabores) × 3 (coberturas) = 30 combinações." },
            { id: 20, instruction: "Prática PFC: Placas", scenario: "Registro simples.", text: "Uma placa inventada é formada por 2 letras (podendo ser A, B ou C) seguidas de 2 números (podendo ser 1 ou 2). Podendo repetir letras e números, quantas placas existem?", options: ["10", "12", "36", "72"], answer: "36", explanation: "Temos 3 opções para cada letra e 2 opções para cada número. PFC: 3 × 3 × 2 × 2 = 36." },

            // --- BLOCO 3: PRÁTICA MISTA - FATORIAL, PERMUTAÇÃO E COMBINAÇÃO (10 Questões) ---
            { id: 21, instruction: "Prática: Cálculo de Fatorial", scenario: "Operação básica.", text: "Qual é o resultado exato de 3! (três fatorial)?", options: ["3", "6", "9", "12"], answer: "6", explanation: "O cálculo é 3! = 3 × 2 × 1. O resultado é 6." },
            { id: 22, instruction: "Prática: Cálculo de Fatorial", scenario: "Operação básica.", text: "Qual é o resultado de 4! (quatro fatorial)?", options: ["4", "16", "24", "120"], answer: "24", explanation: "O cálculo é 4! = 4 × 3 × 2 × 1. O resultado é 24." },
            { id: 23, instruction: "Prática: Cálculo de Fatorial", scenario: "Crescimento rápido.", text: "Sabendo o valor de 4!, qual é o resultado de 5! ?", options: ["30", "60", "120", "240"], answer: "120", explanation: "O cálculo é 5 × 4 × 3 × 2 × 1. O resultado é 120." },
            { id: 24, instruction: "Prática: Permutação Simples", scenario: "Anagramas simples.", text: "Quantos anagramas possui a palavra 'SOL'?", options: ["3", "6", "9", "12"], answer: "6", explanation: "A palavra SOL tem 3 letras diferentes. Logo, a permutação é 3! (3 × 2 × 1) = 6." },
            { id: 25, instruction: "Prática: Permutação com Repetição", scenario: "Letras repetidas.", text: "Quantos anagramas possui a palavra 'OVO'?", options: ["3", "6", "9", "2"], answer: "3", explanation: "Total de letras = 3!. O 'O' repete 2 vezes, então dividimos por 2!. Cálculo: 3! / 2! = (3×2×1) / (2×1) = 6 / 2 = 3 anagramas (OVO, OOV, VOO)." },
            { id: 26, instruction: "Prática: Arranjo Simples", scenario: "Eleição de cargos.", text: "Em um grupo de 4 pessoas, queremos escolher um Presidente e um Vice. De quantas formas isso pode ser feito?", options: ["6", "8", "12", "16"], answer: "12", explanation: "A ordem importa. Temos 4 opções para Presidente e, depois de escolhido, sobram 3 opções para Vice. 4 × 3 = 12 formas." },
            { id: 27, instruction: "Prática: Arranjo Simples (Senhas)", scenario: "Criando senhas.", text: "Usando os números 1, 2 e 3, quantas senhas de 2 algarismos DISTINTOS podemos formar?", options: ["3", "6", "9", "12"], answer: "6", explanation: "Temos 3 opções para o primeiro número. Como não pode repetir, sobram 2 opções para o segundo. 3 × 2 = 6 senhas." },
            { id: 28, instruction: "Prática: Combinação Simples", scenario: "Escolhendo duplas.", text: "Temos 4 alunos: Ana, Bruno, Carlos e Dani. Quantas DUPLAS diferentes podemos formar para um trabalho?", options: ["6", "8", "12", "16"], answer: "6", explanation: "A ordem não importa (Ana+Bruno é igual a Bruno+Ana). Cálculo: (4 × 3) / 2! = 12 / 2 = 6 duplas." },
            { id: 29, instruction: "Prática: Combinação Maior", scenario: "Escolhendo equipes.", text: "De um grupo de 5 programadores, precisamos escolher 3 para um projeto. Quantos times diferentes podemos montar?", options: ["10", "15", "20", "60"], answer: "10", explanation: "A ordem não importa. É uma Combinação de 5, escolhendo 3. O cálculo simplificado é: (5 × 4 × 3) / (3 × 2 × 1) = 60 / 6 = 10 equipes." },
            { id: 30, instruction: "Prática: Simplificação de Fatorial", scenario: "Matemática básica de fatoriais.", text: "Qual é o resultado da divisão de 5! por 4! ?", options: ["1", "5", "20", "120"], answer: "5", explanation: "5! é o mesmo que 5 × 4!. Ao dividir (5 × 4!) por 4!, podemos cancelar o 4!, sobrando apenas o 5." }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica do Terminal ---
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
                    if(text.charAt(i) === '<') {
                        let tag = "";
                        while(text.charAt(i) !== '>' && i < text.length) {
                            tag += text.charAt(i);
                            i++;
                        }
                        tag += '>';
                        logs.value[currentLogIndex].text += tag;
                    } else {
                        logs.value[currentLogIndex].text += text.charAt(i);
                    }
                    
                    scrollToBottom(); 
                    i++;
                    
                    if (i >= text.length) { 
                        clearInterval(interval); 
                        resolve(); 
                    }
                }, 10); 
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Carregando rotina [${currentQuestion.value.id}/30]...`, "log-info");
            await typeWriter(`Cenário Base: ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Compilação concluída com sucesso. Exportando métricas Combinatórias...", "log-info");
            }
        };

        // --- Controle de Opções e Feedback do Terminal ---
        const selectOption = async (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            
            userSelection.value = option;
            const isCorrect = option === currentQuestion.value.answer;
            
            isTyping.value = true; 

            if (isCorrect) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Lógica Válida!";
                addLog(`Success: Cálculo aceito.`, "log-success");
                showAnswer.value = true;
                
                await typeWriter(`>> Diagnóstico da Engine:`, "log-info");
                await typeWriter(`Explicação: ${currentQuestion.value.explanation}`, "log-default");
                
                isTyping.value = false;
                setTimeout(nextQuestion, 4000); 
            } else {
                attempts.value++;
                
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Exceção. Resposta correta: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog(`Error: Violação de mapeamento.`, "log-error");
                    showAnswer.value = true;
                    
                    await typeWriter(`>> Correção Forçada pela Engine:`, "log-info");
                    await typeWriter(`Resolução: ${currentQuestion.value.explanation}`, "log-warning");
                    
                    isTyping.value = false;
                    setTimeout(nextQuestion, 5000);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Incorreto. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Warning: Processo abortado. Revise a lógica combinatória. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                    isTyping.value = false;
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Ótimo! Você dominou os fundamentos de Combinatória e a base do PFC.";
            if (score.value < 22) performanceMsg = "Tudo bem! Combinatória exige treino. Recomendamos revisar como aplicar a multiplicação no PFC.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #829E8C; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #829E8C; margin: 0;">Relatório de Compilação: Combinatória Básica</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação: Introdução à Lógica Matemática</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Execução:</strong> ${data}</p>
                    <p><strong>Avaliado por:</strong> Engine Discreta (MATH.ESCAPE)</p>
                    <p>Este documento certifica a validação estrutural do estudante durante ${questions.value.length} testes focados em Princípio Multiplicativo (PFC), Fatoriais, Arranjos e Combinações para iniciantes.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Taxa de Acertos</h3>
                        <p style="font-size: 28px; color: ${score.value >= 22 ? '#829E8C' : (score.value >= 15 ? '#D1BFA0' : '#C27A7A')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Associações Corretas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Status: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Log gerado pelo Terminal Módulo MATH.ESCAPE v3
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Log_Combinatoria_Iniciantes_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando Máquina de Estados...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Booting MATH.ESCAPE v3 (Beginner Combinatorics Engine)...", "log-info");
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