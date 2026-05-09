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

        // --- Banco de Questões (Implantação e Infraestrutura) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Identifique os Requisitos Mínimos.",
                scenario: "A equipe de projetos enviou o escopo do novo sistema. Você precisa realizar o levantamento de recursos comparando as exigências do software com o Data Center atual.",
                text: "No contexto apresentado, quais são os requisitos mínimos exigidos para confiabilidade e segurança?",
                options: [
                    "Processadores i5, Backup em Nuvem e Internet 5mbps.",
                    "Servidores Xeon, RAID 1 (Espelhamento) e Internet 10mbps.",
                    "Servidores Linux genéricos, RAID 0 e Intranet Local.",
                    "Switch Core sem redundância, Banco de Dados e Fibra Ótica."
                ],
                answer: "Servidores Xeon, RAID 1 (Espelhamento) e Internet 10mbps."
            },
            {
                id: 2,
                instruction: "Aplicação do Ciclo PDCA no Inventário.",
                scenario: "Durante o levantamento de recursos técnicos, sua equipe executa metodologias de gestão contínua.",
                text: "No ciclo PDCA, qual é o papel exato da fase 'Check' (Checar) neste cenário?",
                options: [
                    "Validar se os dados levantados no inventário atendem aos requisitos exigidos (Xeon, RAID).",
                    "Executar a coleta de dados e etiquetar os servidores.",
                    "Solicitar imediatamente a compra de novos hardwares para a diretoria.",
                    "Definir o que será mapeado antes do trabalho começar."
                ],
                answer: "Validar se os dados levantados no inventário atendem aos requisitos exigidos (Xeon, RAID)."
            },
            {
                id: 3,
                instruction: "Registro de Implantação e ITIL.",
                scenario: "Você precisa documentar a implantação formalmente para aprovação do comitê de mudanças (CAB).",
                text: "Qual método/ferramenta é padrão para detalhar o plano de ação, eliminando dúvidas sobre O Que, Quando, Onde e Quem executará a mudança?",
                options: [
                    "Gráfico de Gantt.",
                    "Metodologia Kanban/Trello.",
                    "Método 5W2H.",
                    "TCO (Total Cost of Ownership)."
                ],
                answer: "Método 5W2H."
            },
            {
                id: 4,
                instruction: "Classificação de Manutenção.",
                scenario: "O sistema de monitoramento alertou que o Disco A do RAID 1 está com sua vida útil próxima do fim, permitindo a troca antes da falha.",
                text: "Esse tipo de ação é classificado como qual tipo de manutenção?",
                options: [
                    "Manutenção Corretiva.",
                    "Manutenção Preventiva.",
                    "Manutenção Adaptativa.",
                    "Manutenção Preditiva."
                ],
                answer: "Manutenção Preditiva."
            },
            {
                id: 5,
                instruction: "Análise de Investimentos em TI.",
                scenario: "O CFO da empresa pede a justificativa financeira. Ele quer entender a diferença entre a compra de Servidores Xeon e a assinatura do Link de Internet 10mbps.",
                text: "Como essas despesas são classificadas contabilmente?",
                options: [
                    "Ambos são OPEX, pois geram custo operacional.",
                    "Servidores são CAPEX (Despesa de Capital) e o Link é OPEX (Despesa Operacional).",
                    "Servidores são OPEX e o Link é CAPEX.",
                    "Ambos são calculados apenas no TCO, não se dividindo entre Capex e Opex."
                ],
                answer: "Servidores são CAPEX (Despesa de Capital) e o Link é OPEX (Despesa Operacional)."
            },
            {
                id: 6,
                instruction: "Gerenciamento do TCO.",
                scenario: "Você rejeitou a compra de um servidor muito barato (Baixo CAPEX), justificando que ele consome muita energia e falha frequentemente.",
                text: "Qual métrica embasa o argumento de que um item barato na compra pode ser mais caro ao longo de 5 anos?",
                options: [
                    "ROI (Retorno sobre Investimento).",
                    "RFC (Request for Change).",
                    "SLA (Service Level Agreement).",
                    "TCO (Custo Total de Propriedade)."
                ],
                answer: "TCO (Custo Total de Propriedade)."
            },
            {
                id: 7,
                instruction: "Estratégia de Migração de Dados.",
                scenario: "É necessário migrar o banco de dados do sistema legado para o novo sistema. O negócio não pode parar, então os módulos serão transferidos gradualmente.",
                text: "Qual é o nome dessa estratégia de migração mais segura, porém que exige coexistência de sistemas?",
                options: [
                    "Big Bang.",
                    "Migração em Fases (Phased).",
                    "Migração Paralela.",
                    "Extração ETL (Extract, Transform, Load)."
                ],
                answer: "Migração em Fases (Phased)."
            },
            {
                id: 8,
                instruction: "Gestão de Mudanças (ITIL).",
                scenario: "O ambiente de produção não pode ser alterado sem documentação e aprovação.",
                text: "Na metodologia ITIL, como se chama o documento formal submetido ao comitê de aprovação detalhando os impactos e recursos da implantação?",
                options: [
                    "UAT (User Acceptance Testing).",
                    "Runbook de Rollback.",
                    "RFC (Request for Change).",
                    "CMDB (Configuration Management Database)."
                ],
                answer: "RFC (Request for Change)."
            },
            {
                id: 9,
                instruction: "Mecanismos de Validação.",
                scenario: "O ambiente foi montado, mas a equipe técnica exige a garantia de que o link de 10mbps vai suportar acessos simultâneos na Black Friday.",
                text: "Qual procedimento deve ser realizado para validar essa métrica?",
                options: [
                    "Revisão por Pares (Peer Review).",
                    "Auditoria Física no Rack.",
                    "Testes de Estresse.",
                    "Discovery Automatizado via SNMP."
                ],
                answer: "Testes de Estresse."
            },
            {
                id: 10,
                instruction: "Contingência e Gestão de Crise.",
                scenario: "A implantação do novo cluster de Servidores Xeon corrompeu o sistema principal durante a madrugada. A janela de manutenção esgotou.",
                text: "Qual deve ser a ação imediata acionada pelo Responsável Técnico?",
                options: [
                    "Submeter uma nova RFC urgente.",
                    "Executar o Plano de Rollback para voltar ao estado anterior estável.",
                    "Aplicar uma Manutenção Preditiva nos discos antigos.",
                    "Passar a responsabilidade para o cliente final homologar o erro."
                ],
                answer: "Executar o Plano de Rollback para voltar ao estado anterior estável."
            }
        ]);

        const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
        const progressPercentage = computed(() => ((currentQuestionIndex.value) / questions.value.length) * 100);

        // --- Lógica Principal do Terminal ---
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
            await typeWriter(`Iniciando tarefa [${currentQuestion.value.id}/${questions.value.length}]...`, "log-info");
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
                addLog("Deploy finalizado. Consolidando métricas para geração de relatório RFC...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Validação aceita. Configuração aplicada com sucesso.";
                addLog("Sucesso: Parâmetro técnico validado e salvo.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Rollback máximo atingido. Resposta correta: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Serviço indisponível. Executando rollback forçado...", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Alerta de Sistema. Tentativas de estabilização: ${maxAttempts - attempts.value}`;
                    addLog(`Warning: Configuração incompatível. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente domínio técnico em infraestrutura e governança de TI.";
            if (score.value < 7) performanceMsg = "Recomenda-se revisão dos conceitos de ITIL, Gestão de Mudanças e PDCA.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Homologação e Infraestrutura</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificado de Avaliação de Deploy</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Auditoria:</strong> ${data}</p>
                    <p>Este documento formaliza a execução de testes envolvendo ${questions.value.length} cenários críticos de Implantação de Sistemas, abordando gestão de hardware, segurança, metodologias 5W2H e processos de manutenção baseados em ITIL.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Status do Ambiente (Resultado)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 7 ? '#10B981' : (score.value >= 5 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Validações Bem-Sucedidas</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Auditoria: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador INFRA.DEPLOY
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Infra_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reinicializando instâncias do Data Center...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Conectando ao terminal de produção via SSH...", "log-info");
            addLog("Autenticação bem-sucedida. Carregando scripts de implantação...", "log-success");
            setTimeout(() => { loadQuestion(); }, 1500);
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