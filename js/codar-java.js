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

        // --- Banco de Questões (Algoritmos e Dicas Inseridas) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Leia dois números inteiros digitados pelo usuário, calcule a soma e exiba o resultado.",
                variables: "Scanner sc, int n1, int n2, int soma",
                scenario: "Calculadora Básica: O sistema precisa receber dois valores no console e retornar o total.",
                expectedPatterns: ["Scanner", "System\\.in", "nextInt", "\\+", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint n1 = sc.nextInt();\nint n2 = sc.nextInt();\nint soma = n1 + n2;\nSystem.out.println(\"Soma: \" + soma);",
                explanation: "Utilizamos o objeto 'Scanner' para ler a entrada do teclado (System.in). Guardamos os valores, somamos com o operador '+' e exibimos a saída com 'System.out.println'.",
                hints: [
                    "Você precisa instanciar o Scanner: 'Scanner sc = new Scanner(System.in);'",
                    "Use 'sc.nextInt()' para capturar os números e salve-os em n1 e n2 antes de somar."
                ]
            },
            {
                id: 2,
                instruction: "Leia o nome do usuário e exiba uma mensagem de boas-vindas.",
                variables: "Scanner sc, String nome",
                scenario: "Tela inicial: Cumprimente o usuário pelo nome que ele digitar.",
                expectedPatterns: ["Scanner", "System\\.in", "next|nextLine", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString nome = sc.nextLine();\nSystem.out.println(\"Bem-vindo, \" + nome);",
                explanation: "Para ler textos (Strings), utilizamos os métodos 'next()' (uma palavra) ou 'nextLine()' (frase inteira) do Scanner.",
                hints: [
                    "Para ler textos ao invés de números, o método correto do Scanner é 'sc.nextLine()'.",
                    "Concatene a string usando o operador '+', exemplo: System.out.println(\"Bem-vindo, \" + nome);"
                ]
            },
            {
                id: 3,
                instruction: "Leia a idade de uma pessoa. Se for maior ou igual a 18, imprima 'Maior de idade', senão 'Menor de idade'.",
                variables: "Scanner sc, int idade",
                scenario: "Validação de Acesso: O sistema barra menores de idade.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">=", "18", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint idade = sc.nextInt();\nif (idade >= 18) {\n  System.out.println(\"Maior de idade\");\n} else {\n  System.out.println(\"Menor de idade\");\n}",
                explanation: "A estrutura condicional 'if/else' permite que o algoritmo tome decisões com base na entrada do usuário.",
                hints: [
                    "Você vai precisar da estrutura 'if (idade >= 18) { ... } else { ... }'.",
                    "Certifique-se de colocar um 'System.out.println' tanto no bloco do if quanto no bloco do else."
                ]
            },
            {
                id: 4,
                instruction: "Leia um número inteiro. Verifique se ele é par ou ímpar e imprima o resultado.",
                variables: "Scanner sc, int numero",
                scenario: "Análise Numérica: O algoritmo deve classificar o número recebido.",
                expectedPatterns: ["Scanner", "nextInt", "if", "%\\s*2\\s*==", "0", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint num = sc.nextInt();\nif (num % 2 == 0) {\n  System.out.println(\"Par\");\n} else {\n  System.out.println(\"Ímpar\");\n}",
                explanation: "O operador módulo '%' retorna o resto da divisão. Se o resto da divisão por 2 for zero, o número é par.",
                hints: [
                    "Use o operador de módulo (%). Se 'numero % 2 == 0', o número é par.",
                    "O 'else' cuidará da situação onde o número é ímpar."
                ]
            },
            {
                id: 5,
                instruction: "Leia 3 notas decimais, calcule a média e exiba 'Aprovado' (>=7) ou 'Reprovado'.",
                variables: "Scanner sc, double n1, n2, n3, media",
                scenario: "Sistema Escolar: Fechamento de semestre do aluno.",
                expectedPatterns: ["Scanner", "nextDouble", "\\+", "/", "3", "if", ">=", "7", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble n1 = sc.nextDouble();\ndouble n2 = sc.nextDouble();\ndouble n3 = sc.nextDouble();\ndouble media = (n1 + n2 + n3) / 3;\nif (media >= 7) {\n  System.out.println(\"Aprovado\");\n} else {\n  System.out.println(\"Reprovado\");\n}",
                explanation: "Lembre-se de usar parênteses para somar as notas antes de dividir por 3, respeitando a precedência matemática.",
                hints: [
                    "Como são notas decimais, leia usando 'sc.nextDouble()'.",
                    "Na hora de calcular a média, você precisa isolar a soma: '(n1 + n2 + n3) / 3'."
                ]
            },
            {
                id: 6,
                instruction: "Leia um número 'N'. Use um laço 'for' para imprimir de 1 até 'N'.",
                variables: "Scanner sc, int n, int i",
                scenario: "Contador Dinâmico: O usuário define o limite do contador.",
                expectedPatterns: ["Scanner", "nextInt", "for", "i\\s*<=", "N|n", "i\\+\\+", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nfor (int i = 1; i <= n; i++) {\n  System.out.println(i);\n}",
                explanation: "O laço 'for' é ideal quando sabemos exatamente quantas vezes o bloco deve repetir (de 1 até N).",
                hints: [
                    "A sintaxe do for é: 'for(int i = 1; i <= n; i++)'.",
                    "O comando 'System.out.println(i)' deve ficar dentro das chaves do laço."
                ]
            },
            {
                id: 7,
                instruction: "Leia um número e imprima a tabuada dele de 1 a 10 usando um laço.",
                variables: "Scanner sc, int num, int i",
                scenario: "Módulo Matemático: Geração automática de tabuadas.",
                expectedPatterns: ["Scanner", "nextInt", "for", "i\\s*<=", "10", "\\*", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint num = sc.nextInt();\nfor (int i = 1; i <= 10; i++) {\n  System.out.println(num + \" x \" + i + \" = \" + (num * i));\n}",
                explanation: "Multiplicamos o número de entrada pela variável iteradora 'i' a cada passo do laço.",
                hints: [
                    "Seu laço for deve ir de 1 até 10. Exemplo: 'i <= 10'.",
                    "A impressão deve multiplicar a variável de entrada pelo índice 'i': (num * i)."
                ]
            },
            {
                id: 8,
                instruction: "Leia o preço de um produto. Se custar mais de 100, aplique 10% de desconto. Imprima o valor final.",
                variables: "Scanner sc, double preco, double precoFinal",
                scenario: "PDV: Aplicação automática de desconto para compras grandes.",
                expectedPatterns: ["Scanner", "nextDouble", "if", ">", "100", "\\*", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble preco = sc.nextDouble();\nif (preco > 100) {\n  preco = preco - (preco * 0.10);\n}\nSystem.out.println(preco);",
                explanation: "Calculamos 10% multiplicando por 0.10 e subtraímos do valor original dentro do bloco 'if'.",
                hints: [
                    "O 'if' testará '(preco > 100)'.",
                    "Se for maior, o novo preço é ele mesmo multiplicado por 0.9, ou seja: 'preco = preco - (preco * 0.10)'."
                ]
            },
            {
                id: 9,
                instruction: "Leia a base e a altura de um triângulo, calcule e exiba a área ((base * altura) / 2).",
                variables: "Scanner sc, double base, double altura, double area",
                scenario: "Geometria: O usuário insere as dimensões para descobrir a área.",
                expectedPatterns: ["Scanner", "nextDouble", "\\*", "/", "2", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble base = sc.nextDouble();\ndouble altura = sc.nextDouble();\ndouble area = (base * altura) / 2;\nSystem.out.println(area);",
                explanation: "Operações aritméticas básicas processando dados inseridos pelo usuário.",
                hints: [
                    "Não esqueça de ler duas vezes com o Scanner (uma para base, outra para altura).",
                    "Calcule a área com: 'double area = (base * altura) / 2;' e depois imprima."
                ]
            },
            {
                id: 10,
                instruction: "Leia uma senha (String). Se for igual a 'admin123', exiba 'Permitido', senão 'Negado'.",
                variables: "Scanner sc, String senha",
                scenario: "Autenticação: Validando credenciais de texto.",
                expectedPatterns: ["Scanner", "next", "if", "equals", "admin123", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString senha = sc.next();\nif (senha.equals(\"admin123\")) {\n  System.out.println(\"Permitido\");\n} else {\n  System.out.println(\"Negado\");\n}",
                explanation: "Em Java, Strings são objetos. Não usamos '==' para comparar o texto, mas sim o método '.equals()'.",
                hints: [
                    "NUNCA use '==' para comparar Strings em Java.",
                    "Use o método da própria variável: 'if (senha.equals(\"admin123\"))'."
                ]
            },
            {
                id: 11,
                instruction: "Leia uma temperatura em Celsius, converta para Fahrenheit (C * 1.8 + 32) e imprima.",
                variables: "Scanner sc, double celsius, double fahrenheit",
                scenario: "Conversor Universal: Transformando escalas de temperatura.",
                expectedPatterns: ["Scanner", "nextDouble", "\\*", "1\\.8", "\\+", "32", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble c = sc.nextDouble();\ndouble f = (c * 1.8) + 32;\nSystem.out.println(\"Temp: \" + f);",
                explanation: "O processamento aplica a fórmula matemática antes de enviar o resultado para a saída.",
                hints: [
                    "A variável de leitura deve ser 'double' para suportar decimais.",
                    "Aplique diretamente a fórmula sugerida no exercício e jogue o resultado no 'System.out.println()'."
                ]
            },
            {
                id: 12,
                instruction: "Leia um número 'N'. Use um loop para somar todos os números de 1 até 'N' e imprima a soma total.",
                variables: "Scanner sc, int n, int soma, int i",
                scenario: "Somatória: Acumulando valores dentro de uma estrutura de repetição.",
                expectedPatterns: ["Scanner", "nextInt", "soma\\s*=", "for|while", "\\+", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint n = sc.nextInt();\nint soma = 0;\nfor(int i = 1; i <= n; i++) {\n  soma += i;\n}\nSystem.out.println(\"Total: \" + soma);",
                explanation: "Variáveis acumuladoras (como 'soma') devem ser declaradas fora do laço e iniciadas com zero.",
                hints: [
                    "Declare a variável 'int soma = 0;' ANTES de iniciar o laço for.",
                    "Dentro do laço for, some o iterador: 'soma = soma + i;'. Imprima a soma apenas FORA do laço."
                ]
            },
            {
                id: 13,
                instruction: "Leia um salário. Se for menor que 2000, dê 15% de aumento. Senão, dê 5%. Imprima o novo salário.",
                variables: "Scanner sc, double salario, double novoSalario",
                scenario: "RH: Reajuste salarial proporcional.",
                expectedPatterns: ["Scanner", "nextDouble", "if", "<", "2000", "\\*", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble sal = sc.nextDouble();\nif (sal < 2000) {\n  sal = sal * 1.15;\n} else {\n  sal = sal * 1.05;\n}\nSystem.out.println(sal);",
                explanation: "Multiplicar por 1.15 é um atalho matemático para adicionar 15% a um valor.",
                hints: [
                    "Para dar 15% de aumento matemático, basta multiplicar a variável original por 1.15.",
                    "No bloco 'else', multiplique o salário por 1.05."
                ]
            },
            {
                id: 14,
                instruction: "Leia uma palavra e use um laço para imprimi-la 5 vezes na tela.",
                variables: "Scanner sc, String palavra, int i",
                scenario: "Eco no console: Repetindo a entrada do usuário múltiplas vezes.",
                expectedPatterns: ["Scanner", "next", "for|while", "5", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString palavra = sc.next();\nfor (int i = 0; i < 5; i++) {\n  System.out.println(palavra);\n}",
                explanation: "O laço apenas repete o comando de saída, não necessitando alterar a variável.",
                hints: [
                    "O laço deve rodar de 0 até < 5, ou de 1 até <= 5.",
                    "A leitura do Scanner (sc.next()) deve ocorrer ANTES do laço, e o print DENTRO do laço."
                ]
            },
            {
                id: 15,
                instruction: "Leia dois números inteiros e imprima apenas o maior deles.",
                variables: "Scanner sc, int n1, int n2",
                scenario: "Comparador de grandezas.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint n1 = sc.nextInt();\nint n2 = sc.nextInt();\nif (n1 > n2) {\n  System.out.println(n1);\n} else {\n  System.out.println(n2);\n}",
                explanation: "Comparamos os dois valores lidos e direcionamos o fluxo de saída conforme o resultado lógico.",
                hints: [
                    "Um simples 'if (n1 > n2)' resolverá o problema.",
                    "Imprima 'n1' se for verdadeiro, ou 'n2' no bloco 'else'."
                ]
            },
            {
                id: 16,
                instruction: "Leia a idade. Imprima 'Não vota' (< 16), 'Opcional' (16, 17 ou > 70) ou 'Obrigatório'.",
                variables: "Scanner sc, int idade",
                scenario: "TSE: Validação do status eleitoral do cidadão.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "16", "else if", "18|70", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint idade = sc.nextInt();\nif (idade < 16) {\n  System.out.println(\"Não vota\");\n} else if (idade >= 18 && idade <= 70) {\n  System.out.println(\"Obrigatório\");\n} else {\n  System.out.println(\"Opcional\");\n}",
                explanation: "A estrutura 'else if' permite testar múltiplas condições encadeadas de forma organizada.",
                hints: [
                    "Use o 'else if' para criar um caminho do meio. Comece testando '(idade < 16)'.",
                    "A segunda condição ideal é testar a obrigatoriedade: '(idade >= 18 && idade <= 70)'. O que sobrar vai pro 'else' (opcional)."
                ]
            },
            {
                id: 17,
                instruction: "Leia um número. Imprima se ele é 'Positivo', 'Negativo' ou 'Zero'.",
                variables: "Scanner sc, int num",
                scenario: "Análise de sinal matemático.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "0", "else if", "<", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint num = sc.nextInt();\nif (num > 0) {\n  System.out.println(\"Positivo\");\n} else if (num < 0) {\n  System.out.println(\"Negativo\");\n} else {\n  System.out.println(\"Zero\");\n}",
                explanation: "Uma cadeia de 'if / else if / else' clássica para dividir números em suas 3 categorias absolutas.",
                hints: [
                    "Números positivos são maiores que zero (> 0).",
                    "Teste negativos com '(num < 0)' usando 'else if'. Se não for nenhum dos dois, sobrou o 'else' para o Zero."
                ]
            },
            {
                id: 18,
                instruction: "Crie um laço 'while' que leia números inteiros até que o usuário digite '0'.",
                variables: "Scanner sc, int num",
                scenario: "Sentinela: O programa roda até receber a flag de parada (zero).",
                expectedPatterns: ["Scanner", "nextInt", "while", "!=", "0"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint num = sc.nextInt();\nwhile (num != 0) {\n  num = sc.nextInt();\n}\nSystem.out.println(\"Fim\");",
                explanation: "O laço 'while' é perfeito quando não sabemos quantas iterações vão ocorrer, dependendo estritamente da entrada do usuário.",
                hints: [
                    "A condição de permanência do laço é o número ser diferente de zero: 'while (num != 0)'.",
                    "Você PRECISARÁ colocar um 'num = sc.nextInt();' dentro do laço, senão ele rodará para sempre."
                ]
            },
            {
                id: 19,
                instruction: "Leia o peso e altura. Calcule o IMC (peso / (altura * altura)). Imprima o valor final.",
                variables: "Scanner sc, double peso, double altura, double imc",
                scenario: "Saúde: Calculadora de Índice de Massa Corporal.",
                expectedPatterns: ["Scanner", "nextDouble", "/", "\\(", "\\*", "\\)", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble peso = sc.nextDouble();\ndouble altura = sc.nextDouble();\ndouble imc = peso / (altura * altura);\nSystem.out.println(\"IMC: \" + imc);",
                explanation: "O uso de parênteses no divisor é fundamental para alterar a precedência e evitar erros de lógica matemática.",
                hints: [
                    "Declare as variáveis como 'double', incluindo a do cálculo de IMC.",
                    "O parêntese no cálculo não é opcional, a máquina fará a conta errada se você não colocar: 'peso / (altura * altura)'."
                ]
            },
            {
                id: 20,
                instruction: "Leia uma palavra (String) e imprima a quantidade de caracteres que ela possui.",
                variables: "Scanner sc, String palavra, int tamanho",
                scenario: "Manipulação de Strings: Análise de tamanho de entrada.",
                expectedPatterns: ["Scanner", "next", "length\\(\\)", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString palavra = sc.next();\nSystem.out.println(\"Caracteres: \" + palavra.length());",
                explanation: "O método 'length()' dos objetos String em Java retorna um inteiro com o número de caracteres.",
                hints: [
                    "Use 'sc.next()' para capturar a palavra.",
                    "Para descobrir o tamanho de uma String em Java, utilize o método nativo dela chamado '.length()'."
                ]
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
            await typeWriter(`Construindo Algoritmo ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(`[Desafio] ${currentQuestion.value.scenario}`, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userCode.value = "";
            attempts.value = 0; 
            hintsUsed.value = 0; // Reseta as dicas na mudança de questão
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
                addLog("Treinamento algorítmico concluído. Compilando relatório PDF...", "log-info");
            }
        };

        // --- Sistema de Dicas ---
        const requestHint = () => {
            if (hintsUsed.value < maxHints && !roundOver.value && !isTyping.value) {
                const hintText = currentQuestion.value.hints[hintsUsed.value];
                hintsUsed.value++;
                feedbackType.value = "info";
                feedbackMsg.value = `<i class='bi bi-lightbulb-fill'></i> <strong>Dica ${hintsUsed.value}:</strong> ${hintText}`;
                addLog(`[Ajuda] Dica solicitada pelo usuário (${hintsUsed.value}/${maxHints}).`, "log-info");
            }
        };

        const submitCode = () => {
            if (isTyping.value || roundOver.value) return;

            const code = userCode.value;
            if (!code.trim()) {
                feedbackType.value = "warning";
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio. Escreva seu algoritmo.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Algoritmo validado com sucesso! Fluxo de lógica correto.";
                addLog(`[Success] Algoritmo para o Desafio ${currentQuestion.value.id} aprovado.`, "log-success");
                roundOver.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. Verifique a explicação e a solução proposta.`;
                    addLog(`[Erro] Estrutura algorítmica inválida. Avançando.`, "log-error");
                    roundOver.value = true;
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Faltam estruturas obrigatórias ou a lógica matemática está incorreta. Tentativa ${attempts.value}/${maxAttempts}`;
                    addLog(`[Aviso] Falha de compilação/lógica na tentativa ${attempts.value}.`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente domínio no desenvolvimento de algoritmos e controle de fluxo.";
            if (score.value < 14) performanceMsg = "Recomenda-se treinar mais a estrutura Scanner, laços de repetição e operadores.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Treinamento - Lógica Java</h1>
                    <h2 style="color: #555; margin: 5px 0;">Algoritmos Base (E/S, Condicionais e Laços)</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Conclusão:</strong> ${data}</p>
                    <p>Este documento atesta a participação na criação de ${questions.value.length} algoritmos completos, envolvendo captura de dados, processamento condicional/matemático e saída de console.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho no Simulador</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#5C8069' : (score.value >= 10 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Algoritmos Validados</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo módulo educacional JAVA.LOGIC
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Java_Algoritmos_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando ambiente de desenvolvimento Java...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Validador Algorítmico...", "log-info");
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