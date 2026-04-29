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
        
        // BANCO DE QUESTÕES: UX/UI e IHC
        const questionsDb = {
            1: {
                practical: [
                    { context: "Criação de Interface", text: "Você está criando um Style Guide para uma marca com o arquétipo 'O Sábio'. Qual conjunto de escolhas visuais é mais coerente?", options: ["Vermelho vibrante e botões assimétricos", "Azul escuro, design minimalista e tipografia limpa", "Tons pastéis, bordas arredondadas e linguagem acolhedora", "Preto e dourado com simetria rigorosa"], answer: "Azul escuro, design minimalista e tipografia limpa", explanation: "O arquétipo do Sábio foca em lógica, dados e verdade, refletindo em cores sóbrias (azul escuro, cinza) e design clean." },
                    { context: "Decisão de UI", text: "Ao projetar o Frontend para uma marca 'Criador' (ex: Adobe, Apple), qual característica visual deve ser priorizada?", options: ["Ausência de espaços em branco", "Paletas inusitadas, layouts assimétricos e microinterações fluidas", "Foco apenas em hierarquia visual austera", "Uso excessivo de alertas vermelhos"], answer: "Paletas inusitadas, layouts assimétricos e microinterações fluidas", explanation: "O Criador busca inovação e expressão, o que se traduz em design state-of-the-art e alto uso de 'white space'." },
                    { context: "Avaliação de Interface", text: "Um app de plano de saúde aplica cores vibrantes e linguagem agressiva/desafiadora. Segundo a Cebola Semiótica, o que ocorre aqui?", options: ["Alinhamento perfeito com o arquétipo do Cuidador", "Dissonância cognitiva, pois o UI não reflete a essência do nicho", "Aplicação correta de Design Emocional", "Aumento imediato de usabilidade"], answer: "Dissonância cognitiva, pois o UI não reflete a essência do nicho", explanation: "Planos de saúde costumam se alinhar ao 'Cuidador' (proteção). Cores agressivas (Herói/Rebelde) geram desconexão com a proposta de valor." },
                    { context: "Design Tokens", text: "Como o Frontend garante que um botão 'Cuidador' não vire um botão 'Governante' por erro na equipe técnica?", options: ["Codificando Design Systems e Design Tokens no Frontend", "Deixando as cores aleatórias", "Removendo o CSS do projeto", "Apenas entregando telas estáticas no Figma sem especificações"], answer: "Codificando Design Systems e Design Tokens no Frontend", explanation: "Design Tokens (variáveis globais) garantem que a identidade visual (Style Guide) seja aplicada de forma coesa e escalável no código." }
                ],
                conceptual: [
                    { context: "Teoria", text: "Segundo a Cebola Semiótica, qual é a camada mais externa (aquela que os usuários veem e interagem primeiro)?", options: ["Essência", "Arquétipos", "Rituais e UX", "Símbolos & UI (Frontend)"], answer: "Símbolos & UI (Frontend)", explanation: "O Frontend e a UI operam na camada externa (Símbolos), que devem sempre refletir o núcleo (Essência)." },
                    { context: "Teoria", text: "Quem propôs a existência de 12 Arquétipos universais no inconsciente coletivo?", options: ["Don Norman", "Jakob Nielsen", "Carl Jung", "Scapin e Bastien"], answer: "Carl Jung", explanation: "Carl Jung propôs os 12 Arquétipos que representam motivações humanas básicas (ex: Sábio, Rebelde, Criador)." },
                    { context: "Conceito", text: "Na construção da marca, a coerência visual garante que a interface:", options: ["Seja idêntica à de todos os concorrentes", "Não pareça 'falsa' ou desconectada da proposta de valor (essência)", "Use sempre fontes serifadas", "Ignore o neuromarketing"], answer: "Não pareça 'falsa' ou desconectada da proposta de valor (essência)", explanation: "Se as decisões das camadas externas não irradiarem do núcleo, a interface gera dissonância cognitiva." },
                    { context: "Psicologia", text: "No Neuromarketing, a psicologia das cores serve primariamente para:", options: ["Apenas deixar o site mais bonito", "Aumentar o tamanho do banco de dados", "Guiar a atenção (heurística) e provocar respostas neuroquímicas/instintivas", "Dificultar a leitura do usuário"], answer: "Guiar a atenção (heurística) e provocar respostas neuroquímicas/instintivas", explanation: "Cores não são apenas estética; elas gerenciam a carga cognitiva e ativam instintos emocionais." }
                ]
            },
            2: {
                practical: [
                    { context: "Reação do Usuário", text: "Durante um teste, o usuário suspira e diz 'Não entendi por que isso está aqui'. Em qual nível de processamento de Norman ocorreu a frustração principal?", options: ["Visceral", "Comportamental", "Reflexivo", "Semântico"], answer: "Comportamental", explanation: "O nível Comportamental foca no uso, desempenho e eficácia. Dificuldades no fluxo geram frustração comportamental." },
                    { context: "Primeira Impressão", text: "O usuário abre o app e imediatamente diz 'Uau, que layout lindo!'. Esse é um exemplo de impacto em qual nível?", options: ["Reflexivo", "Visceral", "Comportamental", "Acessibilidade"], answer: "Visceral", explanation: "O nível Visceral refere-se à reação imediata, instintiva e de aparência física do produto." },
                    { context: "Mapa da Empatia", text: "Ao observar um usuário com dificuldade visual devido a desordem na tela, em qual quadrante do Mapa da Empatia isso é anotado primariamente?", options: ["O que ele FAZ?", "O que ele OUVE?", "O que ele VÊ?", "O que ele FALA?"], answer: "O que ele VÊ?", explanation: "O excesso de poluição visual é um estímulo processado pelo que o usuário VÊ, gerando ansiedade visceral." },
                    { context: "Microcopy", text: "Para reduzir a ansiedade de espera, você adiciona um texto divertido na tela de carregamento. Isso é uma técnica de:", options: ["Benchmarking estrutural", "Design Emocional com uso de Feedback e Personalidade", "Avaliação Heurística de Flexibilidade", "Design de Banco de Dados"], answer: "Design Emocional com uso de Feedback e Personalidade", explanation: "Micro-textos com a personalidade da Persona e feedback de carregamento ajudam a humanizar a interface e aliviar a ansiedade (nível visceral/comportamental)." }
                ],
                conceptual: [
                    { context: "Teoria de Norman", text: "Quais são os Três Níveis do Design Emocional propostos por Don Norman?", options: ["Básico, Intermediário e Avançado", "Visceral, Comportamental e Reflexivo", "Frontend, Backend e Banco de Dados", "Cores, Tipografia e Grids"], answer: "Visceral, Comportamental e Reflexivo", explanation: "Estes são os três níveis de processamento cerebral propostos por Don Norman." },
                    { context: "Definição", text: "O que o nível 'Reflexivo' do Design Emocional busca atingir?", options: ["A autoimagem, significado e satisfação a longo prazo do usuário", "Apenas a velocidade de carregamento da página", "A paleta de cores primárias", "A eliminação de erros 404"], answer: "A autoimagem, significado e satisfação a longo prazo do usuário", explanation: "É o nível mais alto, lidando com memória, status e como o produto faz a pessoa se sentir sobre si mesma." },
                    { context: "Ferramenta", text: "Qual ferramenta fornece os insumos (Dores, Necessidades, Visão) para projetar as emoções corretas no Design Emocional?", options: ["Wireframe de Alta Fidelidade", "Mapa de Empatia", "CSS Variables", "Card Sorting"], answer: "Mapa de Empatia", explanation: "O Mapa de Empatia mapeia o que o usuário pensa, sente, vê, ouve e faz." },
                    { context: "Conceito", text: "Um indicador de deleite no nível Comportamental é quando o usuário:", options: ["Desiste de usar o produto", "Clica sem hesitar porque o visual comunica claramente a função", "Fecha o navegador", "Apenas elogia as cores"], answer: "Clica sem hesitar porque o visual comunica claramente a função", explanation: "Se a interface orienta perfeitamente a ação sem atrito, o usuário sente a sensação de controle e eficácia." }
                ]
            },
            3: {
                practical: [
                    { context: "Inclusão Visual", text: "Para usuários no espectro autista (TEA), qual prática de design deve ser preferida?", options: ["Áudios com autoplay e banners piscando", "Uso de cores agressivas e temporizadores curtos", "Cores suaves (off-white), linguagem literal e ambientes consistentes", "Uso exclusivo de jargões complexos"], answer: "Cores suaves (off-white), linguagem literal e ambientes consistentes", explanation: "Para evitar sobrecarga sensorial, o design para neurodivergentes deve ser claro, literal e ter baixo ofuscamento." },
                    { context: "Design Inclusivo", text: "Ao estruturar um site em HTML, um desenvolvedor decide não usar as tags semânticas (nav, button, h1) e faz tudo com 'div'. Quem será mais prejudicado?", options: ["Usuários com visão perfeita", "O gerente de marketing", "Pessoas com deficiência visual que usam Leitores de Tela", "Ninguém"], answer: "Pessoas com deficiência visual que usam Leitores de Tela", explanation: "Leitores de Tela (como VoiceOver e NVDA) dependem estritamente da semântica do código para navegar pela página de forma audível." },
                    { context: "Avaliação Prática", text: "Avaliando a usabilidade e acessibilidade de formulários: o desenvolvedor usa apenas o 'placeholder' que some ao digitar, sem rótulos (labels) externos. Isso é um erro de:", options: ["Benchmarking", "Checklist Heurístico Inclusivo e Memória Curta (TDAH)", "Design Emocional Visceral", "Arquitetura da Informação Plana"], answer: "Checklist Heurístico Inclusivo e Memória Curta (TDAH)", explanation: "Sem rótulos visíveis, usuários com déficit de atenção ou cognitivo esquecem o que o campo exigia assim que começam a digitar." },
                    { context: "Acessibilidade Visual", text: "Você deve definir o contraste entre o texto do botão e seu fundo. Qual é a taxa mínima exigida pela WCAG (nível AA) para textos normais?", options: ["2:1", "4.5:1", "10:1", "1:1"], answer: "4.5:1", explanation: "A relação de luminosidade mínima para garantir leitura sem esforço é de 4.5:1 (texto normal) ou 3:1 (textos grandes)." }
                ],
                conceptual: [
                    { context: "Diferença", text: "Qual a principal diferença entre Design Universal e Design Inclusivo?", options: ["São exatamente a mesma coisa", "Universal é adaptação tardia; Inclusivo foca em excluir pessoas", "Universal foca em solução única para todos desde o início; Inclusivo considera a diversidade como processo", "Ambos ignoram pessoas sem deficiências"], answer: "Universal foca em solução única para todos desde o início; Inclusivo considera a diversidade como processo", explanation: "Design Universal cria um único produto que sirva a todos; Inclusivo foca nas pessoas e em eliminar barreiras específicas." },
                    { context: "Conceito Central", text: "Acessibilidade trata primeiramente de:", options: ["Remoção de barreiras de acesso independente de deficiências (Acesso)", "Beleza visual do sistema", "Aumentar a venda do produto a qualquer custo", "Reduzir o tempo de desenvolvimento"], answer: "Remoção de barreiras de acesso independente de deficiências (Acesso)", explanation: "Acessibilidade (Pode entrar?) garante o acesso sem barreiras, enquanto Usabilidade foca em quão fácil é usar depois que entrou." },
                    { context: "Dislexia", text: "Na adequação para usuários com dislexia, qual prática deve ser adotada?", options: ["Paredes de texto longas", "Fontes com serifa densas", "Alinhamento justificado forçado", "Fontes sem serifa, alinhamento à esquerda e quebra visual de parágrafos"], answer: "Fontes sem serifa, alinhamento à esquerda e quebra visual de parágrafos", explanation: "Padrões de texto densos e serifas dificultam a decodificação da palavra para o cérebro do usuário." },
                    { context: "Princípios WCAG", text: "Quais são as 4 metas principais (POUR) da acessibilidade web?", options: ["Perceptível, Operável, Compreensível, Robusto", "Perfeito, Otimizado, Útil, Rápido", "Personalizado, Orientado, Único, Responsivo", "Prático, Original, Usável, Real"], answer: "Perceptível, Operável, Compreensível, Robusto", explanation: "Estes são os quatro princípios fundamentais das Diretrizes de Acessibilidade para Conteúdo Web (WCAG)." }
                ]
            },
            4: {
                practical: [
                    { context: "Lei de Hick", text: "Um e-commerce possui 30 categorias no menu principal e as vendas estão baixas. Qual Lei de UX explica a dificuldade de uso?", options: ["Lei de Fitts", "Efeito de Von Restorff", "Lei de Hick", "Lei de Jakob"], answer: "Lei de Hick", explanation: "A Lei de Hick diz que o tempo para tomar uma decisão aumenta conforme o número e complexidade das opções disponíveis." },
                    { context: "Lei de Fitts", text: "Ao projetar a interface para um aplicativo mobile, você coloca o botão de 'Finalizar Compra' bem pequeno no canto superior esquerdo. Qual lei está sendo violada?", options: ["Lei de Jakob", "Lei de Fitts", "Lei de Hick", "Design Reflexivo"], answer: "Lei de Fitts", explanation: "A Lei de Fitts determina que alvos de cliques devem ser grandes e estar perto do alcance principal (neste caso, o polegar do usuário, parte inferior)." },
                    { context: "Cores e Ação", text: "Para o botão de 'Call to Action' (Assinar agora) num site todo azul, você decide usar a cor Laranja. Qual o princípio aplicado?", options: ["Efeito de Von Restorff (Contraste)", "Arquitetura da Informação", "Lei de Fitts", "Pesquisa com Usuários"], answer: "Efeito de Von Restorff (Contraste)", explanation: "O Efeito de Von Restorff diz que o elemento que difere dos demais (pelo uso de cor complementar) é mais provável de ser lembrado e clicado." },
                    { context: "Gerenciamento", text: "Qual ferramenta visual ajuda a equipe a gerenciar as etapas de UX (Discovery, Design, Review, Handoff)?", options: ["Card Sorting", "Kanban", "Design Tokens", "Wireframe Lo-Fi"], answer: "Kanban", explanation: "O Kanban é uma metodologia ágil visual ideal para organizar as demandas e fluxos de trabalho." }
                ],
                conceptual: [
                    { context: "Teoria UX", text: "A Visão 360º de um produto em UX equilibra três pilares essenciais. Quais são?", options: ["Beleza, Velocidade e Preço", "HTML, CSS e JavaScript", "Necessidades do Usuário (Desirability), Objetivos de Negócio (Viability) e Restrições Tecnológicas (Feasibility)", "Fontes, Cores e Imagens"], answer: "Necessidades do Usuário (Desirability), Objetivos de Negócio (Viability) e Restrições Tecnológicas (Feasibility)", explanation: "O profissional UX garante que o produto não é apenas desejável para o usuário, mas viável tecnicamente e lucrativo para a empresa." },
                    { context: "Lei de Jakob", text: "O que a Lei de Jakob recomenda aos designers?", options: ["Criar tudo do zero para ser inovador", "Usar fontes gigantes sempre", "Aproveitar os modelos mentais, pois usuários preferem que seu site funcione como os sites que eles já conhecem", "Esconder os botões principais"], answer: "Aproveitar os modelos mentais, pois usuários preferem que seu site funcione como os sites que eles já conhecem", explanation: "Não devemos reinventar a roda na navegação básica, pois o usuário passa a maior parte do tempo em outros sites." },
                    { context: "Disciplina", text: "Qual disciplina dentro do 'Guarda-chuva UX' é responsável por definir como o sistema reage às ações do usuário e transições lógicas?", options: ["Estratégia de Conteúdo", "Design Visual (UI)", "Arquitetura da Informação", "Design de Interação (IxD)"], answer: "Design de Interação (IxD)", explanation: "O IxD cuida do comportamento da interface frente às ações humanas (microinterações, fluxos)." },
                    { context: "Ferramenta", text: "O que são 'Proto-Personas'?", options: ["Personas finais aprovadas pelo CEO", "Versões preliminares de perfis de usuários criadas baseadas em suposições da equipe", "Protótipos de alta fidelidade programados", "Uma técnica de acessibilidade"], answer: "Versões preliminares de perfis de usuários criadas baseadas em suposições da equipe", explanation: "Elas orientam o time no início do projeto até serem validadas por pesquisas reais." }
                ]
            },
            5: {
                practical: [
                    { context: "Heurísticas na Prática", text: "Um usuário digita o CEP e o sistema retorna 'Erro código 1045x'. Qual heurística de Nielsen foi violada?", options: ["Liberdade do usuário", "Estética minimalista", "Ajude os usuários a reconhecerem, diagnosticarem e se recuperarem de erros", "Consistência"], answer: "Ajude os usuários a reconhecerem, diagnosticarem e se recuperarem de erros", explanation: "Mensagens de erro devem ser humanas, claras, evitar jargões técnicos e sugerir a correção." },
                    { context: "Prevenção", text: "Em vez de deixar o usuário digitar uma data em formato livre e errar, o sistema exibe um calendário em pop-up (Datepicker). Isso é um exemplo de:", options: ["Visibilidade do status", "Prevenção de Erros", "Carga Cognitiva", "Benchmarking"], answer: "Prevenção de Erros", explanation: "O designer projetou o sistema para eliminar a condição do erro antes que ele ocorra (Nielsen 5)." },
                    { context: "Navegação", text: "Durante o teste, o usuário se perde em subpáginas de um e-commerce e não sabe voltar. Qual heurística de Scapin e Bastien resolve isso?", options: ["Orientação (Ex: Breadcrumbs)", "Controle explícito", "Gestão de Erros", "Significado dos códigos"], answer: "Orientação (Ex: Breadcrumbs)", explanation: "O usuário deve sempre saber onde está, de onde veio e para onde pode ir (Nielsen: Visibilidade do Status)." },
                    { context: "Aplicação", text: "Um site usa um ícone de disquete para salvar, mesmo que disquetes não sejam mais usados no mundo físico. Por que isso funciona?", options: ["Heurística de Correspondência com o mundo real (Modelo Mental estabelecido)", "É um padrão estético", "Prevenção de Erros", "Para manter o site leve"], answer: "Heurística de Correspondência com o mundo real (Modelo Mental estabelecido)", explanation: "O ícone tornou-se uma convenção familiar ao usuário, conectando a interface ao modelo mental de salvar arquivos." }
                ],
                conceptual: [
                    { context: "Diferença Principal", text: "Qual a diferença entre Usabilidade e UX?", options: ["São sinônimos exatos", "UX é apenas cores; Usabilidade é código", "Usabilidade foca na métrica objetiva de facilidade de uso; UX é holística e foca em sentimentos, valor e emoções do usuário", "Usabilidade não importa para UX"], answer: "Usabilidade foca na métrica objetiva de facilidade de uso; UX é holística e foca em sentimentos, valor e emoções do usuário", explanation: "A usabilidade é sobre completar a tarefa de forma eficiente. UX abrange toda a experiência com a marca." },
                    { context: "Definição", text: "O que são Heurísticas de Usabilidade?", options: ["Códigos complexos de programação", "Regras gerais, princípios ou 'dicas' que ajudam a encontrar problemas sistêmicos sem precisar de usuários finais naquele momento", "Processos exclusivos para daltônicos", "Contratos de serviço de software"], answer: "Regras gerais, princípios ou 'dicas' que ajudam a encontrar problemas sistêmicos sem precisar de usuários finais naquele momento", explanation: "Funcionam como um checklist baseado em psicologia cognitiva (ex: Nielsen, Scapin e Bastien)." },
                    { context: "Processo", text: "Na condução de uma Avaliação Heurística, qual é o próximo passo após a Análise Individual dos especialistas?", options: ["Desenvolver o site", "Sessão de Consolidação (Debriefing) para agrupar e priorizar problemas", "Publicar o relatório final sem discutir", "Alterar o CSS"], answer: "Sessão de Consolidação (Debriefing) para agrupar e priorizar problemas", explanation: "Os avaliadores precisam se reunir para encontrar o consenso sobre a gravidade dos problemas encontrados individualmente." },
                    { context: "Cognição", text: "Em IHC, uma boa interface 'minimiza a carga cognitiva'. O que isso significa?", options: ["Deixa a tela carregada de textos", "Pede para o usuário usar calculadoras externas", "Evita que o usuário precise memorizar muitas informações usando o princípio do 'Reconhecimento, não Recordação'", "Aumenta as etapas do checkout"], answer: "Evita que o usuário precise memorizar muitas informações usando o princípio do 'Reconhecimento, não Recordação'", explanation: "Nosso cérebro se cansa rápido. Mostrar as opções (reconhecer) exige menos esforço do que pedir para lembrar (recordar)." }
                ]
            },
            6: {
                practical: [
                    { context: "Análise Competitiva", text: "Ao observar um site concorrente, você percebe que os clientes reclamam que precisam clicar 6 vezes para ver um produto. Como sua Al deve agir?", options: ["Copiar o fluxo de 6 cliques", "Ignorar os produtos", "Criar uma Hierarquia Plana (Flat), reduzindo os níveis de cliques para chegar à informação de valor", "Adicionar mais 2 cliques"], answer: "Criar uma Hierarquia Plana (Flat), reduzindo os níveis de cliques para chegar à informação de valor", explanation: "O benchmarking revela fraquezas no nicho, e a nova Arquitetura de Informação ataca diretamente esses gargalos." },
                    { context: "Sitemap", text: "Você usará 'Card Sorting' com os usuários do seu projeto para estruturar o site. Qual o principal objetivo prático desta ação?", options: ["Definir a cor do botão", "Categorizar informações (AI) com base no modelo mental de quem realmente usa o site", "Encontrar bugs de código", "Testar a acessibilidade de tela"], answer: "Categorizar informações (AI) com base no modelo mental de quem realmente usa o site", explanation: "O Card Sorting mostra onde os usuários logicamente procurariam cada pedaço de informação no seu site." },
                    { context: "Wireframe Lo-Fi", text: "Qual a grande vantagem de construir Wireframes de Baixa Fidelidade antes de ir para o Design Visual (Alta Fidelidade)?", options: ["O cliente aprova a beleza do site logo no início", "Custa caro e demora, mas garante cores certas", "Permite focar apenas na funcionalidade, estruturação (AI) e iteração rápida/barata (Errar cedo)", "Ele já vem programado em HTML"], answer: "Permite focar apenas na funcionalidade, estruturação (AI) e iteração rápida/barata (Errar cedo)", explanation: "O foco no Lo-Fi não é beleza, é resolver o problema de interação e aplicar heurísticas antes que seja caro consertar." },
                    { context: "Exemplo do Clube de Futebol", text: "No estudo de caso do portal do clube, os caminhos para 'Ingressos' e 'Sócio-Torcedor' ganharam destaque hierárquico isolado. Por quê?", options: ["Porque as cores do clube são vermelhas", "Para aplicar a heurística de Flexibilidade e Eficiência de Uso, reduzindo cliques para as ações que geram receita (Negócio) e interesse (Usuário)", "Por acaso estrutural", "Para esconder notícias"], answer: "Para aplicar a heurística de Flexibilidade e Eficiência de Uso, reduzindo cliques para as ações que geram receita (Negócio) e interesse (Usuário)", explanation: "A Arquitetura refletiu diretamente os objetivos definidos na visão 360 (Viability + Desirability)." }
                ],
                conceptual: [
                    { context: "Definição de AI", text: "O que é Arquitetura da Informação (AI) dentro de UX?", options: ["Criar o logotipo da empresa", "Apenas a organização do código HTML/CSS", "A fundação estrutural responsável por organizar, rotular e navegar de forma clara pelo conteúdo do sistema", "Programar em Python e Vue"], answer: "A fundação estrutural responsável por organizar, rotular e navegar de forma clara pelo conteúdo do sistema", explanation: "A AI dá sentido ao volume de conteúdo, ajudando as pessoas a encontrar o que precisam de forma lógica." },
                    { context: "Objetivo do Benchmarking", text: "Qual o foco real do Benchmarking na fase de UX?", options: ["Plagiar o design do concorrente", "Identificar padrões mentais que o nicho já validou, mapeando forças a igualar e fraquezas a inovar", "Ver quais cores o concorrente usa para copiar no CSS", "Apenas descobrir o preço do serviço deles"], answer: "Identificar padrões mentais que o nicho já validou, mapeando forças a igualar e fraquezas a inovar", explanation: "Observar não é copiar; é criar uma base (baseline) de expectativa do usuário sobre como sistemas daquele nicho funcionam." },
                    { context: "Ciclo de Validação", text: "Por que validar heurísticas num Wireframe antes de passar para UI?", options: ["Para garantir que não haja erros de estrutura e interação antes de investir tempo no design de alta fidelidade", "Porque o UI designer não sabe aplicar heurísticas", "Para atrasar o projeto", "Para testar daltônicos"], answer: "Para garantir que não haja erros de estrutura e interação antes de investir tempo no design de alta fidelidade", explanation: "Uma falha de arquitetura custa muito caro para ser consertada se a interface visual já estiver toda desenhada e programada." },
                    { context: "Conexão", text: "O Wireframe serve primariamente para tangibilizar:", options: ["O banco de dados SQL", "A Arquitetura da Informação (AI) em componentes visuais na tela", "A essência da marca", "O neuro-marketing das cores"], answer: "A Arquitetura da Informação (AI) em componentes visuais na tela", explanation: "O Wireframe é a tradução esquelética das decisões tomadas no sitemap e no mapeamento de fluxos." }
                ]
            }
        };

        const getGroupName = (id) => {
            const names = [
                "Psicologia e Branding", 
                "Design Emocional", 
                "Usabilidade e Acessibilidade", 
                "Ecossistema e Leis de UX", 
                "IHC e Heurísticas", 
                "Benchmarking e Arquitetura (AI)"
            ];
            return names[id - 1] || `Módulo ${id}`;
        };

        const currentQuestionList = (tabParam) => {
            if (!selectedGroup.value || !questionsDb[selectedGroup.value]) return [];
            return questionsDb[selectedGroup.value][tabParam || currentTab.value] || [];
        };

        const currentQuestion = computed(() => {
            const list = currentQuestionList();
            if(!list || list.length === 0) return null;
            return list[currentQuestionIndex.value];
        });

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
                    feedback.value = { type: 'error', text: `Diagnóstico Incorreto. Analise o contexto e a teoria novamente.` };
                }
            }
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < currentQuestionList().length - 1) {
                indices.value[currentTab.value]++;
                resetTurn();
            } else {
                indices.value[currentTab.value]++; 
            }
        };

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
                filename:     `Relatorio_UXUI_IHC_G${selectedGroup.value}.pdf`,
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
            selectGroup, changeTab, answerQuestion, nextQuestion, currentQuestionList,
            newNodeText, nodes, edges, edgeStartNode,
            addCustomNode, deleteNode, startDragNode, selectNodeForEdge, getNode,
            exportPDF
        };
    }
}).mount('#app');