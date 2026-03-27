const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            availableBlocks: [], 
            selectedBlocks: [],  
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            chances: 3,
            showSolution: false,
            currentSolutionDisplay: [],
            
            levels: [
                {
                    id: 1,
                    concept: "Estrutura Básica Java",
                    story: "Todo código Java precisa de uma classe e um método principal. Vamos dar 'Bom dia!'.",
                    instruction: "Monte a estrutura obrigatória do Java e imprima a mensagem.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {' },
                        { id: 'b2', text: '    public static void main(String[] args) {' },
                        { id: 'b3', text: '        System.out.println("Bom dia!");' },
                        { id: 'b4', text: '    }\n}' },
                        { id: 'b5', text: 'function main() {' }, 
                        { id: 'b6', text: 'print("Bom dia!");' } 
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4'] ],
                    successLog: "Compilação bem-sucedida. JVM iniciada."
                },
                {
                    id: 2,
                    concept: "Variáveis e Matemática",
                    story: "O nutricionista precisa de um sistema que calcule o IMC (Índice de Massa Corporal).",
                    instruction: "Crie variáveis de peso/altura e calcule o IMC.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double peso = 70.0;' },
                        { id: 'b3', text: '    double altura = 1.75;' },
                        { id: 'b4', text: '    double imc = peso / (altura * altura);' },
                        { id: 'b5', text: '    System.out.println("IMC: " + imc);' },
                        { id: 'b6', text: '  }\n}' },
                        { id: 'b7', text: '    int imc = peso / altura;' } 
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'], ['b1', 'b3', 'b2', 'b4', 'b5', 'b6'] ],
                    successLog: "Cálculo preciso. Tipos primitivos (double) alocados com sucesso."
                },
                {
                    id: 3,
                    concept: "Condicional Simples (If/Else)",
                    story: "O sistema da catraca do cinema precisa verificar se o cliente tem 18 anos ou mais.",
                    instruction: "Use IF/ELSE para liberar ou bloquear a entrada.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int idade = 16;' },
                        { id: 'b3', text: '    if (idade >= 18) {' },
                        { id: 'b4', text: '        System.out.println("Entrada Liberada");' },
                        { id: 'b5', text: '    } else {' },
                        { id: 'b6', text: '        System.out.println("Entrada Bloqueada");' },
                        { id: 'b7', text: '    }\n  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] ],
                    successLog: "Lógica de desvio condicional executada. Catraca configurada."
                },
                {
                    id: 4,
                    concept: "Operador Módulo (Par ou Ímpar)",
                    story: "Um sensor de controle de qualidade separa peças pares para a esquerda e ímpares para a direita.",
                    instruction: "Verifique se a variável 'peca' é par usando o operador módulo (%).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int peca = 10;' },
                        { id: 'b3', text: '    if (peca % 2 == 0) {' },
                        { id: 'b4', text: '        System.out.println("Lote Par");' },
                        { id: 'b5', text: '    } else {' },
                        { id: 'b6', text: '        System.out.println("Lote Ímpar");' },
                        { id: 'b7', text: '    }\n  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] ],
                    successLog: "Operador matemático % validado. Triagem funcionando."
                },
                {
                    id: 5,
                    concept: "Condicionais Encadeadas",
                    story: "O painel do carro precisa avisar sobre o combustível: 'Cheio', 'Atenção' ou 'Reserva'.",
                    instruction: "Use if, else if e else para classificar o nível do tanque.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int litros = 5;' },
                        { id: 'b3', text: '    if (litros > 30) {' },
                        { id: 'b4', text: '        System.out.println("Cheio");' },
                        { id: 'b5', text: '    } else if (litros > 10) {' },
                        { id: 'b6', text: '        System.out.println("Atenção");' },
                        { id: 'b7', text: '    } else {' },
                        { id: 'b8', text: '        System.out.println("Reserva!");' },
                        { id: 'b9', text: '    }\n  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'] ],
                    successLog: "Árvore de decisão compilada. Sensores calibrados."
                },
                {
                    id: 6,
                    concept: "Switch Case",
                    story: "A URA (Atendimento Telefônico) precisa direcionar as ligações baseada na opção digitada.",
                    instruction: "Construa um Switch Case para as opções 1 e 2.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int opcao = 1;' },
                        { id: 'b3', text: '    switch (opcao) {' },
                        { id: 'b4', text: '        case 1:' },
                        { id: 'b5', text: '            System.out.println("Vendas"); break;' },
                        { id: 'b6', text: '        case 2:' },
                        { id: 'b7', text: '            System.out.println("Suporte"); break;' },
                        { id: 'b8', text: '        default:' },
                        { id: 'b9', text: '            System.out.println("Inválido");' },
                        { id: 'b10', text: '    }\n  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'] ],
                    successLog: "Estrutura Switch ativada. Rotas telefônicas mapeadas."
                },
                {
                    id: 7,
                    concept: "Laço For (Contagem Regressiva)",
                    story: "O foguete precisa de uma contagem regressiva de 5 até 1 antes de imprimir 'Decolar!'.",
                    instruction: "Monte um laço FOR decrementando a variável.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    for (int i = 5; i > 0; i--) {' },
                        { id: 'b3', text: '        System.out.println(i);' },
                        { id: 'b4', text: '    }' },
                        { id: 'b5', text: '    System.out.println("Decolar!");' },
                        { id: 'b6', text: '  }\n}' },
                        { id: 'b7', text: '    for (int i = 0; i < 5; i++) {' } 
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ],
                    successLog: "Loop estruturado com sucesso. Lançamento autorizado."
                },
                {
                    id: 8,
                    concept: "Laço While",
                    story: "A bomba de água deve funcionar ENQUANTO o nível de água for menor que 100 litros.",
                    instruction: "Crie um loop While que incrementa o nível da água.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int agua = 0;' },
                        { id: 'b3', text: '    while (agua < 100) {' },
                        { id: 'b4', text: '        agua += 20;' },
                        { id: 'b5', text: '        System.out.println("Bombeando... " + agua);' },
                        { id: 'b6', text: '    }' },
                        { id: 'b7', text: '  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'], ['b1', 'b2', 'b3', 'b5', 'b4', 'b6', 'b7'] ],
                    successLog: "Condição de parada do While atingida em segurança."
                },
                {
                    id: 9,
                    concept: "Laço Do-While",
                    story: "O sistema de roleta virtual precisa girar PELO MENOS UMA VEZ antes de perguntar se quer parar.",
                    instruction: "Monte a estrutura Do-While para garantir a primeira execução.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    boolean jogar = false;' },
                        { id: 'b3', text: '    do {' },
                        { id: 'b4', text: '        System.out.println("Girando a roleta!");' },
                        { id: 'b5', text: '    } while (jogar == true);' },
                        { id: 'b6', text: '  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ],
                    successLog: "Do-While garantindo execução inicial. Loop finalizado."
                },
                {
                    id: 10,
                    concept: "Arrays (Vetores)",
                    story: "Precisamos armazenar as 3 notas de um aluno em um único lugar na memória.",
                    instruction: "Declare um Array de inteiros e acesse a primeira nota (índice 0).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int[] notas = {8, 7, 9};' },
                        { id: 'b3', text: '    System.out.println("Primeira nota: " + notas[0]);' },
                        { id: 'b4', text: '  }\n}' },
                        { id: 'b5', text: '    System.out.println("Primeira nota: " + notas[1]);' } 
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4'] ],
                    successLog: "Ponteiro de memória acessado corretamente no índice zero."
                },
                {
                    id: 11,
                    concept: "Percorrendo Arrays (For)",
                    story: "A loja precisa listar o nome de todos os produtos do carrinho de compras.",
                    instruction: "Use um laço for e a propriedade .length para ler todo o Array de Strings.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String[] carrinho = {"Mouse", "Teclado", "Monitor"};' },
                        { id: 'b3', text: '    for (int i = 0; i < carrinho.length; i++) {' },
                        { id: 'b4', text: '        System.out.println(carrinho[i]);' },
                        { id: 'b5', text: '    }' },
                        { id: 'b6', text: '  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ],
                    successLog: "Varredura de Array completa. Itens listados."
                },
                {
                    id: 12,
                    concept: "Bibliotecas (Scanner)",
                    story: "Para receber dados do teclado do usuário, precisamos importar a classe Scanner.",
                    instruction: "Importe o Scanner, instancie o objeto e leia uma linha de texto.",
                    blocks: [
                        { id: 'b1', text: 'import java.util.Scanner;' },
                        { id: 'b2', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b3', text: '    Scanner sc = new Scanner(System.in);' },
                        { id: 'b4', text: '    System.out.print("Digite seu nome: ");' },
                        { id: 'b5', text: '    String nome = sc.nextLine();' },
                        { id: 'b6', text: '    sc.close();' },
                        { id: 'b7', text: '  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] ],
                    successLog: "Scanner importado e fechado corretamente para evitar memory leak."
                },
                {
                    id: 13,
                    concept: "Bibliotecas (Random)",
                    story: "Um jogo de RPG precisa simular o lançamento de um dado de 6 faces (1 a 6).",
                    instruction: "Importe o Random e gere um número aleatório de 1 a 6.",
                    blocks: [
                        { id: 'b1', text: 'import java.util.Random;' },
                        { id: 'b2', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b3', text: '    Random gerador = new Random();' },
                        { id: 'b4', text: '    int dado = gerador.nextInt(6) + 1;' },
                        { id: 'b5', text: '    System.out.println("Saiu o número: " + dado);' },
                        { id: 'b6', text: '  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ],
                    successLog: "Semente de aleatoriedade processada. Dado lançado."
                },
                {
                    id: 14,
                    concept: "Manipulação de Strings",
                    story: "O sistema de cadastro de senhas exige que a senha tenha mais de 8 caracteres.",
                    instruction: "Use o método .length() (com parênteses para Strings) para checar o tamanho.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String senha = "minhasenhaforte";' },
                        { id: 'b3', text: '    if (senha.length() > 8) {' },
                        { id: 'b4', text: '        System.out.println("Senha válida!");' },
                        { id: 'b5', text: '    } else {' },
                        { id: 'b6', text: '        System.out.println("Senha muito curta.");' },
                        { id: 'b7', text: '    }\n  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'] ],
                    successLog: "Validação de String concluída. Segurança aprovada."
                },
                {
                    id: 15,
                    concept: "Desafio Lógico: Maior do Array",
                    story: "Precisamos encontrar qual é o produto mais caro dentro da nossa lista de preços.",
                    instruction: "Itere pelo Array e substitua a variável 'maior' quando encontrar um valor superior.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double[] precos = {15.5, 45.0, 10.0, 89.9, 20.0};' },
                        { id: 'b3', text: '    double maior = precos[0];' },
                        { id: 'b4', text: '    for (int i = 1; i < precos.length; i++) {' },
                        { id: 'b5', text: '        if (precos[i] > maior) {' },
                        { id: 'b6', text: '            maior = precos[i];' },
                        { id: 'b7', text: '        }\n    }' },
                        { id: 'b8', text: '    System.out.println("Maior preço: " + maior);' },
                        { id: 'b9', text: '  }\n}' }
                    ],
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'] ],
                    successLog: "Algoritmo de varredura e substituição perfeito. Maior valor localizado!"
                },
                {
                    id: 16, 
                    concept: "Média Aritmética", 
                    story: "Calcule a média de 3 notas de um aluno para ver se ele passou.", 
                    instruction: "Some as notas e divida por 3. Cuidado com os parênteses!",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double n1 = 7.0, n2 = 8.5, n3 = 6.0;' },
                        { id: 'b3', text: '    double media = (n1 + n2 + n3) / 3;' },
                        { id: 'b4', text: '    System.out.println("Média: " + media);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Média calculada respeitando a precedência matemática."
                },
                {
                    id: 17, 
                    concept: "Conversão de Temperatura", 
                    story: "O termômetro do laboratório está em Fahrenheit, mas precisamos em Celsius.", 
                    instruction: "Aplique a fórmula C = (F - 32) / 1.8.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double fahrenheit = 104.0;' },
                        { id: 'b3', text: '    double celsius = (fahrenheit - 32) / 1.8;' },
                        { id: 'b4', text: '    System.out.println(celsius + " graus C");' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Conversão climática efetuada com sucesso."
                },
                {
                    id: 18, 
                    concept: "Tabuada (Laço For)", 
                    story: "A professora pediu um programa que imprima a tabuada do 7.", 
                    instruction: "Use um laço For de 1 a 10 multiplicando o número.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int num = 7;' },
                        { id: 'b3', text: '    for (int i = 1; i <= 10; i++) {' },
                        { id: 'b4', text: '        System.out.println(num + " x " + i + " = " + (num * i));' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Loop de tabuada gerado perfeitamente."
                },
                {
                    id: 19, 
                    concept: "Operadores Lógicos (E)", 
                    story: "Para votar, é preciso ter o título de eleitor E ter 16 anos ou mais.", 
                    instruction: "Use o operador lógico && (AND).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int idade = 17;\n    boolean temTitulo = true;' },
                        { id: 'b3', text: '    if (idade >= 16 && temTitulo == true) {' },
                        { id: 'b4', text: '        System.out.println("Pode votar");' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Validação com múltiplas condições (&&) aprovada."
                },
                {
                    id: 20, 
                    concept: "Operadores Lógicos (OU)", 
                    story: "Promoção no mercado: tem desconto quem é idoso OU quem tem cartão VIP.", 
                    instruction: "Use o operador lógico || (OR).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    boolean idoso = false;\n    boolean cartaoVip = true;' },
                        { id: 'b3', text: '    if (idoso || cartaoVip) {' },
                        { id: 'b4', text: '        System.out.println("Aplicar Desconto!");' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Condição alternativa (||) validou a regra de negócio."
                },
                {
                    id: 21, 
                    concept: "Comparar Strings (.equals)", 
                    story: "Sistemas de login precisam checar se a senha bate. Em Java, Strings usam .equals() e não ==.", 
                    instruction: "Valide a senha usando o método correto de String.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String senha = "java";' },
                        { id: 'b3', text: '    if (senha.equals("java")) {' },
                        { id: 'b4', text: '        System.out.println("Acesso Permitido");' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Strings comparadas corretamente pela sua referência de valor."
                },
                {
                    id: 22, 
                    concept: "Somatório em Loop", 
                    story: "Caixa de supermercado: some os valores de 3 produtos usando um while.", 
                    instruction: "Crie um acumulador e some dentro do laço.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double total = 0.0;\n    int i = 1;' },
                        { id: 'b3', text: '    while (i <= 3) {' },
                        { id: 'b4', text: '        total += 10.5;' },
                        { id: 'b5', text: '        i++;\n    }' },
                        { id: 'b6', text: '    System.out.println("Total: " + total);\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Acumulador somou os valores em repetição."
                },
                {
                    id: 23, 
                    concept: "Troca de Variáveis (Swap)", 
                    story: "Precisamos inverter o conteúdo de dois copos (copo A e copo B) usando um copo auxiliar.", 
                    instruction: "Use uma variável temporária para trocar os valores.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int a = 5, b = 9;' },
                        { id: 'b3', text: '    int aux = a;' },
                        { id: 'b4', text: '    a = b;' },
                        { id: 'b5', text: '    b = aux;' },
                        { id: 'b6', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Lógica clássica de Swap executada com copo auxiliar."
                },
                {
                    id: 24, 
                    concept: "Menor do Array", 
                    story: "Ache o produto mais barato na prateleira.", 
                    instruction: "Semelhante ao maior valor, mas agora testando se é menor.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double[] precos = {50.0, 12.5, 30.0};' },
                        { id: 'b3', text: '    double menor = precos[0];' },
                        { id: 'b4', text: '    for (int i = 1; i < precos.length; i++) {' },
                        { id: 'b5', text: '        if (precos[i] < menor) { menor = precos[i]; }' },
                        { id: 'b6', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Algoritmo encontrou o menor preço no vetor."
                },
                {
                    id: 25, 
                    concept: "Soma de Array", 
                    story: "Calcule o peso total das malas em um voo.", 
                    instruction: "Itere pelo array e acumule a soma de todos os índices.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int[] pesos = {20, 15, 30};' },
                        { id: 'b3', text: '    int soma = 0;' },
                        { id: 'b4', text: '    for (int i = 0; i < pesos.length; i++) {' },
                        { id: 'b5', text: '        soma += pesos[i];' },
                        { id: 'b6', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Totalizador de array funcional."
                },
                {
                    id: 26, 
                    concept: "Número Par em Array", 
                    story: "Filtre e mostre apenas as poltronas pares de um ônibus.", 
                    instruction: "Dentro do loop, use um IF com módulo %.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int[] assentos = {1, 2, 3, 4};' },
                        { id: 'b3', text: '    for (int i = 0; i < assentos.length; i++) {' },
                        { id: 'b4', text: '        if (assentos[i] % 2 == 0) {' },
                        { id: 'b5', text: '            System.out.println(assentos[i]);' },
                        { id: 'b6', text: '        }\n    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Filtro de array operando com sucesso."
                },
                {
                    id: 27, 
                    concept: "Fatorial Clássico", 
                    story: "Na aula de matemática, precisamos do Fatorial de 5 (5 * 4 * 3 * 2 * 1).", 
                    instruction: "Use um for decrescente multiplicando uma variável de resultado.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int fatorial = 1;' },
                        { id: 'b3', text: '    for (int i = 5; i > 0; i--) {' },
                        { id: 'b4', text: '        fatorial *= i;' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Cálculo de fatorial concluído."
                },
                {
                    id: 28, 
                    concept: "Break no Loop", 
                    story: "O detetive procura a palavra 'Culpado' na lista. Ao achar, ele pode parar de procurar imediatamente.", 
                    instruction: "Use a instrução 'break' dentro do IF.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String[] lista = {"Inocente", "Culpado", "Inocente"};' },
                        { id: 'b3', text: '    for (int i = 0; i < lista.length; i++) {' },
                        { id: 'b4', text: '        if (lista[i].equals("Culpado")) {' },
                        { id: 'b5', text: '            System.out.println("Achou!");\n            break;' },
                        { id: 'b6', text: '        }\n    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Laço interrompido corretamente pelo Break."
                },
                {
                    id: 29, 
                    concept: "Continue no Loop", 
                    story: "O sistema deve pular o andar 13 em um prédio de 15 andares.", 
                    instruction: "Use a instrução 'continue' para pular a iteração.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    for (int andar = 1; andar <= 15; andar++) {' },
                        { id: 'b3', text: '        if (andar == 13) {' },
                        { id: 'b4', text: '            continue;' },
                        { id: 'b5', text: '        }' },
                        { id: 'b6', text: '        System.out.println("Andar: " + andar);\n    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "Andar pulado! O 'continue' ignorou a impressão."
                },
                {
                    id: 30, 
                    concept: "String toUpperCase()", 
                    story: "O banco exige que os nomes no cartão de crédito sejam todos MAIÚSCULOS.", 
                    instruction: "Transforme a String chamando .toUpperCase().",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String nome = "maria";' },
                        { id: 'b3', text: '    String cartao = nome.toUpperCase();' },
                        { id: 'b4', text: '    System.out.println(cartao);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Texto convertido para Caixa Alta."
                },
                {
                    id: 31, 
                    concept: "String .contains()", 
                    story: "Verifique se o e-mail digitado contém o símbolo '@'.", 
                    instruction: "Use o método .contains() da classe String.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String email = "teste@site.com";' },
                        { id: 'b3', text: '    if (email.contains("@")) {' },
                        { id: 'b4', text: '        System.out.println("E-mail válido");' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Busca de substring bem sucedida."
                },
                {
                    id: 32, 
                    concept: "String .replace()", 
                    story: "Corrija o erro do teclado que trocou 'a' por '@'.", 
                    instruction: "Substitua caracteres usando .replace().",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String texto = "j@v@";' },
                        { id: 'b3', text: '    String corrigido = texto.replace("@", "a");' },
                        { id: 'b4', text: '    System.out.println(corrigido);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Caracteres trocados com sucesso."
                },
                {
                    id: 33, 
                    concept: "Biblioteca Math (Raiz Quadrada)", 
                    story: "Cálculo de engenharia: descubra a raiz quadrada de 144.", 
                    instruction: "Use o método estático Math.sqrt().",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double numero = 144.0;' },
                        { id: 'b3', text: '    double raiz = Math.sqrt(numero);' },
                        { id: 'b4', text: '    System.out.println(raiz);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Operação da biblioteca java.lang.Math concluída."
                },
                {
                    id: 34, 
                    concept: "Biblioteca Math (Potência)", 
                    story: "Calcule 2 elevado a 8 (Byte).", 
                    instruction: "Use Math.pow(base, expoente).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double resultado = Math.pow(2, 8);' },
                        { id: 'b3', text: '    System.out.println("2^8 = " + resultado);' },
                        { id: 'b4', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4'] ], 
                    successLog: "Exponenciação calculada."
                },
                {
                    id: 35, 
                    concept: "Biblioteca Math (Máximo)", 
                    story: "Entre a velocidade do Carro A e B, o radar multará apenas o maior.", 
                    instruction: "Use Math.max() para descobrir o maior valor diretamente.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int velA = 120, velB = 140;' },
                        { id: 'b3', text: '    int maisRapido = Math.max(velA, velB);' },
                        { id: 'b4', text: '    System.out.println(maisRapido);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Comparador nativo Math identificou o maior inteiro."
                },
                {
                    id: 36, 
                    concept: "Matriz 2D Básica", 
                    story: "O tabuleiro do jogo da velha precisa ser criado. É uma matriz de 3 linhas e 3 colunas.", 
                    instruction: "Declare um array bidimensional de Strings.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String[][] tabuleiro = new String[3][3];' },
                        { id: 'b3', text: '    tabuleiro[0][0] = "X";' },
                        { id: 'b4', text: '    System.out.println(tabuleiro[0][0]);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Matriz bidimensional instanciada na memória."
                },
                {
                    id: 37, 
                    concept: "Switch Case (Strings)", 
                    story: "Sistema de semáforo de trânsito.", 
                    instruction: "Use switch/case validando a String 'VERDE'.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String sinal = "VERDE";' },
                        { id: 'b3', text: '    switch(sinal) {' },
                        { id: 'b4', text: '        case "VERDE":\n            System.out.println("Siga");\n            break;' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Comparação de String via Switch Case ativada (Recurso do Java 7+)."
                },
                {
                    id: 38, 
                    concept: "Ano Bissexto Clássico", 
                    story: "O calendário precisa saber se o ano tem 366 dias (se o módulo por 4 for zero).", 
                    instruction: "Construa o IF simples com módulo.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int ano = 2024;' },
                        { id: 'b3', text: '    if (ano % 4 == 0) {' },
                        { id: 'b4', text: '        System.out.println("Bissexto");' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Cálculo de ano bissexto correto."
                },
                {
                    id: 39, 
                    concept: "Casting de Tipos", 
                    story: "Para dividir 5 por 2 e ter '2.5', precisamos forçar os inteiros a virarem doubles.", 
                    instruction: "Use o Casting explícito colocando (double) antes das variáveis.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int a = 5, b = 2;' },
                        { id: 'b3', text: '    double result = (double) a / (double) b;' },
                        { id: 'b4', text: '    System.out.println(result);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Type Casting feito! Sem perda de precisão flutuante."
                },
                {
                    id: 40, 
                    concept: "Operador Ternário", 
                    story: "O if/else é muito grande? Use o ternário (condicao ? verdadeiro : falso).", 
                    instruction: "Atribua 'Aprovado' ou 'Reprovado' com base na nota em uma única linha.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int nota = 7;' },
                        { id: 'b3', text: '    String status = (nota >= 7) ? "Aprovado" : "Reprovado";' },
                        { id: 'b4', text: '    System.out.println(status);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Operador condicional ternário compilado!"
                },
                {
                    id: 41, 
                    concept: "Constantes (final)", 
                    story: "A gravidade da terra nunca muda, deve ser uma constante.", 
                    instruction: "Declare a variável com a palavra reservada 'final'.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    final double GRAVIDADE = 9.81;' },
                        { id: 'b3', text: '    System.out.println(GRAVIDADE);' },
                        { id: 'b4', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4'] ], 
                    successLog: "Constante imutável criada."
                },
                {
                    id: 42, 
                    concept: "Concatenação Mista", 
                    story: "O sistema de folha de pagamento gera a mensagem final.", 
                    instruction: "Junte Strings e Inteiros usando o sinal de +.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String func = "José";\n    int salario = 3000;' },
                        { id: 'b3', text: '    System.out.println("O funcionário " + func + " recebe " + salario);' },
                        { id: 'b4', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4'] ], 
                    successLog: "Concatenação implícita gerada."
                },
                {
                    id: 43, 
                    concept: "String .substring()", 
                    story: "Preciso extrair apenas o DDD de um telefone celular.", 
                    instruction: "Use substring passando o índice inicial e final (0 e 2).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String fone = "11999999999";' },
                        { id: 'b3', text: '    String ddd = fone.substring(0, 2);' },
                        { id: 'b4', text: '    System.out.println(ddd);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Texto fatiado perfeitamente."
                },
                {
                    id: 44, 
                    concept: "Loop Aninhado (For dentro de For)", 
                    story: "Para imprimir um quadrado de asteriscos, precisamos de linhas e colunas.", 
                    instruction: "Coloque um for para colunas (j) dentro de um for de linhas (i).",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    for (int i = 0; i < 3; i++) {' },
                        { id: 'b3', text: '        for (int j = 0; j < 3; j++) {' },
                        { id: 'b4', text: '            System.out.print("*");\n        }' },
                        { id: 'b5', text: '        System.out.println();\n    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Complexidade O(n^2) rodando com sucesso."
                },
                {
                    id: 45, 
                    concept: "Contador de Caracteres", 
                    story: "Quantas letras 'a' existem na palavra 'banana'?", 
                    instruction: "Percorra a String com um for e use charAt() para checar.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String fruta = "banana";\n    int cont = 0;' },
                        { id: 'b3', text: '    for (int i = 0; i < fruta.length(); i++) {' },
                        { id: 'b4', text: '        if (fruta.charAt(i) == \'a\') { cont++; }' },
                        { id: 'b5', text: '    }\n    System.out.println(cont);\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Análise caractere por caractere (char) feita."
                },
                {
                    id: 46, 
                    concept: "Divisão inteira vs Resto", 
                    story: "Em um relógio, precisamos saber os minutos de 130 segundos (são 2 minutos e 10 segundos).", 
                    instruction: "Use a divisão e o módulo.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int totalSegundos = 130;' },
                        { id: 'b3', text: '    int min = totalSegundos / 60;' },
                        { id: 'b4', text: '    int seg = totalSegundos % 60;' },
                        { id: 'b5', text: '    System.out.println(min + "m e " + seg + "s");\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Aritmética de resto processada."
                },
                {
                    id: 47, 
                    concept: "Sequência de Fibonacci Básica", 
                    story: "Na natureza, a sequência 0, 1, 1, 2, 3... aparece sempre. Gere o próximo termo.", 
                    instruction: "Some os dois anteriores para gerar o atual.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    int a = 0, b = 1;' },
                        { id: 'b3', text: '    int proximo = a + b;' },
                        { id: 'b4', text: '    System.out.println(proximo);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Aritmética matemática de base executada."
                },
                {
                    id: 48, 
                    concept: "String .split()", 
                    story: "Recebemos o dado 'Luiz;25;Brasil', precisamos separar usando o ponto-e-vírgula.", 
                    instruction: "Use o método split() e salve em um Array de Strings.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String csv = "Luiz;25;Brasil";' },
                        { id: 'b3', text: '    String[] partes = csv.split(";");' },
                        { id: 'b4', text: '    System.out.println("Nome: " + partes[0]);' },
                        { id: 'b5', text: '  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "String desmembrada com o delimitador correto."
                },
                {
                    id: 49, 
                    concept: "Checagem Vazia (.isEmpty)", 
                    story: "Não deixe o usuário cadastrar um nome em branco.", 
                    instruction: "Verifique se a String chamando isEmpty() é verdadeira.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    String campo = "";' },
                        { id: 'b3', text: '    if (campo.isEmpty()) {' },
                        { id: 'b4', text: '        System.out.println("Preencha o campo!");' },
                        { id: 'b5', text: '    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5'] ], 
                    successLog: "Validação de preenchimento nulo realizada."
                },
                {
                    id: 50, 
                    concept: "O Desafio Final - Juntando Tudo", 
                    story: "O Banco Central precisa validar transações. A conta tem R$ 100, queremos sacar R$ 30, SE for maior que zero E tiver saldo.", 
                    instruction: "Use Variáveis, Operadores Lógicos e Matemáticos.",
                    blocks: [
                        { id: 'b1', text: 'public class Main {\n  public static void main(String[] args) {' },
                        { id: 'b2', text: '    double saldo = 100.0;\n    double saque = 30.0;' },
                        { id: 'b3', text: '    if (saque > 0 && saque <= saldo) {' },
                        { id: 'b4', text: '        saldo -= saque;' },
                        { id: 'b5', text: '        System.out.println("Novo saldo: " + saldo);' },
                        { id: 'b6', text: '    } else {\n        System.out.println("Erro na transação");\n    }\n  }\n}' }
                    ], 
                    solutions: [ ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] ], 
                    successLog: "PARABÉNS! Lógica completa. Transação efetuada com integridade total!"
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        this.addLog("Iniciando Máquina Virtual Java (JVM)...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
    },
    methods: {
        shuffleArray(array) {
            let shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Classe ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            
            this.chances = 3;
            this.showSolution = false;
            this.currentSolutionDisplay = [];
            
            this.selectedBlocks = [];
            this.availableBlocks = this.shuffleArray(this.currentLevel.blocks);
            this.feedbackMsg = "";
            this.isTyping = false;
        },

        selectBlock(block) {
            this.availableBlocks = this.availableBlocks.filter(b => b.id !== block.id);
            this.selectedBlocks.push(block);
            this.feedbackMsg = "";
        },

        removeBlock(index) {
            const block = this.selectedBlocks.splice(index, 1)[0];
            this.availableBlocks.push(block);
            this.feedbackMsg = "";
        },

        clearBlocks() {
            this.availableBlocks.push(...this.selectedBlocks);
            this.selectedBlocks = [];
            this.feedbackMsg = "";
        },

        async runCode() {
            const userSequence = this.selectedBlocks.map(b => b.id);
            
            const isCorrect = this.currentLevel.solutions.some(solution => {
                return JSON.stringify(solution) === JSON.stringify(userSequence);
            });

            if (isCorrect) {
                this.feedbackType = "success";
                this.feedbackMsg = "Sintaxe Perfeita! Código compilado.";
                this.levelComplete = true;

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2000);

            } else {
                this.chances--; 
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `Erro de Compilação. Restam ${this.chances} tentativa(s). Revise chaves e a ordem!`;
                    this.addLog(`Exception in thread "main". ${this.chances} chances restantes.`, "log-error");
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Tentativas esgotadas!";
                    this.addLog("Build Failed. Verificando repositório de soluções oficiais...", "log-error");
                    this.displaySolution();
                }
            }
        },

        displaySolution() {
            this.showSolution = true;
            const solutionIds = this.currentLevel.solutions[0];
            this.currentSolutionDisplay = solutionIds.map(id => {
                return this.currentLevel.blocks.find(b => b.id === id);
            });
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.levelComplete = false;
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
            }
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                
                const interval = setInterval(() => {
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 20); 
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => {
                        terminal.scrollTop = terminal.scrollHeight;
                    }, 50);
                }
            });
        },

        resetGame() {
            this.currentLevelIndex = 0;
            this.levelComplete = false;
            this.logs = [];
            this.addLog("Limpando cache da JVM. Reiniciando treinamento...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');