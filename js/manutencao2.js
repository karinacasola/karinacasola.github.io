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

        // --- Banco de 20 Questões (Aulas 1, 2 e Manutenção BPMN/ITIL) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Diferença entre tipos de manutenção.",
                scenario: "O cliente relata que um relatório fiscal essencial está calculando os impostos com a alíquota desatualizada de 2023 em pleno 2026, gerando prejuízos no mesmo instante.",
                text: "Esta ocorrência exige qual tipo de manutenção?",
                options: [
                    "Corretiva",
                    "Preventiva",
                    "Adaptativa",
                    "Preditiva"
                ],
                answer: "Corretiva"
            },
            {
                id: 2,
                instruction: "ITIL: Incidente vs. Problema.",
                scenario: "A equipe técnica percebeu que a falha de login das 10h da manhã é um sintoma recorrente de uma falha de sincronização do banco de dados que acontece toda semana.",
                text: "No framework ITIL, como é classificada a 'causa raiz' subjacente a múltiplos incidentes?",
                options: [
                    "Incidente Crítico",
                    "Problema",
                    "Evento Intermediário",
                    "Gatilho de Serviço"
                ],
                answer: "Problema"
            },
            {
                id: 3,
                instruction: "Priorização de Chamados.",
                scenario: "Ao preencher a matriz de prioridade de um ticket de manutenção corretiva, o gestor precisa cruzar duas variáveis objetivas estabelecidas no material.",
                text: "Quais são as variáveis utilizadas na equação de priorização (Prioridade = X * Y)?",
                options: [
                    "Complexidade x Tempo",
                    "Esforço x Valor",
                    "Impacto (Severidade) x Urgência",
                    "Lead Time x Cycle Time"
                ],
                answer: "Impacto (Severidade) x Urgência"
            },
            {
                id: 4,
                instruction: "Indicadores Financeiros de TI.",
                scenario: "A empresa quer justificar o gasto com a nova ferramenta de help-desk demonstrando o valor criado (qualitativo) como redução de riscos e maior agilidade.",
                text: "Qual sigla representa esse 'Valor de Investimento'?",
                options: [
                    "ROI",
                    "TISI",
                    "VOI",
                    "MLBTIC"
                ],
                answer: "VOI"
            },
            {
                id: 5,
                instruction: "Indicadores de Interrupção.",
                scenario: "Foi registrado que o sistema ficou fora do ar 3 horas (HISI) este mês, enquanto a carga de trabalho total (HTSI) era de 135 horas.",
                text: "O cálculo (HISI / HTSI) * 100 gera qual indicador de desempenho?",
                options: [
                    "CSAT",
                    "FCR",
                    "TMA",
                    "TISI (Taxa de Interrupção dos Sistemas de Informação)"
                ],
                answer: "TISI (Taxa de Interrupção dos Sistemas de Informação)"
            },
            {
                id: 6,
                instruction: "Modelagem BPMN - Piscinas e Raias.",
                scenario: "Ao desenhar o fluxo de atendimento ITIL no BPMN, você precisa separar as responsabilidades do 'Suporte Nível 1' e da 'Gestão de Problemas' dentro do departamento de TI.",
                text: "Qual elemento BPMN é usado para fazer essas subdivisões de papéis/departamentos dentro de uma única entidade?",
                options: [
                    "Raias (Lanes)",
                    "Piscinas (Pools)",
                    "Gateways Paralelos",
                    "Fluxos de Mensagem"
                ],
                answer: "Raias (Lanes)"
            },
            {
                id: 7,
                instruction: "Símbolos BPMN: Gateways.",
                scenario: "O chamado pode ir para a equipe de redes OU para a equipe de banco de dados, dependendo exclusivamente do tipo de erro, nunca para ambos ao mesmo tempo.",
                text: "Que tipo de Gateway (Desvio de Fluxo) deve ser modelado no diagrama?",
                options: [
                    "Gateway Paralelo (+)",
                    "Gateway Exclusivo (X ou vazio)",
                    "Gateway Inclusivo (O)",
                    "Gateway de Eventos"
                ],
                answer: "Gateway Exclusivo (X ou vazio)"
            },
            {
                id: 8,
                instruction: "Plano de Manutenção (SEPT, 2021).",
                scenario: "Durante a elaboração do plano de manutenção, você precisa formalizar acordos definindo os níveis de resposta esperados e o suporte emergencial máximo (SLA).",
                text: "Em qual seção estrutural do plano essas informações operacionais devem constar?",
                options: [
                    "1. Introdução",
                    "2. Sistema",
                    "4. Apoio e Suporte",
                    "6. Contratos"
                ],
                answer: "6. Contratos"
            },
            {
                id: 9,
                instruction: "Organização do Trabalho - Matriz de Prioridades.",
                scenario: "Um analista recebe uma tarefa urgentíssima (um relatório que deve ser enviado hoje), porém ela é pouco importante estrategicamente.",
                text: "No quadrante 2 da matriz de Daychoum (Urgente, mas Pouco Importante), qual a ação recomendada?",
                options: [
                    "Focar",
                    "Planejar",
                    "Delegar",
                    "Descartar"
                ],
                answer: "Delegar"
            },
            {
                id: 10,
                instruction: "Ciclo PDCA - Check.",
                scenario: "Após implementar as atualizações na infraestrutura (fase Do), a equipe de qualidade analisa os dados coletados comparando os resultados efetivos com as metas estabelecidas.",
                text: "Esta ação de avaliação e conferência pertence a qual fase do PDCA?",
                options: [
                    "Plan (Planejamento)",
                    "Do (Execução)",
                    "Check (Verificação)",
                    "Act (Ação)"
                ],
                answer: "Check (Verificação)"
            },
            {
                id: 11,
                instruction: "Método 5W2H.",
                scenario: "No plano de ação para treinar a equipe, consta a seguinte justificativa: 'Para conscientizar os colaboradores e reduzir falhas humanas'.",
                text: "Esta informação responde a qual pergunta do método 5W2H?",
                options: [
                    "What? (O quê?)",
                    "Why? (Por quê?)",
                    "Who? (Quem?)",
                    "How? (Como?)"
                ],
                answer: "Why? (Por quê?)"
            },
            {
                id: 12,
                instruction: "Coordenação Ágil com Kanban.",
                scenario: "O gestor configurou a ferramenta Trello para não aceitar mais do que 3 chamados simultâneos na coluna 'Em Desenvolvimento', visando evitar sobrecarga nos programadores.",
                text: "Como é conhecido esse teto de tarefas simultâneas por coluna no Kanban?",
                options: [
                    "Lead Time",
                    "Cycle Time",
                    "SLA (Service Level Agreement)",
                    "WIP (Work in Progress)"
                ],
                answer: "WIP (Work in Progress)"
            },
            {
                id: 13,
                instruction: "Métricas Kanban.",
                scenario: "A diretoria quer medir o tempo gasto desde o momento exato em que o analista começou a trabalhar ativamente na correção de código (Doing) até o fechamento.",
                text: "Qual métrica Kanban mede este tempo de execução ativa?",
                options: [
                    "Lead Time",
                    "Cycle Time",
                    "Throughput",
                    "TISI"
                ],
                answer: "Cycle Time"
            },
            {
                id: 14,
                instruction: "Dimensão de Correção vs Melhoria.",
                scenario: "A gestão da TI determinou que no próximo mês os esforços focarão na 'Dimensão de Melhoria', segundo a classificação de April (2010), pausando novos recursos.",
                text: "Quais tipos de manutenção a equipe deverá realizar prioritariamente?",
                options: [
                    "Corretiva e Preventiva",
                    "Adaptativa e Preditiva",
                    "Corretiva e Preditiva",
                    "Preventiva e Adaptativa"
                ],
                answer: "Adaptativa e Preditiva"
            },
            {
                id: 15,
                instruction: "Metodologia SMART.",
                scenario: "O coordenador define uma meta para a equipe: 'Alcançar 85% de resolução no primeiro contato até o final do semestre.'",
                text: "O trecho da frase 'até o final do semestre' cobre qual critério do método SMART?",
                options: [
                    "Specific (Específico)",
                    "Measurable (Mensurável)",
                    "Achievable (Atingível)",
                    "Timely (Temporal)"
                ],
                answer: "Timely (Temporal)"
            },
            {
                id: 16,
                instruction: "Métricas de Suporte: TMA.",
                scenario: "O gestor nota que a satisfação do cliente está caindo porque os usuários passam horas aguardando uma solução após abrir o ticket.",
                text: "Qual métrica mede diretamente o tempo médio que a equipe leva para atender um chamado?",
                options: [
                    "CSAT",
                    "FCR (First Call Resolution)",
                    "TMA (Tempo Médio de Atendimento)",
                    "Taxa de Reincidência"
                ],
                answer: "TMA (Tempo Médio de Atendimento)"
            },
            {
                id: 17,
                instruction: "Métricas de Manutenibilidade (Sommerville).",
                scenario: "A quantidade de horas necessárias para descobrir quais componentes são afetados antes de aplicar uma mudança de código está subindo vertiginosamente.",
                text: "O aumento deste indicador sinaliza que a manutenibilidade do sistema está caindo. Que indicador é este?",
                options: [
                    "Tempo médio para análise de impacto",
                    "Tempo médio de atendimento (TMA)",
                    "CSAT",
                    "Número de solicitações de mudança pendentes"
                ],
                answer: "Tempo médio para análise de impacto"
            },
            {
                id: 18,
                instruction: "Software de Help-desk.",
                scenario: "O setor de suporte quer instalar uma ferramenta open source no servidor local (Linux), que incentiva a personalização avançada por desenvolvedores (via Perl e JavaScript).",
                text: "Qual ferramenta gratuita, citada nos slides da Aula 2, possui nativamente essa característica open source e customizável?",
                options: [
                    "Freshservice",
                    "Spiceworks",
                    "OTRS",
                    "Pipefy"
                ],
                answer: "OTRS"
            },
            {
                id: 19,
                instruction: "Análise de Indicadores: What-if.",
                scenario: "O diretor financeiro levanta na reunião e questiona: 'O que acontece com a produtividade se o servidor cair 2 horas toda segunda-feira do próximo mês?'.",
                text: "A simulação de cenários a partir de suposições caracteriza qual técnica de análise abordada na Aula 1?",
                options: [
                    "Análise em Busca de Objetivos (Goal-seeking)",
                    "Análise de Regressão Linear",
                    "Análise 'E SE' (What-if)",
                    "Análise de Matriz de Prioridades"
                ],
                answer: "Análise 'E SE' (What-if)"
            },
            {
                id: 20,
                instruction: "Atividade Prática - Tipos de Manutenção.",
                scenario: "Relato da equipe: 'O setor de TI quer revisar o sistema antes de atualizações do banco de dados previstas para o próximo mês.'",
                text: "Conforme o gabarito dos slides, qual a classificação esperada para essa manutenção?",
                options: [
                    "Adaptativa",
                    "Corretiva",
                    "Preventiva",
                    "Preditiva"
                ],
                answer: "Preventiva"
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
                }, 15);
            });
        };

        const loadQuestion = async () => {
            isTyping.value = true;
            await typeWriter(`Analisando Caso Operacional #${currentQuestion.value.id}...`, "log-info");
            await typeWriter(`Cenário: ${currentQuestion.value.scenario}`, "log-default");
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
                addLog("Todos os casos operacionais foram resolvidos. Compilando relatório final...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Correto! Diagnóstico preciso do cenário.";
                addLog("Solução validada. Avançando no fluxo de trabalho.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2000);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A solução técnica era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha: Chamado reaberto devido a falha técnica.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 3500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Análise incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Necessário retrabalho (WIP). Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Proficiência destacada em Manutenção de Sistemas e Indicadores TI.";
            if (score.value < 14) performanceMsg = "Alerta: Necessário revisar conceitos do ITIL, BPMN e Ciclo PDCA.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #F59E0B; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #F59E0B; margin: 0;">Relatório de Avaliação - Manutenção de Sistemas</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação Ténica Operacional</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data de Emissão:</strong> ${data}</p>
                    <p>Este relatório homologa a análise de ${questions.value.length} cenários baseados na literatura sobre manutenibilidade (corretiva, preventiva, adaptativa, preditiva), ITIL, notação BPMN e gestão ágil (Kanban).</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador Final (Score)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#F59E0B' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} Acertos / ${questions.value.length} Total</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado automaticamente pelo Simulador Escape Room
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Auditoria_Manutencao_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando os serviços...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando SysMonitor (Módulo BPMN/ITIL)...", "log-info");
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