const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            userSelection: null,
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            gameFinished: false,
            showNextBtn: false, 
            
            score: 0,
            attempts: 3,
            testResults: [],

            // 50 Níveis de Lógica e Sintaxe Java (Tema: RH)
            levels: [
                {
                    id: 1, concept: "Declaração de String",
                    instruction: "Qual tipo de dado é usado para armazenar o nome de um funcionário?",
                    codeTemplate: ["<span class='keyword'>???</span> nome = <span class='string'>\"Maria Silva\"</span>;"],
                    options: ["string", "String", "char", "Text"],
                    correctAnswer: "String",
                    successLog: "Variável textual compilada com sucesso!",
                    explanation: "Em Java, textos são armazenados na classe 'String', que sempre começa com letra maiúscula."
                },
                {
                    id: 2, concept: "Fim de instrução",
                    instruction: "O que está faltando para finalizar o comando que define o salário base?",
                    codeTemplate: ["<span class='keyword'>double</span> salarioBase = 3500.50<span class='keyword'>???</span>"],
                    options: [":", ".", ",", ";"],
                    correctAnswer: ";",
                    successLog: "Erro de sintaxe corrigido.",
                    explanation: "Toda instrução simples em Java deve obrigatoriamente terminar com um ponto e vírgula (;)."
                },
                {
                    id: 3, concept: "Impressão no Console",
                    instruction: "Qual comando usamos para imprimir o holerite na tela e pular uma linha ao final?",
                    codeTemplate: ["System.out.<span class='keyword'>???</span>(<span class='string'>\"Holerite Gerado\"</span>);"],
                    options: ["print", "log", "println", "write"],
                    correctAnswer: "println",
                    successLog: "Saída de dados configurada.",
                    explanation: "System.out.println() imprime o texto e automaticamente adiciona uma quebra de linha (enter)."
                },
                {
                    id: 4, concept: "Tipos Inteiros",
                    instruction: "Qual é o tipo correto para armazenar um número inteiro, como a quantidade de faltas?",
                    codeTemplate: ["<span class='keyword'>???</span> faltas = 2;"],
                    options: ["int", "float", "Integer", "number"],
                    correctAnswer: "int",
                    successLog: "Variável numérica declarada.",
                    explanation: "'int' é o tipo primitivo padrão para números inteiros (sem casas decimais) em Java."
                },
                {
                    id: 5, concept: "Tipos Decimais",
                    instruction: "O desconto do INSS possui casas decimais. Qual o tipo primitivo mais usado para isso?",
                    codeTemplate: ["<span class='keyword'>???</span> inss = 125.40;"],
                    options: ["int", "double", "decimal", "Float"],
                    correctAnswer: "double",
                    successLog: "Precisão decimal garantida.",
                    explanation: "'double' permite armazenar números de ponto flutuante (com vírgula/casas decimais)."
                },
                {
                    id: 6, concept: "Variáveis Booleanas",
                    instruction: "Precisamos marcar se a pessoa é Estagiária (Sim/Não). Qual o valor para Verdadeiro em Java?",
                    codeTemplate: ["<span class='keyword'>boolean</span> isEstagiario = <span class='keyword'>???</span>;"],
                    options: ["True", "1", "true", "yes"],
                    correctAnswer: "true",
                    successLog: "Estado lógico definido.",
                    explanation: "Literais booleanos em Java são escritos totalmente em minúsculas: 'true' ou 'false'."
                },
                {
                    id: 7, concept: "Método Principal",
                    instruction: "Qual o nome do método principal que a máquina do Java procura para começar a rodar o código?",
                    codeTemplate: ["<span class='keyword'>public static void</span> <span class='func'>???</span>(String[] args) {", "    System.out.println(<span class='string'>\"Iniciando Sistema...\"</span>);", "}"],
                    options: ["start", "init", "main", "run"],
                    correctAnswer: "main",
                    successLog: "Ponto de entrada do programa localizado.",
                    explanation: "Todo programa Java executável precisa do método 'main' como ponto de partida."
                },
                {
                    id: 8, concept: "Inicialização",
                    instruction: "No Java, variáveis locais precisam de um valor inicial. Como atribuímos o valor zero ao bônus?",
                    codeTemplate: ["<span class='keyword'>double</span> bonusAcumulado <span class='keyword'>???</span> 0;"],
                    options: ["==", "=", "=>", "is"],
                    correctAnswer: "=",
                    successLog: "Variável inicializada com sucesso.",
                    explanation: "O operador de atribuição simples é o sinal de igual (=). Ele pega o valor da direita e guarda na variável da esquerda."
                },
                {
                    id: 9, concept: "Concatenação",
                    instruction: "Qual operador matemático é usado em Java para 'juntar' (concatenar) textos e variáveis?",
                    codeTemplate: ["String msg = <span class='string'>\"Olá, \"</span> <span class='keyword'>???</span> nome;"],
                    options: ["&", "concat", "+", "."],
                    correctAnswer: "+",
                    successLog: "Textos concatenados corretamente.",
                    explanation: "O operador '+' em Java soma números, mas se um dos lados for uma String, ele junta os textos."
                },
                {
                    id: 10, concept: "Operação Matemática",
                    instruction: "Para calcular o salário líquido, precisamos SUBTRAIR o desconto do salário bruto.",
                    codeTemplate: ["<span class='keyword'>double</span> liquido = bruto <span class='keyword'>???</span> desconto;"],
                    options: ["+", "-", "/", "*"],
                    correctAnswer: "-",
                    successLog: "Cálculo matemático realizado.",
                    explanation: "O operador '-' é utilizado para realizar subtrações matemáticas básicas."
                },
                {
                    id: 11, concept: "Operador de Igualdade",
                    instruction: "Queremos verificar se a quantidade de faltas é EXATAMENTE igual a zero.",
                    codeTemplate: ["<span class='keyword'>if</span> (faltas <span class='keyword'>???</span> 0) {", "    darPremioAssiduidade();", "}"],
                    options: ["=", "==", "equals", "==="],
                    correctAnswer: "==",
                    successLog: "Operador relacional validado.",
                    explanation: "Para comparar se dois números são iguais, usamos '=='. Lembre-se: um único '=' serve apenas para atribuição."
                },
                {
                    id: 12, concept: "Maior ou Igual",
                    instruction: "O candidato deve ter 18 anos OU MAIS. Qual é o operador de 'maior ou igual'?",
                    codeTemplate: ["<span class='keyword'>if</span> (idade <span class='keyword'>???</span> 18) {", "    contratar();", "}"],
                    options: [">", "<=", "=>", ">="],
                    correctAnswer: ">=",
                    successLog: "Validação de idade aplicada.",
                    explanation: "O operador lógico Maior ou Igual escreve-se '>=' em Java."
                },
                {
                    id: 13, concept: "Comparação de Textos",
                    instruction: "CUIDADO: Para comparar se um TEXTO (String) é igual a 'Diretor', usamos um método específico.",
                    codeTemplate: ["<span class='keyword'>if</span> (cargo.<span class='keyword'>???</span>(<span class='string'>\"Diretor\"</span>)) {", "    liberarAcessoTotal();", "}"],
                    options: ["==", "equals", "contains", "is"],
                    correctAnswer: "equals",
                    successLog: "Comparação segura de Strings realizada.",
                    explanation: "Nunca use '==' para comparar Strings em Java (isso compara o endereço de memória). Use sempre o método '.equals()'."
                },
                {
                    id: 14, concept: "Operador de Negação",
                    instruction: "Como verificamos se um funcionário NÃO está de férias? Qual o operador de inversão lógica (NOT)?",
                    codeTemplate: ["<span class='keyword'>if</span> (<span class='keyword'>???</span>emFerias) {", "    chamarParaReuniao();", "}"],
                    options: ["!", "not", "-", "~"],
                    correctAnswer: "!",
                    successLog: "Lógica booleana invertida com sucesso.",
                    explanation: "O ponto de exclamação '!' inverte um valor booleano. Se era true, vira false, e vice-versa."
                },
                {
                    id: 15, concept: "Operador Lógico E (AND)",
                    instruction: "O bônus só sai se ele bateu a meta E também tem mais de 1 ano de empresa.",
                    codeTemplate: ["<span class='keyword'>if</span> (bateuMeta <span class='keyword'>???</span> anosEmpresa >= 1) {", "    pagarBonus();", "}"],
                    options: ["&", "&&", "and", "||"],
                    correctAnswer: "&&",
                    successLog: "Condição E validada.",
                    explanation: "O operador '&&' exige que as duas condições sejam verdadeiras para o bloco ser executado."
                },
                {
                    id: 16, concept: "Operador Lógico OU (OR)",
                    instruction: "O aviso de manutenção é enviado se a pessoa for do setor de TI OU for da Manutenção.",
                    codeTemplate: ["<span class='keyword'>if</span> (setor.equals(<span class='string'>\"TI\"</span>) <span class='keyword'>???</span> setor.equals(<span class='string'>\"Manutenção\"</span>)) {", "    enviarAlerta();", "}"],
                    options: ["||", "|", "or", "&&"],
                    correctAnswer: "||",
                    successLog: "Condição OU validada.",
                    explanation: "O operador '||' (duas barras verticais) executa o bloco se pelo menos UMA das condições for verdadeira."
                },
                {
                    id: 17, concept: "Estrutura do IF",
                    instruction: "O que usamos para abrir o bloco de código que será executado caso o IF seja verdadeiro?",
                    codeTemplate: ["<span class='keyword'>if</span> (salario < 2000) <span class='keyword'>???</span>", "    aplicarAumento();", "}"],
                    options: ["[", "(", "{", "<"],
                    correctAnswer: "{",
                    successLog: "Escopo de execução delimitado.",
                    explanation: "Chaves '{ }' agrupam múltiplas linhas de código que pertencem a um if, for, while, etc."
                },
                {
                    id: 18, concept: "Estrutura Else",
                    instruction: "Se a condição do 'if' for falsa, qual palavra reservada usamos para criar o caminho alternativo (senão)?",
                    codeTemplate: ["<span class='keyword'>if</span> (aprovado) {", "    contratar();", "} <span class='keyword'>???</span> {", "    enviarEmailRejeicao();", "}"],
                    options: ["otherwise", "else", "elseif", "then"],
                    correctAnswer: "else",
                    successLog: "Fluxo alternativo construído.",
                    explanation: "O 'else' captura qualquer situação que não tenha atendido à condição do 'if' anterior."
                },
                {
                    id: 19, concept: "Estrutura Else If",
                    instruction: "Precisamos testar uma segunda condição ESPECÍFICA caso a primeira falhe (senão, se...).",
                    codeTemplate: ["<span class='keyword'>if</span> (nota >= 8) {", "    contratarPleno();", "} <span class='keyword'>???</span> (nota >= 5) {", "    contratarJunior();", "}"],
                    options: ["else if", "elseif", "elif", "else"],
                    correctAnswer: "else if",
                    successLog: "Condição em cascata aprovada.",
                    explanation: "Em Java, a junção escreve-se separada: 'else if (novaCondicao)'."
                },
                {
                    id: 20, concept: "Operador Ternário",
                    instruction: "Como encurtar um IF simples em uma linha? (Condição [símbolo] valorSeSim : valorSeNao)",
                    codeTemplate: ["String status = (faltas == 0) <span class='keyword'>???</span> <span class='string'>\"Excelente\"</span> : <span class='string'>\"Atenção\"</span>;"],
                    options: ["?", "->", "=>", ":"],
                    correctAnswer: "?",
                    successLog: "Ternário avaliado com sucesso.",
                    explanation: "O operador ternário '?' permite fazer atribuições condicionais rápidas em apenas uma linha."
                },
                {
                    id: 21, concept: "Escopo de Variável",
                    instruction: "O código abaixo dá erro porque o 'imposto' morre dentro do IF. Qual tipo precisamos declarar ANTES do IF para ele sobreviver?",
                    codeTemplate: ["<span class='keyword'>???</span> imposto = 0.0;", "<span class='keyword'>if</span> (salario > 4000) {", "    imposto = salario * 0.1;", "}", "System.out.println(imposto);"],
                    options: ["var", "double", "global", "let"],
                    correctAnswer: "double",
                    successLog: "Variável declarada no escopo superior.",
                    explanation: "Variáveis criadas dentro de chaves { } só existem ali dentro. Para usar depois, declare-a fora do bloco."
                },
                {
                    id: 22, concept: "Estrutura Switch",
                    instruction: "Para evitar 12 'ifs' seguidos verificando o mês, qual estrutura de múltipla escolha usamos?",
                    codeTemplate: ["<span class='keyword'>???</span> (mes) {", "    <span class='keyword'>case</span> 1:", "        System.out.println(<span class='string'>\"Janeiro\"</span>);", "}"],
                    options: ["match", "switch", "choose", "select"],
                    correctAnswer: "switch",
                    successLog: "Menu de opções roteado.",
                    explanation: "O 'switch' avalia a variável passada e pula diretamente para o 'case' correspondente."
                },
                {
                    id: 23, concept: "Parando o Switch",
                    instruction: "Se esquecermos isso, o Java executa o mês 1 e continua executando o 2, 3... O que para o switch?",
                    codeTemplate: ["    <span class='keyword'>case</span> 1:", "        mesNome = <span class='string'>\"Jan\"</span>;", "        <span class='keyword'>???</span>;"],
                    options: ["stop", "exit", "return", "break"],
                    correctAnswer: "break",
                    successLog: "Vazamento de blocos (fall-through) impedido.",
                    explanation: "A palavra 'break' avisa ao programa para sair do bloco switch imediatamente."
                },
                {
                    id: 24, concept: "Switch Default",
                    instruction: "Se o departamento fornecido não for RH, nem TI, qual caso 'padrão' captura os valores inesperados?",
                    codeTemplate: ["    <span class='keyword'>???</span>:", "        nomeDepto = <span class='string'>\"Desconhecido\"</span>;"],
                    options: ["else", "default", "other", "finally"],
                    correctAnswer: "default",
                    successLog: "Caso genérico protegido.",
                    explanation: "O 'default' funciona como o 'else' para a estrutura switch."
                },
                {
                    id: 25, concept: "Laço For (Estrutura)",
                    instruction: "Qual palavra-chave inicia um loop onde sabemos exatamente quantas vezes vai rodar (início; fim; passo)?",
                    codeTemplate: ["<span class='keyword'>???</span> (<span class='keyword'>int</span> i = 1; i <= 12; i++) {", "    somaSalarios += meses[i];", "}"],
                    options: ["loop", "repeat", "for", "while"],
                    correctAnswer: "for",
                    successLog: "Contador de iterações configurado.",
                    explanation: "O laço 'for' é a principal estrutura de repetição contada em Java."
                },
                {
                    id: 26, concept: "Incrementador",
                    instruction: "No final de cada volta do 'for', precisamos somar 1 à variável 'i'. Qual o operador rápido para isso?",
                    codeTemplate: ["<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 0; i < 10; i<span class='keyword'>???</span>)"],
                    options: ["+", "++", "+1", "+="],
                    correctAnswer: "++",
                    successLog: "Passo iterado.",
                    explanation: "'i++' é a abreviação de 'i = i + 1'. Faz o loop avançar."
                },
                {
                    id: 27, concept: "Prevenção de Loop Infinito 1",
                    instruction: "ERRO GRAVE: Este FOR causa um Loop Infinito! O `i` começa em 1, e a condição diz para rodar enquanto `i > 12`. Como consertar para rodar de 1 A 12?",
                    codeTemplate: ["<span class='comment'>// Corrija a condição de parada</span>", "<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 1; i <span class='keyword'>???</span> 12; i++) {", "    pagarMes(i);", "}"],
                    options: [">", "<=", "==", "!="],
                    correctAnswer: "<=",
                    successLog: "Loop infinito corrigido. O sistema voltou a respirar.",
                    explanation: "Para ir de 1 ATÉ 12, a condição central deve ser 'enquanto i for menor ou igual a 12' (i <= 12)."
                },
                {
                    id: 28, concept: "Prevenção de Loop Infinito 2",
                    instruction: "ERRO GRAVE: Este WHILE vai travar o servidor. A fila começa com 5 candidatos. O que está faltando fazer no final do loop?",
                    codeTemplate: ["<span class='keyword'>int</span> fila = 5;", "<span class='keyword'>while</span> (fila > 0) {", "    entrevistar();", "    fila<span class='keyword'>???</span>;", "}"],
                    options: ["++", "--", "+=", "=="],
                    correctAnswer: "--",
                    successLog: "Variável decrementada. Fila esvaziou corretamente.",
                    explanation: "Se a condição depende de 'fila > 0', precisamos DIMINUIR a fila (--), senão ela sempre será 5 e o loop nunca acaba."
                },
                {
                    id: 29, concept: "Laço While",
                    instruction: "Qual comando executa um bloco repetidamente 'ENQUANTO' uma condição for verdadeira (sem ter um contador fixo)?",
                    codeTemplate: ["<span class='keyword'>???</span> (bancoDados.temProximo()) {", "    processarFuncionario();", "}"],
                    options: ["for", "do", "while", "if"],
                    correctAnswer: "while",
                    successLog: "Repetição dinâmica ativada.",
                    explanation: "O 'while' é perfeito para quando não sabemos quantas vezes o loop vai rodar de antemão."
                },
                {
                    id: 30, concept: "Laço Do-While",
                    instruction: "Queremos exibir o menu do sistema de RH PELO MENOS UMA VEZ, e só depois verificar se o usuário quer sair.",
                    codeTemplate: ["<span class='keyword'>???</span> {", "    mostrarMenu();", "} <span class='keyword'>while</span> (opcao != 0);"],
                    options: ["for", "do", "run", "execute"],
                    correctAnswer: "do",
                    successLog: "Execução pós-testada configurada.",
                    explanation: "O 'do-while' garante que o código dentro das chaves seja executado no mínimo uma vez antes de testar a condição."
                },
                {
                    id: 31, concept: "Interrompendo um Loop",
                    instruction: "Estamos procurando o funcionário 'João'. Quando acharmos, como PARAR o 'for' na mesma hora para economizar processamento?",
                    codeTemplate: ["<span class='keyword'>if</span> (nome.equals(<span class='string'>\"João\"</span>)) {", "    achou = true;", "    <span class='keyword'>???</span>;", "}"],
                    options: ["stop", "return", "break", "pause"],
                    correctAnswer: "break",
                    successLog: "Loop abortado prematuramente com sucesso.",
                    explanation: "O 'break' destrói o loop atual (seja for ou while) e pula para o código que vem depois dele."
                },
                {
                    id: 32, concept: "Pulando uma iteração",
                    instruction: "Se o funcionário for Estagiário, não paga FGTS. Como PULAR o resto do bloco e ir logo para o PRÓXIMO funcionário do loop?",
                    codeTemplate: ["<span class='keyword'>if</span> (isEstagiario) {", "    <span class='keyword'>???</span>;", "}", "cobrarFGTS();"],
                    options: ["continue", "skip", "next", "break"],
                    correctAnswer: "continue",
                    successLog: "Ciclo atual ignorado e loop avançado.",
                    explanation: "O 'continue' ignora o código que vem abaixo dele, volta para o topo do loop e passa para a próxima repetição."
                },
                {
                    id: 33, concept: "Atribuição Composta",
                    instruction: "Como simplificamos a conta: `salario = salario + bonus` de uma forma mais curta?",
                    codeTemplate: ["salario <span class='keyword'>???</span> bonus;"],
                    options: ["=+", "++", "+=", "+"],
                    correctAnswer: "+=",
                    successLog: "Soma e atribuição num único passo.",
                    explanation: "O operador '+=' adiciona o valor da direita à variável da esquerda e já salva o resultado nela."
                },
                {
                    id: 34, concept: "Declaração de Arrays",
                    instruction: "Como indicamos ao Java que a variável 'salarios' não é um único double, mas uma LISTA (Vetor) de valores?",
                    codeTemplate: ["<span class='keyword'>double</span><span class='keyword'>???</span> salarios = {3000.0, 4500.0, 6000.0};"],
                    options: ["()", "{}", "[]", "<>"],
                    correctAnswer: "[]",
                    successLog: "Vetor instanciado.",
                    explanation: "Em Java, colchetes '[]' declaram variáveis como sendo Arrays de tamanho fixo."
                },
                {
                    id: 35, concept: "Inicialização Rápida de Array",
                    instruction: "Quais símbolos usamos para abraçar os valores iniciais de um Array logo na declaração?",
                    codeTemplate: ["<span class='keyword'>int</span>[] notasRH = <span class='keyword'>???</span>8, 9, 10<span class='keyword'>???</span>;"],
                    options: ["()", "[]", "{}", "<>"],
                    correctAnswer: "{}",
                    successLog: "Array populado na origem.",
                    explanation: "Chaves '{ }' podem ser usadas para fornecer os valores iniciais de um array em uma única linha."
                },
                {
                    id: 36, concept: "Tamanho do Array",
                    instruction: "Como descobrimos QUANTOS itens existem guardados no array 'nomes'?",
                    codeTemplate: ["<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 0; i < nomes.<span class='keyword'>???</span>; i++)"],
                    options: ["size", "count", "length", "size()"],
                    correctAnswer: "length",
                    successLog: "Dimensão lida corretamente.",
                    explanation: "A propriedade imutável '.length' revela o tamanho de qualquer array em Java."
                },
                {
                    id: 37, concept: "Acesso por Índice",
                    instruction: "A primeira posição de um Array no Java NUNCA é 1. Qual número usamos para ler o primeiro salário?",
                    codeTemplate: ["<span class='keyword'>double</span> primeiroDaLista = salarios[<span class='keyword'>???</span>];"],
                    options: ["1", "0", "-1", "first"],
                    correctAnswer: "0",
                    successLog: "Acesso direto à raiz da memória.",
                    explanation: "Arrays em Java são 'zero-indexed', o que significa que as contagens sempre começam no número zero."
                },
                {
                    id: 38, concept: "Erro de Limites do Array",
                    instruction: "ERRO GRAVE: 'ArrayIndexOutOfBoundsException'. Se o array tem 5 posições, o último índice é o 4. Qual símbolo corrige esse For?",
                    codeTemplate: ["<span class='comment'>// Rodar APENAS nos itens válidos</span>", "<span class='keyword'>for</span> (<span class='keyword'>int</span> i = 0; i <span class='keyword'>???</span> salarios.length; i++)"],
                    options: ["<=", "<", "==", "=>"],
                    correctAnswer: "<",
                    successLog: "Desvio de memória corrigido. Limites respeitados.",
                    explanation: "Como começamos do 0, devemos rodar enquanto for 'menor' (<) que o tamanho, e NUNCA 'menor ou igual' (<=)."
                },
                {
                    id: 39, concept: "Laço For-Each",
                    instruction: "O Java tem um atalho para ler todos os itens de uma lista sem precisar da variável `i`. Qual símbolo separa a variável temporária do array?",
                    codeTemplate: ["<span class='keyword'>for</span> (String nome <span class='keyword'>???</span> listaDeNomes) {", "    System.out.println(nome);", "}"],
                    options: ["in", "->", ":", "="],
                    correctAnswer: ":",
                    successLog: "Iteração simplificada efetuada.",
                    explanation: "Lê-se: 'Para cada nome na (:) listaDeNomes'. É muito mais seguro para evitar erros de índice."
                },
                {
                    id: 40, concept: "Métodos Sem Retorno",
                    instruction: "Este método apaga um registro no banco, mas não devolve nenhum dado pra quem o chamou. Qual seu tipo de retorno?",
                    codeTemplate: ["<span class='keyword'>public static ???</span> <span class='func'>deletarCadastro</span>() {", "    <span class='comment'>// deleta...</span>", "}"],
                    options: ["null", "empty", "void", "static"],
                    correctAnswer: "void",
                    successLog: "Procedimento registrado.",
                    explanation: "A palavra 'void' significa 'vazio'. Avisa ao Java que esse método apenas faz uma ação e não retorna cálculos."
                },
                {
                    id: 41, concept: "Retorno de Métodos",
                    instruction: "Este método calcula a média de avaliações. Qual palavra devolve o resultado final para fora do método?",
                    codeTemplate: ["<span class='keyword'>public static double</span> <span class='func'>calcMedia</span>() {", "    <span class='keyword'>double</span> result = 8.5;", "    <span class='keyword'>???</span> result;", "}"],
                    options: ["send", "yield", "out", "return"],
                    correctAnswer: "return",
                    successLog: "Valor devolvido à pilha de chamadas.",
                    explanation: "'return' injeta o valor de volta no local onde o método foi invocado."
                },
                {
                    id: 42, concept: "Parâmetros de Método",
                    instruction: "O método precisa receber o valor do bônus (com decimais) de quem o chamou. Como declaramos a variável de entrada?",
                    codeTemplate: ["<span class='keyword'>public static void</span> <span class='func'>aplicarBonus</span>(<span class='keyword'>???</span> valor) {", "    salario += valor;", "}"],
                    options: ["var", "double", "int", "String"],
                    correctAnswer: "double",
                    successLog: "Parâmetro mapeado na assinatura do método.",
                    explanation: "Parâmetros funcionam como variáveis locais e precisam que seu tipo seja explicitamente declarado nos parênteses."
                },
                {
                    id: 43, concept: "Conversão de Tipos (Casting)",
                    instruction: "O salário é `double` (4500.99), mas precisamos truncar para guardar num `int` (4500). Como 'forçamos' a perda dos decimais?",
                    codeTemplate: ["<span class='keyword'>double</span> bruto = 4500.99;", "<span class='keyword'>int</span> semCentavos = <span class='keyword'>???</span> bruto;"],
                    options: ["(int)", "int()", "[int]", "parse"],
                    correctAnswer: "(int)",
                    successLog: "Casting explícito realizado. Centavos ignorados.",
                    explanation: "Colocar o tipo entre parênteses ANTES do valor obriga o Java a realizar a conversão, assumindo a perda de dados."
                },
                {
                    id: 44, concept: "Operador de Módulo (Resto)",
                    instruction: "Queremos dividir os dias de limpeza (dias pares vs dias ímpares). Qual operador devolve o RESTO da divisão por 2?",
                    codeTemplate: ["<span class='keyword'>if</span> (dia <span class='keyword'>???</span> 2 == 0) {", "    <span class='comment'>// Dia par</span>", "}"],
                    options: ["/", "\\", "%", "mod"],
                    correctAnswer: "%",
                    successLog: "Lógica de paridade validada.",
                    explanation: "O operador '%' não faz porcentagem em Java. Ele calcula o resto de uma divisão inteira (útil para descobrir pares/ímpares)."
                },
                {
                    id: 45, concept: "Tamanho de Strings",
                    instruction: "Como validar se a pessoa digitou um nome com mais de 3 letras? Ao contrário do Array, na String o tamanho é um MÉTODO.",
                    codeTemplate: ["<span class='keyword'>if</span> (nome.<span class='keyword'>???</span> > 3) {", "    cadastroAceito();", "}"],
                    options: ["length", "length()", "size()", "count()"],
                    correctAnswer: "length()",
                    successLog: "Método invocado. Tamanho textual medido.",
                    explanation: "Em Strings usa-se parênteses: `.length()`. Em Arrays não se usa parênteses: `.length`."
                },
                {
                    id: 46, concept: "Formatação de Texto",
                    instruction: "Para evitar erros no banco de dados, precisamos converter o cargo inteiro para LETRAS MAIÚSCULAS.",
                    codeTemplate: ["String limpo = cargo.<span class='keyword'>???</span>;"],
                    options: ["toUpper()", "toUpperCase()", "upperCase()", "capital()"],
                    correctAnswer: "toUpperCase()",
                    successLog: "String padronizada (caixa alta).",
                    explanation: "A classe String do Java possui o método '.toUpperCase()' para converter toda a cadeia de caracteres."
                },
                {
                    id: 47, concept: "Constantes Lógicas",
                    instruction: "A meta de faturamento anual NUNCA muda depois de definida. Qual modificador tranca essa variável?",
                    codeTemplate: ["<span class='keyword'>??? double</span> META_ANUAL = 500000.0;"],
                    options: ["final", "const", "static", "readonly"],
                    correctAnswer: "final",
                    successLog: "Variável lacrada. Mutação prevenida.",
                    explanation: "Uma variável 'final' no Java, assim que recebe um valor pela primeira vez, não pode mais ser alterada."
                },
                {
                    id: 48, concept: "Bloco Try",
                    instruction: "O cálculo divide o bônus pelos funcionários. Se a equipe for zero, haverá erro fatal! Onde colocamos o código 'arriscado'?",
                    codeTemplate: ["<span class='keyword'>???</span> {", "    <span class='keyword'>double</span> media = bonus / qtdEquipe;", "}"],
                    options: ["try", "attempt", "test", "do"],
                    correctAnswer: "try",
                    successLog: "Área de risco (try) isolada.",
                    explanation: "O bloco 'try' envovle o código propenso a gerar falhas (Exceptions) durante a execução."
                },
                {
                    id: 49, concept: "Bloco Catch",
                    instruction: "E quem 'captura' o erro caso a divisão dê errado no bloco 'try', evitando que a tela do usuário trave?",
                    codeTemplate: ["<span class='keyword'>try</span> {", "    <span class='comment'>...</span>", "} <span class='keyword'>???</span> (Exception e) {", "    System.out.println(<span class='string'>\"A equipe não pode ser zero!\"</span>);", "}"],
                    options: ["handle", "error", "catch", "except"],
                    correctAnswer: "catch",
                    successLog: "Tratamento de Exceção configurado.",
                    explanation: "O 'catch' funciona como uma rede de segurança: ele pega o erro e permite que você dê uma resposta amigável no sistema."
                },
                {
                    id: 50, concept: "Referência Vazia",
                    instruction: "Antes de imprimir o nome do gestor, precisamos garantir que ele realmente foi cadastrado e não está VAZIO na memória.",
                    codeTemplate: ["<span class='keyword'>if</span> (nomeGestor != <span class='keyword'>???</span>) {", "    System.out.println(nomeGestor);", "}"],
                    options: ["0", "empty", "void", "null"],
                    correctAnswer: "null",
                    successLog: "NullPointerException bloqueado com sucesso. SUÍTE COMPLETA!",
                    explanation: "Variáveis de texto e objetos em Java guardam a palavra 'null' quando ainda não receberam nenhum dado."
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
        this.addLog("Inicializando JVM Compiler (Java Lógico)...", "log-info");
        this.addLog("Ambiente: TreinamentoRH -- Build 2.0", "log-info");
        this.addLog("Avaliando 50 desafios de lógica e sintaxe...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1500);
    },
    methods: {
        formatCodeLine(line) {
            if (line.includes("???")) {
                if (this.userSelection) {
                    return line.replace(/(\?\?\?)/g, `<span class="code-slot filled">${this.userSelection}</span>`);
                }
                return line.replace(/(\?\?\?)/g, `<span class="code-slot">?</span>`);
            }
            return line;
        },

        selectOption(option) {
            if (this.isTyping || this.gameFinished || this.showNextBtn) return;
            this.userSelection = option;
            this.feedbackMsg = "";
        },

        async runCode() {
            if (!this.userSelection || this.isTyping || this.gameFinished) return;

            this.isTyping = true;
            const isCorrect = this.userSelection === this.currentLevel.correctAnswer;

            if (isCorrect) {
                // ACERTO
                this.feedbackType = "success";
                this.score++;
                
                this.testResults.push({
                    modulo: this.currentLevel.concept,
                    status: "PASSOU",
                    tentativas: 4 - this.attempts
                });

                await this.typeWriter(`✓ COMPILADO: ${this.currentLevel.successLog}`, "log-success");
                
                setTimeout(() => {
                    this.nextLevel();
                }, 1500);

            } else {
                // ERRO
                this.attempts--;
                
                if (this.attempts > 0) {
                    // Tentar de novo
                    this.feedbackType = "warning";
                    this.feedbackMsg = `Erro de compilação: '${this.userSelection}' gerou um erro de sintaxe ou de lógica.`;
                    await this.typeWriter(`x Warning Log. ${this.attempts} tentativa(s) restante(s).`, "log-warning");
                    this.isTyping = false; 
                } else {
                    // ESGOTOU TENTATIVAS - MOSTRA EXPLICAÇÃO E LIBERA BOTÃO
                    this.feedbackType = "error";
                    this.feedbackMsg = `Incorreto. A sintaxe correta era: "${this.currentLevel.correctAnswer}". ${this.currentLevel.explanation}`;
                    
                    this.testResults.push({
                        modulo: this.currentLevel.concept,
                        status: "FALHOU",
                        tentativas: 3
                    });

                    await this.typeWriter(`! BUILD FAILED. Analise a correção e avance.`, "log-error");
                    
                    this.isTyping = false;
                    this.showNextBtn = true; 
                }
            }
        },

        nextLevel() {
            this.showNextBtn = false;
            
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.userSelection = null;
                this.feedbackMsg = "";
                this.attempts = 3; 
                this.loadLevel();
            } else {
                // FIM DO JOGO
                this.gameFinished = true; 
                this.isTyping = false;
                this.addLog(`=================================`, "log-info");
                this.addLog(`Testes finalizados. Lógica aprovada! Score final: ${this.score}/50`, "log-success");
            }
        },

        async loadLevel() {
            this.isTyping = true;
            let moduleName = this.currentLevel.concept.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '_').replace(/[^\w\s]/gi, '');
            await this.typeWriter(`javac CalculosRH.java --check-logic:${moduleName} ...`, "log-default");
            this.isTyping = false;
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
                    if (!this.logs[currentLogIndex]) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }
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
                }
            });
        },

        // Função de exportação para PDF usando jsPDF adaptada para 50 questões
        exportPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(248, 152, 32); 
            doc.text("Relatório de Avaliação - Lógica e Sintaxe Java", 20, 20);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(50, 50, 50);
            doc.text(`Data da Avaliação: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
            doc.text(`Módulo: Lógica e Estruturas de Controle (Sem OOP)`, 20, 37);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            if (this.score >= 25) { doc.setTextColor(39, 201, 63); } else { doc.setTextColor(244, 67, 54); }
            doc.text(`Pontuação Final: ${this.score} de 50 possíveis.`, 20, 47);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            
            let yPosition = 60;
            doc.text("Conceito Testado", 20, yPosition);
            doc.text("Status", 130, yPosition);
            doc.text("Tentativas", 170, yPosition);
            doc.line(20, yPosition + 2, 190, yPosition + 2); 
            
            yPosition += 8;

            this.testResults.forEach((result, index) => {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.text(`${index + 1}. ${result.modulo}`, 20, yPosition);
                
                if(result.status === "PASSOU") { doc.setTextColor(39, 201, 63); } 
                else { doc.setTextColor(244, 67, 54); }
                
                doc.text(result.status, 130, yPosition);
                doc.setTextColor(0, 0, 0);
                doc.text(`${result.tentativas}`, 175, yPosition);
                
                yPosition += 6;
            });

            doc.save(`avaliacao_logica_java_${new Date().toISOString().slice(0,10)}.pdf`);
        },

        resetGame() {
            this.currentLevelIndex = 0;
            this.userSelection = null;
            this.score = 0;
            this.attempts = 3;
            this.logs = [];
            this.testResults = [];
            this.gameFinished = false;
            this.showNextBtn = false;
            this.addLog("Limpando ambiente e preparando 50 novos testes...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');