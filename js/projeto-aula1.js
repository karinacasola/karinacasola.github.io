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

        // --- Banco de Questões (30 Questões - Engenharia de Requisitos e Análise) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Definição de Análise",
                scenario: "Um novo colaborador questiona o propósito da fase inicial do projeto perante a complexidade das regras de negócio apresentadas.",
                text: "Qual a definição correta do ato de análise de sistemas nesse contexto?",
                options: [
                    "O ato de separar o todo em partes para entendê-lo melhor.",
                    "O processo de unificar módulos independentes em uma arquitetura coesa.",
                    "A execução de testes de estresse para validar a resiliência estrutural.",
                    "O mapeamento exclusivo das restrições de hardware e infraestrutura."
                ],
                answer: "O ato de separar o todo em partes para entendê-lo melhor."
            },
            {
                id: 2,
                instruction: "O Papel do Analista",
                scenario: "A equipe técnica tem dificuldades para compreender os jargões operacionais e as restrições que o cliente descreve durante as reuniões.",
                text: "Qual é o principal papel do analista de sistemas nessa situação?",
                options: [
                    "Garantir que a arquitetura do banco de dados relacional esteja normalizada para receber as regras.",
                    "Traduzir as dores do mundo real para uma linguagem que a equipe técnica consiga transformar em software.",
                    "Aplicar metodologias ágeis estritamente para o gerenciamento do cronograma da equipe.",
                    "Definir os padrões de projeto arquiteturais que serão utilizados na codificação do sistema."
                ],
                answer: "Traduzir as dores do mundo real para uma linguagem que a equipe técnica consiga transformar em software."
            },
            {
                id: 3,
                instruction: "Conceito de Requisito",
                scenario: "Durante o planejamento, estabelece-se uma condição formal ou capacidade que o sistema deve obrigatoriamente alcançar para resolver o problema do usuário.",
                text: "Na engenharia de software, essa ponte que conecta as necessidades de negócio à tecnologia é chamada de:",
                options: [
                    "Padrão Arquitetural.",
                    "Regra de Transição.",
                    "Requisito.",
                    "Métrica de Desempenho."
                ],
                answer: "Requisito."
            },
            {
                id: 4,
                instruction: "Requisitos Funcionais",
                scenario: "O documento de especificação detalha expressamente: 'O sistema deve permitir o cadastro e a inativação de novos clientes'.",
                text: "Essa afirmação refere-se diretamente a O QUE o sistema faz. Trata-se de um exemplo de:",
                options: [
                    "Requisito Não Funcional.",
                    "Critério de Escalabilidade.",
                    "Regra de Negócio Implícita.",
                    "Requisito Funcional."
                ],
                answer: "Requisito Funcional."
            },
            {
                id: 5,
                instruction: "Requisitos Não Funcionais",
                scenario: "A diretoria estipula uma restrição técnica rigorosa: 'O sistema deve carregar a página inicial e processar o login em menos de 2 segundos'.",
                text: "Esta restrição foca em COMO o sistema opera e na sua qualidade. Trata-se de um:",
                options: [
                    "Requisito Não Funcional.",
                    "Diagrama de Atividades.",
                    "Caso de Uso de Exceção.",
                    "Requisito Funcional."
                ],
                answer: "Requisito Não Funcional."
            },
            {
                id: 6,
                instruction: "Categorias Não Funcionais: Segurança",
                scenario: "Uma auditoria exige que todos os dados de cartões de crédito sejam criptografados ponta a ponta e que as sessões expirem após 5 minutos de inatividade.",
                text: "Essa solicitação enquadra-se em qual categoria de requisito não funcional?",
                options: [
                    "Disponibilidade.",
                    "Segurança.",
                    "Integridade Referencial.",
                    "Confiabilidade de Rede."
                ],
                answer: "Segurança."
            },
            {
                id: 7,
                instruction: "Documentação: O QUÊ vs COMO",
                scenario: "Ao redigir o documento de requisitos, um analista começa a detalhar a estrutura de tabelas, chaves estrangeiras e a linguagem de programação que será usada.",
                text: "Por que essa abordagem é considerada uma má prática na fase de especificação de requisitos de software?",
                options: [
                    "As tabelas e diagramas lógicos só devem ser criados após a fase completa de testes unitários.",
                    "A documentação de requisitos foca inteiramente na experiência visual do usuário final.",
                    "O documento deve definir O QUE o sistema deve fazer, e não COMO deve fazê-lo tecnicamente.",
                    "Detalhar restrições de banco de dados é papel exclusivo da elicitação etnográfica."
                ],
                answer: "O documento deve definir O QUE o sistema deve fazer, e não COMO deve fazê-lo tecnicamente."
            },
            {
                id: 8,
                instruction: "Fase de Elicitação",
                scenario: "A equipe inicia uma série de interações com os clientes para extrair informações, fazer perguntas estruturadas e trazer necessidades ocultas à tona.",
                text: "Qual o nome técnico dessa primeira fase do ciclo de engenharia de requisitos?",
                options: [
                    "Especificação Contínua.",
                    "Validação Lógica.",
                    "Análise Estrutural.",
                    "Elicitação."
                ],
                answer: "Elicitação."
            },
            {
                id: 9,
                instruction: "Técnica: Entrevistas",
                scenario: "Para um processo crítico, o analista precisa explorar problemas complexos profundamente e construir um relacionamento de confiança com o gestor do setor.",
                text: "Qual é a técnica clássica de levantamento mais adequada para esse nível de aprofundamento?",
                options: [
                    "Sessões de Brainstorming Anônimo.",
                    "Análise de Documentação Legada.",
                    "Entrevistas.",
                    "Prototipação de Alta Fidelidade."
                ],
                answer: "Entrevistas."
            },
            {
                id: 10,
                instruction: "Técnica: Observação e Etnografia",
                scenario: "Os clientes afirmam que o processo de triagem é simples, mas ao passar um turno inteiro no chão de fábrica, o analista descobre interações não documentadas e essenciais.",
                text: "Qual técnica revelou essas necessidades implícitas através do acompanhamento do ambiente natural?",
                options: [
                    "Engenharia Reversa.",
                    "Observação e Etnografia.",
                    "Workshops Colaborativos.",
                    "Análise do Discurso."
                ],
                answer: "Observação e Etnografia."
            },
            {
                id: 11,
                instruction: "Técnica: Workshops e JAD",
                scenario: "Os departamentos de Vendas e Financeiro divergem fortemente sobre o fluxo de aprovação de crédito, gerando atrasos no levantamento.",
                text: "Para alinhar expectativas colaborativamente e resolver conflitos de forma estruturada, a melhor técnica a ser aplicada é:",
                options: [
                    "Workshops e JAD (Joint Application Design).",
                    "Análise de Relatórios Individuais.",
                    "Entrevistas Não-Estruturadas Separadas.",
                    "Questionários com Perguntas Fechadas."
                ],
                answer: "Workshops e JAD (Joint Application Design)."
            },
            {
                id: 12,
                instruction: "Técnica: Questionários",
                scenario: "O sistema será utilizado por 5.000 funcionários espalhados por filiais em 15 estados diferentes, e é necessário identificar um padrão quantitativo sobre o uso do módulo atual.",
                text: "Qual técnica oferece amplo alcance geográfico e viabilidade estatística com baixo custo de deslocamento?",
                options: [
                    "Sessões JAD Globais.",
                    "Observação Etnográfica Participante.",
                    "Prototipagem Iterativa.",
                    "Questionários."
                ],
                answer: "Questionários."
            },
            {
                id: 13,
                instruction: "Prototipagem Rápida",
                scenario: "A equipe técnica quer alinhar o fluxo básico de navegação de um novo aplicativo com os stakeholders em poucas horas, evitando custos de codificação prematura.",
                text: "Qual abordagem foca na validação ágil de conceitos usando esboços simples e rascunhos?",
                options: [
                    "Modelagem de Casos de Uso Avançada.",
                    "Prototipagem de Alta Fidelidade.",
                    "Prototipagem de Baixa Fidelidade.",
                    "Engenharia Reversa Visual."
                ],
                answer: "Prototipagem de Baixa Fidelidade."
            },
            {
                id: 14,
                instruction: "Análise do Discurso",
                scenario: "Em uma corporação tradicional, o analista examina as comunicações internas, e-mails e reuniões gravadas para desvendar relações de poder e suposições culturais que afetam o fluxo do sistema.",
                text: "Essa técnica qualitativa, que busca requisitos implícitos nas entrelinhas da comunicação, é chamada de:",
                options: [
                    "Avaliação Heurística.",
                    "Análise do Discurso.",
                    "Inspeção de Código-Fonte.",
                    "Sondagem Etnográfica Direta."
                ],
                answer: "Análise do Discurso."
            },
            {
                id: 15,
                instruction: "Engenharia Reversa e Documentação",
                scenario: "Uma instituição bancária precisa modernizar um sistema mainframe construído há 20 anos. Os manuais estão desatualizados e os desenvolvedores originais já se aposentaram.",
                text: "Quais técnicas são indispensáveis para mapear as regras de negócio embutidas na solução atual?",
                options: [
                    "Análise de Documentação Legada e Engenharia Reversa.",
                    "Entrevistas Estruturadas com Novos Usuários.",
                    "Prototipagem Visual e Design Thinking.",
                    "Workshops JAD para Inovação Estratégica."
                ],
                answer: "Análise de Documentação Legada e Engenharia Reversa."
            },
            {
                id: 16,
                instruction: "Identificação de Stakeholders",
                scenario: "Um sistema foi aprovado pelos diretores por ser gerencialmente excelente, mas foi rejeitado na implantação porque os operadores de caixa acharam a interface lenta e confusa.",
                text: "Esse fracasso ocorreu pois o levantamento ignorou parte de qual grupo fundamental?",
                options: [
                    "Key-Sponsors (Apenas os financiadores executivos do projeto).",
                    "Product Owners (O comitê técnico de arquitetura).",
                    "Atores de Integração de Sistemas.",
                    "Stakeholders (Usuários finais, gestores, equipe técnica, patrocinadores)."
                ],
                answer: "Stakeholders (Usuários finais, gestores, equipe técnica, patrocinadores)."
            },
            {
                id: 17,
                instruction: "Diagrama de Casos de Uso",
                scenario: "No início da modelagem, é preciso criar um documento visual que ilustre claramente quais tipos de usuários interagem com o sistema e quais as funcionalidades macro disponíveis para eles.",
                text: "Qual modelo UML é o mais indicado para representar essas interações estruturais de alto nível?",
                options: [
                    "Diagrama de Classes.",
                    "Diagrama de Componentes.",
                    "Diagrama de Casos de Uso.",
                    "Diagrama de Entidade-Relacionamento."
                ],
                answer: "Diagrama de Casos de Uso."
            },
            {
                id: 18,
                instruction: "Modelo Conceitual",
                scenario: "A equipe de dados precisa de uma representação que mostre as principais entidades do domínio do problema (ex: Cliente, Conta, Transação) e como elas se relacionam logicamente.",
                text: "Qual artefato de modelagem atende primordialmente a essa necessidade estrutural abstrata?",
                options: [
                    "Diagrama de Sequência.",
                    "Modelo Conceitual (Diagrama de Classes).",
                    "Diagrama de Transição de Estados.",
                    "Modelo de Implantação."
                ],
                answer: "Modelo Conceitual (Diagrama de Classes)."
            },
            {
                id: 19,
                instruction: "A Fase de Validação",
                scenario: "Após a modelagem e antes de passar a demanda aos programadores, a equipe de análise realiza uma revisão com o cliente para responder à pergunta: 'Estamos de fato resolvendo o problema correto?'.",
                text: "Esse momento crucial de confirmação e alinhamento de qualidade pertence a qual fase?",
                options: [
                    "Validação.",
                    "Elicitação Sequencial.",
                    "Especificação Técnica.",
                    "Desenvolvimento Lógico."
                ],
                answer: "Validação."
            },
            {
                id: 20,
                instruction: "A Fase de Especificação",
                scenario: "Com as informações coletadas, refinadas e validadas, o analista consolida tudo em um artefato formal que servirá como contrato técnico para os desenvolvedores.",
                text: "A fase de gerar a declaração oficial e detalhada do que é demandado do sistema é a:",
                options: [
                    "Arquitetura de Integração.",
                    "Elicitação Documental.",
                    "Sintetização de Dados.",
                    "Especificação."
                ],
                answer: "Especificação."
            },
            {
                id: 21,
                instruction: "O Custo do Erro de Requisito",
                scenario: "Um erro fundamental na regra de cálculo de frete só foi descoberto pela equipe de homologação faltando uma semana para o lançamento oficial do e-commerce.",
                text: "Comparado a ter descoberto o erro na fase de requisitos, como se comporta o impacto financeiro e de esforço?",
                options: [
                    "O erro terá custo equivalente, pois a metodologia ágil absorve alterações tardias sem impacto no cronograma.",
                    "O impacto financeiro é menor, visto que as interfaces já estão concluídas e precisam de poucos ajustes.",
                    "O erro será muito mais caro, pois exigirá retrabalho em arquitetura, lógica já implementada e refatoração de testes.",
                    "O custo recai inteiramente sobre o cliente, anulando o impacto para o time de projeto."
                ],
                answer: "O erro será muito mais caro, pois exigirá retrabalho em arquitetura, lógica já implementada e refatoração de testes."
            },
            {
                id: 22,
                instruction: "Ambiguidade na Análise",
                scenario: "A requisição oficial dizia apenas: 'O sistema de relatórios deve ser rápido'. O desenvolvedor entregou relatórios em 5 segundos, mas o cliente esperava tempo real (milissegundos).",
                text: "Esse conflito, categorizado como um dos principais erros em análise, ocorreu devido a:",
                options: [
                    "Falta de diagramação física do banco.",
                    "Requisitos ambíguos.",
                    "Ignorar a fase de prototipagem visual.",
                    "Uso excessivo de validações etnográficas."
                ],
                answer: "Requisitos ambíguos."
            },
            {
                id: 23,
                instruction: "Importância da Boa Análise",
                scenario: "A diretoria argumenta que a fase de análise consome muito tempo e sugere pular direto para a codificação para entregar o produto mais cedo.",
                text: "Por que uma análise sólida é defendida como vital e redutora de custos globais do projeto?",
                options: [
                    "Porque ela reduz o retrabalho, evita conflitos de escopo posteriores e aumenta a qualidade final do sistema alinhado ao negócio.",
                    "Porque é a única maneira de gerar a documentação legal que isenta a equipe de falhas de performance.",
                    "Porque a modelagem UML substitui completamente a necessidade de testes de garantia de qualidade posteriores.",
                    "Para garantir que analistas tenham métricas exatas para cobrar aditivos contratuais ao menor desvio."
                ],
                answer: "Porque ela reduz o retrabalho, evita conflitos de escopo posteriores e aumenta a qualidade final do sistema alinhado ao negócio."
            },
            {
                id: 24,
                instruction: "Combinar Técnicas",
                scenario: "Um analista utilizou apenas questionários eletrônicos para levantar um sistema hospitalar crítico, resultando em um fluxo que ignorava a dinâmica presencial de emergências.",
                text: "Para mitigar esse risco e garantir uma visão 360º do processo, a melhor prática recomendada é:",
                options: [
                    "Focar exclusivamente na análise de manuais médicos legados.",
                    "Combinar múltiplas técnicas de levantamento (ex: Questionários + Observação in loco).",
                    "Adotar um JAD virtual isolado apenas com os diretores do hospital.",
                    "Substituir o analista por um engenheiro de infraestrutura."
                ],
                answer: "Combinar múltiplas técnicas de levantamento (ex: Questionários + Observação in loco)."
            },
            {
                id: 25,
                instruction: "Necessidades Informacionais",
                scenario: "Durante o desenvolvimento de um painel de Business Intelligence (BI), o foco do levantamento recai intensamente sobre questões como: 'Para qual finalidade esse dado é crítico?' e 'Quais relatórios são vitais?'.",
                text: "Esse estágio direcionado da análise é caracterizado pelo estudo minucioso das:",
                options: [
                    "Restrições estruturais de integridade referencial.",
                    "Capacidades de balanceamento de carga do servidor.",
                    "Necessidades informacionais dos perfis de usuário.",
                    "Regras de usabilidade para acessibilidade móvel."
                ],
                answer: "Necessidades informacionais dos perfis de usuário."
            },
            {
                id: 26,
                instruction: "Resolução de Conflitos e Priorização",
                scenario: "O departamento de Marketing solicita recursos avançados de IA, mas o orçamento estipulado pela Diretoria cobre apenas o CRUD (cadastros básicos) inicial.",
                text: "Nesse cenário, após a coleta de demandas irrealistas, qual etapa do processo o analista deve conduzir rigidamente?",
                options: [
                    "O desenvolvimento de um protótipo de alta fidelidade englobando a IA.",
                    "A inserção das funcionalidades de IA como requisitos não funcionais de segurança.",
                    "O abandono da especificação formal a favor de um ciclo espiral sem orçamento.",
                    "A resolução de conflitos e a priorização sistemática dos requisitos."
                ],
                answer: "A resolução de conflitos e a priorização sistemática dos requisitos."
            },
            {
                id: 27,
                instruction: "Categorias Não Funcionais: Integrabilidade",
                scenario: "O escopo define que a nova solução SaaS de Recursos Humanos deve trocar dados em tempo real com o ERP SAP atual da companhia através de APIs RESTful.",
                text: "Sob qual categoria essencial de requisitos não funcionais essa exigência é formalizada?",
                options: [
                    "Integrabilidade (interoperabilidade e métodos de integração).",
                    "Desempenho e latência de processamento.",
                    "Portabilidade e adaptação de infraestrutura.",
                    "Confidencialidade de dados persistentes."
                ],
                answer: "Integrabilidade (interoperabilidade e métodos de integração)."
            },
            {
                id: 28,
                instruction: "Erro Grave de Omissão",
                scenario: "O documento de requisitos foi redigido internamente pela equipe de TI com base em suposições e enviado diretamente aos programadores, sem uma reunião final de aceite.",
                text: "Qual dos principais erros críticos em análise de sistemas ocorreu de forma evidente nessa abordagem?",
                options: [
                    "Omissão da etapa de elicitação etnográfica sistêmica.",
                    "Falta de validação técnica e comercial em conjunto com os stakeholders.",
                    "Ausência de diagramação lógica rigorosa baseada em UML.",
                    "Inclusão de requisitos ambíguos na etapa de arquitetura de rede."
                ],
                answer: "Falta de validação técnica e comercial em conjunto com os stakeholders."
            },
            {
                id: 29,
                instruction: "Iteração de Requisitos",
                scenario: "No meio do ciclo de desenvolvimento, uma nova regulação federal obriga o sistema a emitir um comprovante tributário que não havia sido mapeado no início do ano.",
                text: "Como a Engenharia de Requisitos contemporânea orienta a equipe a lidar com essa nova informação?",
                options: [
                    "Congelar o documento original e forçar o cliente a assinar um contrato para um projeto secundário isolado.",
                    "Implementar a mudança diretamente no código sem sobrecarregar a documentação formal de especificação.",
                    "Manter o processo iterativo e revisitar os requisitos continuamente conforme novas restrições surgem.",
                    "Aguardar o ciclo de manutenção perfectiva pós-lançamento para adequação tributária."
                ],
                answer: "Manter o processo iterativo e revisitar os requisitos continuamente conforme novas restrições surgem."
            },
            {
                id: 30,
                instruction: "Protótipos de Alta Fidelidade",
                scenario: "O comitê executivo quer testar a usabilidade real e aprovar o design exato das cores e tipografia da interface antes de liberar a verba para a equipe backend.",
                text: "Para fornecer essa validação visual interativa e próxima do sistema final, a equipe deve utilizar:",
                options: [
                    "Modelagem de Wireframes Conceituais.",
                    "Diagramas de Fluxo de Dados (DFD).",
                    "Sessões de Entrevistas Estruturadas sobre Design.",
                    "Prototipagem de Alta Fidelidade."
                ],
                answer: "Prototipagem de Alta Fidelidade."
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
            await typeWriter(`Carregando Desafio de Engenharia de Requisitos ${currentQuestion.value.id}...`, "log-info");
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Raciocínio analítico validado com sucesso.";
                addLog("Sucesso: Decisão analítica precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Abordagem de requisitos incorreta.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Falha na validação teórica. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente compreensão dos fundamentos de Engenharia de Requisitos e Modelagem de Sistemas.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão dos conceitos teóricos de Especificação, Modelagem e Técnicas de Levantamento.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho Executivo</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Engenharia e Levantamento de Requisitos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas baseadas no escopo de Engenharia de Requisitos e Modelagem de Sistemas.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador Proj_EVAL_v3.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `EngRequisitos_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador de Requisitos...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador ALGO_EVAL_v3.0...", "log-info");
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