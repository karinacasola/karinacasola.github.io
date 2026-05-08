const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Treinamento ---
        const currentQuestionIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const roundOver = ref(false);
        const gameOver = ref(false);
        const userCode = ref("");
        const terminalBody = ref(null);
        
        // --- Controle de Dicas ---
        const hintsUsed = ref(0);
        const maxHints = 2;
        const maxAttempts = 3;

        // --- Banco de Questões (Extraídas do PDF de Revisão Java) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Imprima a mensagem 'Olá, Mundo!' no console.",
                variables: "Nenhuma",
                scenario: "A Estrutura Básica (Página 5): O código só começa a rodar se existir o método main().",
                expectedPatterns: ["System\\.out\\.println|System\\.out\\.print", "Olá, Mundo!"],
                expectedExample: "System.out.println(\"Olá, Mundo!\");",
                explanation: "Em Java, a saída padrão para o console é gerada utilizando o comando System.out.println() ou print().",
                hints: [
                    "A instrução de impressão começa com 'System.out.println'.",
                    "A mensagem de texto deve estar entre aspas duplas, exemplo: \"Olá, Mundo!\""
                ]
            },
            {
                id: 2,
                instruction: "Use o Scanner para ler um nome e imprimir 'Bem-vindo, ' + nome.",
                variables: "Scanner sc, String nome",
                scenario: "I/O Básico (Página 7): Capturar dados via teclado.",
                expectedPatterns: ["Scanner", "System\\.in", "nextLine\\(\\)", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString nome = sc.nextLine();\nSystem.out.println(\"Bem-vindo, \" + nome);",
                explanation: "Para utilizar o Scanner capturamos a entrada com (System.in). Para textos inteiros, utilizamos o método .nextLine().",
                hints: [
                    "Instancie o objeto assim: Scanner sc = new Scanner(System.in);",
                    "Para ler o nome, use 'sc.nextLine()'."
                ]
            },
            {
                id: 3,
                instruction: "Calcule a raiz quadrada de 25.0 usando a classe Math e imprima.",
                variables: "double raiz",
                scenario: "Bibliotecas (Página 8): Utilizando o pacote Math importado automaticamente.",
                expectedPatterns: ["Math\\.sqrt", "25", "System\\.out\\.print"],
                expectedExample: "double raiz = Math.sqrt(25.0);\nSystem.out.println(raiz);",
                explanation: "O pacote java.lang fornece métodos prontos em Math. A função Math.sqrt() calcula raízes quadradas.",
                hints: [
                    "O comando exato da função é 'Math.sqrt(25.0)'.",
                    "Salve o resultado em um tipo numérico fracionário, como o double, e mande imprimir."
                ]
            },
            {
                id: 4,
                instruction: "Calcule a potência de 2 elevado a 3 usando Math.pow e imprima o resultado.",
                variables: "double potencia",
                scenario: "Bibliotecas (Página 8): Operações de Exponenciação.",
                expectedPatterns: ["Math\\.pow", "2", "3", "System\\.out\\.print"],
                expectedExample: "double potencia = Math.pow(2.0, 3.0);\nSystem.out.println(potencia);",
                explanation: "A função Math.pow recebe dois argumentos: a base e o expoente, operando sempre com valores decimais (double).",
                hints: [
                    "Use 'Math.pow(2.0, 3.0)' para calcular.",
                    "A base (2) vem primeiro, seguida do expoente (3)."
                ]
            },
            {
                id: 5,
                instruction: "Declare uma variável boolean chamada 'aprovado' como true e imprima-a.",
                variables: "boolean aprovado",
                scenario: "Tipos de Dados Primitivos (Página 10): Texto e Valores Lógicos.",
                expectedPatterns: ["boolean", "aprovado", "true", "System\\.out\\.print"],
                expectedExample: "boolean aprovado = true;\nSystem.out.println(aprovado);",
                explanation: "Em Java, o tipo booleano aceita exclusivamente duas palavras reservadas: true ou false. Não se deve usar aspas.",
                hints: [
                    "A sintaxe começa com a palavra chave 'boolean'.",
                    "Apenas escreva 'true', sem colocar aspas em volta."
                ]
            },
            {
                id: 6,
                instruction: "Faça o cast explícito de double taxa = 9.99 para um int e imprima o resultado.",
                variables: "double taxa, int taxaInteira",
                scenario: "Conversão/Casting (Página 11): Perda intencional de precisão.",
                expectedPatterns: ["double", "9\\.99", "int", "\\(int\\)", "System\\.out\\.print"],
                expectedExample: "double taxa = 9.99;\nint taxaInteira = (int) taxa;\nSystem.out.println(taxaInteira);",
                explanation: "Cast explícito ocorre quando forçamos um dado maior (double de 64bits) em um recipiente menor (int de 32bits), truncando as casas decimais.",
                hints: [
                    "Para forçar o número a virar inteiro, coloque (int) antes da variável de destino.",
                    "A linha ficará assim: 'int taxaInteira = (int) taxa;'"
                ]
            },
            {
                id: 7,
                instruction: "Declare um byte com valor 127, some 1 para forçar o overflow e imprima.",
                variables: "byte meuByte",
                scenario: "Limites dos Tipos (Página 12): O Efeito 'Overflow'.",
                expectedPatterns: ["byte", "127", "\\+\\+", "System\\.out\\.print"],
                expectedExample: "byte meuByte = 127;\nmeuByte++;\nSystem.out.println(meuByte);",
                explanation: "Passar do limite máximo do tipo numérico (no caso do byte, 127) faz com que a linguagem o inverta para o menor valor negativo (-128).",
                hints: [
                    "Você deve declarar a variável: 'byte meuByte = 127;'",
                    "Em seguida, use 'meuByte++;' na linha abaixo para causar o bug."
                ]
            },
            {
                id: 8,
                instruction: "Calcule a expressão (10 + 5) * 2 respeitando a precedência e salve em uma variável.",
                variables: "int expressao",
                scenario: "Operadores e Matemática (Página 15): Precedência Aritmética.",
                expectedPatterns: ["int", "\\(", "10\\s*\\+\\s*5", "\\)", "\\*\\s*2", "System\\.out\\.print"],
                expectedExample: "int expressao = (10 + 5) * 2;\nSystem.out.println(expressao);",
                explanation: "Assim como na matemática, os parênteses () são resolvidos primeiro, alterando a ordem natural de execução do compilador que favorecia a multiplicação.",
                hints: [
                    "Sempre isole a soma '(10 + 5)' entre parênteses para forçar a precedência.",
                    "Depois de criar a expressão, lembre de colocar um System.out.print para valer a resposta."
                ]
            },
            {
                id: 9,
                instruction: "Pegue o resto da divisão de 5 por 2 usando o operador módulo e imprima.",
                variables: "int resto",
                scenario: "Operadores (Página 15): O Operador Módulo (%).",
                expectedPatterns: ["int", "resto", "5\\s*%\\s*2", "System\\.out\\.print"],
                expectedExample: "int resto = 5 % 2;\nSystem.out.println(resto);",
                explanation: "O operador % pega o que 'sobra' de uma divisão inteira (ex: 5 divido por 2 resulta em 2, sobrando 1). Muito útil para validar pares e ímpares.",
                hints: [
                    "A operação utiliza o símbolo da porcentagem. Exemplo: 'int resto = 5 % 2;'.",
                    "Imprima a variável recém criada para finalizar o código."
                ]
            },
            {
                id: 10,
                instruction: "Comece com saldo = 100, use o atalho de modificação-atribuição para somar 50 e imprima.",
                variables: "int saldo",
                scenario: "Atalhos de Operação (Página 16): Modificação-e-Atribuição.",
                expectedPatterns: ["int", "saldo", "100", "\\+=\\s*50", "System\\.out\\.print"],
                expectedExample: "int saldo = 100;\nsaldo += 50;\nSystem.out.println(saldo);",
                explanation: "O operador '+=' é uma abreviação para 'saldo = saldo + 50', limpando o código durante lógicas de acumuladores e cálculos repetitivos.",
                hints: [
                    "Primeira linha: int saldo = 100;",
                    "Segunda linha: saldo += 50; (depois basta imprimir)."
                ]
            },
            {
                id: 11,
                instruction: "Leia uma nota. Se for maior ou igual a 7 imprima 'Aprovado!', senão imprima 'Reprovado'.",
                variables: "int nota",
                scenario: "Controle de Fluxo (Página 18): Condicional if-else.",
                expectedPatterns: ["if", ">=", "7", "System\\.out\\.print", "else"],
                expectedExample: "int nota = 8;\nif (nota >= 7) {\n  System.out.println(\"Aprovado!\");\n} else {\n  System.out.println(\"Reprovado.\");\n}",
                explanation: "A estrutura condicional if-else permite bifurcar decisões analisando afirmações booleanas usando operadores relacionais (>=).",
                hints: [
                    "A sintaxe requer chaves para os blocos: 'if (nota >= 7) { ... }'",
                    "A sequência oposta vai no fechamento: '} else { ... }'."
                ]
            },
            {
                id: 12,
                instruction: "Crie um switch para a variável 'opcao'. No case 1, imprima 'Abrir' e lembre do break.",
                variables: "int opcao",
                scenario: "Controle de Fluxo (Página 19): Estrutura de Múltipla Escolha.",
                expectedPatterns: ["switch", "case 1:", "System\\.out\\.print", "break;"],
                expectedExample: "int opcao = 1;\nswitch(opcao) {\n  case 1:\n    System.out.println(\"Abrir\");\n    break;\n}",
                explanation: "A instrução switch-case avalia variáveis em pontos fixos. A ausência do comando 'break' causa o erro de 'Fallthrough', executando tudo em cascata.",
                hints: [
                    "A estrutura se monta como 'switch(opcao) { case 1: ... }'",
                    "O comando 'break;' deve obrigatoriamente estar após a impressão para deter o fluxo."
                ]
            },
            {
                id: 13,
                instruction: "Crie um laço while que rode enquanto x < 3, imprimindo x e o incrementando (x++).",
                variables: "int x",
                scenario: "Controle de Ciclos (Página 21): A estrutura de repetição While.",
                expectedPatterns: ["int x", "while", "<\\s*3", "System\\.out\\.print", "x\\+\\+"],
                expectedExample: "int x = 0;\nwhile (x < 3) {\n  System.out.println(x);\n  x++;\n}",
                explanation: "A estrutura de repetição while inspeciona a condição ANTES de permitir que o código do bloco seja processado, necessitando de controle de parada interno (x++).",
                hints: [
                    "A declaração é 'while (x < 3) { ... }'.",
                    "Certifique-se de colocar 'x++;' DENTRO das chaves do laço, ou o programa rodará para sempre."
                ]
            },
            {
                id: 14,
                instruction: "Crie um laço do-while que imprima 'Executou' e aplique incremento (y++), enquanto y < 3.",
                variables: "int y",
                scenario: "Controle de Ciclos (Página 21): Do-While de ação compulsória.",
                expectedPatterns: ["do\\s*\\{", "System\\.out\\.print", "y\\+\\+", "\\}\\s*while", "<\\s*3"],
                expectedExample: "int y = 5;\ndo {\n  System.out.println(\"Executou\");\n  y++;\n} while (y < 3);",
                explanation: "A diferença primordial de do-while é que a condição de continuação é avaliada NO FIM, obrigando a execução ao menos na primeira passagem.",
                hints: [
                    "Crie o bloco: 'do { ... } while (y < 3);'.",
                    "Note que o ponto e vírgula é obrigatório no fim do while desta estrutura."
                ]
            },
            {
                id: 15,
                instruction: "Use um laço for para imprimir os números de 1 até 5 (usando <=).",
                variables: "int i",
                scenario: "Controle de Ciclos (Página 22): Estrutura para repetições exatas (for).",
                expectedPatterns: ["for", "int i\\s*=\\s*1", "i\\s*<=\\s*5", "i\\+\\+", "System\\.out\\.print"],
                expectedExample: "for(int i = 1; i <= 5; i++) {\n  System.out.println(i);\n}",
                explanation: "A estrutura for agrupa as 3 peças essenciais dos loops (ponto de partida, critério de parada, regra de passo) na mesma assinatura do método.",
                hints: [
                    "A configuração perfeita do laço é: 'for (int i = 1; i <= 5; i++)'.",
                    "Basta colocar o comando de impressão do 'i' dentro das chaves."
                ]
            },
            {
                id: 16,
                instruction: "Em um laço de 1 a 5, use if e o comando 'continue' para pular o número 3.",
                variables: "int i",
                scenario: "Controlando Loops (Página 23): Pulando a Iteração Atual.",
                expectedPatterns: ["for", "if", "i\\s*==\\s*3", "continue", "System\\.out\\.print"],
                expectedExample: "for(int i = 1; i <= 5; i++) {\n  if(i == 3) continue;\n  System.out.println(i);\n}",
                explanation: "A instrução 'continue' anula todo o código presente abaixo dela DENTRO do laço, pulando instantaneamente para iniciar a volta seguinte.",
                hints: [
                    "A checagem fica na estrutura de if: 'if (i == 3) { continue; }'",
                    "Garanta que o 'System.out.print(i)' venha DEPOIS desse if, assim ele não imprimirá o 3."
                ]
            },
            {
                id: 17,
                instruction: "Em um laço de 1 a 5, use if e o comando 'break' para parar o laço se o valor for 5.",
                variables: "int i",
                scenario: "Controlando Loops (Página 23): Rompimento de Estruturas.",
                expectedPatterns: ["for", "if", "i\\s*==\\s*5", "break", "System\\.out\\.print"],
                expectedExample: "for(int i = 1; i <= 5; i++) {\n  if (i == 5) {\n    break;\n  }\n  System.out.println(i);\n}",
                explanation: "O comando break interrompe totalmente a existência do laço atual em que está contido, forçando a leitura de código a seguir para as linhas exteriores a ele.",
                hints: [
                    "A verificação principal é: 'if(i == 5) { break; }'",
                    "Como sempre, posicione a impressão fora desse bloco if."
                ]
            },
            {
                id: 18,
                instruction: "Faça a divisão precisa com cast (double) de dois inteiros (a=7, b=2) e imprima o decimal.",
                variables: "int a, int b, double divCorreta",
                scenario: "A Divisão Inteira e Perdas (Página 27): Cast com expressões.",
                expectedPatterns: ["int a\\s*=\\s*7", "int b\\s*=\\s*2", "double", "\\(double\\)", "a\\s*/\\s*b", "System\\.out\\.print"],
                expectedExample: "int a = 7;\nint b = 2;\ndouble divCorreta = (double) a / b;\nSystem.out.println(divCorreta);",
                explanation: "Operar com Inteiro / Inteiro sempre resultará em um Inteiro no Java, ocorrendo a quebra do decimal ANTES da variável salvar. Realizamos um Cast '(double)' forçando a conversão antecipada.",
                hints: [
                    "Declare o novo double, transformando a conta de a/b usando ' (double) '",
                    "A sintaxe exata para conversão antecipada é: 'double divCorreta = (double) a / b;'"
                ]
            },
            {
                id: 19,
                instruction: "Crie um Array de inteiros tamanho 3. Atribua o valor 10 no primeiro índice (0) e imprima.",
                variables: "int[] notas",
                scenario: "Vetores na Memória (Página 35): Alocação e Índices Básicos.",
                expectedPatterns: ["int\\[\\]", "new int\\[3\\]", "notas\\[0\\]\\s*=", "10", "System\\.out\\.print"],
                expectedExample: "int[] notas = new int[3];\nnotas[0] = 10;\nSystem.out.println(notas[0]);",
                explanation: "Para alocar um vetor utilizamos o comando new definindo seu tamanho base de memória. A numeração (os índices) dos compartimentos de Arrays começam obrigatoriamente do 0 (zero) e não do 1.",
                hints: [
                    "Declaração do array de três posições: 'int[] notas = new int[3];'.",
                    "A posição inicial se chama pelo colchete no zero: 'notas[0] = 10;'. E então, imprima o notas[0]."
                ]
            },
            {
                id: 20,
                instruction: "Use um for para imprimir os valores de um Array de String. Use: i = 0 até i < array.length",
                variables: "String[] array, int i",
                scenario: "Evitando Out Of Bounds (Página 41): Laço de Varredura Perfeita.",
                expectedPatterns: ["for", "int i\\s*=\\s*0", "i\\s*<\\s*array\\.length", "System\\.out\\.print"],
                expectedExample: "String[] array = {\"A\", \"B\", \"C\"};\nfor(int i = 0; i < array.length; i++) {\n  System.out.println(array[i]);\n}",
                explanation: "Tentar atingir um índice como '<=' length faz o compilador varrer uma posição inexistente gerando a exceção 'OutOfBounds'. Inicie no 0 e trave enquanto 'menor' ao tamanho declarado.",
                hints: [
                    "Para criar um laço perfeito comece na casa 0 (int i = 0).",
                    "E pare ESTRITAMENTE ANTES do tamanho: 'i < array.length'. Nunca use <= em laços de array."
                ]
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal da UI ---
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
            await typeWriter(`Iniciando Exercício de Depuração ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(`[Conceito] ${currentQuestion.value.scenario}`, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userCode.value = "";
            attempts.value = 0; 
            hintsUsed.value = 0; 
            roundOver.value = false; 
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
                addLog("Processo de revisão algorítmica finalizado. Analisando notas e compilando PDF...", "log-info");
            }
        };

        const requestHint = () => {
            if (hintsUsed.value < maxHints && !roundOver.value && !isTyping.value) {
                const hintText = currentQuestion.value.hints[hintsUsed.value];
                hintsUsed.value++;
                feedbackType.value = "info";
                feedbackMsg.value = `<i class='bi bi-lightbulb-fill'></i> <strong>Dica ${hintsUsed.value}:</strong> ${hintText}`;
                addLog(`[Suporte] Dica solicitada pelo usuário na interface (${hintsUsed.value}/${maxHints}).`, "log-info");
            }
        };

        const submitCode = () => {
            if (isTyping.value || roundOver.value) return;

            const code = userCode.value;
            if (!code.trim()) {
                feedbackType.value = "warning";
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> Atenção: Nenhum código detectado no console principal.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Avaliação Positiva: Estrutura lógica aprovada e sintaxe compatível.";
                addLog(`[Success] Sintaxe validada com precisão. Exercício ${currentQuestion.value.id} finalizado.`, "log-success");
                roundOver.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Limite de tentativas atingido. Observe a correção estrutural na documentação inferior.`;
                    addLog(`[Erro Fatal] Lógica em desconformidade. Abortando iteração atual.`, "log-error");
                    roundOver.value = true;
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Depuração falhou: Estrutura ausente ou declaração equivocada. Tentativa ${attempts.value}/${maxAttempts}`;
                    addLog(`[Warning] Trace de erro apontado pelo compilador virtual (${attempts.value}).`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos Fundamentos e de Depuração Java abordados no material.";
            if (score.value < 14) performanceMsg = "Sugerimos rever o módulo PDF nas áreas de laços de repetição (for e while) e análise de limites de Array.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Desempenho JAVA</h1>
                    <h2 style="color: #555; margin: 5px 0;">Fundamentos, Escopo, Ciclos e Depuração Básica</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Registro de Sistema:</strong> ${data}</p>
                    <p>Este documento homologa a realização e submissão dos testes baseados nas apostilas de código e depuração estrutural de Java, concluindo ${questions.value.length} exercícios propostos do módulo introdutório.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Nível de Aprovação Técnica</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#5C8069' : (score.value >= 10 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Avaliações Positivas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Certificado gerado via plataforma educacional REVISAO.LOGIC
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Certificado_Depuracao_Java_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reinicializando ambiente da JVM para testes...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando terminal de validação das questões da Revisão...", "log-info");
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
            roundOver,
            gameOver,
            userCode,
            terminalBody,
            hintsUsed,
            maxHints,
            requestHint,
            submitCode,
            nextQuestion,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');