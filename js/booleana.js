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
        const showAnswer = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        
        const maxAttempts = 3;

        // --- Banco de 60 Questões Focadas em Lógica Booleana (Revisado e Didático) ---
        const questions = ref([
            { id: 1, instruction: "Operador AND (Teoria)", scenario: "Analisando a porta lógica AND (E).", text: "A operação AND retorna 1 (Verdadeiro) apenas quando:", options: ["Qualquer uma das entradas for 1 (Verdadeiro).", "Ambas as entradas forem 1 (Verdadeiro).", "As entradas forem diferentes.", "Ambas as entradas forem 0 (Falso)."], answer: "Ambas as entradas forem 1 (Verdadeiro).", explanation: "Na Tabela-Verdade do AND, o resultado só é 1 (V) se todas as condições forem 1 (V) simultaneamente. Ex: 1 AND 1 = 1." },
            { id: 2, instruction: "Operador OR (Teoria)", scenario: "Analisando a porta lógica OR (OU).", text: "A operação OR retorna 0 (Falso) apenas quando:", options: ["Ambas as entradas forem 1 (Verdadeiro).", "As entradas forem diferentes.", "Ambas as entradas forem 0 (Falso).", "Qualquer uma das entradas for 0 (Falso)."], answer: "Ambas as entradas forem 0 (Falso).", explanation: "Na Tabela-Verdade do OR, basta que uma única entrada seja 1 (V) para o resultado ser 1. Logo, a única forma de obter 0 (F) é se todas as entradas forem 0 (F)." },
            { id: 3, instruction: "Operador NOT (Teoria)", scenario: "Analisando a porta lógica NOT (NÃO).", text: "Qual é a função do operador unário NOT?", options: ["Somar as entradas.", "Inverter o valor lógico da entrada.", "Garantir que a saída seja sempre 1 (Verdadeiro).", "Comparar duas variáveis."], answer: "Inverter o valor lógico da entrada.", explanation: "O NOT atua como um inversor na Tabela-Verdade: transforma 0 (Falso) em 1 (Verdadeiro) e 1 (Verdadeiro) em 0 (Falso)." },
            { id: 4, instruction: "Tabela-Verdade AND", scenario: "Dadas as variáveis A = 1 (Verdadeiro) e B = 0 (Falso).", text: "Qual é o resultado da expressão S = A AND B?", options: ["1 (Verdadeiro)", "0 (Falso)", "Nulo", "Depende do contexto"], answer: "0 (Falso)", explanation: "Substituindo: 1 (V) AND 0 (F). A Tabela-Verdade do AND exige que ambas sejam 1 para a saída ser 1. Logo, resulta em 0 (Falso)." },
            { id: 5, instruction: "Tabela-Verdade OR", scenario: "Dadas as variáveis A = 0 (Falso) e B = 1 (Verdadeiro).", text: "Qual é o resultado da expressão S = A OR B?", options: ["0 (Falso)", "1 (Verdadeiro)", "Ambos", "Nenhum"], answer: "1 (Verdadeiro)", explanation: "Substituindo: 0 (F) OR 1 (V). A Tabela-Verdade do OR diz que basta um 1 para a saída ser 1. Logo, resulta em 1 (Verdadeiro)." },
            { id: 6, instruction: "Operador XOR (Teoria)", scenario: "A porta lógica XOR (OU Exclusivo).", text: "A porta XOR retorna 1 (Verdadeiro) apenas quando:", options: ["As entradas são iguais.", "As entradas são diferentes.", "Ambas são 1 (Verdadeiro).", "Ambas são 0 (Falso)."], answer: "As entradas são diferentes.", explanation: "O XOR (Exclusivo) significa 'um ou outro, mas nunca ambos'. Na Tabela-Verdade, 1 XOR 0 = 1, e 0 XOR 1 = 1. Entradas iguais resultam em 0 (Falso)." },
            { id: 7, instruction: "Operador NAND (Teoria)", scenario: "A porta lógica NAND (NOT AND).", text: "A porta NAND é equivalente a qual combinação de operadores?", options: ["Uma porta OR seguida de NOT.", "Uma porta AND seguida de NOT.", "Uma porta NOT seguida de OR.", "Duas portas AND em paralelo."], answer: "Uma porta AND seguida de NOT.", explanation: "NAND é a negação do AND. Primeiro resolve-se o AND, depois inverte-se o resultado. Onde o AND daria 1 (V), o NAND dá 0 (F)." },
            { id: 8, instruction: "Operador NOR (Teoria)", scenario: "A porta lógica NOR (NOT OR).", text: "Qual é a saída de uma porta NOR se ambas as entradas forem 0 (Falso)?", options: ["0 (Falso)", "1 (Verdadeiro)", "Indefinido", "Oscilante"], answer: "1 (Verdadeiro)", explanation: "Primeiro o OR: 0 OR 0 resulta em 0 (F). Depois o NOT inverte esse resultado. Logo, a saída final do NOR é 1 (Verdadeiro)." },
            { id: 9, instruction: "Álgebra Booleana: Identidade OR", scenario: "Propriedade da Identidade.", text: "Na Álgebra Booleana, a expressão A OR 0 (Falso) é sempre equivalente a:", options: ["0 (Falso)", "1 (Verdadeiro)", "A (O próprio valor de A)", "NOT A"], answer: "A (O próprio valor de A)", explanation: "O 0 (F) é neutro no OR. Se A for 1, 1 OR 0 = 1. Se A for 0, 0 OR 0 = 0. O resultado sempre espelha o valor de A." },
            { id: 10, instruction: "Álgebra Booleana: Identidade AND", scenario: "Propriedade da Identidade.", text: "A expressão A AND 1 (Verdadeiro) é equivalente a:", options: ["A (O próprio valor de A)", "1 (Verdadeiro)", "0 (Falso)", "NOT A"], answer: "A (O próprio valor de A)", explanation: "O 1 (V) é neutro no AND. Se A for 1, 1 AND 1 = 1. Se A for 0, 0 AND 1 = 0. O resultado final depende exclusivamente de A." },
            { id: 11, instruction: "Álgebra Booleana: Anulação OR", scenario: "Propriedade da Anulação.", text: "A expressão A OR 1 (Verdadeiro) sempre resultará em:", options: ["A (Depende de A)", "0 (Falso)", "1 (Verdadeiro)", "Indeterminado"], answer: "1 (Verdadeiro)", explanation: "Na operação OR, basta que um lado seja 1 (V) para o resultado ser 1. Logo, A OR 1 sempre será 1 (Verdadeiro), anulando o efeito de A." },
            { id: 12, instruction: "Álgebra Booleana: Anulação AND", scenario: "Propriedade da Anulação.", text: "A expressão A AND 0 (Falso) sempre resultará em:", options: ["A", "0 (Falso)", "1 (Verdadeiro)", "A AND 1"], answer: "0 (Falso)", explanation: "A operação AND exige que todos sejam 1 (V). Como já temos um 0 (F) na expressão, é impossível o resultado ser verdadeiro. A saída é forçada a 0." },
            { id: 13, instruction: "Álgebra Booleana: Idempotência", scenario: "Propriedade da Idempotência.", text: "A expressão A AND A é simplificada para:", options: ["1 (Verdadeiro)", "0 (Falso)", "A (O próprio valor)", "2A"], answer: "A (O próprio valor)", explanation: "Operar uma variável com ela mesma não altera seu estado. 1 AND 1 = 1 (V); 0 AND 0 = 0 (F)." },
            { id: 14, instruction: "Álgebra Booleana: Complemento OR", scenario: "Propriedade do Complemento.", text: "O que resulta a expressão A OR (NOT A)?", options: ["A", "NOT A", "0 (Falso)", "1 (Verdadeiro)"], answer: "1 (Verdadeiro)", explanation: "Se A for 1, (NOT A) é 0. Se A for 0, (NOT A) é 1. Como sempre teremos um 1 (V) na equação, a operação OR sempre resultará em 1 (Verdadeiro)." },
            { id: 15, instruction: "Álgebra Booleana: Complemento AND", scenario: "Propriedade do Complemento.", text: "O que resulta a expressão A AND (NOT A)?", options: ["0 (Falso)", "1 (Verdadeiro)", "A", "Depende de A"], answer: "0 (Falso)", explanation: "Uma variável e seu inverso nunca podem ser 1 (V) ao mesmo tempo. Como o AND exige ambos verdadeiros, essa expressão sempre falha e resulta em 0 (Falso)." },
            { id: 16, instruction: "Dupla Negação", scenario: "Propriedade da Involução.", text: "Qual é o resultado lógico de NOT (NOT A)?", options: ["0 (Falso)", "1 (Verdadeiro)", "A (Valor original)", "NOT A"], answer: "A (Valor original)", explanation: "Negar uma variável duas vezes a devolve ao seu estado inicial. Se A = 1 (V), NOT A = 0 (F), e NOT (0) volta a ser 1 (V)." },
            { id: 17, instruction: "Leis de De Morgan 1", scenario: "Transformação de operadores.", text: "Segundo De Morgan, a negação de um AND: NOT (A AND B) equivale a:", options: ["(NOT A) AND (NOT B)", "(NOT A) OR (NOT B)", "A OR B", "A AND B"], answer: "(NOT A) OR (NOT B)", explanation: "A negação de uma conjunção (AND) transforma-se na disjunção (OR) das variáveis negadas individualmente." },
            { id: 18, instruction: "Leis de De Morgan 2", scenario: "Transformação de operadores.", text: "Segundo De Morgan, a negação de um OR: NOT (A OR B) equivale a:", options: ["(NOT A) OR (NOT B)", "(NOT A) AND (NOT B)", "NOT A AND B", "A AND NOT B"], answer: "(NOT A) AND (NOT B)", explanation: "A negação de uma disjunção (OR) transforma-se na conjunção (AND) das variáveis negadas individualmente." },
            { id: 19, instruction: "Expressões Compostas", scenario: "Avaliação passo a passo.", text: "Resolva: (1 AND 0) OR (1 AND 1)", options: ["0 (Falso)", "1 (Verdadeiro)", "Falta informação", "Invalido"], answer: "1 (Verdadeiro)", explanation: "1º Passo: (1 AND 0) resulta em 0 (F). 2º Passo: (1 AND 1) resulta em 1 (V). 3º Passo: Ficamos com 0 OR 1. Na tabela do OR, 0 OR 1 = 1 (Verdadeiro)." },
            { id: 20, instruction: "Expressões Compostas", scenario: "Avaliação com NOT.", text: "Resolva: NOT (1 OR 0) AND 1", options: ["1 (Verdadeiro)", "0 (Falso)", "Erro de sintaxe", "NOT 1"], answer: "0 (Falso)", explanation: "1º Passo: (1 OR 0) resulta em 1 (V). 2º Passo: O NOT inverte esse 1, virando 0 (F). 3º Passo: Ficamos com 0 AND 1, que resulta em 0 (Falso)." },
            { id: 21, instruction: "Porta XNOR (Teoria)", scenario: "A porta XNOR (Não-OU Exclusivo).", text: "A porta XNOR retorna 1 (Verdadeiro) quando as entradas são:", options: ["Diferentes", "Iguais", "Sempre 0", "Sempre 1"], answer: "Iguais", explanation: "XNOR é a inversa da XOR. Funciona como um comparador de igualdade: retorna 1 (V) se as duas entradas forem 0 (F) ou se as duas entradas forem 1 (V)." },
            { id: 22, instruction: "Propriedade Comutativa", scenario: "Álgebra Booleana Básica.", text: "A regra A OR B = B OR A representa qual lei?", options: ["Associativa", "Distributiva", "Comutativa", "Absorção"], answer: "Comutativa", explanation: "Assim como na matemática básica, a ordem dos fatores não altera o resultado em operações AND ou OR." },
            { id: 23, instruction: "Propriedade Associativa", scenario: "Agrupamento lógico.", text: "A expressão A AND (B AND C) = (A AND B) AND C. Isso reflete a lei:", options: ["Distributiva", "De Morgan", "Associativa", "Idempotente"], answer: "Associativa", explanation: "Indica que o agrupamento dos parênteses em sequências de operadores idênticos (tudo AND ou tudo OR) não muda o resultado." },
            { id: 24, instruction: "Propriedade Distributiva", scenario: "Expansão lógica.", text: "A expressão A AND (B OR C) é equivalente a:", options: ["(A AND B) OR (A AND C)", "A OR (B AND C)", "(A OR B) AND (A OR C)", "A AND B AND C"], answer: "(A AND B) OR (A AND C)", explanation: "O operador AND fora do parênteses distribui-se ('chuveirinho') sobre as variáveis dentro do OR." },
            { id: 25, instruction: "Lei da Absorção 1", scenario: "Simplificação lógica.", text: "A expressão A OR (A AND B) pode ser reduzida para qual valor?", options: ["B", "A", "A OR B", "1 (Verdadeiro)"], answer: "A", explanation: "Se A=1(V), 1 OR qualquer coisa = 1. Se A=0(F), 0 OR (0 AND B) = 0. Ou seja, o resultado depende apenas de A. A 'absorve' a variável B." },
            { id: 26, instruction: "Lei da Absorção 2", scenario: "Simplificação lógica.", text: "A expressão A AND (A OR B) pode ser reduzida para qual valor?", options: ["A", "B", "A AND B", "0 (Falso)"], answer: "A", explanation: "Se A=0(F), 0 AND qualquer coisa = 0. Se A=1(V), 1 AND (1 OR B) = 1 AND 1 = 1. O resultado espelha A." },
            { id: 27, instruction: "Universalidade das Portas", scenario: "Circuitos Lógicos.", text: "Quais portas são consideradas 'Universais' porque sozinhas podem construir qualquer circuito lógico (AND, OR, NOT)?", options: ["AND e OR", "NAND e NOR", "XOR e XNOR", "NOT e AND"], answer: "NAND e NOR", explanation: "Através da interligação inteligente de portas NAND (ou de portas NOR), é possível criar o comportamento da Tabela-Verdade de qualquer outra porta." },
            { id: 28, instruction: "Programação Prática", scenario: "Código: `if (x > 5 && x < 10)`", text: "O operador `&&` na programação equivale a qual porta lógica?", options: ["OR", "XOR", "AND", "NOT"], answer: "AND", explanation: "O operador `&&` (E lógico) exige que ambas as comparações sejam 1 (Verdadeiras) para que o bloco IF seja executado." },
            { id: 29, instruction: "Programação Prática", scenario: "Código: `if (usuario === 'admin' || token_valido)`", text: "O operador `||` na programação equivale a qual porta lógica?", options: ["AND", "OR", "XNOR", "NAND"], answer: "OR", explanation: "O operador `||` (OU lógico) permite a execução se pelo menos uma das condições resultar em 1 (Verdadeiro)." },
            { id: 30, instruction: "Curto-Circuito (Short-Circuit) AND", scenario: "Otimização em linguagens de programação.", text: "Na expressão lógica `A && B`, se `A` for 0 (Falso), o que o computador faz?", options: ["Avalia B e retorna erro", "Avalia B para ter certeza", "Ignora B e já retorna 0 (Falso)", "Transforma a expressão em OR"], answer: "Ignora B e já retorna 0 (Falso)", explanation: "Como a porta AND precisa que TODOS sejam verdadeiros, um único 0 (F) no início já define a resposta inteira como 0, economizando processamento." },
            { id: 31, instruction: "Curto-Circuito (Short-Circuit) OR", scenario: "Otimização em linguagens de programação.", text: "Na expressão `A || B`, se `A` for 1 (Verdadeiro), o que ocorre?", options: ["O programa trava", "B deve ser avaliado também", "Ignora B e já retorna 1 (Verdadeiro)", "B é avaliado para conferência"], answer: "Ignora B e já retorna 1 (Verdadeiro)", explanation: "Em um OR lógico, basta que a primeira condição seja 1 (V). O sistema já sabe que o resultado final será verdadeiro e ignora o resto da linha." },
            { id: 32, instruction: "Bit a Bit: AND", scenario: "Operações binárias coluna por coluna.", text: "Qual o resultado do Bitwise AND entre 1100 e 1010?", options: ["1110", "1000", "0110", "0000"], answer: "1000", explanation: "Verificando as 4 colunas com AND: (1&1=1), (1&0=0), (0&1=0), (0&0=0). Resultado: 1000." },
            { id: 33, instruction: "Bit a Bit: OR", scenario: "Operações binárias coluna por coluna.", text: "Qual o resultado do Bitwise OR entre 0101 e 0011?", options: ["0001", "0111", "1000", "0110"], answer: "0111", explanation: "Verificando as 4 colunas com OR: (0|0=0), (1|0=1), (0|1=1), (1|1=1). Resultado: 0111." },
            { id: 34, instruction: "Bit a Bit: XOR", scenario: "Operações binárias coluna por coluna.", text: "Qual o resultado do Bitwise XOR entre 1111 e 1010?", options: ["0101", "1111", "0000", "1010"], answer: "0101", explanation: "O XOR retorna 1 apenas onde os bits de cima e de baixo forem DIFERENTES. Logo: 1^1=0, 1^0=1, 1^1=0, 1^0=1. Resultado: 0101." },
            { id: 35, instruction: "Mascaramento (Masking - Clear Bit)", scenario: "Uso prático de lógica binária.", text: "Para forçar um bit específico a virar 0 (Falso) sem alterar os outros, qual operação usamos?", options: ["OR com 1", "AND com 0", "XOR com 1", "NOT em todo o byte"], answer: "AND com 0", explanation: "Qualquer valor operado em AND com 0 vira 0 (A AND 0 = 0). O restante dos bits você opera em AND com 1 para manter o valor original." },
            { id: 36, instruction: "Mascaramento (Masking - Set Bit)", scenario: "Uso prático de lógica binária.", text: "Para forçar um bit específico a ligar, virando 1 (Verdadeiro), sem alterar os outros, usamos:", options: ["AND com 1", "OR com 1", "XOR com 0", "NAND com 0"], answer: "OR com 1", explanation: "Qualquer valor operado em OR com 1 vira 1 (A OR 1 = 1). Os demais bits você opera em OR com 0 para mantê-los inalterados." },
            { id: 37, instruction: "Alternando Bit (Toggle)", scenario: "Uso prático de lógica binária.", text: "Para inverter o estado atual de um bit (se 0 vira 1; se 1 vira 0), usamos:", options: ["XOR com 1", "OR com 0", "AND com 1", "NOT isolado"], answer: "XOR com 1", explanation: "Na tabela do XOR: 0 XOR 1 = 1; e 1 XOR 1 = 0. Operar com 1 no XOR age como um interruptor." },
            { id: 38, instruction: "Tamanho da Tabela-Verdade", scenario: "Análise combinatória.", text: "Quantas linhas de combinações possui uma Tabela-Verdade de 4 variáveis (A, B, C, D)?", options: ["4", "8", "16", "32"], answer: "16", explanation: "A fórmula é 2 elevado a N (onde N é o número de variáveis). Sendo 2⁴ = 2 x 2 x 2 x 2 = 16 linhas (de 0000 até 1111)." },
            { id: 39, instruction: "Tautologia", scenario: "Lógica formal estrutural.", text: "Uma expressão que resulta em 1 (Verdadeiro) para TODAS as linhas da Tabela-Verdade é chamada de:", options: ["Contradição", "Contingência", "Tautologia", "Falácia"], answer: "Tautologia", explanation: "Exemplo: A OR (NOT A). Independente dos valores de entrada, o caminho lógico sempre desemboca num 1 (V)." },
            { id: 40, instruction: "Contradição / Falácia", scenario: "Lógica formal estrutural.", text: "Uma expressão que resulta em 0 (Falso) para TODAS as linhas da Tabela-Verdade é chamada de:", options: ["Tautologia", "Contradição", "Variável dependente", "Absorção"], answer: "Contradição", explanation: "Exemplo: A AND (NOT A). É uma estrutura logicamente impossível de ser satisfeita, logo a tabela inteira será 0 (F)." },
            { id: 41, instruction: "Mapa de Karnaugh", scenario: "Simplificação de circuitos digitais.", text: "Qual a principal utilidade prática de um Mapa de Karnaugh (K-Map)?", options: ["Aumentar o número de variáveis.", "Criar algoritmos de criptografia.", "Simplificar visualmente grandes expressões booleanas.", "Aumentar as linhas da Tabela-Verdade."], answer: "Simplificar visualmente grandes expressões booleanas.", explanation: "O Mapa converte a Tabela-Verdade numa grade gráfica onde agrupamentos (blocos de 1s) revelam a expressão mais reduzida possível para construir o circuito." },
            { id: 42, instruction: "Regra do Mapa de Karnaugh", scenario: "Transições lógicas do K-Map.", text: "Células adjacentes num Mapa de Karnaugh devem diferir em quantos bits?", options: ["Dois bits", "Todos os bits", "Apenas 1 bit (Código Gray)", "Nenhum bit"], answer: "Apenas 1 bit (Código Gray)", explanation: "O código Gray garante que da célula vizinha ocorra a mudança de apenas um estado de variável por vez (ex: de 00 para 01, depois para 11), permitindo o agrupamento geométrico." },
            { id: 43, instruction: "Expressão Canônica SOP", scenario: "Soma dos Produtos (SOP - Sum of Products).", text: "A expressão (A AND B) OR (C AND D) pertence a qual formato clássico?", options: ["Produto das Somas (POS)", "Soma dos Produtos (SOP)", "Expressão Linear", "Forma Aninhada"], answer: "Soma dos Produtos (SOP)", explanation: "Identificação direta: os agrupamentos menores são multiplicações lógicas (AND / Produtos) que estão unidos por uma adição lógica central (OR / Soma)." },
            { id: 44, instruction: "Expressão Canônica POS", scenario: "Produto das Somas (POS - Product of Sums).", text: "A expressão (A OR B) AND (C OR D) pertence a qual formato clássico?", options: ["Soma dos Produtos (SOP)", "Produto das Somas (POS)", "Equação Polinomial", "Forma Expandida"], answer: "Produto das Somas (POS)", explanation: "Aqui temos adições lógicas (OR / Somas) dentro dos parênteses, que estão sendo conectadas por uma multiplicação lógica (AND / Produto)." },
            { id: 45, instruction: "Pioneiro da Lógica Computacional", scenario: "História da Álgebra Booleana.", text: "Qual matemático do século XIX formulou a base de zeros (0) e uns (1) usada hoje em computação?", options: ["George Boole", "Isaac Newton", "Alan Turing", "John von Neumann"], answer: "George Boole", explanation: "George Boole publicou em 1854 a Álgebra Booleana. Décadas depois, Claude Shannon aplicou essa matemática em circuitos elétricos reais." },
            { id: 46, instruction: "Somador Básico (Half-Adder): Bit de Soma", scenario: "Matemática com portas lógicas.", text: "Para somar 1 bit + 1 bit e gerar o resultado principal da SOMA, usamos qual porta lógica?", options: ["AND", "OR", "XOR", "NOT"], answer: "XOR", explanation: "Se somamos 1+0=1. 0+1=1. Mas 1+1=0 (e vai um). A Tabela-Verdade da porta XOR bate perfeitamente com essa regra do dígito principal da soma." },
            { id: 47, instruction: "Somador Básico (Half-Adder): Bit de Carry", scenario: "Matemática com portas lógicas.", text: "No mesmo somador, qual porta lógica calcula o bit de 'VAI UM' (Carry)?", options: ["AND", "OR", "XOR", "NAND"], answer: "AND", explanation: "O 'vai um' para a próxima casa decimal só acontece se somarmos 1 e 1 simultaneamente. O AND é o único operador que retorna 1 (V) apenas nesse cenário." },
            { id: 48, instruction: "Lógica Tri-State", scenario: "Sistemas de barramento físico de computadores.", text: "Além de 0 (Falso) e 1 (Verdadeiro), circuitos de terceiro estado (Tri-state) incluem qual condição?", options: ["Talvez", "Alta impedância (Desconectado/Z)", "Superposição Quântica", "-1"], answer: "Alta impedância (Desconectado/Z)", explanation: "O estado Z (High-Z) atua como um interruptor físico aberto. O chip para de enviar 0 ou 1 e se 'desconecta' do fio para não atrapalhar outros componentes." },
            { id: 49, instruction: "Refatoração Lógica", scenario: "Simplificação de código por De Morgan.", text: "Refatorando a condicional encadeada: `if (!A) { if (!B) { ... } }`. Isso equivale a qual expressão de linha única?", options: ["if (A || B)", "if (!(A || B))", "if (A && B)", "if (A != B)"], answer: "if (!(A || B))", explanation: "O código exige NOT A (E também) NOT B. Pela Lei de De Morgan, `!A && !B` é a exata negação de um OR: `!(A || B)`." },
            { id: 50, instruction: "Truthiness em JS", scenario: "Lógica Booleana no JavaScript.", text: "No JavaScript, o número matemático `0` avaliado numa instrução `IF (0)` é traduzido como:", options: ["Verdadeiro (Truthy)", "Falso (Falsy)", "Syntax Error", "String"], answer: "Falso (Falsy)", explanation: "O JS possui valores que implicitamente viram 0 (Falso) no IF: o número 0, string vazia, null, undefined e NaN." },
            { id: 51, instruction: "Equivalência XNOR", scenario: "Manipulação da Tabela-Verdade.", text: "A expressão: NOT (A XOR B) descreve o funcionamento de qual porta?", options: ["NAND", "NOR", "OR", "XNOR"], answer: "XNOR", explanation: "A sigla XNOR (Exclusive NOT OR) já diz: é a inversão completa da tabela da XOR. Resulta em 1 (V) quando os bits são iguais." },
            { id: 52, instruction: "XOR em Criptografia Simples", scenario: "Cifragem de mensagens.", text: "Se Mensagem (M) XOR Chave (K) = Cifra (C). Como reverter a Cifra (C) de volta para a Mensagem (M)?", options: ["C AND K", "C OR K", "C XOR K", "NOT C"], answer: "C XOR K", explanation: "A porta XOR é seu próprio inverso. Aplicar a mesma Chave K novamente desfaz o efeito e restaura a Tabela-Verdade original da Mensagem." },
            { id: 53, instruction: "Propriedade Estática XOR (0)", scenario: "Análise Estática.", text: "Qual o resultado de A XOR 0 (Falso)?", options: ["0", "1", "A (O próprio valor)", "NOT A"], answer: "A (O próprio valor)", explanation: "Se A for 1: 1 XOR 0 = 1. Se A for 0: 0 XOR 0 = 0. Operar XOR com 0 preserva (espelha) o valor lógico de A." },
            { id: 54, instruction: "Propriedade Estática XOR (1)", scenario: "Análise Estática.", text: "Qual o resultado de A XOR 1 (Verdadeiro)?", options: ["A", "NOT A (Inverte A)", "0 (Falso)", "1 (Verdadeiro)"], answer: "NOT A (Inverte A)", explanation: "Se A for 1: 1 XOR 1 = 0. Se A for 0: 0 XOR 1 = 1. Operar XOR com 1 age igual à porta NOT, invertendo o bit de A." },
            { id: 55, instruction: "Expressão do MUX 2:1", scenario: "Multiplexadores Digitais.", text: "Um MUX usa a Seleção (S) para escolher a passagem da entrada D0 (se S=0) ou D1 (se S=1). Qual a lógica base?", options: ["D0 AND D1", "(NOT S AND D0) OR (S AND D1)", "S XOR D0", "S OR D1"], answer: "(NOT S AND D0) OR (S AND D1)", explanation: "Se S for 0 (F): a parte `NOT S` vira 1, ativando `D0`. Se S for 1 (V): ativa o segundo bloco, deixando passar apenas `D1`." },
            { id: 56, instruction: "Precedência de Operadores", scenario: "Expressão sem parênteses.", text: "Na expressão: `A OR B AND C`, qual cálculo a máquina resolve primeiro?", options: ["OR", "AND", "Ambos ao mesmo tempo", "Sempre da esquerda para a direita"], answer: "AND", explanation: "Assim como a multiplicação é resolvida antes da adição na matemática escolar, a conjunção (AND) tem prioridade de resolução sobre a disjunção (OR)." },
            { id: 57, instruction: "Lógica da Implicação", scenario: "Matemática discreta ('Se A, então B').", text: "A condicional clássica A → B é equivalente na Álgebra Booleana a:", options: ["(NOT A) OR B", "A AND B", "A OR NOT B", "A XOR B"], answer: "(NOT A) OR B", explanation: "A Tabela-Verdade da implicação só dá 0 (F) num único caso: a premissa A ser 1 (V) e a conclusão B ser 0 (F). A expressão (NOT A) OR B mapeia isso perfeitamente." },
            { id: 58, instruction: "Lei do Consenso (Redundância)", scenario: "Simplificação Avançada de Circuitos.", text: "Na expressão (A AND B) OR (NOT A AND C) OR (B AND C), qual termo pode ser removido por ser inútil?", options: ["A AND B", "NOT A AND C", "B AND C", "Nenhum termo"], answer: "B AND C", explanation: "O termo (B AND C) é o 'consenso'. Se B e C forem 1, obrigatoriamente A será 1 (ativando o 1º bloco) ou 0 (ativando o 2º bloco). Logo, o 3º bloco nunca precisa ser checado." },
            { id: 59, instruction: "Decompondo a Porta XOR", scenario: "Substituição de hardware lógico.", text: "Como simular o comportamento de A XOR B utilizando apenas portas AND, OR e NOT?", options: ["(A AND NOT B) OR (NOT A AND B)", "A OR B AND NOT B", "NOT (A AND B)", "(A OR B) AND A"], answer: "(A AND NOT B) OR (NOT A AND B)", explanation: "Esta é a prova real do XOR: Lê-se 'Somente A é verdadeiro (e B não) OU Somente B é verdadeiro (e A não)'." },
            { id: 60, instruction: "Completude Funcional", scenario: "Teorema Fundamental.", text: "Diz-se que um conjunto de operadores lógicos é 'Funcionalmente Completo' quando:", options: ["É feito apenas de 1(V) e 0(F).", "Só contém operadores XOR.", "É capaz de expressar absolutamente qualquer Tabela-Verdade ou circuito lógico possível.", "Nunca gera contradições."], answer: "É capaz de expressar absolutamente qualquer Tabela-Verdade ou circuito lógico possível.", explanation: "As portas lógicas básicas (AND, OR, NOT) unidas formam um sistema completo. O impressionante é que uma única porta universal (como a NAND) também é completa por si só." }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica do Terminal ---
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
                    if(text.charAt(i) === '<') {
                        let tag = "";
                        while(text.charAt(i) !== '>' && i < text.length) {
                            tag += text.charAt(i);
                            i++;
                        }
                        tag += '>';
                        logs.value[currentLogIndex].text += tag;
                    } else {
                        logs.value[currentLogIndex].text += text.charAt(i);
                    }
                    
                    scrollToBottom(); 
                    i++;
                    
                    if (i >= text.length) { 
                        clearInterval(interval); 
                        resolve(); 
                    }
                }, 10); 
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Compilando rotina lógica [${currentQuestion.value.id}/60]...`, "log-info");
            await typeWriter(`Contexto base: ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Validação de circuitos lógicos concluída. Exportando matriz...", "log-info");
            }
        };

        // --- Controle de Opções e Feedback do Terminal ---
        const selectOption = async (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            
            userSelection.value = option;
            const isCorrect = option === currentQuestion.value.answer;
            
            isTyping.value = true; 

            if (isCorrect) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Lógica Válida!";
                addLog(`Success: Relação booleana avaliada como TRUE (1).`, "log-success");
                showAnswer.value = true;
                
                await typeWriter(`>> Diagnóstico da Engine:`, "log-info");
                await typeWriter(`Explicação: ${currentQuestion.value.explanation}`, "log-default");
                
                isTyping.value = false;
                setTimeout(nextQuestion, 4000); 
            } else {
                attempts.value++;
                
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Curto-circuito. Resposta correta: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog(`Error: Falha de assertividade binária.`, "log-error");
                    showAnswer.value = true;
                    
                    await typeWriter(`>> Correção Forçada pela Engine:`, "log-info");
                    await typeWriter(`Explicação: ${currentQuestion.value.explanation}`, "log-warning");
                    
                    isTyping.value = false;
                    setTimeout(nextQuestion, 5000);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Incorreto (Falso). Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Warning: Avaliação retornou FALSE (0). Verifique os operadores da tabela-verdade. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                    isTyping.value = false;
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Domínio Sólido na Álgebra Booleana e Portas Lógicas.";
            if (score.value < 42) performanceMsg = "Recomenda-se revisão das Leis de De Morgan, tabelas-verdade e simplificação lógica.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #00bfa5; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #00bfa5; margin: 0;">Relatório de Compilação: Lógica Booleana</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação: Circuitos e Álgebra de Boole</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Execução:</strong> ${data}</p>
                    <p><strong>Avaliado por:</strong> Engine Booleana (MATH.ESCAPE)</p>
                    <p>Este documento certifica a validação estrutural do estudante durante ${questions.value.length} testes focados em tabelas-verdade, portas lógicas e expressões estáticas bit a bit.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Taxa de Precisão Lógica</h3>
                        <p style="font-size: 28px; color: ${score.value >= 42 ? '#10B981' : (score.value >= 30 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Associações Corretas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Status: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Log gerado pelo Terminal Módulo MATH.ESCAPE v3
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Log_Booleana_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando Máquina de Estados Lógicos...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Booting MATH.ESCAPE v3 (Boolean Engine)...", "log-info");
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