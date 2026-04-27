const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        const currentView = ref('menu'); 
        const selectedGroup = ref(null);
        const currentTab = ref('practical'); 
        
        const practicalScore = ref(0);
        const conceptualScore = ref(0);
        
        const indices = ref({ practical: 0, conceptual: 0 });
        const currentQuestionIndex = computed(() => indices.value[currentTab.value]);
        
        const userSelection = ref(null);
        const showAnswer = ref(false);
        const feedback = ref(null);
        const attempts = ref(0);

        const newNodeText = ref(""); 
        const nodes = ref([]);
        const edges = ref([]);
        const edgeStartNode = ref(null);
        
        // ==========================================
        // BANCO DE 120 QUESTÕES (INTRODUÇÃO BÁSICA)
        // ==========================================
        const questionsDb = {
            // GRUPO 1: CONTEXTO - MOEDAS E DADOS (20 Questões)
            1: {
                practical: [
                    { context: "Dado de 6 faces.", text: "Probabilidade de sair número par?", options: ["1/2", "1/6", "1/3", "2/3"], answer: "1/2", explanation: "Pares: 2,4,6 (3 casos). Total: 6. 3/6 = 1/2." },
                    { context: "Moeda.", text: "Lançar uma moeda. Probabilidade de dar Cara?", options: ["1/2", "1/4", "1", "0"], answer: "1/2", explanation: "1 Cara em 2 lados." },
                    { context: "Dado de 6 faces.", text: "Sair um número menor que 3?", options: ["1/3", "1/6", "1/2", "2/3"], answer: "1/3", explanation: "Números 1 e 2 (2 casos). 2/6 = 1/3." },
                    { context: "Dado de 6 faces.", text: "Sair o número 5?", options: ["1/6", "1/2", "5/6", "1/3"], answer: "1/6", explanation: "O 5 é apenas 1 face entre as 6." },
                    { context: "Duas moedas.", text: "Probabilidade de Cara E Cara?", options: ["1/4", "1/2", "3/4", "1/8"], answer: "1/4", explanation: "Regra da multiplicação: 1/2 * 1/2 = 1/4." },
                    { context: "Dado de 6 faces.", text: "Sair 1 OU 6?", options: ["1/3", "1/6", "1/2", "2/6"], answer: "1/3", explanation: "Soma: 1/6 + 1/6 = 2/6 = 1/3." },
                    { context: "Dado de 6 faces.", text: "Sair número > 4?", options: ["1/3", "1/6", "1/2", "2/3"], answer: "1/3", explanation: "Números 5,6 (2 casos). 2/6 = 1/3." },
                    { context: "Moeda e Dado.", text: "Sair Cara E número 2?", options: ["1/12", "1/6", "1/8", "1/4"], answer: "1/12", explanation: "Multiplicação: 1/2 * 1/6 = 1/12." },
                    { context: "Dado de 6 faces.", text: "Sair Par OU número 3?", options: ["2/3", "1/2", "1/3", "5/6"], answer: "2/3", explanation: "Pares (3/6) + Três (1/6) = 4/6 = 2/3." },
                    { context: "Duas moedas.", text: "Sair Coroa na 1ª E Coroa na 2ª?", options: ["1/4", "1/2", "3/4", "1"], answer: "1/4", explanation: "1/2 * 1/2 = 1/4." }
                ],
                conceptual: [
                    { context: "Fundamentos", text: "O que é Espaço Amostral?", options: ["Todos os resultados possíveis", "O resultado que eu quero", "Soma de eventos", "Um evento impossível"], answer: "Todos os resultados possíveis", explanation: "Espaço amostral é o conjunto total de possibilidades." },
                    { context: "Fundamentos", text: "O que é um Evento?", options: ["Um subconjunto do espaço amostral", "Uma certeza absoluta", "Um cálculo de soma", "O resultado final"], answer: "Um subconjunto do espaço amostral", explanation: "Evento é qualquer parte retirada do espaço total." },
                    { context: "Regras Básicas", text: "O 'OU' na probabilidade indica qual operação?", options: ["Soma", "Multiplicação", "Divisão", "Subtração"], answer: "Soma", explanation: "Quando queremos um OU outro, somamos as chances." },
                    { context: "Regras Básicas", text: "O 'E' na probabilidade indica qual operação?", options: ["Multiplicação", "Soma", "Divisão", "Potência"], answer: "Multiplicação", explanation: "Quando queremos eventos seguidos (um E outro), multiplicamos." },
                    { context: "Fundamentos", text: "Probabilidade do evento Certo?", options: ["1 (100%)", "0", "0.5", "Infinito"], answer: "1 (100%)", explanation: "Evento certo tem chance total de ocorrer." },
                    { context: "Fundamentos", text: "Probabilidade do evento Impossível?", options: ["0", "1", "-1", "0.1"], answer: "0", explanation: "Não há casos favoráveis." },
                    { context: "Soma", text: "Eventos Mutuamente Exclusivos são aqueles que:", options: ["Não ocorrem juntos", "Ocorrem juntos", "São multiplicados", "Somam mais que 1"], answer: "Não ocorrem juntos", explanation: "Ex: Um dado não pode dar 2 e 5 ao mesmo tempo." },
                    { context: "Multiplicação", text: "Eventos Independentes são:", options: ["Um não afeta a chance do outro", "Um anula o outro", "Somados dão 1", "Impossíveis"], answer: "Um não afeta a chance do outro", explanation: "Ex: Jogar duas moedas. A primeira não muda a segunda." },
                    { context: "Cálculo", text: "Fórmula clássica de probabilidade?", options: ["Favoráveis / Possíveis", "Possíveis / Favoráveis", "Soma total", "Favoráveis * Possíveis"], answer: "Favoráveis / Possíveis", explanation: "O que eu quero dividido por tudo que pode acontecer." },
                    { context: "Fundamentos", text: "Valor máximo de uma probabilidade?", options: ["1", "10", "100", "Infinito"], answer: "1", explanation: "Varia sempre de 0 (0%) a 1 (100%)." }
                ]
            },

            // GRUPO 2: CONTEXTO - URNAS E BOLAS COLORIDAS
            2: {
                practical: [
                    { context: "Urna: 3 Azuis, 2 Vermelhas.", text: "Probabilidade de tirar Azul?", options: ["3/5", "2/5", "1/2", "1/5"], answer: "3/5", explanation: "3 azuis num total de 5 bolas." },
                    { context: "Urna: 4 Verdes, 6 Amarelas.", text: "Probabilidade de tirar Verde?", options: ["4/10", "6/10", "1/10", "1/2"], answer: "4/10", explanation: "4 verdes num total de 10 bolas." },
                    { context: "Urna: 5 Pretas, 5 Brancas.", text: "Tirar Preta OU Branca?", options: ["1", "1/2", "1/4", "0"], answer: "1", explanation: "Soma: 5/10 + 5/10 = 10/10 = 1 (100%)." },
                    { context: "Urna: 2 Azuis, 3 Verdes.", text: "Tirar Azul, devolver (reposição), tirar Azul de novo?", options: ["4/25", "2/5", "1/5", "4/10"], answer: "4/25", explanation: "Multiplicação: 2/5 * 2/5 = 4/25." },
                    { context: "Urna: 1 Ouro, 9 Prata.", text: "Probabilidade de Ouro?", options: ["1/10", "9/10", "1/2", "1"], answer: "1/10", explanation: "1 de ouro em 10 totais." },
                    { context: "Urna: 2 Verdes, 2 Azuis, 2 Vermelhas.", text: "Tirar Verde OU Azul?", options: ["4/6", "2/6", "1/6", "1"], answer: "4/6", explanation: "Soma: 2/6 + 2/6 = 4/6." },
                    { context: "Urna: 3 Brancas, 1 Preta.", text: "Tirar Branca E (com reposição) Preta?", options: ["3/16", "3/4", "1/4", "4/16"], answer: "3/16", explanation: "Multiplicação: 3/4 * 1/4 = 3/16." },
                    { context: "Urna: 10 Vermelhas.", text: "Probabilidade de tirar Azul?", options: ["0", "1", "1/10", "1/2"], answer: "0", explanation: "Não há bolas azuis (Evento Impossível)." },
                    { context: "Urna: 5 Azuis, 5 Verdes.", text: "Tirar Verde, repor, tirar Verde?", options: ["1/4", "1/2", "25/50", "1/5"], answer: "1/4", explanation: "1/2 * 1/2 = 1/4." },
                    { context: "Urna: 4 Brancas, 6 Pretas.", text: "Tirar Preta?", options: ["6/10", "4/10", "1/10", "1/2"], answer: "6/10", explanation: "6 pretas de 10 totais." }
                ],
                conceptual: [
                    { context: "Reposição", text: "Retirada COM reposição significa que os eventos são:", options: ["Independentes", "Dependentes", "Impossíveis", "Certos"], answer: "Independentes", explanation: "Devolver a bola mantém o espaço amostral igual para a próxima." },
                    { context: "Reposição", text: "Retirada SEM reposição altera o:", options: ["Espaço amostral da 2ª tentativa", "O evento da 1ª tentativa", "A regra da soma", "O evento impossível"], answer: "Espaço amostral da 2ª tentativa", explanation: "O total de bolas diminui, alterando as chances seguintes." },
                    { context: "Conectivo OU", text: "Se a questão diz 'Bola Azul OU Verde', devemos:", options: ["Somar as frações", "Multiplicar as frações", "Dividir as frações", "Ignorar a cor verde"], answer: "Somar as frações", explanation: "A união de alternativas pede a Regra da Soma." },
                    { context: "Conectivo E", text: "Se a questão diz 'Bola Azul E depois Verde', devemos:", options: ["Multiplicar as frações", "Somar as frações", "Subtrair as frações", "Somar os numeradores"], answer: "Multiplicar as frações", explanation: "Eventos sucessivos exigem a Regra da Multiplicação." },
                    { context: "Soma básica", text: "Na soma de frações com denominadores iguais (ex: 2/5 + 1/5):", options: ["Soma-se os de cima, mantém o de baixo", "Soma tudo", "Multiplica cruzado", "Corta os de baixo"], answer: "Soma-se os de cima, mantém o de baixo", explanation: "Regra básica de matemática para probabilidade." },
                    { context: "Soma básica", text: "Dois eventos que não podem sair juntos numa mesma retirada são:", options: ["Mutuamente exclusivos", "Independentes", "Unidos", "Condicionais"], answer: "Mutuamente exclusivos", explanation: "Uma única bola não pode ser inteiramente vermelha e inteiramente azul." },
                    { context: "Multiplicação", text: "Na multiplicação de frações (ex: 1/2 * 1/3):", options: ["Multiplica cima com cima, baixo com baixo", "Soma os de baixo", "Mantém o de baixo", "Inverte a segunda"], answer: "Multiplica cima com cima, baixo com baixo", explanation: "1*1 / 2*3 = 1/6." },
                    { context: "Definição", text: "O total de bolas na urna representa o:", options: ["Espaço Amostral", "Evento", "Experimento", "Complementar"], answer: "Espaço Amostral", explanation: "É a soma de todas as possibilidades físicas de sorteio." },
                    { context: "Limites", text: "Se não tem bola amarela na urna, a chance de sair amarela é:", options: ["Zero (0)", "Um (1)", "Meio (0.5)", "Negativa"], answer: "Zero (0)", explanation: "É um evento matematicamente impossível." },
                    { context: "Limites", text: "Se todas as bolas são pretas, a chance de sair preta é:", options: ["Um (1 ou 100%)", "Zero", "Depende", "Meio"], answer: "Um (1 ou 100%)", explanation: "É um evento certo." }
                ]
            },

            // GRUPO 3: CONTEXTO - BARALHO (52 CARTAS)
            3: {
                practical: [
                    { context: "Baralho 52 cartas.", text: "Probabilidade de tirar um Ás?", options: ["4/52", "1/52", "13/52", "2/52"], answer: "4/52", explanation: "São 4 naipes, logo 4 Ases." },
                    { context: "Baralho 52 cartas.", text: "Probabilidade de tirar carta de Copas?", options: ["13/52", "4/52", "1/4", "1/52"], answer: "13/52", explanation: "Cada naipe tem 13 cartas." },
                    { context: "Baralho 52 cartas.", text: "Tirar um Rei OU uma Rainha?", options: ["8/52", "4/52", "2/52", "16/52"], answer: "8/52", explanation: "4 Reis + 4 Rainhas = 8 cartas. Soma." },
                    { context: "Baralho.", text: "Tirar Ouro E (com reposição) Ouro de novo?", options: ["1/16", "13/52", "26/52", "1/8"], answer: "1/16", explanation: "1/4 * 1/4 = 1/16." },
                    { context: "Baralho.", text: "Tirar carta Preta?", options: ["26/52", "13/52", "4/52", "1/52"], answer: "26/52", explanation: "Metade do baralho é preto (Paus e Espadas)." },
                    { context: "Baralho.", text: "Tirar carta Preta OU Vermelha?", options: ["1", "1/2", "1/4", "0"], answer: "1", explanation: "Cobre 100% do espaço amostral." },
                    { context: "Baralho.", text: "Tirar o Ás de Espadas?", options: ["1/52", "4/52", "13/52", "2/52"], answer: "1/52", explanation: "Existe apenas 1 Ás de Espadas." },
                    { context: "Baralho.", text: "Tirar carta Vermelha E (com reposição) carta Preta?", options: ["1/4", "1/2", "1/8", "1"], answer: "1/4", explanation: "1/2 * 1/2 = 1/4." },
                    { context: "Baralho.", text: "Tirar o Rei de Copas OU Rei de Ouros?", options: ["2/52", "4/52", "1/52", "8/52"], answer: "2/52", explanation: "São 2 cartas específicas. 1/52 + 1/52 = 2/52." },
                    { context: "Baralho.", text: "Tirar Figura (J, Q, K)?", options: ["12/52", "4/52", "3/52", "16/52"], answer: "12/52", explanation: "3 figuras por naipe * 4 naipes = 12 figuras." }
                ],
                conceptual: [
                    { context: "União e Soma", text: "Tirar Rei OU Rainha é um caso de eventos:", options: ["Mutuamente Exclusivos", "Com interseção", "Independentes", "Dependentes"], answer: "Mutuamente Exclusivos", explanation: "Uma carta não pode ser Rei e Rainha ao mesmo tempo." },
                    { context: "Espaço Amostral", text: "No baralho clássico, o denominador das probabilidades iniciais será sempre:", options: ["52", "13", "4", "26"], answer: "52", explanation: "52 é o número total de possibilidades (espaço amostral)." },
                    { context: "Eventos Sucessivos", text: "Para calcular a chance de 'Ás e depois Rei' (com reposição), usamos:", options: ["Multiplicação", "Soma", "Subtração", "Divisão"], answer: "Multiplicação", explanation: "Regra do 'E' (eventos em sequência)." },
                    { context: "Conectivos", text: "A palavra 'OU' num problema de baralho avisa o cérebro para:", options: ["Somar", "Multiplicar", "Anular", "Pular a questão"], answer: "Somar", explanation: "OU = Soma das possibilidades." },
                    { context: "Independência", text: "Repor a carta no baralho garante que a 2ª retirada seja:", options: ["Independente da 1ª", "Dependente da 1ª", "Certa", "Impossível"], answer: "Independente da 1ª", explanation: "O cenário volta exatamente ao que era no início." },
                    { context: "Dependência", text: "NÃO repor a carta faz o denominador da 2ª retirada cair para:", options: ["51", "52", "13", "0"], answer: "51", explanation: "O espaço amostral diminui em 1 unidade." },
                    { context: "Subconjuntos", text: "As 13 cartas de Copas formam um:", options: ["Evento", "Espaço Amostral Completo", "Erro", "Experimento"], answer: "Evento", explanation: "Copas é um subconjunto do baralho todo." },
                    { context: "Limites", text: "Tirar uma carta com o número 15 no baralho tradicional é um evento:", options: ["Impossível", "Certo", "Raro", "Independente"], answer: "Impossível", explanation: "Cartas vão de Ás (1) a Rei (13)." },
                    { context: "Complementar", text: "Chance de ser Copas é 1/4. A chance de NÃO ser Copas é:", options: ["3/4", "1/2", "1/4", "1"], answer: "3/4", explanation: "1 inteiro - 1/4 = 3/4." },
                    { context: "Soma", text: "Tirar Paus (13) OU Espadas (13) = 26/52. Isso prova que as cores do baralho têm chance de:", options: ["50%", "25%", "100%", "0%"], answer: "50%", explanation: "26 de 52 é exatamente a metade do baralho." }
                ]
            },

            // GRUPO 4: CONTEXTO - ROLETAS E SORTEIOS DE NÚMEROS
            4: {
                practical: [
                    { context: "Roleta (1 a 10).", text: "Probabilidade de cair no 7?", options: ["1/10", "7/10", "1/2", "2/10"], answer: "1/10", explanation: "Apenas uma casa número 7." },
                    { context: "Sorteio 1 a 20.", text: "Probabilidade de sair número Par?", options: ["10/20", "5/20", "2/20", "15/20"], answer: "10/20", explanation: "Metade dos números são pares (10 casos)." },
                    { context: "Roleta (1 a 10).", text: "Cair no 2 OU no 4?", options: ["2/10", "4/10", "1/10", "6/10"], answer: "2/10", explanation: "Soma: 1/10 + 1/10 = 2/10." },
                    { context: "Sorteio 1 a 10.", text: "Sair número maior que 8?", options: ["2/10", "8/10", "3/10", "1/10"], answer: "2/10", explanation: "Números 9 e 10 (2 casos)." },
                    { context: "Roleta (1 a 5).", text: "Rodar duas vezes. Sair 1 na 1ª E 1 na 2ª?", options: ["1/25", "1/5", "2/5", "1/10"], answer: "1/25", explanation: "Multiplicação: 1/5 * 1/5 = 1/25." },
                    { context: "Sorteio 1 a 15.", text: "Sair o número 1 OU número 15?", options: ["2/15", "1/15", "15/15", "3/15"], answer: "2/15", explanation: "Soma: 1/15 + 1/15 = 2/15." },
                    { context: "Roleta 1 a 8.", text: "Sair Par E (rodar de novo) sair Ímpar?", options: ["1/4", "1/2", "1/8", "1/16"], answer: "1/4", explanation: "Par (4/8 = 1/2) * Ímpar (4/8 = 1/2) = 1/4." },
                    { context: "Sorteio 1 a 10.", text: "Sair número menor ou igual a 3?", options: ["3/10", "4/10", "2/10", "1/10"], answer: "3/10", explanation: "Números 1, 2, 3 (3 casos)." },
                    { context: "Roleta 1 a 10.", text: "Sair um múltiplo de 5?", options: ["2/10", "1/10", "5/10", "3/10"], answer: "2/10", explanation: "Múltiplos: 5 e 10 (2 casos)." },
                    { context: "Sorteio 1 a 20.", text: "Sair 1, 2 OU 3?", options: ["3/20", "1/20", "2/20", "6/20"], answer: "3/20", explanation: "Soma direta de 3 eventos simples." }
                ],
                conceptual: [
                    { context: "Eventos Independentes", text: "Girar uma roleta duas vezes gera eventos:", options: ["Independentes", "Dependentes", "Exclusivos", "Impossíveis"], answer: "Independentes", explanation: "A roleta não tem 'memória'. O giro 1 não afeta o giro 2." },
                    { context: "Regra da Soma", text: "Pedir 'Par OU Ímpar' numa roleta normal resulta num evento:", options: ["Certo (Probabilidade 1)", "Impossível", "Metade", "Independente"], answer: "Certo (Probabilidade 1)", explanation: "Todos os números inteiros são pares ou ímpares. Cobre 100%." },
                    { context: "Identificação", text: "As casas da roleta formam o seu:", options: ["Espaço Amostral", "Evento Composto", "Experimento Físico", "Complementar"], answer: "Espaço Amostral", explanation: "São todos os resultados que a bolinha pode parar." },
                    { context: "Múltiplos Sorteios", text: "Ao sortear 'E' sortear novamente, usamos a conta de:", options: ["Vezes (Multiplicação)", "Mais (Soma)", "Menos", "Dividir"], answer: "Vezes (Multiplicação)", explanation: "Conectivo E = Multiplicar chances." },
                    { context: "Mutuamente Exclusivos", text: "A bolinha da roleta cair no 3 e no 8 ao mesmo tempo é:", options: ["Impossível", "Certo", "Independente", "Provável"], answer: "Impossível", explanation: "Uma bolinha só ocupa uma casa. São eventos exclusivos." },
                    { context: "Regras Básicas", text: "A palavra 'Múltiplo' nos exercícios serve para:", options: ["Filtrar os Casos Favoráveis", "Aumentar o Espaço Amostral", "Anular a chance", "Criar dependência"], answer: "Filtrar os Casos Favoráveis", explanation: "Dita a condição para separar o que queremos do que não queremos." },
                    { context: "Frações", text: "Simplificar a fração 2/10 para 1/5 altera a probabilidade?", options: ["Não, é exatamente a mesma chance", "Sim, aumenta a chance", "Sim, diminui a chance", "Torna o evento impossível"], answer: "Não, é exatamente a mesma chance", explanation: "São frações equivalentes (20%)." },
                    { context: "Lógica", text: "Sortear números é um experimento:", options: ["Aleatório", "Determinístico", "Impossível", "Dependente"], answer: "Aleatório", explanation: "Envolve o acaso, não dá para prever o resultado exato." },
                    { context: "Soma vs Mult", text: "Sorteio 1: 'Sair 5 ou 6'. Sorteio 2: 'Sair 5 e sair 6'. Qual a diferença?", options: ["1 é soma, 2 é multiplicação", "Ambos são soma", "Ambos são multiplicação", "Não há diferença"], answer: "1 é soma, 2 é multiplicação", explanation: "Os conectivos OU e E definem a operação." },
                    { context: "Básico", text: "Probabilidade se expressa em frações, decimais ou:", options: ["Porcentagens", "Letras", "Graus", "Horas"], answer: "Porcentagens", explanation: "1/2, 0.5 e 50% significam a exata mesma coisa." }
                ]
            },

            // GRUPO 5: CONTEXTO - LETRAS E CLIMA (COTIDIANO)
            5: {
                practical: [
                    { context: "Palavra BOLA.", text: "Sorteio de 1 letra. Chance de ser vogal?", options: ["2/4", "1/4", "3/4", "4/4"], answer: "2/4", explanation: "Vogais: O, A (2 de 4)." },
                    { context: "Palavra MATEMATICA (10 letras).", text: "Chance de sortear a letra M?", options: ["2/10", "1/10", "3/10", "4/10"], answer: "2/10", explanation: "Existem 2 letras M." },
                    { context: "Previsão do tempo.", text: "Chance de chuva é 40%. Chance de NÃO chover?", options: ["60%", "40%", "100%", "0%"], answer: "60%", explanation: "Complementar: 100% - 40% = 60%." },
                    { context: "Trânsito.", text: "Semáforo: Verde(30s), Amarelo(10s), Vermelho(20s). Total=60s. Chegar no Verde?", options: ["30/60", "10/60", "20/60", "60/60"], answer: "30/60", explanation: "Tempo verde / Tempo total = 30/60 (50%)." },
                    { context: "Dias da Semana (7).", text: "Sortear Segunda OU Terça?", options: ["2/7", "1/7", "3/7", "7/7"], answer: "2/7", explanation: "Soma: 1/7 + 1/7 = 2/7." },
                    { context: "Fábrica (100 peças).", text: "5 defeituosas. Qual a chance de sortear uma Perfeita?", options: ["95/100", "5/100", "100/100", "0"], answer: "95/100", explanation: "100 - 5 defeituosas = 95 perfeitas." },
                    { context: "Palavra OVO.", text: "Sair O?", options: ["2/3", "1/3", "3/3", "0/3"], answer: "2/3", explanation: "2 letras O em 3." },
                    { context: "Clima E Dado.", text: "Chuva (20%) E Dado cair 6 (1/6)?", options: ["1/30", "1/5", "1/6", "20%"], answer: "1/30", explanation: "20% é 1/5. Multiplicando: 1/5 * 1/6 = 1/30." },
                    { context: "Semáforo (60s total).", text: "Chegar no Amarelo (10s) OU Vermelho (20s)?", options: ["30/60", "10/60", "20/60", "60/60"], answer: "30/60", explanation: "Soma dos tempos: 10 + 20 = 30s. 30/60." },
                    { context: "Palavra GATO.", text: "Sair G OU T?", options: ["2/4", "1/4", "3/4", "4/4"], answer: "2/4", explanation: "1/4 + 1/4 = 2/4." }
                ],
                conceptual: [
                    { context: "Eventos Cotidianos", text: "A chance de Chuva afeta a chance de um Dado dar 6?", options: ["Não, são independentes", "Sim, são dependentes", "Sim, são exclusivos", "O dado sempre dá 6 na chuva"], answer: "Não, são independentes", explanation: "A meteorologia não altera as leis da física de um dado." },
                    { context: "Tempo como Espaço", text: "No problema do semáforo, o Espaço Amostral é:", options: ["O tempo total de um ciclo (60s)", "As três cores", "Os carros", "O verde"], answer: "O tempo total de um ciclo (60s)", explanation: "O denominador vira o total de segundos do experimento." },
                    { context: "Palavras", text: "Ao sortear letras de 'OVO', os casos possíveis (denominador) são:", options: ["3 (total de letras)", "2 (letras diferentes)", "1", "0"], answer: "3 (total de letras)", explanation: "Mesmo havendo repetição visual, fisicamente há 3 pedaços de papel na urna." },
                    { context: "Cotidiano Complementar", text: "Peça Perfeita vs Peça Defeituosa é um exemplo de:", options: ["Evento e seu Complementar", "Eventos Independentes", "Soma maior que 1", "Experimento exato"], answer: "Evento e seu Complementar", explanation: "Ou é um, ou é outro. Juntos formam 100% da fábrica." },
                    { context: "União", text: "Dias da semana: 'Segunda OU Terça' exige o uso da:", options: ["Regra da Soma", "Regra da Multiplicação", "Regra de Três", "Potência"], answer: "Regra da Soma", explanation: "O conectivo OU exige somar as frações." },
                    { context: "Independência Cotidiana", text: "Jogar na loteria hoje afeta o sorteio de amanhã?", options: ["Não, são independentes", "Sim, a máquina lembra", "Sim, zera as chances", "Dependentes"], answer: "Não, são independentes", explanation: "Sorteios separados no tempo não se influenciam." },
                    { context: "Soma", text: "Por que 'G' e 'T' em 'GATO' são exclusivos?", options: ["Não há uma letra que seja G e T ao mesmo tempo", "Porque são consoantes", "Porque somam 2/4", "São eventos impossíveis"], answer: "Não há uma letra que seja G e T ao mesmo tempo", explanation: "Uma retirada de papel só trará uma letra." },
                    { context: "Regra do Produto", text: "Para eventos de categorias diferentes (Clima e Dado), para ocorrer ambos usamos:", options: ["Multiplicação", "Soma", "Subtração", "Divisão"], answer: "Multiplicação", explanation: "Querer uma coisa 'E' outra pede multiplicação." },
                    { context: "Certeza", text: "A chance de um bebê nascer em um dos dias da semana é:", options: ["100% (Evento Certo)", "1/7", "50%", "0%"], answer: "100% (Evento Certo)", explanation: "O espaço amostral cobre todos os dias." },
                    { context: "Básico", text: "O princípio por trás do controle de qualidade (peças boas vs ruins) é:", options: ["Probabilidade de Eventos Complementares", "Soma de dados", "Multiplicação com reposição", "Impossibilidade"], answer: "Probabilidade de Eventos Complementares", explanation: "Total (100%) - Defeitos = Peças Boas." }
                ]
            },

            // GRUPO 6: CONTEXTO - REVISÃO GERAL INTRODUTÓRIA
            6: {
                practical: [
                    { context: "Prova Teste (4 opções).", text: "Chutar 1 questão. Chance de acertar?", options: ["1/4", "1/2", "3/4", "4/4"], answer: "1/4", explanation: "1 certa entre 4 totais." },
                    { context: "Prova Verdadeiro/Falso.", text: "Chutar 1 questão. Chance de acertar?", options: ["1/2", "1/4", "1", "0"], answer: "1/2", explanation: "Apenas 2 opções possíveis (V ou F)." },
                    { context: "Dado e Urna(2A, 2V).", text: "Dado dar Par E tirar bola Azul?", options: ["1/4", "1/2", "1/8", "1/6"], answer: "1/4", explanation: "Par(1/2) * Azul(1/2) = 1/4." },
                    { context: "Dois dados.", text: "Dado1 dar 6 OU Dado1 dar 5?", options: ["2/6", "1/6", "1/36", "12/36"], answer: "2/6", explanation: "No mesmo dado: 1/6 + 1/6 = 2/6." },
                    { context: "Prova V/F (2 questões).", text: "Acertar a 1ª E acertar a 2ª no chute?", options: ["1/4", "1/2", "1", "1/8"], answer: "1/4", explanation: "1/2 * 1/2 = 1/4." },
                    { context: "Caixa: 5 bombons Morango, 5 Coco.", text: "Tirar Morango OU Coco?", options: ["10/10 (100%)", "5/10", "1/4", "0"], answer: "10/10 (100%)", explanation: "É a caixa toda." },
                    { context: "Sorteio Mês (1 a 12).", text: "Sortear Janeiro OU Fevereiro?", options: ["2/12", "1/12", "3/12", "6/12"], answer: "2/12", explanation: "Soma: 1/12 + 1/12 = 2/12." },
                    { context: "Moeda 3 vezes.", text: "Cara E Cara E Cara?", options: ["1/8", "1/4", "1/2", "3/8"], answer: "1/8", explanation: "1/2 * 1/2 * 1/2 = 1/8." },
                    { context: "Dado.", text: "Sair número > 6?", options: ["0", "1/6", "1", "1/2"], answer: "0", explanation: "Dado vai só até 6 (Evento impossível)." },
                    { context: "Dado e Moeda.", text: "Sair Ímpar E Coroa?", options: ["1/4", "1/2", "1/8", "1/6"], answer: "1/4", explanation: "Ímpar(1/2) * Coroa(1/2) = 1/4." }
                ],
                conceptual: [
                    { context: "Revisão", text: "O que a probabilidade estuda?", options: ["Experimentos aleatórios e suas chances", "Cálculos de física exata", "Eventos certos do passado", "Geometria"], answer: "Experimentos aleatórios e suas chances", explanation: "É a matemática da incerteza." },
                    { context: "Revisão", text: "Qual regra usar quando vemos 'E' em eventos seguidos?", options: ["Multiplicação", "Soma", "Nenhuma", "Subtração"], answer: "Multiplicação", explanation: "Garante a interseção de eventos sucessivos." },
                    { context: "Revisão", text: "Qual regra usar quando vemos 'OU' em opções?", options: ["Soma", "Multiplicação", "Divisão", "Raiz"], answer: "Soma", explanation: "Acumula as chances." },
                    { context: "Revisão", text: "Se chutar numa prova V/F duas vezes, as questões são:", options: ["Independentes", "Dependentes", "Exclusivas", "Impossíveis"], answer: "Independentes", explanation: "O chute da primeira não muda a física da segunda." },
                    { context: "Revisão", text: "A palavra 'Reposição' é chave para manter a:", options: ["Independência", "Dependência", "Exclusividade", "Soma"], answer: "Independência", explanation: "Mantém o espaço amostral original." },
                    { context: "Revisão", text: "Tirar 'Azul OU Vermelho' indica eventos:", options: ["Mutuamente Exclusivos", "Dependentes", "Interseccionais", "Impossíveis"], answer: "Mutuamente Exclusivos", explanation: "Pois uma bola ou é azul ou vermelha." },
                    { context: "Revisão", text: "Por que 1/2 * 1/2 = 1/4?", options: ["Multiplica numeradores e denominadores retos", "Soma denominadores", "Cruza valores", "Corta os 2"], answer: "Multiplica numeradores e denominadores retos", explanation: "Matemática básica de frações (1*1 / 2*2)." },
                    { context: "Revisão", text: "Um evento de 100% de chance também é chamado de:", options: ["Certo", "Impossível", "Independente", "Composto"], answer: "Certo", explanation: "Ocorrerá em todas as observações." },
                    { context: "Revisão", text: "Um evento de 0% de chance é chamado de:", options: ["Impossível", "Certo", "Raro", "Dependente"], answer: "Impossível", explanation: "Não pertence ao espaço amostral." },
                    { context: "Fim do Módulo", text: "O denominador na probabilidade sempre representa:", options: ["O Espaço Amostral", "O Evento Certo", "O que eu quero", "A Interseção"], answer: "O Espaço Amostral", explanation: "A base de tudo: O total de possibilidades." }
                ]
            }
        };

        const getGroupName = (id) => {
            const names = ["Moedas e Dados", "Urnas e Bolas", "Baralhos Clássicos", "Roletas e Sorteios", "Eventos Cotidianos", "Revisão Geral"];
            return names[id - 1] || `Módulo ${id}`;
        };

        const currentQuestionList = computed(() => {
            if (!selectedGroup.value || !questionsDb[selectedGroup.value]) return [];
            return questionsDb[selectedGroup.value][currentTab.value] || [];
        });

        const currentQuestion = computed(() => currentQuestionList.value[currentQuestionIndex.value]);

        const selectGroup = (groupId) => {
            if(!questionsDb[groupId]) questionsDb[groupId] = questionsDb[1]; 
            selectedGroup.value = groupId;
            currentView.value = 'quiz';
            changeTab('practical');
            practicalScore.value = 0;
            conceptualScore.value = 0;
            indices.value = { practical: 0, conceptual: 0 };
        };

        const changeTab = (tab) => {
            if (currentTab.value !== tab) {
                currentTab.value = tab;
                resetTurn(); 
            }
        };

        const resetTurn = () => {
            userSelection.value = null;
            showAnswer.value = false;
            feedback.value = null;
            attempts.value = 0;
        };

        // Lógica de 3 Tentativas
        const answerQuestion = (option) => {
            if (showAnswer.value) return; 
            userSelection.value = option;
            
            if (option === currentQuestion.value.answer) {
                if (currentTab.value === 'practical') practicalScore.value++;
                else conceptualScore.value++;
                
                feedback.value = { type: 'correct', text: 'Parabéns, lógica validada com sucesso!' };
                showAnswer.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= 3) {
                    feedback.value = { type: 'error', text: `Tentativas esgotadas. A resposta correta é: ${currentQuestion.value.answer}` };
                    showAnswer.value = true; 
                } else {
                    feedback.value = { type: 'error', text: `Diagnóstico Incorreto. Analise os dados novamente.` };
                }
            }
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < currentQuestionList.value.length - 1) {
                indices.value[currentTab.value]++;
                resetTurn();
            } else {
                indices.value[currentTab.value]++; 
            }
        };

        // --- MAPA MENTAL LIVRE ---
        const addCustomNode = () => {
            if (!newNodeText.value.trim()) return;
            nodes.value.push({
                id: Date.now(),
                text: newNodeText.value.trim(),
                x: 100 + Math.random() * 50, 
                y: 100 + Math.random() * 50
            });
            newNodeText.value = ""; 
        };

        const deleteNode = (id) => {
            nodes.value = nodes.value.filter(n => n.id !== id);
            edges.value = edges.value.filter(e => e.from !== id && e.to !== id);
            if (edgeStartNode.value === id) edgeStartNode.value = null;
        };

        const selectNodeForEdge = (nodeId) => {
            if (edgeStartNode.value === null) {
                edgeStartNode.value = nodeId; 
            } else {
                if (edgeStartNode.value !== nodeId) {
                    const exists = edges.value.find(e => 
                        (e.from === edgeStartNode.value && e.to === nodeId) ||
                        (e.to === edgeStartNode.value && e.from === nodeId)
                    );
                    if(!exists) edges.value.push({ from: edgeStartNode.value, to: nodeId });
                }
                edgeStartNode.value = null; 
            }
        };

        const getNode = (id) => nodes.value.find(n => n.id === id) || {x:0, y:0};

        let draggingNode = null;
        let startX, startY;

        const startDragNode = (event, node) => {
            if(edgeStartNode.value !== null) return; 
            if(event.target.closest('.delete-node')) return;

            draggingNode = node;
            startX = event.clientX - node.x;
            startY = event.clientY - node.y;

            document.addEventListener('mousemove', dragNode);
            document.addEventListener('mouseup', stopDragNode);
        };

        const dragNode = (event) => {
            if (!draggingNode) return;
            draggingNode.x = event.clientX - startX;
            draggingNode.y = event.clientY - startY;
        };

        const stopDragNode = () => {
            draggingNode = null;
            document.removeEventListener('mousemove', dragNode);
            document.removeEventListener('mouseup', stopDragNode);
        };

        // --- EXPORTAÇÃO PDF ---
        const exportPDF = () => {
            const element = document.getElementById('pdf-export-area');
            const header = element.querySelector('.pdf-only-header');
            
            let maxX = 800; 
            let maxY = 600; 
            nodes.value.forEach(n => {
                if (n.x + 200 > maxX) maxX = n.x + 200;
                if (n.y + 100 > maxY) maxY = n.y + 100;
            });

            const originalHeight = element.style.height;
            const originalOverflow = element.style.overflow;
            
            element.style.height = `${maxY + 50}px`;
            element.style.width = `${maxX + 50}px`;
            element.style.overflow = 'visible'; 
            element.style.background = '#ffffff';

            if(header) {
                header.style.display = 'block';
                header.style.marginBottom = '30px';
                header.style.color = 'black'; 
            }
            
            const allNodes = element.querySelectorAll('.mindmap-node');
            const allDeleteBtns = element.querySelectorAll('.delete-node');
            const svgElement = document.getElementById('mindmap-svg');

            if(svgElement) {
                svgElement.style.width = `${maxX + 50}px`;
                svgElement.style.height = `${maxY + 50}px`;
            }
            
            allNodes.forEach(n => {
                n.style.background = '#f0f0f0';
                n.style.color = '#000';
            });
            allDeleteBtns.forEach(btn => btn.style.display = 'none');

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_Probabilidade_G${selectedGroup.value}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true,
                    scrollY: 0,
                    width: maxX + 50, 
                    height: maxY + 50 
                },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                if(header) header.style.display = 'none';
                element.style.background = '';
                element.style.height = originalHeight;
                element.style.width = '100%'; 
                element.style.overflow = originalOverflow;
                
                if(svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                }

                allNodes.forEach(n => {
                    n.style.background = '';
                    n.style.color = '';
                });
                allDeleteBtns.forEach(btn => btn.style.display = 'flex');
            });
        };

        return {
            currentView, selectedGroup, currentTab, getGroupName,
            practicalScore, conceptualScore, currentQuestionIndex,
            currentQuestion, userSelection, showAnswer, feedback, attempts,
            selectGroup, changeTab, answerQuestion, nextQuestion,
            
            newNodeText, nodes, edges, edgeStartNode,
            addCustomNode, deleteNode, startDragNode, selectNodeForEdge, getNode,
            exportPDF
        };
    }
}).mount('#app');