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
            
            // Variáveis da Mecânica de Vidas (Chances)
            chances: 3,
            showSolution: false,
            currentSolutionDisplay: [],
            
            // Variáveis de Progresso e Certificado
            totalErros: 0,
            dataAtual: new Date().toLocaleDateString('pt-BR'),
            
            // 20 Desafios baseados no PDF de Funções em Java
            levels: [
                {
                    id: 1, 
                    concept: "Anatomia Básica de um Método", 
                    story: "Em Java, toda sub-rotina é denominada método e deve residir dentro de uma classe. Vamos montar um método simples que apenas executa uma ação, sem retornar valores.", 
                    instruction: "Monte a estrutura de um método estático chamado 'saudacao' que imprime 'Olá' na tela.",
                    blocks: [
                        { id: 'b1', text: 'public static void saudacao() {' },
                        { id: 'b2', text: '    System.out.println("Olá");' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Método compilado com sucesso! Entendemos a base do 'public static void'."
                },
                {
                    id: 2, 
                    concept: "Funções e Cláusula Return", 
                    story: "Diferente de 'void', métodos que geram saída precisam de um tipo de retorno (ex: int, double) e obrigatoriamente da palavra-chave 'return'.", 
                    instruction: "Crie um método chamado 'obterPi' que retorna o valor de PI como double.",
                    blocks: [
                        { id: 'b1', text: 'public static double obterPi() {' },
                        { id: 'b2', text: '    return 3.1415;' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Excelente! O método agora devolve um valor exato para quem o invocar."
                },
                {
                    id: 3, 
                    concept: "Parâmetros de Entrada", 
                    story: "Parâmetros funcionam como uma fôrma. Java exige tipagem explícita para as entradas de um método.", 
                    instruction: "Declare o método 'somar' que recebe dois inteiros 'a' e 'b', e retorne a soma deles.",
                    blocks: [
                        { id: 'b1', text: 'public static int somar(int a, int b) {' },
                        { id: 'b2', text: '    return a + b;' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Parâmetros processados perfeitamente."
                },
                {
                    id: 4, 
                    concept: "Múltiplos Parâmetros do Mesmo Tipo", 
                    story: "Mesmo que os parâmetros sejam do mesmo tipo, o Java exige que você repita o tipo de dado para cada um deles na assinatura.", 
                    instruction: "Monte o método 'calcularVolume' recebendo três variáveis double: l, a, p.",
                    blocks: [
                        { id: 'b1', text: 'public static double calcularVolume(' },
                        { id: 'b2', text: 'double l, double a, double p) {' },
                        { id: 'b3', text: '    return l * a * p;' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Assinatura do método validada e correta!"
                },
                {
                    id: 5, 
                    concept: "Tipos de Dados Diferentes", 
                    story: "Podemos misturar tipos de parâmetros. Veja o exemplo de exibir um perfil simples.", 
                    instruction: "Construa o método 'exibirDados' que recebe uma String 'nome' e um int 'idade'.",
                    blocks: [
                        { id: 'b1', text: 'public static void exibirDados(String nome, int idade) {' },
                        { id: 'b2', text: '    System.out.println(nome);' },
                        { id: 'b3', text: '    System.out.println(idade);' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [
                        ['b1', 'b2', 'b3', 'b4'],
                        ['b1', 'b3', 'b2', 'b4'] // A ordem dos prints não importa tanto
                    ], 
                    successLog: "Tipagens múltiplas declaradas com sucesso."
                },
                {
                    id: 6, 
                    concept: "Caminhos Condicionais com Return", 
                    story: "Se um método tiver if-else e um tipo de retorno, o 'return' deve existir em TODOS os caminhos possíveis da execução.", 
                    instruction: "Crie o método 'verificarAprovacao'. Retorne 'Aprovado' se media >= 7.0, senão, 'Reprovado'.",
                    blocks: [
                        { id: 'b1', text: 'public static String verificarAprovacao(double media) {' },
                        { id: 'b2', text: '    if (media >= 7.0) return "Aprovado";' },
                        { id: 'b3', text: '    else return "Reprovado";' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Perfeito! Você garantiu que o método sempre devolverá uma String."
                },
                {
                    id: 7, 
                    concept: "Exercício Prático 1: Paridade", 
                    story: "Vamos implementar o Exercício 1 do material: verificar se um número é Par ou Ímpar usando um procedimento (void).", 
                    instruction: "Monte o método void 'paridade(int n)' com a lógica de módulo.",
                    blocks: [
                        { id: 'b1', text: 'public static void paridade(int n) {' },
                        { id: 'b2', text: '    if (n % 2 == 0) {' },
                        { id: 'b3', text: '        System.out.println("PAR");' },
                        { id: 'b4', text: '    } else { System.out.println("ÍMPAR"); }' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Verificador de paridade compilado!"
                },
                {
                    id: 8, 
                    concept: "Exercício Prático 2: Conversor de Temperatura", 
                    story: "Criaremos a função 'calcFahrenheit' que recebe graus Celsius e retorna em Fahrenheit.", 
                    instruction: "Implemente a função retornando o cálculo: (c * 9.0/5.0) + 32.0",
                    blocks: [
                        { id: 'b1', text: 'public static double calcFahrenheit(double c) {' },
                        { id: 'b2', text: '    double f = (c * 9.0/5.0) + 32.0;' },
                        { id: 'b3', text: '    return f;' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Conversor matemático validado!"
                },
                {
                    id: 9, 
                    concept: "A Invocação no Main", 
                    story: "Os métodos não rodam sozinhos. Eles precisam ser invocados a partir do método principal 'main'.", 
                    instruction: "Invoque o método 'calcFahrenheit(10.0)', guarde em uma variável e a imprima.",
                    blocks: [
                        { id: 'b1', text: 'public static void main(String[] args) {' },
                        { id: 'b2', text: '    double resultado = calcFahrenheit(10.0);' },
                        { id: 'b3', text: '    System.out.println(resultado);' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Chamada estática bem-sucedida! Método invocado."
                },
                {
                    id: 10, 
                    concept: "Isolamento e Escopo de Variáveis", 
                    story: "Lembre-se: variáveis criadas dentro de um método morrem ao fim dele. Se passamos 'x' e alteramos dentro do método, a cópia original do main fica intacta.", 
                    instruction: "Monte um método 'processar(int x)' que apenas multiplica a cópia local por 2.",
                    blocks: [
                        { id: 'b1', text: 'public static void processar(int x) {' },
                        { id: 'b2', text: '    // x é uma cópia isolada' },
                        { id: 'b3', text: '    x = x * 2;' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Compreensão de passagem por valor estabelecida."
                },
                {
                    id: 11, 
                    concept: "Arrays como Parâmetros (Referência)", 
                    story: "Diferente dos tipos primitivos, Arrays são passados por referência. Se modificarmos o conteúdo do array no método, ele muda no original!", 
                    instruction: "Crie a estrutura do método 'somar' que recebe um array int[] e retorna a soma. Primeiro declare a soma.",
                    blocks: [
                        { id: 'b1', text: 'public static int somar(int[] arr) {' },
                        { id: 'b2', text: '    int soma = 0;' },
                        { id: 'b3', text: '    // Laço virá depois' },
                        { id: 'b4', text: '    return soma;' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Protótipo do método com array aceito!"
                },
                {
                    id: 12, 
                    concept: "Iterando um Array em Função", 
                    story: "Vamos preencher o laço (for) do método de soma da lição anterior utilizando o 'arr.length'.", 
                    instruction: "Complete o corpo usando o for para acumular os valores em 'soma'.",
                    blocks: [
                        { id: 'b1', text: 'for (int i = 0; i < arr.length; i++) {' },
                        { id: 'b2', text: '    soma += arr[i];' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Soma do Array executada com perfeição."
                },
                {
                    id: 13, 
                    concept: "Busca em Array: Maior Elemento", 
                    story: "Exercício prático do PDF: Criar um método buscarMaior que retorne o maior valor do vetor.", 
                    instruction: "Assuma que o índice 0 é o maior inicial. Faça a iteração a partir do índice 1.",
                    blocks: [
                        { id: 'b1', text: 'public static int buscarMaior(int[] a) {' },
                        { id: 'b2', text: '    int m = a[0];' },
                        { id: 'b3', text: '    for (int i = 1; i < a.length; i++) {' },
                        { id: 'b4', text: '        if (a[i] > m) { m = a[i]; }' },
                        { id: 'b5', text: '    }' },
                        { id: 'b6', text: '    return m;' },
                        { id: 'b7', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']], 
                    successLog: "Lógica de detecção de pico implementada no sub-programa."
                },
                {
                    id: 14, 
                    concept: "Passagem por Referência (Alteração)", 
                    story: "Provaremos a passagem por referência. Um método que altera os valores dentro de um array modera o array do escopo que o invocou.", 
                    instruction: "Faça o procedimento 'zerarVetor' que define o valor de todos os elementos para 0.",
                    blocks: [
                        { id: 'b1', text: 'public static void zerarVetor(int[] arr) {' },
                        { id: 'b2', text: '    for (int i = 0; i < arr.length; i++) {' },
                        { id: 'b3', text: '        arr[i] = 0;' },
                        { id: 'b4', text: '    }' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "O array na Heap Memory foi alterado diretamente pelas referências."
                },
                {
                    id: 15, 
                    concept: "Trabalhando com Matrizes (2D)", 
                    story: "Matrizes em Java são arrays de arrays (int[][]). Para percorrê-las, geralmente precisamos de loops aninhados.", 
                    instruction: "Crie o laço duplo que acessa 'mat[i][j]' na função imprimirMatriz.",
                    blocks: [
                        { id: 'b1', text: 'for (int i = 0; i < mat.length; i++) { // Linhas' },
                        { id: 'b2', text: '    for (int j = 0; j < mat[i].length; j++) { // Colunas' },
                        { id: 'b3', text: '        System.out.print(mat[i][j] + " ");' },
                        { id: 'b4', text: '    }' },
                        { id: 'b5', text: '    System.out.println();' },
                        { id: 'b6', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], 
                    successLog: "Matriz acessada linha por linha com sucesso!"
                },
                {
                    id: 16, 
                    concept: "Importação e Criação do ArrayList", 
                    story: "Quando o tamanho dos dados for incerto, fugimos do array fixo para as Coleções. ArrayList<> resolve o problema do redimensionamento.", 
                    instruction: "Importe o pacote e crie um método que instancie e retorne um ArrayList de Integer.",
                    blocks: [
                        { id: 'b1', text: 'import java.util.ArrayList;' },
                        { id: 'b2', text: 'public static ArrayList<Integer> criarLista() {' },
                        { id: 'b3', text: '    ArrayList<Integer> lista = new ArrayList<>();' },
                        { id: 'b4', text: '    return lista;' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Biblioteca java.util inicializada, lista instanciada!"
                },
                {
                    id: 17, 
                    concept: "Métodos Principais de um ArrayList", 
                    story: "Com ArrayList, length vira size(), arr[i] vira get(i), e a atribuição vira set().", 
                    instruction: "Crie o laço que duplica todos os valores de uma 'lista' de inteiros.",
                    blocks: [
                        { id: 'b1', text: 'for (int i = 0; i < lista.size(); i++) {' },
                        { id: 'b2', text: '    int valorAtual = lista.get(i);' },
                        { id: 'b3', text: '    lista.set(i, valorAtual * 2);' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Substituição de operadores por métodos da API de Coleções entendida."
                },
                {
                    id: 18, 
                    concept: "For-Each com ArrayList", 
                    story: "Se não vamos modificar a lista, podemos ler os dados elegantemente usando o laço melhorado (enhanced for ou for-each).", 
                    instruction: "Monte o laço que imprime cada 'numero' da 'lista'.",
                    blocks: [
                        { id: 'b1', text: 'for (int numero : lista) {' },
                        { id: 'b2', text: '    System.out.println(numero);' },
                        { id: 'b3', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3']], 
                    successLog: "Loop de leitura simplificado, código muito mais limpo!"
                },
                {
                    id: 19, 
                    concept: "Filtragem de Dados com ArrayList (Exercício PDF)", 
                    story: "As sub-rotinas brilham como 'filtros'. Vamos criar a função 'filtrarPares' do PDF. Ela recebe uma lista original, cria uma nova apenas com os pares, e a devolve.", 
                    instruction: "Implemente a assinatura, inicialize 'apenasPares' e retorne-a no final (laço fica na entrelinha).",
                    blocks: [
                        { id: 'b1', text: 'public static ArrayList<Integer> filtrarPares(ArrayList<Integer> lista) {' },
                        { id: 'b2', text: '    ArrayList<Integer> apenasPares = new ArrayList<>();' },
                        { id: 'b3', text: '    // for(int num : lista) { ... add(num); }' },
                        { id: 'b4', text: '    return apenasPares;' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Modularização pura: um input entra, uma estrutura nova sai!"
                },
                {
                    id: 20, 
                    concept: "A Lógica de Filtragem Completa", 
                    story: "O teste final. Preencha o corpo do método de filtragem de ArrayList com o for e o if necessários para isolar os números pares.", 
                    instruction: "Use o for-each, verifique o módulo por 2, e adicione na nova lista usando o método 'add'.",
                    blocks: [
                        { id: 'b1', text: 'for (int numero : lista) {' },
                        { id: 'b2', text: '    if (numero % 2 == 0) {' },
                        { id: 'b3', text: '        apenasPares.add(numero);' },
                        { id: 'b4', text: '    }' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Dominamos Sub-rotinas e ArrayLists em Java! Você completou os desafios."
                },
                {
                    id: 21, 
                    concept: "Importação e Uso do Scanner", 
                    story: "Para que um programa não seja estático, precisamos receber dados do usuário. Em Java, utilizamos a classe Scanner. Primeiro, precisamos importá-la e instanciá-la.", 
                    instruction: "Monte a estrutura para importar e inicializar o Scanner recebendo a entrada padrão do sistema.",
                    blocks: [
                        { id: 'b1', text: 'import java.util.Scanner;' },
                        { id: 'b2', text: 'public static void main(String[] args) {' },
                        { id: 'b3', text: '    Scanner sc = new Scanner(System.in);' },
                        { id: 'b4', text: '    // Leitura dos dados' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Scanner instanciado! Agora a JVM pode escutar o teclado do usuário."
                },
                {
                    id: 22, 
                    concept: "Entrada de Usuário + Condicional If-Else", 
                    story: "Com o Scanner instanciado, vamos ler um número inteiro e usar um bloco If-Else para verificar uma condição de acesso.", 
                    instruction: "Leia uma idade usando nextInt() e crie o if-else para validar se o usuário é maior ou menor de idade.",
                    blocks: [
                        { id: 'b1', text: 'System.out.print("Digite sua idade: ");' },
                        { id: 'b2', text: 'int idade = sc.nextInt();' },
                        { id: 'b3', text: 'if (idade >= 18) { System.out.println("Maior de idade"); }' },
                        { id: 'b4', text: 'else { System.out.println("Menor de idade"); }' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Lógica condicional aplicada com sucesso sobre a entrada do usuário."
                },
                {
                    id: 23, 
                    concept: "Criando Menus com Switch Case", 
                    story: "Quando temos muitas condições baseadas em um único valor exato, o Switch Case é mais limpo que vários If-Else. Não se esqueça do 'break'!", 
                    instruction: "Monte um menu simples que lê uma opção e usa switch case para executar a ação correspondente.",
                    blocks: [
                        { id: 'b1', text: 'int opcao = sc.nextInt();' },
                        { id: 'b2', text: 'switch (opcao) {' },
                        { id: 'b3', text: '    case 1: System.out.println("Novo Jogo"); break;' },
                        { id: 'b4', text: '    default: System.out.println("Saindo..."); break;' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Menu montado! O Switch direcionou o fluxo corretamente."
                },
                {
                    id: 24, 
                    concept: "Função com Switch e Retorno", 
                    story: "Em métodos que retornam valor, o 'break' dentro do switch é opcional se você usar o 'return' diretamente nos casos.", 
                    instruction: "Crie a função 'calcularDesconto' que recebe um valor e um tipo de cliente (1 ou 2), retornando o valor descontado via switch.",
                    blocks: [
                        { id: 'b1', text: 'public static double calcularDesconto(double valor, int tipo) {' },
                        { id: 'b2', text: '    switch (tipo) {' },
                        { id: 'b3', text: '        case 1: return valor * 0.90;' },
                        { id: 'b4', text: '        default: return valor;' },
                        { id: 'b5', text: '    }' },
                        { id: 'b6', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], 
                    successLog: "Método construído! O return dentro do case evita que outras condições sejam testadas."
                },
                {
                    id: 25, 
                    concept: "Importação e Uso da Biblioteca Math", 
                    story: "O pacote java.lang contém a classe Math, que oferece métodos estáticos para cálculos avançados, como potência e raiz quadrada.", 
                    instruction: "Monte um método que aplica o Teorema de Pitágoras usando Math.pow() para potência e Math.sqrt() para raiz quadrada.",
                    blocks: [
                        { id: 'b1', text: 'public static double pitagoras(double a, double b) {' },
                        { id: 'b2', text: '    double somaDosQuadrados = Math.pow(a, 2) + Math.pow(b, 2);' },
                        { id: 'b3', text: '    return Math.sqrt(somaDosQuadrados);' },
                        { id: 'b4', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4']], 
                    successLog: "Cálculos avançados executados com sucesso chamando métodos estáticos da classe Math."
                },
                {
                    id: 26, 
                    concept: "Biblioteca Random para Aleatoriedade", 
                    story: "Muitas vezes precisamos gerar números aleatórios, muito útil na criação de jogos ou testes. A classe Random do pacote java.util faz isso perfeitamente.", 
                    instruction: "Importe a biblioteca Random e crie a função 'rolarDado' que retorna um número de 1 a 6.",
                    blocks: [
                        { id: 'b1', text: 'import java.util.Random;' },
                        { id: 'b2', text: 'public static int rolarDado() {' },
                        { id: 'b3', text: '    Random gerador = new Random();' },
                        { id: 'b4', text: '    return gerador.nextInt(6) + 1;' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "O dado foi rolado! Entendemos a injeção de aleatoriedade no Java."
                },
                {
                    id: 27, 
                    concept: "Encadeamento de Condições (If - Else If)", 
                    story: "Quando temos múltiplas condições exclusivas que não dependem de um único valor exato, usamos a cadeia if, else if e else.", 
                    instruction: "Crie a função 'classificarIdade' que retorna 'Criança' (abaixo de 12), 'Adolescente' (abaixo de 18) ou 'Adulto'.",
                    blocks: [
                        { id: 'b1', text: 'public static String classificarIdade(int idade) {' },
                        { id: 'b2', text: '    if (idade < 12) return "Criança";' },
                        { id: 'b3', text: '    else if (idade < 18) return "Adolescente";' },
                        { id: 'b4', text: '    else return "Adulto";' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Fluxo validado! As condições respeitam a hierarquia do topo para baixo."
                },
                {
                    id: 28, 
                    concept: "Calculadora com Switch e Tipos Primitivos Diferentes", 
                    story: "O Switch não aceita apenas inteiros. No Java, ele pode processar o tipo primitivo char. Vamos construir uma operação de calculadora baseada em um caractere.", 
                    instruction: "Crie a função 'operar' que recebe dois doubles, um char de operação ('+', '-') e processa as opções.",
                    blocks: [
                        { id: 'b1', text: 'public static double operar(double a, double b, char op) {' },
                        { id: 'b2', text: '    switch (op) {' },
                        { id: 'b3', text: '        case \'+\': return a + b;' },
                        { id: 'b4', text: '        case \'-\': return a - b;' },
                        { id: 'b5', text: '        default: return 0.0;' },
                        { id: 'b6', text: '    }' },
                        { id: 'b7', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']], 
                    successLog: "Calculadora tática implementada comparando caracteres ASCII."
                },
                {
                    id: 29, 
                    concept: "Preenchendo um Array com Scanner", 
                    story: "Podemos automatizar a coleta de dados misturando vetores, laços de repetição e o método nextLine() do Scanner.", 
                    instruction: "Instancie o Scanner, crie um array de Strings com 3 posições e monte o for para registrar os nomes digitados.",
                    blocks: [
                        { id: 'b1', text: 'Scanner sc = new Scanner(System.in);' },
                        { id: 'b2', text: 'String[] nomes = new String[3];' },
                        { id: 'b3', text: 'for (int i = 0; i < 3; i++) {' },
                        { id: 'b4', text: '    System.out.print("Nome: ");' },
                        { id: 'b5', text: '    nomes[i] = sc.nextLine();' },
                        { id: 'b6', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], 
                    successLog: "Dados inseridos sequencialmente no array usando laço de repetição e Scanner!"
                },
                {
                    id: 30, 
                    concept: "Lógica Condicional em Funções Recursivas", 
                    story: "Uma função recursiva chama a si mesma. Para não virar um loop infinito, ela precisa de uma 'condição de parada' feita com um if-else.", 
                    instruction: "Implemente a função de calcular o Fatorial de 'n'. Se n for 0, o método retorna 1, senão retorna n * fatorial(n - 1).",
                    blocks: [
                        { id: 'b1', text: 'public static int calcularFatorial(int n) {' },
                        { id: 'b2', text: '    if (n == 0) {' },
                        { id: 'b3', text: '        return 1;' },
                        { id: 'b4', text: '    } else {' },
                        { id: 'b5', text: '        return n * calcularFatorial(n - 1);' },
                        { id: 'b6', text: '    }' },
                        { id: 'b7', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']], 
                    successLog: "Recursividade executada com segurança! A condição de parada impediu o StackOverflow."
                },
                {
                    id: 31, 
                    concept: "Agrupando Casos no Switch Case", 
                    story: "Diferente do If, se você omitir o 'break' propositalmente, o Switch continuará descendo. Isso é ótimo para agrupar testes que geram o mesmo resultado.", 
                    instruction: "Leia um mês numérico e monte os casos para a estação Verão (12, 1, 2) agrupados no switch.",
                    blocks: [
                        { id: 'b1', text: 'int mes = sc.nextInt();' },
                        { id: 'b2', text: 'switch(mes) {' },
                        { id: 'b3', text: '    case 12: case 1: case 2:' },
                        { id: 'b4', text: '        System.out.println("Verão"); break;' },
                        { id: 'b5', text: '    default: System.out.println("Outra estação");' },
                        { id: 'b6', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], 
                    successLog: "Fall-through do switch manipulado a seu favor. Menos código, mais limpeza."
                },
                {
                    id: 32, 
                    concept: "Condicionais com Operadores Lógicos Avançados", 
                    story: "Podemos economizar muitas linhas de código usando operadores AND (&&) e OR (||) diretamente em uma única instrução if.", 
                    instruction: "Construa o método 'ehBissexto' que retorna true se o ano for divisível por 4 E não por 100, OU divisível por 400.",
                    blocks: [
                        { id: 'b1', text: 'public static boolean ehBissexto(int ano) {' },
                        { id: 'b2', text: '    if ((ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0) {' },
                        { id: 'b3', text: '        return true;' },
                        { id: 'b4', text: '    } else { return false; }' },
                        { id: 'b5', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Expressões booleanas combinadas com mestria na mesma cláusula de decisão."
                },
                {
                    id: 33, 
                    concept: "Switch Case Utilizando Strings", 
                    story: "Desde o Java 7, o Switch Case é compatível com Strings. Lembre-se sempre de padronizar a caixa (maiúscula/minúscula) para evitar erros de validação.", 
                    instruction: "Implemente um método que recebe uma sigla de idioma, usa toLowerCase() e utiliza switch case com Strings.",
                    blocks: [
                        { id: 'b1', text: 'public static void saudarUsuario(String sigla) {' },
                        { id: 'b2', text: '    switch (sigla.toLowerCase()) {' },
                        { id: 'b3', text: '        case "pt": System.out.println("Olá!"); break;' },
                        { id: 'b4', text: '        case "en": System.out.println("Hello!"); break;' },
                        { id: 'b5', text: '    }' },
                        { id: 'b6', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6']], 
                    successLog: "Correspondência de padrões utilizando Strings efetuada e validada."
                },
                {
                    id: 34, 
                    concept: "Cálculos Múltiplos e Scanner Completo", 
                    story: "Vamos construir o algoritmo matemático clássico do cálculo do IMC coletando dados de entrada do tipo ponto flutuante (double).", 
                    instruction: "Colete o peso e a altura pelo Scanner e faça o cálculo IMC usando divisão e a classe Math.pow().",
                    blocks: [
                        { id: 'b1', text: 'Scanner sc = new Scanner(System.in);' },
                        { id: 'b2', text: 'double peso = sc.nextDouble();' },
                        { id: 'b3', text: 'double altura = sc.nextDouble();' },
                        { id: 'b4', text: 'double imc = peso / Math.pow(altura, 2);' },
                        { id: 'b5', text: 'System.out.println("Seu IMC é: " + imc);' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5']], 
                    successLog: "Sistema de saúde calculado perfeitamente com os double types!"
                },
                {
                    id: 35, 
                    concept: "A Grande Integração: Estrutura Java Completa", 
                    story: "O teste absoluto. Vamos montar um programa de uma via completa: importar a biblioteca, declarar a classe principal, abrir o main, e colocar a lógica de verificação em um if-else.", 
                    instruction: "Reconstrua o programa básico que lê um número e diz se ele é positivo de ponta a ponta.",
                    blocks: [
                        { id: 'b1', text: 'import java.util.Scanner;' },
                        { id: 'b2', text: 'public static void main(String[] args) {' },
                        { id: 'b3', text: '    Scanner sc = new Scanner(System.in);' },
                        { id: 'b4', text: '    int valor = sc.nextInt();' },
                        { id: 'b5', text: '    if (valor > 0) { System.out.println("Positivo"); }' },
                        { id: 'b6', text: '    else { System.out.println("Zero ou Negativo"); }' },
                        { id: 'b7', text: '}' }
                    ],
                    solutions: [['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']], 
                    successLog: "SISTEMA PRINCIPAL 100% OPERACIONAL! Você consolidou toda a estrutura de bibliotecas, entrada de dados e condicionais de funções!"
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
        this.carregarProgresso();
        this.addLog("Iniciando JVM (Java Virtual Machine)...", "log-info");
        this.addLog("Verificando classpath e JDK...", "log-info");
        setTimeout(() => { this.loadLevel(); }, 1000);
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
            await this.typeWriter(`Carregando Laboratório ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
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
            if (this.levelComplete || this.isTyping) return;

            const userSequence = this.selectedBlocks.map(b => b.id);
            const isCorrect = this.currentLevel.solutions.some(solution => {
                return JSON.stringify(solution) === JSON.stringify(userSequence);
            });

            if (isCorrect) {
                this.feedbackType = "success";
                this.feedbackMsg = "Sintaxe Válida! Compilação executada com sucesso.";
                this.levelComplete = true; 
                await this.typeWriter(this.currentLevel.successLog, "log-success");
                setTimeout(() => { this.nextLevel(); }, 2000);
            } else {
                this.chances--; 
                this.totalErros++; 
                this.salvarProgresso();
                
                if (this.chances > 0) {
                    this.feedbackType = "error";
                    this.feedbackMsg = `Compile Time Error: Tentativas restantes: ${this.chances}. Revise o bloco de código!`;
                    this.addLog(`Exception in thread "main" java.lang.Error: Unresolved compilation problem. Vidas estouradas: ${3 - this.chances}.`, "log-error");
                } else {
                    this.feedbackType = "error";
                    this.feedbackMsg = "Falha crítica na compilação do código Java!";
                    this.addLog("SyntaxError: Revelando gabarito estrutural...", "log-error");
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
                this.salvarProgresso();
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
                this.salvarProgresso();
                this.addLog("[SISTEMA] Parabéns! Todos os conceitos de Funções em Java foram concluídos.", "log-success");
            }
        },

        salvarProgresso() {
            const saveDado = { nivel: this.currentLevelIndex, erros: this.totalErros };
            localStorage.setItem('java_functions_save', JSON.stringify(saveDado));
        },

        carregarProgresso() {
            const saveSalvo = localStorage.getItem('java_functions_save');
            if (saveSalvo) {
                try {
                    const dados = JSON.parse(saveSalvo);
                    this.currentLevelIndex = parseInt(dados.nivel, 10) || 0;
                    this.totalErros = parseInt(dados.erros, 10) || 0;
                    if(this.currentLevelIndex > 0 && this.currentLevelIndex < this.levels.length) {
                        this.addLog(`[SISTEMA] Progresso restaurado a partir do Nível ${this.currentLevelIndex + 1}.`, "log-success");
                    }
                } catch(e) {
                    console.error("Erro ao ler o arquivo de save:", e);
                }
            }
        },

        resetGame() {
            if(confirm("Isso apagará todo o seu progresso no curso de Java. Tem certeza?")) {
                localStorage.removeItem('java_functions_save');
                this.currentLevelIndex = 0;
                this.totalErros = 0;
                this.levelComplete = false;
                this.logs = [];
                this.addLog("Limpando memória da JVM...", "log-info");
                setTimeout(() => this.loadLevel(), 1000);
            }
        },

        exportarPDF() {
            const elemento = document.getElementById('relatorio-pdf');
            if (elemento) {
                elemento.style.display = 'block'; 
                const opt = {
                    margin:       10,
                    filename:     `Certificado-Java-Functions-${Date.now()}.pdf`,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                html2pdf().set(opt).from(elemento).save().then(() => {
                    elemento.style.display = 'none';
                });
            } else {
                console.warn("Elemento 'relatorio-pdf' não encontrado na view principal.");
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
                }, 15); 
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(() => { terminal.scrollTop = terminal.scrollHeight; }, 50);
                }
            });
        }
    }
}).mount('#app');