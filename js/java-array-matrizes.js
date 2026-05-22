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
        const roundOver = ref(false);
        const gameOver = ref(false);
        const userCode = ref("");
        const terminalBody = ref(null);
        
        const hintsUsed = ref(0);
        const maxHints = 2;
        const maxAttempts = 3;

        // 50 Exercícios: 30 de Matrizes (2D) e 20 de ArrayList, sem Orientação a Objetos.
        const questions = ref([
            // --- BLOCO 1: MATRIZES - FUNDAMENTOS E CRIAÇÃO (1 a 10) ---
            {
                id: 1,
                instruction: "Declare uma matriz de inteiros 2x2. Coloque o número 5 na posição [0][0] e imprima.",
                variables: "int[][] matriz",
                scenario: "Iniciando com Matrizes (Arrays Bidimensionais).",
                expectedPatterns: ["class", "main", "int\\[\\]\\[\\]", "new int\\[2\\]\\[2\\]", "\\[0\\]\\[0\\]\\s*=\\s*5", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] matriz = new int[2][2];\n    matriz[0][0] = 5;\n    System.out.println(matriz[0][0]);\n  }\n}",
                explanation: "Matrizes em Java são arrays de arrays. A declaração usa dois pares de colchetes: [linhas][colunas].",
                hints: ["A criação é: int[][] matriz = new int[2][2];", "Acesse a primeira linha e primeira coluna com matriz[0][0]."]
            },
            {
                id: 2,
                instruction: "Crie uma matriz com valores já definidos: {{1, 2}, {3, 4}}. Imprima o número 4.",
                variables: "int[][] matriz",
                scenario: "Inicialização direta de Matrizes.",
                expectedPatterns: ["class", "main", "int\\[\\]\\[\\]", "\\{", "\\{1,\\s*2\\}", "\\{3,\\s*4\\}", "System\\.out\\.print", "\\[1\\]\\[1\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] matriz = {{1, 2}, {3, 4}};\n    System.out.println(matriz[1][1]);\n  }\n}",
                explanation: "A posição [1][1] acessa a segunda linha (índice 1) e a segunda coluna (índice 1).",
                hints: ["Use chaves aninhadas: {{1, 2}, {3, 4}}", "O número 4 está na linha 1, coluna 1."]
            },
            {
                id: 3,
                instruction: "Crie uma matriz 3x3. Imprima a quantidade de LINHAS que ela possui usando '.length'.",
                variables: "int[][] matriz",
                scenario: "Propriedade length (Linhas).",
                expectedPatterns: ["class", "main", "new int\\[3\\]\\[3\\]", "length", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] matriz = new int[3][3];\n    System.out.println(matriz.length);\n  }\n}",
                explanation: "Chamar matriz.length retorna a quantidade de linhas (o primeiro colchete).",
                hints: ["Crie a matriz vazia.", "Imprima matriz.length"]
            },
            {
                id: 4,
                instruction: "Dada a matriz {{1, 2, 3}, {4, 5, 6}}, imprima a quantidade de COLUNAS da linha 0.",
                variables: "int[][] matriz",
                scenario: "Propriedade length (Colunas).",
                expectedPatterns: ["class", "main", "int\\[\\]\\[\\]", "\\[0\\]\\.length", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] matriz = {{1, 2, 3}, {4, 5, 6}};\n    System.out.println(matriz[0].length);\n  }\n}",
                explanation: "Para saber o número de colunas, medimos o tamanho de uma linha específica, como matriz[0].length.",
                hints: ["Use matriz[0].length dentro do System.out.println."]
            },
            {
                id: 5,
                instruction: "Use um Scanner para preencher a posição [0][1] de uma matriz 2x2. Imprima o valor lido.",
                variables: "Scanner sc, int[][] matriz",
                scenario: "Lendo dados para a Matriz.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "new int\\[2\\]\\[2\\]", "nextInt", "\\[0\\]\\[1\\]"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[][] matriz = new int[2][2];\n    matriz[0][1] = sc.nextInt();\n    System.out.println(matriz[0][1]);\n  }\n}",
                explanation: "Você pode atribuir valores provenientes do Scanner diretamente em uma coordenada específica da matriz.",
                hints: ["Declare Scanner e matriz 2x2.", "Faça matriz[0][1] = sc.nextInt();"]
            },
            {
                id: 6,
                instruction: "Dada a matriz {{5, 10}, {15, 20}}, use DOIS laços 'for' aninhados para imprimir todos os valores.",
                variables: "int[][] matriz, int i, int j",
                scenario: "Percorrendo toda a Matriz (Varredura).",
                expectedPatterns: ["class", "main", "for", "matriz\\.length", "for", "matriz\\[i\\]\\.length", "System\\.out\\.print", "\\[i\\]\\[j\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] matriz = {{5, 10}, {15, 20}};\n    for(int i = 0; i < matriz.length; i++) {\n      for(int j = 0; j < matriz[i].length; j++) {\n        System.out.println(matriz[i][j]);\n      }\n    }\n  }\n}",
                explanation: "O laço externo (i) controla as linhas e o interno (j) as colunas.",
                hints: ["O primeiro for usa 'i < matriz.length'.", "O segundo for usa 'j < matriz[i].length'."]
            },
            {
                id: 7,
                instruction: "Crie uma matriz 2x2. Use laços 'for' aninhados e um Scanner para preencher todos os 4 espaços.",
                variables: "Scanner sc, int[][] matriz, int i, int j",
                scenario: "Preenchimento dinâmico de Matriz.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "new int\\[2\\]\\[2\\]", "for", "for", "nextInt", "\\[i\\]\\[j\\]\\s*="],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[][] matriz = new int[2][2];\n    for(int i=0; i<2; i++) {\n      for(int j=0; j<2; j++) {\n        matriz[i][j] = sc.nextInt();\n      }\n    }\n  }\n}",
                explanation: "O Scanner é chamado dentro do laço mais interno para capturar dados linha a linha, coluna a coluna.",
                hints: ["Coloque matriz[i][j] = sc.nextInt(); dentro do segundo for."]
            },
            {
                id: 8,
                instruction: "Na matriz {{1, 2}, {3, 4}}, use laços aninhados para SOMAR todos os valores e imprimir a soma (10).",
                variables: "int[][] mat, int soma",
                scenario: "Acumulação em Matrizes.",
                expectedPatterns: ["int soma\\s*=\\s*0", "for", "for", "soma\\s*\\+=\\s*mat", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    int soma = 0;\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        soma += mat[i][j];\n      }\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "A variável soma deve ser declarada ANTES dos laços. A acumulação acontece no laço interno.",
                hints: ["Declare soma = 0; fora dos laços.", "Dentro, faça soma = soma + mat[i][j];"]
            },
            {
                id: 9,
                instruction: "Encontre o MAIOR valor na matriz {{10, 50}, {20, 5}}. Imprima-o.",
                variables: "int[][] mat, int maior",
                scenario: "Busca de Máximo em Matriz.",
                expectedPatterns: ["int maior", "for", "for", "if", "mat\\[i\\]\\[j\\]\\s*>", "maior\\s*=\\s*mat\\[i\\]\\[j\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{10, 50}, {20, 5}};\n    int maior = mat[0][0];\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        if(mat[i][j] > maior) {\n          maior = mat[i][j];\n        }\n      }\n    }\n    System.out.println(maior);\n  }\n}",
                explanation: "Iniciamos a variável 'maior' com mat[0][0] e comparamos com todos os outros elementos nos laços aninhados.",
                hints: ["Crie int maior = mat[0][0];", "Se mat[i][j] > maior, atualize o valor de 'maior'."]
            },
            {
                id: 10,
                instruction: "Dada a matriz {{2, 4}, {5, 6}}, CONTE quantos números são ÍMPARES e imprima.",
                variables: "int[][] mat, int cont",
                scenario: "Filtragem com Condicionais.",
                expectedPatterns: ["int cont\\s*=\\s*0", "for", "for", "if", "%\\s*2\\s*!=\\s*0", "cont\\+\\+"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{2, 4}, {5, 6}};\n    int cont = 0;\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        if(mat[i][j] % 2 != 0) {\n          cont++;\n        }\n      }\n    }\n    System.out.println(cont);\n  }\n}",
                explanation: "O operador % (módulo) testa o resto da divisão. Se for diferente de 0, é ímpar.",
                hints: ["Use if (mat[i][j] % 2 != 0).", "Incremente o contador se a condição for verdadeira."]
            },

            // --- BLOCO 2: MATRIZES - OPERAÇÕES ESPECÍFICAS (11 a 30) ---
            {
                id: 11,
                instruction: "Imprima apenas os elementos da PRIMEIRA LINHA da matriz {{1, 2, 3}, {4, 5, 6}}.",
                variables: "int[][] mat, int j",
                scenario: "Acesso por Linha Fixa.",
                expectedPatterns: ["for", "j\\s*<\\s*mat\\[0\\]\\.length", "System\\.out\\.print", "mat\\[0\\]\\[j\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2, 3}, {4, 5, 6}};\n    for(int j=0; j<mat[0].length; j++) {\n      System.out.println(mat[0][j]);\n    }\n  }\n}",
                explanation: "Como queremos apenas a primeira linha, travamos o índice i em 0 e iteramos apenas a coluna j.",
                hints: ["Você só precisa de UM laço for (para as colunas).", "Imprima mat[0][j]."]
            },
            {
                id: 12,
                instruction: "Imprima apenas os elementos da ÚLTIMA COLUNA da matriz {{1, 2}, {3, 4}}.",
                variables: "int[][] mat, int i",
                scenario: "Acesso por Coluna Fixa.",
                expectedPatterns: ["for", "i\\s*<\\s*mat\\.length", "System\\.out\\.print", "mat\\[i\\]\\[1\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    for(int i=0; i<mat.length; i++) {\n      System.out.println(mat[i][1]);\n    }\n  }\n}",
                explanation: "Travamos a coluna (índice 1) e iteramos as linhas (índice i).",
                hints: ["Use um laço para as linhas (i).", "Imprima mat[i][1] (pois a matriz tem 2 colunas, logo a última é o índice 1)."]
            },
            {
                id: 13,
                instruction: "Matriz Quadrada (DIAGONAL PRINCIPAL): Dada {{1, 2}, {3, 4}}, imprima a diagonal principal (1 e 4).",
                variables: "int[][] mat, int i",
                scenario: "Acessando a Diagonal Principal.",
                expectedPatterns: ["for", "i\\s*<\\s*mat\\.length", "System\\.out\\.print", "mat\\[i\\]\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    for(int i=0; i<mat.length; i++) {\n      System.out.println(mat[i][i]);\n    }\n  }\n}",
                explanation: "Na diagonal principal de uma matriz quadrada, o índice da linha é igual ao da coluna (i == j).",
                hints: ["Você só precisa de UM laço.", "Imprima mat[i][i]."]
            },
            {
                id: 14,
                instruction: "Substitua todos os valores negativos da matriz {{1, -2}, {-3, 4}} por zero.",
                variables: "int[][] mat",
                scenario: "Substituição e Modificação Condicional.",
                expectedPatterns: ["for", "for", "if", "mat\\[i\\]\\[j\\]\\s*<\\s*0", "mat\\[i\\]\\[j\\]\\s*=\\s*0"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, -2}, {-3, 4}};\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        if(mat[i][j] < 0) {\n          mat[i][j] = 0;\n        }\n      }\n    }\n  }\n}",
                explanation: "Usamos laços aninhados para achar o valor e o modificamos diretamente no índice.",
                hints: ["Verifique if(mat[i][j] < 0)", "Se sim, mat[i][j] = 0;"]
            },
            {
                id: 15,
                instruction: "Busca em Matriz: Verifique se o número 7 existe na matriz {{1, 7}, {3, 4}}. Imprima 'Achou' se sim.",
                variables: "int[][] mat",
                scenario: "Busca Sequencial em 2D.",
                expectedPatterns: ["for", "for", "if", "mat\\[i\\]\\[j\\]\\s*==\\s*7", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 7}, {3, 4}};\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        if(mat[i][j] == 7) {\n          System.out.println(\"Achou\");\n        }\n      }\n    }\n  }\n}",
                explanation: "Varremos toda a matriz e comparamos cada elemento com o valor procurado.",
                hints: ["Se mat[i][j] == 7, imprima a mensagem."]
            },
            {
                id: 16,
                instruction: "Multiplique TODOS os elementos da matriz {{2, 4}, {6, 8}} por 2 (dentro da própria matriz).",
                variables: "int[][] mat",
                scenario: "Escalonamento (Multiplicação Escalar).",
                expectedPatterns: ["for", "for", "mat\\[i\\]\\[j\\]\\s*\\*=\\s*2|mat\\[i\\]\\[j\\]\\s*=\\s*mat\\[i\\]\\[j\\]\\s*\\*\\s*2"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{2, 4}, {6, 8}};\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        mat[i][j] *= 2;\n      }\n    }\n  }\n}",
                explanation: "A operação mat[i][j] *= 2 sobreescreve o valor antigo pelo novo.",
                hints: ["Use mat[i][j] = mat[i][j] * 2;"]
            },
            {
                id: 17,
                instruction: "Copie todos os elementos da matriz A={{1,2},{3,4}} para uma matriz B (criada com o mesmo tamanho).",
                variables: "int[][] a, int[][] b",
                scenario: "Cópia Profunda (Deep Copy) de Matriz.",
                expectedPatterns: ["new int\\[2\\]\\[2\\]", "for", "for", "b\\[i\\]\\[j\\]\\s*=\\s*a\\[i\\]\\[j\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] a = {{1, 2}, {3, 4}};\n    int[][] b = new int[2][2];\n    for(int i=0; i<2; i++) {\n      for(int j=0; j<2; j++) {\n        b[i][j] = a[i][j];\n      }\n    }\n  }\n}",
                explanation: "Não se deve fazer B = A, pois isso copia apenas a referência de memória.",
                hints: ["Crie int[][] b = new int[2][2];", "Dentro dos laços, iguale as posições: b[i][j] = a[i][j];"]
            },
            {
                id: 18,
                instruction: "Calcule a MÉDIA DECIMAL dos 4 valores da matriz {{10, 10}, {20, 20}} e imprima.",
                variables: "int[][] mat, double soma",
                scenario: "Média em Matriz.",
                expectedPatterns: ["double soma", "for", "for", "soma\\s*\\+=\\s*mat\\[i\\]\\[j\\]", "soma\\s*/\\s*4"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{10, 10}, {20, 20}};\n    double soma = 0;\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        soma += mat[i][j];\n      }\n    }\n    System.out.println(soma / 4);\n  }\n}",
                explanation: "Some tudo em uma variável double, depois divida pelo total de elementos (linhas * colunas).",
                hints: ["Crie double soma = 0;", "Divida a soma por 4 (total de espaços) no final."]
            },
            {
                id: 19,
                instruction: "Crie uma matriz de Strings 2x2. Adicione 'Java' na [0][0] e 'Legal' na [1][1]. Concatene as duas e imprima.",
                variables: "String[][] mat",
                scenario: "Matrizes de Texto.",
                expectedPatterns: ["String\\[\\]\\[\\]", "new String\\[2\\]\\[2\\]", "\\[0\\]\\[0\\]\\s*=\\s*\"Java\"", "\\[1\\]\\[1\\]\\s*=\\s*\"Legal\"", "System\\.out\\.print", "\\+"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    String[][] mat = new String[2][2];\n    mat[0][0] = \"Java\";\n    mat[1][1] = \"Legal\";\n    System.out.println(mat[0][0] + \" \" + mat[1][1]);\n  }\n}",
                explanation: "Assim como inteiros, podemos criar matrizes de String.",
                hints: ["Instancie: String[][] mat = new String[2][2];", "Imprima mat[0][0] + mat[1][1]"]
            },
            {
                id: 20,
                instruction: "Some a linha 0 de A={{1,2},{3,4}} com a linha 0 de B={{1,1},{1,1}} e guarde numa variável. Imprima o resultado (4).",
                variables: "int[][] a, int[][] b, int soma",
                scenario: "Operações entre Matrizes.",
                expectedPatterns: ["int soma\\s*=\\s*0", "for", "soma\\s*\\+=\\s*a\\[0\\]\\[j\\]\\s*\\+\\s*b\\[0\\]\\[j\\]", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] a = {{1, 2}, {3, 4}};\n    int[][] b = {{1, 1}, {1, 1}};\n    int soma = 0;\n    for(int j=0; j<a[0].length; j++) {\n      soma += a[0][j] + b[0][j];\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "Como focamos apenas na linha 0, usamos um laço simples travando o 'i' em 0.",
                hints: ["Use apenas o 'j' no laço.", "Some a[0][j] + b[0][j] na variável soma."]
            },
            {
                id: 21,
                instruction: "Matriz Quadrada (DIAGONAL SECUNDÁRIA): Dada {{1, 2}, {3, 4}}, imprima a diagonal invertida (2 e 3).",
                variables: "int[][] mat",
                scenario: "Diagonal Secundária.",
                expectedPatterns: ["for", "mat\\[i\\]\\[mat\\.length\\s*-\\s*1\\s*-\\s*i\\]", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    int tamanho = mat.length;\n    for(int i=0; i<tamanho; i++) {\n      System.out.println(mat[i][tamanho - 1 - i]);\n    }\n  }\n}",
                explanation: "A diagonal secundária tem os índices da coluna decrescendo enquanto a linha cresce (mat[i][length - 1 - i]).",
                hints: ["O índice da coluna será: (mat.length - 1) - i"]
            },
            {
                id: 22,
                instruction: "Declare uma matriz 3x3 e preencha a PRIMEIRA COLUNA com o número 1. Imprima matriz[2][0].",
                variables: "int[][] mat",
                scenario: "Preenchimento Direcionado.",
                expectedPatterns: ["new int\\[3\\]\\[3\\]", "for", "mat\\[i\\]\\[0\\]\\s*=\\s*1", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = new int[3][3];\n    for(int i=0; i<3; i++) {\n      mat[i][0] = 1;\n    }\n    System.out.println(mat[2][0]);\n  }\n}",
                explanation: "Usando um laço 'i' para as linhas, travamos a coluna em 0 e atribuímos o valor.",
                hints: ["Use um laço for(int i=0...).", "Faça mat[i][0] = 1;"]
            },
            {
                id: 23,
                instruction: "Verifique se uma matriz {{1, 0}, {0, 1}} é a Matriz Identidade. Conte quantos '1' estão na diagonal principal.",
                variables: "int[][] mat, int cont",
                scenario: "Verificações Matemáticas Específicas.",
                expectedPatterns: ["int cont\\s*=\\s*0", "for", "if", "mat\\[i\\]\\[i\\]\\s*==\\s*1", "cont\\+\\+"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 0}, {0, 1}};\n    int cont = 0;\n    for(int i=0; i<mat.length; i++) {\n      if(mat[i][i] == 1) {\n        cont++;\n      }\n    }\n    System.out.println(cont);\n  }\n}",
                explanation: "Acessamos apenas a diagonal usando mat[i][i].",
                hints: ["Faça if (mat[i][i] == 1) e some 1 ao contador."]
            },
            {
                id: 24,
                instruction: "Transforme a matriz {{1, 2}, {3, 4}} em um vetor 1D de tamanho 4. (Achatar a matriz)",
                variables: "int[][] mat, int[] vetor, int k",
                scenario: "Flattening de Matriz.",
                expectedPatterns: ["new int\\[4\\]", "int k\\s*=\\s*0", "for", "for", "vetor\\[k\\]\\s*=\\s*mat\\[i\\]\\[j\\]", "k\\+\\+"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    int[] vetor = new int[4];\n    int k = 0;\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        vetor[k] = mat[i][j];\n        k++;\n      }\n    }\n  }\n}",
                explanation: "Usamos um índice independente (k) para o vetor 1D, que cresce a cada atribuição.",
                hints: ["Crie int k = 0; fora dos laços.", "Dentro, faça vetor[k] = mat[i][j]; k++;"]
            },
            {
                id: 25,
                instruction: "Inverta o SINAL de todos os números positivos na matriz {{1, -2}, {3, 4}}.",
                variables: "int[][] mat",
                scenario: "Inversão de Valores Escalares.",
                expectedPatterns: ["for", "for", "if", "mat\\[i\\]\\[j\\]\\s*>\\s*0", "mat\\[i\\]\\[j\\]\\s*\\*=\\s*-1"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, -2}, {3, 4}};\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        if(mat[i][j] > 0) {\n          mat[i][j] *= -1;\n        }\n      }\n    }\n  }\n}",
                explanation: "Multiplicar um valor por -1 inverte o seu sinal matemático.",
                hints: ["Teste se o valor é maior que 0.", "Se sim, mat[i][j] = mat[i][j] * -1;"]
            },
            {
                id: 26,
                instruction: "Substitua toda a primeira linha de {{0, 0}, {0, 0}} por números 5.",
                variables: "int[][] mat",
                scenario: "Escrita Rápida por Linha.",
                expectedPatterns: ["for", "mat\\[0\\]\\[j\\]\\s*=\\s*5"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{0, 0}, {0, 0}};\n    for(int j=0; j<mat[0].length; j++) {\n      mat[0][j] = 5;\n    }\n  }\n}",
                explanation: "Um único laço é suficiente, pois a linha (0) já é conhecida e fixa.",
                hints: ["Use apenas o for do j.", "Atribua mat[0][j] = 5;"]
            },
            {
                id: 27,
                instruction: "Some APENAS os valores PARES da matriz {{1, 2}, {3, 4}} e imprima.",
                variables: "int[][] mat, int soma",
                scenario: "Soma com Condição Específica.",
                expectedPatterns: ["int soma\\s*=\\s*0", "for", "for", "if", "%\\s*2\\s*==\\s*0", "soma\\s*\\+=\\s*mat\\[i\\]\\[j\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    int soma = 0;\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        if(mat[i][j] % 2 == 0) {\n          soma += mat[i][j];\n        }\n      }\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "A variável soma só é atualizada se a condição do 'if' (módulo 2 == 0) for atendida.",
                hints: ["O if fica dentro do segundo for.", "A condição é mat[i][j] % 2 == 0."]
            },
            {
                id: 28,
                instruction: "Verifique qual linha de {{10, 5}, {20, 30}} tem a MAIOR soma e imprima essa soma.",
                variables: "int[][] mat, int somaLinha, int maiorSoma",
                scenario: "Redução Avançada por Linha.",
                expectedPatterns: ["int maiorSoma", "for", "int somaLinha\\s*=\\s*0", "for", "somaLinha\\s*\\+=\\s*mat\\[i\\]\\[j\\]", "if", "somaLinha\\s*>\\s*maiorSoma"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{10, 5}, {20, 30}};\n    int maiorSoma = 0;\n    for(int i=0; i<mat.length; i++) {\n      int somaLinha = 0;\n      for(int j=0; j<mat[i].length; j++) {\n        somaLinha += mat[i][j];\n      }\n      if(somaLinha > maiorSoma) {\n        maiorSoma = somaLinha;\n      }\n    }\n    System.out.println(maiorSoma);\n  }\n}",
                explanation: "Zeramos a 'somaLinha' no início de cada linha (primeiro for). Depois do laço interno, testamos o recorde.",
                hints: ["A variável 'somaLinha' deve ser declarada como = 0 logo após o primeiro for.", "Compare com 'maiorSoma' após o for do j."]
            },
            {
                id: 29,
                instruction: "Dado A={{1,2}}, B={{1,2}}, crie C e some as duas matrizes: C[i][j] = A[i][j] + B[i][j].",
                variables: "int[][] a, int[][] b, int[][] c",
                scenario: "Soma de Matrizes (Álgebra).",
                expectedPatterns: ["new int\\[1\\]\\[2\\]", "for", "for", "c\\[i\\]\\[j\\]\\s*=\\s*a\\[i\\]\\[j\\]\\s*\\+\\s*b\\[i\\]\\[j\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] a = {{1, 2}};\n    int[][] b = {{1, 2}};\n    int[][] c = new int[1][2];\n    for(int i=0; i<a.length; i++) {\n      for(int j=0; j<a[i].length; j++) {\n        c[i][j] = a[i][j] + b[i][j];\n      }\n    }\n  }\n}",
                explanation: "Como as matrizes têm a mesma dimensão, iteramos simultaneamente somando os valores em C.",
                hints: ["Matriz C precisa ser 1x2 (new int[1][2]).", "Atribua a soma na matriz C."]
            },
            {
                id: 30,
                instruction: "Imprima TODA a matriz {{1, 2}, {3, 4}} no formato tabular. (Dica: print no 'j', println fora do 'j').",
                variables: "int[][] mat",
                scenario: "Apresentação Visual Tabular.",
                expectedPatterns: ["for", "for", "System\\.out\\.print\\(", "System\\.out\\.println\\(\\)"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[][] mat = {{1, 2}, {3, 4}};\n    for(int i=0; i<mat.length; i++) {\n      for(int j=0; j<mat[i].length; j++) {\n        System.out.print(mat[i][j] + \" \");\n      }\n      System.out.println();\n    }\n  }\n}",
                explanation: "System.out.print() não quebra a linha, mantendo os itens na mesma horizontal. O println() vazio faz a quebra para a próxima linha.",
                hints: ["Use System.out.print(mat[i][j] + \" \"); dentro do segundo for.", "Coloque um System.out.println(); logo APÓS o segundo for."]
            },

            // --- BLOCO 3: ARRAYLIST - FUNDAMENTOS E MÉTODOS NATIVOS (31 a 50) ---
            {
                id: 31,
                instruction: "Importe e instancie um ArrayList de Inteiros vazio. Adicione o número 10 e imprima-o.",
                variables: "ArrayList<Integer> lista",
                scenario: "Introdução à Lista Dinâmica.",
                expectedPatterns: ["import\\s+java\\.util\\.ArrayList", "ArrayList<Integer>", "new ArrayList<>", "add\\(10\\)", "System\\.out\\.print", "get\\(0\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(10);\n    System.out.println(lista.get(0));\n  }\n}",
                explanation: "ArrayLists necessitam de classes Wrapper como 'Integer', não aceitam tipos primitivos (int).",
                hints: ["A importação é java.util.ArrayList;", "Acesso aos elementos é feito por lista.get(0) e não colchetes."]
            },
            {
                id: 32,
                instruction: "Instancie um ArrayList de Strings. Adicione 'Java' e 'Python'. Imprima o TAMANHO da lista.",
                variables: "ArrayList<String> lista",
                scenario: "Tamanho Dinâmico (.size()).",
                expectedPatterns: ["import\\s+java\\.util\\.ArrayList", "ArrayList<String>", "add\\(\"Java\"\\)", "add\\(\"Python\"\\)", "System\\.out\\.print", "size\\(\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> lista = new ArrayList<>();\n    lista.add(\"Java\");\n    lista.add(\"Python\");\n    System.out.println(lista.size());\n  }\n}",
                explanation: "Diferente de Arrays (que usam .length), listas dinâmicas utilizam o método .size().",
                hints: ["Adicione duas strings.", "Imprima lista.size()"]
            },
            {
                id: 33,
                instruction: "Adicione os números 5 e 15 num ArrayList. Remova o índice 0 e imprima a lista completa.",
                variables: "ArrayList<Integer> lista",
                scenario: "Remoção de Itens.",
                expectedPatterns: ["ArrayList<Integer>", "add\\(5\\)", "add\\(15\\)", "remove\\(0\\)", "System\\.out\\.print", "lista\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(5);\n    lista.add(15);\n    lista.remove(0);\n    System.out.println(lista);\n  }\n}",
                explanation: "Ao remover um item de um ArrayList, ele se reorganiza automaticamente, puxando o item 15 para o índice 0.",
                hints: ["Use lista.remove(0);", "Dar print direto na 'lista' imprime no formato [15]."]
            },
            {
                id: 34,
                instruction: "Crie um ArrayList com 'A', 'B'. Use o método set() para trocar 'A' por 'Z'. Imprima.",
                variables: "ArrayList<String> lista",
                scenario: "Atualização (Update) Dinâmico.",
                expectedPatterns: ["ArrayList<String>", "add\\(\"A\"\\)", "add\\(\"B\"\\)", "set\\(0,\\s*\"Z\"\\)", "System\\.out\\.print"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> lista = new ArrayList<>();\n    lista.add(\"A\");\n    lista.add(\"B\");\n    lista.set(0, \"Z\");\n    System.out.println(lista);\n  }\n}",
                explanation: "O método .set(indice, valor) substitui o dado que está naquela posição específica.",
                hints: ["O índice 0 guarda o 'A'.", "Use lista.set(0, \"Z\");"]
            },
            {
                id: 35,
                instruction: "Crie um ArrayList com 10 e 20. Use o método .clear() para esvaziar a lista e imprima o tamanho (0).",
                variables: "ArrayList<Integer> lista",
                scenario: "Limpeza Total de Lista.",
                expectedPatterns: ["ArrayList<Integer>", "add\\(10\\)", "add\\(20\\)", "clear\\(\\)", "System\\.out\\.print", "size\\(\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(10);\n    lista.add(20);\n    lista.clear();\n    System.out.println(lista.size());\n  }\n}",
                explanation: "O método .clear() remove tudo da memória da lista de uma só vez.",
                hints: ["Chame lista.clear();", "Imprima o lista.size()"]
            },
            {
                id: 36,
                instruction: "Crie um ArrayList com 'Maria'. Verifique se contém 'Joao' usando o método .contains() e imprima o booleano.",
                variables: "ArrayList<String> lista",
                scenario: "Busca Rápida de Existência.",
                expectedPatterns: ["ArrayList<String>", "add\\(\"Maria\"\\)", "contains\\(\"Joao\"\\)", "System\\.out\\.print"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> lista = new ArrayList<>();\n    lista.add(\"Maria\");\n    System.out.println(lista.contains(\"Joao\"));\n  }\n}",
                explanation: "O .contains() varre a lista e retorna verdadeiro ou falso (boolean).",
                hints: ["Basta colocar lista.contains(\"Joao\") dentro do print."]
            },
            {
                id: 37,
                instruction: "Adicione 'Pera', 'Uva', 'Maca'. Imprima em qual ÍNDICE a 'Uva' está usando o .indexOf().",
                variables: "ArrayList<String> frutas",
                scenario: "Pesquisa por Índice (IndexOf).",
                expectedPatterns: ["ArrayList<String>", "add", "indexOf\\(\"Uva\"\\)", "System\\.out\\.print"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> frutas = new ArrayList<>();\n    frutas.add(\"Pera\");\n    frutas.add(\"Uva\");\n    frutas.add(\"Maca\");\n    System.out.println(frutas.indexOf(\"Uva\"));\n  }\n}",
                explanation: "O método indexOf() retorna o número exato da 'gaveta' onde o elemento se encontra, ou -1 se não existir.",
                hints: ["Use frutas.indexOf(\"Uva\") dentro do print."]
            },
            {
                id: 38,
                instruction: "Use um Scanner para ler 3 números inteiros e adicioná-los a um ArrayList.",
                variables: "Scanner sc, ArrayList<Integer> num, int i",
                scenario: "Preenchimento Automatizado em Lista.",
                expectedPatterns: ["Scanner", "ArrayList<Integer>", "for", "i\\s*<\\s*3", "add\\(sc\\.nextInt\\(\\)\\)"],
                expectedExample: "import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    ArrayList<Integer> num = new ArrayList<>();\n    for(int i=0; i<3; i++) {\n      num.add(sc.nextInt());\n    }\n  }\n}",
                explanation: "O ArrayList permite que você vá dando 'add()' diretamente em um laço for, crescendo conforme necessário.",
                hints: ["Faça um laço rodar 3 vezes.", "No laço, use lista.add(sc.nextInt());"]
            },
            {
                id: 39,
                instruction: "Com um ArrayList contendo {1, 2, 3}, use um FOR CLÁSSICO para imprimir todos os valores, um por linha.",
                variables: "ArrayList<Integer> lista, int i",
                scenario: "Varredura Clássica.",
                expectedPatterns: ["for", "i\\s*<\\s*lista\\.size\\(\\)", "System\\.out\\.print", "get\\(i\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(1); lista.add(2); lista.add(3);\n    for(int i=0; i<lista.size(); i++) {\n      System.out.println(lista.get(i));\n    }\n  }\n}",
                explanation: "Usamos i < lista.size() como condição e lista.get(i) para ler.",
                hints: ["O for vai até lista.size().", "O print é lista.get(i)."]
            },
            {
                id: 40,
                instruction: "Mesma lista {1, 2, 3}, mas agora use o FOR-EACH (for aprimorado) para imprimir os valores.",
                variables: "ArrayList<Integer> lista, Integer num",
                scenario: "Varredura For-Each (Sintaxe Moderna).",
                expectedPatterns: ["for", "Integer\\s+[a-zA-Z]+\\s*:\\s*lista", "System\\.out\\.print"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(1); lista.add(2); lista.add(3);\n    for(Integer num : lista) {\n      System.out.println(num);\n    }\n  }\n}",
                explanation: "O For-Each esconde o controle de índice. Ele pega cada elemento ('num') da lista magicamente.",
                hints: ["A sintaxe é: for (Integer num : lista) { ... }", "Imprima o 'num'."]
            },
            {
                id: 41,
                instruction: "Num ArrayList com 10 e 20, use um laço para SOMAR os itens e imprimir.",
                variables: "ArrayList<Integer> lista, int soma",
                scenario: "Matemática com ArrayLists.",
                expectedPatterns: ["ArrayList<Integer>", "int soma\\s*=\\s*0", "for", "soma\\s*\\+=\\s*", "System\\.out\\.print"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(10); lista.add(20);\n    int soma = 0;\n    for(Integer num : lista) {\n      soma += num;\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "Funciona igual a um array padrão, extraindo o número e acumulando na variável.",
                hints: ["Declare soma = 0;", "Some os itens extraídos da lista."]
            },
            {
                id: 42,
                instruction: "Crie um ArrayList {10, 50, 30}. Descubra o MAIOR NÚMERO com um laço e o imprima.",
                variables: "ArrayList<Integer> lista, int maior",
                scenario: "Busca de Máximo em Coleções.",
                expectedPatterns: ["int maior", "get\\(0\\)", "for", "if", ">\\s*maior", "maior\\s*="],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(10); lista.add(50); lista.add(30);\n    int maior = lista.get(0);\n    for(Integer num : lista) {\n      if(num > maior) { maior = num; }\n    }\n    System.out.println(maior);\n  }\n}",
                explanation: "A lógica de maior/menor é a mesma, mas inicializamos a variável com lista.get(0).",
                hints: ["maior = lista.get(0);", "No laço: if(num > maior) { maior = num; }"]
            },
            {
                id: 43,
                instruction: "Filtro: No ArrayList com {2, 5, 8, 11}, conte quantos são PARES.",
                variables: "ArrayList<Integer> lista, int pares",
                scenario: "Contagem e Filtragem.",
                expectedPatterns: ["int pares\\s*=\\s*0", "for", "if", "%\\s*2\\s*==\\s*0", "pares\\+\\+"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(2); lista.add(5); lista.add(8); lista.add(11);\n    int pares = 0;\n    for(Integer num : lista) {\n      if(num % 2 == 0) { pares++; }\n    }\n    System.out.println(pares);\n  }\n}",
                explanation: "O filtro usa o módulo (%). A lista pode ser iterada sem se preocupar com tamanhos estáticos.",
                hints: ["Condição do if: num % 2 == 0", "Incremente o contador 'pares'."]
            },
            {
                id: 44,
                instruction: "Verifique se a lista {1, 2, 3} ESTÁ VAZIA usando o método .isEmpty(). Imprima.",
                variables: "ArrayList<Integer> lista",
                scenario: "Verificação de Estado (Booleanos).",
                expectedPatterns: ["ArrayList<Integer>", "isEmpty\\(\\)", "System\\.out\\.print"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(1); lista.add(2); lista.add(3);\n    System.out.println(lista.isEmpty());\n  }\n}",
                explanation: "isEmpty() retorna true se não houver elementos (size == 0) e false caso contrário.",
                hints: ["Apenas coloque lista.isEmpty() no print."]
            },
            {
                id: 45,
                instruction: "Crie a lista A={1,2} e a lista B. Copie os elementos de A para B usando um laço.",
                variables: "ArrayList<Integer> a, ArrayList<Integer> b",
                scenario: "Clonagem Elemento a Elemento.",
                expectedPatterns: ["ArrayList<Integer>", "for", "b\\.add\\("],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> a = new ArrayList<>();\n    a.add(1); a.add(2);\n    ArrayList<Integer> b = new ArrayList<>();\n    for(Integer n : a) {\n      b.add(n);\n    }\n  }\n}",
                explanation: "Iterar e adicionar na nova lista garante independência de memória sem truques avançados.",
                hints: ["Itere 'a' com for-each.", "Faça b.add(n);"]
            },
            {
                id: 46,
                instruction: "Leia palavras com Scanner até digitar 'FIM'. Salve-as num ArrayList de Strings.",
                variables: "Scanner sc, ArrayList<String> palavras, String lido",
                scenario: "Tamanho Desconhecido (Poder real do ArrayList).",
                expectedPatterns: ["Scanner", "ArrayList<String>", "while", "!lido\\.equals\\(\"FIM\"\\)|!\\(\"FIM\"\\.equals", "add\\(lido\\)"],
                expectedExample: "import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    ArrayList<String> palavras = new ArrayList<>();\n    String lido = sc.next();\n    while(!lido.equals(\"FIM\")) {\n      palavras.add(lido);\n      lido = sc.next();\n    }\n  }\n}",
                explanation: "O ArrayList não tem tamanho fixo, então é a ferramenta perfeita para um while-loop sentinela.",
                hints: ["Use while(!lido.equals(\"FIM\")).", "Adicione a variável 'lido' na lista antes de pedir o próximo."]
            },
            {
                id: 47,
                instruction: "Em um ArrayList de notas {5, 6, 9}, adicione o bônus de +1 para cada nota. (Use .set e for normal).",
                variables: "ArrayList<Integer> notas, int i",
                scenario: "Modificação in-place com Set e For.",
                expectedPatterns: ["for", "i\\s*<\\s*notas\\.size\\(\\)", "set\\(i,", "get\\(i\\)\\s*\\+\\s*1"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> notas = new ArrayList<>();\n    notas.add(5); notas.add(6); notas.add(9);\n    for(int i=0; i<notas.size(); i++) {\n      notas.set(i, notas.get(i) + 1);\n    }\n  }\n}",
                explanation: "Precisamos do índice 'i' para usar o .set(). O for-each não serviria para modificar in-place diretamente aqui.",
                hints: ["Use o for clássico com i.", "Use notas.set(i, notas.get(i) + 1);"]
            },
            {
                id: 48,
                instruction: "Use o método add(index, elemento) para INSERIR o número 99 no MEIO de {1, 2} -> {1, 99, 2}.",
                variables: "ArrayList<Integer> lista",
                scenario: "Inserção em Índice Específico.",
                expectedPatterns: ["add\\(1\\s*,\\s*99\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(1);\n    lista.add(2);\n    lista.add(1, 99);\n    System.out.println(lista);\n  }\n}",
                explanation: "O método .add(índice, valor) empurra os itens seguintes para frente, diferente do .set() que substitui.",
                hints: ["A posição 1 é o meio (depois do índice 0).", "Use lista.add(1, 99);"]
            },
            {
                id: 49,
                instruction: "Converta um array estático est[] = {1, 2} para um ArrayList usando laço.",
                variables: "int[] est, ArrayList<Integer> din",
                scenario: "Ponte Array -> ArrayList.",
                expectedPatterns: ["int\\[\\]", "ArrayList<Integer>", "for", "din\\.add\\("],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    int[] est = {1, 2};\n    ArrayList<Integer> din = new ArrayList<>();\n    for(int i=0; i<est.length; i++) {\n      din.add(est[i]);\n    }\n  }\n}",
                explanation: "Percorremos o array primitivo inteiro adicionando um a um na coleção da lista.",
                hints: ["Faça um for no est.length.", "dentro faça din.add(est[i]);"]
            },
            {
                id: 50,
                instruction: "Imprima a lista {1, 2, 3} de TRÁS PRA FRENTE. (Use o for clássico do .size() - 1 até 0).",
                variables: "ArrayList<Integer> lista, int i",
                scenario: "Varredura Reversa em ArrayList.",
                expectedPatterns: ["for", "lista\\.size\\(\\)\\s*-\\s*1", "i\\s*>=\\s*0", "i--", "get\\(i\\)"],
                expectedExample: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(1); lista.add(2); lista.add(3);\n    for(int i = lista.size() - 1; i >= 0; i--) {\n      System.out.println(lista.get(i));\n    }\n  }\n}",
                explanation: "A última posição válida é lista.size() - 1. Decrementamos até a gaveta 0.",
                hints: ["A lógica do for é: int i = lista.size() - 1; i >= 0; i--", "Imprima lista.get(i)."]
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

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
            await typeWriter(`Carregando Desafio de Lógica Avançada ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(`[Foco] ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Treinamento de Matrizes e ArrayList finalizado. Compilando relatório PDF...", "log-info");
            }
        };

        const requestHint = () => {
            if (hintsUsed.value < maxHints && !roundOver.value && !isTyping.value) {
                const hintText = currentQuestion.value.hints[hintsUsed.value];
                hintsUsed.value++;
                feedbackType.value = "info";
                feedbackMsg.value = `<i class='bi bi-lightbulb-fill'></i> <strong>Dica ${hintsUsed.value}:</strong> ${hintText}`;
                addLog(`[Ajuda] Dica solicitada pelo desenvolvedor (${hintsUsed.value}/${maxHints}).`, "log-info");
            }
        };

        const submitCode = () => {
            if (isTyping.value || roundOver.value) return;

            const code = userCode.value;
            if (!code.trim()) {
                feedbackType.value = "warning";
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> A IDE está vazia. Escreva seu algoritmo incluindo a estrutura base e importe bibliotecas, se necessário.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Algoritmo validado com sucesso! Código limpo e logicamente coerente.";
                addLog(`[Success] Lógica confirmada no Módulo ${currentQuestion.value.id}.`, "log-success");
                roundOver.value = true; // Exibirá a explicação e a solução padrão no HTML
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Limite de tentativas alcançado. Verifique se importou a biblioteca (Scanner/ArrayList) e estruturou os loops corretamente.`;
                    addLog(`[Falha] Abortando compilação no desafio atual. Avançando...`, "log-error");
                    roundOver.value = true; // Também exibirá explicação para estudo em caso de erro
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Encontramos falhas lógicas ou de sintaxe. Certifique-se do controle de dimensões de Arrays ou Métodos do ArrayList. Tentativa ${attempts.value}/${maxAttempts}`;
                    addLog(`[Erro] Warning na tentativa ${attempts.value}.`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Domínio excepcional em coleções multivariáveis e estruturas de dados dinâmicas.";
            if (score.value < 40) performanceMsg = "Ótimo empenho. Vale dar uma revisada rápida em varredura de Matrizes com for duplo e nos métodos nativos de ArrayList.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório Analítico - JAVA.LOGIC 3.0</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Matrizes (2D) e ArrayLists Dinâmicos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Análise:</strong> ${data}</p>
                    <p>Este atestado certifica a prática em ${questions.value.length} algoritmos focados puramente em lógica de programação estruturada, cobrindo o instanciamento, acesso e varredura de matrizes e as principais operações nativas do framework de collections (ArrayList), sem intervenção de conceitos Orientados a Objeto.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Algorítmico</h3>
                        <p style="font-size: 28px; color: ${score.value >= 40 ? '#5C8069' : (score.value >= 25 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Missões Resolvidas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Assinado Eletronicamente por JAVA.LOGIC 3.0 System.
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Java_Matrizes_ArrayList_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando ambiente. Preparando Matrizes e Importações...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Iniciando Módulo 3.0: Array Multidimensional (2D) & Collections (ArrayList)...", "log-info");
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