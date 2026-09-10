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

        // --- Banco de Questões (30 Questões - BPMN, Inovação e Intraempreendedorismo) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Conceito de BPMN",
                scenario: "Uma empresa precisa padronizar sua linguagem de processos entre a equipe técnica e de negócios.",
                text: "O que significa a sigla BPMN e qual o seu objetivo principal?",
                options: [
                    "Business Process Model and Notation, visa representar fluxos complexos de forma intuitiva e técnica.",
                    "Business Plan Management, focado apenas em gestão financeira.",
                    "Business Process Model and Notation, exclusivo para programadores de software.",
                    "Business Process Mapping Notation, serve apenas para criar fluxogramas simples sem automação."
                ],
                answer: "Business Process Model and Notation, visa representar fluxos complexos de forma intuitiva e técnica."
            },
            {
                id: 2,
                instruction: "Diferença entre BPMN e Fluxograma",
                scenario: "Um analista está em dúvida se desenha um fluxograma no PowerPoint ou usa BPMN para um processo de automação.",
                text: "Qual é a principal vantagem do BPMN em relação a um fluxograma genérico?",
                options: [
                    "BPMN possui especificação formal, mostra responsabilidades e permite automação executável.",
                    "Fluxogramas possuem mais de 100 símbolos padronizados pela OMG.",
                    "Ambos são exatamente iguais, variando apenas o software utilizado.",
                    "BPMN não permite representar exceções ou eventos, sendo mais simples que o fluxograma."
                ],
                answer: "BPMN possui especificação formal, mostra responsabilidades e permite automação executável."
            },
            {
                id: 3,
                instruction: "Governança do BPMN",
                scenario: "Um estudante quer consultar a documentação oficial da notação BPMN para garantir que está usando os símbolos corretos.",
                text: "Qual organização é atualmente responsável por manter a especificação do BPMN?",
                options: [
                    "OMG (Object Management Group).",
                    "PMI (Project Management Institute).",
                    "ISO (International Organization for Standardization).",
                    "W3C (World Wide Web Consortium)."
                ],
                answer: "OMG (Object Management Group)."
            },
            {
                id: 4,
                instruction: "Certificações de Mercado",
                scenario: "Um arquiteto de processos deseja obter a certificação mais direta e específica sobre a notação BPMN.",
                text: "Qual é a certificação focada em BPMN concedida pelo Object Management Group (OMG)?",
                options: [
                    "OCEB 2 (OMG Certified Expert in BPM 2.0).",
                    "CBPP (Certified Business Process Professional).",
                    "CBPA (Certified Business Process Associate).",
                    "PMP (Project Management Professional)."
                ],
                answer: "OCEB 2 (OMG Certified Expert in BPM 2.0)."
            },
            {
                id: 5,
                instruction: "Certificações de Mercado",
                scenario: "Um profissional sênior com 5 anos de experiência quer uma certificação de prestígio no Brasil baseada no guia BPM CBOK.",
                text: "Qual certificação chancelada pela ABPMP é a mais adequada para este perfil?",
                options: [
                    "CBPP (Certified Business Process Professional).",
                    "CBPA (Certified Business Process Associate).",
                    "OCEB 2 Fundamental.",
                    "Certificação em BPMS (Camunda)."
                ],
                answer: "CBPP (Certified Business Process Professional)."
            },
            {
                id: 6,
                instruction: "Certificações de Mercado",
                scenario: "Um recém-formado com menos de 1 ano de experiência quer começar sua jornada em gestão de processos.",
                text: "Qual credencial da ABPMP é voltada para profissionais iniciantes?",
                options: [
                    "CBPA (Certified Business Process Associate).",
                    "CBPP (Certified Business Process Professional).",
                    "OCEB 2 Advanced.",
                    "Scrum Master."
                ],
                answer: "CBPA (Certified Business Process Associate)."
            },
            {
                id: 7,
                instruction: "Mapeamento de Processos",
                scenario: "A equipe vai iniciar um projeto de melhoria, mas o gerente sugere pular a etapa de documentar o processo atual.",
                text: "Por que o mapeamento do processo 'As Is' (Como É) é fundamental?",
                options: [
                    "Porque é a fotografia atual, permitindo entender a realidade, falhas e gargalos antes de tentar melhorar.",
                    "Porque ele já traz a solução definitiva e os processos inovadores da empresa.",
                    "Porque sem ele não é possível demitir os funcionários improdutivos.",
                    "Porque o sistema BPM exige que o fluxo seja desenhado sem erros desde o início."
                ],
                answer: "Porque é a fotografia atual, permitindo entender a realidade, falhas e gargalos antes de tentar melhorar."
            },
            {
                id: 8,
                instruction: "Mapeamento de Processos",
                scenario: "Após analisar os problemas do departamento, o analista desenha um novo fluxo otimizado, sem desperdícios.",
                text: "Como é chamado esse mapeamento do estado futuro desejado?",
                options: [
                    "Processo To Be (Como Será).",
                    "Processo As Is (Como É).",
                    "Processo To Do (A Fazer).",
                    "Processo Done (Concluído)."
                ],
                answer: "Processo To Be (Como Será)."
            },
            {
                id: 9,
                instruction: "BPMN como ferramenta",
                scenario: "Um funcionário proativo encontrou uma ineficiência na empresa e quer sugerir uma mudança à diretoria.",
                text: "Qual é a melhor abordagem intraempreendedora utilizando BPMN?",
                options: [
                    "Mapear o caos (As Is) para provar as perdas e desenhar a solução (To Be) estruturada.",
                    "Apenas criticar verbalmente o processo atual durante a reunião.",
                    "Desenhar apenas o 'To Be' pois a diretoria não precisa saber dos problemas atuais.",
                    "Ignorar o BPMN e enviar um e-mail longo explicando a ideia."
                ],
                answer: "Mapear o caos (As Is) para provar as perdas e desenhar a solução (To Be) estruturada."
            },
            {
                id: 10,
                instruction: "Elementos BPMN - Eventos",
                scenario: "Ao desenhar um modelo BPMN, você precisa mostrar que o processo começa quando o cliente envia um e-mail.",
                text: "Qual elemento visual representa o início de um processo?",
                options: [
                    "Círculo com borda fina única.",
                    "Círculo com borda dupla.",
                    "Círculo com borda grossa.",
                    "Um losango com um X no meio."
                ],
                answer: "Círculo com borda fina única."
            },
            {
                id: 11,
                instruction: "Elementos BPMN - Eventos",
                scenario: "No meio do processo de contratação, é necessário aguardar 24 horas pela resposta do candidato.",
                text: "Como esse atraso programado no fluxo deve ser representado?",
                options: [
                    "Como um Evento Intermediário (borda dupla).",
                    "Como um Evento de Fim (borda grossa).",
                    "Como uma Tarefa de Usuário.",
                    "Como um Gateway Paralelo."
                ],
                answer: "Como um Evento Intermediário (borda dupla)."
            },
            {
                id: 12,
                instruction: "Elementos BPMN - Atividades",
                scenario: "O setor financeiro realiza uma etapa automática onde um software via API consulta o Serasa.",
                text: "Como essa atividade deve ser mapeada no BPMN para ser automatizada?",
                options: [
                    "Tarefa de Serviço.",
                    "Tarefa de Usuário.",
                    "Tarefa Manual.",
                    "Subprocesso."
                ],
                answer: "Tarefa de Serviço."
            },
            {
                id: 13,
                instruction: "Elementos BPMN - Atividades",
                scenario: "Um operário precisa pegar uma caixa do chão e colocá-la na prateleira sem usar nenhum sistema.",
                text: "Qual o tipo de tarefa correta no BPMN?",
                options: [
                    "Tarefa Manual.",
                    "Tarefa de Usuário.",
                    "Tarefa de Envio.",
                    "Tarefa de Regra de Negócio."
                ],
                answer: "Tarefa Manual."
            },
            {
                id: 14,
                instruction: "Elementos BPMN - Atividades",
                scenario: "O fluxo de reembolso é muito grande e polui a tela principal. O analista decide ocultar os detalhes de aprovação.",
                text: "O que ele deve usar para agrupar tarefas colapsadas e reutilizáveis?",
                options: [
                    "Um Subprocesso.",
                    "Uma Tarefa de Regra de Negócio.",
                    "Um Gateway Inclusivo.",
                    "Um Objeto de Dados."
                ],
                answer: "Um Subprocesso."
            },
            {
                id: 15,
                instruction: "Controle de Fluxo - Gateways",
                scenario: "Um documento foi analisado. Se estiver correto, vai para o financeiro. Se estiver errado, volta para revisão.",
                text: "Qual gateway garante que apenas UM desses caminhos seja seguido?",
                options: [
                    "Gateway Exclusivo (X).",
                    "Gateway Paralelo (+).",
                    "Gateway Inclusivo (O).",
                    "Gateway Complexo (*)."
                ],
                answer: "Gateway Exclusivo (X)."
            },
            {
                id: 16,
                instruction: "Controle de Fluxo - Gateways",
                scenario: "Um novo funcionário foi contratado. O RH precisa preparar o contrato E a TI precisa configurar o notebook ao mesmo tempo.",
                text: "Que gateway divide o fluxo para que todos os caminhos sejam executados simultaneamente?",
                options: [
                    "Gateway Paralelo (+).",
                    "Gateway Exclusivo (X).",
                    "Gateway Inclusivo (O).",
                    "Evento Intermediário."
                ],
                answer: "Gateway Paralelo (+)."
            },
            {
                id: 17,
                instruction: "Controle de Fluxo - Gateways",
                scenario: "O cliente faz um pedido que pode conter produtos digitais, físicos ou ambos.",
                text: "Qual gateway permite seguir um ou mais caminhos, dependendo da regra escolhida?",
                options: [
                    "Gateway Inclusivo (O).",
                    "Gateway Paralelo (+).",
                    "Gateway Exclusivo (X).",
                    "Tarefa de Decisão."
                ],
                answer: "Gateway Inclusivo (O)."
            },
            {
                id: 18,
                instruction: "Conexões no BPMN",
                scenario: "Você precisa mostrar um e-mail sendo enviado da sua empresa (Pool A) para o Cliente (Pool B).",
                text: "Qual conector deve ser usado para mostrar a troca de informações entre Pools diferentes?",
                options: [
                    "Fluxo de Mensagem (linha tracejada).",
                    "Fluxo de Sequência (linha sólida).",
                    "Associação (linha pontilhada).",
                    "Evento de Ligação."
                ],
                answer: "Fluxo de Mensagem (linha tracejada)."
            },
            {
                id: 19,
                instruction: "Conexões no BPMN",
                scenario: "Dentro do departamento Financeiro, após a Tarefa 1 terminar, a Tarefa 2 deve iniciar.",
                text: "Qual conector mostra a ordem de execução das atividades dentro da mesma Pool?",
                options: [
                    "Fluxo de Sequência (linha sólida).",
                    "Fluxo de Mensagem (linha tracejada).",
                    "Associação (linha pontilhada).",
                    "Subprocesso."
                ],
                answer: "Fluxo de Sequência (linha sólida)."
            },
            {
                id: 20,
                instruction: "Organização BPMN",
                scenario: "Em um fluxo, existem tarefas executadas pela Empresa e ações executadas pelo Fornecedor Externo.",
                text: "O que representa cada participante principal no diagrama BPMN?",
                options: [
                    "Pool (Piscina).",
                    "Raia (Lane).",
                    "Objeto de Dados.",
                    "Gateway."
                ],
                answer: "Pool (Piscina)."
            },
            {
                id: 21,
                instruction: "Organização BPMN",
                scenario: "Dentro da empresa, você precisa separar visualmente o que é responsabilidade do RH, TI e Compras.",
                text: "Qual elemento subdivide uma Pool para mostrar responsabilidades internas?",
                options: [
                    "Raias (Swimlanes).",
                    "Eventos.",
                    "Fluxos de Sequência.",
                    "Armazenamento de Dados."
                ],
                answer: "Raias (Swimlanes)."
            },
            {
                id: 22,
                instruction: "Artefatos BPMN",
                scenario: "Uma tarefa exige que o funcionário preencha um formulário de solicitação de férias.",
                text: "Como representar esse formulário (documento) que dá contexto à tarefa no fluxo?",
                options: [
                    "Como um Objeto de Dados.",
                    "Como uma Tarefa de Usuário.",
                    "Como um Armazenamento de Dados.",
                    "Como uma Associação de Texto."
                ],
                answer: "Como um Objeto de Dados."
            },
            {
                id: 23,
                instruction: "Artefatos BPMN",
                scenario: "Após o cadastro, as informações do cliente são salvas no CRM da empresa de forma persistente.",
                text: "Qual elemento BPMN deve ser usado para representar o CRM?",
                options: [
                    "Armazenamento de Dados.",
                    "Objeto de Dados.",
                    "Anotação de Texto.",
                    "Gateway de Banco."
                ],
                answer: "Armazenamento de Dados."
            },
            {
                id: 24,
                instruction: "Inovação Organizacional",
                scenario: "Uma loja física decide modernizar apenas trocando seus computadores, mas continua operando da mesma forma.",
                text: "De acordo com o material, por que isso NÃO é plenamente Inovação Organizacional?",
                options: [
                    "Porque a verdadeira inovação exige mudança profunda de processos, modelos de negócio e cultura, não apenas tecnologia.",
                    "Porque inovar exige criar um mercado totalmente novo no mundo.",
                    "Porque computadores não são considerados ferramentas de inovação.",
                    "Porque ela precisaria primeiro desenhar o fluxo BPMN As Is."
                ],
                answer: "Porque a verdadeira inovação exige mudança profunda de processos, modelos de negócio e cultura, não apenas tecnologia."
            },
            {
                id: 25,
                instruction: "Case de Transformação",
                scenario: "O Magazine Luiza transformou suas lojas físicas em mini-centros de distribuição.",
                text: "Esse movimento focado em integrar estoques físicos e digitais é um exemplo de inovação em qual área?",
                options: [
                    "Na estrutura organizacional e no modelo logístico (omnichannel).",
                    "Apenas na interface do aplicativo para o usuário final.",
                    "No formato de contratação temporária via BPMN.",
                    "Na terceirização total de seus serviços de TI."
                ],
                answer: "Na estrutura organizacional e no modelo logístico (omnichannel)."
            },
            {
                id: 26,
                instruction: "Comportamento Organizacional",
                scenario: "Um colaborador percebe uma falha grave, busca soluções com recursos internos da empresa e assume os riscos da ideia.",
                text: "Como esse profissional é classificado?",
                options: [
                    "Intraempreendedor.",
                    "Analista As Is.",
                    "Consultor Externo.",
                    "Empreendedor Independente."
                ],
                answer: "Intraempreendedor."
            },
            {
                id: 27,
                instruction: "Intraempreendedorismo na Prática",
                scenario: "Ken Kutaragi criou um chip de som escondido e depois propôs um console para a Sony, que relutava em jogos.",
                text: "Qual característica intraempreendedora este case ilustra perfeitamente?",
                options: [
                    "A proatividade e rebeldia construtiva desafiando o status quo da empresa.",
                    "A obediência estrita ao organograma de inovação Top-Down.",
                    "A terceirização de ideias para empresas concorrentes.",
                    "O uso de Gateways Exclusivos para barrar novos produtos."
                ],
                answer: "A proatividade e rebeldia construtiva desafiando o status quo da empresa."
            },
            {
                id: 28,
                instruction: "Ecossistema da Inovação",
                scenario: "Uma empresa tem ótimos funcionários, mas toda nova ideia é barrada por medo de errar e excesso de punição.",
                text: "O que falta nesse ecossistema para que a inovação aconteça?",
                options: [
                    "Segurança psicológica e tolerância ao erro (O Combustível).",
                    "Mapeamento BPMN rigoroso limitando tentativas.",
                    "Apenas mais recursos financeiros.",
                    "Demissão dos funcionários rebeldes."
                ],
                answer: "Segurança psicológica e tolerância ao erro (O Combustível)."
            },
            {
                id: 29,
                instruction: "Relação Intraempreendedor e Inovação",
                scenario: "O material de estudo apresenta um fluxograma conceitual sobre como a inovação acontece na empresa.",
                text: "Nessa relação, qual é o papel do Intraempreendedor?",
                options: [
                    "Ele é a Faísca.",
                    "Ele é o Combustível.",
                    "Ele é o Resultado.",
                    "Ele é a Burocracia."
                ],
                answer: "Ele é a Faísca."
            },
            {
                id: 30,
                instruction: "Visão Crítica de Futuro",
                scenario: "O CEO celebra que a empresa faz seus produtos tradicionais perfeitamente e sem erros há 30 anos.",
                text: "Segundo as considerações finais, qual é o maior risco oculto nessa situação?",
                options: [
                    "Acertar perfeitamente em algo que já não importa mais para o mercado.",
                    "Perder muito dinheiro tentando inovar.",
                    "Os funcionários pedirem aumento pelos 30 anos de lucro.",
                    "O processo To Be se tornar um As Is muito rápido."
                ],
                answer: "Acertar perfeitamente em algo que já não importa mais para o mercado."
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
            await typeWriter(`Carregando Desafio Analítico ${currentQuestion.value.id}...`, "log-info");
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Lógica validada com sucesso.";
                addLog("Sucesso: Análise precisa.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Análise incorreta.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Lógica Incorreta. Tentativas restantes: ${maxAttempts - attempts.value}`;
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
            
            let performanceMsg = "Excelente compreensão dos fundamentos de Inovação Organizacional e BPMN.";
            if (score.value < 20) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos teóricos de Notação BPMN e Intraempreendedorismo.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Análise e Inovação</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Resolução de Problemas Complexos</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do estudante pelas ${questions.value.length} análises críticas envolvendo fundamentos práticos de Inovação Organizacional, Intraempreendedorismo e modelagem BPMN.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 24 ? '#10B981' : (score.value >= 15 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador INNOV_EVAL_v2.0
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Inovacao_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando avaliador analítico...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador INNOV_EVAL_v2.0...", "log-info");
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