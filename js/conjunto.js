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

        // --- Banco de 60 Questões (Corrigido com símbolos Unicode nativos) ---
        const questions = ref([
            { id: 1, instruction: "Operação: Interseção (Prática)", scenario: "Considere os conjuntos A = {1, 2, 3, 4} e B = {3, 4, 5, 6}.", text: "Qual é o resultado de A ∩ B?", options: ["{1, 2, 3, 4, 5, 6}", "{3, 4}", "{}", "{1, 2, 5, 6}"], answer: "{3, 4}", explanation: "A interseção (∩) retorna apenas os elementos que existem simultaneamente em ambos os conjuntos. Neste caso, apenas 3 e 4 satisfazem a condição." },
            { id: 2, instruction: "Operação: União (Prática)", scenario: "Seja A = {a, b, c} e B = {c, d}.", text: "O conjunto A ∪ B é formado por:", options: ["{a, b, c, d}", "{c}", "{a, b, d}", "{a, b, c, c, d}"], answer: "{a, b, c, d}", explanation: "A união (∪) combina todos os elementos de ambos os conjuntos. Elementos repetidos (como o 'c') são listados apenas uma vez, pois em conjuntos puros não há duplicatas." },
            { id: 3, instruction: "Operação: Diferença (Prática)", scenario: "Temos o conjunto de usuários logados L = {U1, U2, U3} e usuários administradores A = {U1}.", text: "Matematicamente, qual o resultado de L - A (usuários comuns)?", options: ["{U2, U3}", "{U1, U2, U3}", "{U1}", "{}"], answer: "{U2, U3}", explanation: "A diferença L - A remove de L todos os elementos que também pertencem a A. Restam apenas os usuários que não são administradores." },
            { id: 4, instruction: "Cardinalidade (Prática)", scenario: "Um banco de dados tem um conjunto C com 15 clientes. Um conjunto V tem 10 clientes VIPs, onde todos os VIPs já estão em C.", text: "Qual a cardinalidade da união |C ∪ V|?", options: ["25", "10", "15", "5"], answer: "15", explanation: "Como V é um subconjunto de C (V ⊂ C), a união de C com V é o próprio conjunto C. Logo, a cardinalidade se mantém 15." },
            { id: 5, instruction: "Subconjuntos (Prática)", scenario: "Dado o conjunto de permissões P = {ler, escrever}.", text: "Quantos subconjuntos possíveis (conjunto das partes) podem ser formados a partir de P?", options: ["2", "4", "3", "8"], answer: "4", explanation: "O número de subconjuntos de um conjunto com n elementos é 2ⁿ. Para n=2, temos 2² = 4. São eles: {}, {ler}, {escrever}, {ler, escrever}." },
            { id: 6, instruction: "Conjunto Disjunto (Teoria)", scenario: "Em um sistema, o conjunto de 'Processos Ativos' e 'Processos Finalizados'.", text: "Se a interseção entre esses dois conjuntos é o conjunto vazio (∅), dizemos que eles são:", options: ["Disjuntos", "Equivalentes", "Universais", "Complementares"], answer: "Disjuntos", explanation: "Dois conjuntos são disjuntos quando não possuem nenhum elemento em comum. Na lógica computacional, um processo não pode estar ativo e finalizado ao mesmo tempo." },
            { id: 7, instruction: "Produto Cartesiano (Prática)", scenario: "Seja o domínio A = {x, y} e o contradomínio B = {1, 2}.", text: "O produto cartesiano A × B resulta em:", options: ["{(x,1), (y,2)}", "{(x,1), (x,2), (y,1), (y,2)}", "{x, y, 1, 2}", "{(1,x), (2,y)}"], answer: "{(x,1), (x,2), (y,1), (y,2)}", explanation: "O produto cartesiano gera todos os pares ordenados possíveis combinando cada elemento do primeiro conjunto com cada elemento do segundo." },

            { id: 8, instruction: "SQL e Conjuntos", scenario: "Você está escrevendo uma query de banco de dados e usa o comando `INNER JOIN`.", text: "Essa operação relacional corresponde a qual operação de conjuntos na matemática discreta?", options: ["União", "Interseção", "Diferença", "Produto Cartesiano"], answer: "Interseção", explanation: "O INNER JOIN retorna apenas os registros que possuem correspondência (valores iguais na chave) em ambas as tabelas, agindo exatamente como uma interseção matemática." },
            { id: 9, instruction: "SQL e Conjuntos 2", scenario: "Você precisa listar todos os usuários da 'Tabela A' junto com todos da 'Tabela B', sem duplicatas. Usa-se `UNION`.", text: "O `UNION` no SQL é a aplicação direta de qual propriedade dos conjuntos?", options: ["Cardinalidade nula", "Apenas Diferença Simétrica", "União (removendo interseções duplicadas)", "Fecho transitivo"], answer: "União (removendo interseções duplicadas)", explanation: "Assim como na Teoria dos Conjuntos, onde a união de dois conjuntos não possui elementos repetidos, o operador UNION no SQL remove as linhas duplicadas do resultado final." },
            { id: 10, instruction: "Bitwise Operators", scenario: "Em nível de hardware/C++, o operador `&` (Bitwise AND) compara bits.", text: "O Bitwise AND opera logicamente como qual conceito de conjuntos nas posições dos bits?", options: ["União", "Interseção", "Complemento", "Conjunto Vazio"], answer: "Interseção", explanation: "O Bitwise AND retorna 1 apenas se os bits correspondentes de ambos os operandos forem 1. É a interseção dos conjuntos de bits ativos." },
            { id: 11, instruction: "Mapeamento Computacional", scenario: "Uma estrutura de dados de Dicionário (ou Hash Map) mapeia chaves para valores.", text: "O conjunto de todas as chaves únicas atua matematicamente como o:", options: ["Domínio", "Contradomínio", "Conjunto Imagem", "Ponto Flutuante"], answer: "Domínio", explanation: "Em uma função f: A → B, as entradas únicas (A) formam o Domínio. Em um dicionário, as chaves são o Domínio que mapeia para os valores armazenados." },
            
            { id: 12, instruction: "Conceito Central", scenario: "Revisando os fundamentos do mapa mental.", text: "A essência de uma função matemática é definir uma relação específica entre:", options: ["Dois conjuntos, associando elementos", "Apenas números primos", "Matrizes bidimensionais", "Grafos sem vértices"], answer: "Dois conjuntos, associando elementos", explanation: "Uma função é, fundamentalmente, uma regra que associa cada elemento de um conjunto inicial (domínio) a um elemento em um conjunto final (contradomínio)." },
            { id: 13, instruction: "Definição Rigorosa (Teoria)", scenario: "Avaliando se uma relação R é uma função válida.", text: "Para ser função, cada elemento do domínio deve estar associado a:", options: ["Múltiplos elementos no contradomínio", "Exatamente um elemento no contradomínio", "Nenhum elemento", "Um elemento no seu próprio domínio"], answer: "Exatamente um elemento no contradomínio", explanation: "Esta é a regra fundamental: uma entrada não pode gerar duas saídas diferentes em uma função estrita (determinismo computacional)." },
            { id: 14, instruction: "Regra de Associação (Prática)", scenario: "Seja a função f(x) = 2x + 1, com domínio A = {0, 1, 2}.", text: "Qual é o conjunto Imagem desta função?", options: ["{0, 1, 2}", "{1, 2, 3}", "{1, 3, 5}", "{0, 2, 4}"], answer: "{1, 3, 5}", explanation: "Aplicando a regra aos elementos do domínio: f(0)=1, f(1)=3, f(2)=5. A Imagem é o conjunto das saídas efetivas: {1, 3, 5}." },
            { id: 15, instruction: "Domínio Computacional (Prática)", scenario: "Uma função que calcula a raiz quadrada em uma linguagem genérica: `sqrt(x)`.", text: "Para evitar erros nos Reais, o domínio restrito dessa função deve ser o conjunto dos números:", options: ["Reais negativos", "Reais não-negativos (x ≥ 0)", "Apenas inteiros ímpares", "Racionais negativos"], answer: "Reais não-negativos (x ≥ 0)", explanation: "Matematicamente e computacionalmente (sem usar bibliotecas complexas), a raiz quadrada não está definida para números reais negativos." },
            { id: 16, instruction: "Contradomínio vs Imagem", scenario: "Uma API retorna `Strings` contendo as cores de um semáforo, mas atualmente só está retornando 'Verde' e 'Vermelho'.", text: "O tipo `String` e o conjunto {Verde, Vermelho} representam, respectivamente:", options: ["Imagem e Domínio", "Contradomínio e Imagem", "Domínio e Regra", "Contradomínio e Domínio"], answer: "Contradomínio e Imagem", explanation: "O Contradomínio é o conjunto de todos os resultados teoricamente possíveis (todas as Strings). A Imagem é o subconjunto das saídas que realmente aconteceram (Verde, Vermelho)." },

            { id: 17, instruction: "Função Injetora (Teoria)", scenario: "Modelando a base de dados de alunos (Tabela A) para RGs (Tabela B).", text: "Segundo o mapa mental, uma Função Injetora garante que:", options: ["O contradomínio é igual à imagem.", "Elementos distintos do domínio têm imagens distintas.", "Todo elemento da imagem mapeia para o vazio.", "A função retorna constantes."], answer: "Elementos distintos do domínio têm imagens distintas.", explanation: "Se x₁ ≠ x₂, então f(x₁) ≠ f(x₂). Computacionalmente, isso garante que não haverá colisões (dois alunos não podem ter o mesmo RG)." },
            { id: 18, instruction: "Função Injetora (Prática)", scenario: "Seja A = {1, 2} e B = {x, y, z}. A função é f = {(1, x), (2, y)}.", text: "Esta função é injetora?", options: ["Sim, pois saídas são únicas para cada entrada.", "Não, pois o domínio é menor que o contradomínio.", "Não, pois o elemento 'z' não foi atingido.", "Sim, pois é uma função constante."], answer: "Sim, pois saídas são únicas para cada entrada.", explanation: "A injeção só exige que entradas diferentes não apontem para a mesma saída. Não importa se sobram elementos no contradomínio (como o 'z')." },
            { id: 19, instruction: "Função Sobrejetora (Teoria)", scenario: "Em um roteador, todo endereço IP disponível no pool (Contradomínio) foi alocado a um dispositivo.", text: "De acordo com o mapa, uma função é Sobrejetora quando:", options: ["O domínio é maior que os Reais.", "O contradomínio é igual ao conjunto imagem.", "É simultaneamente injetora.", "Existe uma função inversa."], answer: "O contradomínio é igual ao conjunto imagem.", explanation: "Sobrejeção significa 'não sobra ninguém no conjunto de chegada'. Todos os elementos possíveis de saída foram atingidos por pelo menos uma entrada." },
            { id: 20, instruction: "Função Sobrejetora (Prática)", scenario: "A regra f(x) = |x| (valor absoluto) mapeando Inteiros ℤ para Naturais ℕ.", text: "Essa função é sobrejetora?", options: ["Não, o domínio não permite.", "Sim, pois todos os Naturais (0, 1, 2...) serão atingidos por algum Inteiro.", "Não, pois números negativos darão erro.", "Sim, mas apenas se for Injetora também."], answer: "Sim, pois todos os Naturais (0, 1, 2...) serão atingidos por algum Inteiro.", explanation: "Para cada número natural y, existe um inteiro x tal que |x| = y (ex: |-5| = 5 e |5| = 5). Todos os Naturais são atingidos, então a Imagem é igual ao Contradomínio." },
            { id: 21, instruction: "Função Bijetora (Teoria)", scenario: "Um sistema de criptografia associa caracteres originais a um código embaralhado. O processo precisa ser reversível.", text: "Para uma função admitir inversa perfeita, ela deve ser:", options: ["Simultaneamente Injetora e Sobrejetora (Bijetora)", "Apenas Constante", "Apenas Injetora", "Exponencial"], answer: "Simultaneamente Injetora e Sobrejetora (Bijetora)", explanation: "A bijeção garante mapeamento perfeito 1-para-1. Não há duplicatas de saída (injeção) e não há saídas órfãs (sobrejeção), permitindo o caminho inverso exato." },
            { id: 22, instruction: "Pigeonhole Principle (Prática)", scenario: "Temos 6 portas lógicas de processamento e 7 tarefas enviadas simultaneamente.", text: "Se cada tarefa é atribuída a uma porta, o Princípio da Casa dos Pombos garante matematicamente que:", options: ["Pelo menos uma porta receberá mais de uma tarefa (Não pode ser Injetora).", "Uma porta ficará vazia.", "A relação é Bijetora.", "Ocorre um erro de divisão por zero."], answer: "Pelo menos uma porta receberá mais de uma tarefa (Não pode ser Injetora).", explanation: "Se a cardinalidade do Domínio (7) é maior que a do Contradomínio (6), é impossível mapear tudo sem repetição. Colisões são matematicamente inevitáveis." },

            { id: 23, instruction: "Estruturas de Dados", scenario: "O mapa mental liga Funções a Estruturas de Dados.", text: "Acessar o elemento `array[2]` é conceitualmente usar uma função onde o domínio é formado por:", options: ["Caracteres alfabéticos", "Índices numéricos (Inteiros não-negativos)", "Ponteiros de memória soltos", "O conjunto vazio"], answer: "Índices numéricos (Inteiros não-negativos)", explanation: "Um array pode ser formalizado como uma função que mapeia um conjunto de índices (0, 1, 2...) para um conjunto de valores na memória." },
            { id: 24, instruction: "Complexidade Algorítmica", scenario: "O tempo de execução de um algoritmo é f(n) = O(n²).", text: "Como se classifica essa função de crescimento computacional?", options: ["Linear", "Logarítmica", "Polinomial/Quadrática", "Fatorial"], answer: "Polinomial/Quadrática", explanation: "O grau da variável n é 2, o que gera uma parábola crescente. Típico de loops aninhados (for dentro de for)." },
            { id: 25, instruction: "Função Composta (Prática)", scenario: "Sejam f(x) = x + 2 e g(x) = 3x.", text: "Qual o resultado de aplicar a função composta g(f(x)) para x = 1?", options: ["5", "9", "7", "3"], answer: "9", explanation: "Primeiro resolvemos a função interna: f(1) = 1 + 2 = 3. Depois aplicamos o resultado na externa: g(3) = 3 * 3 = 9." },
            { id: 26, instruction: "Função Piso (Prática)", scenario: "A matemática discreta lida com inteiros. A função piso `Math.floor(x)`.", text: "Dado f(x) = ⌊x⌋, qual o resultado para x = 3.8?", options: ["4", "3.8", "3", "0"], answer: "3", explanation: "A função piso retorna o maior inteiro menor ou igual ao número real fornecido. Neste caso, o piso de 3.8 é 3 (arredondamento para baixo)." },
            { id: 27, instruction: "Função Teto (Prática)", scenario: "No cálculo de paginação de uma tabela: 15 itens totais, 10 por página. Usamos `Math.ceil(15/10)`.", text: "Dado f(x) = ⌈x⌉, para x = 1.5, o retorno é:", options: ["1", "1.5", "2", "Erro"], answer: "2", explanation: "A função teto mapeia o real para o menor inteiro maior ou igual a ele. Garante que qualquer resíduo fracionário ocupe uma 'página' inteira a mais." },
            { id: 28, instruction: "Lógica Proposicional", scenario: "Na álgebra booleana, a operação NOT (¬).", text: "Pode ser vista como uma função do conjunto {0,1} nele mesmo. Qual propriedade ela possui?", options: ["É uma Bijeção", "É uma Constante", "Não é função", "Gera o conjunto vazio"], answer: "É uma Bijeção", explanation: "A negação mapeia 0 para 1, e 1 para 0. Todos os elementos do domínio têm saída única, e todos os elementos do contradomínio são atingidos." },
            { id: 29, instruction: "Matemática Discreta (Menezes/Gersting)", scenario: "A base referencial do seu mapa (Menezes, 2013; Gersting, 2016).", text: "Ao contrário do cálculo clássico (limites, integrais), as funções na Matemática Discreta operam sobre domínios que são:", options: ["Infinitos e contínuos", "Contáveis, enumeráveis e descontínuos", "Sempre reais positivos", "Exclusivamente matrizes 3D"], answer: "Contáveis, enumeráveis e descontínuos", explanation: "A essência do 'discreto' na computação é lidar com passos e estados finitos ou enumeráveis (ex: bits, inteiros, nós de um grafo)." },
            { id: 30, instruction: "Função Identidade", scenario: "Um servidor proxy recebe um pacote e o repassa exatamente igual.", text: "Se f(x) = x, esta função é chamada matematicamente de:", options: ["Composta", "Logarítmica", "Identidade", "Polinomial"], answer: "Identidade", explanation: "A função identidade mapeia cada elemento do domínio para si mesmo no contradomínio, sem alteração estrutural ou de valor." },
            
            { id: 31, instruction: "Conjunto das Partes (Cálculo)", scenario: "Uma tabela com 3 chaves estrangeiras.", text: "Quantas combinações possíveis de filtros (incluindo nenhum filtro) podem ser feitas? (Pense no conjunto das partes de 3 elementos)", options: ["6", "8", "9", "3"], answer: "8", explanation: "Calculado por 2ⁿ. Com 3 elementos, temos 2³ = 8 combinações possíveis de subconjuntos de filtros." },
            { id: 32, instruction: "Igualdade de Conjuntos", scenario: "Conjunto A = {1, 2, 3} e Conjunto B = {3, 2, 1, 1}.", text: "Matematicamente, qual a relação entre A e B?", options: ["A < B", "A = B", "A é disjunto de B", "B é complemento de A"], answer: "A = B", explanation: "Em teoria dos conjuntos, a ordem dos elementos não importa e elementos repetidos são ignorados. Ambos contêm apenas os valores únicos 1, 2 e 3." },
            { id: 33, instruction: "Colisão de Hash (Teoria)", scenario: "A função Hash deve mapear nomes para índices de um Array.", text: "Se a função NÃO for Injetora, o que ocorre no sistema?", options: ["Recursão infinita", "Colisão (duas entradas apontam para a mesma saída)", "Geração de matriz inversa", "Erro de sintaxe"], answer: "Colisão (duas entradas apontam para a mesma saída)", explanation: "A falta de injeção significa que x₁ ≠ x₂ pode resultar em f(x₁) = f(x₂). Em bancos de dados e hashtables, isso exige algoritmos de tratamento de colisão." },
            { id: 34, instruction: "Restrição de Domínio", scenario: "A função f(x) = 1 / (x - 2) escrita em um script numérico.", text: "Para que a função exista nos Reais, o elemento 2 deve ser:", options: ["Multiplicado pelo contradomínio", "Incluído no domínio", "Excluído do domínio (x ≠ 2)", "Considerado a imagem principal"], answer: "Excluído do domínio (x ≠ 2)", explanation: "A divisão por zero não é definida. Portanto, a regra matemática exige que o denominador não seja zero, removendo o 2 do Domínio." },
            { id: 35, instruction: "Permutação como Bijeção", scenario: "Você embaralha (shuffle) um array de 5 cartas.", text: "A ordenação final é uma função que liga o índice original ao índice novo. Ela é Bijetora porque:", options: ["As cartas são descartadas", "Garante mapeamento 1-para-1 sem perder nem duplicar nenhuma carta", "É uma função constante", "Possui cardinalidade nula"], answer: "Garante mapeamento 1-para-1 sem perder nem duplicar nenhuma carta", explanation: "Cada carta velha vai para um lugar novo único, e cada lugar novo é ocupado por uma carta velha. Isso define uma bijeção estrita." },
            { id: 36, instruction: "Relações Reflexivas", scenario: "A relação ≤ (menor ou igual).", text: "Para qualquer número de ponto flutuante a, a ≤ a. Esta propriedade em conjuntos chama-se:", options: ["Simétrica", "Reflexiva", "Transitiva", "Antissimétrica"], answer: "Reflexiva", explanation: "Uma relação é reflexiva se todo elemento do conjunto está relacionado com si mesmo. Todo número é menor ou igual a si próprio." },
            { id: 37, instruction: "Recursividade e Sequências", scenario: "Uma função é definida como: f(0) = 1, f(n) = n * f(n-1).", text: "Esta notação representa a função:", options: ["Quadrática", "Fatorial", "Raiz Quadrada", "Constante zero"], answer: "Fatorial", explanation: "Esta é a definição discreta clássica do Fatorial (recorrência matemática). Ex: f(3) = 3 * f(2) = 3 * 2 * f(1)... = 6." },
            { id: 38, instruction: "Diferença Simétrica (Prática)", scenario: "Seja A = {1, 2, 3} e B = {2, 3, 4}.", text: "A diferença simétrica A Δ B ou A ⊕ B (elementos exclusivos de cada) é:", options: ["{2, 3}", "{1, 4}", "{1, 2, 3, 4}", "{}"], answer: "{1, 4}", explanation: "A diferença simétrica retorna a união menos a interseção. O que pertence a A e não a B, e o que pertence a B e não a A. Portanto, 1 e 4." },
            { id: 39, instruction: "Lógica AND (Interseção)", scenario: "Filtro no banco de dados: `idade > 18 AND ativo = true`.", text: "Aplicamos filtros simultâneos. Se o Conjunto A atende a primeira regra e B a segunda, o resultado está em:", options: ["A ∪ B", "A ∩ B", "A - B", "B - A"], answer: "A ∩ B", explanation: "O operador lógico AND reflete a interseção, onde o resultado deve pertencer simultaneamente a ambos os conjuntos de critérios." },
            { id: 40, instruction: "Lógica OR (União)", scenario: "Filtro: `plano = VIP OR pontos > 100`.", text: "Se o Conjunto A atende a primeira regra e B a segunda, o resultado está em:", options: ["A ∩ B", "A - B", "A ∪ B", "Produto Cartesiano"], answer: "A ∪ B", explanation: "O operador lógico OR é inclusivo e equivalente à união matemática. Basta pertencer a A, a B, ou a ambos para entrar no resultado final." },
            { id: 41, instruction: "Operador NOT (Complemento)", scenario: "Filtro: `NOT banido`.", text: "Considerando o conjunto Universal (U) de todos os usuários e o conjunto B de banidos. A query retorna:", options: ["O complemento de B (Bᶜ)", "A interseção nula", "O produto cartesiano de U e B", "O limite de B"], answer: "O complemento de B (Bᶜ)", explanation: "O complemento de um conjunto contém tudo o que está no universo e que NÃO está no próprio conjunto (matematicamente denotado como U - B ou Bᶜ)." },
            { id: 42, instruction: "Relação Antissimétrica", scenario: "Analisando a hierarquia de herança no código: Se Classe X herda de Y.", text: "E se Y herdasse de X, X e Y teriam que ser a mesma classe. Essa propriedade garante grafos sem ciclos longos e chama-se:", options: ["Reflexiva", "Antissimétrica", "Transitiva", "Comutativa"], answer: "Antissimétrica", explanation: "Em uma relação de ordem parcial, se aRb e bRa, então a = b. Previne loops infinitos na árvore de dependências." },
            { id: 43, instruction: "Árvores (Grafos Direcionados)", scenario: "Aplicações em Ciência da Computação: O DOM (Document Object Model) da sua página web.", text: "Pode ser modelado matematicamente como qual tipo de relação/grafo?", options: ["Grafo Bipartido Completo", "Grafo Acíclico Direcionado (Árvore)", "Matriz Identidade", "Malha circular infinita"], answer: "Grafo Acíclico Direcionado (Árvore)", explanation: "Elementos HTML formam uma hierarquia pai-filho estrita. Não existem ciclos (um elemento não pode ser filho do seu próprio filho), formando uma Árvore matemática." },
            { id: 44, instruction: "Teorema de De Morgan 1", scenario: "Lógica de conjuntos aplicada ao IF do código: `!(A && B)`.", text: "A Lei de De Morgan prova que o complemento da Interseção (A ∩ B)ᶜ é igual a:", options: ["A união dos complementos (Aᶜ ∪ Bᶜ)", "A diferença de A e B", "Apenas `!A && !B`", "Produto cartesiano"], answer: "A união dos complementos (Aᶜ ∪ Bᶜ)", explanation: "De Morgan estabelece que o inverso da interseção é a união dos inversos. Negar que duas coisas sejam verdadeiras juntas é o mesmo que afirmar que pelo menos uma é falsa." },
            { id: 45, instruction: "Teorema de De Morgan 2", scenario: "Lógica de código: `!(A || B)`.", text: "Matematicamente, o complemento da União (A ∪ B)ᶜ é igual a:", options: ["A união dos complementos", "A interseção dos complementos (Aᶜ ∩ Bᶜ)", "A diferença simétrica", "Subconjunto vazio"], answer: "A interseção dos complementos (Aᶜ ∩ Bᶜ)", explanation: "Se não é verdade que A ou B aconteceram, então, obrigatoriamente, A não aconteceu E B não aconteceu." },
            { id: 46, instruction: "Autômatos e Estados", scenario: "De acordo com Gersting (2016), Máquinas de Estado Finito.", text: "A função de transição de um autômato (δ) mapeia um Estado e um Símbolo lido para:", options: ["Um arquivo de texto", "Um novo Estado", "Um conjunto de floats contínuos", "O banco de dados relacional"], answer: "Um novo Estado", explanation: "Matematicamente δ: Q × Σ → Q. O autômato calcula o próximo passo com base onde está e o que leu na fita." },
            { id: 47, instruction: "Relação Transitiva (Prática)", scenario: "Se A = 'Variável x é igual a y', e B = 'y é igual a z'.", text: "Pela propriedade transitiva da igualdade, podemos afirmar categoricamente que:", options: ["x é maior que z", "x é igual a z", "z é indefinido", "x e z são disjuntos"], answer: "x é igual a z", explanation: "A transitividade (se aRb e bRc, então aRc) é a espinha dorsal de provas lógicas em programação e inferência de tipos." },
            { id: 48, instruction: "Princípio da Inclusão-Exclusão", scenario: "Uma turma tem 10 programadores Java e 10 de Python. 3 programam em ambos.", text: "Quantos programadores únicos existem no total (|J ∪ P|)?", options: ["20", "23", "17", "10"], answer: "17", explanation: "O cálculo é |J| + |P| - |J ∩ P|. Somamos os dois grupos (10+10=20) e subtraímos a interseção (3) que foi contada duas vezes. Resposta: 17." },
            { id: 49, instruction: "Função Logarítmica (Algoritmos)", scenario: "A busca binária divide o conjunto de entrada pela metade a cada passo.", text: "O número máximo de passos para achar um item em uma lista ordenada de tamanho N é descrito pela função:", options: ["Exponencial", "Linear", "O(log N) na base 2", "Fatorial"], answer: "O(log N) na base 2", explanation: "Reduzir o espaço de busca pela metade repetidamente é a definição do logaritmo em base 2, tornando a busca extremamente eficiente." },
            { id: 50, instruction: "Potência de Conjuntos", scenario: "Dado o conjunto vazio ∅.", text: "Qual a cardinalidade do Conjunto das Partes (Power Set) do conjunto vazio?", options: ["0", "1", "2", "Indefinido"], answer: "1", explanation: "A cardinalidade é 2ⁿ. Como n=0 para o vazio, 2⁰ = 1. O único subconjunto do conjunto vazio é o próprio conjunto vazio {∅}." },
            { id: 51, instruction: "Funções Modulares", scenario: "Uma tabela Hash de tamanho 5. A função é f(x) = x mod 5.", text: "Para x = 12, qual é a Imagem (índice mapeado)?", options: ["2", "7", "12", "0"], answer: "2", explanation: "O operador módulo retorna o resto da divisão. 12 ÷ 5 = 2, com resto 2. Portanto, o valor mapeado é a posição 2." },
            { id: 52, instruction: "Composição Associativa", scenario: "Aplicando 3 funções seguidas.", text: "Na teoria das funções, a composição é associativa, o que significa que o resultado é igual a:", options: ["h + g + f", "f ∘ (g ∘ h)", "(h ∘ g) ∘ f = h ∘ (g ∘ f)", "f × g × h"], answer: "(h ∘ g) ∘ f = h ∘ (g ∘ f)", explanation: "A propriedade associativa garante que a ordem em que você agrupa a execução das chamadas de função (desde que mantenha a sequência da fila) não altera o resultado final." },
            { id: 53, instruction: "Aplicações: Lógica Fuzzy", scenario: "Ao invés de elementos pertencerem ou não pertencerem (0 ou 1) a um conjunto.", text: "Na computação moderna, quando a pertinência a um conjunto é gradual (grau de 0.0 a 1.0), temos a teoria dos:", options: ["Conjuntos Disjuntos Puros", "Conjuntos Difusos (Fuzzy Sets)", "Fractais de Mandelbrot", "Equações Diferenciais"], answer: "Conjuntos Difusos (Fuzzy Sets)", explanation: "Sistemas de IA e controle, onde 'quente' não é um sim ou não booleano absoluto, mas uma função de probabilidade ou pertinência contínua." },
            { id: 54, instruction: "Funções de Ordem Superior", scenario: "Em Javascript, o método `.map()` aplica uma função interna a cada elemento de um array.", text: "Uma função que recebe outra função como parâmetro ou retorna uma função é matematicamente modelada como:", options: ["Polinômio de Taylor", "Função de Ordem Superior (Funcional)", "Constante de Euler", "Progressão Aritmética"], answer: "Função de Ordem Superior (Funcional)", explanation: "Na matemática combinatória e cálculo lambda, operadores e transformadas atuam sobre funções e não apenas sobre números primários." },
            { id: 55, instruction: "Função Estritamente Crescente", scenario: "Uma coluna de Banco de Dados 'Auto Increment'.", text: "Sempre que x₁ < x₂, a saída atende f(x₁) < f(x₂). Esta função é considerada:", options: ["Monótona Estritamente Crescente", "Periódica", "Simétrica em Y", "Logarítmica decrescente"], answer: "Monótona Estritamente Crescente", explanation: "Garante que não existem repetições e a ordem dos IDs gerados reflete temporalmente a ordem de inserção." },
            { id: 56, instruction: "Avaliação de Relações", scenario: "Um grafo onde todas as setas têm uma seta de volta (vai e volta).", text: "Essa propriedade estrutural de um conjunto relacionado indica que a relação é:", options: ["Transitiva", "Antissimétrica", "Simétrica", "Irreflexiva"], answer: "Simétrica", explanation: "Simetria em matemática discreta: Se A se relaciona com B, então B se relaciona com A obrigatoriamente." },
            { id: 57, instruction: "Grafos e Matrizes", scenario: "Representando conexões lógicas de um projeto em código.", text: "Uma relação binária em um conjunto finito pode ser completamente representada no computador usando uma:", options: ["Matriz de Adjacência (Matriz Booleana)", "Esfera geométrica 3D", "Pilha (LIFO) unicamente", "Fila circular"], answer: "Matriz de Adjacência (Matriz Booleana)", explanation: "Linhas indicam o domínio, colunas o contradomínio. O valor '1' indica que o par faz parte da relação, mapeando as arestas do grafo para a memória da máquina." },
            { id: 58, instruction: "Involução", scenario: "Um operador binário como o Bitwise XOR aplicado duas vezes pelo mesmo valor (A ⊕ B ⊕ B = A).", text: "Quando uma função é sua própria inversa, aplicando-a duas vezes e voltando ao estado inicial, ela é uma:", options: ["Função Constante", "Involução (Função Involutiva)", "Exponenciação fracionária", "Parábola Côncava"], answer: "Involução (Função Involutiva)", explanation: "O complemento lógico NOT também é involutivo (a negação da negação é a afirmação). f(f(x)) = x." },
            { id: 59, instruction: "Sequências e Recursão", scenario: "A relação f(n) = f(n-1) + f(n-2), com f(0)=0 e f(1)=1.", text: "Esta é a lei de formação discreta de qual famosa sequência matemática na computação?", options: ["Números Primos", "Sequência de Fibonacci", "Potências de 2", "Constante de Pi"], answer: "Sequência de Fibonacci", explanation: "Esta relação de recorrência de segunda ordem soma os dois termos anteriores para gerar o próximo. Altamente usada em algoritmos dinâmicos." },
            { id: 60, instruction: "Propriedade Fechada", scenario: "A adição em uma linguagem que só suporta Inteiros de 8 bits (0 a 255).", text: "Se a soma 150 + 150 resultar em overflow (fora do escopo), diz-se que esse sistema computacional NÃO é:", options: ["Comutativo", "Associativo", "Fechado sob a operação", "Lógico"], answer: "Fechado sob a operação", explanation: "Na álgebra abstrata, um conjunto é 'fechado' para uma operação se a operação com dois elementos do conjunto sempre resulta em um elemento do próprio conjunto." }
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
                    // Trata as tags HTML para não digitar caracter por caracter dentro do DOM e quebrar
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
            await typeWriter(`Carregando rotina [${currentQuestion.value.id}/60]...`, "log-info");
            await typeWriter(`Cenário Base: ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Compilação concluída com sucesso. Exportando métricas Discretas...", "log-info");
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
                addLog(`Success: Relação matemática aceita.`, "log-success");
                showAnswer.value = true;
                
                await typeWriter(`>> Diagnóstico da Engine:`, "log-info");
                await typeWriter(`Explicação: ${currentQuestion.value.explanation}`, "log-default");
                
                isTyping.value = false;
                setTimeout(nextQuestion, 4000); 
            } else {
                attempts.value++;
                
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Exceção. Resposta correta: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog(`Error: Violação de mapeamento.`, "log-error");
                    showAnswer.value = true;
                    
                    await typeWriter(`>> Correção Forçada pela Engine:`, "log-info");
                    await typeWriter(`Explicação: ${currentQuestion.value.explanation}`, "log-warning");
                    
                    isTyping.value = false;
                    setTimeout(nextQuestion, 5000);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Incorreto. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Warning: Processo abortado. Revise a lógica de conjuntos. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
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
            
            let performanceMsg = "Domínio Sólido Operações e Funções em Matemática Discreta.";
            if (score.value < 42) performanceMsg = "Recomenda-se revisão de Interseções, Injeção/Sobrejeção e Relações.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #00bfa5; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #00bfa5; margin: 0;">Relatório de Compilação: Matemática Discreta</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação: Lógica Formal e Algoritmos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Execução:</strong> ${data}</p>
                    <p><strong>Avaliado por:</strong> Engine Discreta (MATH.ESCAPE)</p>
                    <p>Este documento certifica a validação estrutural do estudante durante ${questions.value.length} testes de stress lógico em diagramas, correlações sistêmicas, cálculos restritos de matrizes e modelagem relacional de grafos.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Taxa de Transferência Lógica</h3>
                        <p style="font-size: 28px; color: ${score.value >= 42 ? '#10B981' : (score.value >= 30 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Associações Corretas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Status: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Log gerado pelo Terminal Módulo MATH.ESCAPE v2
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Log_Discreta_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando Máquina de Estados...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Booting MATH.ESCAPE v2 (Discrete Engine)...", "log-info");
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