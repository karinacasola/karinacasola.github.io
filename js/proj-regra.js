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

        // --- Banco de Questões (30 Questões - Reescrita de Regras com SMART) ---
        const questions = ref([
            // Bloco 1: Identificando a melhor reescrita (1 a 10)
            {
                id: 1,
                instruction: "Refinamento de Necessidade",
                scenario: "A diretoria apresentou a seguinte necessidade de negócio genérica: 'Melhorar o lucro da empresa'.",
                text: "Qual das opções abaixo representa a melhor reescrita utilizando o método SMART?",
                options: [
                    "Aumentar a margem de lucro líquido em 15% através da redução de desperdícios operacionais até dezembro de 2024.",
                    "Fazer com que a empresa lucre muito mais no próximo ano reduzindo todos os custos desnecessários.",
                    "Aumentar o lucro líquido vendendo novos produtos para os clientes atuais o mais rápido possível.",
                    "Reduzir o custo operacional do setor de atendimento ao cliente em 30%."
                ],
                answer: "Aumentar a margem de lucro líquido em 15% através da redução de desperdícios operacionais até dezembro de 2024."
            },
            {
                id: 2,
                instruction: "Refinamento de Necessidade",
                scenario: "O gerente de suporte declarou: 'Precisamos de um atendimento mais rápido e eficiente para os clientes'.",
                text: "Como essa necessidade pode ser convertida em um objetivo SMART?",
                options: [
                    "Reduzir o tempo médio de espera (TME) no call center para menos de 2 minutos até o final do 3º trimestre.",
                    "Atender todos os clientes imediatamente para aumentar a eficiência do setor de call center.",
                    "Comprar um novo software de atendimento para melhorar a eficiência da equipe de suporte técnico.",
                    "Garantir que a equipe de suporte reduza o tempo de espera em 50% através de trabalho duro."
                ],
                answer: "Reduzir o tempo médio de espera (TME) no call center para menos de 2 minutos até o final do 3º trimestre."
            },
            {
                id: 3,
                instruction: "Refinamento de Necessidade",
                scenario: "A equipe de Qualidade apontou: 'Temos que diminuir a quantidade de reclamações sobre o nosso aplicativo'.",
                text: "Qual reescrita atende perfeitamente aos critérios SMART?",
                options: [
                    "Reduzir o volume de chamados de suporte referentes a falhas de login no app em 30% nos próximos 6 meses.",
                    "Zerar todas as reclamações dos clientes sobre o aplicativo atualizando o sistema regularmente.",
                    "Diminuir em 30% as reclamações mensais contratando mais desenvolvedores experientes.",
                    "Melhorar a avaliação do aplicativo nas lojas virtuais até o final deste ano."
                ],
                answer: "Reduzir o volume de chamados de suporte referentes a falhas de login no app em 30% nos próximos 6 meses."
            },
            {
                id: 4,
                instruction: "Refinamento de Necessidade",
                scenario: "O setor de Marketing definiu a meta: 'Aumentar nossa presença online e engajamento'.",
                text: "Identifique a meta que foi corretamente refinada pelo método SMART:",
                options: [
                    "Alcançar 50.000 seguidores orgânicos no Instagram através de campanhas semanais de conteúdo até novembro deste ano.",
                    "Fazer mais postagens nas redes sociais para aumentar o número de seguidores rapidamente.",
                    "Investir R$ 10.000 em anúncios para ter a maior presença online do nosso segmento de mercado.",
                    "Aumentar o engajamento online em 100% até o fim do semestre com sorteios diários."
                ],
                answer: "Alcançar 50.000 seguidores orgânicos no Instagram através de campanhas semanais de conteúdo até novembro deste ano."
            },
            {
                id: 5,
                instruction: "Refinamento de Necessidade",
                scenario: "TI informou à diretoria: 'Precisamos modernizar nossa infraestrutura urgentemente'.",
                text: "Qual das afirmações transforma isso em uma meta SMART?",
                options: [
                    "Migrar 100% dos servidores físicos locais para a nuvem AWS em até 8 meses, respeitando o orçamento de R$ 50 mil.",
                    "Mover todos os sistemas para a nuvem mais moderna do mercado para evitar lentidão.",
                    "Atualizar os computadores de todos os funcionários da matriz até a semana que vem.",
                    "Garantir 99,99% de disponibilidade do sistema modernizando a rede física da empresa."
                ],
                answer: "Migrar 100% dos servidores físicos locais para a nuvem AWS em até 8 meses, respeitando o orçamento de R$ 50 mil."
            },
            {
                id: 6,
                instruction: "Refinamento de Necessidade",
                scenario: "A área comercial pediu: 'Temos que vender mais do nosso produto principal'.",
                text: "Selecione a opção estruturada como um objetivo SMART:",
                options: [
                    "Elevar o faturamento bruto do Produto X em 20% na região Sudeste até o dia 31 de dezembro de 2024.",
                    "Aumentar as vendas do Produto X em 100% em 2 dias fazendo promoções agressivas.",
                    "Vender mais unidades mensais do nosso produto principal treinando a equipe de vendas.",
                    "Reduzir o preço do Produto X para garantir que as vendas dobrem no próximo trimestre."
                ],
                answer: "Elevar o faturamento bruto do Produto X em 20% na região Sudeste até o dia 31 de dezembro de 2024."
            },
            {
                id: 7,
                instruction: "Refinamento de Necessidade",
                scenario: "O RH reportou: 'Precisamos de uma equipe mais bem capacitada'.",
                text: "Escolha a reescrita que atende ao método SMART:",
                options: [
                    "Certificar 80% dos analistas juniores em metodologias ágeis (Scrum) até o fim do segundo trimestre.",
                    "Treinar todos os funcionários para que sejam os melhores profissionais do mercado de tecnologia.",
                    "Oferecer cursos semanais para a equipe até que a produtividade da empresa melhore visivelmente.",
                    "Capacitar 20% da liderança em comunicação no menor tempo possível."
                ],
                answer: "Certificar 80% dos analistas juniores em metodologias ágeis (Scrum) até o fim do segundo trimestre."
            },
            {
                id: 8,
                instruction: "Refinamento de Necessidade",
                scenario: "A meta do financeiro é: 'Reduzir os custos operacionais da sede'.",
                text: "Qual reescrita representa uma meta SMART?",
                options: [
                    "Diminuir os gastos mensais com energia elétrica na sede em 15% instalando painéis solares em até 10 meses.",
                    "Cortar os custos de todos os departamentos pela metade até o final do ano para equilibrar as contas.",
                    "Reduzir as contas de água, luz e telefone fazendo campanhas de conscientização constantes.",
                    "Diminuir os gastos da sede em 10% demitindo funcionários terceirizados."
                ],
                answer: "Diminuir os gastos mensais com energia elétrica na sede em 15% instalando painéis solares em até 10 meses."
            },
            {
                id: 9,
                instruction: "Refinamento de Necessidade",
                scenario: "O setor de Sucesso do Cliente alertou: 'Temos que reter mais os nossos assinantes atuais'.",
                text: "Como reescrever isso usando SMART?",
                options: [
                    "Aumentar a taxa de retenção de assinantes anuais de 70% para 85% oferecendo um programa de fidelidade até novembro.",
                    "Impedir que qualquer assinante cancele o plano oferecendo descontos altíssimos.",
                    "Reter mais clientes ligando para eles todos os dias para perguntar sobre a satisfação.",
                    "Aumentar a retenção em 50% reduzindo o preço do software em todos os mercados."
                ],
                answer: "Aumentar a taxa de retenção de assinantes anuais de 70% para 85% oferecendo um programa de fidelidade até novembro."
            },
            {
                id: 10,
                instruction: "Refinamento de Necessidade",
                scenario: "A Logística declarou: 'Precisamos melhorar o tempo de entrega para não perder para a concorrência'.",
                text: "Identifique o objetivo SMART correspondente:",
                options: [
                    "Reduzir o tempo médio de entrega de mercadorias na região metropolitana de 5 para 2 dias úteis até o final do semestre.",
                    "Entregar todos os produtos em 24 horas usando inteligência artificial e novos caminhões.",
                    "Melhorar o tempo de entrega em 10% contratando mais motoristas ao longo do ano.",
                    "Garantir que os prazos de entrega sejam os mais rápidos do mercado brasileiro."
                ],
                answer: "Reduzir o tempo médio de entrega de mercadorias na região metropolitana de 5 para 2 dias úteis até o final do semestre."
            },

            // Bloco 2: Identificando o elemento ausente no SMART (11 a 20)
            {
                id: 11,
                instruction: "Diagnóstico SMART",
                scenario: "Declaração analisada: 'Aumentar as vendas do software em 15% através de campanhas de e-mail marketing'.",
                text: "Qual elemento do método SMART está CLARAMENTE ausente nesta declaração?",
                options: [
                    "T (Tempestivo - Falta uma janela de tempo definida).",
                    "M (Mensurável - Falta o indicador numérico).",
                    "S (Específico - Falta saber o que será feito).",
                    "R (Relevante - Falta alinhamento com a organização)."
                ],
                answer: "T (Tempestivo - Falta uma janela de tempo definida)."
            },
            {
                id: 12,
                instruction: "Diagnóstico SMART",
                scenario: "Declaração analisada: 'Tornar-se a marca de roupas mais amada e prestigiada do Brasil até dezembro de 2025'.",
                text: "Qual é a principal falha conceitual segundo o método SMART?",
                options: [
                    "Falta o 'M' (Mensurável), pois 'mais amada' é subjetivo e difícil de medir de forma exata.",
                    "Falta o 'T' (Tempestivo), pois o prazo é muito longo.",
                    "Falta o 'A' (Alcançável), pois é impossível vender roupas no Brasil todo.",
                    "Falta o 'S' (Específico), pois roupas não são produtos observáveis."
                ],
                answer: "Falta o 'M' (Mensurável), pois 'mais amada' é subjetivo e difícil de medir de forma exata."
            },
            {
                id: 13,
                instruction: "Diagnóstico SMART",
                scenario: "Declaração analisada: 'Reduzir os custos de produção da fábrica em 80% até amanhã de manhã mudando o maquinário'.",
                text: "Em qual critério do método SMART essa meta mais obviamente falha?",
                options: [
                    "A (Alcançável - A meta é completamente inviável considerando o tempo e o esforço).",
                    "S (Específico - Não diz o que será reduzido).",
                    "M (Mensurável - Faltam números percentuais).",
                    "T (Tempestivo - Não há prazo estipulado)."
                ],
                answer: "A (Alcançável - A meta é completamente inviável considerando o tempo e o esforço)."
            },
            {
                id: 14,
                instruction: "Diagnóstico SMART",
                scenario: "Uma startup de IA de ponta cria a meta: 'Vender 50.000 aparelhos de fax para o setor de telemarketing em 3 meses para aumentar a receita'.",
                text: "Qual elemento SMART está severamente comprometido aqui?",
                options: [
                    "R (Relevante - Vender tecnologia obsoleta não se alinha à visão de uma startup de IA).",
                    "M (Mensurável - 50.000 não é uma métrica válida).",
                    "T (Tempestivo - 3 meses não é um formato de prazo).",
                    "S (Específico - O setor alvo não foi definido)."
                ],
                answer: "R (Relevante - Vender tecnologia obsoleta não se alinha à visão de uma startup de IA)."
            },
            {
                id: 15,
                instruction: "Diagnóstico SMART",
                scenario: "Declaração analisada: 'Melhorar significativamente a estabilidade do servidor contratando dois novos engenheiros de DevOps até o fim do trimestre'.",
                text: "O que falta para que esta meta seja considerada Mensurável (M)?",
                options: [
                    "Definir a métrica exata de melhoria (ex: passar de 95% para 99% de uptime).",
                    "Definir o prazo exato (dia, mês e ano).",
                    "Explicar quais serão as tarefas dos dois engenheiros.",
                    "Provar que a contratação está dentro do orçamento de RH."
                ],
                answer: "Definir a métrica exata de melhoria (ex: passar de 95% para 99% de uptime)."
            },
            {
                id: 16,
                instruction: "Teoria do Método SMART",
                scenario: "Durante a definição de um requisito de negócio, o Analista pergunta: 'Essa meta apresenta um resultado observável e detalha a ação esperada?'",
                text: "A qual pilar do método SMART ele está se referindo?",
                options: [
                    "S (Específico).",
                    "A (Alcançável).",
                    "M (Mensurável).",
                    "R (Relevante)."
                ],
                answer: "S (Específico)."
            },
            {
                id: 17,
                instruction: "Diagnóstico SMART",
                scenario: "Declaração analisada: 'Otimizar todos os processos operacionais da empresa até dezembro de 2024'.",
                text: "Por que essa declaração NÃO é SMART?",
                options: [
                    "Carece de 'S' (Específico) e 'M' (Mensurável) por ser vaga e não ter indicadores numéricos de sucesso.",
                    "Carece de 'T' (Tempestivo) pois dezembro de 2024 é um prazo abstrato.",
                    "Carece de 'R' (Relevante) pois otimizar processos não ajuda empresas de tecnologia.",
                    "Carece de 'A' (Alcançável) porque nenhuma empresa otimiza processos."
                ],
                answer: "Carece de 'S' (Específico) e 'M' (Mensurável) por ser vaga e não ter indicadores numéricos de sucesso."
            },
            {
                id: 18,
                instruction: "Diagnóstico SMART",
                scenario: "Declaração analisada: 'Reduzir em 15% até o mês de novembro usando a nova metodologia ágil'.",
                text: "Qual é o principal erro na formulação dessa meta?",
                options: [
                    "Não é Específica (S) – não diz O QUE será reduzido (custos, defeitos, tempo?).",
                    "Não é Temporal (T) – 'novembro' é um mês inválido para metas ágeis.",
                    "Não é Mensurável (M) – 15% é uma métrica subjetiva.",
                    "Não é Alcançável (A) – metodologias ágeis apenas aumentam custos."
                ],
                answer: "Não é Específica (S) – não diz O QUE será reduzido (custos, defeitos, tempo?)."
            },
            {
                id: 19,
                instruction: "Teoria do Método SMART",
                scenario: "Ao avaliar um objetivo com o método SMART, o gestor verifica se a meta 'considera a viabilidade do investimento e os recursos disponíveis'.",
                text: "Isso garante que a meta seja:",
                options: [
                    "Alcançável (A).",
                    "Relevante (R).",
                    "Tempestiva (T).",
                    "Específica (S)."
                ],
                answer: "Alcançável (A)."
            },
            {
                id: 20,
                instruction: "Teoria do Método SMART",
                scenario: "A declaração 'Aumentar as doações recebidas pela ONG em 20% enviando boletins mensais' foi recusada pelo PMO.",
                text: "Qual elemento do SMART justifica essa recusa por estar ausente?",
                options: [
                    "A falta de uma janela de tempo definida (T).",
                    "A ausência de métricas numéricas (M).",
                    "A incompatibilidade com a missão da ONG (R).",
                    "A inviabilidade financeira da ação (A)."
                ],
                answer: "A falta de uma janela de tempo definida (T)."
            },

            // Bloco 3: Regras, Requisitos e Aplicações do SMART (21 a 30)
            {
                id: 21,
                instruction: "Análise de Componentes",
                scenario: "Meta: 'Reduzir o tempo de checkout no e-commerce em 25% automatizando o preenchimento de endereço até 30/11/2024'.",
                text: "Nesta frase, qual trecho representa o pilar 'S' (Específico)?",
                options: [
                    "'automatizando o preenchimento de endereço'",
                    "'em 25%'",
                    "'até 30/11/2024'",
                    "'Reduzir o tempo'"
                ],
                answer: "'automatizando o preenchimento de endereço'"
            },
            {
                id: 22,
                instruction: "Regra de Negócio vs RNF",
                scenario: "Você precisa reescrever uma restrição legal em uma Regra de Negócio sistêmica estruturada, e não em um RNF.",
                text: "Qual opção é a melhor reescrita em formato de Regra de Negócio para 'Seguir as leis de dados'?",
                options: [
                    "Bloquear o acesso de usuários não autenticados e excluir permanentemente contas inativas há mais de 12 meses, conforme LGPD, a partir da versão 2.0.",
                    "O banco de dados deve estar criptografado em AES-256 e o tempo de resposta não pode exceder 1 segundo.",
                    "As telas do sistema devem ser responsivas e carregar rapidamente para facilitar o uso.",
                    "O sistema deve ser desenvolvido utilizando a linguagem Python e banco de dados PostgreSQL."
                ],
                answer: "Bloquear o acesso de usuários não autenticados e excluir permanentemente contas inativas há mais de 12 meses, conforme LGPD, a partir da versão 2.0."
            },
            {
                id: 23,
                instruction: "Fundamentos de Requisitos",
                scenario: "De acordo com os conceitos de Administração Por Objetivos (APO) aplicados à Análise de Sistemas...",
                text: "Por que solicitações de negócio iniciais, que são muito amplas, precisam ser refinadas (ex: via método SMART)?",
                options: [
                    "Porque sem critérios específicos de sucesso, o universo de soluções possíveis é muito grande, dificultando saber se a necessidade foi atendida ao final.",
                    "Porque desenvolvedores não sabem ler documentos de texto longos.",
                    "Porque o método SMART substitui automaticamente a criação do documento de visão do projeto.",
                    "Para transformar imediatamente todos os requisitos de negócio em requisitos não funcionais de desempenho."
                ],
                answer: "Porque sem critérios específicos de sucesso, o universo de soluções possíveis é muito grande, dificultando saber se a necessidade foi atendida ao final."
            },
            {
                id: 24,
                instruction: "Refinamento de Regras",
                scenario: "Um lojista dita a seguinte regra vaga: 'Dar descontos bons para quem compra muito'.",
                text: "Como transformar isso em uma Regra de Negócio testável e bem delimitada (Smart-like)?",
                options: [
                    "Aplicar automaticamente 15% de desconto no valor total da fatura para clientes com compras acumuladas acima de R$ 1.000,00 no mês vigente.",
                    "O sistema calculará grandes descontos para os clientes VIPs em milissegundos para não travar o caixa.",
                    "Otimizar a tabela de descontos em 10% até dezembro.",
                    "Garantir a máxima disponibilidade do módulo de descontos durante a Black Friday."
                ],
                answer: "Aplicar automaticamente 15% de desconto no valor total da fatura para clientes com compras acumuladas acima de R$ 1.000,00 no mês vigente."
            },
            {
                id: 25,
                instruction: "Diagnóstico SMART em Negócios",
                scenario: "Meta: 'Aumentar a receita recorrente mensal (MRR) em R$ 50.000 vendendo upgrades de plano para 5% da base de clientes ativos, até 31 de Outubro'.",
                text: "Esta meta possui o critério M (Mensurável)?",
                options: [
                    "Sim, está expresso pelo valor de 'R$ 50.000' e os '5%' da base.",
                    "Não, faltou definir a quantidade exata de clientes em números absolutos.",
                    "Sim, está expresso pela data '31 de Outubro'.",
                    "Não, MRR é um indicador subjetivo e não mensurável."
                ],
                answer: "Sim, está expresso pelo valor de 'R$ 50.000' e os '5%' da base."
            },
            {
                id: 26,
                instruction: "Identificação de Origem",
                scenario: "No estudo do Domínio do Problema, levanta-se as necessidades de negócio. Elas representam os objetivos que a área busca alcançar.",
                text: "Qual é a relação entre as necessidades de negócio e as partes interessadas (stakeholders)?",
                options: [
                    "As necessidades de negócio descrevem as metas da organização como um todo, servindo de base para refinar os requisitos das partes interessadas e depois os da solução.",
                    "As necessidades de negócio são apenas opiniões pessoais de pequenos grupos de stakeholders sem impacto na solução.",
                    "As partes interessadas geram necessidades técnicas de software, ignorando o negócio.",
                    "As necessidades de negócio e os requisitos da solução são exatamente a mesma coisa na engenharia de requisitos."
                ],
                answer: "As necessidades de negócio descrevem as metas da organização como um todo, servindo de base para refinar os requisitos das partes interessadas e depois os da solução."
            },
            {
                id: 27,
                instruction: "Análise de Componentes",
                scenario: "Meta: 'Substituir 100% das embalagens plásticas por material biodegradável na linha principal de produtos até dezembro de 2025 para adequação às normas ESG'.",
                text: "Nesta formulação SMART, a justificativa 'para adequação às normas ESG' fortalece qual pilar?",
                options: [
                    "R (Relevante - Mostra o alinhamento com objetivos-chave e conformidade corporativa).",
                    "T (Tempestivo - Define o tempo da ação).",
                    "M (Mensurável - Mensura o peso das embalagens).",
                    "S (Específico - Define exatamente qual material usar)."
                ],
                answer: "R (Relevante - Mostra o alinhamento com objetivos-chave e conformidade corporativa)."
            },
            {
                id: 28,
                instruction: "Identificação de Tipos de Requisitos",
                scenario: "Durante o refinamento SMART, uma meta gerou o seguinte item: 'Os relatórios contábeis mensais só poderão ser gerados e assinados eletronicamente pelo perfil Diretor Financeiro'.",
                text: "Isso é classificado primariamente como:",
                options: [
                    "Uma Regra de Negócio (Política/Permissão corporativa).",
                    "Um Requisito Não Funcional de Desempenho.",
                    "Um Requisito Não Funcional de Usabilidade.",
                    "Uma Premissa (Assumption) de Projeto."
                ],
                answer: "Uma Regra de Negócio (Política/Permissão corporativa)."
            },
            {
                id: 29,
                instruction: "Refinamento de Regras",
                scenario: "O cliente diz: 'Quero que o processo de admissão de novos funcionários seja mais barato e integrado'.",
                text: "O analista aplicou o SMART. Qual das opções é o resultado dessa aplicação?",
                options: [
                    "Reduzir o custo de integração (onboarding) em 40% centralizando os fluxos de RH no portal corporativo até o fim do semestre.",
                    "Fazer com que o banco de dados carregue os novos currículos em menos de 3 segundos usando índices.",
                    "Proibir a impressão de papéis no setor de RH a partir de hoje.",
                    "Comprar licenças de um software caro para que o RH tenha menos trabalho manual todo dia."
                ],
                answer: "Reduzir o custo de integração (onboarding) em 40% centralizando os fluxos de RH no portal corporativo até o fim do semestre."
            },
            {
                id: 30,
                instruction: "O Objetivo de Resolver Problemas",
                scenario: "Segundo o material sobre necessidades de negócio, o objetivo de resolver problemas ou aproveitar oportunidades se divide em duas vertentes.",
                text: "Quais são essas duas vertentes principais (cenários) em que o negócio deseja operar?",
                options: [
                    "Manter as condições atuais (ex: adequações para manter a liderança) ou alterá-las para um novo cenário (ex: oferecer novo serviço).",
                    "Criar código-fonte limpo ou criar documentação extensa.",
                    "Ignorar a concorrência ou demitir as partes interessadas que reclamam.",
                    "Focar apenas em regras funcionais ou focar apenas em requisitos de software não funcionais."
                ],
                answer: "Manter as condições atuais (ex: adequações para manter a liderança) ou alterá-las para um novo cenário (ex: oferecer novo serviço)."
            }
        ]);

        // =========================================================================
        // Algoritmo seguro de Embaralhamento (Fisher-Yates)
        // Embaralha as posições aleatoriamente garantindo dinamismo real,
        // evitando que a resposta correta fique sempre na mesma posição.
        // =========================================================================
        const shuffleArray = (array) => {
            const newArray = [...array]; 
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        // Aplica o embaralhamento para todas as opções de questões ao iniciar
        questions.value.forEach(question => {
            question.options = shuffleArray(question.options);
        });
        // =========================================================================

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
            await typeWriter(`Carregando Desafio Analítico ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Sucesso: Refinamento preciso.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Regra mal estruturada.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Estruturação Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Falha na validação SMART. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão da estruturação de Negócios e do Método SMART.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de elicitação de requisitos e regras corporativas.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Engenharia de Requisitos</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Refinamento de Regras e Método SMART</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo refinamento técnico de regras de negócio a partir do Domínio do Problema para a Solução.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador REQ_SMART_v3.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Engenharia_Requisitos_SMART_${new Date().toISOString().slice(0,10)}.pdf`,
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
            
            // Re-embaralha caso o jogador tente novamente
            questions.value.forEach(question => {
                question.options = shuffleArray(question.options);
            });
            
            addLog("Reiniciando avaliador analítico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador REQ_SMART_v3.0...", "log-info");
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