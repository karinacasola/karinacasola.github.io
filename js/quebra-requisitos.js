const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            availableBlocks: [], 
            selectedBlocks: [],  
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            chances: 3,
            showSolution: false,
            currentSolutionDisplay: [],
            
            levels: [
                {
                    id: 1,
                    concept: "ERP Financeiro - Fechamento de Mês",
                    story: "Um banco precisa de um módulo para consolidação de contas. O fechamento envolve processar milhares de transações noturnas de forma segura e gerar o balanço.",
                    instruction: "Agrupe primeiro o bloco 'RF', seguido de suas ações. Depois, o bloco 'RN', seguido de suas restrições (Desempenho, Segurança, etc).",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Gerar relatório de balanço consolidado mensal' },
                        { id: 'f2', text: 'Conciliar as contas a pagar e receber automaticamente' },
                        { id: 'nf1', text: 'O processamento do lote noturno deve durar no máximo 2 horas' },
                        { id: 'nf2', text: 'As transações devem ser criptografadas (AES-256)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Sucesso! Você separou corretamente as ações do negócio das restrições de desempenho e segurança."
                },
                {
                    id: 2,
                    concept: "Sistema de Votação Eletrônica",
                    story: "Para uma eleição de classe, o sistema deve garantir que o voto seja secreto, apurado rapidamente e que apenas eleitores validados participem.",
                    instruction: "Coloque [RF] -> [Ações] -> [RN] -> [Qualidades/Restrições].",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Validar o CPF do eleitor na base de dados do sindicato' },
                        { id: 'f2', text: 'Permitir o registro do voto em um candidato' },
                        { id: 'nf1', text: 'O sistema deve estar disponível 99,99% do tempo durante a eleição' },
                        { id: 'nf2', text: 'Nenhum log do sistema pode associar o CPF ao candidato escolhido (Privacidade)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Excelente! Disponibilidade e Privacidade são requisitos não funcionais clássicos."
                },
                {
                    id: 3,
                    concept: "Aplicativo de Mobilidade Urbana",
                    story: "Um app concorrente ao Uber precisa ser ágil, traçar rotas e suportar picos de uso durante grandes eventos na cidade.",
                    instruction: "Coloque [RF] -> [Ações] -> [RN] -> [Qualidades/Restrições].",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Calcular o valor estimado da corrida com base na distância' },
                        { id: 'f2', text: 'Apresentar a localização do motorista em tempo real no mapa' },
                        { id: 'nf1', text: 'O tempo de resposta para encontrar um motorista deve ser < 3 segundos' },
                        { id: 'nf2', text: 'Suportar 50.000 requisições simultâneas por região' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Rotas e cálculos são O QUE o app faz; tempo de resposta e carga são COMO ele faz."
                },
                {
                    id: 4,
                    concept: "Plataforma de Streaming de Vídeo",
                    story: "Usuários estão reclamando de travamentos e dificuldades para achar filmes. A nova versão focará na busca e na estabilidade do player.",
                    instruction: "Agrupe primeiro RF e seus itens, depois RN e seus itens.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Buscar filmes por gênero, ator ou diretor' },
                        { id: 'f2', text: 'Adicionar filmes a uma lista de favoritos' },
                        { id: 'nf1', text: 'Adaptar a qualidade do vídeo dinamicamente conforme a banda do usuário' },
                        { id: 'nf2', text: 'O aplicativo deve rodar nos sistemas iOS 14+ e Android 10+' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Perfeito! A adaptação de banda e a plataforma (Android/iOS) são RNF técnicos."
                },
                {
                    id: 5,
                    concept: "Sistema de Gestão Hospitalar",
                    story: "Em um hospital, o acesso a prontuários é vital. O sistema deve interagir com máquinas de raio-x e garantir sigilo médico absoluto.",
                    instruction: "Agrupe primeiro RF e seus itens, depois RN e seus itens.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Registrar a triagem e os sinais vitais do paciente' },
                        { id: 'f2', text: 'Prescrever medicamentos com alerta de alergias registradas' },
                        { id: 'nf1', text: 'O sistema deve ser integrável (HL7) com equipamentos de ressonância' },
                        { id: 'nf2', text: 'Garantir conformidade com a LGPD para dados sensíveis de saúde' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Correto! Integrabilidade e conformidade legal são exigências não funcionais."
                },
                {
                    id: 6,
                    concept: "E-commerce em Black Friday",
                    story: "A loja online trava todo mês de novembro. O projeto atual foca em regras de promoção combinadas a uma arquitetura em nuvem resiliente.",
                    instruction: "Siga a estrutura: [RF], [itens funcionais], [RN], [itens não funcionais].",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Aplicar cupons de desconto progressivo automaticamente' },
                        { id: 'f2', text: 'Bloquear estoque do item assim que ele entrar no carrinho (por 10 min)' },
                        { id: 'nf1', text: 'A infraestrutura deve escalar automaticamente (auto-scaling) em picos de CPU > 70%' },
                        { id: 'nf2', text: 'O banco de dados deve ter redundância geográfica (Multi-AZ)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Resiliência e elasticidade de infraestrutura bem isoladas das regras de promoção."
                },
                {
                    id: 7,
                    concept: "Portal de Transparência do Governo",
                    story: "A lei exige que os gastos públicos sejam visíveis a todos os cidadãos, em um site acessível para pessoas com deficiência visual e super protegido contra hackers.",
                    instruction: "Siga a estrutura: [RF], [itens funcionais], [RN], [itens não funcionais].",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Disponibilizar download dos contratos em formato CSV' },
                        { id: 'f2', text: 'Consultar licitações por estado e município' },
                        { id: 'nf1', text: 'A interface deve obedecer às diretrizes WCAG 2.1 nível AA (Acessibilidade)' },
                        { id: 'nf2', text: 'O portal deve ter proteção contra ataques DDoS' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Exato! Acessibilidade (WCAG) é uma qualidade do sistema (RN)."
                },
                {
                    id: 8,
                    concept: "Jogo Multiplayer Online (MMORPG)",
                    story: "Para manter os jogadores engajados, o jogo precisa de mecânicas de guildas e trocas, mas sem sofrer com lentidão (lag) durante batalhas massivas.",
                    instruction: "Separe RFs de RNFs.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Permitir a troca de itens entre dois jogadores via janela de comércio' },
                        { id: 'f2', text: 'Criar um sistema de alianças (Guildas) com chat exclusivo' },
                        { id: 'nf1', text: 'A latência de rede (ping) máxima aceitável deve ser de 50ms para 95% dos jogadores' },
                        { id: 'nf2', text: 'O cliente do jogo não deve consumir mais de 4GB de memória RAM' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Ótimo. Consumo de hardware e latência de rede são restrições não funcionais."
                },
                {
                    id: 9,
                    concept: "Automação Residencial (IoT)",
                    story: "O app central controla as luzes e o ar-condicionado de casa. Ele precisa funcionar mesmo quando a internet cai e ter uma interface muito intuitiva.",
                    instruction: "Separe RFs de RNFs.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Programar horários de ligar/desligar para os dispositivos conectados' },
                        { id: 'f2', text: 'Emitir um alerta no celular quando uma porta for aberta' },
                        { id: 'nf1', text: 'O aplicativo deve ser capaz de operar via rede local (offline) caso a internet falhe' },
                        { id: 'nf2', text: 'A cor de contraste dos botões deve facilitar o uso em ambientes escuros' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Disponibilidade offline e Usabilidade são RNFs bem aplicados."
                },
                {
                    id: 10,
                    concept: "Controle de Tráfego Aéreo",
                    story: "Sistemas críticos não podem falhar. Os controladores precisam ver os voos, e o sistema deve ser desenvolvido em uma linguagem de altíssima confiabilidade e à prova de falhas.",
                    instruction: "Agrupe RFs seguidos de RNFs.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Exibir a altitude, velocidade e plano de voo ao clicar em uma aeronave' },
                        { id: 'f2', text: 'Emitir alerta sonoro caso duas rotas entrem em zona de colisão' },
                        { id: 'nf1', text: 'O sistema deve ser desenvolvido utilizando a linguagem Ada, homologada para aviação' },
                        { id: 'nf2', text: 'O tempo de recuperação em caso de falha de hardware deve ser zero (redundância hot-standby)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Perfeito! A escolha de linguagem e tolerância a falhas (COMO será construído e executado) são RNFs."
                },
                {
                    id: 11,
                    concept: "App de Delivery de Comida",
                    story: "O cliente deve ver o trajeto do motoboy, e a plataforma deve garantir que as APIs dos restaurantes sejam chamadas usando o padrão REST e JSON.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Cancelar pedido antes de o restaurante aceitar' },
                        { id: 'f2', text: 'Avaliar o pedido com notas de 1 a 5 estrelas' },
                        { id: 'nf1', text: 'A comunicação com o PDV do restaurante deve ser via API RESTful' },
                        { id: 'nf2', text: 'O aplicativo deve ser desenvolvido em Flutter (Cross-platform)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Tecnologias de integração e desenvolvimento são RNFs!"
                },
                {
                    id: 12,
                    concept: "Ponto Eletrônico e RH",
                    story: "Funcionários batem ponto pelo app. O RH calcula horas extras. A legislação exige auditoria e o banco de dados tem restrição severa de acesso físico.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Registrar a entrada e saída utilizando geolocalização' },
                        { id: 'f2', text: 'Emitir relatório de horas extras no fim do mês' },
                        { id: 'nf1', text: 'Os registros de ponto devem ser imutáveis (Auditoria legal)' },
                        { id: 'nf2', text: 'O banco de dados deve ser hospedado em servidor on-premise, por regra sindical' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Restrições de conformidade e infraestrutura."
                },
                {
                    id: 13,
                    concept: "Plataforma de E-learning",
                    story: "Para suportar alunos do mundo inteiro assistindo a aulas gravadas, precisamos emitir certificados e possuir uma arquitetura global (CDN).",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Gerar certificado em PDF ao atingir 100% de conclusão' },
                        { id: 'f2', text: 'Criar tópicos de discussão em fóruns por módulo' },
                        { id: 'nf1', text: 'Vídeos devem ser distribuídos por uma CDN global para reduzir buffer' },
                        { id: 'nf2', text: 'O sistema deve suportar interface traduzida em PT, EN e ES' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Ótimo. Internacionalização (Idiomas) é um RNF de usabilidade."
                },
                {
                    id: 14,
                    concept: "Exchange de Criptomoedas",
                    story: "Comprar e vender Bitcoin exige precisão matemática absurda e segurança cibernética de nível militar contra invasões.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Executar ordem de compra quando a moeda atingir valor X' },
                        { id: 'f2', text: 'Permitir saque de fiat (reais) para conta bancária do titular' },
                        { id: 'nf1', text: 'Exigir autenticação de dois fatores (2FA) para cada login e saque' },
                        { id: 'nf2', text: 'Os cálculos fracionários das moedas devem usar precisão de 8 casas decimais sem arredondamento' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Autenticação e precisão algorítmica classificadas corretamente!"
                },
                {
                    id: 15,
                    concept: "Gestão de Frota e Logística",
                    story: "Caminhões cortam o país monitorados. É preciso alertar desvios de rota e garantir que o software embarcado suporte condições extremas (falta de sinal e recursos).",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Alertar a central se o caminhão desviar 5km da rota planejada' },
                        { id: 'f2', text: 'Permitir o bloqueio do motor do veículo remotamente' },
                        { id: 'nf1', text: 'O software embarcado deve funcionar com apenas 256MB de RAM' },
                        { id: 'nf2', text: 'Sincronizar dados em lotes (batch) assim que a conexão GPRS for restabelecida' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Sincronização assíncrona e limites de hardware são RNFs."
                },
                {
                    id: 16,
                    concept: "Sistema de Bibliotecas Universitárias",
                    story: "Gerenciar multas e reservas de livros físicos, respeitando prazos e avisando usuários por e-mail, num sistema feito em Java com banco relacional.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Aplicar multa diária de R$ 2,00 por livro em atraso' },
                        { id: 'f2', text: 'Enviar e-mail automático avisando que o livro reservado está disponível' },
                        { id: 'nf1', text: 'O sistema deve ser construído usando o framework Spring Boot (Java)' },
                        { id: 'nf2', text: 'O banco de dados deve ser estritamente relacional (PostgreSQL)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Ferramentas de desenvolvimento são escolhas não funcionais."
                },
                {
                    id: 17,
                    concept: "Chatbot de Atendimento com IA",
                    story: "A IA responde clientes, emite segunda via de boleto e transfere para humanos. Ela precisa processar a linguagem natural em milissegundos para parecer real.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Identificar a intenção do usuário para gerar 2ª via de boletos' },
                        { id: 'f2', text: 'Transferir o chat para um atendente humano se a IA não entender' },
                        { id: 'nf1', text: 'O tempo máximo de inferência do modelo de IA deve ser de 800ms' },
                        { id: 'nf2', text: 'O bot deve suportar integração omni-channel (WhatsApp e Telegram)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Velocidade de processamento e canais de integração classificados!"
                },
                {
                    id: 18,
                    concept: "Aplicativo de Relacionamento",
                    story: "Conectar pessoas por proximidade geográfica (Match). A privacidade de fotos não autorizadas e a interface agradável são vitais para retenção.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Sugestão de perfis baseada em filtros de raio (km) e idade' },
                        { id: 'f2', text: 'Permitir envio de mensagens apenas se houver Match mútuo' },
                        { id: 'nf1', text: 'Impedir a captura de tela (screenshot) em conversas privadas' },
                        { id: 'nf2', text: 'O design UI/UX deve seguir as diretrizes do Material Design 3' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Segurança anti-print e padrão de design são qualidades."
                },
                {
                    id: 19,
                    concept: "Gestão de Recursos Humanos",
                    story: "Avaliações de desempenho, feedback 360º. Tudo precisa ficar guardado por 10 anos por motivos legais e o sistema deve ter Single Sign-On (SSO).",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Criar formulários dinâmicos para a avaliação de desempenho' },
                        { id: 'f2', text: 'Permitir que o gestor insira metas atreladas ao bônus anual' },
                        { id: 'nf1', text: 'O login deve ser integrado via Single Sign-On (Azure AD)' },
                        { id: 'nf2', text: 'O histórico de salários não pode ser purgado por no mínimo 10 anos' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Retenção de dados legal e mecanismos de autenticação resolvidos!"
                },
                {
                    id: 20,
                    concept: "Rede Social Corporativa",
                    story: "Feed de notícias interno, grupos de projetos. A comunicação só pode circular na VPN da empresa, sem armazenamento externo.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Publicar postagens com menções a usuários utilizando @' },
                        { id: 'f2', text: 'Criar grupos privados de debate de projetos' },
                        { id: 'nf1', text: 'O tráfego de dados do sistema deve fluir exclusivamente pela VPN corporativa' },
                        { id: 'nf2', text: 'É vetado o uso de serviços de Storage em nuvem pública (S3) para arquivos' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Restrições de arquitetura corporativa validadas."
                },
                {
                    id: 21,
                    concept: "Plataforma de Crowdfunding",
                    story: "Criadores lançam projetos para arrecadar fundos. A plataforma deve processar pagamentos garantindo certificações de segurança financeira.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Criar campanha definindo meta monetária e data limite' },
                        { id: 'f2', text: 'Reembolsar doadores automaticamente se a meta não for batida' },
                        { id: 'nf1', text: 'A API de pagamentos deve possuir certificação PCI DSS nível 1' },
                        { id: 'nf2', text: 'O front-end deve ser renderizado do lado do servidor (SSR) para ganho de SEO' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Segurança de cartão de crédito e arquitetura web classificados."
                },
                {
                    id: 22,
                    concept: "Monitoramento Meteorológico",
                    story: "Sensores espalhados captam umidade e temperatura a cada segundo. O sistema avisa autoridades de enchentes, lidando com terabytes de dados brutos.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Emitir SMS para a Defesa Civil se o nível do rio subir 2 metros' },
                        { id: 'f2', text: 'Gerar gráficos pluviométricos baseados nos últimos 7 dias' },
                        { id: 'nf1', text: 'O banco de dados deve suportar a ingestão contínua de dados de séries temporais' },
                        { id: 'nf2', text: 'O processamento dos alertas não deve exceder 30 segundos após a leitura' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Modelos de banco de dados e janelas de processamento avaliados com sucesso."
                },
                {
                    id: 23,
                    concept: "Controle de Estoque com RFID",
                    story: "Um galpão logístico automatizado. As empilhadeiras registram a entrada da carga via rádio-frequência. A interface deve ser simples pois os operadores usam luvas.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Dar entrada no lote assim que a etiqueta RFID for detectada no pórtico' },
                        { id: 'f2', text: 'Gerar mapa de calor visual dos produtos que mais saem' },
                        { id: 'nf1', text: 'A interface do tablet coletor deve possuir botões grandes e espaçados (Usabilidade)' },
                        { id: 'nf2', text: 'A leitura das etiquetas deve ocorrer a uma distância mínima de 3 metros' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Usabilidade ergonômica (botões) e capacidades físicas de leitura (3m) são RNF."
                },
                {
                    id: 24,
                    concept: "App de Meditação e Bem-estar",
                    story: "Usuários acompanham seu progresso de meditação. Os áudios não podem consumir muita bateria do celular, e o uso deve passar tranquilidade nas cores.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Tocar faixas de áudio categorizadas por nível de ansiedade' },
                        { id: 'f2', text: 'Manter calendário de "ofensiva" (dias seguidos meditando)' },
                        { id: 'nf1', text: 'O streaming do áudio não deve causar aquecimento anormal do dispositivo móvel' },
                        { id: 'nf2', text: 'A paleta de cores primárias deve ser testada para reduzir fadiga visual' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Recursos de bateria e estudo de cores UI classificados como não funcionais."
                },
                {
                    id: 25,
                    concept: "Sistema de Reservas de Hotel",
                    story: "Múltiplas agências reservam simultaneamente os mesmos quartos. É preciso evitar 'overbooking', e a API deve seguir protocolos de comunicação legados XML.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Realizar bloqueio da reserva mediante pagamento de sinal' },
                        { id: 'f2', text: 'Configurar tarifas variáveis conforme a temporada de feriados' },
                        { id: 'nf1', text: 'O banco de dados deve utilizar isolamento serializável para evitar double-booking' },
                        { id: 'nf2', text: 'A integração com operadoras turísticas deve obrigatoriamente usar XML/SOAP' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Isolamento de banco e padrão de interoperabilidade legado resolvidos."
                },
                {
                    id: 26,
                    concept: "Plataforma de Assinatura Digital de Contratos",
                    story: "Contratos assinados eletronicamente têm valor legal. Cada assinatura precisa gerar hashes rastreáveis. O uptime deve ser implacável.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Validar o certificado digital do tipo A3 via token' },
                        { id: 'f2', text: 'Permitir o fluxo de co-assinatura com múltiplos participantes' },
                        { id: 'nf1', text: 'Garantir a integridade do PDF utilizando assinatura criptográfica SHA-256' },
                        { id: 'nf2', text: 'Ter índice de disponibilidade de 99.999% (Cinco noves)' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Métricas de HA (High Availability) e integridade criptográfica aplicadas."
                },
                {
                    id: 27,
                    concept: "Controle de Irrigação Agrícola",
                    story: "A irrigação baseia-se em previsões climáticas externas. O sistema físico roda no campo, com energia solar instável.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Acionar válvulas de água se a umidade do solo estiver abaixo de 20%' },
                        { id: 'f2', text: 'Suspender a irrigação se a previsão meteorológica indicar chuva próxima' },
                        { id: 'nf1', text: 'O módulo central deve ser tolerante a cortes repentinos de energia (bateria backup)' },
                        { id: 'nf2', text: 'O código do firmware deve ser escrito em C/C++' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Hardware e energia são requisitos físicos não funcionais em IoT."
                },
                {
                    id: 28,
                    concept: "Sistema de Bilhetagem Eletrônica (Metrô)",
                    story: "Milhares passam pelas catracas diariamente. O saldo precisa descontar na hora, e as catracas sincronizam com a nuvem sem atrasar o passageiro.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Descontar a tarifa baseada na estação de embarque e desembarque' },
                        { id: 'f2', text: 'Autorizar gratuidade se o bilhete for da categoria Idoso' },
                        { id: 'nf1', text: 'A catraca deve liberar o giro em no máximo 500 milissegundos após a leitura' },
                        { id: 'nf2', text: 'Garantir consistência eventual na sincronização do saldo para a nuvem' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Tempo de catraca (500ms) e padrões de consistência resolvidos!"
                },
                {
                    id: 29,
                    concept: "Plataforma de Telemedicina",
                    story: "Consultas por vídeo. Paciente e médico trocam documentos na tela. Os vídeos não podem ser gravados sem consentimento e requerem criptografia End-to-End.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais.",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Permitir compartilhamento de exames em PDF no chat da consulta' },
                        { id: 'f2', text: 'Enviar receita médica assinada digitalmente ao fim do atendimento' },
                        { id: 'nf1', text: 'O protocolo de vídeo (WebRTC) deve possuir criptografia ponta-a-ponta' },
                        { id: 'nf2', text: 'Bloquear via DRM softwares de gravação de tela de terceiros' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Criptografia de transmissão e DRM são puramente de qualidade e segurança."
                },
                {
                    id: 30,
                    concept: "Sistema de Gestão de Crises e Desastres Naturais",
                    story: "Quando o pior acontece, bombeiros e voluntários usam o app. A vida depende dele, então precisa ser auditável, rápido e suportar alto throughput.",
                    instruction: "Ordene: [RF], Funcionais, [RN], Não Funcionais. (Desafio Final)",
                    blocks: [
                        { id: 'rf', text: 'Requisitos Funcionais (RF)' },
                        { id: 'rn', text: 'Requisitos Não Funcionais (RN)' },
                        { id: 'f1', text: 'Cadastrar voluntários no raio do desastre' },
                        { id: 'f2', text: 'Mapear zonas de risco usando integração de mapas (GIS)' },
                        { id: 'nf1', text: 'O tempo médio entre falhas (MTBF) do sistema deve superar 5.000 horas' },
                        { id: 'nf2', text: 'O tempo de recuperação de desastres (DR) do próprio sistema deve ser < 1 minuto' }
                    ],
                    expectedF: ['f1', 'f2'],
                    expectedNF: ['nf1', 'nf2'],
                    successLog: "Parabéns! Você domina a identificação e separação completa de requisitos!"
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        this.addLog("Iniciando ambiente avançado de análise...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1000);
    },
    methods: {
        shuffleArray(array) {
            let shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`Carregando Desafio ${this.currentLevel.id}: ${this.currentLevel.concept}...`, "log-info");
            await this.typeWriter(this.currentLevel.story, "log-default");
            await this.typeWriter(`INSTRUÇÃO: ${this.currentLevel.instruction}`, "log-info");
            
            this.chances = 3;
            this.showSolution = false;
            this.currentSolutionDisplay = [];
            
            this.selectedBlocks = [];
            this.availableBlocks = this.shuffleArray(this.currentLevel.blocks);
            this.feedbackMsg = "";
            this.isTyping = false;
        },

        selectBlock(block) {
            this.availableBlocks = this.availableBlocks.filter(b => b.id !== block.id);
            this.selectedBlocks.push(block);
            this.feedbackMsg = "";
        },

        removeBlock(index) {
            const block = this.selectedBlocks.splice(index, 1)[0];
            this.availableBlocks.push(block);
            this.feedbackMsg = "";
        },

        clearBlocks() {
            this.availableBlocks.push(...this.selectedBlocks);
            this.selectedBlocks = [];
            this.feedbackMsg = "";
        },

        async runCode() {
            const userSequence = this.selectedBlocks.map(b => b.id);
            const totalRequired = this.currentLevel.blocks.length;

            if (userSequence.length !== totalRequired) {
                this.handleError("Erro: Utilize todos os blocos do cenário.");
                return;
            }

            const rfIdx = userSequence.indexOf('rf');
            const rnIdx = userSequence.indexOf('rn');

            // Validação de Ordem Estrutural
            if (rfIdx !== 0 || rnIdx === -1 || rnIdx <= rfIdx) {
                this.handleError("Erro Estrutural: A estrutura deve ser iniciada pelo bloco [RF], depois os itens funcionais, seguido pelo bloco [RN], depois os itens não funcionais.");
                return;
            }

            // Separa os blocos selecionados baseando-se nos cabeçalhos
            const userF = userSequence.slice(1, rnIdx); // Tudo entre 'rf' e 'rn'
            const userNF = userSequence.slice(rnIdx + 1); // Tudo depois de 'rn'

            const { expectedF, expectedNF } = this.currentLevel;

            // Validação Semântica (As ordens internas de F e NF não importam, desde que estejam no grupo certo)
            const isFValid = userF.length === expectedF.length && userF.every(id => expectedF.includes(id));
            const isNFValid = userNF.length === expectedNF.length && userNF.every(id => expectedNF.includes(id));

            if (isFValid && isNFValid) {
                // SUCESSO
                this.feedbackType = "success";
                this.feedbackMsg = "Agrupamento Lógico Perfeito!";
                this.levelComplete = true;

                await this.typeWriter(this.currentLevel.successLog, "log-success");

                setTimeout(() => {
                    this.nextLevel();
                }, 2500);

            } else {
                this.handleError("Erro Semântico: Você colocou requisitos no grupo errado (Confundiu O QUE com COMO).");
            }
        },

        handleError(msg) {
            this.chances--;
            if (this.chances > 0) {
                this.feedbackType = "error";
                this.feedbackMsg = `${msg} Restam ${this.chances} tentativa(s).`;
                this.addLog(`Falha na validação. ${this.chances} chances restantes.`, "log-error");
            } else {
                this.feedbackType = "error";
                this.feedbackMsg = "Tentativas esgotadas!";
                this.addLog("Solução ideal exposta pelo sistema...", "log-error");
                this.displaySolution();
            }
        },

        displaySolution() {
            this.showSolution = true;
            // Cria um gabarito ideal combinando a ordem
            const idealOrder = ['rf', ...this.currentLevel.expectedF, 'rn', ...this.currentLevel.expectedNF];
            this.currentSolutionDisplay = idealOrder.map(id => {
                return this.currentLevel.blocks.find(b => b.id === id);
            });
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.levelComplete = false;
                this.loadLevel();
            } else {
                this.levelComplete = true;
                this.selectedBlocks = [];
                this.availableBlocks = [];
                this.showSolution = false;
                this.feedbackMsg = "Treinamento Completo!";
                this.feedbackType = "success";
                this.addLog("Parabéns. O ciclo da engenharia de requisitos foi dominado.", "log-success");
            }
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                
                const interval = setInterval(() => {
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 15); 
            });
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                }
            });
        },

        resetGame() {
            this.currentLevelIndex = 0;
            this.levelComplete = false;
            this.logs = [];
            this.feedbackMsg = "";
            this.addLog("Reiniciando...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');