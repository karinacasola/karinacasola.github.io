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
        
        const maxAttempts = 2; // Reduzido para 2 por conta do volume de questões (opcional)

        // --- Banco de Questões (50 Questões baseadas no PDF) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Fundamentos das Metodologias.",
                scenario: "A equipe de engenharia está debatendo sobre adotar Scrum ou Cascata para todos os projetos da empresa.",
                text: "Existe um modelo de desenvolvimento perfeito?",
                options: [
                    "Sim, o Scrum é o padrão ouro atual.",
                    "Sim, modelos Ágeis superam Preditivos sempre.",
                    "Não existe! O melhor depende do cenário (escopo, risco e prazo).",
                    "Não, mas o Processo Unificado serve para qualquer escopo."
                ],
                answer: "Não existe! O melhor depende do cenário (escopo, risco e prazo)."
            },
            {
                id: 2,
                instruction: "Seleção de Metodologia: Cenário Crítico.",
                scenario: "Projeto: Desenvolvimento de um software para o controle de uma sonda espacial, onde falhas podem custar bilhões e vidas.",
                text: "Qual é a abordagem ideal para este cenário?",
                options: [
                    "Ágil, para adaptação rápida no espaço.",
                    "Preditivo, pois o risco de errar é fatal e os requisitos são rígidos.",
                    "Adaptativo, criando protótipos na lua.",
                    "Extreme Programming, para focar na engenharia e pair programming."
                ],
                answer: "Preditivo, pois o risco de errar é fatal e os requisitos são rígidos."
            },
            {
                id: 3,
                instruction: "Seleção de Metodologia: Inovação e Mercado.",
                scenario: "Projeto: Um novo aplicativo de caronas (estilo Uber) em um mercado altamente competitivo.",
                text: "Se o maior risco é perder mercado, qual metodologia escolher?",
                options: [
                    "Preditivo.",
                    "Modelo Espiral.",
                    "Ágil, para entregas rápidas e adaptação a mudanças constantes.",
                    "Processo Unificado Clássico."
                ],
                answer: "Ágil, para entregas rápidas e adaptação a mudanças constantes."
            },
            {
                id: 4,
                instruction: "Seleção de Metodologia: Incerteza do Cliente.",
                scenario: "Projeto: O cliente quer digitalizar sua loja, mas não sabe bem o que quer ou como o sistema deve funcionar.",
                text: "Qual o cenário ideal para modelos Adaptativos?",
                options: [
                    "Requisitos muito claros e rígidos.",
                    "Mudança constante e entrega rápida.",
                    "O cliente não sabe bem o que quer.",
                    "Quando o planejamento extensivo já foi finalizado."
                ],
                answer: "O cliente não sabe bem o que quer."
            },
            {
                id: 5,
                instruction: "Características dos Modelos Preditivos.",
                scenario: "Você está explicando a gestão tradicional de projetos para um novo estagiário.",
                text: "Qual o foco e o momento ideal para usar Modelos Preditivos (Cascata/V/PU)?",
                options: [
                    "Gestão auto-gerenciável; ideal para inovação.",
                    "Gestão centralizada; requisitos claros e baixo risco de mudança.",
                    "Feedback constante em segundos; ideal para mercado volátil.",
                    "Foco em protótipos descartáveis."
                ],
                answer: "Gestão centralizada; requisitos claros e baixo risco de mudança."
            },
            {
                id: 6,
                instruction: "Modelos Ágeis.",
                scenario: "A diretoria quer entender como a equipe Ágil será gerenciada sem um cronograma de Gantt rígido.",
                text: "Quais são as características da gestão e cenários dos modelos Ágeis?",
                options: [
                    "Centralizada via PMBOK; requisitos estáveis.",
                    "Auto-gerenciável (Kanban/Sprints); inovação e requisitos instáveis.",
                    "Sequencial pura; baixo risco.",
                    "Baseada na criação de modelos mentais."
                ],
                answer: "Auto-gerenciável (Kanban/Sprints); inovação e requisitos instáveis."
            },
            {
                id: 7,
                instruction: "Conceito Preditivo.",
                scenario: "Sua equipe foi contratada para construir o software de uma ponte elevadiça. A planta final já está assinada.",
                text: "Qual é o foco principal dos Modelos Preditivos?",
                options: [
                    "Planejamento feito de forma extensiva no início.",
                    "Entregas constantes a cada semana.",
                    "Aceitar que os requisitos podem mudar na fase de construção.",
                    "Focar em indivíduos e interações."
                ],
                answer: "Planejamento feito de forma extensiva no início."
            },
            {
                id: 8,
                instruction: "Variações do Cascata.",
                scenario: "A equipe terminou os Requisitos, fez o Design e agora está no Código.",
                text: "Como funciona o Cascata Tradicional (Puro)?",
                options: [
                    "Sequencial puro. Um passo de cada vez. Só desce.",
                    "Permite revisões pontuais com setas de retorno.",
                    "Ganha tempo iniciando o design antes do fim dos requisitos.",
                    "Software é entregue em partes financeiras e de login."
                ],
                answer: "Sequencial puro. Um passo de cada vez. Só desce."
            },
            {
                id: 9,
                instruction: "Variações do Cascata.",
                scenario: "Durante a codificação, o time percebeu um erro na arquitetura definida meses atrás.",
                text: "Qual variação do Cascata permite uma 'seta de retorno' para corrigir o design?",
                options: [
                    "Cascata Incremental.",
                    "Fases Sobrepostas.",
                    "Cascata com Feedback.",
                    "Cascata Puro."
                ],
                answer: "Cascata com Feedback."
            },
            {
                id: 10,
                instruction: "Variações do Cascata.",
                scenario: "O prazo está apertado. O gerente decide começar o design do módulo B enquanto os requisitos do módulo C estão sendo finalizados.",
                text: "Qual é o nome desta abordagem?",
                options: [
                    "Cascata com Feedback.",
                    "Fases Sobrepostas.",
                    "Incremental.",
                    "Modelo Espiral."
                ],
                answer: "Fases Sobrepostas."
            },
            {
                id: 11,
                instruction: "Variações do Cascata.",
                scenario: "O cliente quer usar o módulo de 'Login' antes que o módulo 'Financeiro' esteja pronto.",
                text: "Qual variação entrega o sistema em 'pedaços'?",
                options: [
                    "Cascata com Feedback.",
                    "Fases Sobrepostas.",
                    "Incremental.",
                    "Processo Unificado."
                ],
                answer: "Incremental."
            },
            {
                id: 12,
                instruction: "O Modelo V.",
                scenario: "Em uma auditoria de qualidade, o auditor verifica se a equipe testou cada planejamento feito à esquerda do fluxo.",
                text: "Qual é o conceito principal do Modelo V?",
                options: [
                    "Para cada fase de desenvolvimento existe uma fase de teste correspondente.",
                    "Ele avalia o Risco a cada volta da iteração.",
                    "Foca na arquitetura dividida em 4 fases.",
                    "Utiliza Sprints de 1 a 4 semanas."
                ],
                answer: "Para cada fase de desenvolvimento existe uma fase de teste correspondente."
            },
            {
                id: 13,
                instruction: "Correspondência no Modelo V.",
                scenario: "A equipe acaba de terminar a fase de 'Codificação' (no fundo do 'V').",
                text: "Qual é o primeiro teste executado ao subir pelo lado direito do Modelo V?",
                options: [
                    "Teste de Aceitação.",
                    "Teste de Integração.",
                    "Teste Unitário.",
                    "Teste de Requisitos."
                ],
                answer: "Teste Unitário."
            },
            {
                id: 14,
                instruction: "Correspondência no Modelo V.",
                scenario: "O cliente quer validar se o software atende ao negócio planejado originalmente.",
                text: "A fase de 'Requisitos' (início) espelha com qual fase de testes (final)?",
                options: [
                    "Teste Unitário.",
                    "Teste de Aceitação.",
                    "Teste de Integração.",
                    "Garantia de Design."
                ],
                answer: "Teste de Aceitação."
            },
            {
                id: 15,
                instruction: "Processo Unificado (PU).",
                scenario: "A equipe está mapeando casos de uso para garantir a base do sistema.",
                text: "Qual é o foco principal do Processo Unificado?",
                options: [
                    "Centrado na arquitetura, mitigação de riscos e guiado por casos de uso.",
                    "Centrado em testes unitários rígidos.",
                    "Focado em protótipos rápidos e descartáveis.",
                    "Totalmente focado em indivíduos sobre processos."
                ],
                answer: "Centrado na arquitetura, mitigação de riscos e guiado por casos de uso."
            },
            {
                id: 16,
                instruction: "Fases do Processo Unificado.",
                scenario: "O projeto acabou de começar. Estuda-se a viabilidade do que será feito.",
                text: "Como se chama a Fase 1 do PU?",
                options: [
                    "Construção.",
                    "Transição.",
                    "Elaboração.",
                    "Concepção."
                ],
                answer: "Concepção."
            },
            {
                id: 17,
                instruction: "Fases do Processo Unificado.",
                scenario: "A viabilidade foi aprovada. Agora a equipe define COMO vai fazer, focando na arquitetura e riscos.",
                text: "Qual é a Fase 2 do PU?",
                options: [
                    "Construção.",
                    "Elaboração.",
                    "Transição.",
                    "Modelagem Ágil."
                ],
                answer: "Elaboração."
            },
            {
                id: 18,
                instruction: "Fases do Processo Unificado.",
                scenario: "Chegou a hora de colocar a mão na massa e desenvolver o código.",
                text: "Como se chama a Fase 3 do PU?",
                options: [
                    "Elaboração.",
                    "Construção.",
                    "Transição.",
                    "Engenharia."
                ],
                answer: "Construção."
            },
            {
                id: 19,
                instruction: "Marcos do Processo Unificado.",
                scenario: "O gerente de projetos afirma que a arquitetura finalmente está sólida e aprovada.",
                text: "Qual é o grande Marco alcançado no fim da fase de Elaboração do PU?",
                options: [
                    "Incremento Pronto.",
                    "Arquitetura Estável.",
                    "Teste de Aceitação Concluído.",
                    "Risco Zero."
                ],
                answer: "Arquitetura Estável."
            },
            {
                id: 20,
                instruction: "Modelos Adaptativos.",
                scenario: "O cliente mudou de ideia sobre a cor e função de um botão pela terceira vez.",
                text: "Qual é o conceito central dos Modelos Adaptativos?",
                options: [
                    "Não aceitam mudanças após o design.",
                    "Mudança é bem-vinda; o foco é aprender com o processo.",
                    "Gestão centralizada rígida.",
                    "Entregam o software todo de uma vez no final."
                ],
                answer: "Mudança é bem-vinda; o foco é aprender com o processo."
            },
            {
                id: 21,
                instruction: "Prototipação.",
                scenario: "O arquiteto cria telas no Figma para mostrar ao cliente antes de programar o sistema imobiliário.",
                text: "Esta prática é um exemplo de qual modelo/técnica adaptativa?",
                options: [
                    "Modelo V.",
                    "Extreme Programming.",
                    "Prototipação (versão simplificada para validação).",
                    "Processo Unificado Clássico."
                ],
                answer: "Prototipação (versão simplificada para validação)."
            },
            {
                id: 22,
                instruction: "Modelo Espiral.",
                scenario: "A equipe avalia os perigos do projeto a cada novo ciclo de desenvolvimento.",
                text: "Qual é o foco principal do Modelo Espiral?",
                options: [
                    "Requisitos congelados.",
                    "Análise de Risco a cada volta (ciclo).",
                    "Apenas testes unitários.",
                    "Entregas diárias ao cliente final."
                ],
                answer: "Análise de Risco a cada volta (ciclo)."
            },
            {
                id: 23,
                instruction: "Filosofia Ágil.",
                scenario: "A equipe prefere conversar pessoalmente com o cliente do que escrever um documento de 50 páginas.",
                text: "Qual é o foco dos Modelos Ágeis?",
                options: [
                    "Indivíduos e Interações, entregas rápidas e satisfação do cliente.",
                    "Documentação extensiva e centralizada.",
                    "Arquitetura estável aprovada em comitê.",
                    "Baixo risco de mudança no escopo."
                ],
                answer: "Indivíduos e Interações, entregas rápidas e satisfação do cliente."
            },
            {
                id: 24,
                instruction: "Processo Unificado Ágil (AUP).",
                scenario: "A empresa quer a estrutura do Processo Unificado, mas com entregas mais frequentes.",
                text: "O que difere o AUP do PU Clássico?",
                options: [
                    "O AUP gasta meses em documentos antes de codificar.",
                    "O AUP faz entregas frequentes para produção, com menos burocracia.",
                    "O AUP não possui as 4 fases seriais (Iniciação, Elaboração, etc).",
                    "O AUP foca exclusivamente em Cascata Puro."
                ],
                answer: "O AUP faz entregas frequentes para produção, com menos burocracia."
            },
            {
                id: 25,
                instruction: "Ciclo de Vida Scrum.",
                scenario: "A equipe organiza o trabalho em blocos de 2 semanas para gerar valor constante.",
                text: "Como se chama este ciclo fixo no Scrum?",
                options: [
                    "Espiral.",
                    "Incremento.",
                    "Daily.",
                    "Sprint."
                ],
                answer: "Sprint."
            },
            {
                id: 26,
                instruction: "Scrum vs XP.",
                scenario: "Um novo gestor precisa organizar o fluxo de trabalho, os papéis e os rituais da equipe.",
                text: "Entre Scrum e XP, qual tem foco na Gestão?",
                options: [
                    "XP (Extreme Programming).",
                    "Scrum.",
                    "Ambos possuem papéis de PO e Scrum Master.",
                    "Nenhum, ambos focam apenas na engenharia de código."
                ],
                answer: "Scrum."
            },
            {
                id: 27,
                instruction: "Scrum vs XP.",
                scenario: "Os desenvolvedores querem adotar TDD (Desenvolvimento Orientado a Testes) e Programação em Par.",
                text: "Estas práticas pertencem primariamente a qual framework?",
                options: [
                    "XP (Extreme Programming - Foco na Engenharia).",
                    "Scrum (Foco na Gestão).",
                    "AUP (Processo Unificado Ágil).",
                    "Modelo V."
                ],
                answer: "XP (Extreme Programming - Foco na Engenharia)."
            },
            {
                id: 28,
                instruction: "Extreme Programming (XP).",
                scenario: "Dois programadores sentam juntos em um mesmo computador: um digita e o outro revisa.",
                text: "Como é chamada essa prática no XP comparada a um co-piloto de Rally?",
                options: [
                    "Refactoring.",
                    "TDD.",
                    "Pair Programming (Programação em Par).",
                    "Daily Stand-up."
                ],
                answer: "Pair Programming (Programação em Par)."
            },
            {
                id: 29,
                instruction: "Eventos Scrum.",
                scenario: "A equipe faz uma rápida reunião matinal para sincronizar atividades.",
                text: "Qual é a duração/frequência desta reunião no ciclo Scrum?",
                options: [
                    "A cada 15 dias (Planning).",
                    "Diariamente (Daily - 24h).",
                    "Ao final da Sprint (Review).",
                    "Apenas na transição do projeto."
                ],
                answer: "Diariamente (Daily - 24h)."
            },
            {
                id: 30,
                instruction: "Ciclos de Feedback do XP.",
                scenario: "No XP, o feedback ocorre em diferentes escalas de tempo.",
                text: "O 'Pairing' (Pair Programming) oferece feedback em qual escala?",
                options: [
                    "Semanas.",
                    "Dias.",
                    "Minutos.",
                    "Segundos."
                ],
                answer: "Segundos."
            },
            {
                id: 31,
                instruction: "Gestão e Ferramentas.",
                scenario: "O Escritório de Projetos (PMO) precisa elaborar o cronograma rígido de construção civil.",
                text: "Qual gestão e ferramenta são comuns em Modelos Preditivos? ",
                options: [
                    "Scrum Master / Jira.",
                    "Modelagem Ágil / Git.",
                    "PMBOK / MS Project (Gantt).",
                    "TDD / Pair Programming."
                ],
                answer: "PMBOK / MS Project (Gantt)."
            },
            {
                id: 32,
                instruction: "Gestão e Ferramentas.",
                scenario: "A equipe de software usa um mural visual com colunas (A Fazer, Fazendo, Feito).",
                text: "Em ferramentas Scrum, como isso é chamado? ",
                options: [
                    "MS Project.",
                    "Jira/Trello (Kanban).",
                    "Enterprise Architect.",
                    "Gantt."
                ],
                answer: "Jira/Trello (Kanban)."
            },
            {
                id: 33,
                instruction: "Gestão de Projetos vs Versão.",
                scenario: "O time não sabe se usa o Jira ou o GitHub para organizar as tarefas de quem faz o quê.",
                text: "Para a Gestão de Projetos (Tarefas e Cronogramas), qual ferramenta utilizar?",
                options: [
                    "Git e GitLab.",
                    "Microsoft Project, Trello, Jira.",
                    "Apenas repositórios de código.",
                    "Enterprise Architect."
                ],
                answer: "Microsoft Project, Trello, Jira."
            },
            {
                id: 34,
                instruction: "Controle de Versão.",
                scenario: "Vários desenvolvedores precisam trabalhar no mesmo arquivo de código simultaneamente sem subscrever o trabalho um do outro.",
                text: "Que tipo de sistema deve ser utilizado?",
                options: [
                    "Sistemas de Controle de Versão (Git, GitLab, GitHub).",
                    "Ferramentas de Kanban (Trello).",
                    "Gerenciador de Cronogramas (MS Project).",
                    "Burndown Chart."
                ],
                answer: "Sistemas de Controle de Versão (Git, GitLab, GitHub)."
            },
            {
                id: 35,
                instruction: "Infraestrutura Web: Estrutura.",
                scenario: "Você está criando o 'esqueleto' de uma página, definindo o que é título e o que é parágrafo.",
                text: "Qual tecnologia da tríade Frontend é responsável por isso?",
                options: [
                    "CSS.",
                    "JavaScript.",
                    "HTML.",
                    "Python."
                ],
                answer: "HTML."
            },
            {
                id: 36,
                instruction: "Infraestrutura Web: Estilo.",
                scenario: "O designer solicitou que a página tenha um visual mais amigável e cores com maior contraste.",
                text: "Qual tecnologia atende a esse requisito visual?",
                options: [
                    "HTML.",
                    "CSS.",
                    "JavaScript.",
                    "SQL."
                ],
                answer: "CSS."
            },
            {
                id: 37,
                instruction: "Infraestrutura Web: Comportamento.",
                scenario: "Ao clicar em um botão, um modal pop-up precisa aparecer animado na tela.",
                text: "Qual tecnologia define essa interatividade e comportamento no navegador?",
                options: [
                    "HTML.",
                    "CSS.",
                    "JavaScript.",
                    "PostgreSQL."
                ],
                answer: "JavaScript."
            },
            {
                id: 38,
                instruction: "Sintaxe de Linguagens.",
                scenario: "Você abre um arquivo e vê validações de formulário usando 'function name() { }' e 'const/let'.",
                text: "Qual linguagem possui esta assinatura visual?",
                options: [
                    "Python.",
                    "CSS.",
                    "JavaScript.",
                    "HTML."
                ],
                answer: "JavaScript."
            },
            {
                id: 39,
                instruction: "Sintaxe de Linguagens.",
                scenario: "Você se depara com um script que exige indentação obrigatória e usa 'def name():' sem chaves para os blocos.",
                text: "Que linguagem é essa?",
                options: [
                    "JavaScript.",
                    "Python.",
                    "Java.",
                    "C#."
                ],
                answer: "Python."
            },
            {
                id: 40,
                instruction: "Sintaxe de Linguagens.",
                scenario: "O arquivo contém o seguinte trecho: '.classe { color: blue; }'.",
                text: "A qual tecnologia isso pertence?",
                options: [
                    "CSS.",
                    "HTML.",
                    "Python.",
                    "JavaScript."
                ],
                answer: "CSS."
            },
            {
                id: 41,
                instruction: "Gestão Ágil: Estimativas.",
                scenario: "A equipe ágil precisa chegar a um consenso de quanto tempo/esforço as tarefas levarão.",
                text: "Que técnica é baseada em consenso para medir o esforço?",
                options: [
                    "Burndown Chart.",
                    "Planning Poker.",
                    "Daily Stand-up.",
                    "Pair Programming."
                ],
                answer: "Planning Poker."
            },
            {
                id: 42,
                instruction: "Gestão Ágil: Previsibilidade.",
                scenario: "O Scrum Master quer ver visualmente o trabalho restante comparado ao tempo disponível na Sprint.",
                text: "Qual ferramenta visual ajuda nesta previsibilidade?",
                options: [
                    "Gráfico de Gantt.",
                    "Burndown Chart.",
                    "Mural Kanban.",
                    "GitLab."
                ],
                answer: "Burndown Chart."
            },
            {
                id: 43,
                instruction: "Arquitetura: MVC.",
                scenario: "O sistema precisa aplicar um desconto nas compras. Essa regra de negócio deve ser processada no servidor.",
                text: "Em qual camada do MVC residem os dados e a lógica de negócio?",
                options: [
                    "Model (Modelo).",
                    "View (Visão).",
                    "Controller (Controlador).",
                    "Database."
                ],
                answer: "Model (Modelo)."
            },
            {
                id: 44,
                instruction: "Arquitetura: MVC.",
                scenario: "O botão clicado pelo usuário precisa de um intermediário para avisar as regras de negócio que algo aconteceu.",
                text: "Quem faz esse papel de intermediário no MVC?",
                options: [
                    "Model.",
                    "View.",
                    "Controller (Controlador).",
                    "Front-end."
                ],
                answer: "Controller (Controlador)."
            },
            {
                id: 45,
                instruction: "Tipos de Servidores.",
                scenario: "O projeto consiste apenas em entregar páginas estáticas (HTML e Imagens) de uma landing page.",
                text: "Que tipo de servidor atende melhor esse foco?",
                options: [
                    "Servidor de Banco de Dados.",
                    "Servidor Web (Apache, Nginx).",
                    "Servidor de Aplicação (JBoss).",
                    "Contêiner Docker."
                ],
                answer: "Servidor Web (Apache, Nginx)."
            },
            {
                id: 46,
                instruction: "Tipos de Servidores.",
                scenario: "O sistema possui regras de negócio complexas e conexão avançada com bancos de dados, como um E-commerce robusto.",
                text: "Que tipo de servidor deve processar essa lógica dinâmica?",
                options: [
                    "Servidor Web Estático.",
                    "Servidor de Aplicação (JBoss, GlassFish).",
                    "Servidor de Arquivos (FTP).",
                    "Nginx Simples."
                ],
                answer: "Servidor de Aplicação (JBoss, GlassFish)."
            },
            {
                id: 47,
                instruction: "Dados e Inteligência Artificial.",
                scenario: "O requisito pede uma linguagem com ampla disponibilidade de bibliotecas para análise de dados e IA (TensorFlow, Pandas).",
                text: "Qual é a linguagem de referência para isso atualmente?",
                options: [
                    "JavaScript.",
                    "C++.",
                    "Python.",
                    "CSS."
                ],
                answer: "Python."
            },
            {
                id: 48,
                instruction: "Bancos de Dados: Relacional.",
                scenario: "Um sistema financeiro exige chaves estrangeiras, consistência absoluta e relações estritas entre tabelas de estoque e vendas.",
                text: "Qual tipo de banco de dados deve ser utilizado?",
                options: [
                    "Não-Relacional (MongoDB).",
                    "Relacional SQL (PostgreSQL, MySQL).",
                    "Chave-Valor (Redis).",
                    "Planilhas em Memória."
                ],
                answer: "Relacional SQL (PostgreSQL, MySQL)."
            },
            {
                id: 49,
                instruction: "Bancos de Dados: Não-Relacional.",
                scenario: "O aplicativo coleta dados não-estruturados de sensores IoT, focando em alta performance e flexibilidade de esquema.",
                text: "Que tipo de banco se adequa melhor a esta falta de estrutura rígida?",
                options: [
                    "Relacional (MySQL).",
                    "Planilhas Estáticas.",
                    "Não-Relacional NoSQL (MongoDB, Redis).",
                    "PostgreSQL."
                ],
                answer: "Não-Relacional NoSQL (MongoDB, Redis)."
            },
            {
                id: 50,
                instruction: "Revisão Geral e Resumo.",
                scenario: "O aluno chega ao final do treinamento de metodologias e tecnologias.",
                text: "Segundo o resumo final, se o problema for 'Estimativa de Esforço Ágil', qual é a tecnologia/conceito chave a aplicar?",
                options: [
                    "Model.",
                    "CSS.",
                    "GitLab / Git.",
                    "Planning Poker / Burndown."
                ],
                answer: "Planning Poker / Burndown."
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
            await typeWriter(`Carregando Missão ${currentQuestion.value.id} de 50...`, "log-info");
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Conceito de Metodologia aplicado.";
                addLog("Sucesso: Decisão metodológica precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Abordagem incorreta para o cenário.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Decisão Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Decisão incorreta. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade de decisão arquitetural e gestão de software.";
            if (score.value < 35) performanceMsg = "Recomenda-se revisão aprofundada dos Modelos Ágeis e Preditivos.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Avaliação - Eng. de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Metodologias</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo processos Preditivos, Adaptativos, Ágeis e de Infraestrutura web.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 35 ? '#10B981' : (score.value >= 25 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador de Metodologias.
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_Metodologias_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando simulação de Metodologias...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador Metodologias_v2.0...", "log-info");
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