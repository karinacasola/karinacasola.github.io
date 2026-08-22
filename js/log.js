const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
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

        // --- Banco de Questões (35 Questões - Algoritmos e Lógica) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Definição e universalidade da lógica.",
                scenario: "Um colega afirma que precisa decidir entre aprender Python ou Java antes mesmo de entender como estruturar algoritmos.",
                text: "Com base no material, como você explica a relação entre lógica e linguagens de programação?",
                options: [
                    "A lógica é estritamente atrelada ao hardware e varia para cada linguagem.",
                    "A lógica de programação é universal e independe da linguagem escolhida.",
                    "É necessário dominar o vocabulário do Java antes de entender os algoritmos.",
                    "Algoritmos lógicos só podem ser escritos em linguagem de máquina."
                ],
                answer: "A lógica de programação é universal e independe da linguagem escolhida." //
            },
            {
                id: 2,
                instruction: "O Ciclo de Processamento e Matemática.",
                scenario: "Ao explicar o ciclo básico de processamento (Entrada, Processamento e Saída), você utiliza o conceito de uma função matemática.",
                text: "Na analogia f(x) = y apresentada, o que o componente 'x' representa no ciclo de dados?",
                options: [
                    "Corresponde ao nosso Processamento.",
                    "Corresponde à nossa Saída (resultado).",
                    "Corresponde à nossa Entrada (dados).",
                    "Corresponde à Linguagem de Máquina (binário)."
                ],
                answer: "Corresponde à nossa Entrada (dados)." //
            },
            {
                id: 3,
                instruction: "Estruturas de Controle - Laços.",
                scenario: "Você precisa criar um algoritmo para lavar a louça, mas não sabe previamente quantos pratos estão na pia.",
                text: "Qual estrutura de controle de repetição é a correta para executar a ação repetidamente 'enquanto uma condição não for alcançada'?",
                options: [
                    "PARA (For).",
                    "SE / ENTÃO (If / Else).",
                    "Condicional de Processamento.",
                    "ENQUANTO (While)."
                ],
                answer: "ENQUANTO (While)." //
            },
            {
                id: 4,
                instruction: "Símbolos de Fluxograma - Entrada.",
                scenario: "Você está mapeando a lógica inicial de um software utilizando um fluxograma e precisa solicitar que o usuário digite a própria idade.",
                text: "Qual símbolo geométrico padronizado deve ser usado para representar essa Entrada de dados?",
                options: [
                    "Paralelogramo.",
                    "Losango.",
                    "Pílula.",
                    "Retângulo."
                ],
                answer: "Paralelogramo." //
            },
            {
                id: 5,
                instruction: "Símbolos de Fluxograma - Decisão.",
                scenario: "O seu algoritmo precisa criar uma ramificação: se a nota for maior ou igual a 7, o aluno está aprovado; caso contrário, reprovado.",
                text: "Qual forma geométrica representa essa pergunta de Sim/Não no fluxograma?",
                options: [
                    "Retângulo.",
                    "Losango.",
                    "Paralelogramo.",
                    "Pílula."
                ],
                answer: "Losango." //
            },
            {
                id: 6,
                instruction: "Ferramenta Flowgorithm.",
                scenario: "Durante o teste do seu algoritmo desenhado no Flowgorithm, você deseja acompanhar exatamente como os valores estão mudando passo a passo na memória.",
                text: "Qual funcionalidade do Flowgorithm permite realizar esse acompanhamento?",
                options: [
                    "Janela de Console.",
                    "Visualizador de Código-Fonte.",
                    "Janela de Variáveis (Watch Window).",
                    "Tradutor de Múltiplos Idiomas."
                ],
                answer: "Janela de Variáveis (Watch Window)." //
            },
            {
                id: 7,
                instruction: "Classificação de Tipos de Dados.",
                scenario: "Um sistema financeiro precisa armazenar a cotação do dólar (ex: 5.15) e o ano da transação (ex: 2026).",
                text: "Quais são os tipos de dados adequados para essas duas variáveis, respectivamente?",
                options: [
                    "Inteiro e Caractere (String).",
                    "Lógico (Booleano) e Real.",
                    "String e Inteiro.",
                    "Real (Float) e Inteiro."
                ],
                answer: "Real (Float) e Inteiro." //
            },
            {
                id: 8,
                instruction: "Linguagens Tipadas vs Dinâmicas.",
                scenario: "Em linguagens como Java e C#, a variável atua como uma caixa com molde rígido, que não aceita um texto se foi declarada para número.",
                text: "Como são classificadas essas linguagens no que se refere ao nível de exigência da variável?",
                options: [
                    "Linguagens Tipadas (Tipagem Forte/Estática).",
                    "Linguagens Não Tipadas (Tipagem Dinâmica).",
                    "Linguagens de Hardware.",
                    "Linguagens de Máquina Pura."
                ],
                answer: "Linguagens Tipadas (Tipagem Forte/Estática)." //
            },
            {
                id: 9,
                instruction: "Elementos de uma Variável.",
                scenario: "Para processar dados, o computador cria uma 'caixa organizadora' (variável) na memória, que recebe um Nome (Etiqueta) para ser achada depois.",
                text: "Quais são os outros dois elementos fundamentais que compõem essa variável?",
                options: [
                    "Entrada e Saída.",
                    "Conteúdo (Valor) e Tipo.",
                    "Processamento e Laço de Repetição.",
                    "Decisão e Condicional."
                ],
                answer: "Conteúdo (Valor) e Tipo." //
            },
            {
                id: 10,
                instruction: "O Poder da Abstração.",
                scenario: "Antes de programar as linhas de código, sua equipe decide criar um fluxograma do projeto para apresentar aos gestores que não sabem programar.",
                text: "Por que recursos como Fluxogramas e Pseudocódigos são úteis nesse contexto?",
                options: [
                    "Eles traduzem automaticamente o raciocínio da equipe para linguagem de máquina pura.",
                    "Eles processam dados gigabytes mais rápido que a capacidade humana.",
                    "Eles facilitam a comunicação, permitindo que outros entendam o funcionamento do sistema sem ler o código fonte.",
                    "Eles são a única forma de compilar e executar o software no servidor."
                ],
                answer: "Eles facilitam a comunicação, permitindo que outros entendam o funcionamento do sistema sem ler o código fonte." //
            },
            {
                id: 11,
                instruction: "Tipos de Dados - Booleano.",
                scenario: "Um sensor de catraca envia informações ao sistema indicando apenas se a passagem está liberada ou bloqueada.",
                text: "Qual é o tipo de dado primitivo que admite apenas dois estados absolutos (Verdadeiro/Falso)?",
                options: [
                    "Inteiro (Integer).",
                    "Real (Float / Decimal).",
                    "Caractere (String).",
                    "Lógico (Booleano)."
                ],
                answer: "Lógico (Booleano)." //
            },
            {
                id: 12,
                instruction: "Laços de Repetição Específicos.",
                scenario: "Você precisa acionar um alarme exatamente 5 vezes consecutivas.",
                text: "Qual estrutura de repetição deve ser escolhida para executar um código um número exato e predeterminado de vezes?",
                options: [
                    "PARA (For).",
                    "ENQUANTO (While).",
                    "SE (If).",
                    "SENÃO (Else)."
                ],
                answer: "PARA (For)." //
            },
            {
                id: 13,
                instruction: "O Papel da Linguagem de Programação.",
                scenario: "O computador entende apenas binário (0s e 1s), enquanto os programadores pensam usando linguagem natural e lógica.",
                text: "Qual é a função da Linguagem de Programação nesse processo?",
                options: [
                    "Gerar os símbolos geométricos do fluxograma para a placa-mãe.",
                    "Agir como uma ponte ou tradutor entre o raciocínio humano e os comandos do hardware.",
                    "Excluir a necessidade de utilizar variáveis na memória RAM.",
                    "Converter automaticamente qualquer pseudocódigo em componentes de hardware."
                ],
                answer: "Agir como uma ponte ou tradutor entre o raciocínio humano e os comandos do hardware." //
            },
            {
                id: 14,
                instruction: "Flowgorithm - Executável Portable.",
                scenario: "Ao estudar no laboratório da faculdade, você opta por baixar a versão executável (Portable) do Flowgorithm.",
                text: "Quais as vantagens de utilizar essa versão específica em computadores compartilhados?",
                options: [
                    "Possui gráficos tridimensionais avançados que não rodam em navegadores.",
                    "Garante que o código será obrigatoriamente exportado apenas para C++.",
                    "Não requer instalação demorada e não precisa de permissões de Administrador.",
                    "Aumenta a complexidade sintática para acelerar o aprendizado da linguagem de máquina."
                ],
                answer: "Não requer instalação demorada e não precisa de permissões de Administrador." //
            },
            {
                id: 15,
                instruction: "Símbolos de Fluxograma - Processamento.",
                scenario: "Após receber o valor do salário base e do bônus, o algoritmo precisa somá-los para definir o salário final.",
                text: "Qual figura geométrica é utilizada para indicar cálculos, fórmulas e atribuições de variáveis?",
                options: [
                    "Losango.",
                    "Paralelogramo.",
                    "Pílula.",
                    "Retângulo."
                ],
                answer: "Retângulo." //
            },
            {
                id: 16,
                instruction: "Regras das Linguagens de Programação.",
                scenario: "Um novato tentou escrever um código inventando comandos em português e o compilador acusou erro.",
                text: "Sobre a natureza da sintaxe nas linguagens de programação, o que as define segundo o material?",
                options: [
                    "Possuem vocabulário próprio (palavras reservadas) e uma sintaxe rígida (regras gramaticais).",
                    "São interpretadas livremente pela inteligência artificial da CPU.",
                    "Aceitam comandos em linguagem natural desde que formatados como variáveis.",
                    "Adaptam-se aos erros do programador durante o ciclo de processamento."
                ],
                answer: "Possuem vocabulário próprio (palavras reservadas) e uma sintaxe rígida (regras gramaticais)." //
            },
            {
                id: 17,
                instruction: "Linguagens de Tipagem Dinâmica.",
                scenario: "No JavaScript, você declarou uma variável guardando um texto hoje, mas amanhã pode guardar um número nela sem gerar erro.",
                text: "Como as linguagens de programação dinâmicas tratam as variáveis?",
                options: [
                    "Exigem que o tipo seja declarado antes, mas ignoram falhas no runtime.",
                    "Descobrem o tipo automaticamente e se adaptam ao conteúdo que é colocado dentro.",
                    "Bloqueiam a variável, impedindo que ela mude de valor durante o software.",
                    "Convertem todo dado inserido para o formato Real (Float)."
                ],
                answer: "Descobrem o tipo automaticamente e se adaptam ao conteúdo que é colocado dentro." //
            },
            {
                id: 18,
                instruction: "Formatação de Strings.",
                scenario: "Você precisa guardar a placa de um carro ('ABC-1234') em uma variável na memória.",
                text: "Qual a exigência formal da lógica para guardar esse dado do tipo Caractere/Cadeia?",
                options: [
                    "O conteúdo não pode conter números misturados com letras.",
                    "A variável precisa ser do tipo Booleano para validar os traços.",
                    "O conteúdo deve sempre usar aspas.",
                    "A etiqueta da variável deve ser escrita em maiúsculo."
                ],
                answer: "O conteúdo deve sempre usar aspas." //
            },
            {
                id: 19,
                instruction: "Flowgorithm - Console.",
                scenario: "Seu professor pediu para você testar a entrada de dados do seu fluxograma diretamente no Flowgorithm.",
                text: "No ambiente dessa ferramenta, o que a funcionalidade 'Janela de Console' permite fazer?",
                options: [
                    "Traduzir o código-fonte desenhado para a linguagem PHP.",
                    "Exportar o diagrama para um documento PDF interativo.",
                    "Inspecionar a carga na memória RAM utilizada pelo software.",
                    "Simular uma tela onde é possível digitar dados e ver as mensagens de saída do programa."
                ],
                answer: "Simular uma tela onde é possível digitar dados e ver as mensagens de saída do programa." //
            },
            {
                id: 20,
                instruction: "Propósito do Flowgorithm.",
                scenario: "Um aluno questionou por que não começar programando direto em Java no primeiro dia de aula.",
                text: "Por que usar o Flowgorithm é recomendado para quem está começando a aprender lógica?",
                options: [
                    "Permite focar em pensar como programador sem a frustração de esquecer um ponto-e-vírgula.",
                    "É a única ferramenta no mercado capaz de compilar sistemas para Windows.",
                    "Possui inteligência artificial que resolve o problema automaticamente.",
                    "Substitui a necessidade de planejar um fluxograma antes de codificar."
                ],
                answer: "Permite focar em pensar como programador sem a frustração de esquecer um ponto-e-vírgula." //
            },
            {
                id: 21,
                instruction: "Estrutura do Pseudocódigo.",
                scenario: "No seu pseudocódigo, você escreveu a instrução: 'LEIA (nota)'.",
                text: "Esse comando corresponde a qual etapa essencial do Ciclo de Processamento de Dados?",
                options: [
                    "Processamento da Função f(x).",
                    "Entrada (Input).",
                    "Saída (Output).",
                    "Ramificação Condicional."
                ],
                answer: "Entrada (Input)." //
            },
            {
                id: 22,
                instruction: "Identificação de Erros Visuais.",
                scenario: "Ao tentar rodar um algoritmo no Flowgorithm, o sistema acusa um loop infinito e falha.",
                text: "O que o recurso de 'Feedback Imediato' da ferramenta proporciona nessa situação?",
                options: [
                    "Ele reescreve a regra matemática para corrigir a falha silenciosamente.",
                    "Ele deleta o bloco defeituoso e executa a ramificação mais próxima.",
                    "Você vê visualmente em qual bloco o programa parou devido ao erro de lógica.",
                    "Ele emite um som de alerta do hardware."
                ],
                answer: "Você vê visualmente em qual bloco o programa parou devido ao erro de lógica." //
            },
            {
                id: 23,
                instruction: "Processamento Matemático.",
                scenario: "A programação é muitas vezes comparada a uma grande função matemática 'f(x) = y'.",
                text: "Nessa abstração, o que a variável 'y' representa no sistema de processamento?",
                options: [
                    "Corresponde ao nosso Processamento lógico f().",
                    "Corresponde à nossa Entrada de dados.",
                    "Corresponde ao hardware executando em segundo plano.",
                    "Corresponde à nossa Saída (resultado / informação)."
                ],
                answer: "Corresponde à nossa Saída (resultado / informação)." //
            },
            {
                id: 24,
                instruction: "Limites do Algoritmo.",
                scenario: "Todo algoritmo precisa ser uma sequência finita, ou seja, precisa ter um momento em que encerra suas instruções.",
                text: "Quando desenhado em fluxograma, qual forma geométrica marca onde o programa começa e onde ele termina?",
                options: [
                    "Formato de pílula.",
                    "Retângulo.",
                    "Paralelogramo.",
                    "Losango."
                ],
                answer: "Formato de pílula." //
            },
            {
                id: 25,
                instruction: "Processamento Massivo.",
                scenario: "Você apresenta as vantagens mercadológicas da programação para uma equipe de vendas corporativa.",
                text: "Dentre as utilidades práticas, qual é a definição para o 'Processamento massivo' abordada na aula?",
                options: [
                    "Executar tarefas repetitivas milhares de vezes sem cansaço.",
                    "Lidar com gigabytes de dados muito além da capacidade humana.",
                    "Traduzir linguagens faladas em tempo real com precisão.",
                    "Criar abstrações visuais dinâmicas."
                ],
                answer: "Lidar com gigabytes de dados muito além da capacidade humana." //
            },
            {
                id: 26,
                instruction: "Estruturas Condicionais Básicas.",
                scenario: "Um código precisa determinar: SE chover, ENTÃO levo o guarda-chuva, SENÃO levo óculos de sol.",
                text: "Sobre a execução estrutural de um algoritmo, qual é o papel exato da estrutura SE / SENÃO?",
                options: [
                    "Permite que a instrução se repita infinitamente até a chuva parar.",
                    "Força a linguagem tipada a alterar a variável de tempo dinamicamente.",
                    "Permite que o algoritmo escolha um caminho baseado em uma condição (Verdadeiro ou Falso).",
                    "Converte as respostas naturais em código binário de hardware."
                ],
                answer: "Permite que o algoritmo escolha um caminho baseado em uma condição (Verdadeiro ou Falso)." //
            },
            {
                id: 27,
                instruction: "Atribuição em Tipos Primitivos.",
                scenario: "Um estudante precisa declarar uma variável para a quantidade de itens em estoque, e no sistema, o estoque pode ficar negativo (-5).",
                text: "Qual é o tipo de dado primitivo mais adequado para guardar essa informação?",
                options: [
                    "Real (Float), pois o número negativo exige processamento decimal.",
                    "Booleano, pois determina a existência ou não de um produto.",
                    "String, pois o sinal de menos é um caractere textual.",
                    "Inteiro (Integer), pois engloba números exatos, positivos ou negativos."
                ],
                answer: "Inteiro (Integer), pois engloba números exatos, positivos ou negativos." //
            },
            {
                id: 28,
                instruction: "O Idioma da Máquina.",
                scenario: "Antes do seu algoritmo escrito em Python funcionar de fato, o computador precisa processá-lo.",
                text: "Em seu nível de hardware, o que os computadores conseguem compreender nativamente?",
                options: [
                    "Só entendem linguagem de máquina (0s e 1s, binário).",
                    "Entendem a sintaxe estruturada e reservada de linguagens como C++ e Java.",
                    "Compreendem comandos estruturados em pseudocódigo traduzido.",
                    "Entendem pacotes matemáticos representados por funções visuais."
                ],
                answer: "Só entendem linguagem de máquina (0s e 1s, binário)." //
            },
            {
                id: 29,
                instruction: "A Natureza dos Laços FOR.",
                scenario: "No seu pseudocódigo de cálculo de notas, você utilizou a estrutura 'PARA i DE 1 ATE 4 FACA'.",
                text: "O que caracteriza especificamente o uso de uma estrutura de repetição PARA (For)?",
                options: [
                    "Executa o código repetidamente enquanto uma condição aleatória não for alcançada.",
                    "Executa o código um número exato e predeterminado de vezes.",
                    "Realiza um teste lógico final antes de liberar a variável.",
                    "Cria uma ramificação onde o programa pula imediatamente para a linha 4."
                ],
                answer: "Executa o código um número exato e predeterminado de vezes." //
            },
            {
                id: 30,
                instruction: "Tradução de Fluxogramas.",
                scenario: "Sua equipe construiu a lógica inteira conectando formas geométricas e testando as saídas no sistema de console.",
                text: "Além de focar no visual, o que o Flowgorithm faz com o fluxograma que você desenhou para ajudar no desenvolvimento real?",
                options: [
                    "Gera um documento de texto não editável para análise de requisitos.",
                    "Oculta os símbolos visuais e força o aluno a reescrever tudo usando teclado mecânico.",
                    "O traduz automaticamente para dezenas de linguagens reais (Python, Java, C#, etc).",
                    "Otimiza as linhas gráficas para poupar espaço no HD portátil."
                ],
                answer: "O traduz automaticamente para dezenas de linguagens reais (Python, Java, C#, etc)." //
            },
            {
                id: 31,
                instruction: "Estruturação Visual de Processamento Múltiplo.",
                scenario: "Problema: O sistema de um banco precisa ler o saldo atual e o valor de um saque. Em seguida, deve subtrair o saque do saldo e guardar o novo valor.",
                text: "Como essa sequência lógica deve ser desenhada no fluxograma considerando os símbolos geométricos adequados?",
                options: [
                    "Retângulo (Ler saldo e saque) seguido de um Losango (Novo Saldo = Saldo - Saque).",
                    "Losango (Ler saldo) apontando diretamente para um Retângulo de Saída.",
                    "Paralelogramo de Entrada seguido de um Paralelogramo de Cálculo Matemático.",
                    "Paralelogramo (Ler saldo e saque) seguido de um Retângulo (Novo Saldo = Saldo - Saque)."
                ],
                answer: "Paralelogramo (Ler saldo e saque) seguido de um Retângulo (Novo Saldo = Saldo - Saque)." //
            },
            {
                id: 32,
                instruction: "Desenhando Ramificações Condicionais.",
                scenario: "Problema: Um e-commerce precisa verificar se o cliente tem um cupom de desconto. Se tiver, aplica 10% off; se não tiver, mantém o preço normal.",
                text: "Qual é a representação gráfica correta dessa etapa de tomada de decisão no fluxograma?",
                options: [
                    "Um losango (Tem cupom?), ramificando em duas setas (Sim/Não) para caminhos diferentes.",
                    "Um retângulo com a fórmula de desconto, ramificando para dois paralelogramos.",
                    "Um símbolo de Pílula (Início) conectando direto a um paralelogramo de saída parcial.",
                    "Um paralelogramo verificando o cupom seguido de um losango aplicando o desconto matematicamente."
                ],
                answer: "Um losango (Tem cupom?), ramificando em duas setas (Sim/Não) para caminhos diferentes." //
            },
            {
                id: 33,
                instruction: "Representação de Loop de Repetição.",
                scenario: "Problema: O programa de uma catraca eletrônica precisa continuar verificando o sensor repetidamente ENQUANTO o ambiente estiver sem movimento.",
                text: "Como um ciclo de repetição contínuo baseado em condição é representado visualmente no fluxograma?",
                options: [
                    "Múltiplos retângulos desenhados um abaixo do outro infinitamente no painel de controle.",
                    "Um losango de condição onde a seta de um dos caminhos (ex: Sim) retorna para antes da própria pergunta, criando um ciclo.",
                    "Um paralelogramo de entrada de dados que se conecta isoladamente a um símbolo de Início.",
                    "Uma Pílula de Fim com uma seta reta apontando novamente para o meio de uma ramificação."
                ],
                answer: "Um losango de condição onde a seta de um dos caminhos (ex: Sim) retorna para antes da própria pergunta, criando um ciclo." //
            },
            {
                id: 34,
                instruction: "O Primeiro Passo de um Algoritmo.",
                scenario: "Problema: O algoritmo precisa exibir na tela do usuário a mensagem 'Bem-vindo ao Sistema' logo após ser iniciado.",
                text: "Qual é a sequência correta dos dois primeiros blocos desse fluxograma?",
                options: [
                    "Retângulo (Início) conectando para um Losango (Saída: 'Bem-vindo ao Sistema').",
                    "Paralelogramo (Início) conectando para uma Pílula (Saída: 'Bem-vindo ao Sistema').",
                    "Formato de Pílula (Início) conectando para um Paralelogramo (Saída: 'Bem-vindo ao Sistema').",
                    "Losango (Início) conectando para um Retângulo (Saída: 'Bem-vindo ao Sistema')."
                ],
                answer: "Formato de Pílula (Início) conectando para um Paralelogramo (Saída: 'Bem-vindo ao Sistema')." //
            },
            {
                id: 35,
                instruction: "Fluxograma Completo: Entrada, Processamento e Decisão.",
                scenario: "Problema: O sistema pergunta 'Qual sua temperatura?'. O usuário digita 39. O algoritmo guarda isso e decide: se for >= 38, exibe 'Febre', senão exibe 'Normal'.",
                text: "Qual a sequência lógica de componentes recomendada para construir esse fluxograma?",
                options: [
                    "Retângulo (Pergunta) -> Retângulo (Ler) -> Retângulo (Decidir) -> Retângulo (Mostrar tela).",
                    "Losango de Entrada (Pergunta) -> Losango de Processamento -> Paralelogramo de Condição -> Pílulas de Saída finais.",
                    "Paralelogramo (Atribuição Temp = 39) -> Losango (Mostrar Resultado em Tela) -> Retângulo (Fim do processo).",
                    "Paralelogramo de Saída (Exibir Pergunta) -> Paralelogramo de Entrada (Ler Temperatura) -> Losango (Temp >= 38?) -> Paralelogramos de Saída (Exibir Status)."
                ],
                answer: "Paralelogramo de Saída (Exibir Pergunta) -> Paralelogramo de Entrada (Ler Temperatura) -> Losango (Temp >= 38?) -> Paralelogramos de Saída (Exibir Status)." //
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal ---
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
            await typeWriter(`Carregando Desafio de Algoritmo ${currentQuestion.value.id}...`, "log-info");
            await typeWriter(currentQuestion.value.scenario, "log-default");
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
                addLog("Avaliação concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Lógica validada com sucesso.";
                addLog("Sucesso: Estruturação lógica precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Compilação interrompida.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Falha na validação. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos fundamentos e estruturas de algoritmos.";
            if (score.value < 24) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos teóricos e construção de fluxogramas.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Fundamentos de Algoritmos</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação Avançada em Lógica de Programação</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo abstração com fluxogramas, tipos de dados primitivos, estruturas de controle e aplicação de problemas práticos.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 17 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador ALGO_EVAL_v1.5
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Algoritmos_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador lógico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador ALGO_EVAL_v1.5...", "log-info");
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