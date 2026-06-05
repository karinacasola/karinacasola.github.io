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

        // --- Banco de Questões (As 20 de Java Baseadas nos Slides) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Estrutura básica de um programa Java.",
                scenario: "Um desenvolvedor está criando um novo programa chamado 'Calculadora'.",
                text: "Qual é a regra de ouro para a nomenclatura do arquivo e onde a execução começa segundo a sintaxe de Java?",
                options: [
                    "O arquivo deve se chamar Calculadora.java e a execução inicia pelo método main().",
                    "O arquivo pode ter qualquer nome, mas deve conter a classe main().",
                    "A classe e o arquivo devem ter o mesmo nome e a execução começa pelo método start().",
                    "O arquivo deve se chamar Calculadora.class e a execução começa no System.out.println()."
                ],
                answer: "O arquivo deve se chamar Calculadora.java e a execução inicia pelo método main()."
            },
            {
                id: 2,
                instruction: "Efeito Overflow em Tipos Primitivos.",
                scenario: "Um jogo armazena as vidas do personagem em uma variável do tipo 'byte' inicializada com seu limite máximo (127). O jogador ganha uma vida extra e a variável sofre incremento (++).",
                text: "O que acontecerá com o valor armazenado na memória da variável?",
                options: [
                    "Dará a volta e o valor se tornará -128.",
                    "O valor subirá para 128 normalmente, pois o limite dinâmico é 255.",
                    "Ocorrerá um erro de compilação em tempo real.",
                    "O valor continuará sendo 127 estático."
                ],
                answer: "Dará a volta e o valor se tornará -128."
            },
            {
                id: 3,
                instruction: "Pegadinha da Divisão Inteira.",
                scenario: "Um programa calcula a metade de 5 usando a expressão: int divisaoInteira = 5 / 2;",
                text: "Qual será o resultado impresso se fizermos a saída desta variável?",
                options: [
                    "2",
                    "2.5",
                    "3",
                    "0"
                ],
                answer: "2"
            },
            {
                id: 4,
                instruction: "Âmbito (Scope) de Variáveis.",
                scenario: "Dentro de um bloco de if, você declara a variável 'String email = sc.next();'. Na linha imediatamente fora (abaixo) do bloco if, você tenta usar 'System.out.println(email);'.",
                text: "O que acontecerá ao compilar e executar o código?",
                options: [
                    "Erro de compilação, pois a variável 'email' morreu no fim do bloco if e o Java não a reconhece fora.",
                    "O código compila normalmente e imprime o email digitado sem avisos.",
                    "O código compila, mas imprime 'null' em vez do dado original.",
                    "Ocorre um Fallthrough e o valor é convertido implicitamente."
                ],
                answer: "Erro de compilação, pois a variável 'email' morreu no fim do bloco if e o Java não a reconhece fora."
            },
            {
                id: 5,
                instruction: "Comportamento do Switch-Case.",
                scenario: "Em uma condicional switch(depto), o 'case \"Vendas\":' não possui a palavra-chave 'break;'. Imediatamente abaixo dele, há o 'case \"RH\":'.",
                text: "O que acontece caso a variável depto seja avaliada como 'Vendas'?",
                options: [
                    "Ocorre o efeito Fallthrough: o programa executa a linha de Vendas e continua executando as linhas de baixo (RH).",
                    "Apenas o código de Vendas é processado, pois o Java infere a mudança de case.",
                    "Ocorre um erro de sintaxe obrigando a declaração do comando break.",
                    "A aplicação entra em estado de deadlock."
                ],
                answer: "Ocorre o efeito Fallthrough: o programa executa a linha de Vendas e continua executando as linhas de baixo (RH)."
            },
            {
                id: 6,
                instruction: "Índices de Arrays em Java.",
                scenario: "Um array 'funcionarios' é populado na memória e possui length = 5. O desenvolvedor varre os dados com um laço for usando 'i <= funcionarios.length'.",
                text: "O que ocorrerá fatalmente ao i atingir o valor 5?",
                options: [
                    "Uma exceção ArrayIndexOutOfBoundsException será lançada, pois o último índice da gaveta válido é 4.",
                    "Um valor 'null' será recuperado.",
                    "O for interromperá a execução de maneira silenciosa.",
                    "O array fará um resize automático permitindo a alocação."
                ],
                answer: "Uma exceção ArrayIndexOutOfBoundsException será lançada, pois o último índice da gaveta válido é 4."
            },
            {
                id: 7,
                instruction: "Controlando Loops com Break e Continue.",
                scenario: "No meio de um processamento de um laço for varrendo valores de 1 a 5, encontra-se a instrução 'continue;' quando i for 3.",
                text: "Como o fluxo de execução se comportará nesse exato momento?",
                options: [
                    "Pula o resto da iteração atual (o processamento do 3) e volta para o início da próxima volta.",
                    "Quebra o laço totalmente e o destrói da memória Stack.",
                    "Coloca o fluxo em suspensão para evitar exceptions.",
                    "Zera a contagem da variável de incremento forçando o reinício."
                ],
                answer: "Pula o resto da iteração atual (o processamento do 3) e volta para o início da próxima volta."
            },
            {
                id: 8,
                instruction: "Comparações Lógicas de Strings.",
                scenario: "Você deve avaliar se a variável 'String depto' é correspondente ao texto 'TI'. A abordagem construída no código foi: if (depto == \"TI\")",
                text: "De acordo com os fundamentos do Java, por que isso é um risco e qual a sintaxe correta?",
                options: [
                    "O == compara referências de memória. A forma correta para conteúdo de texto é depto.equals(\"TI\").",
                    "O == opera apenas em bytes numéricos. O uso de compareTo seria obrigatório.",
                    "Strings são instâncias primárias e requerem depto.matches(\"TI\").",
                    "Não há risco técnico, o compilador moderniza a referência internamente."
                ],
                answer: "O == compara referências de memória. A forma correta para conteúdo de texto é depto.equals(\"TI\")."
            },
            {
                id: 9,
                instruction: "Conceituação de Matrizes.",
                scenario: "Você mapeia um tabuleiro tático reticulado no desenvolvimento do seu jogo digital. Para armazenar os quadrantes (linhas e colunas), utiliza-se o conceito de Matriz.",
                text: "No contexto da linguagem Java, o que descreve uma Matriz?",
                options: [
                    "É um array multidimensional, tecnicamente processado como um array de arrays (ex: int[][] matriz).",
                    "É uma lista dinâmica alocada via ArrayList<> de tamanho horizontal escalável.",
                    "É uma estrutura especial derivada dos tipos primitivos focada em cálculos quânticos.",
                    "Trata-se de um vetor linear fragmentado pelo garbage collector."
                ],
                answer: "É um array multidimensional, tecnicamente processado como um array de arrays (ex: int[][] matriz)."
            },
            {
                id: 10,
                instruction: "Escolha Arquitetural de Laços para Matrizes.",
                scenario: "Necessita-se de duas rotinas distintas. Uma para varrer o mapa inteiro extraindo uma somatória global e outra para buscar uma localização e interromper imediatamente a busca assim que encontrá-la (Short-Circuit).",
                text: "Quais laços são descritos como 'padrões-ouro' para estas duas necessidades (Travessia Completa e Busca Otimizada)?",
                options: [
                    "Busca: while. Travessia Completa: for aninhado.",
                    "Busca: for iterativo. Travessia Completa: do-while aninhado.",
                    "Busca: do-while. Travessia Completa: Arrays.stream.",
                    "Ambos requerem exclusivamente laço for, já que o tamanho de uma matriz é imutável."
                ],
                answer: "Busca: while. Travessia Completa: for aninhado."
            },
            {
                id: 11,
                instruction: "Características do ArrayList.",
                scenario: "A fila de pacientes em uma aplicação de pronto-socorro precisa armazenar nomes. O fluxo varia diariamente, sendo incerto prever um limite numérico inicial.",
                text: "Qual é a característica do ArrayList que justifique totalmente a escolha dessa estrutura neste cenário?",
                options: [
                    "Ele cresce automaticamente e realoca sua capacidade (capacity) quando novos elementos são adicionados.",
                    "O processamento imutável garante a persistência dos tipos em bancos não-relacionais.",
                    "O ArrayList processa variáveis do tipo char com performance de hardware superior.",
                    "Ele fixa um size na inicialização evitando overflow e permitindo paginação."
                ],
                answer: "Ele cresce automaticamente e realoca sua capacidade (capacity) quando novos elementos são adicionados."
            },
            {
                id: 12,
                instruction: "Generics e Tipos Primitivos.",
                scenario: "Um júnior programa a declaração: ArrayList<int> numeros = new ArrayList<>(); O compilador sinaliza um bloqueio estrito na linha.",
                text: "Qual regra básica do framework Collection do Java o desenvolvedor violou?",
                options: [
                    "ArrayList funciona apenas com Objetos (ex: Integer), não suportando tipos primitivos diretos (ex: int).",
                    "Declarar colchetes ao invés de sinais de diamante: ArrayList[int]",
                    "Esqueceu de alocar a quantidade de indexação no new ArrayList<>(MAX).",
                    "Foi importado o pacote util.Arrays ao invés do lang.ArrayList."
                ],
                answer: "ArrayList funciona apenas com Objetos (ex: Integer), não suportando tipos primitivos diretos (ex: int)."
            },
            {
                id: 13,
                instruction: "Limites em Matrizes (2D).",
                scenario: "Para percorrer uma matriz, o primeiro 'for' de linhas vai até 'matriz.length'. Internamente, você constrói o 'for' que iterará sobre a dimensão das colunas.",
                text: "Na sintaxe da iteração, como se resgata dinamicamente o número total de colunas presentes na linha instanciada (i)?",
                options: [
                    "Usando matriz[i].length",
                    "Usando matriz.length(i)",
                    "Acessando matriz.size()",
                    "Lendo o atributo matriz.cols"
                ],
                answer: "Usando matriz[i].length"
            },
            {
                id: 14,
                instruction: "Sub-rotinas: Procedimento ou Função?",
                scenario: "O analista requisita que você construa um bloco chamado 'limparTela' que formate o terminal. Nenhum dado é devolvido matematicamente ao fluxo invocador.",
                text: "Historicamente, o que define essa sub-rotina e qual sua assinatura no retorno de Java?",
                options: [
                    "Procedimento; o tipo de retorno associado é o void.",
                    "Função; o tipo de retorno associado é nulo.",
                    "Método estático; o tipo de retorno é o boolean.",
                    "Construtor; não possui tipo de retorno."
                ],
                answer: "Procedimento; o tipo de retorno associado é o void."
            },
            {
                id: 15,
                instruction: "Passagem de Parâmetros por Referência.",
                scenario: "Você encapsula a inteligência em um método que recebe como parâmetro um array. Lá dentro, ele altera o elemento do índice zero. Quando a sub-rotina termina, você inspeciona a variável original lá no 'main'.",
                text: "O que acontecerá com os dados originais no Heap da memória?",
                options: [
                    "O array original é alterado, pois ele foi passado por referência de memória (ponteiro para a mesma gaveta).",
                    "Permanece inalterado, pois o Java encapsula uma cópia restrita dentro da função (pass-by-value integral).",
                    "Os dados são corrompidos pela limpeza da sub-rotina pelo Garbage Collector.",
                    "Será lançada uma violação de acesso em memória (Memory Exception)."
                ],
                answer: "O array original é alterado, pois ele foi passado por referência de memória (ponteiro para a mesma gaveta)."
            },
            {
                id: 16,
                instruction: "O Modificador Static e o Main.",
                scenario: "Na declaração do método de calcular comissões: public [?] double calcComissao(). Você descobre que o método 'main' exige o modificador estático e recusa executar funções ausentes de static.",
                text: "Por que a sub-rotina auxiliar que atende diretamente o método main também precisa ser marcada como static?",
                options: [
                    "Porque métodos estáticos (main) só invocam diretamente outros métodos da mesma classe se estes também pertencerem à classe (static), sem necessitar do uso do 'new'.",
                    "Para fixar na memória virtual (JVM) que o método tem caráter imutável.",
                    "Porque é pré-requisito de visibilidade estrita para cálculos monetários.",
                    "Para indicar que os arrays transitados se tornem estáticos também."
                ],
                answer: "Porque métodos estáticos (main) só invocam diretamente outros métodos da mesma classe se estes também pertencerem à classe (static), sem necessitar do uso do 'new'."
            },
            {
                id: 17,
                instruction: "A Clausura Opcional de Return.",
                scenario: "Um método foi assinado tipado em 'String'. Uma condicional if possui em seu bloco de execução: return \"Aprovado\";",
                text: "De acordo com as regras rígidas do compilador, o que precisa ter cobertura obrigatória na ramificação (else) inferior?",
                options: [
                    "Um return obrigatório em todos os caminhos de ramificação (ex: return \"Reprovado\");, sob pena de erro de compilação.",
                    "Um simples comando System.out de texto ou print.",
                    "A instrução de break para matar a Thread sem erro fatal.",
                    "Não é obrigatório haver cláusula alternativa se houver fallback global de Exception."
                ],
                answer: "Um return obrigatório em todos os caminhos de ramificação (ex: return \"Reprovado\");, sob pena de erro de compilação."
            },
            {
                id: 18,
                instruction: "A Assinatura e Parâmetros Complexos.",
                scenario: "Um método chamado duplicarValores atuará manipulando uma Coleção Dinâmica composta por inteiros.",
                text: "Como a assinatura deste método deve descrever e tipar a captura da coleção dentro dos parênteses?",
                options: [
                    "public static void duplicarValores(ArrayList<Integer> lista)",
                    "public static void duplicarValores(ArrayList[int] lista)",
                    "public static void duplicarValores(Integer<> ArrayList lista)",
                    "public static void duplicarValores(List<int> lista)"
                ],
                answer: "public static void duplicarValores(ArrayList<Integer> lista)"
            },
            {
                id: 19,
                instruction: "Validação Dinâmica de Interações.",
                scenario: "O programa exige que o jogador não insira coordenadas fantasmas no mapa (-1, 99). A ação requer que a mensagem repita quantas vezes o jogador errar a entrada na linha de comando.",
                text: "Qual estrutura as boas práticas dos slides determinam como 'Validação de Interação' que roda obrigatoriamente a primeira vez para requisitar o dado?",
                options: [
                    "do-while: garante ao menos uma execução para solicitar a leitura e testa no fim se deverá se repetir.",
                    "for loop: quebra em um limitador iterativo fixo de 3 tentativas.",
                    "while com flag booleano preexistente para falsear.",
                    "if-else estendido em cascata de try-catch."
                ],
                answer: "do-while: garante ao menos uma execução para solicitar a leitura e testa no fim se deverá se repetir."
            },
            {
                id: 20,
                instruction: "Mutação de Sintaxe: Array para List.",
                scenario: "No código legado constava: array[i] = v; e o limite do laço vinha de array.length. Uma refatoração técnica o trocou para o novo modelo de ArrayList<Integer> lista.",
                text: "Quais são as invocações de método (substitutas) equivalentes à operação de atribuição e leitura de tamanho total?",
                options: [
                    "lista.set(i, v) e lista.size()",
                    "lista.insert(i, v) e lista.length()",
                    "lista[i] = v e lista.count()",
                    "lista.add(v) e lista.capacity()"
                ],
                answer: "lista.set(i, v) e lista.size()"
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
            await typeWriter(`Carregando Desafio ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Auditoria concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Lógica aprovada pelo compilador.";
                addLog("Sucesso: Diagnóstico de código preciso.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Execução abortada por SyntaxError.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Diagnóstico Incorreto. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Alternativa incorreta. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade de análise e domínio de código Java.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada dos fundamentos teóricos de Java (Coleções, Escopo, Matrizes e Funções).";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Avaliação em Java</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Estruturas de Dados e Funções</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo processos lógicos fundamentais, laços de repetição (for/while/do-while), tipagem em Arrays, Matrizes e uso do Collections Framework (ArrayList).</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador JAVA_EVAL.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Java_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando simulação de fundamentos Java...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador JAVA_EVAL_v2.0...", "log-info");
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