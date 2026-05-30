const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
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

        // --- Banco de 50 Questões (Aulas 1 e 2 - Manutenção de Sistemas) ---
        const questions = ref([
            // --- AULA 2: CONCEITOS E TIPOS DE MANUTENÇÃO ---
            {
                id: 1,
                instruction: "Definição de Manutenção de Sistemas.",
                scenario: "Sua equipe de TI acabou de entregar um sistema de software e o cliente questiona qual o papel da manutenção daqui para frente.",
                text: "Como a manutenção de sistemas é definida?",
                options: [
                    "É a criação de um software completamente novo para substituir um antigo.",
                    "Atividades técnicas realizadas após a entrega do sistema para corrigir falhas, melhorar desempenho ou adaptá-lo.",
                    "O processo exclusivo de atualizar o banco de dados do cliente anualmente.",
                    "A etapa de testes de aceitação realizada antes da entrega do sistema."
                ],
                answer: "Atividades técnicas realizadas após a entrega do sistema para corrigir falhas, melhorar desempenho ou adaptá-lo."
            },
            {
                id: 2,
                instruction: "Classificação da Manutenção.",
                scenario: "Existem diferentes focos quando operamos a manutenção em um software, variando conforme a natureza da mudança.",
                text: "Quais são os quatro tipos de classificação da manutenção?",
                options: [
                    "Corretiva, Preventiva, Adaptativa e Preditiva.",
                    "Corretiva, Evolutiva, Regressiva e Estrutural.",
                    "Passiva, Ativa, Funcional e Técnica.",
                    "Detectiva, Preventiva, Lógica e Física."
                ],
                answer: "Corretiva, Preventiva, Adaptativa e Preditiva."
            },
            {
                id: 3,
                instruction: "Manutenção Corretiva.",
                scenario: "Um cliente abre um ticket com prioridade alta informando um 'Erro na data de emissão de uma nota fiscal'.",
                text: "Qual é o objetivo principal da manutenção corretiva?",
                options: [
                    "Antecipar possíveis falhas estruturais antes que ocorram.",
                    "Modificar o sistema para adequá-lo a novos ambientes.",
                    "Corrigir falhas identificadas após a entrega do sistema.",
                    "Implementar melhorias não essenciais para melhorar a estética."
                ],
                answer: "Corrigir falhas identificadas após a entrega do sistema."
            },
            {
                id: 4,
                instruction: "Manutenção Preventiva.",
                scenario: "A equipe de infraestrutura decide atualizar bibliotecas do sistema para evitar vulnerabilidades conhecidas no próximo ano.",
                text: "Como se caracteriza a manutenção preventiva?",
                options: [
                    "Resolve falhas agudas reportadas por usuários finais.",
                    "Atua para evitar falhas futuras, antecipando possíveis problemas.",
                    "Foca apenas em refatorar cores e fontes do sistema.",
                    "Modifica o software exclusivamente para um novo hardware."
                ],
                answer: "Atua para evitar falhas futuras, antecipando possíveis problemas."
            },
            {
                id: 5,
                instruction: "Manutenção Adaptativa.",
                scenario: "Devido a uma mudança de fornecedor, o sistema de vocês precisará ser migrado para outro banco de dados.",
                text: "Este caso enquadra-se em qual tipo de manutenção?",
                options: [
                    "Corretiva.",
                    "Preventiva.",
                    "Adaptativa.",
                    "Preditiva."
                ],
                answer: "Adaptativa."
            },
            {
                id: 6,
                instruction: "Manutenção Preditiva.",
                scenario: "Um desenvolvedor nota que a reorganização das colunas de um relatório facilitaria a leitura, embora o atual já funcione.",
                text: "Essa melhoria identificada durante o uso é um exemplo de manutenção:",
                options: [
                    "Preditiva.",
                    "Corretiva.",
                    "Adaptativa.",
                    "Estrutural."
                ],
                answer: "Preditiva."
            },
            {
                id: 7,
                instruction: "Dimensões da Manutenção (April, 2010).",
                scenario: "As manutenções são divididas em duas grandes dimensões: dimensão de correção e dimensão de melhoria.",
                text: "Quais manutenções pertencem à dimensão de melhoria?",
                options: [
                    "Corretiva e Preventiva.",
                    "Adaptativa e Preditiva.",
                    "Preventiva e Preditiva.",
                    "Corretiva e Adaptativa."
                ],
                answer: "Adaptativa e Preditiva."
            },
            {
                id: 8,
                instruction: "Dimensões da Manutenção (April, 2010).",
                scenario: "Sua equipe atua focada em manter o sistema conforme os requisitos iniciais planejados.",
                text: "Quais tipos compõem a dimensão de correção?",
                options: [
                    "Adaptativa e Preditiva.",
                    "Corretiva e Preventiva.",
                    "Corretiva e Preditiva.",
                    "Adaptativa e Preventiva."
                ],
                answer: "Corretiva e Preventiva."
            },
            {
                id: 9,
                instruction: "Fluxo de Decisão - Ticket Técnico.",
                scenario: "Ao receber um ticket, a primeira pergunta do fluxo (conforme April, 2010) é se trata-se de uma 'Nova funcionalidade'.",
                text: "O que deve ser feito se a resposta for SIM?",
                options: [
                    "Inserir na lista de atividades de imediato.",
                    "Interromper o trabalho atual e atender à falha.",
                    "Requer contato com o administrador do sistema para verificar as melhorias.",
                    "Classificar como manutenção Corretiva."
                ],
                answer: "Requer contato com o administrador do sistema para verificar as melhorias."
            },
            {
                id: 10,
                instruction: "Fluxo de Decisão - Erro Latente.",
                scenario: "O ticket não é falha do sistema nem melhoria funcional, mas a equipe identifica que é um 'Erro latente' (SIM).",
                text: "De acordo com o fluxo, qual o tipo de manutenção e a ação?",
                options: [
                    "Preventiva: Inserir na lista de atividades e tratar como prioridade.",
                    "Corretiva: Interromper o trabalho para atender a falha.",
                    "Adaptativa: Inserir na lista de solicitação e tratar como prioridade.",
                    "Preditiva: Requer contato com o administrador do sistema."
                ],
                answer: "Preventiva: Inserir na lista de atividades e tratar como prioridade."
            },
            {
                id: 11,
                instruction: "Plano de Manutenção.",
                scenario: "Você sugere criar um Plano de Manutenção, mas um colega acha exagero para correções simples.",
                text: "Para que o Plano de Manutenção é essencial?",
                options: [
                    "Para documentar o código-fonte de novos programas em desenvolvimento.",
                    "Apenas para controlar orçamentos de marketing.",
                    "Para manter o controle, padronizar o processo e garantir a continuidade do suporte ao sistema.",
                    "Para criar novos sistemas a partir do zero."
                ],
                answer: "Para manter o controle, padronizar o processo e garantir a continuidade do suporte ao sistema."
            },
            {
                id: 12,
                instruction: "Plano de Manutenção - Introdução.",
                scenario: "Ao redigir o Plano de Manutenção (baseado no template SEPT, 2021), você precisa preencher o item 1 (Introdução).",
                text: "O que deve ser descrito neste item?",
                options: [
                    "Formalização dos acordos entre cliente e mantenedor.",
                    "Descreve o sistema, sua versão e quem será responsável pela manutenção.",
                    "Justificativa para a necessidade de manutenção.",
                    "Escopo de abrangência das ações de manutenção."
                ],
                answer: "Descreve o sistema, sua versão e quem será responsável pela manutenção."
            },
            {
                id: 13,
                instruction: "Plano de Manutenção - O Sistema.",
                scenario: "No item 2 (Sistema) do Plano de Manutenção, deve-se detalhar as partes técnicas e a arquitetura.",
                text: "Qual destas informações compõe o item 'Sistema'?",
                options: [
                    "Projeção de despesas no ciclo de vida.",
                    "Especificação de duração e frequência do suporte.",
                    "A missão, funções, requisitos de interoperabilidade, arquitetura e componentes.",
                    "Os acordos de nível de resposta (SLA)."
                ],
                answer: "A missão, funções, requisitos de interoperabilidade, arquitetura e componentes."
            },
            {
                id: 14,
                instruction: "Plano de Manutenção - Contratos.",
                scenario: "Sua empresa (mantenedora) garante atender incidentes críticos em até 1 hora.",
                text: "Em qual seção do plano de manutenção esta informação é formalizada?",
                options: [
                    "3. Status.",
                    "5. Mantenedor.",
                    "6. Contratos.",
                    "7.5 Atividades Organizacionais."
                ],
                answer: "6. Contratos."
            },
            {
                id: 15,
                instruction: "Plano de Manutenção - Conceito.",
                scenario: "O item 7.1 fala sobre o 'Escopo'.",
                text: "O que define o Escopo no contexto do Conceito de Manutenção?",
                options: [
                    "O custo da ferramenta de chamados.",
                    "O grau de responsabilidade do mantenedor (completo ou limitado).",
                    "A duração e frequência de atualizações do suporte.",
                    "Quais etapas do manual de manutenção serão aplicadas ou excluídas."
                ],
                answer: "O grau de responsabilidade do mantenedor (completo ou limitado)."
            },
            {
                id: 16,
                instruction: "Ferramentas de Suporte a Chamados.",
                scenario: "Para manutenções simples, planilhas podem servir, mas softwares de controle (tickets) são os ideais.",
                text: "Qual é uma funcionalidade fundamental dessas ferramentas?",
                options: [
                    "Geração automática de código-fonte.",
                    "Armazenamento, recuperação das informações e rastreabilidade da comunicação com o solicitante.",
                    "Correção autônoma de falhas preditivas em sistemas operacionais.",
                    "Design automático de relatórios preditivos para a diretoria."
                ],
                answer: "Armazenamento, recuperação das informações e rastreabilidade da comunicação com o solicitante."
            },
            {
                id: 17,
                instruction: "Campos de Chamados (Planilha).",
                scenario: "A equipe de TI criou uma planilha simples de chamados. Há um campo 'ID do Ticket'.",
                text: "Qual o objetivo desse campo?",
                options: [
                    "Fornecer um nome longo e descritivo ao ticket.",
                    "Selecionar um técnico na lista suspensa.",
                    "Atuar como identificador exclusivo preenchido automaticamente.",
                    "Definir a data de vencimento da tarefa."
                ],
                answer: "Atuar como identificador exclusivo preenchido automaticamente."
            },
            {
                id: 18,
                instruction: "Tipos de Suporte (Help-desk x Manutenção).",
                scenario: "O usuário confunde frequentemente a finalidade dos chamados.",
                text: "Qual a diferença apontada no material entre Help-desk e Chamados de Manutenção?",
                options: [
                    "Não há diferença, são nomes idênticos para a mesma equipe.",
                    "Help-desk é exclusivo para manutenção corretiva, o resto é TI.",
                    "Help-desk envolve o atendimento ao cliente geral; Manutenção é para ações preventivas, preditivas, adaptativas ou corretivas do sistema.",
                    "Help-desk só gerencia chamados via telefone, enquanto Manutenção via planilhas."
                ],
                answer: "Help-desk envolve o atendimento ao cliente geral; Manutenção é para ações preventivas, preditivas, adaptativas ou corretivas do sistema."
            },
            {
                id: 19,
                instruction: "Manutenção Corretiva na Prática.",
                scenario: "Ao aplicar uma manutenção corretiva (mudança no código para corrigir falha), há um risco inerente.",
                text: "O que deve SEMPRE ser feito após a aplicação de uma manutenção corretiva?",
                options: [
                    "Cobrar o usuário pelo chamado.",
                    "Alterar o sistema operacional dos servidores.",
                    "Ela sempre deve ser testada, pois pode afetar outras funcionalidades.",
                    "Mudar a arquitetura do banco de dados."
                ],
                answer: "Ela sempre deve ser testada, pois pode afetar outras funcionalidades."
            },
            {
                id: 20,
                instruction: "Múltiplos Tipos no Mesmo Chamado.",
                scenario: "A empresa atualiza o SO, gerando incompatibilidade (adaptativa) e otimizando desempenho (preditiva).",
                text: "Como resolver um chamado que possui múltiplos fatores combinados?",
                options: [
                    "Ignorar o chamado e pedir para abrir dois separados.",
                    "Atendimento composto (equipe divide tarefas) e classificação com múltiplas categorias.",
                    "Focar apenas na correção corretiva e ignorar as melhorias.",
                    "Apagar a funcionalidade incompatível."
                ],
                answer: "Atendimento composto (equipe divide tarefas) e classificação com múltiplas categorias."
            },

            // --- AULA 2: METODOLOGIA SMART E MÉTRICAS ---
            {
                id: 21,
                instruction: "Gerenciamento de Suporte - Metodologia SMART.",
                scenario: "Você está definindo métricas de atendimento baseadas em SMART e focando no 'S' (Specific).",
                text: "O que o critério 'Specific' exige do indicador?",
                options: [
                    "Que ele reflita a realidade da equipe e do ambiente.",
                    "Que seja claro e objetivo, sem ambiguidades.",
                    "Que tenha um prazo definido (mensal, semanal).",
                    "Que possa ser alcançável com os recursos disponíveis."
                ],
                answer: "Que seja claro e objetivo, sem ambiguidades."
            },
            {
                id: 22,
                instruction: "Metodologia SMART: 'M' (Mensurável).",
                scenario: "No momento de avaliar o indicador de resolução técnica, um líder questiona se é possível calculá-lo.",
                text: "O critério Measurable indica que:",
                options: [
                    "Deve ser possível quantificar ou medir os resultados.",
                    "Deve ser genérico e subjetivo.",
                    "O objetivo precisa ser feito dentro de 24 horas.",
                    "Ele é restrito à alta gestão."
                ],
                answer: "Deve ser possível quantificar ou medir os resultados."
            },
            {
                id: 23,
                instruction: "Metodologia SMART: 'A' (Atingível).",
                scenario: "Um gestor quer reduzir as falhas para 0% em 2 dias, mas a equipe aponta que é impossível.",
                text: "Qual critério do SMART foi violado?",
                options: [
                    "Specific (Específico).",
                    "Achievable (Atingível).",
                    "Timely (Temporal).",
                    "Mensurável."
                ],
                answer: "Achievable (Atingível)."
            },
            {
                id: 24,
                instruction: "Métricas de Atendimento: TMA.",
                scenario: "O gestor de T.I. exibe no painel a sigla TMA e diz que precisam reduzi-la.",
                text: "O que significa TMA e o que mede?",
                options: [
                    "Taxa Máxima de Atualização: Mede a frequência de novos patches.",
                    "Tempo Médio de Atendimento: Mede o tempo que a equipe leva para atender um chamado.",
                    "Tempo Mínimo de Acesso: Mede a velocidade da rede corporativa.",
                    "Tratamento Manual de Aplicações: Mede interações manuais no código."
                ],
                answer: "Tempo Médio de Atendimento: Mede o tempo que a equipe leva para atender um chamado."
            },
            {
                id: 25,
                instruction: "Métricas de Atendimento: FCR.",
                scenario: "Um setor orgulha-se de ter um alto FCR, poupando reaberturas de tickets.",
                text: "O que a taxa FCR (First Call Resolution) avalia?",
                options: [
                    "Quantos chamados foram classificados como críticos.",
                    "A velocidade da primeira resposta via chatbot.",
                    "Quantos chamados foram resolvidos no primeiro contato sem retorno.",
                    "O número de faturas canceladas remotamente."
                ],
                answer: "Quantos chamados foram resolvidos no primeiro contato sem retorno."
            },
            {
                id: 26,
                instruction: "Métricas de Satisfação: CSAT.",
                scenario: "Ao fechar o ticket, o sistema dispara um e-mail pedindo nota de 1 a 5 para o atendimento.",
                text: "Qual métrica isso alimenta?",
                options: [
                    "Taxa de reincidência de chamados.",
                    "TMA (Tempo médio de atendimento).",
                    "CSAT (Índice de satisfação do cliente/usuário).",
                    "FCR (Resolução no primeiro contato)."
                ],
                answer: "CSAT (Índice de satisfação do cliente/usuário)."
            },
            {
                id: 27,
                instruction: "Métricas de Manutenibilidade.",
                scenario: "Após a última atualização, o número de relatórios de bugs subiu vertiginosamente.",
                text: "O que o aumento de manutenções corretivas pode indicar segundo Sommerville?",
                options: [
                    "Que o sistema está ficando mais rápido.",
                    "Que mais erros estão sendo introduzidos do que corrigidos, indicando declínio na manutenibilidade.",
                    "Que a manutenção preditiva foi concluída com sucesso.",
                    "Aumento expressivo do CSAT."
                ],
                answer: "Que mais erros estão sendo introduzidos do que corrigidos, indicando declínio na manutenibilidade."
            },
            {
                id: 28,
                instruction: "Tempo Médio para Análise de Impacto.",
                scenario: "A equipe gasta muito tempo descobrindo quais módulos são afetados antes de alterar um código.",
                text: "Se esse tempo (análise de impacto) aumenta, o que isso implica?",
                options: [
                    "Que o sistema está perfeitamente modularizado.",
                    "Que os desenvolvedores não sabem programar.",
                    "Que cada vez mais componentes são afetados, e a manutenibilidade está diminuindo.",
                    "Que a solicitação será classificada como preventiva."
                ],
                answer: "Que cada vez mais componentes são afetados, e a manutenibilidade está diminuindo."
            },

            // --- AULA 1: INDICADORES E CONCEITOS ---
            {
                id: 29,
                instruction: "Indicador x Medida.",
                scenario: "Ao apresentar o relatório, um analista apresenta o 'número de horas trabalhadas' como sendo o Indicador.",
                text: "Qual o erro conceitual nessa afirmação, segundo a Aula 1?",
                options: [
                    "Indicadores não existem em T.I.",
                    "Medidas (quantificações brutas) são importantes para construir indicadores, mas não constituem o indicador em si.",
                    "O 'número de horas trabalhadas' é uma métrica subjetiva.",
                    "Horas não podem ser quantificadas matematicamente."
                ],
                answer: "Medidas (quantificações brutas) são importantes para construir indicadores, mas não constituem o indicador em si."
            },
            {
                id: 30,
                instruction: "ROI x VOI.",
                scenario: "Foi gasto 40 mil reais num software, gerando um retorno direto de 200 mil reais e redução de riscos operacionais (valor qualitativo).",
                text: "Respectivamente, essas métricas (Retorno financeiro x Valor agregado qualitativo) representam:",
                options: [
                    "PDCA e CSAT.",
                    "ROI (Return of Investment) e VOI (Value of Investment).",
                    "HTSI e HISI.",
                    "TMA e TISI."
                ],
                answer: "ROI (Return of Investment) e VOI (Value of Investment)."
            },
            {
                id: 31,
                instruction: "Ciclo PDCA: Plan.",
                scenario: "A equipe adota o ciclo PDCA para estruturar a melhoria contínua de um processo.",
                text: "Quais ações correspondem à fase de Planejamento (Plan)?",
                options: [
                    "Agir de acordo com o avaliado e corrigir falhas.",
                    "Executar as atividades descritas na planta.",
                    "Estabelecer metas, definir processos e métodos.",
                    "Monitorar e comparar resultados efetivos."
                ],
                answer: "Estabelecer metas, definir processos e métodos."
            },
            {
                id: 32,
                instruction: "Ciclo PDCA: Do.",
                scenario: "Após definir as metas de manutenção corretiva, chegou a hora de aplicá-las nos servidores.",
                text: "Essa etapa no roteiro do PDCA pertence a:",
                options: [
                    "Plan (Planejamento)",
                    "Do (Execução)",
                    "Check (Verificação)",
                    "Act (Ação)"
                ],
                answer: "Do (Execução)"
            },
            {
                id: 33,
                instruction: "Ciclo PDCA: Check.",
                scenario: "O gestor de redes puxa os dados do software gerencial para comparar os resultados com as metas planejadas.",
                text: "Em que fase do PDCA ele se encontra?",
                options: [
                    "Plan",
                    "Do",
                    "Check",
                    "Act"
                ],
                answer: "Check"
            },
            {
                id: 34,
                instruction: "Ciclo PDCA: Act.",
                scenario: "Como as metas foram alcançadas e bem sucedidas, a equipe decide padronizar os novos processos.",
                text: "A padronização e o treinamento (baseados no resultado) fazem parte da fase:",
                options: [
                    "Act (Ação)",
                    "Plan (Planejamento)",
                    "Do (Execução)",
                    "Check (Verificação)"
                ],
                answer: "Act (Ação)"
            },
            {
                id: 35,
                instruction: "Ferramenta 5W2H: O quê?",
                scenario: "Elaborando um plano de ação simples, você começa pela pergunta 'What?'.",
                text: "O que a pergunta 'What' (O quê) tenta responder no método 5W2H?",
                options: [
                    "Quem executará a atividade.",
                    "Onde o processo será executado.",
                    "O que será feito, que produto/serviço o processo produz.",
                    "Como a atividade será executada e monitorada."
                ],
                answer: "O que será feito, que produto/serviço o processo produz."
            },
            {
                id: 36,
                instruction: "Ferramenta 5W2H: Por quê?",
                scenario: "Você explica à equipe a importância do plano de migração para o novo data center.",
                text: "Essa justificativa responde a qual letra do 5W2H?",
                options: [
                    "When (Quando)",
                    "Why (Por quê)",
                    "Who (Quem)",
                    "Where (Onde)"
                ],
                answer: "Why (Por quê)"
            },
            {
                id: 37,
                instruction: "Ferramenta 5W2H: Onde?",
                scenario: "A implantação do novo antivírus será feita de forma restrita apenas nos 'Servidores de Produção na filial sul'.",
                text: "Qual pergunta do 5W2H cobre esta definição?",
                options: [
                    "Where (Onde)",
                    "When (Quando)",
                    "How (Como)",
                    "How Much (Quanto)"
                ],
                answer: "Where (Onde)"
            },
            {
                id: 38,
                instruction: "Ferramenta 5W2H: Quando?",
                scenario: "A janela de manutenção ocorrerá no dia 10 de junho, às 14h.",
                text: "Essa definição de prazos e datas responde ao:",
                options: [
                    "Why",
                    "What",
                    "When",
                    "Who"
                ],
                answer: "When"
            },
            {
                id: 39,
                instruction: "Ferramenta 5W2H: Quem?",
                scenario: "O analista de redes 'Carlos', está designado para atualizar os firewalls.",
                text: "Definir os responsáveis pelas atividades responde ao:",
                options: [
                    "Why",
                    "How",
                    "Who",
                    "Where"
                ],
                answer: "Who"
            },
            {
                id: 40,
                instruction: "Ferramenta 5W2H: Como?",
                scenario: "O plano descreve que a atualização ocorrerá via script PowerShell remoto em modo silencioso.",
                text: "Esta especificação do método utilizado responde ao:",
                options: [
                    "What",
                    "Why",
                    "How",
                    "How Much"
                ],
                answer: "How"
            },
            {
                id: 41,
                instruction: "Ferramenta 5W2H: Quanto?",
                scenario: "A atualização precisará de R$ 500,00 para licenças adicionais.",
                text: "A determinação do custo entra em qual categoria?",
                options: [
                    "How Much / How Many",
                    "Why",
                    "What",
                    "Where"
                ],
                answer: "How Much / How Many"
            },
            {
                id: 42,
                instruction: "Apresentação de Indicadores.",
                scenario: "O documento padrão de indicadores possui partes como Denominação, Propósito, Conceito...",
                text: "Qual destas partes explica 'de onde são recuperados os dados da apuração'?",
                options: [
                    "Forma de apuração.",
                    "Metadados.",
                    "Variação.",
                    "Sigla."
                ],
                answer: "Metadados."
            },
            {
                id: 43,
                instruction: "Indicador: Variação.",
                scenario: "O indicador 'Interrupção de Sistemas' quer ser o mais baixo possível. O 'Receita Gerada' quer ser o mais alto.",
                text: "Essas características refletem, respectivamente, quais tipos de variação?",
                options: [
                    "A interrupção é Positiva; a receita é Negativa.",
                    "Ambas são Positivas.",
                    "A interrupção é Negativa; a receita é Positiva.",
                    "Não há variação em indicadores fixos."
                ],
                answer: "A interrupção é Negativa; a receita é Positiva."
            },
            {
                id: 44,
                instruction: "Indicadores: HTSI.",
                scenario: "O departamento calculou que o sistema fica no ar 135 horas por mês.",
                text: "Qual é o nome (sigla) deste indicador (Horas de Trabalho)?",
                options: [
                    "HISI (Horas de Interrupção)",
                    "HTSI (Horas de Trabalho dos Sistemas de Informação)",
                    "ISI (Interrupções de Sistemas)",
                    "TISI (Taxa de Interrupções)"
                ],
                answer: "HTSI (Horas de Trabalho dos Sistemas de Informação)"
            },
            {
                id: 45,
                instruction: "Indicadores: TISI.",
                scenario: "A fórmula usada foi: TISI = (HISI / HTSI) * 100",
                text: "O que o indicador TISI expressa?",
                options: [
                    "Receita por Serviço de TI.",
                    "Custos por Serviço de TI.",
                    "A Taxa de Interrupção dos Sistemas de Informação (em %)",
                    "As Horas brutas de interrupção."
                ],
                answer: "A Taxa de Interrupção dos Sistemas de Informação (em %)"
            },
            {
                id: 46,
                instruction: "Indicadores Financeiros: MLBTIC.",
                scenario: "Para achar a margem, subtraiu-se os custos de TI (CSTIC) das receitas de TI (RSTIC).",
                text: "Qual é a fórmula de MLBTIC (Margem de Lucro Bruto dos Serviços de TIC)?",
                options: [
                    "MLBTIC = RSTIC + CSTIC",
                    "MLBTIC = RSTIC - CSTIC",
                    "MLBTIC = (CSTIC / RSTIC) * 100",
                    "MLBTIC = CSTIC - RSTIC"
                ],
                answer: "MLBTIC = RSTIC - CSTIC"
            },
            {
                id: 47,
                instruction: "Análises de Indicadores: 'E se' (What-if).",
                scenario: "O diretor pergunta: 'E se o sistema falhar durante 40 minutos por semana, o que ocorre com a produtividade?'",
                text: "O que a análise do tipo 'E se' busca fazer?",
                options: [
                    "Simular cenários a partir de suposições para prever os efeitos de possíveis mudanças.",
                    "Definir um objetivo fixo e encontrar os valores passados exatos.",
                    "Evitar a coleta de metadados focando na intuição.",
                    "Descartar indicadores operacionais em prol do feeling do gestor."
                ],
                answer: "Simular cenários a partir de suposições para prever os efeitos de possíveis mudanças."
            },
            {
                id: 48,
                instruction: "Análise 'Em Busca de Objetivos' (Goal-seeking).",
                scenario: "A meta fixa é lucrar R$ 4.000,00. A empresa agora procura saber a qual valor a receita precisa chegar se o custo subir.",
                text: "Qual é o princípio desta análise?",
                options: [
                    "Descobrir novos objetivos de forma aleatória e caótica.",
                    "Testar variações hipotéticas irrealistas.",
                    "Parte-se de um objetivo fixo e busca-se descobrir quais valores de entrada devem ser ajustados para atingi-lo.",
                    "Focar unicamente no corte radical de pessoal."
                ],
                answer: "Parte-se de um objetivo fixo e busca-se descobrir quais valores de entrada devem ser ajustados para atingi-lo."
            },
            {
                id: 49,
                instruction: "Organização do Trabalho: Matriz de Prioridades.",
                scenario: "A matriz possui 4 quadrantes (Urgente e Importante, etc.). Você está apagando incêndios num projeto atrasado e vital.",
                text: "Isso pertence a qual quadrante e ação (segundo Daychoum)?",
                options: [
                    "Quadrante 1 (Urgente e Importante): Ação -> Focar.",
                    "Quadrante 2 (Urgente, mas Pouco Importante): Ação -> Delegar.",
                    "Quadrante 3 (Não Urgente, mas Importante): Ação -> Planejar.",
                    "Quadrante 4 (Não Urgente e Pouco Importante): Ação -> Descartar."
                ],
                answer: "Quadrante 1 (Urgente e Importante): Ação -> Focar."
            },
            {
                id: 50,
                instruction: "Organização: Quadrante 4 (Descartar).",
                scenario: "O analista passa 3 horas checando redes sociais ou lendo e-mails desnecessários.",
                text: "Esse comportamento preenche o quadrante 4 da Matriz de Prioridades. Como ele é caracterizado?",
                options: [
                    "Urgente e Importante.",
                    "Não Urgente e Pouco Importante (atividades irrelevantes ou dispensáveis).",
                    "Urgente, mas Pouco Importante.",
                    "Estratégico de longo prazo."
                ],
                answer: "Não Urgente e Pouco Importante (atividades irrelevantes ou dispensáveis)."
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

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
                }, 15); // velocidade de digitação
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Processando Ticket #${currentQuestion.value.id}...`, "log-info");
            await typeWriter(`Contexto: ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Todos os tickets foram processados. Fechando plantão...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Correto! Ticket finalizado com sucesso.";
                addLog("Ticket Resolvido. Encaminhando para QA.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2000);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A solução era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha: Ticket reaberto devido a violação de SLA.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 3500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Retrabalho detectado. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente domínio operacional na Manutenção de Sistemas.";
            if (score.value < 40) performanceMsg = "Necessário rever os processos (PDCA) e conceitos de chamados técnicos.";
            if (score.value < 25) performanceMsg = "Alerta: Falhas críticas nos fundamentos de gestão de T.I. Recomendamos reciclagem na base teórica.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #F59E0B; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #F59E0B; margin: 0;">Relatório de Desempenho Operacional</h1>
                    <h2 style="color: #555; margin: 5px 0;">Manutenção de Sistemas e Indicadores de TI</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Emissão do Plantão:</strong> ${data}</p>
                    <p>Este relatório formaliza a análise e o tratamento de ${questions.value.length} incidentes simulados nas áreas de plano de manutenção, gestão de suporte, metodologias SMART, PDCA e métricas como HTSI, HISI, e ROI/VOI.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador Final (Score)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 40 ? '#10B981' : (score.value >= 25 ? '#F59E0B' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} Acertos / ${questions.value.length} Total</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado automaticamente pelo MNT.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `MNT_Auditoria_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando os serviços de manutenção...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando SysMonitor v3.14 (Módulo de Manutenção)...", "log-info");
            setTimeout(() => { loadQuestion(); }, 800);
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