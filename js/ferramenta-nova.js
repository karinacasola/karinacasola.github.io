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

        // --- Banco de Questões (40 Questões - Gestão da Inovação, KPIs e Ferramentas) ---
        const questions = ref([
            // --- Bloco 1: Inovação Organizacional e Intraempreendedorismo (10 questões) ---
            {
                id: 1,
                instruction: "Conceito de Inovação Organizacional",
                scenario: "A empresa percebeu que apenas adotar novas tecnologias de ponta não resolveu sua estagnação no mercado. A diretoria agora busca uma transformação profunda de processos e estrutura.",
                text: "Além de tecnologia, qual é o foco principal da Inovação Organizacional?",
                options: [
                    "Aumentar a eficiência, agilidade e criar novas vantagens competitivas.",
                    "Reduzir o quadro de funcionários para cortar custos operacionais em tecnologia.",
                    "Terceirizar toda a cadeia de suprimentos para startups ágeis.",
                    "Focar exclusivamente na criação de novos produtos físicos."
                ],
                answer: "Aumentar a eficiência, agilidade e criar novas vantagens competitivas."
            },
            {
                id: 2,
                instruction: "Estudo de Caso: Magazine Luiza",
                scenario: "Para combater a concorrência do e-commerce, uma varejista tradicional decidiu integrar seus estoques físicos e digitais através de uma nova estrutura, o LuizaLabs.",
                text: "Como as lojas físicas foram transformadas nesse novo modelo logístico omnichannel?",
                options: [
                    "As lojas físicas viraram mini-centros de distribuição.",
                    "As lojas físicas foram fechadas para focar apenas no aplicativo.",
                    "As lojas passaram a vender apenas produtos de tecnologia e inovação.",
                    "As lojas físicas se tornaram franquias independentes da marca."
                ],
                answer: "As lojas físicas viraram mini-centros de distribuição."
            },
            {
                id: 3,
                instruction: "Definição de Intraempreendedorismo",
                scenario: "Um colaborador identifica uma falha operacional grave, cria uma solução do zero e assume os riscos calculados da implementação utilizando os recursos da própria empresa.",
                text: "Como é chamada essa postura de atuar como 'dono' (Ownership) e empreender com o CNPJ alheio?",
                options: [
                    "Intraempreendedorismo.",
                    "Inovação Aberta.",
                    "Terceirização de Risco.",
                    "Síndrome da Rainha Vermelha."
                ],
                answer: "Intraempreendedorismo."
            },
            {
                id: 4,
                instruction: "Estudo de Caso: Sony PlayStation",
                scenario: "Nos anos 80, Ken Kutaragi desenvolveu secretamente um chip de som para a Nintendo utilizando recursos da Sony, que na época via videogames como brinquedos passageiros.",
                text: "Qual foi o resultado dessa ação de intraempreendedorismo que inicialmente quase gerou sua demissão?",
                options: [
                    "O nascimento do PlayStation, hoje a divisão mais lucrativa da marca.",
                    "A fusão estratégica entre a Sony e a Nintendo para o mercado de áudio.",
                    "A criação do primeiro estúdio de cinema da Sony em Hollywood.",
                    "O fechamento da divisão de eletrônicos da empresa para focar em games."
                ],
                answer: "O nascimento do PlayStation, hoje a divisão mais lucrativa da marca."
            },
            {
                id: 5,
                instruction: "Segurança Psicológica",
                scenario: "Um departamento tenta inovar, mas os funcionários têm medo de sugerir novas ideias porque os erros passados foram punidos severamente com demissões.",
                text: "O que acontece com o intraempreendedorismo sem segurança psicológica e tolerância ao erro?",
                options: [
                    "O intraempreendedorismo morre.",
                    "Ele se torna mais disciplinado e eficiente.",
                    "Ele atrai investidores devido ao baixo risco.",
                    "Ele foca exclusivamente em inovações radicais."
                ],
                answer: "O intraempreendedorismo morre."
            },
            {
                id: 6,
                instruction: "Alocação de Tempo para Inovar",
                scenario: "A gestão quer que a equipe inove, mas todos estão com 100% do seu tempo ocupado apagando incêndios operacionais diários.",
                text: "O que organizações inovadoras oferecem aos funcionários para solucionar isso (ex: Regra da 3M)?",
                options: [
                    "Tempo (ex: regra dos 15%) e orçamento para validação de ideias.",
                    "Bônus financeiro para quem inovar fora do horário de expediente.",
                    "Consultores externos para fazerem a ideação no lugar da equipe.",
                    "Prazos mais apertados para forçar a criatividade sob pressão."
                ],
                answer: "Tempo (ex: regra dos 15%) e orçamento para validação de ideias."
            },
            {
                id: 7,
                instruction: "Pessoas vs. Processos",
                scenario: "A empresa implementou os melhores e mais modernos processos de gestão do mundo, mas nenhuma ideia nova surgiu no último ano.",
                text: "Por que processos perfeitos não geram inovação sozinhos?",
                options: [
                    "Porque são as pessoas que desafiam o status quo.",
                    "Porque processos perfeitos reduzem a margem de lucro.",
                    "Porque a inovação requer caos corporativo desestruturado.",
                    "Porque os clientes não se importam com a gestão interna."
                ],
                answer: "Porque são as pessoas que desafiam o status quo."
            },
            {
                id: 8,
                instruction: "O Maior Risco Organizacional",
                scenario: "A diretoria tem medo de investir no projeto inovador e falhar, decidindo focar apenas em otimizar o produto principal que já vende bem.",
                text: "Segundo as considerações finais, qual é o maior risco real para uma empresa?",
                options: [
                    "Acertar perfeitamente em algo que já não importa mais.",
                    "Perder dinheiro com patentes reprovadas.",
                    "Treinar funcionários que depois vão para a concorrência.",
                    "Lançar produtos à frente do seu tempo."
                ],
                answer: "Acertar perfeitamente em algo que já não importa mais."
            },
            {
                id: 9,
                instruction: "Ecossistema de Inovação",
                scenario: "A empresa mapeou que tem excelentes intraempreendedores (a faísca), mas as ideias nunca saem do papel.",
                text: "O que funciona como o 'combustível' necessário para transformar essa faísca em resultado prático?",
                options: [
                    "A cultura e a autonomia.",
                    "A hierarquia e a conformidade.",
                    "Os cortes de gastos e o lucro rápido.",
                    "A tecnologia de ponta importada."
                ],
                answer: "A cultura e a autonomia."
            },
            {
                id: 10,
                instruction: "Papel do Intraempreendedor",
                scenario: "O gerente de RH está definindo o perfil procurado para liderar novas frentes de negócio internas.",
                text: "Qual destas características define a atitude de um intraempreendedor?",
                options: [
                    "Proatividade para identificar falhas e criar soluções do zero.",
                    "Habilidade de seguir manuais operacionais sem questionar.",
                    "Capacidade de trabalhar focado sem interagir com outras áreas.",
                    "Aversão total ao risco para proteger o capital da empresa."
                ],
                answer: "Proatividade para identificar falhas e criar soluções do zero."
            },

            // --- Bloco 2: Indicadores de Inovação e KPIs (15 questões) ---
            {
                id: 11,
                instruction: "Fundamentos de Indicadores",
                scenario: "A diretoria não sabe se o orçamento de P&D está sendo bem gasto ou se a equipe está apenas criando ideias sem impacto.",
                text: "Para que servem os indicadores de inovação?",
                options: [
                    "Para transformar conceitos abstratos (cultura, criatividade) em dados tangíveis para decisão executiva.",
                    "Apenas para cumprir exigências de auditoria financeira.",
                    "Para punir equipes que não atingem metas de lançamentos.",
                    "Para comparar o faturamento diário com a concorrência."
                ],
                answer: "Para transformar conceitos abstratos (cultura, criatividade) em dados tangíveis para decisão executiva."
            },
            {
                id: 12,
                instruction: "Métricas Práticas: Case 3M",
                scenario: "A 3M exige que uma fatia significativa de suas vendas anuais venha de produtos lançados recentemente.",
                text: "Como se chama essa métrica e qual é a janela de tempo considerada para esses produtos?",
                options: [
                    "New Product Vitality Index (NPVI) - Produtos introduzidos nos últimos 5 anos.",
                    "Net Promoter Score (NPS) - Produtos introduzidos nos últimos 12 meses.",
                    "Time to Market (TTM) - Produtos desenvolvidos em 6 meses.",
                    "Objectives and Key Results (OKR) - Produtos introduzidos nos últimos 3 anos."
                ],
                answer: "New Product Vitality Index (NPVI) - Produtos introduzidos nos últimos 5 anos."
            },
            {
                id: 13,
                instruction: "Definição de KPI",
                scenario: "O setor de marketing sugeriu medir o sucesso da inovação pela quantidade de 'curtidas' no post de lançamento nas redes sociais.",
                text: "Por que isso é um erro e o que são KPIs verdadeiros?",
                options: [
                    "Curtidas são métricas de vaidade; KPIs são indicadores vitais ligados aos objetivos estratégicos do negócio.",
                    "Curtidas mudam rápido; KPIs devem ser os mesmos durante 10 anos.",
                    "Curtidas medem apenas o esforço; KPIs medem o lucro bruto exclusivamente.",
                    "Curtidas são dados qualitativos; KPIs são opiniões da liderança."
                ],
                answer: "Curtidas são métricas de vaidade; KPIs são indicadores vitais ligados aos objetivos estratégicos do negócio."
            },
            {
                id: 14,
                instruction: "Cálculo do ROI de Inovação",
                scenario: "Um novo serviço economizou R$ 500 mil em operações, e o custo da equipe de pesquisa (P&D) foi de R$ 100 mil.",
                text: "Qual variável deve ser cruzada para calcular o Retorno sobre Investimento (ROI) dessa inovação?",
                options: [
                    "Receita ou Economia gerada versus o Custo de P&D.",
                    "Faturamento bruto da empresa versus quantidade de funcionários.",
                    "Custo do servidor versus horas extras da equipe técnica.",
                    "Número de ideias geradas versus patentes registradas."
                ],
                answer: "Receita ou Economia gerada versus o Custo de P&D."
            },
            {
                id: 15,
                instruction: "Coleta de Ideias",
                scenario: "A equipe notou que a 'caixa de sugestões física' no corredor da empresa está sempre vazia e esquecida.",
                text: "Para melhorar a taxa de geração de ideias, qual é a prática recomendada de implementação?",
                options: [
                    "Utilizar plataformas de gestão de inovação (AEVO, SoftExpert) ou funis estruturados (Trello).",
                    "Obrigar cada funcionário a depositar um papel por mês na caixa física.",
                    "Descontinuar a captação de ideias e focar no alto escalão executivo.",
                    "Deixar que o RH entreviste as pessoas anualmente sobre inovações."
                ],
                answer: "Utilizar plataformas de gestão de inovação (AEVO, SoftExpert) ou funis estruturados (Trello)."
            },
            {
                id: 16,
                instruction: "Time to Market (TTM)",
                scenario: "A empresa A demorou 3 anos para lançar um produto perfeito. A empresa B lançou uma versão viável em 6 meses e dominou o mercado.",
                text: "O que o indicador de 'Tempo de Lançamento no Mercado' mede exatamente?",
                options: [
                    "A velocidade desde a ideação do conceito até a sua disponibilidade comercial efetiva (primeira nota fiscal).",
                    "O tempo gasto exclusivamente pelos desenvolvedores escrevendo o código.",
                    "A quantidade de horas investidas no treinamento da equipe de vendas.",
                    "O tempo de vida útil do produto antes de se tornar obsoleto."
                ],
                answer: "A velocidade desde a ideação do conceito até a sua disponibilidade comercial efetiva (primeira nota fiscal)."
            },
            {
                id: 17,
                instruction: "Medindo o Sucesso com o Cliente",
                scenario: "A tecnologia foi lançada e funciona sem bugs, mas precisamos saber se ela resolve uma dor real e gera lealdade.",
                text: "Qual métrica avalia se o usuário recomendaria a solução?",
                options: [
                    "Índice de Satisfação do Cliente (NPS).",
                    "Lead Time do Produto.",
                    "Taxa de Conversão de Ideias.",
                    "Retorno sobre o Investimento (ROI)."
                ],
                answer: "Índice de Satisfação do Cliente (NPS)."
            },
            {
                id: 18,
                instruction: "Cálculo do NPS",
                scenario: "Após uma semana de uso, a equipe dispara a pesquisa: 'De 0 a 10, o quanto recomendaria nossa solução?'.",
                text: "Como é calculado o resultado prático do NPS?",
                options: [
                    "% de Promotores (notas 9 e 10) menos % de Detratores (notas 0 a 6).",
                    "A média simples de todas as notas recebidas.",
                    "% de Promotores somado ao % de Neutros.",
                    "Número total de respostas multiplicado por 10."
                ],
                answer: "% de Promotores (notas 9 e 10) menos % de Detratores (notas 0 a 6)."
            },
            {
                id: 19,
                instruction: "Indicadores Organizacionais vs. Sociais",
                scenario: "Uma startup de impacto quer medir o aumento do conhecimento técnico dos jovens de baixa renda que usam seu app educativo.",
                text: "Em qual categoria se enquadra a métrica de 'Índice de empregabilidade STEM'?",
                options: [
                    "Indicadores Sociais, focados na externalidade positiva sistêmica.",
                    "Indicadores Organizacionais, focados em market share.",
                    "Indicadores de Entrada, medindo apenas o investimento inicial.",
                    "Métricas de Vaidade de curto prazo."
                ],
                answer: "Indicadores Sociais, focados na externalidade positiva sistêmica."
            },
            {
                id: 20,
                instruction: "Estudo de Caso: Embrapa",
                scenario: "Diferente de uma corporação privada que avalia lucro trimestral, a Embrapa mede seu sucesso transformando biomas improdutivos.",
                text: "Qual é o foco principal dos indicadores de inovação de uma entidade governamental/social como a Embrapa?",
                options: [
                    "Gerar externalidade positiva sistêmica, como segurança alimentar global.",
                    "Maximizar a distribuição de dividendos aos acionistas na Bolsa.",
                    "Diminuir o seu próprio quadro de funcionários públicos.",
                    "Aumentar o ROI imediato em até 6 meses."
                ],
                answer: "Gerar externalidade positiva sistêmica, como segurança alimentar global."
            },
            {
                id: 21,
                instruction: "Input vs. Output",
                scenario: "A diretoria relata que investiu 5% do faturamento em P&D e a equipe fez 100 horas de treinamento em inovação.",
                text: "Esses dados são considerados qual tipo de indicador?",
                options: [
                    "Indicadores de Entrada (Input), que medem o esforço e os recursos injetados.",
                    "Indicadores de Saída (Output), que comprovam a tração no mercado.",
                    "Métricas Sociais de Empregabilidade.",
                    "Indicadores de Atraso (Lagging Indicators)."
                ],
                answer: "Indicadores de Entrada (Input), que medem o esforço e os recursos injetados."
            },
            {
                id: 22,
                instruction: "Indicadores de Resultado (Output)",
                scenario: "Ao apresentar o balanço de fim de ano, o Gerente de Inovação demonstra que houve redução real de custos e 5 novas patentes depositadas.",
                text: "Na categorização do esforço, essas conquistas refletem os indicadores de:",
                options: [
                    "Saída (Output), que representam a tração real gerada pelo esforço.",
                    "Entrada (Input), focados apenas na injeção de capital.",
                    "Vaidade, por não envolverem lucro direto imediato.",
                    "Ecossistema, pois dependem 100% de startups terceirizadas."
                ],
                answer: "Saída (Output), que representam a tração real gerada pelo esforço."
            },
            {
                id: 23,
                instruction: "Estrutura do Pitch",
                scenario: "Você tem o tempo de uma viagem de elevador (2 minutos) para convencer o CEO a aprovar seu projeto de inovação.",
                text: "Quais são os 3 elementos fundamentais de um Pitch Estratégico?",
                options: [
                    "O Contexto/Problema, A Solução (Métricas) e O Impacto para a decisão.",
                    "O Cronograma, O Código Fonte e O Currículo da Equipe.",
                    "A Tecnologia, O Preço da Concorrência e A Planilha de Riscos.",
                    "A História da Empresa, O Faturamento Anual e A Ferramenta utilizada."
                ],
                answer: "O Contexto/Problema, A Solução (Métricas) e O Impacto para a decisão."
            },
            {
                id: 24,
                instruction: "Objetivo do Pitch",
                scenario: "Um engenheiro começa seu pitch detalhando a linguagem de programação e o modelo de nuvem que será utilizado na nova plataforma.",
                text: "Onde está o erro principal em relação ao objetivo do pitch?",
                options: [
                    "O foco deve ser despertar interesse evidenciando o valor, não apenas os detalhes técnicos.",
                    "Ele deveria ter explicado a estrutura de banco de dados primeiro.",
                    "Pitches devem focar em apontar defeitos nos produtos concorrentes.",
                    "O engenheiro deveria usar pelo menos 30 minutos, não 2."
                ],
                answer: "O foco deve ser despertar interesse evidenciando o valor, não apenas os detalhes técnicos."
            },
            {
                id: 25,
                instruction: "Dinâmica: Supermercado Inteligente",
                scenario: "Aprovou-se um projeto de loja sem caixas (Amazon Go style). O comitê precisa provar para a diretoria em 6 meses que o modelo funciona.",
                text: "Qual seria um exemplo válido de Indicador de Saída (Output) para este caso prático?",
                options: [
                    "Redução real dos custos com folha de pagamento e redução do tempo de fila.",
                    "Número de horas investidas desenvolvendo o software das catracas.",
                    "Dinheiro injetado no orçamento inicial do laboratório.",
                    "Quantidade de desenvolvedores alocados na equipe de implantação."
                ],
                answer: "Redução real dos custos com folha de pagamento e redução do tempo de fila."
            },

            // --- Bloco 3: Ferramentas de Gestão da Inovação (15 questões) ---
            {
                id: 26,
                instruction: "Análise Estratégica: Matriz FOFA",
                scenario: "A equipe vai iniciar o diagnóstico do ecossistema de inovação. Eles levantam as patentes exclusivas que possuem e os sistemas rígidos legados.",
                text: "Na Matriz SWOT (FOFA), esses pontos são classificados respectivamente como:",
                options: [
                    "Forças (Positivo) e Fraquezas (Negativo) do Ambiente Interno.",
                    "Oportunidades e Ameaças do Ambiente Externo.",
                    "Forças Externas e Ameaças Internas.",
                    "Ameaças e Fraquezas do Ambiente Externo."
                ],
                answer: "Forças (Positivo) e Fraquezas (Negativo) do Ambiente Interno."
            },
            {
                id: 27,
                instruction: "Estratégia de Alavancagem",
                scenario: "A empresa possui um banco de dados de clientes robusto (Força) e nota uma mudança drástica no hábito do consumidor querendo serviços digitais rápidos (Oportunidade).",
                text: "O que o cruzamento dessas variáveis (Força + Oportunidade) gera?",
                options: [
                    "Uma estratégia de Alavancagem, sendo um terreno fértil para inovações radicais.",
                    "Uma estratégia de Defesa, para criar barreiras contra a concorrência.",
                    "Uma inovação de Sobrevivência para evitar a falência imediata.",
                    "Uma iniciativa de Melhoria, usando inovação aberta para suprir falhas."
                ],
                answer: "Uma estratégia de Alavancagem, sendo um terreno fértil para inovações radicais."
            },
            {
                id: 28,
                instruction: "Estratégia de Melhoria",
                scenario: "O departamento de TI é muito lento e burocrático (Fraqueza), mas existem startups de IA disruptivas no mercado dispostas a fazer parcerias (Oportunidade).",
                text: "Qual é a ação recomendada ao cruzar Fraqueza com Oportunidade?",
                options: [
                    "Buscar parcerias de Inovação Aberta para suprir a lentidão interna (Melhoria).",
                    "Usar o caixa da empresa para aniquilar as startups (Defesa).",
                    "Vender a empresa antes que as startups dominem o setor (Sobrevivência).",
                    "Ignorar o mercado e tentar criar um processo ágil internamente sem ajuda."
                ],
                answer: "Buscar parcerias de Inovação Aberta para suprir a lentidão interna (Melhoria)."
            },
            {
                id: 29,
                instruction: "Infraestrutura: Octógono da Inovação",
                scenario: "A empresa está mapeando seus alicerces para inovar de forma sistêmica, observando o que a alta gestão diz e faz no dia a dia em relação a assumir riscos.",
                text: "A qual das 8 dimensões do Octógono da Inovação isso se refere?",
                options: [
                    "Cultura e Liderança.",
                    "Funding (Financiamento).",
                    "Processos estruturados.",
                    "Relacionamentos e Parcerias."
                ],
                answer: "Cultura e Liderança."
            },
            {
                id: 30,
                instruction: "Octógono: Funding",
                scenario: "Uma equipe teve uma ideia revolucionária, possui a cultura correta e o processo desenhado, mas o projeto não avança porque o orçamento para testes foi negado.",
                text: "Qual dimensão do Octógono falhou neste cenário?",
                options: [
                    "Funding (Financiamento).",
                    "Estratégia e Direcionamento.",
                    "Estrutura e Organograma.",
                    "Pessoas e Retenção de talentos."
                ],
                answer: "Funding (Financiamento)."
            },
            {
                id: 31,
                instruction: "Mapeamento: Radar da Inovação",
                scenario: "A diretoria achava que inovar era apenas inventar um produto novo, mas o time apresentou o Radar da Kellogg Business School.",
                text: "Segundo o Radar, em quantas dimensões uma empresa pode inovar, englobando O Que, Quem, Como e Onde?",
                options: [
                    "Em 12 dimensões.",
                    "Em apenas 4 dimensões básicas.",
                    "Em 8 dimensões sistêmicas.",
                    "Apenas no produto e no preço."
                ],
                answer: "Em 12 dimensões."
            },
            {
                id: 32,
                instruction: "Radar da Inovação: O COMO",
                scenario: "A fábrica redesenhou seu layout produtivo e a integração da cadeia de fornecedores, reduzindo o desperdício em 30%.",
                text: "Essa inovação foca no 'COMO operamos'. Quais dimensões do Radar foram ativadas?",
                options: [
                    "Processos, Organização e Cadeia de Fornecimento.",
                    "Oferta, Plataforma e Soluções.",
                    "Clientes, Experiência e Captura de Valor.",
                    "Presença, Relacionamentos e Marca."
                ],
                answer: "Processos, Organização e Cadeia de Fornecimento."
            },
            {
                id: 33,
                instruction: "Processo: Cadeia de Valor da Inovação",
                scenario: "A equipe capturou insights internos e externos e agora vai agrupar essas perspectivas para montar o conceito bruto do projeto.",
                text: "Quais são as duas primeiras fases da Cadeia de Valor da Inovação da Innoscience?",
                options: [
                    "Idealização e Conceituação.",
                    "Experimentação e Implementação.",
                    "Validação de MVP e Escala Comercial.",
                    "Brainstorming e ROI."
                ],
                answer: "Idealização e Conceituação."
            },
            {
                id: 34,
                instruction: "Experimentação e Prototipagem",
                scenario: "O conceito da solução está pronto, mas envolve muitas incertezas de mercado. A equipe vai fazer um projeto piloto.",
                text: "Qual é o objetivo principal da fase de Experimentação?",
                options: [
                    "Aprender rápido, falhar barato e sanar incertezas (tentativa e erro).",
                    "Lançar o produto final perfeitamente acabado e sem bugs.",
                    "Garantir patentes internacionais definitivas.",
                    "Captar ideias cruas por meio de uma caixa de sugestões."
                ],
                answer: "Aprender rápido, falhar barato e sanar incertezas (tentativa e erro)."
            },
            {
                id: 35,
                instruction: "Gestão de Portfólio",
                scenario: "A empresa possui 10 projetos ativos: alguns de baixo risco melhorando a operação atual e dois projetos disruptivos de alto risco.",
                text: "Por que não apostar todos os recursos apenas na ideia mais disruptiva?",
                options: [
                    "Para garantir equilíbrio, gerenciando o risco de mercado e tecnologia no portfólio.",
                    "Porque inovações disruptivas nunca geram retorno financeiro.",
                    "Porque a legislação impede que empresas tentem mais de uma inovação radical por vez.",
                    "Para agradar a todos os departamentos da empresa por igual."
                ],
                answer: "Para garantir equilíbrio, gerenciando o risco de mercado e tecnologia no portfólio."
            },
            {
                id: 36,
                instruction: "Innovation Scorecard (ISC)",
                scenario: "Para mensurar todo o panorama da inovação, a liderança utiliza o ISC desdobrado em 4 perspectivas integradas.",
                text: "Quais são as 4 perspectivas de causa e efeito abordadas pelo ISC?",
                options: [
                    "Contexto, Processo, Tipos e Resultados.",
                    "Cultura, Vendas, Marketing e Suporte.",
                    "Idealização, Financiamento, Produto e Patente.",
                    "SWOT, Octógono, Radar e Kanban."
                ],
                answer: "Contexto, Processo, Tipos e Resultados."
            },
            {
                id: 37,
                instruction: "Ferramentas de Geração (Front-End)",
                scenario: "No estágio inicial, a equipe precisa gerar insights sem filtros e focar na dor real do usuário.",
                text: "Quais ferramentas são recomendadas para essa etapa de captura e geração?",
                options: [
                    "Brainstorming, SCAMPER e Design Thinking.",
                    "Business Model Canvas e Indicadores Financeiros.",
                    "Análise de Balanço e Lean Startup.",
                    "Microsoft Project e Gestão de Portfólio."
                ],
                answer: "Brainstorming, SCAMPER e Design Thinking."
            },
            {
                id: 38,
                instruction: "Ferramentas de Desenvolvimento",
                scenario: "A ideia foi selecionada e o time precisa validar hipóteses no mercado utilizando protótipos enxutos e cocriação com parceiros.",
                text: "Quais ferramentas de Aprimoramento e Desenvolvimento devem ser utilizadas?",
                options: [
                    "Lean Startup (validação contínua), Business Model Canvas e Inovação Aberta.",
                    "Brainstorming solitário e planejamento rígido de 5 anos.",
                    "Caixa de sugestões anônima e matriz SWOT focada apenas no interno.",
                    "Método Waterfall (cascata) aguardando o produto ficar perfeito."
                ],
                answer: "Lean Startup (validação contínua), Business Model Canvas e Inovação Aberta."
            },
            {
                id: 39,
                instruction: "DNA do Inovador: Descoberta",
                scenario: "O líder do projeto está constantemente questionando o status quo, buscando entender o 'job to be done' e conectando áreas distintas.",
                text: "De acordo com o perfil comportamental, ele está aplicando quais competências?",
                options: [
                    "Competências de Descoberta (Questionar, Observar, Trabalhar em rede, Associar).",
                    "Competências de Execução (Analisar, Planejar, Atenção a detalhes).",
                    "Competências burocráticas de microgerenciamento.",
                    "Competências financeiras de redução de custos."
                ],
                answer: "Competências de Descoberta (Questionar, Observar, Trabalhar em rede, Associar)."
            },
            {
                id: 40,
                instruction: "DNA do Inovador: Execução",
                scenario: "Após a fase criativa, o gerente assume para tomar decisões baseadas em dados, garantindo cronogramas rigorosos e entregas detalhadas.",
                text: "Quais competências ele precisa evidenciar para tornar a ideia realidade?",
                options: [
                    "Competências de Execução (Analisar, Planejar, Atenção aos detalhes, Autodisciplina).",
                    "Competências de Descoberta, quebando todas as regras existentes.",
                    "Competências de idealização passiva.",
                    "Competências de terceirização do esforço operacional."
                ],
                answer: "Competências de Execução (Analisar, Planejar, Atenção aos detalhes, Autodisciplina)."
            }
        ]);

        // =========================================================================
        // Algoritmo seguro de Embaralhamento (Fisher-Yates)
        // =========================================================================
        const shuffleArray = (array) => {
            const newArray = [...array]; 
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        // Aplica o embaralhamento para todas as questões ao iniciar
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
            await typeWriter(`Carregando Estudo de Caso Prático ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Avaliação analítica concluída. Processando resultados para certificação PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Raciocínio de inovação validado com sucesso.";
                addLog("Sucesso: Análise precisa do cenário.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta embasada no material era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha: Análise de diagnóstico incorreta.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Tente analisar os dados do caso novamente. Tentativas restantes: ${maxAttempts - attempts.value}`;
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
            
            let performanceMsg = "Excelente domínio sobre Gestão da Inovação, KPIs e Ferramentas Estratégicas.";
            if (score.value < 28) performanceMsg = "Recomenda-se revisão aprofundada dos frameworks (Radar, Octógono e Matrizes) e KPIs apresentados.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho em Gestão da Inovação</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação Estratégica Baseada em Casos Reais</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento comprova a submissão a ${questions.value.length} cenários práticos exigindo diagnóstico ativo em Intraempreendedorismo, Mensuração de KPIs, Matrizes (FOFA, Radar, Octógono) e Cadeia de Valor da Inovação.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Resultado Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 32 ? '#10B981' : (score.value >= 24 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Parecer Pedagógico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Validação Automática - Simulador de Avaliação Ativa
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Certificacao_Inovacao_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador estratégico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador de Gestão da Inovação v3.0...", "log-info");
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