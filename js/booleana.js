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

        // --- Banco de 60 Questões Focadas em Lógica Booleana ---
        const questions = ref([
            { id: 1, instruction: "Operador AND (Teoria)", scenario: "Analisando a porta lógica AND.", text: "A operação AND (E) retorna Verdadeiro (1) apenas quando:", options: ["Qualquer uma das entradas for Verdadeira.", "Ambas as entradas forem Verdadeiras.", "As entradas forem diferentes.", "Ambas as entradas forem Falsas."], answer: "Ambas as entradas forem Verdadeiras.", explanation: "A lógica AND exige que todas as condições sejam satisfeitas simultaneamente." },
            { id: 2, instruction: "Operador OR (Teoria)", scenario: "Analisando a porta lógica OR.", text: "A operação OR (OU) retorna Falso (0) apenas quando:", options: ["Ambas as entradas forem Verdadeiras.", "As entradas forem diferentes.", "Ambas as entradas forem Falsas.", "Qualquer uma das entradas for Falsa."], answer: "Ambas as entradas forem Falsas.", explanation: "Na lógica OR, basta que uma única entrada seja Verdadeira para o resultado ser Verdadeiro. Logo, só é Falso se todas forem Falsas." },
            { id: 3, instruction: "Operador NOT (Teoria)", scenario: "Analisando a porta lógica NOT.", text: "Qual é a função do operador unário NOT (NÃO)?", options: ["Somar as entradas.", "Inverter o valor lógico da entrada.", "Garantir que a saída seja sempre 1.", "Comparar duas variáveis."], answer: "Inverter o valor lógico da entrada.", explanation: "O NOT atua sobre uma única variável, transformando 0 em 1 e 1 em 0." },
            { id: 4, instruction: "Tabela-Verdade AND", scenario: "Dadas as variáveis A = 1 e B = 0.", text: "Qual é o resultado da expressão S = A AND B?", options: ["1", "0", "Nulo", "Depende do contexto"], answer: "0", explanation: "1 AND 0 resulta em 0, pois a operação AND requer que ambas as partes sejam 1." },
            { id: 5, instruction: "Tabela-Verdade OR", scenario: "Dadas as variáveis A = 0 e B = 1.", text: "Qual é o resultado da expressão S = A OR B?", options: ["0", "1", "Ambos", "Nenhum"], answer: "1", explanation: "0 OR 1 resulta em 1, pois basta uma das entradas ser verdadeira na porta OR." },
            { id: 6, instruction: "Operador XOR (Teoria)", scenario: "A porta lógica XOR (OU Exclusivo).", text: "A porta XOR retorna Verdadeiro (1) quando:", options: ["As entradas são iguais.", "As entradas são diferentes.", "Ambas são Verdadeiras.", "Ambas são Falsas."], answer: "As entradas são diferentes.", explanation: "O XOR significa 'um ou outro, mas não ambos'. Retorna 1 se tivermos 0 e 1, ou 1 e 0." },
            { id: 7, instruction: "Operador NAND (Teoria)", scenario: "A porta lógica NAND (NOT AND).", text: "A porta NAND é equivalente a qual combinação?", options: ["Uma porta OR seguida de NOT.", "Uma porta AND seguida de NOT.", "Uma porta NOT seguida de OR.", "Duas portas AND em paralelo."], answer: "Uma porta AND seguida de NOT.", explanation: "NAND inverte o resultado do AND. Se AND seria 1, NAND é 0; se AND seria 0, NAND é 1." },
            { id: 8, instruction: "Operador NOR (Teoria)", scenario: "A porta lógica NOR (NOT OR).", text: "Qual é a saída de uma porta NOR se ambas as entradas forem 0?", options: ["0", "1", "Indefinido", "Oscilante"], answer: "1", explanation: "0 OR 0 seria 0. Como NOR inverte o resultado, a saída final é 1." },
            { id: 9, instruction: "Álgebra Booleana: Identidade", scenario: "Propriedade da Identidade.", text: "Na Álgebra Booleana, a expressão A OR 0 é sempre equivalente a:", options: ["0", "1", "A", "NOT A"], answer: "A", explanation: "O 0 é o elemento neutro da operação OR. O resultado dependerá exclusivamente do valor de A." },
            { id: 10, instruction: "Álgebra Booleana: Identidade AND", scenario: "Propriedade da Identidade.", text: "A expressão A AND 1 é equivalente a:", options: ["A", "1", "0", "NOT A"], answer: "A", explanation: "O 1 é o elemento neutro da operação AND. Se A for 1, 1 AND 1 = 1. Se A for 0, 0 AND 1 = 0. O resultado é o próprio A." },
            { id: 11, instruction: "Álgebra Booleana: Anulação OR", scenario: "Propriedade da Anulação.", text: "A expressão A OR 1 sempre resultará em:", options: ["A", "0", "1", "Indeterminado"], answer: "1", explanation: "Na operação OR, se pelo menos um dos operandos é 1, o resultado final é forçado a 1, independentemente de A." },
            { id: 12, instruction: "Álgebra Booleana: Anulação AND", scenario: "Propriedade da Anulação.", text: "A expressão A AND 0 sempre resultará em:", options: ["A", "0", "1", "A AND 1"], answer: "0", explanation: "Na operação AND, se houver um 0 na expressão, toda a saída é forçada a ser 0." },
            { id: 13, instruction: "Álgebra Booleana: Idempotência", scenario: "Propriedade da Idempotência.", text: "A expressão A AND A é simplificada para:", options: ["1", "0", "A", "2A"], answer: "A", explanation: "Na lógica booleana, operar uma variável com ela mesma não altera seu valor (0 AND 0 = 0; 1 AND 1 = 1)." },
            { id: 14, instruction: "Álgebra Booleana: Complemento", scenario: "Propriedade do Complemento.", text: "O que resulta a expressão A OR (NOT A)?", options: ["A", "NOT A", "0", "1"], answer: "1", explanation: "Uma variável ou seu inverso será obrigatoriamente 1. Logo, a operação OR sempre encontrará um 1." },
            { id: 15, instruction: "Álgebra Booleana: Complemento AND", scenario: "Propriedade do Complemento.", text: "O que resulta a expressão A AND (NOT A)?", options: ["0", "1", "A", "Depende de A"], answer: "0", explanation: "Uma variável e seu inverso nunca podem ser 1 ao mesmo tempo, logo a condição AND sempre falha (resulta em 0)." },
            { id: 16, instruction: "Dupla Negação", scenario: "Propriedade da Involução.", text: "Qual é o resultado de NOT (NOT A)?", options: ["0", "1", "A", "NOT A"], answer: "A", explanation: "Negar uma variável duas vezes a retorna ao seu estado lógico original." },
            { id: 17, instruction: "Leis de De Morgan 1", scenario: "Transformação de lógicas.", text: "Segundo a Lei de De Morgan, a expressão NOT (A AND B) equivale a:", options: ["(NOT A) AND (NOT B)", "(NOT A) OR (NOT B)", "A OR B", "A AND B"], answer: "(NOT A) OR (NOT B)", explanation: "A negação de uma conjunção (AND) é a disjunção (OR) das negações." },
            { id: 18, instruction: "Leis de De Morgan 2", scenario: "Transformação de lógicas.", text: "Segundo a Lei de De Morgan, a expressão NOT (A OR B) equivale a:", options: ["(NOT A) OR (NOT B)", "(NOT A) AND (NOT B)", "NOT A AND B", "A AND NOT B"], answer: "(NOT A) AND (NOT B)", explanation: "A negação de uma disjunção (OR) é a conjunção (AND) das negações." },
            { id: 19, instruction: "Expressões Compostas", scenario: "Avaliação de expressão estática.", text: "Resolva: (1 AND 0) OR (1 AND 1)", options: ["0", "1", "Falta informação", "Invalido"], answer: "1", explanation: "Primeiro os parênteses: (0) OR (1). Finalmente: 0 OR 1 resulta em 1." },
            { id: 20, instruction: "Expressões Compostas", scenario: "Avaliação de expressão estática.", text: "Resolva: NOT (1 OR 0) AND 1", options: ["1", "0", "Erro de sintaxe", "NOT 1"], answer: "0", explanation: "1 OR 0 = 1. NOT 1 = 0. Por fim, 0 AND 1 = 0." },
            { id: 21, instruction: "Porta XNOR (Teoria)", scenario: "A porta XNOR (Não-OU Exclusivo).", text: "A porta XNOR retorna Verdadeiro (1) quando as entradas são:", options: ["Diferentes", "Iguais", "Sempre 0", "Sempre 1"], answer: "Iguais", explanation: "XNOR é a inversa da XOR. Ela atua como um 'comparador de igualdade', retornando 1 se ambas as entradas forem 0 ou ambas forem 1." },
            { id: 22, instruction: "Propriedade Comutativa", scenario: "Álgebra Booleana Básica.", text: "A propriedade A OR B = B OR A representa qual lei?", options: ["Associativa", "Distributiva", "Comutativa", "Absorção"], answer: "Comutativa", explanation: "A ordem dos fatores não altera o resultado final na lógica AND ou OR." },
            { id: 23, instruction: "Propriedade Associativa", scenario: "Agrupamento lógico.", text: "A expressão A AND (B AND C) é igual a (A AND B) AND C. Isso é a lei:", options: ["Distributiva", "De Morgan", "Associativa", "Idempotente"], answer: "Associativa", explanation: "Indica que o agrupamento das variáveis em operadores idênticos não muda o resultado." },
            { id: 24, instruction: "Propriedade Distributiva", scenario: "Expansão lógica.", text: "A expressão A AND (B OR C) é equivalente a:", options: ["(A AND B) OR (A AND C)", "A OR (B AND C)", "(A OR B) AND (A OR C)", "A AND B AND C"], answer: "(A AND B) OR (A AND C)", explanation: "O operador AND distribui-se sobre o OR, assim como a multiplicação na álgebra comum." },
            { id: 25, instruction: "Lei da Absorção 1", scenario: "Simplificação lógica.", text: "Na Álgebra Booleana, a expressão A OR (A AND B) simplifica-se para:", options: ["B", "A", "A OR B", "1"], answer: "A", explanation: "Se A for 1, a expressão é 1. Se A for 0, a expressão é 0. O valor de B não importa." },
            { id: 26, instruction: "Lei da Absorção 2", scenario: "Simplificação lógica.", text: "A expressão A AND (A OR B) simplifica-se para:", options: ["A", "B", "A AND B", "0"], answer: "A", explanation: "Se A for 0, a expressão é 0. Se A for 1, (1 OR B) é 1, logo 1 AND 1 = 1. A absorve B." },
            { id: 27, instruction: "Universalidade das Portas", scenario: "Circuitos Lógicos.", text: "Quais portas são consideradas 'Universais' porque podem ser usadas para construir qualquer outra porta lógica?", options: ["AND e OR", "NAND e NOR", "XOR e XNOR", "NOT e AND"], answer: "NAND e NOR", explanation: "Através da combinação de portas NAND (ou NOR), é possível reproduzir o comportamento de AND, OR e NOT." },
            { id: 28, instruction: "Programação Prática", scenario: "Código: `if (x > 5 && x < 10)`", text: "Essa estrutura utiliza o conceito de qual porta lógica?", options: ["OR", "XOR", "AND", "NOT"], answer: "AND", explanation: "O operador `&&` em programação representa a conjunção lógica (AND)." },
            { id: 29, instruction: "Programação Prática", scenario: "Código: `if (usuario === 'admin' || token_valido)`", text: "Essa estrutura baseia-se em qual operador booleano?", options: ["AND", "OR", "XNOR", "NAND"], answer: "OR", explanation: "O operador `||` em programação permite acesso se pelo menos uma das condições for verdadeira." },
            { id: 30, instruction: "Short-Circuit AND", scenario: "Linguagens de programação modernas.", text: "Na expressão `A && B`, se `A` for Falso, o que a máquina faz?", options: ["Avalia B e retorna erro", "Avalia B para ter certeza", "Não avalia B e já retorna Falso (Short-circuit)", "Transforma a expressão em OR"], answer: "Não avalia B e já retorna Falso (Short-circuit)", explanation: "Avaliação de curto-circuito: como um Falso no AND já invalida toda a expressão, o sistema economiza processamento ignorando o lado direito." },
            { id: 31, instruction: "Short-Circuit OR", scenario: "Linguagens de programação modernas.", text: "Na expressão `A || B`, se `A` for Verdadeiro, o que ocorre?", options: ["O programa trava", "B deve ser Verdadeiro também", "O lado direito (B) é ignorado e retorna Verdadeiro", "B é avaliado para conferência"], answer: "O lado direito (B) é ignorado e retorna Verdadeiro", explanation: "Em um OR lógico, se a primeira condição já satisfaz (é 1), o resultado global já é 1." },
            { id: 32, instruction: "Bitwise AND", scenario: "Operações em nível de bit.", text: "Qual o resultado do Bitwise AND entre 1100 e 1010?", options: ["1110", "1000", "0110", "0000"], answer: "1000", explanation: "Comparando bit a bit: (1 AND 1)=1, (1 AND 0)=0, (0 AND 1)=0, (0 AND 0)=0. Resultado: 1000." },
            { id: 33, instruction: "Bitwise OR", scenario: "Operações em nível de bit.", text: "Qual o resultado do Bitwise OR entre 0101 e 0011?", options: ["0001", "0111", "1000", "0110"], answer: "0111", explanation: "Comparando bit a bit com OR: resulta em 1 se houver ao menos um 1 na coluna correspondente." },
            { id: 34, instruction: "Bitwise XOR", scenario: "Operações em nível de bit.", text: "Qual o resultado do Bitwise XOR entre 1111 e 1010?", options: ["0101", "1111", "0000", "1010"], answer: "0101", explanation: "Retorna 1 apenas onde os bits são diferentes. Aonde eram 1 e 1 virou 0." },
            { id: 35, instruction: "Mascaramento (Masking)", scenario: "Uso prático de Bitwise AND.", text: "Para forçar um bit específico a se tornar 0 (limpar bit), qual porta lógica usamos?", options: ["OR com 1", "AND com 0", "XOR com 1", "NOT em todo o byte"], answer: "AND com 0", explanation: "Fazer um AND com 0 força matematicamente a saída a ser 0 naquela posição específica da máscara." },
            { id: 36, instruction: "Setando Bit (Masking)", scenario: "Uso prático de Bitwise OR.", text: "Para forçar um bit específico a ligar (virar 1) sem alterar o resto, usamos:", options: ["AND com 1", "OR com 1", "XOR com 0", "NAND com 0"], answer: "OR com 1", explanation: "Fazer um OR com 1 garante que o resultado será 1, mantendo os demais bits intactos (fazendo OR com 0)." },
            { id: 37, instruction: "Alternando Bit (Toggling)", scenario: "Uso prático de Bitwise XOR.", text: "Para inverter o estado de um bit específico, usamos:", options: ["XOR com 1", "OR com 0", "AND com 1", "NOT isolado"], answer: "XOR com 1", explanation: "1 XOR 1 = 0; 0 XOR 1 = 1. A porta XOR com a máscara 1 atua como um interruptor (toggle)." },
            { id: 38, instruction: "Tabela da Verdade - Tamanho", scenario: "Análise combinatória booleana.", text: "Quantas linhas tem a tabela-verdade para uma expressão com 4 variáveis distintas (A, B, C, D)?", options: ["4", "8", "16", "32"], answer: "16", explanation: "O número de combinações possíveis é 2 elevado a N, onde N é o número de variáveis (2^4 = 16)." },
            { id: 39, instruction: "Tautologia", scenario: "Lógica formal.", text: "Uma expressão booleana que resulta em 1 (Verdadeiro) para todas as combinações de entrada é chamada de:", options: ["Contradição", "Contingência", "Tautologia", "Falácia"], answer: "Tautologia", explanation: "Exemplo: A OR (NOT A). Independente do valor de A, a expressão sempre é verdadeira." },
            { id: 40, instruction: "Contradição", scenario: "Lógica formal.", text: "Uma expressão que sempre resulta em 0 (Falso) é chamada de:", options: ["Tautologia", "Falácia / Contradição", "Variável dependente", "Absorção"], answer: "Falácia / Contradição", explanation: "Exemplo: A AND (NOT A). Uma afirmação que nunca pode ser satisfeita logicamente." },
            { id: 41, instruction: "Simplificação: Mapas de Karnaugh", scenario: "Redução de hardware.", text: "Qual a utilidade primária de um Mapa de Karnaugh (K-Map)?", options: ["Aumentar variáveis", "Criar criptografia", "Simplificar expressões booleanas visualmente", "Desativar memória RAM"], answer: "Simplificar expressões booleanas visualmente", explanation: "É um método gráfico para reduzir funções lógicas, minimizando a quantidade de portas físicas num circuito." },
            { id: 42, instruction: "Variáveis no K-Map", scenario: "Regras do Mapa de Karnaugh.", text: "Células adjacentes num Mapa de Karnaugh podem diferir em quantos bits?", options: ["Dois bits", "Todos os bits", "Apenas um bit (Código de Gray)", "Nenhum bit"], answer: "Apenas um bit (Código de Gray)", explanation: "A formatação do mapa exige que as transições sejam adjacentes em Código de Gray (mudança de apenas 1 bit) para o agrupamento lógico funcionar." },
            { id: 43, instruction: "Representação Canônica", scenario: "Soma dos Produtos (SOP).", text: "A expressão (A AND B) OR (C AND D) está no formato de:", options: ["Produto das Somas (POS)", "Soma dos Produtos (SOP)", "Expressão Linear", "Forma Aninhada"], answer: "Soma dos Produtos (SOP)", explanation: "Minilógica: temos 'produtos' lógicos (AND) que estão sendo 'somados' (OR)." },
            { id: 44, instruction: "Representação Canônica", scenario: "Produto das Somas (POS).", text: "A expressão (A OR B) AND (C OR D) está no formato de:", options: ["Soma dos Produtos", "Produto das Somas (POS)", "Equação Polinomial", "Forma Expandida"], answer: "Produto das Somas (POS)", explanation: "Aqui temos 'somas' lógicas (OR) que estão sendo multiplicadas logicamente (AND)." },
            { id: 45, instruction: "Teorema de Shannon", scenario: "Teorema da Expansão.", text: "Todo circuito lógico complexo pode ser descrito e simplificado utilizando unicamente a matemática de:", options: ["George Boole", "Isaac Newton", "Alan Turing", "John von Neumann"], answer: "George Boole", explanation: "A Álgebra Booleana foi desenvolvida no século 19, e aplicada por Claude Shannon a circuitos de relés em 1937." },
            { id: 46, instruction: "Half-Adder", scenario: "Aritmética Booleana Computacional.", text: "Qual porta lógica é responsável por gerar o bit de SOMA (Sum) em um somador básico (Half-Adder)?", options: ["AND", "OR", "XOR", "NOT"], answer: "XOR", explanation: "A soma binária de 1 + 1 é 0 (e sobe 1). A porta XOR mapeia perfeitamente essa regra (retorna 0 quando entradas são iguais)." },
            { id: 47, instruction: "Half-Adder (Carry)", scenario: "Aritmética Booleana Computacional.", text: "No mesmo somador, qual porta é responsável por calcular o bit de VAI-UM (Carry)?", options: ["AND", "OR", "XOR", "NAND"], answer: "AND", explanation: "O 'vai-um' só ocorre se estivéssemos somando 1 e 1. A porta AND faz exatamente essa verificação." },
            { id: 48, instruction: "Lógica Tri-State", scenario: "Sistemas de barramento.", text: "Além de 0 e 1, portas de terceiro estado (Tri-state) incluem qual condição lógica?", options: ["Talvez", "Alta impedância (Desconectado Z)", "Superposição Quântica", "-1"], answer: "Alta impedância (Desconectado Z)", explanation: "Permite que a saída seja eletricamente desconectada do barramento para evitar conflitos quando múltiplos chips compartilham a mesma linha." },
            { id: 49, instruction: "Condicionais Encadeadas", scenario: "Simplificação em código.", text: "Refatorando código: `if (!A) { if (!B) { return true; } }` equivale a:", options: ["if (A || B)", "if (!(A || B))", "if (A && B)", "if (A != B)"], answer: "if (!(A || B))", explanation: "Pela Lei de De Morgan, NOT A AND NOT B é exatamente igual a NOT (A OR B)." },
            { id: 50, instruction: "Verdadeiro e Falso em JS", scenario: "Truthiness em Linguagens Ligeiras.", text: "No JavaScript, o valor numérico `0` inserido num bloco IF é tratado como:", options: ["Verdadeiro (Truthy)", "Falso (Falsy)", "Syntax Error", "String"], answer: "Falso (Falsy)", explanation: "Valores como 0, null, undefined, NaN e strings vazias são booleanamente falsos no contexto da máquina." },
            { id: 51, instruction: "Expressão com NOT XOR", scenario: "Equivalência", text: "NOT (A XOR B) é a definição exata de qual porta lógica?", options: ["NAND", "NOR", "OR", "XNOR"], answer: "XNOR", explanation: "XNOR é literalmente a negação lógica da porta XOR." },
            { id: 52, instruction: "Propriedade XOR em Criptografia", scenario: "XOR reverso.", text: "Se Mensagem (M) XOR Chave (K) gera o Texto Cifrado (C). Como reverter C de volta para M?", options: ["C AND K", "C OR K", "C XOR K", "NOT C"], answer: "C XOR K", explanation: "O operador XOR é reversível e involutivo. (A XOR B) XOR B = A." },
            { id: 53, instruction: "XOR com Identidade", scenario: "Operações estáticas.", text: "Qual o resultado de A XOR 0?", options: ["0", "1", "A", "NOT A"], answer: "A", explanation: "Se A=1, 1 XOR 0 = 1. Se A=0, 0 XOR 0 = 0. Ou seja, espelha o valor de A." },
            { id: 54, instruction: "XOR com Complemento", scenario: "Operações estáticas.", text: "Qual o resultado de A XOR 1?", options: ["A", "NOT A", "0", "1"], answer: "NOT A", explanation: "Se A=1, 1 XOR 1 = 0. Se A=0, 0 XOR 1 = 1. Ele inverte o sinal, atuando como um NOT." },
            { id: 55, instruction: "MUX (Multiplexador)", scenario: "Circuitos digitais baseados em portas lógicas.", text: "Um MUX usa uma variável de seleção (S) para rotear D0 ou D1 para a saída. A expressão booleana é:", options: ["D0 AND D1", "(NOT S AND D0) OR (S AND D1)", "S XOR D0", "S OR D1"], answer: "(NOT S AND D0) OR (S AND D1)", explanation: "Se S=0, passa D0. Se S=1, passa D1. Essa expressão encapsula perfeitamente esse roteamento." },
            { id: 56, instruction: "Prioridade de Operadores", scenario: "Precedência em expressões sem parênteses.", text: "Na expressão: A OR B AND C, qual operador é executado primeiro tradicionalmente?", options: ["OR", "AND", "Ambos ao mesmo tempo", "Da esquerda para a direita obrigatoriamente"], answer: "AND", explanation: "Semelhante à matemática comum onde a multiplicação (*) vem antes da adição (+), o AND lógico tem precedência sobre o OR." },
            { id: 57, instruction: "Operador de Implicação", scenario: "Lógica Proposicional.", text: "A expressão condicional 'Se A então B' (A → B) é equivalente em álgebra booleana a:", options: ["(NOT A) OR B", "A AND B", "A OR NOT B", "A XOR B"], answer: "(NOT A) OR B", explanation: "A implicação só é falsa se a premissa A for verdadeira e a conclusão B for falsa." },
            { id: 58, instruction: "Redundância (Lei do Consenso)", scenario: "Simplificação Avançada.", text: "A expressão (A AND B) OR (NOT A AND C) OR (B AND C) pode perder qual termo sem alterar seu resultado?", options: ["A AND B", "NOT A AND C", "B AND C", "Nenhum termo"], answer: "B AND C", explanation: "O termo B AND C é redundante (consenso). As duas primeiras condições já garantem a cobertura lógica desse terceiro termo." },
            { id: 59, instruction: "XOR Equivalente AND/OR", scenario: "Substituição.", text: "Como expressar A XOR B usando apenas AND, OR e NOT?", options: ["(A AND NOT B) OR (NOT A AND B)", "A OR B AND NOT B", "NOT (A AND B)", "(A OR B) AND A"], answer: "(A AND NOT B) OR (NOT A AND B)", explanation: "Esta é a definição formal do XOR: Ocorre quando apenas A é verdadeiro OU apenas B é verdadeiro." },
            { id: 60, instruction: "Sistema Lógico Completo", scenario: "Teorema Funcional.", text: "Um conjunto de operadores lógicos é chamado 'Funcionalmente Completo' se:", options: ["É feito só de 1 e 0", "Só contém XOR", "Pode expressar qualquer função booleana possível", "Não gera exceções"], answer: "Pode expressar qualquer função booleana possível", explanation: "O conjunto {AND, OR, NOT} é funcionalmente completo. O conjunto de apenas {NAND} também é completo por si só." }
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
                addLog(`Success: Relação booleana avaliada como TRUE.`, "log-success");
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
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Incorreto. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Warning: Avaliação retornou FALSE. Verifique operadores lógicos. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
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
            if (score.value < 42) performanceMsg = "Recomenda-se revisão das Leis de De Morgan e simplificação lógica.";
            
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