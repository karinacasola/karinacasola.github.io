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

        // --- Banco de Questões (As 100 Originais) ---
        const questions = ref([
            { id: 1, instruction: "Início do Design.", scenario: "Sua equipe foi encarregada de criar um novo sistema web para e-commerce.", text: "Segundo o material, onde começa o design de um sistema web?", options: ["Na escrita do código front-end", "Na definição das cores e tipografia (UI)", "Na compreensão do problema", "Na exportação de assets SVG"], answer: "Na compreensão do problema" },
            { id: 2, instruction: "Ecossistema Atual.", scenario: "Antes de esboçar as telas de um novo portal, o Product Manager pede uma pausa.", text: "O que precisamos entender antes de desenhar as telas?", options: ["O ecossistema atual (concorrentes)", "A linguagem de programação do backend", "As diretrizes do WCAG 2.1", "O modelo de banco de dados"], answer: "O ecossistema atual (concorrentes)" },
            { id: 3, instruction: "Função da Arquitetura de Informação.", scenario: "Após estudar os concorrentes, a equipe tem muitos dados soltos.", text: "Qual disciplina é responsável por organizar esse conhecimento?", options: ["Design Visual (UI)", "Arquitetura da Informação (AI)", "Engenharia de Software", "Design de Interação (IxD)"], answer: "Arquitetura da Informação (AI)" },
            { id: 4, instruction: "Tangibilização da AI.", scenario: "A Arquitetura da Informação já definiu os menus e categorias.", text: "Qual artefato tangibiliza a AI, guiado por heurísticas?", options: ["Mapa da Empatia", "Benchmarking", "Wireframe", "Sitemap"], answer: "Wireframe" },
            { id: 5, instruction: "Objetivo do Benchmarking.", scenario: "A equipe vai analisar 3 sites concorrentes do mesmo nicho.", text: "Qual é o principal objetivo de analisar concorrentes?", options: ["Copiar o design deles", "Estabelecer uma linha de base", "Descobrir senhas de usuários", "Aumentar a Viability do projeto"], answer: "Estabelecer uma linha de base" },
            { id: 6, instruction: "Padrões Mentais.", scenario: "Ao olhar os concorrentes, notamos que todos usam um ícone de lupa para pesquisa.", text: "O que isso nos ajuda a identificar?", options: ["Padrões mentais que o usuário já possui", "Falhas de segurança", "Falta de criatividade", "A linguagem de programação usada"], answer: "Padrões mentais que o usuário já possui" },
            { id: 7, instruction: "Análise: Pontos Fortes.", scenario: "No benchmarking, você anota que os concorrentes possuem filtros de busca avançados muito bons.", text: "O que esses pontos fortes representam?", options: ["Funcionalidades que os usuários já esperam", "Oportunidades de inovação", "Heurísticas violadas", "Métricas de vaidade"], answer: "Funcionalidades que os usuários já esperam" },
            { id: 8, instruction: "Análise: Pontos Fracos.", scenario: "No site do concorrente, o checkout leva 10 minutos e exige muitos dados.", text: "Como o benchmarking classifica essa falha?", options: ["Como um padrão da indústria", "Como uma Oportunidade de Inovação", "Como uma boa prática de segurança", "Como uma limitação técnica inevitável"], answer: "Como uma Oportunidade de Inovação" },
            { id: 9, instruction: "Fluxo de Benchmarking - Passo 1.", scenario: "Você vai iniciar a análise competitiva do projeto.", text: "Segundo o fluxo estratégico, qual é a primeira etapa?", options: ["Mapear Fluxos Críticos", "Selecionar Concorrentes", "Forças x Fraquezas", "Insights para a Nova AI"], answer: "Selecionar Concorrentes" },
            { id: 10, instruction: "Fluxo de Benchmarking - Passo 2.", scenario: "Os 3 concorrentes já foram selecionados.", text: "Qual é o próximo passo no fluxo de benchmarking?", options: ["Desenhar Wireframes", "Mapear Fluxos Críticos", "Testar com Usuários", "Definir a Paleta de Cores"], answer: "Mapear Fluxos Críticos" },
            { id: 11, instruction: "Decisão Estratégica.", scenario: "Os fluxos foram mapeados e as Forças x Fraquezas analisadas.", text: "O que essa decisão estratégica gera como resultado final no fluxo?", options: ["Insights para a Nova AI", "Código fonte", "Exportação SVG", "Slogan do Produto"], answer: "Insights para a Nova AI" },
            { id: 12, instruction: "Definição de AI.", scenario: "O cliente pergunta o que exatamente é a Arquitetura da Informação.", text: "Como o material define a AI?", options: ["A camada visual e estética do site", "A fundação estrutural responsável por organizar e rotular o conteúdo", "A linguagem backend utilizada", "O servidor de hospedagem"], answer: "A fundação estrutural responsável por organizar e rotular o conteúdo" },
            { id: 13, instruction: "Vocabulário Comum.", scenario: "Você está em dúvida se nomeia o botão de 'Carrinho' ou 'Sacola de Compras'.", text: "O que a estratégia de AI recomenda?", options: ["Usar termos técnicos", "Usar termos que o nicho já validou (Vocabulário Comum)", "Inventar um nome novo para inovar", "Deixar sem texto, apenas com ícone abstrato"], answer: "Usar termos que o nicho já validou (Vocabulário Comum)" },
            { id: 14, instruction: "Hierarquia Plana.", scenario: "Um usuário precisa dar 7 cliques para achar a política de devolução.", text: "Qual conceito de AI resolve esse gargalo?", options: ["Vocabulário Comum", "Wireframe de Alta Fidelidade", "Hierarquia Plana (Reduzir quantidade de cliques)", "Uso de cores complementares"], answer: "Hierarquia Plana (Reduzir quantidade de cliques)" },
            { id: 15, instruction: "Estrutura do Sitemap.", scenario: "Na criação do Sitemap da loja, a seção 'Sobre Nós' deve ser alocada.", text: "Geralmente, de onde a seção 'Sobre Nós' deriva diretamente?", options: ["De Produtos", "De Suporte", "Da Home Page", "Do Detalhe do Item"], answer: "Da Home Page" },
            { id: 16, instruction: "Essência do Wireframe.", scenario: "A AI está pronta. Agora você vai criar o wireframe.", text: "Qual é o foco principal do wireframe?", options: ["Estética e cores", "Tipografia avançada", "Funcionalidade e posicionamento dos elementos", "Animações e transições"], answer: "Funcionalidade e posicionamento dos elementos" },
            { id: 17, instruction: "O que o Wireframe ignora.", scenario: "O cliente reclamou que o wireframe está 'feio e sem cores'.", text: "O que você responde com base na teoria?", options: ["Que o wireframe não se preocupa com estética, apenas funcionalidade", "Que vai adicionar as cores imediatamente", "Que as cores dependem do backend", "Que o wireframe é a versão final do site"], answer: "Que o wireframe não se preocupa com estética, apenas funcionalidade" },
            { id: 18, instruction: "Heurísticas no Wireframe.", scenario: "Você desenha 'breadcrumbs' (migalhas de pão) no wireframe.", text: "Qual heurística de Nielsen isso aplica?", options: ["Prevenção de erros", "Consistência", "Visibilidade do Status", "Estética e Minimalismo"], answer: "Visibilidade do Status" },
            { id: 19, instruction: "Prevenção de Erros na AI/Wireframe.", scenario: "Ao esboçar um formulário, você adiciona um aviso de formato exigido ao lado do campo.", text: "Isso reflete qual heurística aplicada ao wireframe?", options: ["Visibilidade do Status", "Prevenção de Erros", "Liberdade do usuário", "Correspondência com o mundo real"], answer: "Prevenção de Erros" },
            { id: 20, instruction: "Consistência no Wireframe.", scenario: "Em todas as telas do wireframe, o menu principal está no topo.", text: "Qual princípio de usabilidade está sendo garantido?", options: ["Controle explícito", "Flexibilidade", "Consistência", "Gestão de Erros"], answer: "Consistência" },
            { id: 21, instruction: "Ciclo de Validação.", scenario: "O wireframe de baixa fidelidade não passou na validação heurística.", text: "Segundo o diagrama de evolução, qual é a consequência?", options: ["Ir direto para o Wireframe de Alta Fidelidade", "Fazer Ajuste de Fluxo e retornar ao Wireframe de Baixa Fidelidade", "Abandonar o projeto", "Avançar para a programação"], answer: "Fazer Ajuste de Fluxo e retornar ao Wireframe de Baixa Fidelidade" },
            { id: 22, instruction: "Economia de Recursos.", scenario: "O gerente questiona por que demorar validando wireframes de baixa fidelidade.", text: "Qual a justificativa apontada no material?", options: ["Para deixar o design mais bonito", "Garantir que falhas na AI sejam corrigidas antes do UI, economizando recursos da equipe", "É uma exigência do WCAG", "Para aumentar a carga cognitiva"], answer: "Garantir que falhas na AI sejam corrigidas antes do UI, economizando recursos da equipe" },
            { id: 23, instruction: "Estudo de Caso: Clube de Futebol.", scenario: "Você está fazendo a AI de um time esportivo.", text: "A arquitetura da informação deve refletir as prioridades de quem?", options: ["Apenas do usuário (torcedor)", "Apenas do negócio (arrecadação)", "Do usuário (torcedor) e do negócio (arrecadação)", "Apenas dos patrocinadores"], answer: "Do usuário (torcedor) e do negócio (arrecadação)" },
            { id: 24, instruction: "Foco do Benchmarking (Futebol).", scenario: "Analisando sites de clubes rivais, a equipe de UX nota um padrão.", text: "Qual o foco do benchmarking neste nicho específico?", options: ["Conversão rápida e engajamento", "Design minimalista extremo", "Cores frias predominantes", "Ocultar a história do clube"], answer: "Conversão rápida e engajamento" },
            { id: 25, instruction: "Sitemap: Futebol.", scenario: "Onde o link de 'Calendário' de jogos deve ser posicionado no Sitemap do clube?", text: "Sob qual categoria principal ele fica?", options: ["Torcedor & Receita", "Institucional", "Futebol", "Notícias"], answer: "Futebol" },
            { id: 26, instruction: "Destaque Estrutural.", scenario: "No portal do clube, 'Ingressos' e 'Sócio-Torcedor' são nós de decisão visíveis rapidamente.", text: "Qual heurística motiva esse destaque estrutural?", options: ["Flexibilidade e Eficiência de Uso", "Prevenção de Erros", "Consistência", "Reconhecimento"], answer: "Flexibilidade e Eficiência de Uso" },
            { id: 27, instruction: "Redução de Cliques.", scenario: "O botão de 'Sócio-Torcedor' está acessível com um clique a partir da Home.", text: "Qual era o objetivo dessa decisão estrutural?", options: ["Esconder o conteúdo", "Reduzir a quantidade de cliques para ações críticas", "Aumentar a carga cognitiva", "Testar a paciência do torcedor"], answer: "Reduzir a quantidade de cliques para ações críticas" },
            { id: 28, instruction: "Sitemap: Institucional.", scenario: "A diretoria quer garantir que a 'História' do clube seja encontrada.", text: "Em qual ramificação principal da AI se encontra?", options: ["Institucional", "Futebol", "Torcedor & Receita", "Home Page solta"], answer: "Institucional" },
            { id: 29, instruction: "Interseção de Sucesso.", scenario: "Revisando a introdução, um produto de sucesso nasce de uma interseção.", text: "Quais são os dois elementos dessa interseção?", options: ["Necessidades do usuário e viabilidade técnica", "Cores vibrantes e fontes modernas", "Código limpo e hospedagem cara", "Heurísticas e Gestão de Backlog"], answer: "Necessidades do usuário e viabilidade técnica" },
            { id: 30, instruction: "Próximos Passos.", scenario: "O wireframe foi aprovado e o ciclo de validação concluído.", text: "Para qual etapa o projeto segue agora?", options: ["Design de Interface (UI) e Arquitetura de Software", "Voltar ao Benchmarking", "Entrevistas Não Estruturadas", "Criação de Proto-Personas"], answer: "Design de Interface (UI) e Arquitetura de Software" },
            { id: 31, instruction: "Conceito de Style Guide.", scenario: "O time de marketing e desenvolvimento estão criando interfaces muito diferentes entre si.", text: "O que é um Style Guide?", options: ["Um documento que reúne padrões visuais predefinidos", "Um repositório de banco de dados", "Um manual de redação de e-mails", "Um guia de como programar em React"], answer: "Um documento que reúne padrões visuais predefinidos" },
            { id: 32, instruction: "Elementos do Style Guide.", scenario: "Você precisa documentar o Style Guide da empresa.", text: "Quais elementos geralmente estão incluídos nele?", options: ["Cores, fontes, botões, componentes, ícones e imagens", "Senhas, logins, tokens e chaves de API", "Sitemaps, mapas de empatia e personas", "Apenas a paleta de cores"], answer: "Cores, fontes, botões, componentes, ícones e imagens" },
            { id: 33, instruction: "Importância do Style Guide.", scenario: "O cliente perguntou por que devemos investir tempo construindo um Style Guide.", text: "Qual das opções abaixo é um dos principais benefícios?", options: ["Substitui a necessidade de programadores", "Garante consistência e uma identidade visual coesa", "Aumenta o tamanho final do arquivo", "Impede o uso de imagens no site"], answer: "Garante consistência e uma identidade visual coesa" },
            { id: 34, instruction: "Agilidade no Design.", scenario: "A equipe precisa criar 5 novas telas rapidamente.", text: "Como o Style Guide impacta esse processo?", options: ["Acelera o desenvolvimento, mantendo a coesão visual", "Atrasa o projeto por ter muitas regras", "Não tem impacto na velocidade de criação", "Exige aprovação externa para cada tela"], answer: "Acelera o desenvolvimento, mantendo a coesão visual" },
            { id: 35, instruction: "Style Guide x Design System.", scenario: "O gerente pediu um Style Guide, mas o designer sugeriu um Design System.", text: "Qual a diferença de foco do Style Guide?", options: ["Foca exclusivamente no modelo de negócios", "Foca nos elementos visuais (cores, fontes, componentes)", "Foca na identidade da marca e propósitos", "Foca em regras de back-end"], answer: "Foca nos elementos visuais (cores, fontes, componentes)" },
            { id: 36, instruction: "Escopo do Design System.", scenario: "A empresa optou por construir um Design System abrangente.", text: "O que o Design System inclui a mais que um Style Guide?", options: ["Apenas ícones extras", "Identidade da marca, propósitos, valores e princípios de design", "Servidores e infraestrutura", "Apenas a logo da empresa"], answer: "Identidade da marca, propósitos, valores e princípios de design" },
            { id: 37, instruction: "Quando usar Style Guide.", scenario: "Sua agência vai fazer um site institucional rápido e pessoal.", text: "Neste cenário de projeto curto, qual ferramenta é recomendada?", options: ["Style Guide", "Design System complexo", "Nenhuma documentação", "Apenas um sitemap"], answer: "Style Guide" },
            { id: 38, instruction: "Quando usar Design System.", scenario: "Sua empresa tem múltiplos produtos digitais e times distribuídos grandes.", text: "O que deve ser adotado para escalar e gerenciar isso?", options: ["Um Style Guide simples", "Apenas wireframes", "Um Design System", "Deixar sem padrões para dar liberdade criativa"], answer: "Um Design System" },
            { id: 39, instruction: "Teoria das Cores: Primárias.", scenario: "Você está montando a base da paleta de cores.", text: "Como o guia define as cores primárias (Amarelo, Azul e Vermelho)?", options: ["São cores derivadas das terciárias", "São a essência de tudo, das quais todas as outras derivam", "São cores misturadas com branco", "São os tons de cinza do sistema"], answer: "São a essência de tudo, das quais todas as outras derivam" },
            { id: 40, instruction: "Teoria das Cores: Secundárias.", scenario: "Você precisa criar um botão Laranja.", text: "A cor Laranja (mistura de Amarelo e Vermelho) é classificada como:", options: ["Terciária", "Monocromática", "Secundária", "Primária"], answer: "Secundária" },
            { id: 41, instruction: "Teoria das Cores: Terciárias.", scenario: "O design exige cores mais específicas e complexas.", text: "Como as cores terciárias são formadas?", options: ["Pela ausência total de cor", "A partir da combinação das cores primárias e secundárias", "Apenas misturando azul e vermelho", "Adicionando preto a uma cor primária"], answer: "A partir da combinação das cores primárias e secundárias" },
            { id: 42, instruction: "Harmonia Monocromática.", scenario: "O cliente quer um site elegante usando apenas a cor Azul.", text: "A harmonia formada por uma única cor em diferentes tons é chamada de:", options: ["Complementar", "Triádica", "Monocromática", "Análoga"], answer: "Monocromática" },
            { id: 43, instruction: "Harmonia Análoga.", scenario: "O design usa Verde e Azul-esverdeado para criar calma.", text: "Cores que estão lado a lado no círculo cromático formam uma harmonia:", options: ["Complementar Dividida", "Análoga", "Primária", "Triádica"], answer: "Análoga" },
            { id: 44, instruction: "Harmonia Complementar.", scenario: "Você quer máximo contraste visual em um banner.", text: "Qual harmonia usa duas cores localizadas em pontos opostos no círculo?", options: ["Análoga", "Monocromática", "Complementar", "Complementar Dividida"], answer: "Complementar" },
            { id: 45, instruction: "Harmonia Triádica.", scenario: "Para um app infantil, você quer 3 cores bem distribuídas.", text: "Como são escolhidas as cores na harmonia Triádica?", options: ["Uma cor e suas vizinhas", "Três tons da mesma cor", "Três cores escolhidas de forma equidistante no círculo", "Apenas cores frias"], answer: "Três cores escolhidas de forma equidistante no círculo" },
            { id: 46, instruction: "Harmonia Complementar Dividida.", scenario: "Você achou a harmonia complementar muito agressiva.", text: "O que caracteriza a Complementar Dividida?", options: ["Usa uma cor e as duas 'vizinhas' da sua complementar", "Usa apenas tons de cinza", "Usa três cores vizinhas", "Usa as três cores primárias apenas"], answer: "Usa uma cor e as duas 'vizinhas' da sua complementar" },
            { id: 47, instruction: "Regra das Proporções.", scenario: "Você está definindo como distribuir as cores na interface para criar equilíbrio.", text: "Qual diretriz eficaz o material recomenda?", options: ["Regra 50-50", "Regra 80-20", "Regra 60-30-10", "Uso igual de todas as cores"], answer: "Regra 60-30-10" },
            { id: 48, instruction: "Regra 60-30-10: 60%.", scenario: "Ao aplicar a regra das proporções, você tem um tom de cinza claro.", text: "A cor base (60%) é destinada principalmente a:", options: ["Fundos e componentes neutros", "Botões de conversão", "Cor da marca principal", "Apenas mensagens de erro"], answer: "Fundos e componentes neutros" },
            { id: 49, instruction: "Regra 60-30-10: 30%.", scenario: "O Azul forte é a identidade da empresa.", text: "Na regra 60-30-10, onde a Cor Predominante (30%) é geralmente aplicada?", options: ["No fundo do site inteiro", "Em textos, títulos, cards e botões padrão", "Apenas em modais", "Nunca deve ser usada em botões"], answer: "Em textos, títulos, cards e botões padrão" },
            { id: 50, instruction: "Regra 60-30-10: 10%.", scenario: "Há um botão de 'Assinar Agora' que exige destaque máximo.", text: "A Cor de Destaque (10%) deve ser usada em:", options: ["Botões de conversão ou elementos que precisam chamar a atenção", "No fundo de toda a página", "Em textos de parágrafos longos", "Nos rodapés do site"], answer: "Botões de conversão ou elementos que precisam chamar a atenção" },
            { id: 51, instruction: "Typeface vs Fonte.", scenario: "O desenvolvedor pergunta qual 'Typeface' usar no projeto.", text: "Qual a definição correta de Tipo de Fonte (Typeface)?", options: ["O design ou a 'família' de caracteres (ex: Arial)", "A variação de peso, como Negrito", "O tamanho exato do texto (16px)", "O espaçamento entre as letras"], answer: "O design ou a 'família' de caracteres (ex: Arial)" },
            { id: 52, instruction: "Definição de Fonte (Font).", scenario: "O Style Guide especifica 'Epilogue Bold 12pt'.", text: "O que esse termo completo representa?", options: ["Uma regra de margem", "Um Tipo de Fonte genérico", "A implementação específica (variação) de um tipo de fonte", "Um componente de formulário"], answer: "A implementação específica (variação) de um tipo de fonte" },
            { id: 53, instruction: "Hierarquia de Fontes.", scenario: "O usuário não consegue identificar qual texto é o título e qual é o corpo.", text: "O que é Hierarquia de Fontes?", options: ["A organização visual de elementos de texto para guiar o olhar", "O uso de letras maiúsculas em todo o texto", "Esconder textos secundários", "A ordem alfabética do conteúdo"], answer: "A organização visual de elementos de texto para guiar o olhar" },
            { id: 54, instruction: "Elementos da Hierarquia: H1.", scenario: "Você está criando a página de um artigo no blog.", text: "Para que serve o Título Principal (Heading 1)?", options: ["Para textos longos", "Geralmente o maior texto, apresenta o tópico principal", "Para legendas de imagens", "Para os links do rodapé"], answer: "Geralmente o maior texto, apresenta o tópico principal" },
            { id: 55, instruction: "Elementos da Hierarquia: H2/H3.", scenario: "O artigo é longo e precisa ser dividido em partes menores.", text: "Qual a função dos Subtítulos (Heading 2, Heading 3)?", options: ["Organizar o conteúdo em seções e facilitar a leitura dinâmica", "Substituir o título principal", "Agir como botões de compra", "Esconder informações do usuário"], answer: "Organizar o conteúdo em seções e facilitar a leitura dinâmica" },
            { id: 56, instruction: "Elementos da Hierarquia: Body.", scenario: "Você tem um bloco de texto descrevendo o produto.", text: "O Corpo do Texto (Body) deve ter qual característica principal?", options: ["Ser escrito em itálico", "Ser o maior elemento da tela", "Deve ser fácil de ler em grandes blocos", "Usar cores fosforescentes"], answer: "Deve ser fácil de ler em grandes blocos" },
            { id: 57, instruction: "Criando Hierarquia: Tamanho.", scenario: "Você quer destacar um texto importante.", text: "Como o tamanho afeta a hierarquia?", options: ["Não afeta a hierarquia", "Elementos menores são sempre mais importantes", "Elementos maiores são mais importantes e visíveis", "Todos os textos devem ter o mesmo tamanho"], answer: "Elementos maiores são mais importantes e visíveis" },
            { id: 58, instruction: "Criando Hierarquia: Peso.", scenario: "Dois textos têm o mesmo tamanho, mas um é um alerta vital.", text: "Qual atributo você pode alterar para dar hierarquia?", options: ["Alterar o Peso (Bold ou Light)", "Mudar a linguagem para inglês", "Remover o texto", "Alinhar à direita"], answer: "Alterar o Peso (Bold ou Light)" },
            { id: 59, instruction: "Tipos de Fontes: Serifa.", scenario: "Você está diagramando um livro impresso clássico.", text: "Qual a característica das fontes com Serifa (Serif)?", options: ["Transmitem modernidade e não têm traços extras", "Têm pequenas linhas no final das hastes e transmitem formalidade", "São exclusivas para programação", "São sempre coloridas"], answer: "Têm pequenas linhas no final das hastes e transmitem formalidade" },
            { id: 60, instruction: "Tipos de Fontes: Sans-serif.", scenario: "O cliente quer um app com visual moderno, limpo e minimalista.", text: "Qual estilo tipográfico é ideal para telas digitais e interfaces?", options: ["Fontes Sem Serifa (Sans-serif)", "Fontes com Serifa (Serif)", "Fontes cursivas", "Fontes góticas"], answer: "Fontes Sem Serifa (Sans-serif)" },
            { id: 61, instruction: "Categorização: Button e Caption.", scenario: "Abaixo da foto de um produto, há um pequeno texto descritivo.", text: "Como é chamado o texto utilizado para legendas?", options: ["Heading 1", "Body", "Caption (Legendas)", "Button (Texto do botão)"], answer: "Caption (Legendas)" },
            { id: 62, instruction: "Uso de Imagens.", scenario: "O time discutia se deveriam usar apenas textos para otimizar velocidade.", text: "Por que o Guia recomenda o uso de imagens e ilustrações?", options: ["Apenas para enfeitar o site", "Porque 70% de nossos receptores sensoriais estão nos olhos, facilitando a compreensão", "Porque o Google exige", "Porque texto não pode ser lido em celulares"], answer: "Porque 70% de nossos receptores sensoriais estão nos olhos, facilitando a compreensão" },
            { id: 63, instruction: "Poder das Ilustrações.", scenario: "O produto será acessado por pessoas de diferentes culturas e idiomas.", text: "Como as ilustrações ajudam nesse caso?", options: ["Transmitem ideias de forma universal, tornando-as mais inclusivas", "Traduzem os textos automaticamente", "Aumentam a barreira de entrada", "Ocultam o conteúdo textual"], answer: "Transmitem ideias de forma universal, tornando-as mais inclusivas" },
            { id: 64, instruction: "Objetivo dos Ícones.", scenario: "Em vez de escrever 'Página Inicial', você usou um ícone de casa.", text: "Por que os ícones são importantes na interface?", options: ["Porque aumentam a curva de aprendizado", "Criam familiaridade e facilitam a identificação de objetos", "Apenas para deixar o layout mais complexo", "Para evitar traduções no back-end"], answer: "Criam familiaridade e facilitam a identificação de objetos" },
            { id: 65, instruction: "O que são Grids.", scenario: "O conteúdo do site parece desalinhado e sem estrutura.", text: "Qual o principal objetivo do uso de Grids?", options: ["Auxiliar na ordenação, distribuição e alinhamento de elementos", "Colorir as imagens automaticamente", "Comprimir o código CSS", "Criar animações nas transições de tela"], answer: "Auxiliar na ordenação, distribuição e alinhamento de elementos" },
            { id: 66, instruction: "Anatomia do Grid: Colunas.", scenario: "Ao montar o grid de 12 pontas, você desenhou faixas verticais na tela.", text: "Como são chamados os blocos verticais do layout no Grid?", options: ["Margens", "Linhas base", "Colunas", "Gutters"], answer: "Colunas" },
            { id: 67, instruction: "Anatomia do Grid: Gutter.", scenario: "Para que dois cards de conteúdo não fiquem colados, há um espaço vazio entre eles no grid.", text: "O que é o Gutter?", options: ["A borda externa da tela", "O espaço entre as colunas", "O componente de botão", "A fonte utilizada no título"], answer: "O espaço entre as colunas" },
            { id: 68, instruction: "Anatomia do Grid: Margens.", scenario: "Você precisa deixar um respiro nas extremidades do monitor.", text: "Como se chamam os espaços laterais entre a borda da tela e o conteúdo?", options: ["Margens", "Colunas", "Gutters", "Frames"], answer: "Margens" },
            { id: 69, instruction: "Tipos de Botões: Primário.", scenario: "A tela tem um botão 'Salvar e Continuar'.", text: "Como o botão da ação mais importante deve ser estilizado?", options: ["Como botão secundário", "Com estado inativo", "Como Botão Primário (o de maior destaque na interface)", "Apenas com ícones pequenos"], answer: "Como Botão Primário (o de maior destaque na interface)" },
            { id: 70, instruction: "Tipos de Botões: Secundário.", scenario: "Junto ao botão 'Salvar', existe um botão 'Cancelar operação'.", text: "Qual deve ser a abordagem visual para o botão 'Cancelar'?", options: ["Ter o mesmo destaque do primário", "Como Botão Secundário (com menos destaque visual)", "Ficar invisível", "Ser o maior elemento da tela"], answer: "Como Botão Secundário (com menos destaque visual)" },
            { id: 71, instruction: "Estados do Botão: Default.", scenario: "Você está criando a documentação do botão de login.", text: "Qual estado descreve o botão na sua forma normal, antes de qualquer interação?", options: ["Hover", "Disabled", "Default (Normal)", "Pressed"], answer: "Default (Normal)" },
            { id: 72, instruction: "Estados do Botão: Hover.", scenario: "O usuário passa o mouse por cima do link de 'Saiba Mais'.", text: "Qual é o nome do estado quando o cursor do mouse está sobre o botão?", options: ["Hover", "Focus", "Pressed", "Default"], answer: "Hover" },
            { id: 73, instruction: "Estados do Botão: Pressed.", scenario: "O usuário clica e segura o mouse em um CTA.", text: "O estado que ocorre no exato momento em que o botão é clicado é o:", options: ["Disabled", "Hover", "Pressed (Pressionado)", "Focus"], answer: "Pressed (Pressionado)" },
            { id: 74, instruction: "Estados do Botão: Focus.", scenario: "Um usuário navega no formulário apenas usando a tecla Tab do teclado.", text: "Qual estado geralmente destaca o elemento com uma luz ou contorno ao redor?", options: ["Default", "Pressed", "Focus (Foco)", "Disabled"], answer: "Focus (Foco)" },
            { id: 75, instruction: "Estados do Botão: Disabled.", scenario: "Um botão está cinza claro e não permite clique porque faltam preencher campos.", text: "Este botão encontra-se no estado:", options: ["Hover", "Disabled (Inativo)", "Focus", "Pressed"], answer: "Disabled (Inativo)" },
            { id: 76, instruction: "Componentes: Inputfields.", scenario: "O usuário precisa digitar seu e-mail para acessar a conta.", text: "Como são chamados os campos de entrada de texto?", options: ["Navbars", "Botões Secundários", "Inputfields", "Switches"], answer: "Inputfields" },
            { id: 77, instruction: "Componentes: Labels.", scenario: "Acima da caixa em branco do formulário, há o texto 'Nome Completo'.", text: "Como são chamados os textos fora do campo que indicam a informação exigida?", options: ["Placeholders", "Rótulos (Labels)", "Switches", "Gutters"], answer: "Rótulos (Labels)" },
            { id: 78, instruction: "Componentes: Placeholder.", scenario: "Dentro do input, há uma dica clara 'ex: maria@email.com' que some ao digitar.", text: "Esse texto de dica interna é conhecido como:", options: ["Label", "Botão", "Placeholder", "Navbar"], answer: "Placeholder" },
            { id: 79, instruction: "Componentes: Switch.", scenario: "Nas configurações, o usuário deseja ativar o 'Modo Escuro'.", text: "Qual componente é utilizado para alternar entre duas opções (ligado/desligado)?", options: ["Inputfield", "Placeholder", "Switch", "Sitemap"], answer: "Switch" },
            { id: 80, instruction: "Componentes: Navbar.", scenario: "O site possui um menu fixo na parte superior com links para várias páginas.", text: "Como é chamada essa área de navegação superior?", options: ["Footer", "Navbar", "Sidebar", "Gutter"], answer: "Navbar" },
            { id: 81, instruction: "Introdução ao Figma.", scenario: "O novo funcionário não sabe qual software a equipe usa para UI.", text: "O que é o Figma?", options: ["Um editor de planilhas", "Uma ferramenta de design de UI/UX totalmente baseada na web", "Uma linguagem de programação back-end", "Um banco de dados em nuvem"], answer: "Uma ferramenta de design de UI/UX totalmente baseada na web" },
            { id: 82, instruction: "Vantagem: Baseado na Web.", scenario: "O designer freelance usa Windows e a agência usa Mac.", text: "Por que o Figma é vantajoso nesse cenário?", options: ["Não requer instalação de software, sendo acessível diretamente pelo navegador", "Converte o Windows para Mac", "Funciona apenas offline", "Exige a compra de licenças físicas por máquina"], answer: "Não requer instalação de software, sendo acessível diretamente pelo navegador" },
            { id: 83, instruction: "Figma: Colaboração em Tempo Real.", scenario: "Três designers precisam trabalhar na mesma tela de login de urgência.", text: "Qual recurso do Figma permite isso?", options: ["Prototipagem avançada", "Comunidade e Plugins", "Colaboração em Tempo Real (Multiplayer)", "Acessibilidade Universal"], answer: "Colaboração em Tempo Real (Multiplayer)" },
            { id: 84, instruction: "Figma: Acessibilidade Universal.", scenario: "O diretor da empresa quer apenas visualizar o projeto rapidamente no seu tablet.", text: "O que elimina o problema de sistemas operacionais no Figma?", options: ["A instalação de drivers USB", "A acessibilidade universal através de qualquer navegador web", "O uso de pendrives", "A necessidade de baixar um app pesado de 5GB"], answer: "A acessibilidade universal através de qualquer navegador web" },
            { id: 85, instruction: "Figma: Prototipagem Avançada.", scenario: "O time de testes quer simular a navegação do usuário antes do código estar pronto.", text: "Qual funcionalidade o Figma oferece para isso?", options: ["Apenas wireframes estáticos em baixa fidelidade", "Exportação automática de código C++", "Prototipagem avançada, criando fluxos interativos", "Geração de textos automáticos"], answer: "Prototipagem avançada, criando fluxos interativos" },
            { id: 86, instruction: "Figma: Handoff Simplificado.", scenario: "O design foi aprovado e agora vai para a equipe de desenvolvimento Front-end.", text: "Como o Figma otimiza a transição do Design para o Desenvolvimento?", options: ["Ocultando os layouts da engenharia", "Enviando e-mails manuais para a equipe", "Gerando automaticamente especificações de design e código CSS/iOS/Android", "Imprimindo telas em formato A3"], answer: "Gerando automaticamente especificações de design e código CSS/iOS/Android" },
            { id: 87, instruction: "Figma: Comunidade e Plugins.", scenario: "Você precisa colocar ícones no projeto, mas não quer desenhar todos um por um.", text: "Qual recurso do Figma acelera esse fluxo de trabalho?", options: ["A Prototipagem", "A vasta biblioteca de templates e plugins da Figma Community", "O Dev Mode", "A ferramenta de Texto"], answer: "A vasta biblioteca de templates e plugins da Figma Community" },
            { id: 88, instruction: "Estratégia UX: Alinhamento.", scenario: "Antes de iniciar os protótipos, o UX designer estuda os dados e KPIs.", text: "O que a Estratégia de UX procura alinhar?", options: ["A visão do produto com a experiência entregue, baseada em dados", "Apenas a estética visual do site", "O tipo de hospedagem na AWS", "O orçamento da equipe de marketing"], answer: "A visão do produto com a experiência entregue, baseada em dados" },
            { id: 89, instruction: "Estratégia UX: Valor para o Negócio.", scenario: "A diretoria questiona o impacto financeiro de focar em UX.", text: "Segundo o slide, qual o valor gerado para o Negócio?", options: ["Aumenta os custos com suporte", "Aumenta a conversão, reduz custos com suporte/retrabalho e fideliza", "Aumenta o tempo de carregamento da página", "Não gera valor para o negócio, apenas para o usuário"], answer: "Aumenta a conversão, reduz custos com suporte/retrabalho e fideliza" },
            { id: 90, instruction: "Estratégia UX: Valor para o Usuário.", scenario: "Ao justify uma nova funcionalidade, o PM pergunta o ganho do usuário.", text: "Qual o foco da Proposta de Valor em UX para o usuário?", options: ["Aumentar o atrito para mantê-lo mais tempo no site", "Deixar o site cheio de animações pesadas", "Resolve problemas reais, reduz atrito e economiza tempo", "Obrigar o preenchimento de mais formulários"], answer: "Resolve problemas reais, reduz atrito e economiza tempo" },
            { id: 91, instruction: "Figma: FigJam.", scenario: "A equipe precisa fazer um brainstorming ou criar fluxogramas simples.", text: "Que ferramenta do ecossistema do Figma faz isso?", options: ["Adobe XD", "FigJam", "Axure RP", "Sketch"], answer: "FigJam" },
            { id: 92, instruction: "Concorrentes: Sketch.", scenario: "A agência usava uma ferramenta que rodava apenas no Mac antes de migrar.", text: "Que pioneiro em design vetorial a aula cita, que perdeu mercado por ser restrito ao Mac?", options: ["Figma", "Penpot", "Sketch", "Adobe XD"], answer: "Sketch" },
            { id: 93, instruction: "Concorrentes: Adobe XD.", scenario: "A equipe usa o pacote Creative Cloud e usava a solução da Adobe para UI.", text: "Que ferramenta da Adobe perdeu tração no mercado para o Figma?", options: ["Adobe Illustrator", "Axure RP", "Penpot", "Adobe XD"], answer: "Adobe XD" },
            { id: 94, instruction: "Concorrentes: Penpot.", scenario: "A empresa possui uma política rigorosa e precisa hospedar o design em servidores próprios.", text: "Que alternativa Open Source é citada para esse caso?", options: ["Sketch", "Figma", "Penpot", "FigJam"], answer: "Penpot" },
            { id: 95, instruction: "Wireframes: O que são?", scenario: "O cliente está confuso vendo apenas caixas e blocos cinzas.", text: "Como você explica o conceito de wireframe a ele?", options: ["É a versão final com cores do produto", "É o banco de dados do site", "É o 'esqueleto' estrutural focado na Arquitetura da Informação", "É o código fonte HTML"], answer: "É o 'esqueleto' estrutural focado na Arquitetura da Informação" },
            { id: 96, instruction: "Wireframes: Atalho Text.", scenario: "Você deseja colocar o texto real no botão estrutural.", text: "Qual atalho do teclado no Figma adiciona rótulos de texto?", options: ["T", "R", "F", "Shift+A"], answer: "T" },
            { id: 97, instruction: "Importância de Handoff Fluido.", scenario: "No passado, as empresas sofriam com a passagem do design para a engenharia.", text: "Qual foi a grande conclusão sobre o Figma e o processo de Handoff?", options: ["Aumentou o atrito entre as áreas", "Unificou a comunicação entre Produto, Design e Engenharia, reduzindo atritos", "Separou as equipes de forma definitiva", "Eliminou a necessidade de desenvolvedores"], answer: "Unificou a comunicação entre Produto, Design e Engenharia, reduzindo atritos" },
            { id: 98, instruction: "Estratégia UX: Etapa 4.", scenario: "O produto foi desenhado, prototipado e agora está no ar.", text: "Segundo o ciclo de Estratégia UX, qual a etapa 4 (final que reinicia o ciclo)?", options: ["Descoberta e Pesquisa", "Estratégia e Definição", "Validação e Métricas", "Design e Prototipagem"], answer: "Validação e Métricas" },
            { id: 99, instruction: "Grids vs Design Responsivo.", scenario: "O site precisa se adaptar do celular para a TV.", text: "Como a definição de Grids ajuda nisso?", options: ["Eles congelam o site num único tamanho", "As colunas e gutters estruturam a adaptação matemática do layout", "Transformam o texto em imagem fixa", "Alteram as cores automaticamente"], answer: "As colunas e gutters estruturam a adaptação matemática do layout" },
            { id: 100, instruction: "O Figma como Padrão da Indústria.", scenario: "Um estudante pergunta qual ferramenta aprender para vagas de UI/UX.", text: "O que o material do curso conclui sobre a posição de mercado do Figma?", options: ["Tornou-se o padrão da indústria para design de UX/UI", "Está obsoleto frente ao Adobe XD", "Deve ser evitado por ser baseado em nuvem", "Serve apenas para ilustrações complexas"], answer: "Tornou-se o padrão da indústria para design de UX/UI" }
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
            await typeWriter(`Carregando Etapa de Projeto ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Auditoria concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Fluxo validado com sucesso.";
                addLog("Sucesso: Decisão arquitetural validada no projeto.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Decisão refutada na revisão de design.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Decisão Incorreta. Tente reavaliar a teoria. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Revisão necessária. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente entendimento de Arquitetura da Informação e Processos Web.";
            if (score.value < 70) performanceMsg = "Recomenda-se revisão sobre fundamentos de UX/UI.";
            
            // Alterado de roxo (#9c6bd4) para o azul da identidade visual do blog (#3e8eff)
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Certificado de Auditoria Web</h1>
                    <h2 style="color: #555; margin: 5px 0;">Avaliação: UX, Estratégia e Arquitetura</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Auditoria:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo processos de Estratégia, Arquitetura de Informação, Guias de Estilo e Ecossistema Figma.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 70 ? '#10B981' : (score.value >= 50 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo Módulo UX.ESCAPE 2
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `UX_Certificacao_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reconfigurando parâmetros do simulador Web...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador UX.ESCAPE 2...", "log-info");
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