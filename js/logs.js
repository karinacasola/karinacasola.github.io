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

        // --- Banco de Questões (30 Questões - Laços e Estruturas) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Origem da Lógica Booleana.",
                scenario: "A genialidade de George Boole foi transformar a lógica da filosofia em equações.",
                text: "Quais são os dois únicos valores absolutos desse sistema lógico?",
                options: [
                    "1 (Verdadeiro) e 0 (Falso).",
                    "Sim (1) e Talvez (2).",
                    "Positivo (+) e Negativo (-).",
                    "A (True) e B (False)."
                ],
                answer: "1 (Verdadeiro) e 0 (Falso)." 
            },
            {
                id: 2,
                instruction: "Hardware e Portas Lógicas.",
                scenario: "Claude Shannon desenhou circuitos elétricos baseados em lógica. A porta AND exige que todas as condições sejam verdadeiras.",
                text: "Em um circuito em série com Interruptor A e B, quando a lâmpada acende?",
                options: [
                    "Quando apenas A estiver ligado.",
                    "Quando A e B estiverem ligados juntos.",
                    "Quando B estiver desligado e A ligado.",
                    "Quando qualquer um deles for acionado."
                ],
                answer: "Quando A e B estiverem ligados juntos."
            },
            {
                id: 3,
                instruction: "Estruturas Condicionais Básicas.",
                scenario: "O comando If (Se) avalia uma expressão booleana e toma uma decisão.",
                text: "Qual é a principal característica do fluxo de um If (Se)?",
                options: [
                    "Ele repete o bloco enquanto a condição for falsa.",
                    "Ele exige a declaração de uma variável contadora.",
                    "Ele bifurca o fluxo em duas direções sem repetição.",
                    "Ele garante a execução de pelo menos um loop."
                ],
                answer: "Ele bifurca o fluxo em duas direções sem repetição."
            },
            {
                id: 4,
                instruction: "Operadores no Flowgorithm.",
                scenario: "Um aluno precisa validar se a 'nota >= 7' OU 'media >= 7' para aprovação.",
                text: "Quais símbolos representam o operador OU (OR) no Flowgorithm?",
                options: [
                    "&& ou and",
                    "!= ou not",
                    "== ou equals",
                    "or ou ||"
                ],
                answer: "or ou ||"
            },
            {
                id: 5,
                instruction: "Laços de Repetição: While.",
                scenario: "O While (Enquanto) é um laço de repetição classificado como 'Pré-Teste'.",
                text: "O que acontece se a condição de um While for Falsa logo no início?",
                options: [
                    "O bloco nunca é executado e o fluxo sai do laço.",
                    "O bloco executa exatamente uma vez antes de sair.",
                    "O compilador gera um erro de sintaxe.",
                    "O programa entra em loop infinito."
                ],
                answer: "O bloco nunca é executado e o fluxo sai do laço."
            },
            {
                id: 6,
                instruction: "Operador NOT na Prática.",
                scenario: "O operador NOT (NÃO) inverte a realidade de uma condição lógica.",
                text: "Se a variável 'tem_cnh' é Verdadeira, qual o resultado de 'not (tem_cnh)'?",
                options: [
                    "Nulo.",
                    "Falso.",
                    "Verdadeiro.",
                    "Indefinido."
                ],
                answer: "Falso."
            },
            {
                id: 7,
                instruction: "Laços de Repetição: Do-While.",
                scenario: "O laço Do (Faça) difere do While por ser uma estrutura de 'Pós-Teste'.",
                text: "Qual a garantia de execução oferecida pelo laço Do (Faça)?",
                options: [
                    "Executa apenas se a condição inicial for verdadeira.",
                    "Não executa se a condição for falsa.",
                    "Executa as instruções pelo menos uma vez.",
                    "Executa um número predeterminado de vezes."
                ],
                answer: "Executa as instruções pelo menos uma vez."
            },
            {
                id: 8,
                instruction: "Analogia do Guarda-Chuva.",
                scenario: "Ao sair de casa, você aplica a regra: 'Enquanto estiver chovendo, ande com o guarda-chuva aberto'.",
                text: "Essa analogia reflete perfeitamente qual estrutura de repetição?",
                options: [
                    "PARA (For).",
                    "FAÇA... ENQUANTO (Do-While).",
                    "SE / SENÃO (If/Else).",
                    "ENQUANTO (While)."
                ],
                answer: "ENQUANTO (While)."
            },
            {
                id: 9,
                instruction: "O Laço PARA (For).",
                scenario: "A estrutura PARA é conhecida por reunir inicialização, limite e incremento.",
                text: "Quando é ideal utilizar o laço PARA?",
                options: [
                    "Quando se sabe exatamente quantas vezes deseja repetir algo.",
                    "Quando se quer garantir a execução do bloco uma única vez.",
                    "Quando o número de repetições é desconhecido.",
                    "Quando precisamos de bifurcações lógicas exclusivas."
                ],
                answer: "Quando se sabe exatamente quantas vezes deseja repetir algo."
            },
            {
                id: 10,
                instruction: "Flowgorithm e o Bloco For.",
                scenario: "No Flowgorithm, o laço For é representado por um hexágono e exige a configuração de propriedades.",
                text: "Quais propriedades o bloco For exige no Flowgorithm?",
                options: [
                    "Apenas Valor Inicial e Condição Final.",
                    "Variável, Valor Inicial, Valor Final e Passo/Direção.",
                    "Variável, Mensagem de Erro e Incremento Automático.",
                    "Condição Booleana, Operador Lógico e Variável de Saída."
                ],
                answer: "Variável, Valor Inicial, Valor Final e Passo/Direção."
            },
            {
                id: 11,
                instruction: "Execução Mínima de Estruturas.",
                scenario: "A tabela de resumo destaca o número mínimo de execuções para If, While e Do.",
                text: "Quantas vezes, no mínimo, o bloco de um If (Se) é executado?",
                options: [
                    "1 vez garantida.",
                    "0 ou 1 vez (por ramo).",
                    "Sempre 2 vezes para teste.",
                    "Infinitas vezes até satisfazer a condição."
                ],
                answer: "0 ou 1 vez (por ramo)."
            },
            {
                id: 12,
                instruction: "Menus Interativos.",
                scenario: "Você precisa programar um menu de opções que deve aparecer para o usuário antes dele escolher 'Sair'.",
                text: "Qual estrutura é a ideal para esse cenário prático?",
                options: [
                    "SE (If).",
                    "PARA (For).",
                    "FAÇA... ENQUANTO (Do-While).",
                    "ENQUANTO (While)."
                ],
                answer: "FAÇA... ENQUANTO (Do-While)."
            },
            {
                id: 13,
                instruction: "Fundamentos Lógicos: Hardware.",
                scenario: "Os computadores utilizam transistores que funcionam como minúsculos interruptores.",
                text: "Como um transistor representa o valor Verdadeiro (1) no hardware?",
                options: [
                    "Quando o interruptor está desligado (não passa energia).",
                    "Quando ocorre um curto-circuito lógico.",
                    "Quando o interruptor queima e precisa ser trocado.",
                    "Quando o interruptor está ligado (passa energia)."
                ],
                answer: "Quando o interruptor está ligado (passa energia)."
            },
            {
                id: 14,
                instruction: "Analogia de Contagem Mental.",
                scenario: "A regra do percurso conhecido sugere a analogia: 'Dê 10 voltas na pista de corrida'.",
                text: "Essa analogia justifica a vantagem automática de qual laço?",
                options: [
                    "O laço PARA (For), que gerencia o contador sozinho.",
                    "O laço FAÇA (Do), que força a primeira volta.",
                    "O If, que verifica cada passo individualmente.",
                    "O laço ENQUANTO (While), que não sabe o fim."
                ],
                answer: "O laço PARA (For), que gerencia o contador sozinho."
            },
            {
                id: 15,
                instruction: "Sintaxe Lógica no Flowgorithm.",
                scenario: "O Flowgorithm suporta operadores textuais em inglês e sintaxe baseada em C.",
                text: "Qual destas opções aplica corretamente a Conjunção (E) no Flowgorithm?",
                options: [
                    "idade >= 18 || tem_cnh",
                    "idade >= 18 and tem_cnh",
                    "idade >= 18 not tem_cnh",
                    "idade >= 18 = tem_cnh"
                ],
                answer: "idade >= 18 and tem_cnh"
            },
            {
                id: 16,
                instruction: "Gestão de Variáveis no PARA.",
                scenario: "No pseudocódigo 'PARA contador DE 1 ATE 5 FACA', o programador exibe as voltas.",
                text: "Por que não é necessário escrever 'contador = contador + 1' dentro desse bloco?",
                options: [
                    "Porque o compilador desativa as variáveis matemáticas.",
                    "Porque repetições exatas não precisam de contagem numérica.",
                    "Porque o próprio bloco PARA toma conta do incremento automaticamente.",
                    "Porque o laço FAÇA faz isso antes da compilação."
                ],
                answer: "Porque o próprio bloco PARA toma conta do incremento automaticamente."
            },
            {
                id: 17,
                instruction: "Exigência de Declaração prévia.",
                scenario: "Ao montar um laço For em um hexágono no Flowgorithm, você decide usar a variável 'i'.",
                text: "Qual passo deve ser obrigatoriamente tomado antes de adicionar o bloco For?",
                options: [
                    "Configurar a saída (Output) do fluxo.",
                    "Declarar a variável (ex: i) em um bloco Declare antes.",
                    "Alterar o Passo (Step) para um valor negativo.",
                    "Excluir os blocos If para evitar conflitos."
                ],
                answer: "Declarar a variável (ex: i) em um bloco Declare antes."
            },
            {
                id: 18,
                instruction: "Tabela Verdade do AND (E).",
                scenario: "A tabela verdade ajuda a prever o resultado lógico de duas condições combinadas.",
                text: "No operador AND, se a Condição A for Verdadeira e a B for Falsa, qual o resultado?",
                options: [
                    "Verdadeiro.",
                    "Inconsistente.",
                    "Falso.",
                    "Verdadeiro apenas se inverter B."
                ],
                answer: "Falso."
            },
            {
                id: 19,
                instruction: "Tabela Verdade do OR (OU).",
                scenario: "No circuito elétrico paralelo, a energia se divide em caminhos diferentes.",
                text: "Segundo a tabela do OR, quando o resultado será Falso?",
                options: [
                    "Quando apenas A for Falso.",
                    "Quando A e B forem Falsos.",
                    "Quando apenas B for Falso.",
                    "Quando A e B forem Verdadeiros."
                ],
                answer: "Quando A e B forem Falsos."
            },
            {
                id: 20,
                instruction: "Rotas de Saída no Fluxograma do FOR.",
                scenario: "O hexágono do For tem rotas distintas baseadas no teste de limite.",
                text: "Por onde o fluxo sai quando a contagem do laço For atinge o limite e termina?",
                options: [
                    "Retorna para o Início do algoritmo.",
                    "Sai pela rota 'Próximo' (Next).",
                    "Cria um novo ramo Condicional.",
                    "Sai pela rota de Concluído (Done/Pronto)."
                ],
                answer: "Sai pela rota de Concluído (Done/Pronto)."
            },
            {
                id: 21,
                instruction: "Avaliação do Bloco DO (Faça).",
                scenario: "Um sistema de segurança pede a senha. Ele deve verificar se a senha está correta após o usuário digitar.",
                text: "Onde ocorre o teste condicional na estrutura Do (Faça)?",
                options: [
                    "No Início (Pré-Teste).",
                    "No Fim (Pós-Teste).",
                    "No encontro da estrutura.",
                    "De forma automática e simultânea."
                ],
                answer: "No Fim (Pós-Teste)."
            },
            {
                id: 22,
                instruction: "Uso do IF vs Loops.",
                scenario: "Um programador precisa decidir entre executar a rotina de Desconto A ou B baseado no tipo de cliente.",
                text: "De acordo com o resumo prático, qual estrutura deve ser escolhida?",
                options: [
                    "Use While para prever todas as escolhas.",
                    "Use Do para garantir o desconto.",
                    "Use If para decidir se faz A ou B.",
                    "Use For para repetir a escolha."
                ],
                answer: "Use If para decidir se faz A ou B."
            },
            {
                id: 23,
                instruction: "Combinando Operadores Lógicos.",
                scenario: "Um aluno precisa ser aprovado verificando se: nota >= 7 AND frequencia >= 75.",
                text: "Se ele tirou nota 8 e teve frequência 60, qual é o veredito do operador lógico?",
                options: [
                    "Falso, logo, Aluno Reprovado.",
                    "Verdadeiro, por causa da nota alta.",
                    "Verdadeiro, o operador AND aprova parciais.",
                    "Indefinido pelo sistema."
                ],
                answer: "Falso, logo, Aluno Reprovado."
            },
            {
                id: 24,
                instruction: "A Natureza do While.",
                scenario: "O fluxograma do While aponta uma seta de retorno para antes da condição.",
                text: "Qual é a classificação dessa estrutura de repetição quanto ao momento do teste?",
                options: [
                    "Repetição Pós-Teste.",
                    "Repetição Pré-Teste.",
                    "Desvio de Rota Única.",
                    "Repetição Estática Contada."
                ],
                answer: "Repetição Pré-Teste."
            },
            {
                id: 25,
                instruction: "O Operador de Negação na Lógica.",
                scenario: "O operador NOT atua como um 'inversor' nos circuitos, cortando energia se apertado.",
                text: "Como esse operador é referenciado no texto de apoio em analogia?",
                options: [
                    "É o 'juiz' rigoroso.",
                    "É o 'divisor' paralelo.",
                    "É o operador 'do contra'.",
                    "É o 'contador' sequencial."
                ],
                answer: "É o operador 'do contra'."
            },
            {
                id: 26,
                instruction: "Laço PARA e Variáveis de Controle.",
                scenario: "Ao configurar o bloco FOR no Flowgorithm, deve-se preencher a Direção e o Passo (Step).",
                text: "Qual é o valor padrão que o laço pula (Step) caso não seja alterado?",
                options: [
                    "Pula de 1 em 1.",
                    "Pula de 0 em 0.",
                    "Pula de 2 em 2.",
                    "Não tem padrão, dá erro se vazio."
                ],
                answer: "Pula de 1 em 1."
            },
            {
                id: 27,
                instruction: "Resumo Estrutural.",
                scenario: "Uma tabela resume as características entre If, While e Do.",
                text: "Qual estrutura permite que o bloco de instruções não seja executado nenhuma vez (0 vezes) de forma recorrente?",
                options: [
                    "Apenas o Do (Faça).",
                    "O bloco For obrigatório.",
                    "While (Enquanto).",
                    "Nenhuma delas, todas executam no mínimo uma vez."
                ],
                answer: "While (Enquanto)."
            },
            {
                id: 28,
                instruction: "Decisões no Flowgorithm.",
                scenario: "O If cria um caminho Verdadeiro (True) e um caminho Falso (False).",
                text: "Após a execução de um dos blocos (Verdadeiro ou Falso), para onde o fluxo do If se dirige?",
                options: [
                    "Retorna ao início do If.",
                    "Se encerra o programa imediatamente.",
                    "Vai para o Fluxo Contínuo, unindo as pontas.",
                    "Solicita nova entrada do usuário."
                ],
                answer: "Vai para o Fluxo Contínuo, unindo as pontas."
            },
            {
                id: 29,
                instruction: "A Regra do Segurança Rigoroso.",
                scenario: "O laço ENQUANTO (While) é comparado a um segurança rigoroso.",
                text: "Por que ele recebe esse apelido na analogia apresentada?",
                options: [
                    "Porque ele executa e verifica a identidade depois.",
                    "Porque ele testa a condição antes mesmo de permitir a entrada no laço.",
                    "Porque não permite o uso de operadores booleanos.",
                    "Porque ele tranca o sistema em um loop infinito."
                ],
                answer: "Porque ele testa a condição antes mesmo de permitir a entrada no laço."
            },
            {
                id: 30,
                instruction: "Analogia de Execução Pós-Teste.",
                scenario: "O laço FAÇA... ENQUANTO obriga pelo menos uma execução do bloco.",
                text: "Qual frase é usada para ilustrar o conceito de 'faz primeiro, pergunta depois'?",
                options: [
                    "Dê 10 voltas na pista de corrida.",
                    "Enquanto chover, use guarda-chuva.",
                    "Se fizer sol e for fim de semana, vá à praia.",
                    "Dê uma mordida no prato. Estava bom? Se sim, continue comendo."
                ],
                answer: "Dê uma mordida no prato. Estava bom? Se sim, continue comendo."
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
            await typeWriter(`Carregando Desafio de Lógica e Controle ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Avaliação concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Lógica validada com sucesso.";
                addLog("Sucesso: Estruturação lógica precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Compilação interrompida.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Falha na validação. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos laços de repetição, estruturas condicionais e lógica booleana.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada das portas lógicas e estruturas do Flowgorithm.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Fundamentos de Algoritmos</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Laços de Repetição e Condicionais</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo abstração com fluxogramas, laços For, While, Do-While e Operadores Lógicos.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador ALGO_EVAL_v2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Algoritmos_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador lógico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador ALGO_EVAL_v2.0...", "log-info");
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