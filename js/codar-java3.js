const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            score: 0,
            attempts: 0,
            userCode: '',
            logs: [{ type: 'log-info', text: 'Ambiente Java inicializado. Módulo: Matrizes (Estrutura Completa).' }],
            isTyping: false,
            roundOver: false,
            feedbackMsg: '',
            feedbackType: '',
            gameOver: false,
            hintsUsed: 0,
            maxHints: 3,
            questions: [
                {
                    instruction: "[Ex1] Crie a classe Ex1 completa, importe o java.util.Scanner, adicione o método main e declare uma matriz 'm' 2x2 preenchida pelo Scanner.",
                    variables: "import, class, main, m, Scanner",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+\w+[\s\S]*main\s*\(\s*String\s*\[\]\s*\w+\s*\)[\s\S]*new\s+int\s*\[2\]\s*\[2\]/i,
                    explanation: "Um programa Java funcional exige o import antes da classe, a declaração 'public class' e o ponto de entrada 'public static void main(String[] args)'.",
                    expectedExample: "import java.util.Scanner;\npublic class Ex1 {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[][] m = new int[2][2];\n  }\n}",
                    hint: "A estrutura mínima é: import ... \n public class Ex1 { \n public static void main(String[] args) { ... } \n }"
                },
                {
                    instruction: "[Ex2] Crie a classe Ex2 completa (com main). Declare uma matriz e calcule a soma de todos os seus elementos na variável 'soma'.",
                    variables: "class, main, soma, for",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*soma\s*\+=\s*\w+\[\w+\]\[\w+\]/i,
                    explanation: "A classe e o main dão suporte ao laço for bidimensional, onde 'soma += m[i][j]' acumula os valores totais da matriz.",
                    expectedExample: "public class Ex2 {\n  public static void main(String[] args) {\n    int[][] m = {{1,2},{3,4}};\n    int soma = 0;\n    // laços for omitidos\n    soma += m[i][j];\n  }\n}",
                    hint: "Lembre-se de envolver a lógica do 'soma += m[i][j]' com a declaração da class e do main."
                },
                {
                    instruction: "[Ex3] Crie a classe Ex3 completa. Encontre o maior elemento de uma matriz e salve em 'maior'.",
                    variables: "class, main, maior",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*>\s*maior[\s\S]*maior\s*=\s*\w+\[\w+\]\[\w+\]/i,
                    explanation: "Para achar o maior valor, declaramos 'int maior = m[0][0];' e verificamos se o iterador 'm[i][j] > maior' dentro do método main.",
                    expectedExample: "public class Ex3 {\n  public static void main(String[] args) {\n    int maior = m[0][0];\n    if (m[i][j] > maior) maior = m[i][j];\n  }\n}",
                    hint: "Inicialize 'maior', itere na matriz, e use o if(m[i][j] > maior) maior = m[i][j];"
                },
                {
                    instruction: "[Ex4] Crie a classe Ex4 completa. Conte quantos números pares existem na matriz usando operador módulo.",
                    variables: "class, main, countPares, % 2",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*%\s*2\s*==\s*0/i,
                    explanation: "Dentro do main, a condicional para números pares utiliza módulo 2 == 0.",
                    expectedExample: "public class Ex4 {\n  public static void main(String[] args) {\n    int count = 0;\n    if (m[i][j] % 2 == 0) count++;\n  }\n}",
                    hint: "A estrutura do teste é: if (m[i][j] % 2 == 0)."
                },
                {
                    instruction: "[Ex5] Crie a classe Ex5 completa. Imprima os elementos da diagonal principal.",
                    variables: "class, main, i, j",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*System\.out\.print(?:ln)?\(\s*\w+\[(\w+)\]\[\1\]/i,
                    explanation: "Na diagonal principal dentro da sua classe, usamos os índices 'i' tanto para linha quanto para coluna: m[i][i].",
                    expectedExample: "public class Ex5 {\n  public static void main(String[] args) {\n    System.out.print(m[i][i] + \" \");\n  }\n}",
                    hint: "Use m[i][i] no sysout dentro do método main."
                },
                {
                    instruction: "[Ex6] Crie a classe Ex6 completa. Imprima os elementos da diagonal secundária (fórmula n - 1 - i).",
                    variables: "class, main, n",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*\[\s*\w+\s*-\s*1\s*-\s*\w+\s*\]/i,
                    explanation: "Em uma matriz quadrada de tamanho 'n', o elemento da diagonal secundária é encontrado reduzindo a coluna à medida que a linha aumenta [n - 1 - i].",
                    expectedExample: "public class Ex6 {\n  public static void main(String[] args) {\n    int n = m.length;\n    System.out.print(m[i][n - 1 - i]);\n  }\n}",
                    hint: "Dentro do main, acesse o elemento usando m[i][n - 1 - i]."
                },
                {
                    instruction: "[Ex7] Crie a classe Ex7 completa. Some duas matrizes de mesmo tamanho 'a' e 'b', guardando em 'c'.",
                    variables: "class, main, a, b, c",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*c\[\w+\]\[\w+\]\s*=\s*a\[\w+\]\[\w+\]\s*\+\s*b\[\w+\]\[\w+\]/i,
                    explanation: "A lógica de somar duas matrizes no Java se mantém simples: atribuir à matriz destino a soma das originais com os mesmos índices.",
                    expectedExample: "public class Ex7 {\n  public static void main(String[] args) {\n    c[i][j] = a[i][j] + b[i][j];\n  }\n}",
                    hint: "Após os laços for aninhados, faça: c[i][j] = a[i][j] + b[i][j];"
                },
                {
                    instruction: "[Ex8] Crie a classe Ex8 completa. Gere a transposta de uma matriz 'm' (linhas viram colunas).",
                    variables: "class, main, transposta, m",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*transposta\[j\]\[i\]\s*=\s*m\[i\]\[j\]/i,
                    explanation: "Dentro do corpo principal, a matriz transposta recebe nas posições invertidas [j][i] os dados da matriz fonte [i][j].",
                    expectedExample: "public class Ex8 {\n  public static void main(String[] args) {\n    transposta[j][i] = m[i][j];\n  }\n}",
                    hint: "Atribuição invertida: transposta[j][i] = m[i][j];"
                },
                {
                    instruction: "[Ex9] Crie a classe Ex9 completa. Multiplique todos os elementos da matriz 'm' por um escalar.",
                    variables: "class, main, m, escalar",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*m\[i\]\[j\]\s*\**=\s*(?:m\[i\]\[j\]\s*\*|\w+)/i,
                    explanation: "Ao multiplicar por um escalar em Java, você reatribui na própria matriz ou em uma nova o valor do índice multiplicado.",
                    expectedExample: "public class Ex9 {\n  public static void main(String[] args) {\n    int escalar = 5;\n    m[i][j] = m[i][j] * escalar;\n  }\n}",
                    hint: "Reatribua usando m[i][j] = m[i][j] * escalar;"
                },
                {
                    instruction: "[Ex10] Crie a classe Ex10 completa. Faça uma Busca Otimizada procurando pelo número 10 usando a condicional do laço while.",
                    variables: "class, main, while, achou",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*while\s*\([\s\S]*!\s*achou/i,
                    explanation: "Um while com condicional '!achou' dentro do main garante que o Java pare de processar a matriz assim que o objetivo for encontrado.",
                    expectedExample: "public class Ex10 {\n  public static void main(String[] args) {\n    boolean achou = false;\n    while(i < m.length && !achou) {\n       // ...\n    }\n  }\n}",
                    hint: "Crie a estrutura da classe contendo um while com '&& !achou'."
                },
                {
                    instruction: "[Ex11] Crie a classe Ex11 completa. Crie uma matriz identidade 3x3 usando a condicional (i == j).",
                    variables: "class, main, if, id",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*if\s*\(\s*i\s*==\s*j\s*\)[\s\S]*=\s*1;[\s\S]*else[\s\S]*=\s*0;/i,
                    explanation: "Identidade exige um condicional if/else dentro dos laços do main para popular 1 na diagonal e 0 no restante.",
                    expectedExample: "public class Ex11 {\n  public static void main(String[] args) {\n    if (i == j) id[i][j] = 1;\n    else id[i][j] = 0;\n  }\n}",
                    hint: "Se i for igual a j atribua 1, se não (else) atribua 0."
                },
                {
                    instruction: "[Ex12] Crie a classe Ex12 completa. Some apenas os valores de uma linha específica (ex: linha 1).",
                    variables: "class, main, linhaDesejada",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*\+=\s*m\[linhaDesejada\]\[j\]/i,
                    explanation: "Iterando apenas nas colunas (j) e travando o índice da linha, limitamos a manipulação no main.",
                    expectedExample: "public class Ex12 {\n  public static void main(String[] args) {\n    soma += m[linhaDesejada][j];\n  }\n}",
                    hint: "Trave o índice com m[linhaDesejada][j] para a soma."
                },
                {
                    instruction: "[Ex13] Crie a classe Ex13 completa. Substitua os valores negativos da matriz por zero.",
                    variables: "class, main, if, m",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*if\s*\(m\[\w+\]\[\w+\]\s*<\s*0\)[\s\S]*m\[\w+\]\[\w+\]\s*=\s*0/i,
                    explanation: "Lógica simples de limpeza de dados: se 'm[i][j] < 0' então sobrescrevemos com 0.",
                    expectedExample: "public class Ex13 {\n  public static void main(String[] args) {\n    if(m[i][j] < 0) m[i][j] = 0;\n  }\n}",
                    hint: "Teste se m[i][j] < 0 para então atribuir o valor 0."
                },
                {
                    instruction: "[Ex14] Crie a classe Ex14 completa. Cheque se a matriz não é quadrada, comparando 'm.length != m[i].length'.",
                    variables: "class, main, quadrada",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*if\s*\(m\.length\s*!=\s*m\[i\]\.length\)/i,
                    explanation: "Para validações de tamanho, o método main compara o length global da matriz (linhas) com o length interno do array no índice iterado (colunas).",
                    expectedExample: "public class Ex14 {\n  public static void main(String[] args) {\n    if (m.length != m[i].length) quadrada = false;\n  }\n}",
                    hint: "Crie a classe com if (m.length != m[i].length)"
                },
                {
                    instruction: "[Ex15] Crie a classe Ex15 completa. Calcule a média aritmética de todos os elementos da matriz.",
                    variables: "class, main, soma, media",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*media\s*=\s*soma\s*\/\s*totalElementos/i,
                    explanation: "Acumule a soma e divida pelo total de elementos iterados. Lembre-se do cast para double se necessário.",
                    expectedExample: "public class Ex15 {\n  public static void main(String[] args) {\n    double media = soma / totalElementos;\n  }\n}",
                    hint: "A operação principal no final da main é media = soma / totalElementos."
                },
                {
                    instruction: "[Ex16] Crie a classe Ex16 completa COM importação do Scanner. Garanta índices válidos de matriz com 'do-while'.",
                    variables: "import, class, main, do-while",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+\w+[\s\S]*main\s*\([\s\S]*do\s*\{[\s\S]*while\s*\(linha\s*<\s*0\s*\|\|\s*linha\s*>\s*2\)/i,
                    explanation: "Para entrada de usuário forçando correção no Console, importamos o Scanner e usamos um bloco do-while na classe main.",
                    expectedExample: "import java.util.Scanner;\npublic class Ex16 {\n  public static void main(String[] args) {\n    do { \n      linha = sc.nextInt();\n    } while (linha < 0 || linha > 2);\n  }\n}",
                    hint: "Estrutura: import -> class -> main -> do { } while (linha < 0 || linha > 2);"
                },
                {
                    instruction: "[Ex17] Crie a classe Ex17 completa. Some as colunas de 'm' e acumule num vetor 'somaCols'.",
                    variables: "class, main, somaCols, m",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*somaCols\[j\]\s*\+=\s*m\[i\]\[j\]/i,
                    explanation: "Para separar a soma por colunas e guardar em um array unidimensional, isola-se o índice 'j' no vetor destino.",
                    expectedExample: "public class Ex17 {\n  public static void main(String[] args) {\n    somaCols[j] += m[i][j];\n  }\n}",
                    hint: "Armazene acessando o índice j do array: somaCols[j] += m[i][j];"
                },
                {
                    instruction: "[Ex18] Crie a classe Ex18 completa. Inverta a ordem dos elementos apenas da linha 0 da matriz.",
                    variables: "class, main, m, temp",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*m\[0\]\[n\s*-\s*1\s*-\s*j\]/i,
                    explanation: "O swap (troca) de arrays clássico se aplica a uma linha de matriz usando uma variável temporária.",
                    expectedExample: "public class Ex18 {\n  public static void main(String[] args) {\n    int temp = m[0][j];\n    m[0][j] = m[0][n - 1 - j];\n    m[0][n - 1 - j] = temp;\n  }\n}",
                    hint: "Use a fórmula [n - 1 - j] na coluna da linha [0] para inverter a ordem."
                },
                {
                    instruction: "[Ex19] Crie a classe Ex19 completa. Valide se uma matriz é simétrica verificando se m[i][j] é diferente de m[j][i].",
                    variables: "class, main, simetrica",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*if\s*\(m\[i\]\[j\]\s*!=\s*m\[j\]\[i\]\)/i,
                    explanation: "Matriz simétrica significa que a sua forma transposta é idêntica à original. Caso o espelho da diagonal apresente diferença, não é simétrica.",
                    expectedExample: "public class Ex19 {\n  public static void main(String[] args) {\n    if (m[i][j] != m[j][i]) simetrica = false;\n  }\n}",
                    hint: "Compare se m[i][j] != m[j][i]."
                },
                {
                    instruction: "[Ex20] Crie a classe Ex20 completa. Realize a Multiplicação de duas matrizes (A x B).",
                    variables: "class, main, a, b, c, k",
                    regex: /class\s+\w+[\s\S]*main\s*\([\s\S]*c\[i\]\[j\]\s*\+=\s*a\[i\]\[k\]\s*\*\s*b\[k\]\[j\]/i,
                    explanation: "A multiplicação matricial requer um terceiro laço 'k' para que as colunas de A multipliquem as linhas de B.",
                    expectedExample: "public class Ex20 {\n  public static void main(String[] args) {\n    c[i][j] += a[i][k] * b[k][j];\n  }\n}",
                    hint: "Acumule na matriz destino: c[i][j] += a[i][k] * b[k][j];"
                }
            ]
        }
    },
    computed: {
        currentQuestion() { return this.questions[this.currentQuestionIndex]; },
        progressPercentage() { return (this.currentQuestionIndex / this.questions.length) * 100; }
    },
    methods: {
        typeLog(text, type, callback) {
            this.isTyping = true;
            this.logs.push({ text: '', type: type });
            let i = 0;
            const index = this.logs.length - 1;
            
            const typeWriter = () => {
                if (i < text.length) {
                    this.logs[index].text += text.charAt(i);
                    i++;
                    this.$refs.terminalBody.scrollTop = this.$refs.terminalBody.scrollHeight;
                    setTimeout(typeWriter, 15);
                } else {
                    this.isTyping = false;
                    if (callback) callback();
                }
            };
            typeWriter();
        },
        submitCode() {
            if (!this.userCode.trim()) {
                this.feedbackMsg = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio!";
                this.feedbackType = "warning";
                return;
            }

            this.attempts++;
            this.typeLog(`Compilando classe Java...`, 'log-info', () => {
                const code = this.userCode.replace(/\s+/g, ' ').trim();
                const passed = this.currentQuestion.regex.test(code);

                if (passed) {
                    this.handleSuccess();
                } else {
                    this.handleError();
                }
            });
        },
        handleSuccess() {
            this.score++;
            this.roundOver = true;
            this.feedbackMsg = "<i class='bi bi-check-circle-fill'></i> Estrutura da Classe e Sintaxe Validadas com Sucesso!";
            this.feedbackType = "success";
            this.typeLog(`[SUCCESS] Testes passaram. Lógica da matriz aplicada na estrutura correta.`, 'log-success');
        },
        handleError() {
            if (this.attempts >= 3) {
                this.roundOver = true;
                this.feedbackMsg = "<i class='bi bi-x-circle'></i> Limite de tentativas alcançado. Verifique o gabarito.";
                this.feedbackType = "error";
                this.typeLog(`[ERROR] Falha estrutural ou de compilação repetida. Round travado.`, 'log-error');
            } else {
                this.feedbackMsg = `<i class='bi bi-bug'></i> Faltando declarações (import/class/main) ou erro lógico. Tentativa ${this.attempts}/3.`;
                this.feedbackType = "warning";
                this.typeLog(`[WARN] Erro detectado. Verifique a estrutura da classe, o método main e a lógica central.`, 'log-warning');
            }
        },
        requestHint() {
            if (this.hintsUsed < this.maxHints) {
                this.hintsUsed++;
                this.feedbackMsg = `<i class="bi bi-lightbulb"></i> <strong>Dica:</strong> ${this.currentQuestion.hint}`;
                this.feedbackType = "info";
            }
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.resetRound();
                this.typeLog(`Carregando ambiente para desafio ${this.currentQuestionIndex + 1}...`, 'log-info');
            } else {
                this.gameOver = true;
                this.typeLog(`Treinamento finalizado. Gerando estatísticas...`, 'log-success');
            }
        },
        resetRound() {
            this.userCode = '';
            this.attempts = 0;
            this.roundOver = false;
            this.feedbackMsg = '';
            this.feedbackType = '';
        },
        resetGame() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.gameOver = false;
            this.hintsUsed = 0;
            this.logs = [{ type: 'log-info', text: 'Ambiente Java reinicializado.' }];
            this.resetRound();
        },
        saveResultPDF() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
                    <h1 style="color: #5C8069;">Relatório: JAVA.LOGIC 3.0 (Matrizes)</h1>
                    <p><strong>Desafios Concluídos:</strong> ${this.questions.length}</p>
                    <p><strong>Pontuação Final:</strong> ${this.score}</p>
                    <p><strong>Dicas Utilizadas:</strong> ${this.hintsUsed}</p>
                    <hr>
                    <p><em>Este relatório atesta a participação no treinamento prático de estruturas bidimensionais completas em Java, incluindo iterações, estrutura de classe e método principal (main).</em></p>
                </div>
            `;
            html2pdf().from(element).save('relatorio-javalogic-matrizes.pdf');
        }
    }
}).mount('#app');