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

        // --- Banco de Questões (15 Questões - Escopo, Canvas, Matrizes e Kanban) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Fundamentos de Escopo",
                scenario: "A equipe de projetos está iniciando o planejamento de um novo sistema acadêmico e precisa elaborar o Documento de Escopo.",
                text: "Quais são os pilares principais que definem de forma clara e objetiva o que será realizado no projeto?",
                options: [
                    "Entregas (o que o cliente vai receber), Limites (até onde o projeto vai) e Critérios de Aceite (como será verificado).",
                    "Cronograma detalhado em horas, Custo unitário de desenvolvedores e Matriz de Riscos de TI.",
                    "Análise de concorrentes, Marketing Digital e Estratégia de precificação do software.",
                    "Definição exclusiva da arquitetura de banco de dados e diagramas de infraestrutura em nuvem."
                ],
                answer: "Entregas (o que o cliente vai receber), Limites (até onde o projeto vai) e Critérios de Aceite (como será verificado)."
            },
            {
                id: 2,
                instruction: "O Perigo do Scope Creep",
                scenario: "Durante a criação de um sistema de cadastro, o cliente pediu 'só mais um botão', e na semana seguinte 'só mais um relatório'. Um projeto orçado para 2 meses acabou levando 8 meses.",
                text: "Como é chamado esse fenômeno causado pela ausência de limites formais no escopo?",
                options: [
                    "Scope Creep (Corrupção do Escopo).",
                    "Agilidade Contínua (Continuous Delivery).",
                    "Pivotagem Estratégica.",
                    "Refatoração de Requisitos."
                ],
                answer: "Scope Creep (Corrupção do Escopo)."
            },
            {
                id: 3,
                instruction: "Fronteiras do Projeto",
                scenario: "Em uma reunião de alinhamento de um aplicativo para clínica, o cliente começou a perguntar quando ficaria pronta a integração com os planos de saúde, algo que nunca havia sido discutido com a equipe.",
                text: "Por que é fundamental registrar explicitamente os itens que estão 'Fora do Escopo'?",
                options: [
                    "Para blindar a equipe contra cobranças sobre itens que o cliente 'imaginou' que estariam inclusos.",
                    "Para mostrar ao cliente que a equipe não tem capacidade técnica para realizar o trabalho.",
                    "Para reduzir o valor do orçamento final do projeto de forma arbitrária.",
                    "Para transferir a responsabilidade do desenvolvimento para outra empresa terceirizada."
                ],
                answer: "Para blindar a equipe contra cobranças sobre itens que o cliente 'imaginou' que estariam inclusos."
            },
            {
                id: 4,
                instruction: "Classificação de Requisitos",
                scenario: "O analista de sistemas documentou a seguinte necessidade: 'O tempo de resposta da consulta não pode exceder 2 segundos'.",
                text: "Essa descrição refere-se a qual tipo de requisito?",
                options: [
                    "Requisito Não Funcional, pois define como o sistema DEVE SER (qualidade/performance).",
                    "Requisito Funcional, pois descreve uma ação que o sistema deve FAZER.",
                    "Restrição de Negócio, pois é uma imposição do ambiente externo.",
                    "Critério de Aceitação Funcional, focado na jornada do usuário."
                ],
                answer: "Requisito Não Funcional, pois define como o sistema DEVE SER (qualidade/performance)."
            },
            {
                id: 5,
                instruction: "Modelagem UML: Casos de Uso",
                scenario: "A equipe mapeou o Requisito Funcional: 'O sistema deve permitir a solicitação de agendamento por parte do paciente'. Agora, precisam traduzir isso para a modelagem UML.",
                text: "Como esse Requisito Funcional e o Stakeholder se traduzem no Diagrama de Casos de Uso?",
                options: [
                    "O Requisito torna-se um Caso de Uso ('Solicitar Agendamento') e o Stakeholder ('Paciente') torna-se o Ator do diagrama.",
                    "O Requisito torna-se um Ator do sistema e o Stakeholder torna-se uma Classe de dados.",
                    "O Requisito torna-se um Método estático e o Stakeholder torna-se uma restrição de negócio.",
                    "Ambos se tornam fluxos de exceção dentro do Diagrama de Sequência."
                ],
                answer: "O Requisito torna-se um Caso de Uso ('Solicitar Agendamento') e o Stakeholder ('Paciente') torna-se o Ator do diagrama."
            },
            {
                id: 6,
                instruction: "Modelagem UML: Diagrama de Classes",
                scenario: "Lendo a descrição textual do escopo, o programador nota as palavras 'Usuário', 'Horário', 'cadastrar' e 'consultar'. Ele precisa iniciar a estrutura do sistema em código.",
                text: "Na transição do escopo textual para o Diagrama de Classes (e código), qual é a regra de correlação comum?",
                options: [
                    "Substantivos viram Classes (Usuário, Horário) e Verbos/Ações viram Métodos (cadastrar, consultar).",
                    "Verbos viram Classes principais e Substantivos viram interfaces externas.",
                    "Substantivos viram Pacotes de Trabalho da EAP e Verbos viram requisitos não funcionais.",
                    "Todas as palavras do texto devem ser transformadas exclusivamente em atributos privados."
                ],
                answer: "Substantivos viram Classes (Usuário, Horário) e Verbos/Ações viram Métodos (cadastrar, consultar)."
            },
            {
                id: 7,
                instruction: "Estrutura Analítica do Projeto (EAP / WBS)",
                scenario: "O gerente de projetos desenhou um diagrama hierárquico dividindo '1. Sistema MVP' em '1.1 Requisitos', '1.2 UX/UI' e '1.3 Backend'.",
                text: "Qual é a principal função e a regra de ouro da EAP (Work Breakdown Structure)?",
                options: [
                    "Traduzir o escopo em partes gerenciáveis; a regra é: se não está na EAP, não está no projeto.",
                    "Listar as tecnologias que serão utilizadas; a regra é usar as linguagens mais modernas.",
                    "Criar o cronograma diário da equipe; a regra é alocar 8 horas de trabalho para cada tarefa.",
                    "Modelar o banco de dados; a regra é normalizar todas as tabelas até a 3ª forma normal."
                ],
                answer: "Traduzir o escopo em partes gerenciáveis; a regra é: se não está na EAP, não está no projeto."
            },
            {
                id: 8,
                instruction: "Critérios de Aceitação",
                scenario: "A equipe entregou um 'Protótipo navegável', mas o cliente recusou afirmando que não era o que ele queria. Não havia como provar quem estava certo, pois a avaliação era subjetiva.",
                text: "O que deveria ter sido definido previamente para atestar quando um entregável está realmente 'Pronto' e remover essa subjetividade?",
                options: [
                    "Critérios de Aceitação, definindo objetivamente como o cliente verificará se a entrega atende ao esperado.",
                    "Um contrato jurídico exigindo pagamento adiantado independentemente do resultado.",
                    "Uma Matriz FOFA para analisar as fraquezas da equipe de design.",
                    "A inclusão de mais desenvolvedores para refazer o trabalho indefinidamente."
                ],
                answer: "Critérios de Aceitação, definindo objetivamente como o cliente verificará se a entrega atende ao esperado."
            },
            {
                id: 9,
                instruction: "Gestão de Mudanças",
                scenario: "No meio do desenvolvimento, o cliente solicita a inclusão de um módulo de pagamento online que não estava no planejamento original.",
                text: "De acordo com o Controle de Mudanças, o que deve ser feito antes de incorporar essa alteração ao projeto?",
                options: [
                    "A alteração deve ser registrada e analisada quanto ao seu impacto em prazo, custo e qualidade antes da aprovação.",
                    "A alteração deve ser aceita imediatamente para garantir a satisfação total do cliente.",
                    "A alteração deve ser rejeitada sumariamente, pois o escopo nunca pode ser alterado em nenhuma hipótese.",
                    "A equipe deve parar todo o desenvolvimento atual e focar apenas no módulo novo."
                ],
                answer: "A alteração deve ser registrada e analisada quanto ao seu impacto em prazo, custo e qualidade antes da aprovação."
            },
            {
                id: 10,
                instruction: "BMC vs. Canvas de Produto",
                scenario: "A startup precisa escolher a ferramenta visual correta para planejar seu próximo passo. Parte da equipe quer estruturar a viabilidade da corporação como um todo, enquanto outros querem focar apenas na resolução de um problema específico do usuário com uma funcionalidade.",
                text: "Respectivamente, quais são as abordagens do Business Model Canvas (BMC) e do Canvas de Produto?",
                options: [
                    "BMC foca na Empresa/Negócio de forma abrangente; Canvas de Produto foca no Produto e na dor específica do usuário.",
                    "BMC foca exclusivamente em desenvolvimento de software; Canvas de Produto foca na contabilidade financeira.",
                    "Ambos são exatamente a mesma ferramenta com nomes diferentes, focados apenas na equipe técnica.",
                    "BMC serve apenas para startups; Canvas de Produto serve apenas para indústrias tradicionais."
                ],
                answer: "BMC foca na Empresa/Negócio de forma abrangente; Canvas de Produto foca no Produto e na dor específica do usuário."
            },
            {
                id: 11,
                instruction: "Blocos do Canvas de Produto (UC Hub)",
                scenario: "Durante o preenchimento do Canvas de Produto da UC Hub, a squad precisa mapear de onde virá o dinheiro para sustentar o desenvolvimento e a infraestrutura tecnológica do MVP.",
                text: "Em qual bloco específico do Canvas de Produto essas informações devem ser listadas?",
                options: [
                    "Custos e Receitas (Viabilidade financeira da solução).",
                    "Dados e Plataformas (Informações tecnológicas).",
                    "Problema e Alternativas (Dor a ser resolvida).",
                    "Indicadores de Resultado (Como medir o sucesso)."
                ],
                answer: "Custos e Receitas (Viabilidade financeira da solução)."
            },
            {
                id: 12,
                instruction: "Matriz Estratégica vs. Matriz FOFA",
                scenario: "A gerência solicitou uma análise do mercado global, dos concorrentes, das Oportunidades externas e das Forças internas da empresa. Outro líder quer saber como o novo software vai trazer disrupção tecnológica e eficiência ao usuário.",
                text: "Quais ferramentas resolvem essas duas demandas, respectivamente?",
                options: [
                    "Matriz FOFA (SWOT) para o contexto/concorrência e Matriz Estratégica para o impacto tecnológico no usuário.",
                    "Kanban para o contexto global e EAP para a disrupção tecnológica.",
                    "Canvas de Produto para o mercado e Matriz FOFA para os dados do software.",
                    "Matriz Estratégica para a concorrência global e Diagrama de Classes para a disrupção de usuário."
                ],
                answer: "Matriz FOFA (SWOT) para o contexto/concorrência e Matriz Estratégica para o impacto tecnológico no usuário."
            },
            {
                id: 13,
                instruction: "Dimensões da Matriz Estratégica (UC Hub)",
                scenario: "A equipe de Produto da UC Hub está avaliando o impacto da sua nova tecnologia antes de iniciar a construção, tentando entender como ela se conectará aos sistemas que o cliente já utiliza.",
                text: "Quais são as 4 dimensões avaliadas na Matriz Estratégica de Produto?",
                options: [
                    "Experiências com a tecnologia, Disrupção com a tecnologia, Eficiência gerada e Sistemas integrados.",
                    "Forças, Oportunidades, Fraquezas e Ameaças.",
                    "Prazo, Custo, Escopo e Qualidade.",
                    "Requisitos Funcionais, Não Funcionais, Premissas e Restrições."
                ],
                answer: "Experiências com a tecnologia, Disrupção com a tecnologia, Eficiência gerada e Sistemas integrados."
            },
            {
                id: 14,
                instruction: "Fundamentos do Kanban",
                scenario: "A equipe de TI utiliza um quadro na parede, mas todos os desenvolvedores possuem 10 tarefas 'Em Andamento' simultaneamente. Nenhuma entrega é finalizada no prazo.",
                text: "Qual princípio fundamental do gerenciamento Kanban está sendo ignorado, gerando esse gargalo?",
                options: [
                    "Limitação do WIP (Work in Progress), que dita: 'Pare de começar, comece a terminar'.",
                    "Políticas Explícitas, pois as regras de negócio do software estão erradas.",
                    "Tempo de Ciclo (Lead Time), pois o relógio não está sendo cronometrado.",
                    "A ausência de uma Matriz Estratégica afixada no quadro da equipe."
                ],
                answer: "Limitação do WIP (Work in Progress), que dita: 'Pare de começar, comece a terminar'."
            },
            {
                id: 15,
                instruction: "O Ecossistema da Agilidade e Estratégia",
                scenario: "Uma frase marcante guiou o fim do planejamento da equipe: 'Uma ferramenta define o destino, a outra garante o impacto, e o método ágil constrói a estrada de forma eficiente'.",
                text: "Com base nas aulas de Estratégia e Agilidade em Software, quem representa esses três papéis fundamentais, respectivamente?",
                options: [
                    "O Canvas (destino), a Matriz Estratégica (impacto) e o Kanban (estrada eficiente).",
                    "O Diagrama de Classes (destino), o WIP (impacto) e a Matriz FOFA (estrada eficiente).",
                    "O Scope Creep (destino), a EAP (impacto) e o Scrum Master (estrada eficiente).",
                    "A EAP (destino), os Requisitos (impacto) e o Canvas de Produto (estrada eficiente)."
                ],
                answer: "O Canvas (destino), a Matriz Estratégica (impacto) e o Kanban (estrada eficiente)."
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Raciocínio estratégico validado com sucesso.";
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
            
            let performanceMsg = "Excelente domínio sobre Gestão de Escopo, Modelagem UML, Canvas de Produto e Estratégia Ágil (Kanban).";
            if (score.value < 10) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de Escopo, WBS/EAP, Canvas de Produto e Matrizes Estratégicas.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho em Projeto e Engenharia de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação Estratégica Baseada em Casos Reais</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento comprova a submissão a ${questions.value.length} cenários práticos exigindo diagnóstico ativo em Gestão de Escopo, Requisitos (UML), Estratégia Visual (Canvas e Matrizes) e Fundamentos do Kanban.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Resultado Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 12 ? '#10B981' : (score.value >= 9 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
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
                filename:     `Certificacao_EngSoft_Escopo_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador de Projeto e Engenharia de Software v3.0...", "log-info");
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