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

        // --- Banco de Questões (40 Questões - Escopo, Requisitos e UML) ---
        const questions = ref([
            // --- Bloco 1: Gestão de Escopo (13 questões) ---
            {
                id: 1,
                instruction: "Fundamentos do Escopo",
                scenario: "A equipe de projetos está iniciando o planejamento e precisa definir exatamente as entregas.",
                text: "Qual é o propósito principal do Documento de Escopo?",
                options: [
                    "Definir de forma clara e objetiva o que será realizado no projeto.",
                    "Listar todas as linguagens de programação que serão utilizadas.",
                    "Servir como um manual de usuário final do sistema.",
                    "Apresentar a modelagem do banco de dados em formato DER."
                ],
                answer: "Definir de forma clara e objetiva o que será realizado no projeto."
            },
            {
                id: 2,
                instruction: "O Perigo do Scope Creep",
                scenario: "Um cliente pediu um sistema simples de cadastro, mas sem um escopo formal, passou a pedir 'só mais um botão' repetidas vezes. O projeto pulou de 2 para 8 meses.",
                text: "O que a ausência de limites gera nesse contexto?",
                options: [
                    "A corrupção do escopo (Scope Creep).",
                    "A redução do débito técnico.",
                    "O aumento da agilidade do time (Agile Modeling).",
                    "A validação automática dos requisitos não funcionais."
                ],
                answer: "A corrupção do escopo (Scope Creep)."
            },
            {
                id: 3,
                instruction: "Contexto e Objetivos",
                scenario: "Antes de listar funcionalidades, o analista foca em entender qual problema foi identificado e quem é afetado por ele.",
                text: "Por que essa etapa de mapeamento do problema é necessária?",
                options: [
                    "Porque os objetivos derivam da justificativa (oportunidade/problema) e devem ser específicos e mensuráveis.",
                    "Para cobrar mais caro do cliente pelas horas de reunião.",
                    "Porque a UML exige que todo diagrama inicie com um problema textual.",
                    "Para criar um diagrama de Entidade-Relacionamento focado na dor do cliente."
                ],
                answer: "Porque os objetivos derivam da justificativa (oportunidade/problema) e devem ser específicos e mensuráveis."
            },
            {
                id: 4,
                instruction: "Fronteiras do Escopo",
                scenario: "No documento de uma Clínica Universitária, listou-se que pagamentos online e aplicativo mobile nativo não seriam feitos.",
                text: "Por que é fundamental listar explicitamente o que está FORA do escopo?",
                options: [
                    "Para blindar a equipe contra cobranças sobre itens que o cliente 'imaginou' que estariam inclusos.",
                    "Para que os desenvolvedores saibam o que devem fazer na próxima Sprint de forma escondida.",
                    "Apenas para aumentar o volume de páginas da documentação técnica.",
                    "Para forçar o cliente a assinar um contrato paralelo de suporte técnico."
                ],
                answer: "Para blindar a equipe contra cobranças sobre itens que o cliente 'imaginou' que estariam inclusos."
            },
            {
                id: 5,
                instruction: "Categorização de Requisitos",
                scenario: "O analista escreveu: 'O sistema deve emitir um alerta de choque de horários.'",
                text: "Como esse requisito é classificado em relação ao comportamento do sistema?",
                options: [
                    "Requisito Funcional (O QUE o sistema deve fazer).",
                    "Requisito Não Funcional (COMO o sistema deve ser).",
                    "Restrição de Negócio (Limitação imposta pelo ambiente).",
                    "Premissa de Arquitetura."
                ],
                answer: "Requisito Funcional (O QUE o sistema deve fazer)."
            },
            {
                id: 6,
                instruction: "Requisitos de Qualidade",
                scenario: "A especificação diz: 'O tempo de resposta da consulta não pode exceder 2 segundos.'",
                text: "A qual categoria pertence esta declaração?",
                options: [
                    "Requisito Não Funcional.",
                    "Requisito Funcional.",
                    "Critério de Aceitação de Interface.",
                    "Diagrama de Comportamento."
                ],
                answer: "Requisito Não Funcional."
            },
            {
                id: 7,
                instruction: "Limitações Ambientais",
                scenario: "Um documento pontua: 'O MVP deve ser desenvolvido no período definido pela disciplina.'",
                text: "Como essa limitação imposta pelo ambiente é chamada na Engenharia de Requisitos?",
                options: [
                    "Restrição de Negócio.",
                    "Requisito Não Funcional de Desempenho.",
                    "Caso de Uso Secundário.",
                    "Critério de Aceite Funcional."
                ],
                answer: "Restrição de Negócio."
            },
            {
                id: 8,
                instruction: "Derivação UML: Casos de Uso",
                scenario: "No documento de escopo, definiu-se o requisito 'Permitir solicitação de agendamento'.",
                text: "Esse requisito funcional se torna qual elemento na modelagem UML?",
                options: [
                    "Um Caso de Uso (Ex: Solicitar Agendamento).",
                    "Um Atributo de Classe.",
                    "Um Ator Secundário.",
                    "Uma Tabela de Banco de Dados."
                ],
                answer: "Um Caso de Uso (Ex: Solicitar Agendamento)."
            },
            {
                id: 9,
                instruction: "Derivação UML: Atores",
                scenario: "O escopo de um sistema hospitalar cita as figuras do 'Paciente' e da 'Recepcionista'.",
                text: "Como esses stakeholders mapeados são representados no Diagrama de Casos de Uso?",
                options: [
                    "Eles tornam-se os Atores primários e secundários do diagrama.",
                    "Eles viram Requisitos Não Funcionais de segurança.",
                    "Eles são transformados em pacotes de trabalho na EAP.",
                    "Eles representam os limites do sistema físico."
                ],
                answer: "Eles tornam-se os Atores primários e secundários do diagrama."
            },
            {
                id: 10,
                instruction: "Derivação UML: Diagrama de Classes",
                scenario: "Ao analisar a descrição textual do escopo, notou-se o uso frequente dos substantivos 'Usuário', 'Horário' e 'Agendamento'.",
                text: "Esses substantivos fornecem a base para derivar qual estrutura no Diagrama de Classes?",
                options: [
                    "As Classes do sistema.",
                    "Os Métodos/Ações do sistema.",
                    "Apenas a interface gráfica (UI).",
                    "Os atores externos do diagrama."
                ],
                answer: "As Classes do sistema."
            },
            {
                id: 11,
                instruction: "Comportamento no Código",
                scenario: "Na declaração de escopo, os verbos 'cadastrar', 'consultar' e 'solicitar' denotam ações.",
                text: "Na transição para o código e para o Diagrama de Classes, no que esses verbos se transformam?",
                options: [
                    "Métodos (funções) dentro das classes.",
                    "Atributos privados das entidades.",
                    "Tabelas de relacionamento N:M.",
                    "Pacotes de infraestrutura estrutural."
                ],
                answer: "Métodos (funções) dentro das classes."
            },
            {
                id: 12,
                instruction: "Estrutura Analítica do Projeto",
                scenario: "A equipe dividiu o 'Sistema MVP' em blocos menores como 'Requisitos', 'UX/UI' e 'Backend'.",
                text: "Qual é o nome dessa decomposição hierárquica que traduz o escopo em partes gerenciáveis?",
                options: [
                    "A Estrutura Analítica do Projeto (EAP / WBS).",
                    "O Diagrama de Classes.",
                    "A Modelagem Entidade-Relacionamento.",
                    "O Documento de Requisitos de Software."
                ],
                answer: "A Estrutura Analítica do Projeto (EAP / WBS)."
            },
            {
                id: 13,
                instruction: "Critérios de Aceitação",
                scenario: "O entregável é um 'Protótipo navegável', mas o cliente precisa saber de forma objetiva se ele está 'Pronto'.",
                text: "O que define como o cliente verificará se a entrega atende ao esperado, removendo a subjetividade?",
                options: [
                    "Os Critérios de Aceitação.",
                    "As Premissas e Restrições.",
                    "Os Requisitos Não Funcionais.",
                    "O Diagrama de Casos de Uso."
                ],
                answer: "Os Critérios de Aceitação."
            },
            // --- Bloco 2: Engenharia de Requisitos (14 questões) ---
            {
                id: 14,
                instruction: "Análise de Sistemas",
                scenario: "Um profissional atua separando o todo em partes para entendê-lo melhor antes da programação começar.",
                text: "Qual é o papel central do Analista neste contexto?",
                options: [
                    "Traduzir as dores do mundo real para uma linguagem que a equipe técnica consiga transformar em software.",
                    "Programar as rotinas de banco de dados diretamente em SQL.",
                    "Vender a solução de software ao usuário final.",
                    "Aprovar o orçamento de servidores e hardware do cliente."
                ],
                answer: "Traduzir as dores do mundo real para uma linguagem que a equipe técnica consiga transformar em software."
            },
            {
                id: 15,
                instruction: "Definição de Requisitos",
                scenario: "Eles são vistos como a ponte fundamental entre o negócio e a tecnologia de um projeto.",
                text: "O que exatamente são Requisitos de software?",
                options: [
                    "Uma condição ou capacidade que deve ser alcançada por um sistema para resolver um problema.",
                    "A documentação técnica do código-fonte escrita após a entrega.",
                    "O conjunto de tabelas criadas no banco de dados relacional.",
                    "A linguagem de programação escolhida pela equipe."
                ],
                answer: "Uma condição ou capacidade que deve ser alcançada por um sistema para resolver um problema."
            },
            {
                id: 16,
                instruction: "Diferenciação Prática",
                scenario: "Um sistema calcula perfeitamente as folhas de pagamento (O QUE ele faz), mas demora 5 minutos para carregar cada tela (COMO ele faz).",
                text: "Essa demora de 5 minutos fere qual tipo de requisito?",
                options: [
                    "Requisito Não Funcional.",
                    "Requisito Funcional.",
                    "Critério de Autenticação.",
                    "Requisito de Domínio Legal."
                ],
                answer: "Requisito Não Funcional."
            },
            {
                id: 17,
                instruction: "Categorias Não Funcionais",
                scenario: "O sistema precisa atender regras rigorosas de criptografia e auditoria de acesso.",
                text: "A qual categoria de Requisito Não Funcional isso pertence?",
                options: [
                    "Segurança.",
                    "Desempenho.",
                    "Disponibilidade.",
                    "Integrabilidade."
                ],
                answer: "Segurança."
            },
            {
                id: 18,
                instruction: "Categorias Não Funcionais",
                scenario: "Foi solicitado que o sistema tenha interoperabilidade para se conectar via API com outros três softwares do governo.",
                text: "Isso se enquadra em qual categoria de Requisito Não Funcional?",
                options: [
                    "Integrabilidade.",
                    "Segurança.",
                    "Desempenho.",
                    "Disponibilidade."
                ],
                answer: "Integrabilidade."
            },
            {
                id: 19,
                instruction: "Especificação de Requisitos",
                scenario: "O time finalizou a declaração oficial do que é demandado dos desenvolvedores.",
                text: "O Documento de Requisitos deve focar primariamente em que?",
                options: [
                    "O QUE o sistema deve fazer, ao invés de COMO deve fazê-lo.",
                    "O COMO deve ser feito, detalhando lógicas de programação.",
                    "Os custos financeiros detalhados do hardware.",
                    "O design visual das telas com cores definitivas."
                ],
                answer: "O QUE o sistema deve fazer, ao invés de COMO deve fazê-lo."
            },
            {
                id: 20,
                instruction: "O Ciclo da Engenharia",
                scenario: "O trabalho com requisitos não é uma etapa única de anotação, mas sim um processo metódico e iterativo.",
                text: "Quais são as 4 fases principais da Engenharia de Requisitos?",
                options: [
                    "Elicitação, Análise, Especificação e Validação.",
                    "Desenho, Codificação, Teste e Implantação.",
                    "Levantamento, Orçamento, Venda e Manutenção.",
                    "Modelagem, Refatoração, Diagramação e Deploy."
                ],
                answer: "Elicitação, Análise, Especificação e Validação."
            },
            {
                id: 21,
                instruction: "Fase 1: Elicitação",
                scenario: "O analista precisa fazer com que as necessidades ocultas venham à tona, extraindo informações dos usuários.",
                text: "Quais são técnicas comuns utilizadas na fase de Elicitação?",
                options: [
                    "Entrevistas, Questionários, Observação e Prototipação.",
                    "Testes Unitários, Deploy contínuo e Integração Contínua.",
                    "Diagramas de Classes e Diagrama de Entidade-Relacionamento.",
                    "Revisão de Código e Análise de Complexidade."
                ],
                answer: "Entrevistas, Questionários, Observação e Prototipação."
            },
            {
                id: 22,
                instruction: "Técnica de Observação",
                scenario: "O analista percebeu que entrevistar o usuário em uma sala de reunião não revelava os atalhos reais que ele usava no sistema antigo.",
                text: "Por que a 'Observação' in loco revela mais que uma entrevista isolada?",
                options: [
                    "Porque permite ver o usuário trabalhando no seu dia a dia real e não apenas o que ele diz que faz.",
                    "Porque a observação intimida o usuário a não pedir funcionalidades difíceis.",
                    "Porque gasta menos tempo do analista.",
                    "Porque anula a necessidade de escrever qualquer documento."
                ],
                answer: "Porque permite ver o usuário trabalhando no seu dia a dia real e não apenas o que ele diz que faz."
            },
            {
                id: 23,
                instruction: "Fase de Validação",
                scenario: "Antes de codificar, o líder do projeto junta o cliente para revisar a documentação.",
                text: "Qual é a pergunta crucial que esta fase de Validação tenta responder?",
                options: [
                    "Estamos construindo o sistema certo?",
                    "A linguagem de programação suporta este código?",
                    "O banco de dados será relacional ou NoSQL?",
                    "Quantos programadores sêniors precisaremos?"
                ],
                answer: "Estamos construindo o sistema certo?"
            },
            {
                id: 24,
                instruction: "Custo do Erro",
                scenario: "A equipe não validou um requisito e o erro só foi descoberto na fase de testes avançados.",
                text: "Comparado a achar esse erro na fase de requisitos, o custo de correção na fase de testes será:",
                options: [
                    "Mais caro, pois exigirá refazer design e código já desenvolvidos.",
                    "Mais barato, pois o código já está quase pronto.",
                    "Igual, pois o esforço de alteração é tabelado.",
                    "Inexistente, erros de requisitos não afetam o código."
                ],
                answer: "Mais caro, pois exigirá refazer design e código já desenvolvidos."
            },
            {
                id: 25,
                instruction: "Documento Formal",
                scenario: "A equipe entregou um documento com uma declaração estruturada, mas incluía detalhes de implementação de servidores.",
                text: "Sobre o Documento de Requisitos, o que os fundamentos ressaltam que ele NÃO É?",
                options: [
                    "NÃO é um documento de projeto (arquitetura/implementação).",
                    "NÃO é um contrato de trabalho.",
                    "NÃO é um artefato ágil.",
                    "NÃO é validado pelos clientes."
                ],
                answer: "NÃO é um documento de projeto (arquitetura/implementação)."
            },
            {
                id: 26,
                instruction: "Análise vs Viabilidade",
                scenario: "No fluxo completo, antes mesmo de entrar profundamente na análise, executa-se uma verificação preliminar.",
                text: "Qual é a etapa inicial que gera um relatório determinando se o projeto vale a pena ser feito?",
                options: [
                    "Estudo de Viabilidade.",
                    "Especificação de Requisitos.",
                    "Resolução de Conflitos.",
                    "Desenvolvimento de Subsistemas."
                ],
                answer: "Estudo de Viabilidade."
            },
            {
                id: 27,
                instruction: "Gestão de Conflitos",
                scenario: "Durante a elicitação, o setor de Marketing pede uma tela aberta ao público, mas a Segurança pede login obrigatório.",
                text: "Onde isso é tratado no processo de análise de requisitos?",
                options: [
                    "Na fase de Resolução de Conflitos e Priorização.",
                    "No Estudo de Viabilidade.",
                    "No Diagrama de Classes.",
                    "Na etapa de Implementação de Código."
                ],
                answer: "Na fase de Resolução de Conflitos e Priorização."
            },
            // --- Bloco 3: Diagrama de Classes e UML (13 questões) ---
            {
                id: 28,
                instruction: "O Cenário Pré-UML",
                scenario: "Nos anos 80, um triângulo significava 'Herança' para o time A, mas 'Instância' para o time B.",
                text: "Qual era a consequência da existência de mais de 50 métodos de modelagem na época?",
                options: [
                    "Caos, atrasos e falhas de integração devido à falta de comunicação padronizada.",
                    "Alta velocidade na entrega de softwares perfeitos.",
                    "Menor custo de desenvolvimento, já que cada um fazia o que queria.",
                    "Surgimento antecipado do método Scrum."
                ],
                answer: "Caos, atrasos e falhas de integração devido à falta de comunicação padronizada."
            },
            {
                id: 29,
                instruction: "Definição de UML",
                scenario: "Um aluno tentou compilar um Diagrama de Casos de Uso acreditando ser um código executável.",
                text: "O que é fundamentalmente a UML?",
                options: [
                    "Uma linguagem visual de modelagem, e não uma linguagem de programação.",
                    "Um framework JavaScript de interface de usuário.",
                    "Uma nova versão da linguagem C++ para orientação a objetos.",
                    "Um modelo de banco de dados relacional."
                ],
                answer: "Uma linguagem visual de modelagem, e não uma linguagem de programação."
            },
            {
                id: 30,
                instruction: "Surgimento da UML",
                scenario: "Para combater a Guerra dos Métodos, Grady Booch, James Rumbaugh e Ivar Jacobson uniram forças em 1994.",
                text: "Qual era o principal objetivo dos 'Três Amigos'?",
                options: [
                    "Criar um 'esperanto' da engenharia, uma linguagem visual única e universal.",
                    "Fundar a primeira empresa de Inteligência Artificial.",
                    "Destruir a Orientação a Objetos em favor da Programação Estruturada.",
                    "Desenvolver uma ferramenta ágil de gestão de tarefas."
                ],
                answer: "Criar um 'esperanto' da engenharia, uma linguagem visual única e universal."
            },
            {
                id: 31,
                instruction: "Origem do Diagrama de Classes",
                scenario: "A UML foi lançada oficialmente em 1997. No entanto, desenvolvedores já usavam retângulos com atributos.",
                text: "O conceito do Diagrama de Classes nasceu com a UML?",
                options: [
                    "Não, o conceito antecede a UML, nascendo com a evolução do Paradigma Orientado a Objetos (Simula, Smalltalk).",
                    "Sim, foi a primeira grande inovação patenteada pela UML em 1997.",
                    "Não, ele foi importado dos fluxogramas da área de Engenharia Civil.",
                    "Sim, foi criado por Scott Ambler no Manifesto Ágil."
                ],
                answer: "Não, o conceito antecede a UML, nascendo com a evolução do Paradigma Orientado a Objetos (Simula, Smalltalk)."
            },
            {
                id: 32,
                instruction: "Notação Visual da Classe",
                scenario: "Ao desenhar o modelo de 'Cliente', o desenvolvedor dividiu a caixa para estruturar os dados.",
                text: "Como é a notação visual padrão de uma Classe validada pela UML?",
                options: [
                    "Um retângulo dividido em 3 partes: Nome, Atributos e Métodos.",
                    "Um círculo conectado por setas a um losango de decisão.",
                    "Uma tabela com chaves primárias e estrangeiras.",
                    "Uma elipse contendo os atores externos."
                ],
                answer: "Um retângulo dividido em 3 partes: Nome, Atributos e Métodos."
            },
            {
                id: 33,
                instruction: "Classes vs. DER",
                scenario: "Um desenvolvedor backend quer representar como a informação será persistida no banco de dados com cardinalidades.",
                text: "Para esse objetivo estrito, qual modelo é mais adequado?",
                options: [
                    "Diagrama Entidade-Relacionamento (DER).",
                    "Diagrama de Classes.",
                    "Diagrama de Sequência.",
                    "Diagrama de Casos de Uso."
                ],
                answer: "Diagrama Entidade-Relacionamento (DER)."
            },
            {
                id: 34,
                instruction: "Foco do Diagrama de Classes",
                scenario: "Além de guardar os dados de Nome e Email, a Classe Cliente possui o poder de `autenticar()` e `realizarCompra()`.",
                text: "Isso evidencia que o Diagrama de Classes, diferentemente do DER, foca em:",
                options: [
                    "Estado + Comportamento (Lógica de negócio rodando em memória).",
                    "Apenas na persistência e tipos das colunas no banco.",
                    "No fluxo de interfaces gráficas (telas) do usuário.",
                    "Na modelagem de pacotes de hardware da infraestrutura."
                ],
                answer: "Estado + Comportamento (Lógica de negócio rodando em memória)."
            },
            {
                id: 35,
                instruction: "Classe vs Entidade: O Esqueleto",
                scenario: "Ao comparar as metodologias, notou-se que a Entidade do DER atua apenas como dados parados.",
                text: "Como o material descreve a capacidade superior da 'Classe' em relação à 'Entidade'?",
                options: [
                    "A Classe possui inteligência (métodos), enquanto a Entidade é o esqueleto persistido no banco.",
                    "A Classe é mais fácil de desenhar usando losangos.",
                    "A Entidade processa algoritmos, enquanto a classe guarda bytes.",
                    "Não há diferença prática, ambos executam rotinas de negócio."
                ],
                answer: "A Classe possui inteligência (métodos), enquanto a Entidade é o esqueleto persistido no banco."
            },
            {
                id: 36,
                instruction: "A UML no Mundo Ágil",
                scenario: "Um Scrum Master novo chegou dizendo que no Ágil devemos jogar fora a UML porque o Manifesto prega 'Software em funcionamento'.",
                text: "Qual é a visão correta sobre isso no movimento Agile Modeling?",
                options: [
                    "O Ágil não é contra documentação, é contra documentação inútil. A UML é usada como ferramenta de comunicação.",
                    "O Scrum Master está correto, toda documentação atrasa a Sprint.",
                    "Devemos usar UML apenas ao final do projeto para catalogar o sistema legado.",
                    "A UML deve ser convertida exclusivamente para histórias de usuário em formato de texto."
                ],
                answer: "O Ágil não é contra documentação, é contra documentação inútil. A UML é usada como ferramenta de comunicação."
            },
            {
                id: 37,
                instruction: "Prevenção de Débito Técnico",
                scenario: "A equipe evitou criar um microserviço complexo e custoso após visualizar que as classes não se comunicariam eficientemente.",
                text: "Por que esboçar o Diagrama de Classes na Sprint Planning gera grande economia?",
                options: [
                    "Porque refatorar 'caixinhas num quadro' custa R$0, enquanto refatorar produção custa milhares.",
                    "Porque diagramas garantem aprovação imediata do orçamento na diretoria.",
                    "Porque o software desenhado escreve o código sozinho.",
                    "Porque dispensa a necessidade de realizar testes no sistema futuro."
                ],
                answer: "Porque refatorar 'caixinhas num quadro' custa R$0, enquanto refatorar produção custa milhares."
            },
            {
                id: 38,
                instruction: "Evitando a Miopia Ágil",
                scenario: "As Sprints curtas podem gerar um foco estreito no curto prazo, esquecendo o todo do sistema.",
                text: "Qual é o papel do Diagrama de Classes nesse cenário?",
                options: [
                    "Atuar como um mapa estratégico que mantém a equipe conectada à visão global da arquitetura.",
                    "Registrar as horas gastas pelos programadores na Sprint.",
                    "Decidir a prioridade do backlog de forma automática.",
                    "Funcionar como um contrato fixo que não pode mais ser alterado na Sprint."
                ],
                answer: "Atuar como um mapa estratégico que mantém a equipe conectada à visão global da arquitetura."
            },
            {
                id: 39,
                instruction: "Case da Lousa Branca",
                scenario: "O Squad divergia sobre como criar um sistema de assinaturas. O Tech Lead desenhou as classes 'Assinatura', 'Fatura' e 'Gateway' na lousa (Whiteboarding).",
                text: "Qual foi o desfecho produtivo dessa dinâmica de modelagem ágil em 15 minutos?",
                options: [
                    "O time chegou a um meio-termo arquitetural e a foto do quadro virou anexo no Jira da Sprint.",
                    "O projeto foi cancelado porque o quadro ficou confuso.",
                    "O Tech Lead foi forçado a desenhar DER ao invés de UML.",
                    "Eles perceberam que precisavam de 3 meses para redigir o documento de requisitos."
                ],
                answer: "O time chegou a um meio-termo arquitetural e a foto do quadro virou anexo no Jira da Sprint."
            },
            {
                id: 40,
                instruction: "O Coração do Sistema Moderno",
                scenario: "Ao final da modelagem, a equipe mapeou atributos e comportamentos encapsulados perfeitamente.",
                text: "O que o Diagrama de Classes permite modelar em um sistema moderno Orientado a Objetos?",
                options: [
                    "Os dois corações: O que ele sabe (Estado) e o que ele faz (Comportamento).",
                    "Apenas o hardware (Servidores) e os usuários externos (Atores).",
                    "A cronologia temporal de acesso e permissões sistêmicas.",
                    "As regras puramente visuais das interfaces do frontend."
                ],
                answer: "Os dois corações: O que ele sabe (Estado) e o que ele faz (Comportamento)."
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

        // Aplica o embaralhamento para todas as opções das questões ao iniciar
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
            await typeWriter(`Carregando Estudo Prático ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Avaliação concluída. Processando resultados para certificação PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Raciocínio de engenharia validado com sucesso.";
                addLog("Sucesso: Análise precisa do cenário.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta embasada no material era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha: Análise técnica incorreta.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Tente analisar os dados novamente. Tentativas restantes: ${maxAttempts - attempts.value}`;
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
            
            let performanceMsg = "Excelente domínio sobre Engenharia de Requisitos, Escopo e UML.";
            if (score.value < 28) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de Escopo, Modelagem de Classes e Requisitos Funcionais/Não Funcionais.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho Técnico</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação de Fundamentos: Escopo e UML</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento comprova a submissão a ${questions.value.length} cenários práticos exigindo diagnóstico ativo em Gestão de Escopo, Engenharia de Requisitos e Diagramas de Classe UML.</p>
                    
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
                filename:     `Certificacao_Requisitos_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador de Engenharia de Software...", "log-info");
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