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

        // Banco de 20 Questões: 10 Teóricas e 10 de Cálculo
        const questions = ref([
            // --- BLOCO 1: TEORIA (10 Questões) ---
            { id: 1, instruction: "Teoria: Princípio Fundamental da Contagem (PFC)", scenario: "Modelando ramificações de uma árvore de decisão.", text: "O que estabelece o Princípio Multiplicativo (PFC)?", options: ["Eventos independentes são somados.", "Se uma decisão tem 'x' opções e a seguinte tem 'y', o total é x * y.", "A ordem das escolhas nunca altera o número total.", "Apenas se aplica a conjuntos sem interseção."], answer: "Se uma decisão tem 'x' opções e a seguinte tem 'y', o total é x * y.", explanation: "O PFC afirma que se um evento ocorre em etapas sucessivas e independentes, o número total de possibilidades é o produto das possibilidades de cada etapa." },
            { id: 2, instruction: "Teoria: Princípio Aditivo", scenario: "Uma rotina escolhe rodar o Algoritmo A OU o Algoritmo B, que são mutuamente exclusivos.", text: "Quando devemos somar as possibilidades em vez de multiplicá-las?", options: ["Quando os eventos ocorrem em sequência.", "Quando a ordem dos elementos importa.", "Quando os eventos são excludentes (não podem ocorrer juntos).", "Quando há repetição de elementos."], answer: "Quando os eventos são excludentes (não podem ocorrer juntos).", explanation: "O princípio aditivo é usado para a união de conjuntos disjuntos. Se você deve escolher uma opção de A *ou* de B, você soma as quantidades (regra do 'OU')." },
            { id: 3, instruction: "Teoria: Arranjo vs Combinação", scenario: "Selecionando usuários de um banco de dados.", text: "Qual a diferença fundamental entre um Arranjo e uma Combinação?", options: ["Arranjo permite repetição, Combinação não.", "No Arranjo a ordem dos elementos importa, na Combinação não.", "A Combinação resulta em mais possibilidades que o Arranjo.", "Arranjo é usado apenas para letras, Combinação para números."], answer: "No Arranjo a ordem dos elementos importa, na Combinação não.", explanation: "Em um Arranjo, {A, B} e {B, A} são considerados casos distintos (ex: senhas). Na Combinação, {A, B} e {B, A} representam o mesmo subconjunto (ex: comitês)." },
            { id: 4, instruction: "Teoria: Fatorial", scenario: "O cálculo de n! (fatorial de n) representa o número de permutações simples de n elementos.", text: "Matematicamente, qual é o valor de 0! (Zero fatorial) e por quê?", options: ["0, pois não há elementos para ordenar.", "1, representando o conjunto vazio como a única forma de não organizar nada.", "Indefinido.", "10, por convenção algorítmica."], answer: "1, representando o conjunto vazio como a única forma de não organizar nada.", explanation: "Por definição e para manter a consistência de fórmulas combinatórias (como C(n,n) = 1), 0! é definido como 1." },
            { id: 5, instruction: "Teoria: Permutação com Repetição", scenario: "Gerando anagramas para a palavra 'MISSISSIPPI'.", text: "Qual lógica se aplica ao calcular permutações de elementos onde alguns são idênticos?", options: ["Calcula-se o fatorial total e divide-se pelos fatoriais das repetições.", "Subtrai-se o número de letras repetidas do total.", "Multiplica-se o fatorial total pelo número de letras únicas.", "Ignoram-se as letras repetidas completamente."], answer: "Calcula-se o fatorial total e divide-se pelos fatoriais das repetições.", explanation: "A divisão pelo fatorial dos elementos repetidos anula as trocas entre itens idênticos que não gerariam novas permutações visuais." },
            { id: 6, instruction: "Teoria: Permutação Circular", scenario: "Algoritmo de escalonamento 'Round-Robin' representado como uma mesa circular.", text: "Por que a fórmula da Permutação Circular de 'n' elementos é (n - 1)! ?", options: ["Porque o último elemento sempre é fixo por restrição.", "Porque rotacionar a mesa inteira não gera uma nova disposição.", "Porque subtraímos a cadeira vazia.", "Porque os elementos devem estar em pares."], answer: "Porque rotacionar a mesa inteira não gera uma nova disposição.", explanation: "Ao colocar elementos em círculo, as rotações do mesmo arranjo são idênticas. Fixamos 1 elemento como referência e permutamos o restante." },
            { id: 7, instruction: "Teoria: Combinação com Repetição", scenario: "O método 'Stars and Bars' (Estrelas e Barras).", text: "Este método é clássico para resolver qual tipo de problema?", options: ["Permutação de senhas criptográficas.", "Número de rotas em um grid bidimensional.", "Número de soluções inteiras não-negativas de uma equação linear (distribuição de itens idênticos).", "Cálculo de grafos Eulerianos."], answer: "Número de soluções inteiras não-negativas de uma equação linear (distribuição de itens idênticos).", explanation: "O método traduz a distribuição de 'n' itens idênticos em 'k' caixas como uma permutação de 'n' estrelas (itens) e 'k-1' barras (separadores de caixas)." },
            { id: 8, instruction: "Teoria: Princípio da Casa dos Pombos", scenario: "Também conhecido como Teorema de Dirichlet.", text: "Se temos 'n+1' pombos e 'n' casas, o que o princípio garante de forma determinística?", options: ["Nenhuma casa ficará vazia.", "Pelo menos uma casa terá exatamente dois pombos.", "Pelo menos uma casa conterá dois ou mais pombos.", "O número de pombos deve ser par."], answer: "Pelo menos uma casa conterá dois ou mais pombos.", explanation: "Se há mais itens (pombos) do que recipientes (casas), não existe mapeamento injetor possível; logo, alguma colisão é inevitável." },
            { id: 9, instruction: "Teoria: Propriedades do Binômio", scenario: "Avaliando as linhas do Triângulo de Pascal.", text: "A propriedade de simetria estabelece que Combinação C(n, p) é igual a:", options: ["C(n, p-1)", "C(n, n-p)", "C(p, n)", "n! / p!"], answer: "C(n, n-p)", explanation: "A lógica dos números complementares: escolher 'p' elementos para formar um grupo é o mesmo que escolher 'n-p' elementos para deixar de fora do grupo." },
            { id: 10, instruction: "Teoria: Subconjuntos", scenario: "Conjunto das partes (Power Set) em teoria de conjuntos.", text: "Um conjunto de 'n' elementos possui quantos subconjuntos distintos no total?", options: ["n!", "n^2", "2^n", "n * (n-1) / 2"], answer: "2^n", explanation: "Para cada um dos 'n' elementos, há exatamente 2 decisões: incluir ou não incluir no subconjunto. Pelo PFC, temos 2 * 2 * ... * 2 (n vezes)." },

            // --- BLOCO 2: CÁLCULO (10 Questões) ---
            { id: 11, instruction: "Cálculo: PFC (Senhas)", scenario: "Um sistema exige um PIN de 4 dígitos (0-9).", text: "Quantas senhas distintas podem ser criadas assumindo que os dígitos PODEM se repetir?", options: ["5.040", "10.000", "9.000", "40"], answer: "10.000", explanation: "São 4 posições. Cada posição tem 10 possibilidades (0 a 9). Pelo PFC: 10 * 10 * 10 * 10 = 10.000." },
            { id: 12, instruction: "Cálculo: Permutação Simples", scenario: "Um script tenta brute-force nos anagramas de uma string de 5 caracteres distintos.", text: "Quantos anagramas a palavra 'LIVRO' possui?", options: ["25", "60", "120", "240"], answer: "120", explanation: "Como são 5 letras distintas, a permutação é 5! (5 fatorial). 5 * 4 * 3 * 2 * 1 = 120." },
            { id: 13, instruction: "Cálculo: Permutação com Repetição", scenario: "Calculando colisões baseadas na palavra 'BATATA'.", text: "Quantos anagramas distintos podem ser formados com 'BATATA'?", options: ["720", "120", "60", "30"], answer: "60", explanation: "A palavra tem 6 letras (6!), mas o 'A' se repete 3 vezes (3!) e o 'T' 2 vezes (2!). O cálculo é: 6! / (3! * 2!) = 720 / (6 * 2) = 60." },
            { id: 14, instruction: "Cálculo: Arranjo Simples", scenario: "Em uma corrida com 8 threads, precisamos preencher o pódio (1º, 2º e 3º lugar).", text: "De quantas maneiras diferentes o pódio pode ser formado?", options: ["56", "336", "512", "24"], answer: "336", explanation: "A ordem importa (1º é diferente de 2º). É um arranjo A(8,3). O cálculo é: 8 * 7 * 6 = 336." },
            { id: 15, instruction: "Cálculo: Combinação Simples", scenario: "Precisamos montar uma equipe de QA com 3 pessoas, selecionadas de um time de 8.", text: "Quantas equipes distintas podem ser formadas?", options: ["336", "56", "24", "120"], answer: "56", explanation: "A ordem de escolha não altera a equipe (Combinação). C(8,3) = 8! / (3! * (8-3)!) = (8 * 7 * 6) / (3 * 2 * 1) = 56." },
            { id: 16, instruction: "Cálculo: Combinação de Grupos Múltiplos", scenario: "Uma empresa precisa eleger 2 Devs de um grupo de 5 e 3 QAs de um grupo de 6.", text: "Qual o total de comitês mistos possíveis?", options: ["10 e 20 (Total 30)", "200", "150", "60"], answer: "200", explanation: "Calculamos separadamente: C(5,2) = 10 para os Devs. C(6,3) = 20 para os QAs. Como os eventos devem acontecer em conjunto, multiplicamos: 10 * 20 = 200." },
            { id: 17, instruction: "Cálculo: PFC com Restrição", scenario: "Criando números pares de 3 algarismos distintos (sem o dígito zero na centena).", text: "Quantos números pares de 3 algarismos DISTINTOS existem? (Base: 0-9)", options: ["328", "450", "500", "400"], answer: "328", explanation: "Se terminar em 0: 1x9x8 = 72. Se terminar em 2,4,6,8 (4 opções): a centena não pode ser 0 nem o último (8 opções), a dezena pode ser o 0 (8 opções) -> 4 * 8 * 8 = 256. Total: 72 + 256 = 328." },
            { id: 18, instruction: "Cálculo: Estrelas e Barras", scenario: "Distribuir 5 requisições de API idênticas entre 3 servidores.", text: "De quantas formas podemos distribuir as requisições (um servidor pode receber 0)?", options: ["21", "15", "10", "35"], answer: "21", explanation: "Temos n=5 itens e k=3 recipientes. Usamos a fórmula C(n+k-1, k-1) -> C(5+3-1, 3-1) = C(7, 2). Resolvendo: (7 * 6) / 2 = 21." },
            { id: 19, instruction: "Cálculo: Permutação Circular Prática", scenario: "Jantar corporativo de alinhamento.", text: "De quantas maneiras 5 diretores podem se sentar ao redor de uma mesa redonda?", options: ["120", "24", "60", "5"], answer: "24", explanation: "Usando a fórmula de permutação circular P_c(n) = (n-1)!. Para 5 pessoas, P_c(5) = (5-1)! = 4! = 4 * 3 * 2 * 1 = 24." },
            { id: 20, instruction: "Cálculo: Equação Combinatória", scenario: "Avaliando a igualdade de combinações.", text: "Se C(n, 2) = 10, qual é o valor do inteiro não-negativo 'n'?", options: ["4", "5", "6", "10"], answer: "5", explanation: "C(n, 2) = n * (n-1) / 2. Logo, n * (n-1) / 2 = 10 => n * (n-1) = 20. O único número positivo que multiplicado pelo seu antecessor dá 20 é 5 (5 * 4 = 20)." }
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
                    // Trata as tags HTML para não digitar caracter por caracter dentro do DOM e quebrar
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
            await typeWriter(`Carregando rotina [${currentQuestion.value.id}/20]...`, "log-info");
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
                    await typeWriter(`Explicação: ${currentQuestion.value.explanation}`, "log-warning");
                    
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
            
            let performanceMsg = "Domínio Sólido em Análise Combinatória.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão em Permutações, Combinações e Regra do Produto.";
            
            // Tons metálicos e sóbrios utilizados no PDF
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #829E8C; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #829E8C; margin: 0;">Relatório de Compilação: Combinatória</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação: Lógica Formal e Algoritmos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Execução:</strong> ${data}</p>
                    <p><strong>Avaliado por:</strong> Engine Discreta (MATH.ESCAPE)</p>
                    <p>Este documento certifica a validação estrutural do estudante durante ${questions.value.length} testes de stress lógico em cálculos combinatórios, arranjos, permutações e probabilidade discreta.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Taxa de Transferência Lógica</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#829E8C' : (score.value >= 10 ? '#D1BFA0' : '#C27A7A')}; margin: 15px 0;">
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
                filename:     `Log_Combinatoria_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Booting MATH.ESCAPE v3 (Combinatorics Engine)...", "log-info");
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