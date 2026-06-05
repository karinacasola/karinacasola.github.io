const { createApp } = Vue;

createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            score: 0,
            attempts: 0,
            userCode: '',
            logs: [{ type: 'log-info', text: 'Ambiente Java inicializado. Módulo Procedural: I/O, Controle, Matrizes e Funções Estáticas.' }],
            isTyping: false,
            roundOver: false,
            feedbackMsg: '',
            feedbackType: '',
            gameOver: false,
            hintsUsed: 0,
            maxHints: 3,
            questions: [
                // FASE 1: I/O E ESTRUTURAS BÁSICAS
                {
                    instruction: "[Q1 - I/O] Crie a classe 'Programa' e seu método 'main'. Importe 'java.util.Scanner'. Instancie o Scanner na variável 'sc' usando 'System.in'.",
                    elementosExigidos: "Palavras Reservadas: import, class, new | Classes: Scanner, System, Programa | Método: main | Variável: sc",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+Programa[\s\S]*main\s*\(\s*String\s*\[\]\s*\w+\s*\)[\s\S]*Scanner\s+sc\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)/i,
                    explanation: "Para ler do teclado em Java, a classe Scanner deve ser importada e associada ao System.in através de uma variável.",
                    expectedExample: "import java.util.Scanner;\npublic class Programa {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n  }\n}",
                    hint: "import java.util.Scanner;\npublic class Programa {\n public static void main(String[] args) {\n  Scanner sc = new Scanner(System.in);\n }\n}"
                },
                {
                    instruction: "[Q2 - Math] Crie a classe 'Calculo' e o 'main'. Declare uma variável double chamada 'potencia' que receba o resultado do método Math.pow(2.0, 3.0).",
                    elementosExigidos: "Palavras Reservadas: class, double | Classes: Calculo, Math | Métodos: main, pow | Variável: potencia",
                    regex: /class\s+Calculo[\s\S]*main\s*\([\s\S]*double\s+potencia\s*=\s*Math\.pow\s*\(\s*2(?:\.0)?\s*,\s*3(?:\.0)?\s*\)/i,
                    explanation: "Math.pow calcula potência e retorna um tipo double. java.lang.Math já vem importado por padrão.",
                    expectedExample: "public class Calculo {\n  public static void main(String[] args) {\n    double potencia = Math.pow(2.0, 3.0);\n  }\n}",
                    hint: "Sintaxe: double potencia = Math.pow(2.0, 3.0);"
                },
                {
                    instruction: "[Q3 - Casting] Crie a classe 'Conversao' (com main). Declare a variável 'double taxa = 9.99;'. Depois, converta explicitamente para inteiro na variável 'int taxaInt = (int) taxa;'.",
                    elementosExigidos: "Palavras Reservadas: class, double, int | Classe: Conversao | Método: main | Variáveis: taxa, taxaInt",
                    regex: /class\s+Conversao[\s\S]*main\s*\([\s\S]*double\s+taxa\s*=\s*9\.99;[\s\S]*int\s+taxaInt\s*=\s*\(int\)\s*taxa/i,
                    explanation: "O cast (int) trunca os decimais forçando um valor maior caber num tipo numérico menor.",
                    expectedExample: "public class Conversao {\n  public static void main(String[] args) {\n    double taxa = 9.99;\n    int taxaInt = (int) taxa;\n  }\n}",
                    hint: "A conversão exige os parênteses com o tipo: int taxaInt = (int) taxa;"
                },
                {
                    instruction: "[Q4 - If/Else] Crie a classe 'VerificaIdade' (com main). Declare a variável 'int idade = 20;'. Faça um bloco 'if' testando se idade >= 18 e um bloco 'else'.",
                    elementosExigidos: "Palavras Reservadas: class, int, if, else | Classe: VerificaIdade | Método: main | Variável: idade",
                    regex: /class\s+VerificaIdade[\s\S]*main\s*\([\s\S]*int\s+idade\s*=\s*20;[\s\S]*if\s*\(\s*idade\s*>=\s*18\s*\)[\s\S]*else/i,
                    explanation: "O fluxo base do Java para decisões: if (condicao) { ... } else { ... }.",
                    expectedExample: "public class VerificaIdade {\n  public static void main(String[] args) {\n    int idade = 20;\n    if (idade >= 18) {\n      System.out.println(\"Maior\");\n    } else {\n      System.out.println(\"Menor\");\n    }\n  }\n}",
                    hint: "if (idade >= 18) { } else { }"
                },
                {
                    instruction: "[Q5 - Switch] Crie a classe 'MenuOpcoes' (com main). Declare a variável 'int opcao = 1;'. Crie um comando 'switch(opcao)' com 'case 1:', 'break;' e 'default:'.",
                    elementosExigidos: "Palavras Reservadas: class, int, switch, case, break, default | Classe: MenuOpcoes | Método: main | Variável: opcao",
                    regex: /class\s+MenuOpcoes[\s\S]*main\s*\([\s\S]*int\s+opcao\s*=\s*1;[\s\S]*switch\s*\(\s*opcao\s*\)[\s\S]*case\s+1\s*:[\s\S]*break;[\s\S]*default\s*:/i,
                    explanation: "O comando switch exige a palavra reservada 'break' para não executar todas as opções em cascata.",
                    expectedExample: "public class MenuOpcoes {\n  public static void main(String[] args) {\n    int opcao = 1;\n    switch(opcao) {\n      case 1:\n        break;\n      default:\n        break;\n    }\n  }\n}",
                    hint: "Não esqueça: case 1: \n break; \n default:"
                },

                // FASE 2: LAÇOS DE REPETIÇÃO BÁSICOS
                {
                    instruction: "[Q6 - While] Crie a classe 'LacoWhile' (com main). Declare a variável 'int x = 0;'. Faça um laço 'while(x < 3)' e incremente a variável 'x++;' dentro dele.",
                    elementosExigidos: "Palavras Reservadas: class, int, while | Classe: LacoWhile | Método: main | Variável: x",
                    regex: /class\s+LacoWhile[\s\S]*main\s*\([\s\S]*int\s+x\s*=\s*0;[\s\S]*while\s*\(\s*x\s*<\s*3\s*\)\s*\{[\s\S]*x\+\+;/i,
                    explanation: "Se você esquecer de incrementar a variável 'x', o laço while roda infinitamente.",
                    expectedExample: "public class LacoWhile {\n  public static void main(String[] args) {\n    int x = 0;\n    while(x < 3) {\n      x++;\n    }\n  }\n}",
                    hint: "A estrutura é: while(x < 3) { x++; }"
                },
                {
                    instruction: "[Q7 - Do-While] Crie a classe 'LacoDoWhile' (com main). Declare a variável 'int y = 5;'. Faça um bloco 'do { y++; } while(y < 3);'.",
                    elementosExigidos: "Palavras Reservadas: class, int, do, while | Classe: LacoDoWhile | Método: main | Variável: y",
                    regex: /class\s+LacoDoWhile[\s\S]*main\s*\([\s\S]*int\s+y\s*=\s*5;[\s\S]*do\s*\{[\s\S]*y\+\+;[\s\S]*\}\s*while\s*\(\s*y\s*<\s*3\s*\);/i,
                    explanation: "O do-while roda pelo menos uma vez, mesmo que a variável y (5) já seja maior que 3 logo de cara.",
                    expectedExample: "public class LacoDoWhile {\n  public static void main(String[] args) {\n    int y = 5;\n    do {\n      y++;\n    } while(y < 3);\n  }\n}",
                    hint: "Termine com ponto e vírgula: } while(y < 3);"
                },
                {
                    instruction: "[Q8 - For] Crie a classe 'LacoFor' (com main). Faça um laço for declarando a variável 'int i = 1', rodando enquanto 'i <= 5', com incremento 'i++'.",
                    elementosExigidos: "Palavras Reservadas: class, for, int | Classe: LacoFor | Método: main | Variável: i",
                    regex: /class\s+LacoFor[\s\S]*main\s*\([\s\S]*for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*<=\s*5\s*;\s*i\+\+\s*\)/i,
                    explanation: "O for condensa declaração da variável, condição e incremento em uma linha.",
                    expectedExample: "public class LacoFor {\n  public static void main(String[] args) {\n    for(int i = 1; i <= 5; i++) { }\n  }\n}",
                    hint: "for(int i = 1; i <= 5; i++) { }"
                },
                {
                    instruction: "[Q9 - Break] Crie a classe 'Parada' (com main). Num laço for 'int i=0; i<10', faça um 'if(i == 5) break;' para forçar a saída.",
                    elementosExigidos: "Palavras Reservadas: class, for, int, if, break | Classe: Parada | Método: main | Variável: i",
                    regex: /class\s+Parada[\s\S]*main\s*\([\s\S]*for[\s\S]*if\s*\(\s*i\s*==\s*5\s*\)[\s\S]*break;/i,
                    explanation: "A palavra reservada break rompe o laço de repetição inteiro no momento em que é lida.",
                    expectedExample: "public class Parada {\n  public static void main(String[] args) {\n    for(int i=0; i<10; i++) {\n      if(i == 5) break;\n    }\n  }\n}",
                    hint: "if(i == 5) break;"
                },
                {
                    instruction: "[Q10 - Continue] Crie a classe 'Pulo' (com main). Num laço for 'int i=0; i<5', faça um 'if(i == 3) continue;' para pular a volta.",
                    elementosExigidos: "Palavras Reservadas: class, for, int, if, continue | Classe: Pulo | Método: main | Variável: i",
                    regex: /class\s+Pulo[\s\S]*main\s*\([\s\S]*for[\s\S]*if\s*\(\s*i\s*==\s*3\s*\)[\s\S]*continue;/i,
                    explanation: "A palavra reservada continue pula as linhas seguintes dentro daquela volta e recomeça a próxima iteração do laço.",
                    expectedExample: "public class Pulo {\n  public static void main(String[] args) {\n    for(int i=0; i<5; i++) {\n      if(i == 3) continue;\n    }\n  }\n}",
                    hint: "if(i == 3) continue;"
                },

                // FASE 3: MATRIZES LOCAIS NO MAIN
                {
                    instruction: "[Q11 - Matriz Declaração] Crie a classe 'CriaMatriz' (com main). Declare a variável matriz de inteiros 'int[][] m = new int[2][2];'.",
                    elementosExigidos: "Palavras Reservadas: class, int, new | Classe: CriaMatriz | Método: main | Variável: m",
                    regex: /class\s+CriaMatriz[\s\S]*main\s*\([\s\S]*int\s*\[\s*\]\s*\[\s*\]\s*m\s*=\s*new\s+int\s*\[\s*2\s*\]\s*\[\s*2\s*\];/i,
                    explanation: "Matrizes em Java são arrays de arrays e exigem dois colchetes [][].",
                    expectedExample: "public class CriaMatriz {\n  public static void main(String[] args) {\n    int[][] m = new int[2][2];\n  }\n}",
                    hint: "int[][] m = new int[2][2];"
                },
                {
                    instruction: "[Q12 - Soma Matriz] Crie a classe 'SomaMatriz' (com main). Declare a variável 'int soma = 0;' e faça dois laços for aninhados ('i' e 'j') acumulando com 'soma += m[i][j];'.",
                    elementosExigidos: "Palavras Reservadas: class, int, for | Classe: SomaMatriz | Método: main | Variáveis: soma, m, i, j",
                    regex: /class\s+SomaMatriz[\s\S]*main\s*\([\s\S]*int\s+soma\s*=\s*0;[\s\S]*for[\s\S]*for[\s\S]*soma\s*\+=\s*m\[i\]\[j\];/i,
                    explanation: "Varredura bidimensional usa for aninhado com duas variáveis iteradoras (i, j).",
                    expectedExample: "public class SomaMatriz {\n  public static void main(String[] args) {\n    int soma = 0;\n    // fors... \n    soma += m[i][j];\n  }\n}",
                    hint: "Coloque soma += m[i][j]; no centro dos laços."
                },
                {
                    instruction: "[Q13 - Maior Matriz] Crie a classe 'MaiorMatriz' (com main). Declare a variável 'int maior = m[0][0];' e um if 'if(m[i][j] > maior) maior = m[i][j];'.",
                    elementosExigidos: "Palavras Reservadas: class, int, if | Classe: MaiorMatriz | Método: main | Variáveis: maior, m, i, j",
                    regex: /class\s+MaiorMatriz[\s\S]*main\s*\([\s\S]*int\s+maior\s*=\s*m\[0\]\[0\];[\s\S]*if\s*\(\s*m\[i\]\[j\]\s*>\s*maior\s*\)[\s\S]*maior\s*=\s*m\[i\]\[j\];/i,
                    explanation: "Sempre inicie a variável 'maior' com um elemento válido do array (como o índice [0][0]) antes de começar a comparar.",
                    expectedExample: "public class MaiorMatriz {\n  public static void main(String[] args) {\n    int maior = m[0][0];\n    if(m[i][j] > maior) maior = m[i][j];\n  }\n}",
                    hint: "Inicie o maior adequadamente e use if(m[i][j] > maior) maior = m[i][j];"
                },
                {
                    instruction: "[Q14 - Par Matriz] Crie a classe 'ContaPares' (com main). Declare a variável 'int pares = 0;'. Dentro dos laços de varredura, conte fazendo 'if(m[i][j] % 2 == 0) pares++;'.",
                    elementosExigidos: "Palavras Reservadas: class, int, if | Classe: ContaPares | Método: main | Variáveis: pares, m, i, j",
                    regex: /class\s+ContaPares[\s\S]*main\s*\([\s\S]*if\s*\(\s*m\[i\]\[j\]\s*%\s*2\s*==\s*0\s*\)[\s\S]*pares\+\+;/i,
                    explanation: "Mod 2 checa o resto da divisão.",
                    expectedExample: "public class ContaPares {\n  public static void main(String[] args) {\n    int pares = 0;\n    if(m[i][j] % 2 == 0) pares++;\n  }\n}",
                    hint: "if(m[i][j] % 2 == 0) pares++;"
                },
                {
                    instruction: "[Q15 - Diagonais] Crie a classe 'DiagonalP' (com main). Acesse e imprima a diagonal principal de uma matriz utilizando o método System.out.print com as variáveis 'm[i][i]'.",
                    elementosExigidos: "Palavras Reservadas: class | Classes: DiagonalP, System | Métodos: main, print/println | Variáveis: m, i",
                    regex: /class\s+DiagonalP[\s\S]*main\s*\([\s\S]*System\.out\.print(?:ln)?\(\s*m\[i\]\[i\]/i,
                    explanation: "Na diagonal principal a linha tem o mesmo índice da coluna.",
                    expectedExample: "public class DiagonalP {\n  public static void main(String[] args) {\n    System.out.println(m[i][i]);\n  }\n}",
                    hint: "Acesse usando a mesma variável iteradora: m[i][i]."
                },
                {
                    instruction: "[Q16 - Identidade] Crie a classe 'MatrizIdentidade' (com main). Use as palavras reservadas if-else para preencher a matriz 'id': 'if(i == j) id[i][j] = 1; else id[i][j] = 0;'.",
                    elementosExigidos: "Palavras Reservadas: class, if, else | Classe: MatrizIdentidade | Método: main | Variáveis: id, i, j",
                    regex: /class\s+MatrizIdentidade[\s\S]*main\s*\([\s\S]*if\s*\(\s*i\s*==\s*j\s*\)[\s\S]*id\[i\]\[j\]\s*=\s*1;[\s\S]*else[\s\S]*id\[i\]\[j\]\s*=\s*0;/i,
                    explanation: "Combina iteração com comando condicional baseado nas variáveis iteradoras.",
                    expectedExample: "public class MatrizIdentidade {\n  public static void main(String[] args) {\n    if(i == j) id[i][j] = 1;\n    else id[i][j] = 0;\n  }\n}",
                    hint: "if(i == j) id[i][j] = 1; else id[i][j] = 0;"
                },
                {
                    instruction: "[Q17 - Escalar] Crie a classe 'MultiplicaEscalar' (com main). Declare a variável 'int escalar = 5;' e modifique a matriz com 'm[i][j] = m[i][j] * escalar;'.",
                    elementosExigidos: "Palavras Reservadas: class, int | Classe: MultiplicaEscalar | Método: main | Variáveis: escalar, m, i, j",
                    regex: /class\s+MultiplicaEscalar[\s\S]*main\s*\([\s\S]*int\s+escalar\s*=\s*5;[\s\S]*m\[i\]\[j\]\s*=\s*m\[i\]\[j\]\s*\*\s*escalar;/i,
                    explanation: "Você está reatribuindo o valor do mesmo índice da matriz após multiplicá-lo pela variável escalar.",
                    expectedExample: "public class MultiplicaEscalar {\n  public static void main(String[] args) {\n    int escalar = 5;\n    m[i][j] = m[i][j] * escalar;\n  }\n}",
                    hint: "m[i][j] = m[i][j] * escalar;"
                },

                // FASE 4: FUNÇÕES SEM I/O (O BÁSICO DA MODULARIZAÇÃO)
                {
                    instruction: "[Q18 - Função Void Básica] Crie a classe 'Mensagem'. Fora do método main, crie o método (procedimento) estático: 'public static void imprimirSaudacao()'. Dentro dela imprima 'Olá'. Crie um main vazio.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void | Classes: Mensagem, System | Métodos: main, imprimirSaudacao, print/println",
                    regex: /class\s+Mensagem[\s\S]*public\s+static\s+void\s+imprimirSaudacao\s*\(\s*\)[\s\S]*System\.out\.print/i,
                    explanation: "Métodos que não devolvem valores usam a palavra reservada 'void'. Por agora não vamos usar orientação a objetos, por isso usamos 'static'.",
                    expectedExample: "public class Mensagem {\n  public static void imprimirSaudacao() {\n    System.out.println(\"Ola\");\n  }\n  public static void main(String[] args) {}\n}",
                    hint: "A estrutura do método é: public static void imprimirSaudacao() { }"
                },
                {
                    instruction: "[Q19 - Função com Parâmetro] Crie a classe 'Dobro'. Crie o método 'public static void imprimirDobro(int x)'. Dentro dela imprima 'x * 2'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void, int | Classes: Dobro, System | Métodos: main, imprimirDobro, print/println | Variável: x",
                    regex: /class\s+Dobro[\s\S]*public\s+static\s+void\s+imprimirDobro\s*\(\s*int\s+x\s*\)[\s\S]*x\s*\*\s*2/i,
                    explanation: "Parâmetros são variáveis locais criadas na assinatura do método para receber dados externos.",
                    expectedExample: "public class Dobro {\n  public static void imprimirDobro(int x) {\n    System.out.println(x * 2);\n  }\n}",
                    hint: "A assinatura tem que ter a variável x: public static void imprimirDobro(int x) { }"
                },
                {
                    instruction: "[Q20 - Função com Retorno] Crie a classe 'Calculadora'. Crie o método tipado 'public static int somar(int a, int b)'. Dentro dele, utilize a palavra reservada 'return a + b;'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, int, return | Classe: Calculadora | Métodos: main, somar | Variáveis: a, b",
                    regex: /class\s+Calculadora[\s\S]*public\s+static\s+int\s+somar\s*\(\s*int\s+a\s*,\s*int\s+b\s*\)[\s\S]*return\s+a\s*\+\s*b;/i,
                    explanation: "Ao assinar com 'int', a palavra chave 'return' se torna obrigatória para devolver a resposta a quem chamou a função.",
                    expectedExample: "public class Calculadora {\n  public static int somar(int a, int b) {\n    return a + b;\n  }\n}",
                    hint: "A função precisa de tipo: public static int somar(int a, int b) { return a + b; }"
                },
                {
                    instruction: "[Q21 - Chamada de Função] Crie a classe 'TesteChamada'. Crie o método somar(int a, int b). No 'main', declare a variável 'int resultado' e faça a chamada: 'int resultado = somar(10, 5);'.",
                    elementosExigidos: "Palavras Reservadas: class, int, public, static, return | Classe: TesteChamada | Métodos: main, somar | Variáveis: resultado, a, b",
                    regex: /class\s+TesteChamada[\s\S]*public\s+static\s+int\s+somar[\s\S]*main\s*\([\s\S]*int\s+resultado\s*=\s*somar\s*\(\s*10\s*,\s*5\s*\);/i,
                    explanation: "Você invoca o método de fora para dentro do main, passando valores que preencherão as variáveis a e b.",
                    expectedExample: "public class TesteChamada {\n  public static int somar(int a, int b) { return a+b; }\n  public static void main(String[] args) {\n    int resultado = somar(10, 5);\n  }\n}",
                    hint: "No main, chame o método pelo nome com os argumentos: int resultado = somar(10, 5);"
                },
                {
                    instruction: "[Q22 - Retorno Double] Crie a classe 'Conversor'. Crie o método 'public static double celciusParaFahrenheit(double c)'. Retorne o cálculo '(c * 9.0/5.0) + 32.0;'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, double, return | Classe: Conversor | Método: celciusParaFahrenheit | Variável: c",
                    regex: /class\s+Conversor[\s\S]*public\s+static\s+double\s+celciusParaFahrenheit\s*\(\s*double\s+c\s*\)[\s\S]*return\s*\(\s*c\s*\*\s*9\.0\s*\/\s*5\.0\s*\)\s*\+\s*32\.0;/i,
                    explanation: "Trabalhar com precisão real exige o tipo double e o uso de decimais (.0) nos divisores (9.0/5.0).",
                    expectedExample: "public class Conversor {\n  public static double celciusParaFahrenheit(double c) {\n    return (c * 9.0/5.0) + 32.0;\n  }\n}",
                    hint: "return (c * 9.0/5.0) + 32.0;"
                },
                {
                    instruction: "[Q23 - Função Condicional] Crie a classe 'Paridade'. Crie o método 'public static void verificarParidade(int n)'. Coloque um 'if(n % 2 == 0)' para imprimir 'Par'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void, if | Classes: Paridade, System | Métodos: verificarParidade, print/println | Variável: n",
                    regex: /class\s+Paridade[\s\S]*public\s+static\s+void\s+verificarParidade\s*\(\s*int\s+n\s*\)[\s\S]*if\s*\(\s*n\s*%\s*2\s*==\s*0\s*\)/i,
                    explanation: "As sub-rotinas são ótimas para isolar lógicas condicionais das regras de negócios.",
                    expectedExample: "public class Paridade {\n  public static void verificarParidade(int n) {\n    if(n % 2 == 0) System.out.println(\"Par\");\n  }\n}",
                    hint: "Assinatura: public static void verificarParidade(int n)"
                },

                // FASE 5: I/O + INTERATIVIDADE + MENSAGENS DENTRO DE FUNÇÕES
                {
                    instruction: "[Q24 - I/O Função de Leitura] Importe a classe Scanner. Crie a classe 'Leitura'. Crie o método 'public static String lerNome()'. Nele, instancie o Scanner na variável 'sc', imprima a mensagem 'Nome:' e use 'return sc.nextLine();'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, return, new | Classes: Scanner, Leitura, String, System | Métodos: lerNome, nextLine, print/println | Variável: sc",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+Leitura[\s\S]*public\s+static\s+String\s+lerNome\s*\(\s*\)[\s\S]*new\s+Scanner[\s\S]*return\s+\w+\.nextLine\(\);/i,
                    explanation: "O objeto Scanner pode existir em uma variável local dentro da função para cumprir a leitura encapsulada.",
                    expectedExample: "import java.util.Scanner;\npublic class Leitura {\n  public static String lerNome() {\n    Scanner sc = new Scanner(System.in);\n    System.out.println(\"Nome:\");\n    return sc.nextLine();\n  }\n}",
                    hint: "Instancie o Scanner localmente, emita mensagem Sysout, e use return sc.nextLine();"
                },
                {
                    instruction: "[Q25 - I/O Leitura Numérica] Importe a classe Scanner. Crie a classe 'EntradaIdade'. Crie o método 'public static int lerIdade()'. Imprima 'Sua Idade:' e use o comando 'return sc.nextInt();'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, int, return, new | Classes: Scanner, EntradaIdade, System | Métodos: lerIdade, nextInt, print/println | Variável: sc",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+EntradaIdade[\s\S]*public\s+static\s+int\s+lerIdade\s*\(\s*\)[\s\S]*new\s+Scanner[\s\S]*return\s+\w+\.nextInt\(\);/i,
                    explanation: "O comando return devolve um tipo int, garantindo a tipagem correta exigida pela assinatura do método.",
                    expectedExample: "import java.util.Scanner;\npublic class EntradaIdade {\n  public static int lerIdade() {\n    Scanner sc = new Scanner(System.in);\n    System.out.println(\"Idade:\");\n    return sc.nextInt();\n  }\n}",
                    hint: "A assinatura é public static int lerIdade() { ... return sc.nextInt(); }"
                },
                {
                    instruction: "[Q26 - I/O Menu Simples] Importe Scanner. Crie a classe 'MenuInterativo'. No método 'public static void exibirMenu()', instancie o Scanner, leia a variável 'int opcao = sc.nextInt();' e passe para um bloco 'switch(opcao)'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, void, new, switch, case | Classes: Scanner, MenuInterativo | Métodos: exibirMenu, nextInt | Variáveis: sc, opcao",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+MenuInterativo[\s\S]*public\s+static\s+void\s+exibirMenu\s*\(\s*\)[\s\S]*new\s+Scanner[\s\S]*nextInt\(\);[\s\S]*switch\s*\(\s*opcao\s*\)/i,
                    explanation: "Métodos procedurais iterativos (void) com menu de escolhas são muito usados para construir interfaces no Console.",
                    expectedExample: "import java.util.Scanner;\npublic class MenuInterativo {\n  public static void exibirMenu() {\n    Scanner sc = new Scanner(System.in);\n    int opcao = sc.nextInt();\n    switch(opcao) {\n    }\n  }\n}",
                    hint: "Instancie Scanner, int opcao = sc.nextInt(); e em seguida switch(opcao)."
                },
                {
                    instruction: "[Q27 - I/O Validação com Do-While] Importe Scanner. Crie a classe 'ValidaInput'. Crie 'public static int lerPositivo()'. Use um bloco 'do { ... } while(x <= 0);' lendo a variável 'x' com Scanner, e termine com 'return x;'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, int, return, new, do, while | Classes: Scanner, ValidaInput | Métodos: lerPositivo, nextInt | Variáveis: sc, x",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+ValidaInput[\s\S]*public\s+static\s+int\s+lerPositivo\s*\(\s*\)[\s\S]*Scanner[\s\S]*do\s*\{[\s\S]*\}\s*while\s*\(\s*x\s*<=\s*0\s*\);[\s\S]*return\s+x;/i,
                    explanation: "Essa função é robusta e trava a rotina até o usuário digitar uma resposta permitida pela regra.",
                    expectedExample: "import java.util.Scanner;\npublic class ValidaInput {\n  public static int lerPositivo() {\n    Scanner sc = new Scanner(System.in);\n    int x;\n    do { x = sc.nextInt(); } while(x <= 0);\n    return x;\n  }\n}",
                    hint: "Declare a variável 'int x;' fora do do-while para que o escopo chegue no return x;"
                },
                {
                    instruction: "[Q28 - I/O Passagem de Scanner] Importe Scanner. Crie a classe 'LeituraOtimizada'. Crie o método 'public static int lerComScanner(Scanner sc)' recebendo o Scanner como parâmetro. Retorne sc.nextInt().",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, int, return | Classes: Scanner, LeituraOtimizada | Métodos: lerComScanner, nextInt | Variável: sc",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+LeituraOtimizada[\s\S]*public\s+static\s+int\s+lerComScanner\s*\(\s*Scanner\s+sc\s*\)[\s\S]*return\s+sc\.nextInt\(\);/i,
                    explanation: "Em vez de alocar um 'new Scanner' em memória toda hora, passamos a variável via parâmetro, reaproveitando o objeto do main.",
                    expectedExample: "import java.util.Scanner;\npublic class LeituraOtimizada {\n  public static int lerComScanner(Scanner sc) {\n    return sc.nextInt();\n  }\n}",
                    hint: "A variável na assinatura dita a exigência: (Scanner sc)"
                },

                // FASE 6: FUNÇÕES TRATANDO VETORES E MATRIZES
                {
                    instruction: "[Q29 - Função Vetor] Crie a classe 'VetorFunc'. Crie o método 'public static int somaVetor(int[] arr)'. Use um laço for para acumular na variável 'soma' e conclua com 'return soma;'.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, int, return, for | Classe: VetorFunc | Método: somaVetor | Variáveis: arr, soma, i",
                    regex: /class\s+VetorFunc[\s\S]*public\s+static\s+int\s+somaVetor\s*\(\s*int\s*\[\s*\]\s*arr\s*\)[\s\S]*for[\s\S]*return\s+soma;/i,
                    explanation: "Vetores são passados por referência na variável `arr` e não requerem definição de tamanho na assinatura do método.",
                    expectedExample: "public class VetorFunc {\n  public static int somaVetor(int[] arr) {\n    int soma = 0;\n    // laco iterando...\n    return soma;\n  }\n}",
                    hint: "A declaração deve ser (int[] arr)."
                },
                {
                    instruction: "[Q30 - Função Matriz] Crie a classe 'MatrizFunc'. Crie o método 'public static void imprimirMatriz(int[][] mat)'. Use for duplo iterando sobre a matriz na variável 'mat' e imprima.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void, for | Classes: MatrizFunc, System | Métodos: imprimirMatriz, print/println | Variáveis: mat, i, j",
                    regex: /class\s+MatrizFunc[\s\S]*public\s+static\s+void\s+imprimirMatriz\s*\(\s*int\s*\[\s*\]\s*\[\s*\]\s*mat\s*\)[\s\S]*for[\s\S]*for[\s\S]*System\.out\.print/i,
                    explanation: "Matrizes exigem dois colchetes na declaração do parâmetro `(int[][] mat)`.",
                    expectedExample: "public class MatrizFunc {\n  public static void imprimirMatriz(int[][] mat) {\n    for(int i=0; i<mat.length; i++) {\n      // loop j... print(mat[i][j])\n    }\n  }\n}",
                    hint: "A declaração deve ser (int[][] mat)."
                },
                {
                    instruction: "[Q31 - I/O + Matriz via Função] Importe Scanner. Crie a classe 'PreencheMat'. Crie o método 'public static void preencher(int[][] m)'. Instancie o Scanner e dentro do for duplo, atribua 'm[i][j] = sc.nextInt();'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, void, new, for | Classes: Scanner, PreencheMat | Métodos: preencher, nextInt | Variáveis: sc, m, i, j",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*class\s+PreencheMat[\s\S]*public\s+static\s+void\s+preencher\s*\(\s*int\s*\[\s*\]\s*\[\s*\]\s*m\s*\)[\s\S]*new\s+Scanner[\s\S]*for[\s\S]*for[\s\S]*m\[i\]\[j\]\s*=\s*\w+\.nextInt\(\);/i,
                    explanation: "A matriz original na memória será preenchida pelos dados capturados pelo Scanner dentro deste método.",
                    expectedExample: "import java.util.Scanner;\npublic class PreencheMat {\n  public static void preencher(int[][] m) {\n    Scanner sc = new Scanner(System.in);\n    // fors...\n    m[i][j] = sc.nextInt();\n  }\n}",
                    hint: "Atribua a leitura no centro dos dois laços com m[i][j] = sc.nextInt()"
                },
                {
                    instruction: "[Q32 - Modificação Ref Vetor] Crie a classe 'ModificaVet'. Crie o método 'public static void dobrarValores(int[] arr)'. Itere sobre o vetor e reatribua à própria variável 'arr[i] = arr[i] * 2;'. Sem retorno.",
                    elementosExigidos: "Palavras Reservadas: class, public, static, void, for | Classe: ModificaVet | Método: dobrarValores | Variáveis: arr, i",
                    regex: /class\s+ModificaVet[\s\S]*public\s+static\s+void\s+dobrarValores\s*\(\s*int\s*\[\s*\]\s*arr\s*\)[\s\S]*for[\s\S]*arr\[i\]\s*=\s*arr\[i\]\s*\*\s*2;/i,
                    explanation: "Quando você modifica a variável 'arr[i]' dentro do método procedural, os dados também são atualizados no array do método main instantaneamente.",
                    expectedExample: "public class ModificaVet {\n  public static void dobrarValores(int[] arr) {\n    for(int i=0; i<arr.length; i++) {\n      arr[i] = arr[i] * 2;\n    }\n  }\n}",
                    hint: "Faça arr[i] = arr[i] * 2;"
                },

                // FASE 7: ARRAYLIST (Coleções Dinâmicas)
                {
                    instruction: "[Q33 - Arraylist Base] Importe a classe 'java.util.ArrayList'. Crie a classe 'ListaDinamica' com 'main'. Declare a variável 'ArrayList<Integer> lista = new ArrayList<>();' e use o método 'lista.add(10);'.",
                    elementosExigidos: "Palavras Reservadas: import, class, new | Classes: ArrayList, Integer, ListaDinamica | Métodos: main, add | Variável: lista",
                    regex: /import\s+java\.util\.ArrayList;[\s\S]*class\s+ListaDinamica[\s\S]*main\s*\([\s\S]*ArrayList\s*<\s*Integer\s*>\s+lista\s*=\s*new\s+ArrayList\s*<\s*>\s*\(\s*\);[\s\S]*lista\.add\(\s*10\s*\);/i,
                    explanation: "A classe ArrayList permite criar estruturas que crescem ou diminuem dinamicamente.",
                    expectedExample: "import java.util.ArrayList;\npublic class ListaDinamica {\n  public static void main(String[] args) {\n    ArrayList<Integer> lista = new ArrayList<>();\n    lista.add(10);\n  }\n}",
                    hint: "ArrayList<Integer> lista = new ArrayList<>();\nlista.add(10);"
                },
                {
                    instruction: "[Q34 - Arraylist Get/Size] Na classe 'TamanhoLista' (com main), após popular a variável 'lista', use um laço for testando 'i < lista.size();' e resgate o valor chamando o método 'lista.get(i)'.",
                    elementosExigidos: "Palavras Reservadas: class, for | Classe: TamanhoLista | Métodos: main, size, get | Variáveis: lista, i",
                    regex: /class\s+TamanhoLista[\s\S]*main\s*\([\s\S]*for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*lista\.size\(\)\s*;\s*i\+\+\s*\)[\s\S]*lista\.get\(\s*i\s*\)/i,
                    explanation: "O tamanho do ArrayList é medido com o método size(). Para extrair os itens usamos o método get(índice).",
                    expectedExample: "public class TamanhoLista {\n  public static void main(String[] args) {\n    //...\n    for(int i=0; i < lista.size(); i++) {\n      System.out.println(lista.get(i));\n    }\n  }\n}",
                    hint: "Use i < lista.size() no for e lista.get(i) para capturar o dado."
                },
                {
                    instruction: "[Q35 - Arraylist ForEach] Na classe 'LoopMelhorado', declare a variável ArrayList 'notas'. Use o For-Each: 'for (Integer n : notas)' para varrer a coleção.",
                    elementosExigidos: "Palavras Reservadas: class, for | Classes: LoopMelhorado, Integer | Método: main | Variáveis: n, notas",
                    regex: /class\s+LoopMelhorado[\s\S]*main\s*\([\s\S]*for\s*\(\s*Integer\s+n\s*:\s*notas\s*\)/i,
                    explanation: "O comando for-each abstrai as variáveis de índice para focar inteiramente na extração do dado.",
                    expectedExample: "public class LoopMelhorado {\n  public static void main(String[] args) {\n    // notas...\n    for(Integer n : notas) { }\n  }\n}",
                    hint: "Sintaxe: for (Integer n : notas) { }"
                },
                {
                    instruction: "[Q36 - Arraylist RemoveIf] Na classe 'FiltroExpresso', use a variável 'lista' e aplique o método 'lista.removeIf(n -> n < 0);' para deletar negativos diretamente com a expressão lambda na variável 'n'.",
                    elementosExigidos: "Palavras Reservadas: class | Classe: FiltroExpresso | Métodos: main, removeIf | Variáveis: lista, n",
                    regex: /class\s+FiltroExpresso[\s\S]*main\s*\([\s\S]*lista\.removeIf\s*\(\s*n\s*->\s*n\s*<\s*0\s*\);/i,
                    explanation: "Funções anônimas passadas dentro de removeIf permitem encurtar códigos pesados de filtragem em uma linha.",
                    expectedExample: "public class FiltroExpresso {\n  public static void main(String[] args) {\n    lista.removeIf(n -> n < 0);\n  }\n}",
                    hint: "lista.removeIf(n -> n < 0);"
                },

                // FASE 8: INTEGRAÇÃO (ArrayList + Funções + I/O)
                {
                    instruction: "[Q37 - Arraylist como Parâmetro] Importe ArrayList. Crie a classe 'ListaParametro'. Crie o método 'public static void zerarLista(ArrayList<Integer> lista)'. Dentro dele, acione 'lista.clear();'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, void | Classes: ArrayList, Integer, ListaParametro | Métodos: zerarLista, clear | Variável: lista",
                    regex: /import\s+java\.util\.ArrayList;[\s\S]*class\s+ListaParametro[\s\S]*public\s+static\s+void\s+zerarLista\s*\(\s*ArrayList\s*<\s*Integer\s*>\s+lista\s*\)[\s\S]*lista\.clear\(\);/i,
                    explanation: "A variável lista passada via parâmetro sofrerá a ação do método clear() apagando todo o seu conteúdo na memória.",
                    expectedExample: "import java.util.ArrayList;\npublic class ListaParametro {\n  public static void zerarLista(ArrayList<Integer> lista) {\n    lista.clear();\n  }\n}",
                    hint: "O tipo na assinatura é (ArrayList<Integer> lista)."
                },
                {
                    instruction: "[Q38 - Retorno de ArrayList Novo] Importe ArrayList. Crie a classe 'FiltroFuncao'. Assine a tipagem do método: 'public static ArrayList<Integer> criarPares()'. Instancie e use o 'return new ArrayList<>();'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, return, new | Classes: ArrayList, Integer, FiltroFuncao | Método: criarPares",
                    regex: /import\s+java\.util\.ArrayList;[\s\S]*class\s+FiltroFuncao[\s\S]*public\s+static\s+ArrayList\s*<\s*Integer\s*>\s+criarPares\s*\(\s*\)[\s\S]*return\s+new\s+ArrayList\s*<\s*>\s*\(\s*\);/i,
                    explanation: "Este padrão serve para criar métodos de filtro que devolvem um objeto lista novo independente à classe principal.",
                    expectedExample: "import java.util.ArrayList;\npublic class FiltroFuncao {\n  public static ArrayList<Integer> criarPares() {\n    return new ArrayList<>();\n  }\n}",
                    hint: "Tipagem na assinatura: public static ArrayList<Integer> criarPares()"
                },
                {
                    instruction: "[Q39 - Processamento de ArrayList] Importe ArrayList. Crie a classe 'Filtragem'. Método 'public static ArrayList<Integer> pegaPares(ArrayList<Integer> original)'. Instancie a variável 'aux', insira itens usando .add e retorne a variável 'aux'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, return, new | Classes: ArrayList, Integer, Filtragem | Métodos: pegaPares, add | Variáveis: original, aux",
                    regex: /import\s+java\.util\.ArrayList;[\s\S]*class\s+Filtragem[\s\S]*public\s+static\s+ArrayList\s*<\s*Integer\s*>\s+pegaPares\s*\(\s*ArrayList\s*<\s*Integer\s*>\s+original\s*\)[\s\S]*new\s+ArrayList[\s\S]*return/i,
                    explanation: "Recebemos a lista na variável 'original', criamos um ArrayList limpo no escopo local ('aux'), preenchemos e aplicamos o return nela.",
                    expectedExample: "import java.util.ArrayList;\npublic class Filtragem {\n  public static ArrayList<Integer> pegaPares(ArrayList<Integer> original) {\n    ArrayList<Integer> aux = new ArrayList<>();\n    // condicao par adicionando na aux\n    return aux;\n  }\n}",
                    hint: "Crie a nova arraylist (aux) dentro do método e dê return nela no fim."
                },
                {
                    instruction: "[Q40 - INTEGRAÇÃO FINAL] Importe ArrayList E Scanner. Crie a classe 'AppCompleto'. Método 'public static ArrayList<Integer> lerAteZero()'. Nela, instancie ArrayList (lista) e Scanner (sc). Use 'do-while' para ler a variável 'num' e dar 'lista.add(num)'. Retorne 'lista'.",
                    elementosExigidos: "Palavras Reservadas: import, class, public, static, return, new, do, while, if | Classes: Scanner, ArrayList, Integer, AppCompleto | Métodos: lerAteZero, nextInt, add | Variáveis: lista, sc, num",
                    regex: /import\s+java\.util\.Scanner;[\s\S]*import\s+java\.util\.ArrayList;[\s\S]*class\s+AppCompleto[\s\S]*public\s+static\s+ArrayList\s*<\s*Integer\s*>\s+lerAteZero\s*\(\s*\)[\s\S]*new\s+ArrayList[\s\S]*new\s+Scanner[\s\S]*do\s*\{[\s\S]*\}\s*while[\s\S]*return/i,
                    explanation: "Integração 100%: o console fica bloqueado, o Scanner alocado na variável 'sc' lê os dados para a estrutura ArrayList instanciada na variável 'lista', que é devolvida via return.",
                    expectedExample: "import java.util.Scanner;\nimport java.util.ArrayList;\npublic class AppCompleto {\n  public static ArrayList<Integer> lerAteZero() {\n    ArrayList<Integer> lista = new ArrayList<>();\n    Scanner sc = new Scanner(System.in);\n    int num;\n    do {\n       num = sc.nextInt();\n       if(num != 0) lista.add(num);\n    } while(num != 0);\n    return lista;\n  }\n}",
                    hint: "A assinatura deve iniciar como public static ArrayList<Integer> lerAteZero() e instanciar os 2 objetos dentro."
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
            this.typeLog(`Compilando rotinas procedurais Java...`, 'log-info', () => {
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
            this.feedbackMsg = "<i class='bi bi-check-circle-fill'></i> Elementos obrigatórios e lógica validados com sucesso!";
            this.feedbackType = "success";
            this.typeLog(`[SUCCESS] Testes passaram. Código atendeu às especificações literais requisitadas.`, 'log-success');
        },
        handleError() {
            if (this.attempts >= 3) {
                this.roundOver = true;
                this.feedbackMsg = "<i class='bi bi-x-circle'></i> Limite de tentativas alcançado. Verifique se as classes, métodos e variáveis correspondem à instrução.";
                this.feedbackType = "error";
                this.typeLog(`[ERROR] Falha estrutural repetida. Verifique os nomes exatos (maiúsculas/minúsculas). Round travado.`, 'log-error');
            } else {
                this.feedbackMsg = `<i class='bi bi-bug'></i> Erro. Faltam elementos obrigatórios (palavras reservadas, classes, métodos ou variáveis nomeadas). Tentativa ${this.attempts}/3.`;
                this.feedbackType = "warning";
                this.typeLog(`[WARN] Diferença detectada contra o gabarito. Lembre-se: Java diferencia letras e exige que variáveis, classes e métodos sejam declarados com nomes exatos.`, 'log-warning');
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
                    <h1 style="color: #5C8069;">Relatório: JAVA.LOGIC PROCEDURAL</h1>
                    <p><strong>Desafios Concluídos:</strong> ${this.questions.length}</p>
                    <p><strong>Pontuação Final:</strong> ${this.score}</p>
                    <p><strong>Dicas Utilizadas:</strong> ${this.hintsUsed}</p>
                    <hr>
                    <p><em>Este relatório atesta a participação no treinamento prático construindo lógicas estritamente com programação estruturada em Java. Cobre desde I/O e Bibliotecas nativas, avançando nas Matrizes até sub-rotinas e métodos com retorno tipado.</em></p>
                </div>
            `;
            html2pdf().from(element).save('relatorio-javalogic-procedural.pdf');
        }
    }
}).mount('#app');