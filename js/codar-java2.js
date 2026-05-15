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

        // 50 Exercícios (I/O, while, do-while, for, arrays) com boilerplate completo
        const questions = ref([
            // --- BLOCO 1: I/O BÁSICO (1 a 5) ---
            {
                id: 1,
                instruction: "Leia um número inteiro digitado pelo usuário e imprima-o.",
                variables: "Scanner sc, int num",
                scenario: "I/O Básico: Capturando e exibindo o valor.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int num = sc.nextInt();\n    System.out.println(num);\n  }\n}",
                explanation: "Todo programa Java precisa da classe e do método main. O Scanner precisa ser importado da biblioteca java.util.",
                hints: ["Não esqueça de colocar 'import java.util.Scanner;' na primeira linha.", "Crie a 'public class Main' e o 'public static void main(String[] args)'."]
            },
            {
                id: 2,
                instruction: "Leia dois números inteiros, subtraia o segundo do primeiro e imprima.",
                variables: "Scanner sc, int n1, int n2, int sub",
                scenario: "Operações Matemáticas Básicas.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "-", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n1 = sc.nextInt();\n    int n2 = sc.nextInt();\n    int sub = n1 - n2;\n    System.out.println(sub);\n  }\n}",
                explanation: "Após instanciar o Scanner, lemos as duas variáveis e aplicamos o operador matemático de subtração (-).",
                hints: ["Lembre-se da estrutura base: import, class, main.", "A operação será n1 - n2 dentro do main."]
            },
            {
                id: 3,
                instruction: "Leia um número decimal (double) e multiplique por 2.",
                variables: "Scanner sc, double valor",
                scenario: "Lidando com números decimais.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextDouble", "\\*", "2", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    double valor = sc.nextDouble();\n    System.out.println(valor * 2);\n  }\n}",
                explanation: "O método para ler decimais é nextDouble().",
                hints: ["Use sc.nextDouble() ao invés de nextInt().", "Multiplique a variável por 2 dentro do print."]
            },
            {
                id: 4,
                instruction: "Leia o nome do usuário e imprima 'Olá, [nome]'.",
                variables: "Scanner sc, String nome",
                scenario: "Manipulação de Strings simples.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "next", "System\\.out\\.print", "\\+"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String nome = sc.next();\n    System.out.println(\"Olá, \" + nome);\n  }\n}",
                explanation: "Strings são lidas com o método next() ou nextLine().",
                hints: ["Faça a concatenação com o símbolo '+' no println.", "Sempre coloque o código dentro do public static void main."]
            },
            {
                id: 5,
                instruction: "Leia a idade. Imprima 'Adulto' se for >= 18, senão 'Jovem'.",
                variables: "Scanner sc, int idade",
                scenario: "Condicionais Simples.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "if", ">=", "18", "else", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int idade = sc.nextInt();\n    if(idade >= 18) {\n      System.out.println(\"Adulto\");\n    } else {\n      System.out.println(\"Jovem\");\n    }\n  }\n}",
                explanation: "O bloco if/else avalia a expressão booleana e desvia o fluxo do programa.",
                hints: ["O if testa (idade >= 18)", "Use System.out.println para ambas as mensagens."]
            },
            // --- BLOCO 2: LAÇO WHILE (6 a 15) ---
            {
                id: 6,
                instruction: "Use um laço 'while' para imprimir os números de 1 a 5.",
                variables: "int i",
                scenario: "Introdução ao Laço While.",
                expectedPatterns: ["class", "main", "while", "<=", "5", "i\\+\\+", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int i = 1;\n    while (i <= 5) {\n      System.out.println(i);\n      i++;\n    }\n  }\n}",
                explanation: "O laço while testa a condição antes de executar. O i++ garante que o laço não seja infinito. Como não há entrada de usuário, não precisamos do Scanner.",
                hints: ["Inicie a variável com 1", "A condição é (i <= 5) e não esqueça do i++ dentro do bloco."]
            },
            {
                id: 7,
                instruction: "Leia números em um laço 'while'. Pare apenas quando o usuário digitar 0.",
                variables: "Scanner sc, int num",
                scenario: "A estrutura de repetição com sentinela.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "while", "!=", "0"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int num = sc.nextInt();\n    while (num != 0) {\n      num = sc.nextInt();\n    }\n  }\n}",
                explanation: "O número 0 age como sentinela de parada.",
                hints: ["Leia o primeiro número fora do laço.", "A condição é (num != 0). Dentro do laço, leia o próximo número."]
            },
            {
                id: 8,
                instruction: "Leia números com 'while' até ser digitado um negativo. Some todos os positivos digitados.",
                variables: "Scanner sc, int num, int soma",
                scenario: "Acumulador dentro de um While.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "while", ">=", "0", "soma\\s*\\+=", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int num = sc.nextInt();\n    int soma = 0;\n    while(num >= 0) {\n      soma += num;\n      num = sc.nextInt();\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "A condição (num >= 0) mantém o laço. A soma acumula antes da próxima leitura.",
                hints: ["A condição de continuação é num >= 0", "Some o valor na variável 'soma' e depois leia o próximo."]
            },
            {
                id: 9,
                instruction: "Use um 'while' para imprimir todos os números PARES de 2 a 10.",
                variables: "int i",
                scenario: "Controle de incremento no While.",
                expectedPatterns: ["class", "main", "while", "<=", "10", "i\\s*\\+=\\s*2", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int i = 2;\n    while (i <= 10) {\n      System.out.println(i);\n      i += 2;\n    }\n  }\n}",
                explanation: "O incremento i += 2 pula os números ímpares automaticamente.",
                hints: ["Comece i com 2.", "Ao invés de i++, use i += 2 para pular de dois em dois."]
            },
            {
                id: 10,
                instruction: "Simule uma senha. Leia a senha (inteiro) até que seja 1234.",
                variables: "Scanner sc, int senha",
                scenario: "Validação de autenticação.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "while", "!=", "1234"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int senha = sc.nextInt();\n    while(senha != 1234) {\n      senha = sc.nextInt();\n    }\n  }\n}",
                explanation: "O laço persiste enquanto a senha não coincidir com a esperada.",
                hints: ["A condição do while é (senha != 1234)", "Se errar, o laço roda e pede a senha novamente."]
            },
            {
                id: 11,
                instruction: "Crie um 'while' que leia palavras até o usuário digitar 'sair'.",
                variables: "Scanner sc, String texto",
                scenario: "Strings como sentinela.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "next", "while", "!texto\\.equals", "sair"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String texto = sc.next();\n    while(!texto.equals(\"sair\")) {\n      texto = sc.next();\n    }\n  }\n}",
                explanation: "Para Strings, usamos .equals() e não o operador ==.",
                hints: ["Lembre-se de usar texto.equals(\"sair\") para comparar.", "A condição é negada com o símbolo '!': !texto.equals(\"sair\")"]
            },
            {
                id: 12,
                instruction: "Inicie uma variável com 1. Use 'while' para multiplicá-la por 2 até que passe de 100. Imprima cada passo.",
                variables: "int valor",
                scenario: "Crescimento exponencial básico.",
                expectedPatterns: ["class", "main", "while", "<=", "100", "\\*", "2", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int valor = 1;\n    while(valor <= 100) {\n      System.out.println(valor);\n      valor = valor * 2;\n    }\n  }\n}",
                explanation: "O valor cresce rapidamente: 1, 2, 4, 8, 16...",
                hints: ["A condição é (valor <= 100)", "Dentro do laço, atualize o valor: valor = valor * 2"]
            },
            {
                id: 13,
                instruction: "Faça uma contagem regressiva de 10 até 1 usando 'while'.",
                variables: "int i",
                scenario: "Decremento.",
                expectedPatterns: ["class", "main", "while", ">=", "1", "i--", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int i = 10;\n    while (i >= 1) {\n      System.out.println(i);\n      i--;\n    }\n  }\n}",
                explanation: "Usamos i-- para subtrair 1 em cada ciclo.",
                hints: ["Comece o i valendo 10.", "A condição é i >= 1. Use i-- para diminuir."]
            },
            {
                id: 14,
                instruction: "Leia exatamente 5 números do teclado usando 'while' e um contador, imprimindo cada um.",
                variables: "Scanner sc, int cont, int num",
                scenario: "While agindo como For.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "while", "<", "5", "cont\\+\\+", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int cont = 0;\n    while(cont < 5) {\n      int num = sc.nextInt();\n      System.out.println(num);\n      cont++;\n    }\n  }\n}",
                explanation: "O while pode ser usado com um contador manual para definir execuções fixas.",
                hints: ["Crie int cont = 0; antes do laço.", "A condição é (cont < 5) e não esqueça de cont++."]
            },
            {
                id: 15,
                instruction: "Leia números até digitar 0. Guarde e imprima apenas o maior número lido.",
                variables: "Scanner sc, int num, int maior",
                scenario: "Algoritmo de Maior Elemento.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "while", "!=", "0", "if", ">", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int num = sc.nextInt();\n    int maior = num;\n    while(num != 0) {\n      if(num > maior) { maior = num; }\n      num = sc.nextInt();\n    }\n    System.out.println(maior);\n  }\n}",
                explanation: "Comparamos cada nova entrada com a variável que guarda o 'maior' valor conhecido.",
                hints: ["Crie int maior = num; logo após a primeira leitura.", "Dentro do laço, use if (num > maior) { maior = num; }"]
            },
            // --- BLOCO 3: LAÇO DO-WHILE (16 a 20) ---
            {
                id: 16,
                instruction: "Use um laço 'do-while' para imprimir de 1 a 3.",
                variables: "int i",
                scenario: "Introdução ao Do-While.",
                expectedPatterns: ["class", "main", "do", "\\{", "System\\.out\\.print", "i\\+\\+", "while", "<=", "3"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int i = 1;\n    do {\n      System.out.println(i);\n      i++;\n    } while (i <= 3);\n  }\n}",
                explanation: "No do-while, a execução ocorre pelo menos uma vez antes do teste.",
                hints: ["A sintaxe é: do { ... } while (condicao);", "Coloque o i++ dentro do bloco do."]
            },
            {
                id: 17,
                instruction: "Leia a senha com 'do-while' até ser 1234.",
                variables: "Scanner sc, int senha",
                scenario: "Validação pós-teste.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "do", "\\{", "nextInt", "while", "!=", "1234"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int senha;\n    do {\n      senha = sc.nextInt();\n    } while (senha != 1234);\n  }\n}",
                explanation: "A leitura deve ocorrer pelo menos uma vez, o do-while é perfeito aqui.",
                hints: ["Declare 'int senha;' fora do laço para ela existir no teste.", "O 'do' pede o nextInt, e o 'while' testa != 1234."]
            },
            {
                id: 18,
                instruction: "Simule um menu: Leia um número com 'do-while' até que o usuário digite 3 (Opção Sair).",
                variables: "Scanner sc, int opcao",
                scenario: "Menus de terminal.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "do", "nextInt", "while", "!=", "3"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int opcao;\n    do {\n      System.out.println(\"1-Jogar 2-Opcoes 3-Sair\");\n      opcao = sc.nextInt();\n    } while(opcao != 3);\n  }\n}",
                explanation: "O menu sempre aparece pelo menos uma vez antes de avaliar a saída.",
                hints: ["O fluxo é: mostrar menu, ler opção, testar opção.", "Condição de parada do while é (opcao != 3)."]
            },
            {
                id: 19,
                instruction: "Obrigue o usuário a digitar um número POSITIVO usando 'do-while'.",
                variables: "Scanner sc, int num",
                scenario: "Tratamento de entrada obrigatória.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "do", "nextInt", "while", "<", "0"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int num;\n    do {\n      num = sc.nextInt();\n    } while(num < 0);\n  }\n}",
                explanation: "Se ele digitar negativo, o laço obriga a repetir o pedido.",
                hints: ["O laço se repete ENQUANTO o número for inválido.", "A condição é while (num < 0)."]
            },
            {
                id: 20,
                instruction: "Leia números e some-os com 'do-while' até que a soma ultrapasse 50.",
                variables: "Scanner sc, int num, int soma",
                scenario: "Teste de limite acumulativo.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "do", "nextInt", "soma\\s*\\+=", "while", "<=", "50"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int soma = 0;\n    do {\n      int num = sc.nextInt();\n      soma += num;\n    } while(soma <= 50);\n    System.out.println(soma);\n  }\n}",
                explanation: "A verificação ocorre na variável que acumula o valor.",
                hints: ["O acumulador 'soma' deve ser declarado fora do laço.", "A condição de repetição é (soma <= 50)."]
            },
            // --- BLOCO 4: LAÇO FOR (21 a 30) ---
            {
                id: 21,
                instruction: "Use um laço 'for' para imprimir de 1 a 10.",
                variables: "int i",
                scenario: "Introdução ao laço For.",
                expectedPatterns: ["class", "main", "for", "int i", "<=", "10", "i\\+\\+", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 10; i++) {\n      System.out.println(i);\n    }\n  }\n}",
                explanation: "O laço for condensa inicialização, teste e incremento numa única linha.",
                hints: ["A sintaxe é for(int i=1; i<=10; i++)", "Tudo fica na mesma linha de declaração."]
            },
            {
                id: 22,
                instruction: "Use um laço 'for' para contagem regressiva de 10 a 1.",
                variables: "int i",
                scenario: "For decrementando.",
                expectedPatterns: ["class", "main", "for", "int i\\s*=\\s*10", ">=", "1", "i--", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    for (int i = 10; i >= 1; i--) {\n      System.out.println(i);\n    }\n  }\n}",
                explanation: "Trocamos o i++ por i-- e o limite lógico.",
                hints: ["Inicie com i = 10.", "A condição central é i >= 1. O terceiro termo é i--."]
            },
            {
                id: 23,
                instruction: "Imprima todos os números ímpares de 1 a 20 usando um 'for' saltando de 2 em 2.",
                variables: "int i",
                scenario: "Pulos customizados no For.",
                expectedPatterns: ["class", "main", "for", "int i\\s*=\\s*1", "<=", "20", "i\\s*\\+=\\s*2", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    for(int i = 1; i <= 20; i += 2) {\n      System.out.println(i);\n    }\n  }\n}",
                explanation: "O passo do laço for pode ser modificado para i += 2.",
                hints: ["Comece no 1.", "Substitua o i++ por i += 2 para pular os pares."]
            },
            {
                id: 24,
                instruction: "Calcule e imprima a soma de todos os números de 1 a 100 usando 'for'.",
                variables: "int soma, int i",
                scenario: "Acumulação em limite conhecido.",
                expectedPatterns: ["class", "main", "int soma\\s*=\\s*0", "for", "i\\s*<=\\s*100", "soma\\s*\\+=\\s*i", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int soma = 0;\n    for(int i = 1; i <= 100; i++) {\n      soma += i;\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "O For atua como gerador de números de 1 a 100, e a variável soma os guarda.",
                hints: ["Declare soma = 0 antes do for.", "Dentro do for faça soma += i. Imprima fora do for."]
            },
            {
                id: 25,
                instruction: "Leia um número 'N' e imprima a tabuada dele de 1 a 10 usando um 'for'.",
                variables: "Scanner sc, int n, int i",
                scenario: "Tabuada Dinâmica.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "nextInt", "for", "i\\s*<=\\s*10", "\\*", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    for(int i = 1; i <= 10; i++) {\n      System.out.println(n * i);\n    }\n  }\n}",
                explanation: "A variável de entrada é multiplicada pelo iterador do for em cada passo.",
                hints: ["Leia o N antes do laço.", "O println dentro do for deve exibir n * i."]
            },
            {
                id: 26,
                instruction: "Leia exatamente 5 números e imprima a soma deles, usando um 'for'.",
                variables: "Scanner sc, int num, int soma, int i",
                scenario: "Repetição de Leitura Fixa.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "int soma", "for", "i\\s*<\\s*5", "nextInt", "soma\\s*\\+=", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int soma = 0;\n    for(int i = 0; i < 5; i++) {\n      int num = sc.nextInt();\n      soma += num;\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "O for é ideal porque sabemos exatamente que queremos ler 5 vezes.",
                hints: ["O for rodará de i = 0 até i < 5.", "O sc.nextInt() fica DENTRO do laço."]
            },
            {
                id: 27,
                instruction: "Leia 5 números inteiros. Encontre o maior e imprima-o.",
                variables: "Scanner sc, int maior, int num",
                scenario: "Algoritmo de máximo em lote.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "for", "nextInt", "if", ">", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int maior = -99999;\n    for(int i=0; i<5; i++) {\n      int num = sc.nextInt();\n      if(num > maior) { maior = num; }\n    }\n    System.out.println(maior);\n  }\n}",
                explanation: "Mantemos o recorde atualizado comparando cada entrada nova.",
                hints: ["Inicie a variável 'maior' com um número bem baixo.", "Use um if(num > maior) dentro do for."]
            },
            {
                id: 28,
                instruction: "Calcule o fatorial de 5 (5 * 4 * 3 * 2 * 1) usando um 'for' e imprima o resultado.",
                variables: "int fat, int i",
                scenario: "Produtório matemático.",
                expectedPatterns: ["class", "main", "int fat\\s*=\\s*1", "for", "fat\\s*\\*=\\s*i", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int fat = 1;\n    for(int i = 1; i <= 5; i++) {\n      fat *= i;\n    }\n    System.out.println(fat);\n  }\n}",
                explanation: "Ao invés de somar, acumulamos valores multiplicando (*=).",
                hints: ["A variável acumuladora deve começar com 1, não 0.", "O passo interno é fat = fat * i;"]
            },
            {
                id: 29,
                instruction: "Leia uma palavra e use um 'for' para imprimi-la 5 vezes.",
                variables: "Scanner sc, String palavra, int i",
                scenario: "Repetição Simples.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "next", "for", "i\\s*<\\s*5", "System\\.out\\.print"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String p = sc.next();\n    for(int i=0; i<5; i++) {\n      System.out.println(p);\n    }\n  }\n}",
                explanation: "O iterador i não é usado na exibição, apenas para contar os giros do laço.",
                hints: ["O sc.next() fica ANTES do laço.", "O System.out.println(palavra) fica DENTRO do laço."]
            },
            {
                id: 30,
                instruction: "Use um 'for' para imprimir a sequência de múltiplos de 3: 3, 6, 9, 12, 15.",
                variables: "int i",
                scenario: "Sequências Numéricas.",
                expectedPatterns: ["class", "main", "for", "i\\s*\\+=\\s*3", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    for(int i = 3; i <= 15; i += 3) {\n      System.out.println(i);\n    }\n  }\n}",
                explanation: "Começando o laço no 3 e somando 3 em cada passo temos a sequência desejada.",
                hints: ["Inicie o i em 3.", "Faça a condição ir até <= 15, e o incremento ser i += 3."]
            },
            // --- BLOCO 5: ARRAYS E VETORES (31 a 50) ---
            {
                id: 31,
                instruction: "Declare um Array de inteiros de tamanho 5. Coloque o número 10 na primeira posição [0] e imprima-o.",
                variables: "int[] vetor",
                scenario: "Apresentação a Arrays.",
                expectedPatterns: ["class", "main", "int\\[\\]", "new int\\[5\\]", "\\[0\\]\\s*=\\s*10", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = new int[5];\n    vetor[0] = 10;\n    System.out.println(vetor[0]);\n  }\n}",
                explanation: "Arrays são estantes de dados. A primeira gaveta é sempre o índice [0].",
                hints: ["A criação é: int[] vetor = new int[5];", "Acesse com vetor[0]."]
            },
            {
                id: 32,
                instruction: "Declare um Array de inteiros com os valores iniciais {2, 4, 6}. Imprima o valor da posição [1].",
                variables: "int[] vetor",
                scenario: "Inicialização Direta.",
                expectedPatterns: ["class", "main", "int\\[\\]", "\\{", "2", "4", "6", "\\}", "System\\.out\\.print", "\\[1\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {2, 4, 6};\n    System.out.println(vetor[1]);\n  }\n}",
                explanation: "O índice 1 corresponde ao segundo elemento (o número 4).",
                hints: ["A sintaxe curta é int[] vetor = {2, 4, 6};", "Imprima vetor[1]."]
            },
            {
                id: 33,
                instruction: "Crie um Array tamanho 3. Preencha com Scanner as posições [0], [1] e [2] manualmente.",
                variables: "Scanner sc, int[] vetor",
                scenario: "I/O manual no Array.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "new int\\[3\\]", "nextInt", "\\[0\\]", "\\[1\\]", "\\[2\\]"],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[] vetor = new int[3];\n    vetor[0] = sc.nextInt();\n    vetor[1] = sc.nextInt();\n    vetor[2] = sc.nextInt();\n  }\n}",
                explanation: "Podemos ler valores e atribuir diretamente a um índice específico.",
                hints: ["Crie o array com new int[3].", "Use vetor[0] = sc.nextInt(); para cada índice."]
            },
            {
                id: 34,
                instruction: "Crie um Array {10, 20, 30, 40}. Imprima o TAMANHO total dele usando o atributo '.length'.",
                variables: "int[] vetor",
                scenario: "O atributo length.",
                expectedPatterns: ["class", "main", "int\\[\\]", "\\{", "length", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {10, 20, 30, 40};\n    System.out.println(vetor.length);\n  }\n}",
                explanation: "O .length nos diz quantas posições o array possui.",
                hints: ["Crie a variável int[] vetor = {10, 20, 30, 40};", "Imprima vetor.length sem parênteses no length."]
            },
            {
                id: 35,
                instruction: "Use um laço 'for' para imprimir TODOS os elementos do Array {5, 10, 15}.",
                variables: "int[] vetor, int i",
                scenario: "Varredura clássica.",
                expectedPatterns: ["class", "main", "int\\[\\]", "for", "length|<\\s*3", "\\[i\\]", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {5, 10, 15};\n    for(int i=0; i<vetor.length; i++) {\n      System.out.println(vetor[i]);\n    }\n  }\n}",
                explanation: "O laço for percorre perfeitamente os índices do array, de 0 até length-1.",
                hints: ["A condição do for deve ser i < vetor.length", "Imprima vetor[i]"]
            },
            {
                id: 36,
                instruction: "Crie um Array tamanho 5. Use um 'for' e um Scanner para preencher cada posição.",
                variables: "Scanner sc, int[] vetor, int i",
                scenario: "Entrada automatizada no Array.",
                expectedPatterns: ["import\\s+java\\.util\\.Scanner", "class", "main", "Scanner", "new int\\[5\\]", "for", "nextInt", "\\[i\\]\\s*="],
                expectedExample: "import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int[] vetor = new int[5];\n    for(int i=0; i<vetor.length; i++) {\n      vetor[i] = sc.nextInt();\n    }\n  }\n}",
                explanation: "Não precisamos repetir o sc.nextInt() manualmente.",
                hints: ["Use vetor[i] = sc.nextInt(); dentro do laço for.", "O for vai de 0 até 4 (i < 5)."]
            },
            {
                id: 37,
                instruction: "Dado o Array {2, 4, 6, 8}, use um 'for' para SOMAR todos os valores e imprimir a soma.",
                variables: "int[] vetor, int soma, int i",
                scenario: "Matemática em lote.",
                expectedPatterns: ["class", "main", "int\\[\\]", "soma\\s*=\\s*0", "for", "soma\\s*\\+=\\s*vetor\\[i\\]", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {2, 4, 6, 8};\n    int soma = 0;\n    for(int i=0; i<vetor.length; i++) {\n      soma += vetor[i];\n    }\n    System.out.println(soma);\n  }\n}",
                explanation: "A variável soma vai acumulando o valor que está em cada 'gaveta' visitada.",
                hints: ["Declare soma = 0 antes do for.", "A operação interna é soma += vetor[i];"]
            },
            {
                id: 38,
                instruction: "Percorra o Array {10, 50, 30, 20} com um 'for' para encontrar e imprimir o MAIOR número.",
                variables: "int[] vetor, int maior, int i",
                scenario: "Algoritmo de Busca de Máximo em Array.",
                expectedPatterns: ["class", "main", "int\\[\\]", "int maior", "for", "if", "vetor\\[i\\]\\s*>", "maior\\s*=\\s*vetor\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {10, 50, 30, 20};\n    int maior = vetor[0];\n    for(int i=1; i<vetor.length; i++) {\n      if(vetor[i] > maior) {\n        maior = vetor[i];\n      }\n    }\n    System.out.println(maior);\n  }\n}",
                explanation: "Assumimos que o índice [0] é o maior inicial e testamos os demais.",
                hints: ["Comece dizendo que int maior = vetor[0];", "Se vetor[i] for maior que 'maior', substitua o 'maior'."]
            },
            {
                id: 39,
                instruction: "Semelhante ao anterior: Encontre o MENOR número do Array {15, 8, 20, 3} e imprima.",
                variables: "int[] vetor, int menor, int i",
                scenario: "Algoritmo de Busca de Mínimo em Array.",
                expectedPatterns: ["class", "main", "int\\[\\]", "int menor", "for", "if", "vetor\\[i\\]\\s*<", "menor\\s*=\\s*vetor\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {15, 8, 20, 3};\n    int menor = vetor[0];\n    for(int i=1; i<vetor.length; i++) {\n      if(vetor[i] < menor) {\n        menor = vetor[i];\n      }\n    }\n    System.out.println(menor);\n  }\n}",
                explanation: "A lógica inverte: testamos quem é menor que o nosso registro atual.",
                hints: ["Teste if (vetor[i] < menor).", "Imprima a variável menor no final."]
            },
            {
                id: 40,
                instruction: "Conte quantos números PARES existem no Array {1, 2, 3, 4, 5, 6} e imprima a quantidade.",
                variables: "int[] vetor, int pares, int i",
                scenario: "Filtros lógicos em Arrays.",
                expectedPatterns: ["class", "main", "int\\[\\]", "int pares\\s*=\\s*0", "for", "if", "%\\s*2\\s*==\\s*0", "pares\\+\\+"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {1, 2, 3, 4, 5, 6};\n    int pares = 0;\n    for(int i=0; i<vetor.length; i++) {\n      if(vetor[i] % 2 == 0) {\n        pares++;\n      }\n    }\n    System.out.println(pares);\n  }\n}",
                explanation: "Ao invés de somar os números, apenas incrementamos um contador caso sejam pares.",
                hints: ["Crie int pares = 0;", "Use if(vetor[i] % 2 == 0) e, caso seja, faça pares++;"]
            },
            {
                id: 41,
                instruction: "Use um 'for' para imprimir o Array {1, 2, 3} na ordem INVERSA (3, 2, 1).",
                variables: "int[] vetor, int i",
                scenario: "Varredura Reversa.",
                expectedPatterns: ["class", "main", "for", "i\\s*=\\s*2|vetor\\.length\\s*-\\s*1", "i\\s*>=\\s*0", "i--", "System\\.out\\.print", "vetor\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {1, 2, 3};\n    for(int i = vetor.length - 1; i >= 0; i--) {\n      System.out.println(vetor[i]);\n    }\n  }\n}",
                explanation: "O laço for deve iniciar no último índice e decrementar até o índice 0.",
                hints: ["O índice final do array é sempre length - 1.", "A condição é i >= 0 e o passe é i--."]
            },
            {
                id: 42,
                instruction: "Dado Array {5, 10, 15}, verifique se o número 10 existe nele. Imprima 'Achou' se existir.",
                variables: "int[] vetor, int i",
                scenario: "Busca Simples (Linear Search).",
                expectedPatterns: ["class", "main", "for", "if", "vetor\\[i\\]\\s*==\\s*10", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {5, 10, 15};\n    for(int i=0; i<vetor.length; i++) {\n      if(vetor[i] == 10) {\n        System.out.println(\"Achou\");\n      }\n    }\n  }\n}",
                explanation: "Percorremos todo o array testando um a um se o elemento procurado é igual ao índice atual.",
                hints: ["Dentro do for, coloque: if(vetor[i] == 10) { ... }"]
            },
            {
                id: 43,
                instruction: "Copie os elementos do Array {1, 2} para um Array 'novoVetor' de mesmo tamanho.",
                variables: "int[] vetor, int[] novoVetor, int i",
                scenario: "Cópia de Arrays na memória.",
                expectedPatterns: ["class", "main", "new int\\[2\\]|new int\\[vetor\\.length\\]", "for", "novoVetor\\[i\\]\\s*=\\s*vetor\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {1, 2};\n    int[] novoVetor = new int[2];\n    for(int i=0; i<vetor.length; i++) {\n      novoVetor[i] = vetor[i];\n    }\n  }\n}",
                explanation: "Atribuir novoVetor = vetor não copia, apenas aponta para o mesmo lugar. A cópia deve ser feita de gaveta para gaveta.",
                hints: ["Crie o novo array: int[] novoVetor = new int[2];", "Copie manualmente: novoVetor[i] = vetor[i]; dentro do for."]
            },
            {
                id: 44,
                instruction: "No Array {10, -5, 20, -2}, substitua todos os valores negativos por zero.",
                variables: "int[] vetor, int i",
                scenario: "Mutação de Dados em Array.",
                expectedPatterns: ["class", "main", "for", "if", "vetor\\[i\\]\\s*<\\s*0", "vetor\\[i\\]\\s*=\\s*0"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {10, -5, 20, -2};\n    for(int i=0; i<vetor.length; i++) {\n      if(vetor[i] < 0) {\n        vetor[i] = 0;\n      }\n    }\n  }\n}",
                explanation: "Podemos modificar o valor de uma gaveta se ela atender a uma condição lógica.",
                hints: ["Verifique se vetor[i] < 0.", "Em caso positivo, faça vetor[i] = 0;"]
            },
            {
                id: 45,
                instruction: "Multiplique todos os elementos do Array {2, 4, 6} por 2 dentro do próprio array.",
                variables: "int[] vetor, int i",
                scenario: "Escalonamento (Map).",
                expectedPatterns: ["class", "main", "for", "vetor\\[i\\]\\s*\\*=\\s*2|vetor\\[i\\]\\s*=\\s*vetor\\[i\\]\\s*\\*\\s*2"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {2, 4, 6};\n    for(int i=0; i<vetor.length; i++) {\n      vetor[i] = vetor[i] * 2;\n    }\n  }\n}",
                explanation: "O valor da gaveta é alterado para o valor que já existia lá vezes dois.",
                hints: ["No laço for, escreva: vetor[i] = vetor[i] * 2;"]
            },
            {
                id: 46,
                instruction: "Calcule a média dos elementos do Array {4.0, 6.0, 8.0}. (São decimais)",
                variables: "double[] vetor, double soma, double media, int i",
                scenario: "Matemática Aplicada.",
                expectedPatterns: ["class", "main", "double\\[\\]", "soma\\s*\\+=", "soma\\s*/\\s*3|soma\\s*/\\s*vetor\\.length"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    double[] vetor = {4.0, 6.0, 8.0};\n    double soma = 0;\n    for(int i=0; i<vetor.length; i++) {\n      soma += vetor[i];\n    }\n    double media = soma / vetor.length;\n    System.out.println(media);\n  }\n}",
                explanation: "A média é a soma total dividida pela quantidade de elementos (length).",
                hints: ["Use arrays de 'double'.", "Some tudo com um laço e fora dele divida por vetor.length."]
            },
            {
                id: 47,
                instruction: "Sabendo que a média de {10, 20, 30} é 20, imprima os valores ACIMA da média.",
                variables: "int[] vetor, int media, int i",
                scenario: "Filtro Pós-Processamento.",
                expectedPatterns: ["class", "main", "int media\\s*=\\s*20", "for", "if", "vetor\\[i\\]\\s*>\\s*media", "System\\.out\\.print"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {10, 20, 30};\n    int media = 20;\n    for(int i=0; i<vetor.length; i++) {\n      if(vetor[i] > media) {\n        System.out.println(vetor[i]);\n      }\n    }\n  }\n}",
                explanation: "Usamos o valor calculado para filtrar o array novamente.",
                hints: ["Use if (vetor[i] > media).", "O único número a ser impresso pelo if será o 30."]
            },
            {
                id: 48,
                instruction: "Crie um Array de Strings: {\"Java\", \" \", \"é\", \" \", \"legal\"}. Concatene e imprima a frase.",
                variables: "String[] palavras, String frase, int i",
                scenario: "Arrays de Textos.",
                expectedPatterns: ["class", "main", "String\\[\\]", "frase\\s*\\+=\\s*palavras\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    String[] palavras = {\"Java\", \" \", \"é\", \" \", \"legal\"};\n    String frase = \"\";\n    for(int i=0; i<palavras.length; i++) {\n      frase += palavras[i];\n    }\n    System.out.println(frase);\n  }\n}",
                explanation: "A concatenação junta as partes guardadas em cada índice do array.",
                hints: ["A String inicial pode ser vazia: String frase = \"\";", "Use frase = frase + palavras[i];"]
            },
            {
                id: 49,
                instruction: "Dado Array {5, 10, 15}, troque de lugar os valores do primeiro e último índice (Swap).",
                variables: "int[] vetor, int aux",
                scenario: "Algoritmo básico de troca de valores.",
                expectedPatterns: ["class", "main", "int aux\\s*=\\s*vetor\\[0\\]", "vetor\\[0\\]\\s*=\\s*vetor\\[2\\]", "vetor\\[2\\]\\s*=\\s*aux"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] vetor = {5, 10, 15};\n    int aux = vetor[0];\n    vetor[0] = vetor[2];\n    vetor[2] = aux;\n  }\n}",
                explanation: "Para não perder o valor original durante a sobrescrição, precisamos de uma variável auxiliar (temp).",
                hints: ["Declare int aux = vetor[0];", "Faça vetor[0] = vetor[2]; e depois vetor[2] = aux;"]
            },
            {
                id: 50,
                instruction: "Crie ArrayA={1,2} e ArrayB={3,4}. Crie ArrayC e some índice a índice: C[i] = A[i] + B[i].",
                variables: "int[] a, int[] b, int[] c, int i",
                scenario: "Operações Paralelas com Arrays.",
                expectedPatterns: ["class", "main", "new int\\[2\\]", "for", "c\\[i\\]\\s*=\\s*a\\[i\\]\\s*\\+\\s*b\\[i\\]"],
                expectedExample: "public class Main {\n  public static void main(String[] args) {\n    int[] a = {1, 2};\n    int[] b = {3, 4};\n    int[] c = new int[2];\n    for(int i=0; i<2; i++) {\n      c[i] = a[i] + b[i];\n    }\n    System.out.println(c[0] + \" \" + c[1]);\n  }\n}",
                explanation: "Como todos os arrays têm o mesmo tamanho, um único iterador 'i' serve como chave para todos simultaneamente.",
                hints: ["O array c deve ser criado com new int[2];", "O for resolve com c[i] = a[i] + b[i];"]
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
            await typeWriter(`Carregando Missão ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(`[Situação] ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Treinamento de Laços e Arrays finalizado. Compilando relatório PDF...", "log-info");
            }
        };

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
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio. Escreva seu algoritmo completando a classe e o método main.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Algoritmo validado com sucesso! Estrutura completa do Java reconhecida.";
                addLog(`[Success] Algoritmo para a Missão ${currentQuestion.value.id} aprovado.`, "log-success");
                roundOver.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. Verifique a estrutura básica (import, class, main) e a lógica exigida.`;
                    addLog(`[Erro] Estrutura algorítmica inválida. Avançando.`, "log-error");
                    roundOver.value = true;
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Faltam estruturas obrigatórias. Verifique se declarou a 'public class', o 'main' e se a lógica está correta. Tentativa ${attempts.value}/${maxAttempts}`;
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
            
            let performanceMsg = "Mestre dos laços e manipulador de vetores excepcional.";
            if (score.value < 35) performanceMsg = "Ótimo esforço, mas recomendo revisar a declaração do main, importações, arrays e as condições dos laços while.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Treinamento - Lógica Java 2.0</h1>
                    <h2 style="color: #555; margin: 5px 0;">Laços de Repetição, Arrays 1D e Estrutura Base</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Conclusão:</strong> ${data}</p>
                    <p>Este documento atesta a participação na criação de ${questions.value.length} algoritmos focados em while, do-while, for, instanciamento e manipulação de vetores, além do uso de bibliotecas completas (java.util.Scanner) e do método main.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho no Simulador</h3>
                        <p style="font-size: 28px; color: ${score.value >= 35 ? '#5C8069' : (score.value >= 25 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Algoritmos Validados</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo módulo educacional JAVA.LOGIC 2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Java_LacosArrays_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando ambiente de simulação 2.0...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador Nível 2 (Loops, Arrays & Estrutura Class/Main)...", "log-info");
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