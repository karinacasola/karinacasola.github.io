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

        // --- Banco de Questões (20 Questões Contextualizadas em Projetos Fictícios) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Requisitos Funcionais vs Não Funcionais",
                scenario: "Contextualização: No desenvolvimento de um aplicativo de delivery corporativo, o Product Owner estipulou que 'os clientes devem poder acompanhar a localização do motoboy no mapa em tempo real'.",
                text: "Enunciado: Na Engenharia de Requisitos, como esse item solicitado pelo Product Owner deve ser classificado?",
                options: [
                    "Requisito Funcional, pois descreve uma ação ou comportamento direto que o sistema deve realizar para o usuário final.",
                    "Requisito Não Funcional, pois trata exclusivamente do desempenho de atualização de telas do aplicativo.",
                    "Requisito de Domínio, pois é uma lei de trânsito imposta para monitoramento de frotas.",
                    "Requisito Ambíguo, pois não define qual linguagem de programação o mapa utilizará."
                ],
                answer: "Requisito Funcional, pois descreve uma ação ou comportamento direto que o sistema deve realizar para o usuário final."
            },
            {
                id: 2,
                instruction: "Requisitos Não Funcionais de Segurança",
                scenario: "Contextualização: Para o novo sistema do banco nacional, o arquiteto de software definiu uma regra clara na documentação: 'Todas as senhas de clientes no banco de dados devem ser criptografadas usando o padrão AES-256'.",
                text: "Enunciado: Essa definição arquitetural se enquadra em qual categoria de requisitos e por quê?",
                options: [
                    "Requisito Não Funcional, pois estabelece uma restrição técnica de segurança e comportamento do sistema, não uma funcionalidade operada pelo usuário.",
                    "Requisito Funcional de Interface, pois o cliente precisará ver a criptografia na tela ao digitar a senha.",
                    "Diagrama de Máquina de Estados, pois a senha muda de estado de 'aberta' para 'fechada'.",
                    "Regra de Negócio Temporária, pois a criptografia pode ser desligada quando o banco fechar à noite."
                ],
                answer: "Requisito Não Funcional, pois estabelece uma restrição técnica de segurança e comportamento do sistema, não uma funcionalidade operada pelo usuário."
            },
            {
                id: 3,
                instruction: "Requisitos de Domínio (Regras de Negócio)",
                scenario: "Contextualização: Um sistema de controle de ponto está sendo criado para uma multinacional. O analista anotou a seguinte condição dada pelo RH: 'Funcionários sob regime CLT não podem exceder 2 horas extras diárias sob nenhuma circunstância'.",
                text: "Enunciado: No escopo do projeto de software, como essa anotação é classificada?",
                options: [
                    "Como uma Regra de Negócio (Requisito de Domínio), pois é uma restrição do contexto de negócio (imposta pela legislação) que o software deve respeitar e aplicar.",
                    "Como um Requisito Não Funcional de Capacidade, limitando o banco de dados a 2 horas de gravação.",
                    "Como um Teste de Regressão focado em descobrir se os funcionários burlam a catraca física.",
                    "Como uma métrica de Viabilidade Econômica (Payback) para evitar falência pagando horas extras."
                ],
                answer: "Como uma Regra de Negócio (Requisito de Domínio), pois é uma restrição do contexto de negócio (imposta pela legislação) que o software deve respeitar e aplicar."
            },
            {
                id: 4,
                instruction: "Técnicas de Levantamento em Larga Escala",
                scenario: "Contextualização: A prefeitura contratou a sua equipe para modernizar o sistema de bilhetagem do transporte municipal. Há cerca de 4.000 motoristas e fiscais espalhados por 50 garagens que utilizarão os novos validadores embarcados.",
                text: "Enunciado: Qual técnica de levantamento de requisitos é a mais indicada para coletar as dores e necessidades iniciais de uma base tão volumosa e dispersa geograficamente?",
                options: [
                    "Questionários, por permitirem uma coleta padronizada, estruturada e de baixo custo em larga escala sem a necessidade de deslocamento físico.",
                    "Entrevistas diretas em profundidade, agendando reuniões individuais com cada um dos 4.000 funcionários.",
                    "Brainstorming na sala de reuniões do prefeito, envolvendo os 50 gerentes de garagem para criar o código do sistema na hora.",
                    "Diagrama de Sequência, entregando o desenho técnico para os motoristas aprovarem o hardware."
                ],
                answer: "Questionários, por permitirem uma coleta padronizada, estruturada e de baixo custo em larga escala sem a necessidade de deslocamento físico."
            },
            {
                id: 5,
                instruction: "Métodos Tradicionais vs Ágeis",
                scenario: "Contextualização: A startup 'InovaTech' está desenvolvendo um aplicativo concorrente para o setor de mobilidade. O mercado muda toda semana devido à concorrência, e eles precisam lançar recursos novos a cada 15 dias para testar a adesão dos passageiros.",
                text: "Enunciado: Para esse cenário de alta incerteza, qual modelo de ciclo de vida de software seria desastroso e deveria ser evitado?",
                options: [
                    "O modelo Tradicional (Cascata), pois exige o congelamento de todos os requisitos de forma rígida em etapas iniciais e não lida bem com mudanças ao longo do projeto.",
                    "O modelo Ágil (Scrum), pois seus ciclos de 15 dias (Sprints) são muito lentos para startups modernas.",
                    "A Integração Contínua (CI), porque obriga a testar o código apenas uma vez no final de cada ano.",
                    "A implementação do Ciclo PDCA, porque startups não podem perder tempo planejando (Plan)."
                ],
                answer: "O modelo Tradicional (Cascata), pois exige o congelamento de todos os requisitos de forma rígida em etapas iniciais e não lida bem com mudanças ao longo do projeto."
            },
            {
                id: 6,
                instruction: "UML - Diagrama de Casos de Uso",
                scenario: "Contextualização: Durante a reunião de Kick-off de um sistema de loja virtual, o gerente de marketing, que não tem formação técnica, pediu um diagrama visual simples que mostrasse apenas quem usará o sistema e quais ações poderão fazer (ex: 'Cliente realiza compra', 'Estoquista confere produto').",
                text: "Enunciado: Qual diagrama da linguagem UML atende perfeitamente a esse pedido executivo?",
                options: [
                    "Diagrama de Casos de Uso, pois foca na interação entre os atores externos e as funcionalidades do sistema em alto nível estrutural.",
                    "Diagrama de Atividades, pois mapeia as chaves estrangeiras necessárias para o banco de dados processar compras.",
                    "Fluxograma PDCA, mostrando as falhas de código das etapas do carrinho de compras.",
                    "Diagrama de Componentes de Hardware, detalhando a arquitetura dos cabos de rede da loja."
                ],
                answer: "Diagrama de Casos de Uso, pois foca na interação entre os atores externos e as funcionalidades do sistema em alto nível estrutural."
            },
            {
                id: 7,
                instruction: "UML - Diagrama de Classes",
                scenario: "Contextualização: A equipe de back-end que usa Java começou a desenhar a arquitetura de programação para a clínica médica. Eles precisam mapear atributos estruturais (nome, CRM, especialidade) e hierarquias de herança (ex: a entidade 'Médico' e 'Enfermeiro' herdam da entidade 'Funcionário').",
                text: "Enunciado: Qual diagrama UML deve ser utilizado para estruturar essa visão estática orientada a objetos antes de iniciar o código-fonte?",
                options: [
                    "Diagrama de Classes, pois é desenhado exatamente para descrever a estrutura de abstrações, métodos, atributos e as relações entre eles.",
                    "Diagrama de Máquina de Estados, pois garante que o médico só herda dados se estiver no plantão.",
                    "Diagrama de Sequência, pois ele documenta a velocidade em que o banco de dados insere um funcionário.",
                    "Teste Unitário Visual, mapeando a viabilidade de construir a classe em tempo real."
                ],
                answer: "Diagrama de Classes, pois é desenhado exatamente para descrever a estrutura de abstrações, métodos, atributos e as relações entre eles."
            },
            {
                id: 8,
                instruction: "UML - Diagrama de Atividades",
                scenario: "Contextualização: O processo logístico de devolução de produtos do e-commerce (Logística Reversa) tem vários caminhos simultâneos: após o pacote chegar, um funcionário inspeciona fisicamente a avaria, enquanto o sistema, em paralelo, envia e-mails pedindo a conta bancária do cliente para estorno.",
                text: "Enunciado: Se o analista precisa documentar visualmente esse fluxo de trabalho com divisões de tarefas simultâneas (forks/joins) e pontos lógicos de decisão, qual diagrama ele utilizará?",
                options: [
                    "Diagrama de Atividades, por ser excelente para representar fluxos de negócios complexos, sincronismo paralelo e rotinas sistemáticas.",
                    "Diagrama de Casos de Uso, pois este diagrama contém símbolos próprios para processamento assíncrono.",
                    "Testes de Aceitação, pois a devolução só é confirmada visualmente pelo usuário final.",
                    "Definition of Done (DoD), transformando o fluxo físico em um código Java."
                ],
                answer: "Diagrama de Atividades, por ser excelente para representar fluxos de negócios complexos, sincronismo paralelo e rotinas sistemáticas."
            },
            {
                id: 9,
                instruction: "UML - Diagrama de Sequência",
                scenario: "Contextualização: Houve uma falha de sincronia na plataforma de vendas de ingressos. O Arquiteto Sênior precisa entender cronologicamente o trajeto da informação: em qual momento exato a tela 'Interface_Compra' envia a requisição de reserva de assento para o objeto 'Controlador_Setor' e espera o retorno da API do 'Gateway_Bancário'.",
                text: "Enunciado: Qual diagrama comportamental da UML evidencia essa troca de mensagens organizadas em uma linha do tempo?",
                options: [
                    "Diagrama de Sequência, pois foca na interação dinâmica e temporal entre os objetos durante a execução de um cenário específico.",
                    "Diagrama de Classes, pois ele mapeia os milissegundos dos métodos internos do banco de dados.",
                    "Estudo de Viabilidade Econômica (EVTE), onde as requisições geram custo por chamada.",
                    "Diagrama de Estrutura de Retorno, focado apenas nas mensagens HTTP."
                ],
                answer: "Diagrama de Sequência, pois foca na interação dinâmica e temporal entre os objetos durante a execução de um cenário específico."
            },
            {
                id: 10,
                instruction: "Viabilidade Econômica e Payback",
                scenario: "Contextualização: O CEO do hospital aprovou a Viabilidade Técnica do novo sistema de laudos, garantindo que o setor de TI tem a tecnologia necessária. Agora, ele perguntou ao Gerente de Projetos: 'Levando em conta que gastaremos 200 mil reais, em quantos meses a economia gerada em papel e tempo cobrirá esse valor?'",
                text: "Enunciado: Essa análise está inserida em qual pilar de gestão e utiliza qual indicador primário?",
                options: [
                    "Na etapa de Viabilidade Econômica (EVTE), utilizando o indicador financeiro de Payback (tempo de recuperação do investimento).",
                    "Na etapa de Modelagem Cascata, utilizando o indicador técnico de Return of Bug (RoB).",
                    "No ciclo Scrum, medindo a velocidade da equipe na primeira Sprint.",
                    "Na Viabilidade Estrutural, empregando o índice de ROI técnico da linguagem Java."
                ],
                answer: "Na etapa de Viabilidade Econômica (EVTE), utilizando o indicador financeiro de Payback (tempo de recuperação do investimento)."
            },
            {
                id: 11,
                instruction: "Testes Unitários no Dia a Dia",
                scenario: "Contextualização: A programadora Laura acabou de desenvolver o algoritmo de 15 linhas que calcula o desconto especial para assinantes VIP da loja. Ela não integrou ao banco de dados nem conectou na tela da loja web.",
                text: "Enunciado: Antes de compartilhar esse código com o restante da equipe, qual tipo de validação Laura deve escrever para garantir que a fórmula matemática do desconto funciona nas mais variadas condições?",
                options: [
                    "Teste Unitário, escrevendo scripts para validar exclusivamente o componente/função isolada que ela acabou de criar.",
                    "Teste de Regressão Sistêmica, rodando a loja inteira no servidor local para testar 15 linhas de código.",
                    "Teste de Aceitação do Usuário (UAT), chamando o Product Owner para olhar a tela preta de terminal dela.",
                    "Integração Contínua Manual, aprovando ela mesma o código no painel de gerência."
                ],
                answer: "Teste Unitário, escrevendo scripts para validar exclusivamente o componente/função isolada que ela acabou de criar."
            },
            {
                id: 12,
                instruction: "Testes de Integração e Falhas de Comunicação",
                scenario: "Contextualização: O módulo do 'Carrinho' (feito pela Equipe Front) e a API de 'Pagamento do Banco' (feita pela Equipe Back) foram concluídos e passaram impecavelmente nos testes isolados de cada desenvolvedor. Contudo, quando o botão de concluir compra é pressionado para juntar os dois, os dados chegam invertidos e o sistema trava.",
                text: "Enunciado: Qual etapa de qualidade falhou ou não foi executada rigorosamente para antecipar esse tipo de problema?",
                options: [
                    "Testes de Integração, cuja finalidade primária é validar a comunicação, os contratos de APIs e o fluxo de dados entre módulos distintos.",
                    "Testes Unitários, já que o código do front-end estava visualmente corrompido.",
                    "Estudo de Viabilidade, pois não sabiam se o banco processava integrações web.",
                    "Ciclo PDCA, pois falharam em planejar (Plan) o orçamento de pagamento do cliente."
                ],
                answer: "Testes de Integração, cuja finalidade primária é validar a comunicação, os contratos de APIs e o fluxo de dados entre módulos distintos."
            },
            {
                id: 13,
                instruction: "Garantia de Qualidade (Testes de Regressão)",
                scenario: "Contextualização: Em um sistema escolar que está no ar há 2 anos, a equipe alterou o cadastro de alunos para aceitar CPFs estrangeiros. Uma semana depois, os professores reclamaram que o botão de 'Gerar Boletim', que ficava em outra página e não havia sido mexido, passou a travar inexplicavelmente.",
                text: "Enunciado: Para evitar que novos desenvolvimentos destruam as funções antigas já estabilizadas, a equipe deveria possuir uma esteira automatizada aplicando o conceito de:",
                options: [
                    "Testes de Regressão, que tem a função de retestar todo o legado do sistema após uma modificação no código-fonte.",
                    "Testes de Aceitação de Mudanças (MAC), que proíbem alunos estrangeiros de ter boletins.",
                    "Refatoração Estática, impedindo o deploy (entrega) se o código possuir mais de 2 anos.",
                    "Engenharia de Requisitos Contínua, reentrevistando os clientes a cada linha de código inserida."
                ],
                answer: "Testes de Regressão, que tem a função de retestar todo o legado do sistema após uma modificação no código-fonte."
            },
            {
                id: 14,
                instruction: "Ciclo Ágil: Definition of Done (DoD)",
                scenario: "Contextualização: O programador Carlos arrastou seu cartão no Jira para a coluna 'Concluído' pois a tela de login estava abrindo. O Scrum Master devolveu a tarefa, avisando que, segundo as regras do time, ele não incluiu a cobertura mínima de 80% de testes nem rodou o analisador de vulnerabilidades de segurança.",
                text: "Enunciado: Em um contexto de Metodologias Ágeis e Qualidade, em qual conceito vital o Scrum Master baseou sua cobrança?",
                options: [
                    "Na Definition of Done (Definição de Pronto), que formaliza um checklist inegociável de qualidade e padrões que todo incremento de trabalho deve atender para ser entregue.",
                    "Na Viabilidade Econômica, pois cada tarefa reprovada debita do salário do desenvolvedor.",
                    "No Diagrama de Atividades do Scrum Master, que o obriga a reprovar 1 de cada 3 tarefas no quadro ágil.",
                    "Na fase 'Act' do PDCA de rotina, atuando apenas sobre problemas visuais da tela de login."
                ],
                answer: "Na Definition of Done (Definição de Pronto), que formaliza um checklist inegociável de qualidade e padrões que todo incremento de trabalho deve atender para ser entregue."
            },
            {
                id: 15,
                instruction: "Homologação e Teste de Aceitação (UAT)",
                scenario: "Contextualização: O painel financeiro passou nos rigorosos testes da equipe de TI e nas verificações automáticas de servidor. O sistema foi instalado no ambiente de Homologação e liberado para os analistas fiscais (os donos reais do processo) utilizarem por três dias antes de subir definitivamente para produção.",
                text: "Enunciado: Essa validação no ponto de vista do fluxo de negócios feita por quem encomendou o software é chamada de:",
                options: [
                    "Testes de Aceitação do Usuário (UAT), garantindo que as expectativas reais operacionais foram atendidas.",
                    "Teste de Regressão Unitária, focada apenas na carga da tabela do banco de dados financeiro.",
                    "Sprints de Revisão Cascata, uma técnica legada abolida por frameworks ágeis.",
                    "Levantamento de Requisitos Final (LRF), feito para mapear regras de negócio pela primeira vez."
                ],
                answer: "Testes de Aceitação do Usuário (UAT), garantindo que as expectativas reais operacionais foram atendidas."
            },
            {
                id: 16,
                instruction: "Aplicação Prática do Ciclo PDCA - Fase Plan",
                scenario: "Contextualização: A equipe de suporte notou que 40% das reclamações dos usuários na última semana referiam-se a esquecimento de senhas e travamentos do servidor. Diante disso, a gerência puxou uma reunião, listou as causas-raiz usando planilhas, desenhou uma meta de reduzir os chamados para 10% e propôs adicionar um botão 'Recuperar Via SMS'.",
                text: "Enunciado: Baseando-se no ciclo contínuo de gestão de processos, a equipe concluiu a execução rigorosa de qual fase do PDCA?",
                options: [
                    "Fase Planejar (Plan), pois consistiu na identificação de um problema, estudo do cenário e estabelecimento de uma métrica e um plano de ação estruturado.",
                    "Fase Executar (Do), pois a reunião já resolveu imediatamente o problema prático na visão do cliente final.",
                    "Fase Checar (Check), pois limitaram-se apenas a ler as reclamações no sistema de chamados.",
                    "Fase Agir (Act), padronizando que os usuários nunca mais recuperarão senhas sem SMS."
                ],
                answer: "Fase Planejar (Plan), pois consistiu na identificação de um problema, estudo do cenário e estabelecimento de uma métrica e um plano de ação estruturado."
            },
            {
                id: 17,
                instruction: "Aplicação Prática do Ciclo PDCA - Fase Check e Act",
                scenario: "Contextualização: O recurso de 'Recuperar Via SMS' idealizado pela gerência entrou no ar de forma controlada apenas para clientes Beta (Fase 'Do'). Passada uma semana, o analista comparou: os chamados caíram, mas o custo dos envios de SMS estourou o orçamento mensal previsto.",
                text: "Enunciado: Se a fase de validação (Check) revelou esse desvio na eficácia da meta, como a equipe deve prosseguir com a fase final de Agir (Act)?",
                options: [
                    "No Act, a equipe deve analisar a anomalia do custo, propor uma correção (como substituir SMS por e-mail no plano) e reiniciar o ciclo PDCA corrigindo o processo.",
                    "O Act deve ser cancelado, retornando imediatamente para a etapa de Testes Unitários dos servidores da equipe.",
                    "A fase Act orienta padronizar o processo permanentemente, independente do custo orçamentário ter ultrapassado os limites lógicos estabelecidos.",
                    "A equipe pula a etapa e transfere a responsabilidade orçamentária para a Viabilidade Econômica."
                ],
                answer: "No Act, a equipe deve analisar a anomalia do custo, propor uma correção (como substituir SMS por e-mail no plano) e reiniciar o ciclo PDCA corrigindo o processo."
            },
            {
                id: 18,
                instruction: "Simbologia em Fluxogramas Corporativos",
                scenario: "Contextualização: O novo estagiário desenhou no Visio o processo de aprovação de contratos da diretoria jurídica. Ao chegar no passo onde está escrito 'O valor do contrato passa de R$ 50 mil?', ele usou um símbolo redondo. O seu gerente corrigiu rapidamente indicando a regra de notação para bifurcações.",
                text: "Enunciado: Qual figura geométrica padronizada em fluxogramas o estagiário deveria utilizar obrigatoriamente para mapear essa condição decisória de 'Sim' e 'Não'?",
                options: [
                    "O Losango (◇), utilizado exclusivamente como estrutura que exige um ponto lógico de decisão dividindo o fluxo.",
                    "O Retângulo (□), reservado para marcar o início de uma análise financeira de Payback da corporação.",
                    "O Cilindro (▤), designando o servidor em nuvem que armazenará a assinatura digital do contrato.",
                    "O Paralelogramo (▱), para assinalar a saída física do documento impresso nas mãos do gerente."
                ],
                answer: "O Losango (◇), utilizado exclusivamente como estrutura que exige um ponto lógico de decisão dividindo o fluxo."
            },
            {
                id: 19,
                instruction: "Integração Contínua (CI) e Automação",
                scenario: "Contextualização: Antigamente, na agência web em que Pedro trabalhava, juntar os códigos de três desenvolvedores em um servidor nas sextas-feiras levava horas e gerava vários erros de compilação chamados de 'Inferno da Integração'. Na nova equipe, cada clique em enviar código engatilha robôs que validam tudo em nuvem em 3 minutos.",
                text: "Enunciado: Qual prática fundamental de engenharia de software salvou as madrugadas de Pedro e de sua nova equipe técnica?",
                options: [
                    "A adoção de pipelines de Integração Contínua (CI), forçando compilações regulares e testes unitários automatizados a cada submissão (commit) do desenvolvedor no repositório.",
                    "A implementação do modelo Cascata, que separa programadores em prédios distantes, evitando o choque do código.",
                    "A utilização de Questionários Ágeis enviados semanalmente pedindo que as equipes concordem em não criar bugs.",
                    "O teste de Aceitação contínuo executado manualmente pela secretária executiva a cada modificação subida."
                ],
                answer: "A adoção de pipelines de Integração Contínua (CI), forçando compilações regulares e testes unitários automatizados a cada submissão (commit) do desenvolvedor no repositório."
            },
            {
                id: 20,
                instruction: "UML - Diagrama de Componentes de Arquitetura",
                scenario: "Contextualização: A Netflix brasileira precisa que o time de infraestrutura em nuvem crie os servidores. Para entenderem o tamanho do trabalho, foi entregue a eles um mapeamento mostrando as caixas do módulo de Pagamento, do módulo Recomendador de Vídeos e da API de Autenticação, ligados por dependências.",
                text: "Enunciado: Que diagrama a equipe de arquitetura forneceu para auxiliar os provedores de infraestrutura nessa visualização macro dos módulos?",
                options: [
                    "Diagrama de Componentes, perfeito para exibir a organização, distribuição em módulos independentes interligados e a montagem física da arquitetura do software.",
                    "Diagrama de Casos de Uso, descrevendo a arquitetura a partir da perspectiva tátil do controle remoto usado pelo cliente na sala.",
                    "Diagrama de Máquina de Estados, para transitar os componentes entre ligado na tomada e desligado da energia geral.",
                    "Estudo de Viabilidade Econômica, em formato vetorial UML exibindo cifrões em cima das conexões de banco."
                ],
                answer: "Diagrama de Componentes, perfeito para exibir a organização, distribuição em módulos independentes interligados e a montagem física da arquitetura do software."
            }
        ]);

        // =========================================================================
        // Algoritmo seguro de Embaralhamento (Fisher-Yates)
        // Embaralha as posições aleatoriamente garantindo dinamismo real a cada reload
        // =========================================================================
        const shuffleArray = (array) => {
            const newArray = [...array]; 
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        };

        // Aplica o embaralhamento para todas as opções de cada questão
        questions.value.forEach(question => {
            question.options = shuffleArray(question.options);
        });

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
            await typeWriter(`Carregando Simulação Prática do Módulo ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Simulação concluída com sucesso. Processando resultados corporativos para emissão de certificado...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Avaliação Correta! Decisão validada com os conceitos de arquitetura e negócios.";
                addLog("Aprovação Técnica: Resolução compatível com boas práticas.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2800);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Limite de tentativas. A conduta correta esperada para esse cenário era: <br><strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Estratégica: Desvio conceitual detectado na análise da simulação.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 5000);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise em desacordo com as diretrizes teóricas. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Revisão Necessária: Erro analítico detectado. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente proficiência na identificação, modelagem estrutural e resolução de problemas gerenciais em projetos de software.";
            if (score.value < 14) performanceMsg = "Recomenda-se reforço nos conceitos base associando teoria à resolução tática de Requisitos, PDCA e Gestão Ágil de falhas.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho Prático</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Gestão, Análise UML e Qualidade</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Imersão:</strong> ${data}</p>
                    <p>Este documento homologa a travessia de ${questions.value.length} cases de estudo baseados em situações corporativas verossímeis. O escopo abarcou desde a extração técnica de Requisitos (Funcionais, Regras de Negócio e de Usabilidade), escolha de ciclos (Cascata ou Ágil), padronização de modelagens gráficas complexas em UML (Casos de uso, Estrutura Estática e Comportamento Sequencial), até a aplicação do Ciclo PDCA e esteiras de automação de Testes Sistêmicos (QA).</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador Técnico (Score Final)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 16 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Cases Resolvidos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico Algorítmico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Simulação Prática auditada pelo motor INNOV_EVAL_v2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Certificado_Cases_TI_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando motor simulador de cenários corporativos...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Módulo de Simulação Carregado. Configurando ecossistema...", "log-info");
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