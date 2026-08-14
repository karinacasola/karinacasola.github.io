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

        // --- Banco de Questões (30 Questões - Eng. de Software e Gestão) ---
        const questions = ref([
            {
                id: 1,
                instruction: "O Paradoxo da IA e Arquitetura",
                scenario: "Uma startup demitiu seus engenheiros seniores por acreditarem que uma IA generativa faria o trabalho mais rápido. Após 6 meses, o sistema travou ao atingir 1 milhão de usuários devido a gargalos no banco de dados.",
                text: "Com base no material, por que a IA falhou em sustentar esse crescimento?",
                options: [
                    "A IA apenas gera código, mas não sabe estruturar um sistema inteiro para escalar (Arquitetura).",
                    "A IA não foi treinada nas linguagens corretas de infraestrutura em nuvem.",
                    "Faltou utilizar o padrão MVC, que a IA é incapaz de escrever.",
                    "A empresa deveria ter utilizado metodologias em cascata para prever o limite de usuários."
                ],
                answer: "A IA apenas gera código, mas não sabe estruturar um sistema inteiro para escalar (Arquitetura)."
            },
            {
                id: 2,
                instruction: "Gestão da Ambiguidade",
                scenario: "O cliente solicita um 'sistema moderno e rápido'. O desenvolvedor júnior vai direto ao ChatGPT e gera um e-commerce em 3D, mas o cliente na verdade queria um formulário simples e minimalista.",
                text: "Qual competência do Engenheiro de Software foi negligenciada nessa situação?",
                options: [
                    "A gestão da ambiguidade: a capacidade de entrevistar o cliente e extrair as reais regras de negócio.",
                    "A prototipação de ciclos de vida clássicos em espiral.",
                    "A gerência de configuração (Git) para versionar o código 3D.",
                    "O uso adequado de estruturas de repetição no código gerado."
                ],
                answer: "A gestão da ambiguidade: a capacidade de entrevistar o cliente e extrair as reais regras de negócio."
            },
            {
                id: 3,
                instruction: "Manutenibilidade e Teste do Tempo",
                scenario: "Você herda um código gerado 100% por inteligência artificial. Ele funciona, mas é um 'macarrão' ilegível de variáveis sem sentido.",
                text: "Qual a responsabilidade primária da engenharia de software nesse contexto?",
                options: [
                    "Garantir que o software seja manutenível e sobreviva ao teste do tempo.",
                    "Apagar tudo e reescrever manualmente usando apenas Orientação a Objetos.",
                    "Exigir que o cliente reduza o escopo para diminuir o custo de leitura.",
                    "Aplicar metodologias ágeis (Scrum) para acelerar a leitura do código bagunçado."
                ],
                answer: "Garantir que o software seja manutenível e sobreviva ao teste do tempo."
            },
            {
                id: 4,
                instruction: "O Novo Papel do Engenheiro",
                scenario: "Durante uma entrevista de emprego, o recrutador pergunta como você se vê no futuro, dado que ferramentas automatizadas já escrevem a maior parte do código fonte.",
                text: "Segundo a ementa da disciplina, qual deve ser a postura de um engenheiro hoje?",
                options: [
                    "Atuar como orquestrador de soluções, focando no 'o que' e 'por que', enquanto a IA cuida do 'como codificar'.",
                    "Focar puramente na digitação rápida de linguagens de baixo nível para competir com a máquina.",
                    "Atuar exclusivamente no planejamento de custos, abandonando a área técnica de código.",
                    "Migrar para a área de testes, já que a arquitetura será totalmente automatizada."
                ],
                answer: "Atuar como orquestrador de soluções, focando no 'o que' e 'por que', enquanto a IA cuida do 'como codificar'."
            },
            {
                id: 5,
                instruction: "O Fator Humano: Ética",
                scenario: "Faltam 3 dias para a entrega do projeto e a equipe percebe que o sistema de pagamentos está com falhas graves de segurança. O gerente sugere esconder isso do cliente para cumprir o prazo e o orçamento.",
                text: "Qual pilar de atitude profissional está sendo gravemente violado?",
                options: [
                    "Responsabilidade e Ética (entrega honesta sobre o prazo e limitações reais).",
                    "Empatia (entender a dor do usuário final).",
                    "Colaboração (trabalho em equipe interdisciplinar).",
                    "Controle (uso adequado do versionamento Git)."
                ],
                answer: "Responsabilidade e Ética (entrega honesta sobre o prazo e limitações reais)."
            },
            {
                id: 6,
                instruction: "O Fator Humano: Empatia",
                scenario: "Sua equipe desenvolveu um sistema incrível de reconhecimento facial com 5 etapas de verificação. Porém, o público-alvo são idosos em áreas rurais que precisam de simplicidade e têm pouca internet.",
                text: "O que faltou para a equipe projetar aquilo que o usuário realmente precisava?",
                options: [
                    "Empatia para entender a dor e o contexto do usuário final.",
                    "Modelagem adequada usando diagramas de Sequência (UML).",
                    "Um orçamento (custo) maior para pagar por mais funcionalidades.",
                    "Monitoramento e controle mais rígido na fase de iniciação."
                ],
                answer: "Empatia para entender a dor e o contexto do usuário final."
            },
            {
                id: 7,
                instruction: "Estratégias de Estudo em Equipe",
                scenario: "Em um trabalho da faculdade, sua equipe dividiu o trabalho assim: 'Você faz a introdução e eu a conclusão', e uniram tudo no final num arquivo de Word.",
                text: "Qual estratégia prática recomendada na disciplina foi ignorada e resolveria a 'dor' de colaborar juntos no mesmo documento?",
                options: [
                    "O uso de gerência de configuração e ferramentas como o Git para criar colaboração real.",
                    "A aplicação de perguntas críticas do 'por que' e não apenas do 'como'.",
                    "A mudança de um ciclo de vida em Cascata para um Prototipação Rápida.",
                    "O desenvolvimento exclusivo focado no padrão MVC de arquitetura."
                ],
                answer: "O uso de gerência de configuração e ferramentas como o Git para criar colaboração real."
            },
            {
                id: 8,
                instruction: "Aplicando Teoria na Prática",
                scenario: "Um aluno decorou todas as formas geométricas dos diagramas UML, mas não sabe como resolver o problema do fluxo de adoção de animais em um aplicativo novo.",
                text: "De acordo com as diretrizes da disciplina, como os conceitos teóricos devem ser abordados para fazerem sentido?",
                options: [
                    "Devem ser aplicados em problemas e projetos reais, pois a teoria só faz sentido quando resolve algo concreto.",
                    "Devem ser programados primeiramente pela IA para validar as formas geométricas.",
                    "Devem ser testados apenas na fase final de Encerramento do projeto.",
                    "Devem focar no 'como' memorizar os padrões ao invés de buscar a resolução."
                ],
                answer: "Devem ser aplicados em problemas e projetos reais, pois a teoria só faz sentido quando resolve algo concreto."
            },
            {
                id: 9,
                instruction: "Processos de Desenvolvimento",
                scenario: "O cliente exige que o software siga um fluxo linear onde o teste só acontece no final, enquanto você defende entregas iterativas menores.",
                text: "Esse conflito de ideias refere-se à diferença estrutural entre quais metodologias?",
                options: [
                    "Ciclos de vida clássicos (Cascata) versus Metodologias Ágeis (Scrum, XP).",
                    "Arquitetura Monolítica versus Arquitetura de Microsserviços.",
                    "Manutenção Preventiva versus Manutenção Perfectiva.",
                    "Diagrama de Classes versus Diagrama de Sequência."
                ],
                answer: "Ciclos de vida clássicos (Cascata) versus Metodologias Ágeis (Scrum, XP)."
            },
            {
                id: 10,
                instruction: "Análise e Especificação",
                scenario: "O documento do projeto diz: 'O sistema deve ser rápido'. Um mês depois, a equipe e o cliente brigam sobre o que significa 'rápido'.",
                text: "Qual prática do Módulo 2 evitaria essa confusão e alinharia expectativas com os stakeholders?",
                options: [
                    "Levantar, classificar e validar corretamente os requisitos não funcionais.",
                    "Utilizar herança e encapsulamento na programação.",
                    "Aplicar exclusivamente manutenção corretiva e adaptativa.",
                    "Criar diagramas de casos de uso após a entrega em produção."
                ],
                answer: "Levantar, classificar e validar corretamente os requisitos não funcionais."
            },
            {
                id: 11,
                instruction: "Arquitetura e Sustentação",
                scenario: "Uma empresa de streaming precisa garantir que falhas no serviço de pagamento não derrubem o serviço de assistir a filmes.",
                text: "Esse tipo de separação para criar sistemas escaláveis e fáceis de manter é foco de qual área de estudo?",
                options: [
                    "Projeto e Arquitetura de Software (Padrões como Camadas, Microsserviços).",
                    "Ciclo Clássico em Espiral e Prototipação.",
                    "Elaboração de requisitos voltados apenas a usuários finais.",
                    "Gerência da Configuração Local em Git."
                ],
                answer: "Projeto e Arquitetura de Software (Padrões como Camadas, Microsserviços)."
            },
            {
                id: 12,
                instruction: "O Pós-Lançamento",
                scenario: "O aplicativo foi lançado e está no ar. A equipe de gestão logo afirma: 'Acabou, nosso trabalho aqui está feito, vamos para outro'.",
                text: "Por que essa visão está incorreta do ponto de vista do ciclo de vida do software?",
                options: [
                    "Porque o software não morre no lançamento; ele exige estratégias de evolução e manutenções corretivas/adaptativas.",
                    "Porque não se pode iniciar outro projeto sem antes apagar os repositórios Git antigos.",
                    "Porque o prazo só é validado quando a inteligência artificial audita o código final.",
                    "Porque o cliente sempre reduzirá o custo (orçamento) após o lançamento."
                ],
                answer: "Porque o software não morre no lançamento; ele exige estratégias de evolução e manutenções corretivas/adaptativas."
            },
            {
                id: 13,
                instruction: "Documentação e Práticas Colaborativas",
                scenario: "O principal arquiteto da equipe ganhou na loteria e sumiu. Ninguém mais sabe como atualizar os manuais e integrar serviços.",
                text: "O que faltou na equipe para manter todos 'na mesma página'?",
                options: [
                    "A elaboração rigorosa de documentação técnica e especificações compartilhadas.",
                    "O uso de metodologias cascata para impedir que funcionários saiam da empresa.",
                    "O encapsulamento de todos os requisitos funcionais no banco de dados.",
                    "A garantia da empatia na construção do produto final."
                ],
                answer: "A elaboração rigorosa de documentação técnica e especificações compartilhadas."
            },
            {
                id: 14,
                instruction: "Definição de Projeto vs Rotina",
                scenario: "O setor de TI executa scripts de backup às 2h da manhã todos os dias, ininterruptamente, há 3 anos.",
                text: "Por que essa atividade NÃO é classificada como um projeto de software segundo os conceitos formais?",
                options: [
                    "Porque é uma rotina diária e contínua, enquanto projetos são esforços temporários com início, meio e fim.",
                    "Porque os scripts são automatizados e não requerem gerência de configuração.",
                    "Porque não impacta diretamente a escalabilidade do sistema em nuvem.",
                    "Porque gerenciar backups não possui restrições de custo e tempo."
                ],
                answer: "Porque é uma rotina diária e contínua, enquanto projetos são esforços temporários com início, meio e fim."
            },
            {
                id: 15,
                instruction: "A Ordem a partir do Caos",
                scenario: "Um grupo de 5 excelentes programadores decide fazer um app do zero sentando e digitando o código na mesma hora, sem regras.",
                text: "Qual é a principal consequência esperada dessa falta de gerenciamento de projetos?",
                options: [
                    "Receita perfeita para o fracasso devido à falta de previsibilidade, alinhamento e otimização de recursos.",
                    "Um desenvolvimento muito mais ágil, pois elimina o trabalho com burocracia de arquitetura.",
                    "A criação espontânea de um código livre de gargalos estruturais.",
                    "A minimização drástica dos custos, uma vez que não há gerentes cobrando horas."
                ],
                answer: "Receita perfeita para o fracasso devido à falta de previsibilidade, alinhamento e otimização de recursos."
            },
            {
                id: 16,
                instruction: "Antecipação e Gerenciamento",
                scenario: "O e-commerce da empresa crashou na Black Friday porque os servidores não aguentaram o volume massivo, paralisando as vendas.",
                text: "Qual finalidade específica do gerenciamento deveria ter prevenido esse desastre?",
                options: [
                    "A gestão de riscos, que serve para antecipar problemas antes que afundem o trabalho.",
                    "A previsibilidade focada estritamente em cronogramas de entrega.",
                    "A garantia da qualidade baseada apenas em interfaces responsivas e amigáveis.",
                    "O controle unificado do código via Git."
                ],
                answer: "A gestão de riscos, que serve para antecipar problemas antes que afundem o trabalho."
            },
            {
                id: 17,
                instruction: "Fase de Iniciação",
                scenario: "Um cliente teve uma ideia para um app de delivery de drones, mas a equipe não sabe se é legalmente possível ou financeiramente viável construir isso hoje.",
                text: "Em qual fase do ciclo de vida essa viabilidade deve ser discutida antes de qualquer orçamento ser fechado?",
                options: [
                    "Na Iniciação, onde o projeto nasce e o objetivo principal é validado.",
                    "No Monitoramento e Controle, ao checar se a ideia gerou bugs.",
                    "No Encerramento, após verificar se o cliente aprovou o protótipo funcional.",
                    "Na Execução, enquanto a equipe tenta programar a rota do drone."
                ],
                answer: "Na Iniciação, onde o projeto nasce e o objetivo principal é validado."
            },
            {
                id: 18,
                instruction: "Fase de Planejamento",
                scenario: "A equipe já sabe o que vai construir. Agora eles estão decidindo que usarão Python, estipularam 4 meses de prazo e definiram quem fará cada módulo.",
                text: "Essa definição de cronograma, tecnologias e responsabilidades ocorre em qual fase?",
                options: [
                    "Planejamento.",
                    "Monitoramento e Controle.",
                    "Execução.",
                    "Iniciação."
                ],
                answer: "Planejamento."
            },
            {
                id: 19,
                instruction: "Fase de Execução",
                scenario: "Os diagramas UML estão aprovados, o cronograma está fechado. Hoje os programadores abriram suas IDEs e começaram a digitar as primeiras classes.",
                text: "Qual é o nome técnico da etapa onde a equipe, literalmente, coloca a 'mão na massa'?",
                options: [
                    "Execução.",
                    "Iniciação e Planejamento Híbrido.",
                    "Gerência de Configuração Final.",
                    "Monitoramento Iterativo."
                ],
                answer: "Execução."
            },
            {
                id: 20,
                instruction: "O Sentinela Constante",
                scenario: "Apesar do planejamento ter sido perfeito, o gerente verifica diariamente se o dinheiro gasto condiz com o orçamento e se as entregas estão no prazo.",
                text: "Qual fase do projeto abraça as demais por estar sempre checando e ajustando a rota?",
                options: [
                    "Monitoramento e Controle.",
                    "Encerramento de Iterações.",
                    "Iniciação Perpétua.",
                    "A Etapa de Planejamento Restrito."
                ],
                answer: "Monitoramento e Controle."
            },
            {
                id: 21,
                instruction: "O Balanço Final",
                scenario: "O aplicativo de RH foi implantado na empresa, o cliente adorou e assinou o termo de aceitação. A equipe foi desmobilizada logo em seguida.",
                text: "O que a equipe negligenciou fazer, segundo a teoria sobre a Fase de Encerramento?",
                options: [
                    "Esqueceram de fazer um balanço geral e coletar as lições aprendidas (o que deu certo ou errado).",
                    "Esqueceram de reiniciar o planejamento para criar uma rotina contínua.",
                    "Falharam em aplicar uma manutenção adaptativa imediata no cliente.",
                    "Não aumentaram o escopo para aproveitar o resto do dinheiro."
                ],
                answer: "Esqueceram de fazer um balanço geral e coletar as lições aprendidas (o que deu certo ou errado)."
            },
            {
                id: 22,
                instruction: "O Triângulo de Ferro: Aumentando Escopo",
                scenario: "Você concordou em entregar um app de fotos com 5 telas em 2 meses, por 10 mil reais. Faltando 1 mês, o cliente exige colocar edição de vídeos no app (5 novas telas).",
                text: "Segundo a restrição tripla, o que obrigatoriamente acontecerá se você aceitar isso?",
                options: [
                    "O prazo (Tempo) deverá aumentar e/ou o Custo vai subir.",
                    "A qualidade do código final deverá ser reduzida a zero.",
                    "O planejamento será apagado e a fase de iniciação ocorrerá sem custos.",
                    "Nada mudará, apenas o esforço da máquina será redistribuído pela IA."
                ],
                answer: "O prazo (Tempo) deverá aumentar e/ou o Custo vai subir."
            },
            {
                id: 23,
                instruction: "O Triângulo de Ferro: Reduzindo Tempo",
                scenario: "Sua diretoria avisa que o concorrente vai lançar o mesmo sistema que vocês estão criando amanhã, exigindo que o seu projeto saia 1 mês mais cedo do que o planejado.",
                text: "Para cumprir esse prazo menor, quais são as ações de sacrifício viáveis no triângulo?",
                options: [
                    "Reduzir o Escopo (cortar funcionalidades) ou aumentar o Custo (contratar mais pessoas/hora extra).",
                    "Entregar o dobro de escopo para compensar a correria da diretoria.",
                    "Desistir da manutenção corretiva garantindo que os clientes encontrem os bugs.",
                    "Reduzir drasticamente o custo para forçar a agilidade dos programadores."
                ],
                answer: "Reduzir o Escopo (cortar funcionalidades) ou aumentar o Custo (contratar mais pessoas/hora extra)."
            },
            {
                id: 24,
                instruction: "O Triângulo de Ferro: Corte de Verba",
                scenario: "A crise global bateu na porta e a verba do projeto que você gerencia foi cortada exatamente pela metade. O prazo não pode mudar de forma alguma.",
                text: "Para salvar o projeto dentro dessas restrições, o que será inevitável?",
                options: [
                    "Entregar um sistema mais simples com funcionalidades reduzidas (Menos Escopo).",
                    "Aumentar o escopo para atrair mais clientes pagantes.",
                    "Pedir para a IA generativa cobrir 100% da verba extra com servidores grátis.",
                    "Pular a fase de execução e ir direto para o encerramento do produto."
                ],
                answer: "Entregar um sistema mais simples com funcionalidades reduzidas (Menos Escopo)."
            },
            {
                id: 25,
                instruction: "Qualidade vs Refinamento Técnico",
                scenario: "Um sistema de cadastro de senhas é desenvolvido com a arquitetura mais moderna e cara do mercado, sem nenhum erro no servidor.",
                text: "Contudo, nenhum usuário consegue cadastrar a senha por conta de uma regra visual complexa. A qualidade falhou em qual preceito?",
                options: [
                    "Na adequação ao uso, já que o cliente não consegue atingir o objetivo dele sem frustração.",
                    "No planejamento rigoroso do ciclo de vida em Cascata.",
                    "No triângulo de ferro, já que o escopo ultrapassou o orçamento previsto.",
                    "No fornecimento de manutenção Perfectiva de forma passiva."
                ],
                answer: "Na adequação ao uso, já que o cliente não consegue atingir o objetivo dele sem frustração."
            },
            {
                id: 26,
                instruction: "A Falácia dos Requisitos",
                scenario: "Sua equipe construiu uma rede social perfeita. Mas o contrato dizia claramente que o cliente queria um sistema de estoque.",
                text: "Sendo extremo, o código é de altíssima qualidade técnica, mas falha absurdamente em qual aspecto de Qualidade do Software?",
                options: [
                    "O atendimento aos requisitos (fazer o que o escopo determinou).",
                    "A falta de aplicação de testes automáticos antes de subir em nuvem.",
                    "O corte severo nos custos durante a prototipação.",
                    "O uso de uma metodologia ágil em vez de tradicional."
                ],
                answer: "O atendimento aos requisitos (fazer o que o escopo determinou)."
            },
            {
                id: 27,
                instruction: "A Linha do Tempo da Qualidade",
                scenario: "O arquiteto da empresa estipula que a equipe vai passar 6 meses escrevendo código cru, e só vão testar a qualidade na última semana do mês 6.",
                text: "De acordo com os preceitos de qualidade de projetos, qual o erro gravíssimo dessa abordagem?",
                options: [
                    "A qualidade não é injetada no final; ela deve ser monitorada desde a primeira linha de código (testes contínuos).",
                    "O custo da última semana será reduzido pelas metodologias tradicionais.",
                    "O erro é gastar só uma semana testando; o ideal seria não testar para economizar prazo.",
                    "Só será possível testar usando Git, que só pode ser usado na última etapa."
                ],
                answer: "A qualidade não é injetada no final; ela deve ser monitorada desde a primeira linha de código (testes contínuos)."
            },
            {
                id: 28,
                instruction: "O Alinhamento Estratégico",
                scenario: "Um gestor percebe que os desenvolvedores estão criando ferramentas que o cliente final nunca pediu, apenas porque acharam 'divertido de programar'.",
                text: "Esse comportamento desvia de qual princípio essencial da gestão de projetos?",
                options: [
                    "Do Alinhamento, que visa garantir que a equipe construa exatamente aquilo de que o cliente necessita.",
                    "Do Encerramento, que permite aos programadores testarem conceitos livres.",
                    "Da Execução controlada pelas metodologias em Espiral Clássica.",
                    "Do Triângulo de Ferro focando no aumento indiscriminado da restrição temporal."
                ],
                answer: "Do Alinhamento, que visa garantir que a equipe construa exatamente aquilo de que o cliente necessita."
            },
            {
                id: 29,
                instruction: "Desperdício e Otimização",
                scenario: "A equipe de design e desenvolvimento fica 2 meses parada esperando aprovações do cliente para começar a programar, encarecendo o orçamento.",
                text: "A falta de acompanhamento afetou negativamente qual finalidade de gestão?",
                options: [
                    "A otimização de recursos (desperdício de tempo e dinheiro da empresa e equipe técnica).",
                    "A validação arquitetural das estruturas MVC e orientadas a objetos.",
                    "A previsão de manutenções corretivas em hardware.",
                    "A construção dos manuais de uso para os testadores de usabilidade."
                ],
                answer: "A otimização de recursos (desperdício de tempo e dinheiro da empresa e equipe técnica)."
            },
            {
                id: 30,
                instruction: "A Sinergia e a Ferramenta",
                scenario: "Após concluir a disciplina, um aluno resume seu aprendizado dizendo: 'Descobri que a inteligência artificial não vai roubar meu emprego, ela vai ser meu martelo elétrico'.",
                text: "Dentro da analogia de construção civil apresentada, o que representa a Engenharia de Software nessa sinergia?",
                options: [
                    "Representa a planta da casa e o gerenciamento seguro da obra.",
                    "Representa o prego a ser batido pelas novas versões gerativas.",
                    "Representa o chão de terra vazio antes do contrato de iniciação.",
                    "Representa a burocracia desnecessária que impede a obra de começar."
                ],
                answer: "Representa a planta da casa e o gerenciamento seguro da obra."
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
            await typeWriter(`Carregando Desafio de Gestão e Engenharia ${currentQuestion.value.id}...`, "log-info");
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Raciocínio de gestão validado com sucesso.";
                addLog("Sucesso: Decisão gerencial precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Abordagem incorreta para o ciclo de vida.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Falha na validação de premissas. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos fundamentos de Engenharia de Software e Gestão de Projetos.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão dos conceitos teóricos do Triângulo de Ferro e Ciclo de Vida do Software.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho Executivo</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Projeto e Engenharia de Software</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo planejamento estratégico, gestão de restrições de projetos e a essência ética e colaborativa da engenharia de software na era moderna.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador ALGO_EVAL_v2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `EngSoft_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador de Gestão...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador ALGO_EVAL_v2.0...", "log-info");
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