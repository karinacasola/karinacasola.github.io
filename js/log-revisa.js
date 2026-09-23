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

        // --- Banco de Questões (20 Questões - Algoritmos, Lógica, Laços e Vetores) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Definição de Variáveis e Tipos de Dados.",
                scenario: "O computador precisa guardar dados na memória em caixas chamadas variáveis. Uma variável é estruturada por um Nome, um Conteúdo e um Tipo.",
                text: "Ao criar um algoritmo financeiro, você precisa de uma variável para armazenar o valor exato de um produto, como R$ 99.90. Qual tipo primitivo deve ser escolhido para o formato dessa caixa?",
                options: [
                    "Inteiro (Integer).",
                    "Real (Float / Decimal).",
                    "Caractere (String).",
                    "Lógico (Booleano)."
                ],
                answer: "Real (Float / Decimal)." 
            },
            {
                id: 2,
                instruction: "Escolha Estrutural: A Regra do Percurso Conhecido.",
                scenario: "No desenvolvimento de um software escolar, você recebe a tarefa de exibir na tela a média geral de exatamente 30 turmas. Este é um cenário onde você sabe previamente o número exato de repetições.",
                text: "Qual laço de repetição é o mais adequado, pois reúne inicialização, limite e incremento de forma automática?",
                options: [
                    "FAÇA... ENQUANTO (Do-While).",
                    "SE / SENÃO (If / Else).",
                    "PARA (For).",
                    "ENQUANTO (While)."
                ],
                answer: "PARA (For)." 
            },
            {
                id: 3,
                instruction: "Escolha Estrutural: A Regra do Segurança Rigoroso.",
                scenario: "Você está criando um sistema de autenticação bancária. O programa deve pedir a senha e, caso esteja incorreta, bloquear o acesso e pedir repetidas vezes até que o usuário acerte ou desista. O número de tentativas até o acerto é completamente desconhecido.",
                text: "Qual estrutura de controle testa a condição de segurança ANTES de sequer entrar no laço pela primeira vez?",
                options: [
                    "ENQUANTO (While).",
                    "PARA (For).",
                    "FAÇA... ENQUANTO (Do-While).",
                    "ESCOLHA (Switch)."
                ],
                answer: "ENQUANTO (While)." 
            },
            {
                id: 4,
                instruction: "Escolha Estrutural: Faz Primeiro, Pergunta Depois.",
                scenario: "Ao desenvolver um menu interativo para um sistema de padaria, as opções de compra devem ser exibidas obrigatoriamente pelo menos uma vez antes do cliente ter a chance de escolher a opção 'Sair'.",
                text: "Qual laço resolve esse problema garantindo a execução do bloco de instruções antes de testar a condição de saída no final?",
                options: [
                    "PARA (For).",
                    "ENQUANTO (While).",
                    "SE (If).",
                    "FAÇA... ENQUANTO (Do-While)."
                ],
                answer: "FAÇA... ENQUANTO (Do-While)." 
            },
            {
                id: 5,
                instruction: "Conceitualização de Vetores (Arrays).",
                scenario: "Imagine que você precise processar as notas de 500 alunos. Criar 500 variáveis (nota1, nota2, etc.) deixaria o código inviável e altamente suscetível a falhas manuais.",
                text: "Como o uso de Vetores (Arrays) soluciona de maneira otimizada esse cenário no desenvolvimento de software?",
                options: [
                    "Eliminando a necessidade de usar laços de repetição ao processar as notas.",
                    "Convertendo valores de vários formatos para a tipagem forte do sistema.",
                    "Guardando vários valores do mesmo tipo agrupados em posições de memória sob o mesmo nome.",
                    "Substituindo dados numéricos complexos por tipos lógicos mais leves."
                ],
                answer: "Guardando vários valores do mesmo tipo agrupados em posições de memória sob o mesmo nome." 
            },
            {
                id: 6,
                instruction: "Integração de Estruturas: Matrizes e Laços.",
                scenario: "Você acaba de declarar o vetor 'notas[50]'. Agora, você precisa alimentar essas 50 gavetas virtuais com informações inseridas pelo usuário, sem repetir 50 linhas de código de leitura.",
                text: "Qual ferramenta lógica é considerada o 'par perfeito' dos vetores, utilizando sua própria variável contadora (índice) para percorrer o array automaticamente?",
                options: [
                    "A estrutura Condicional SE / SENÃO.",
                    "O laço PARA (For).",
                    "A tipagem dinâmica das variáveis.",
                    "As Portas Lógicas de Shannon."
                ],
                answer: "O laço PARA (For)." 
            },
            {
                id: 7,
                instruction: "Portas Lógicas: Operador AND (E).",
                scenario: "Em uma faculdade, o sistema decide a aprovação de um aluno através de duas exigências: a nota deve ser >= 7 E a frequência deve ser >= 75%.",
                text: "O que ocorre durante o processamento do operador lógico de conjunção (AND) se o aluno atingir a nota 9, mas tiver apenas 60% de presença?",
                options: [
                    "O resultado final é Verdadeiro, visto que uma das exigências atingiu o nível máximo estipulado.",
                    "O compilador solicita uma conversão do dado inteiro para booleano.",
                    "O veredito final desmorona e torna-se Falso, pois todas as condições precisam ser verdadeiras.",
                    "O sistema anula a segunda variável temporariamente."
                ],
                answer: "O veredito final desmorona e torna-se Falso, pois todas as condições precisam ser verdadeiras." 
            },
            {
                id: 8,
                instruction: "Portas Lógicas: Operador OR (OU).",
                scenario: "Durante o desenvolvimento da página de pagamento de um aplicativo, foi estabelecida a seguinte regra: O frete é grátis SE a compra for superior a R$ 150 OU SE o cliente possuir o cartão fidelidade da loja.",
                text: "Baseado na mecânica da porta lógica de disjunção (OR), como o sistema deve agir diante da regra proposta?",
                options: [
                    "O frete grátis será concedido se pelo menos uma das condições (ou ambas) for validada como Verdadeira.",
                    "As duas condições precisam ser obrigatoriamente alcançadas para liberar o benefício do frete.",
                    "O resultado será sempre negativo caso ambas as informações sejam preenchidas de uma vez.",
                    "O programa irá forçar a primeira variável a anular a segunda."
                ],
                answer: "O frete grátis será concedido se pelo menos uma das condições (ou ambas) for validada como Verdadeira." 
            },
            {
                id: 9,
                instruction: "Flexibilidade das Linguagens de Programação.",
                scenario: "Enquanto programava um formulário em JavaScript, você notou que uma mesma variável armazenou o texto 'Pendente' hoje e o número '404' no dia seguinte, sem o programa travar. Isso não seria possível em C# ou Java, pois elas exigem moldes rígidos.",
                text: "Linguagens em que a 'caixa' se adapta e descobre o tipo automaticamente com base no que foi colocado dentro recebem qual classificação técnica?",
                options: [
                    "Linguagens Orientadas a Interface.",
                    "Linguagens de Máquina.",
                    "Linguagens de Tipagem Forte (Estáticas).",
                    "Linguagens de Tipagem Dinâmica (Não Tipadas)."
                ],
                answer: "Linguagens de Tipagem Dinâmica (Não Tipadas)." 
            },
            {
                id: 10,
                instruction: "Produtividade e Sobrecarga Cognitiva.",
                scenario: "A sua mente possui um limite de foco diário. Após três horas lendo a mesma linha de código em busca de um erro simples, sua eficiência cai drasticamente e a frustração aumenta.",
                text: "Para evitar a fadiga no aprendizado de algoritmos, qual técnica quebra a sessão de estudo em blocos curtos de alta concentração (ex: 30 minutos) e descanso?",
                options: [
                    "Estruturação e Modularização.",
                    "Técnica Pomodoro.",
                    "O Ciclo Lógico de Repetição.",
                    "Dividir e Conquistar."
                ],
                answer: "Técnica Pomodoro." 
            },
            {
                id: 11,
                instruction: "Estruturas Condicionais Práticas.",
                scenario: "O aplicativo da 99 possui uma tarifa dinâmica: ele cobra um valor base, mas, SE detectar chuva na região da corrida, multiplica o preço total por 1.5.",
                text: "Qual comando estrutural de código lida com o desvio de fluxo, permitindo que a regra matemática seja aplicada exclusivamente sob essa condição climática?",
                options: [
                    "Condicional (SE / SENÃO).",
                    "Laço Interminável (While(true)).",
                    "Declaração de Vetor Dinâmico.",
                    "Variável de Tipagem Forte."
                ],
                answer: "Condicional (SE / SENÃO)." 
            },
            {
                id: 12,
                instruction: "Regras de Indexação de Vetores.",
                scenario: "Você acessou o Flowgorithm e utilizou o bloco de Declaração para inicializar um Array configurado como 'Real Array temperaturas[4]'.",
                text: "Se esse armário virtual tem tamanho igual a 4, quais os índices matemáticos que o código usará para varrer essas posições no processador sem causar 'estouro' de memória?",
                options: [
                    "Posições [1], [2], [3] e [4].",
                    "Posições [0], [1], [2] e [3].",
                    "Posições de tamanho ilimitado gerenciado pelo Java.",
                    "Posição [4] apenas."
                ],
                answer: "Posições [0], [1], [2] e [3]." 
            },
            {
                id: 13,
                instruction: "Estruturas de Dados Lógicas.",
                scenario: "Em um banco de dados gigantesco, um desenvolvedor precisava armazenar se cada cliente da base era VIP ou Padrão. Para poupar capacidade do servidor, ele procurou o formato mais leve da computação, que comporta apenas dois estados absolutos.",
                text: "Qual é o nome formal desse tipo primitivo que atesta Verdadeiro/Falso ou 1/0?",
                options: [
                    "Inteiro (Integer).",
                    "Cadeia de Caracteres (String).",
                    "Lógico (Booleano).",
                    "Modular Flutuante."
                ],
                answer: "Lógico (Booleano)." 
            },
            {
                id: 14,
                instruction: "A Porta Lógica 'Do Contra'.",
                scenario: "Ao analisar a documentação de um alarme de incêndio, você encontrou uma estrutura física que barra a energia: a sirene permanece muda até que o sensor seja acionado. Ela só conduz corrente quando você NÃO está em condições seguras.",
                text: "No mundo do software, qual operador de lógica inverte a realidade transformando Verdadeiro em Falso e vice-versa, reproduzindo essa mecânica analógica?",
                options: [
                    "Operador de Negação NOT (NÃO).",
                    "Conector Sintático E (AND).",
                    "Operador Matemático (Soma de Resto).",
                    "Comando Condicional SE (If)."
                ],
                answer: "Operador de Negação NOT (NÃO)." 
            },
            {
                id: 15,
                instruction: "O Ciclo Prático do Conhecimento.",
                scenario: "Você entendeu perfeitamente a vídeo-aula sobre laços 'Para', mas quando tentou codificar sozinho a tela ficou em branco. Afinal, a retenção real acontece apenas praticando.",
                text: "No Ciclo do Aprendizado, logo após copiar o exemplo do professor e testar o funcionamento básico, qual é a próxima etapa crucial recomendada pelo material?",
                options: [
                    "Assistir o material avançado imediatamente.",
                    "Deletar tudo e criar do absoluto zero sem nenhuma referência.",
                    "Rever a teoria até memorizar o código todo.",
                    "Quebrar/Modificar o código alterando variáveis e observando os erros na tela."
                ],
                answer: "Quebrar/Modificar o código alterando variáveis e observando os erros na tela." 
            },
            {
                id: 16,
                instruction: "Estratégia de Decomposição.",
                scenario: "Seu primeiro freela é gigantesco: 'Criar um portal completo de reservas de passagens'. Pensar no projeto inteiro gera uma ansiedade paralisante.",
                text: "Como o princípio algorítmico da 'Decomposição' atua não apenas no código, mas na psicologia do trabalho?",
                options: [
                    "Sugere transformar toda a interface em um único método recursivo.",
                    "Afirma que grandes projetos devem ser convertidos para processamento massivo.",
                    "Ensina a dividir a estrutura gigante em formigas, como focar somente em criar o 'botão de busca' primeiro.",
                    "Pula a fase de desenvolvimento manual, integrando blocos de códigos pré-fabricados."
                ],
                answer: "Ensina a dividir a estrutura gigante em formigas, como focar somente em criar o 'botão de busca' primeiro." 
            },
            {
                id: 17,
                instruction: "Tomada de Decisão em Cascata.",
                scenario: "Você programou o aviso de bateria do celular do seu usuário: Menor que 5, mostra 'Crítica'; Se estiver entre 5 e 20, mostra 'Fraca'; Acima disso, diz 'OK'.",
                text: "Esse processo onde uma verificação só acontece caso a anterior seja descartada, ligando blocos uns aos outros, define qual termo técnico?",
                options: [
                    "Tipagem Fraca Automática.",
                    "Condicionais Aninhadas ou Encadeadas.",
                    "Declaração de Vetores Concorrentes.",
                    "Laço de Repetição Condicional (Do-While)."
                ],
                answer: "Condicionais Aninhadas ou Encadeadas." 
            },
            {
                id: 18,
                instruction: "Elementos que Constituem uma Variável.",
                scenario: "Quando instanciamos uma caixa na memória do computador, além de dizer o que vai morar nela (Conteúdo/Valor) e de que material ela é feita (Tipo), precisamos resolver o problema de como o processador irá encontrá-la depois no meio de milhões de processos.",
                text: "A qual elemento da declaração de variáveis o problema supracitado se refere?",
                options: [
                    "Ao Nome (Etiqueta) que identificará a variável unicamente.",
                    "Ao Valor Inicial estipulado no bloco For.",
                    "Aos Índices que operam sobre o Hardware.",
                    "Ao Incrementador Dinâmico (+1)."
                ],
                answer: "Ao Nome (Etiqueta) que identificará a variável unicamente." 
            },
            {
                id: 19,
                instruction: "A Base Matemática da Computação.",
                scenario: "As linguagens de programação parecem bruxaria, mas são apenas equações super elaboradas baseadas unicamente em duas verdades absolutas: os números 1 e 0. Essa ideia de simplificar todo pensamento lógico foi escrita em 1854.",
                text: "Quem foi o gênio matemático por trás do livro 'As Leis do Pensamento', cujo conceito lógico seria a fundação do mundo digital quase 100 anos depois?",
                options: [
                    "Ada Lovelace.",
                    "Alan Turing.",
                    "George Boole.",
                    "Claude Shannon."
                ],
                answer: "George Boole." 
            },
            {
                id: 20,
                instruction: "Materializando a Lógica no Processador.",
                scenario: "A matemática dos 'Uns e Zeros' era vista como teórica, até Claude Shannon notar sua aplicação física em 1937. Ele traduziu essa lógica rigorosa determinando quando os transistores (pequenos interruptores) deixavam a energia passar (1) ou cortavam a energia (0).",
                text: "Como batizamos essas combinações físicas de circuitos que até hoje residem no processador e tomam decisões cruciais (como as portas AND, OR e NOT)?",
                options: [
                    "Processadores Multidimensionais.",
                    "Portas Lógicas (Logic Gates).",
                    "Redes Neurais Binárias.",
                    "Vetores de Alta Tensão."
                ],
                answer: "Portas Lógicas (Logic Gates)." 
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
            await typeWriter(`Carregando Desafio de Algoritmo ${currentQuestion.value.id}...`, "log-info");
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
            
            let performanceMsg = "Excelente compreensão dos fundamentos e estruturas de algoritmos.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos teóricos e construção de fluxogramas.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Fundamentos de Algoritmos</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação Avançada em Lógica de Programação</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo abstração com fluxogramas, tipos de dados primitivos, estruturas de controle e aplicação de problemas práticos.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador ALGO_EVAL_v1.5
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
            addLog("Inicializando Simulador ALGO_EVAL_v1.5...", "log-info");
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