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

        // --- Banco de Questões (Atualizado com base no material "Interação e UX") ---
        const questions = ref([
            {
                id: 1,
                instruction: "Diferença entre IHC e UX",
                scenario: "Um diretor questiona a equipe sobre a diferença de escopo entre IHC e UX.",
                text: "De acordo com o material, qual a principal diferença?",
                options: [
                    "IHC foca no ponto de contato (interface) e redução do esforço mental; UX foca na jornada completa (antes, durante e depois).",
                    "IHC é voltado para o marketing de produto; UX é a programação front-end da tela.",
                    "IHC avalia emoções e percepção de valor; UX avalia unicamente o número de cliques em um botão.",
                    "Não há diferença, ambos são focados unicamente na estética visual da interface."
                ],
                answer: "IHC foca no ponto de contato (interface) e redução do esforço mental; UX foca na jornada completa (antes, durante e depois)."
            },
            {
                id: 2,
                instruction: "O Impacto da IHC na UX",
                scenario: "A equipe de design finalizou a interface de um app com excelente acessibilidade e baixo esforço cognitivo.",
                text: "Qual é a relação estrutural entre as decisões de IHC e a UX do produto?",
                options: [
                    "A IHC é independente da UX, atuando apenas no hardware.",
                    "Um bom projeto de IHC é o meio fundamental para garantir uma UX (jornada) positiva.",
                    "A IHC prejudica a UX por limitar a liberdade artística do design.",
                    "A IHC avalia a jornada completa, enquanto a UX foca no esforço visual."
                ],
                answer: "Um bom projeto de IHC é o meio fundamental para garantir uma UX (jornada) positiva."
            },
            {
                id: 3,
                instruction: "Etapas da Jornada do Usuário",
                scenario: "O time de marketing atraiu o cliente na etapa de Descoberta, e ele interagiu com sucesso no sistema (IHC/Interface).",
                text: "De acordo com a jornada completa do usuário (UX), qual etapa fecha esse ciclo?",
                options: [
                    "Codificação Front-end",
                    "Acessibilidade Cognitiva",
                    "Retenção (Suporte/Fidelidade)",
                    "Mapeamento de Modelo Mental"
                ],
                answer: "Retenção (Suporte/Fidelidade)"
            },
            {
                id: 4,
                instruction: "Mito da Acessibilidade",
                scenario: "Um desenvolvedor argumenta que o modo de alto contraste só deve ser priorizado se o público-alvo for composto por pessoas com deficiência visual.",
                text: "Como você deve corrigi-lo com base no princípio do 'Mito da Acessibilidade'?",
                options: [
                    "Acessibilidade é opcional, dependendo do orçamento do projeto.",
                    "A acessibilidade não beneficia apenas pessoas com deficiência permanente, mas a todos em diferentes contextos (ex: sol forte na tela).",
                    "Ele está correto, acessibilidade é exclusiva para o público PCD.",
                    "Acessibilidade só diz respeito à leitura de tela por voz."
                ],
                answer: "A acessibilidade não beneficia apenas pessoas com deficiência permanente, mas a todos em diferentes contextos (ex: sol forte na tela)."
            },
            {
                id: 5,
                instruction: "Ruptura do Modelo Mental",
                scenario: "Um aplicativo bancário colocou a função de 'Transferências' escondida dentro do menu de 'Pagamentos', e as reclamações de usuários subiram rapidamente.",
                text: "O que explica a dificuldade dos usuários em encontrar a funcionalidade?",
                options: [
                    "Os usuários não leram o manual de instruções.",
                    "Ocorreu uma ruptura do modelo mental, pois a interface não corresponde à expectativa lógica do usuário.",
                    "Faltou suporte a múltiplas linguagens no sistema bancário.",
                    "Houve um excesso de visibilidade do status do sistema."
                ],
                answer: "Ocorreu uma ruptura do modelo mental, pois a interface não corresponde à expectativa lógica do usuário."
            },
            {
                id: 6,
                instruction: "Arquitetura da Informação",
                scenario: "Em um e-commerce, os usuários não encontram o 'Histórico de Compras' porque está posicionado dentro de 'Configurações' ao invés de 'Meus Pedidos'.",
                text: "Qual princípio de arquitetura da informação foi violado?",
                options: [
                    "Estética Minimalista",
                    "Visibilidade do Status",
                    "Ergonomia Física",
                    "Agrupamento por Similaridade"
                ],
                answer: "Agrupamento por Similaridade"
            },
            {
                id: 7,
                instruction: "Heurísticas de Nielsen",
                scenario: "O usuário faz o upload de um grande relatório. O sistema não exibe barra de progresso, apenas uma tela paralisada por vários minutos.",
                text: "Qual heurística falhou diretamente nesta situação?",
                options: [
                    "Visibilidade do Status (Feedback constante)",
                    "Prevenção de Erros",
                    "Estética e design minimalista",
                    "Consistência e Padronização"
                ],
                answer: "Visibilidade do Status (Feedback constante)"
            },
            {
                id: 8,
                instruction: "Mensagens de Erro",
                scenario: "Após errar a digitação da senha, o site emite um aviso pop-up contendo apenas o texto: 'Erro 503'.",
                text: "Por que essa abordagem é inadequada segundo as diretrizes de avaliação?",
                options: [
                    "Mensagens de erro devem ser extensas e possuir código-fonte explicativo.",
                    "Não houve quebra de modelo mental, a mensagem está correta.",
                    "Exibir apenas um código técnico sem explicação viola a usabilidade; mensagens devem ser claras e precisas.",
                    "O sistema deveria reiniciar em vez de exibir mensagem."
                ],
                answer: "Exibir apenas um código técnico sem explicação viola a usabilidade; mensagens devem ser claras e precisas."
            },
            {
                id: 9,
                instruction: "Prevenção de Erros",
                scenario: "O analista desenha uma página de exclusão de conta em que não há mensagem de confirmação ou passos extras, causando exclusões acidentais.",
                text: "O que a heurística 'Prevenção de Erros' diz sobre isso?",
                options: [
                    "Melhor que uma boa mensagem de erro é evitar que ele ocorra (ex: pedindo confirmação).",
                    "O sistema deve focar apenas na correção do erro posteriormente.",
                    "Erros são inevitáveis e o design deve ignorá-los.",
                    "Basta aplicar agrupamento por similaridade."
                ],
                answer: "Melhor que uma boa mensagem de erro é evitar que ele ocorra (ex: pedindo confirmação)."
            },
            {
                id: 10,
                instruction: "Avaliação Heurística",
                scenario: "Sua equipe precisa descobrir falhas graves de padronização nas telas recém-desenhadas, sem orçamento para contratar usuários reais neste primeiro momento.",
                text: "Por que a Avaliação Heurística é o método indicado?",
                options: [
                    "Porque não exige especialistas, apenas robôs de teste.",
                    "Porque substitui para sempre o contato com o cliente real.",
                    "Porque é conduzida por usuários finais no meio da rua.",
                    "Porque é extremamente eficiente em termos de custo, rapidez e focada em quebras de padrão óbvias."
                ],
                answer: "Porque é extremamente eficiente em termos de custo, rapidez e focada em quebras de padrão óbvias."
            },
            {
                id: 11,
                instruction: "Limitações do Especialista",
                scenario: "Mesmo após os especialistas validarem todas as heurísticas, o produto apresentou confusões de uso durante o lançamento com o público sênior.",
                text: "Que fenômeno explica isso?",
                options: [
                    "Consistência e Padronização",
                    "Ergonomia Cognitiva Excedente",
                    "O Ponto Cego do Avaliador (especialistas avaliam regras, mas não têm o contexto real do usuário final)",
                    "Falha na Ordem Lógica do hardware"
                ],
                answer: "O Ponto Cego do Avaliador (especialistas avaliam regras, mas não têm o contexto real do usuário final)"
            },
            {
                id: 12,
                instruction: "Sinergia de Métodos",
                scenario: "A equipe debate se deve fazer Avaliação Heurística ou Teste com Usuários.",
                text: "Qual é o cronograma (passos) correto para a aplicação dos dois métodos visando a garantia da qualidade?",
                options: [
                    "1º Passo: Testes com Usuários / 2º Passo: Avaliação Heurística",
                    "1º Passo: Avaliação Heurística ('Limpar o terreno') / 2º Passo: Testes com Usuários ('Validar a jornada')",
                    "Apenas testes com usuários, heurísticas estão defasadas.",
                    "Fazê-los simultaneamente na mesma sala com o desenvolvedor."
                ],
                answer: "1º Passo: Avaliação Heurística ('Limpar o terreno') / 2º Passo: Testes com Usuários ('Validar a jornada')"
            },
            {
                id: 13,
                instruction: "Regra de Ouro da Inspeção",
                scenario: "O CEO quer eliminar a fase de pesquisa de campo, alegando que uma inspeção heurística bem feita é suficiente para o produto ir ao ar.",
                text: "Segundo a Regra de Ouro, qual o erro estratégico dessa decisão?",
                options: [
                    "A inspeção heurística é complementar e nunca deve substituir a observação de usuários reais.",
                    "Inspeção heurística foca só em mobile, ignorando desktops.",
                    "Nenhum erro, o CEO está seguindo as melhores práticas globais.",
                    "O erro é não usar o Agrupamento por Similaridade no lugar."
                ],
                answer: "A inspeção heurística é complementar e nunca deve substituir a observação de usuários reais."
            },
            {
                id: 14,
                instruction: "Entrevista Exploratória",
                scenario: "Um time de produto iniciou o desenvolvimento desenhando protótipos em alta fidelidade com base em achismos, antes mesmo de falar com o público.",
                text: "O que eles deveriam ter aplicado na fase inicial para entender hábitos e frustrações?",
                options: [
                    "Testes de A/B em produção.",
                    "Avaliação Heurística de Nielsen.",
                    "Entrevista Exploratória.",
                    "Inspeção de Código-Fonte."
                ],
                answer: "Entrevista Exploratória."
            },
            {
                id: 15,
                instruction: "Ergonomia Cognitiva",
                scenario: "Um painel de aviação exibe milhares de luzes simultâneas sem hierarquia, forçando a mente do piloto a tentar entender tudo ao mesmo tempo.",
                text: "Qual campo da IHC lida com a facilidade de processamento da informação pela mente humana?",
                options: [
                    "Ergonomia Cognitiva",
                    "Agrupamento Físico",
                    "Acessibilidade Visual",
                    "Retenção de Descoberta"
                ],
                answer: "Ergonomia Cognitiva"
            },
            {
                id: 16,
                instruction: "Pilares da Interação - Ordem Lógica",
                scenario: "O Arquiteto da Informação está mapeando como os menus do sistema de RH serão categorizados, organizando o fluxo de tarefas para não confundir o usuário.",
                text: "Ele está atuando primariamente em qual pilar do Projeto de Interação?",
                options: [
                    "Ordem Física",
                    "Ordem Comportamental",
                    "Ordem Visual",
                    "Ordem Lógica (O Pensamento e a Estrutura)"
                ],
                answer: "Ordem Lógica (O Pensamento e a Estrutura)"
            },
            {
                id: 17,
                instruction: "Pilares da Interação - Ordem Física",
                scenario: "Durante o refinamento do aplicativo, o designer aumenta os botões para facilitar o toque na tela do celular e ajusta o contraste das fontes.",
                text: "Essas decisões afetam diretamente qual pilar do Projeto de Interação?",
                options: [
                    "Ordem Lógica",
                    "Ordem Física (O Meio e a Interface)",
                    "Ordem Comportamental",
                    "Ruptura Cognitiva"
                ],
                answer: "Ordem Física (O Meio e a Interface)"
            },
            {
                id: 18,
                instruction: "Pilares da Interação - Ordem Comportamental",
                scenario: "Um desenvolvedor de jogos configura a interface para reagir aos cliques do jogador com sons e vibrações (feedback real time).",
                text: "A sensação gerada e a reação do sistema integram qual pilar do projeto?",
                options: [
                    "Ordem Lógica",
                    "Ordem Física",
                    "Ordem Comportamental (A Reação e a Emoção)",
                    "Visibilidade Exploratória"
                ],
                answer: "Ordem Comportamental (A Reação e a Emoção)"
            },
            {
                id: 19,
                instruction: "Esforço em Sistemas de Entretenimento",
                scenario: "Uma equipe que sempre desenvolveu ferramentas financeiras (onde busca-se zero esforço cognitivo) foi remanejada para criar um videogame desafiador.",
                text: "O que eles precisam desaprender sobre esforço cognitivo ao migrar para a área de jogos?",
                options: [
                    "Jogos precisam de modelos mentais complexos inacessíveis.",
                    "Diferente de sistemas utilitários, no entretenimento o esforço e a atenção podem ser prazerosos (engajamento).",
                    "Não há diferença, um jogo também exige a heurística do esforço mental nulo absoluto.",
                    "Em jogos, a acessibilidade WCAG é proibida."
                ],
                answer: "Diferente de sistemas utilitários, no entretenimento o esforço e a atenção podem ser prazerosos (engajamento)."
            },
            {
                id: 20,
                instruction: "Conceito Final UX != Visual",
                scenario: "O dono do produto diz: 'Se deixarmos o aplicativo bonito e com gradientes modernos, a UX já estará resolvida.'",
                text: "Como você pode fundamentar, com base nas dicas da disciplina, que isso é uma visão imprecisa?",
                options: [
                    "Estética não influencia em nada no uso humano de computadores.",
                    "UX != Visual: A experiência envolve comportamento, sistema de uso e lógica, não apenas estética.",
                    "Ele está quase certo, faltou apenas aprovação da heurística estética.",
                    "A UX foca exclusivamente nas decisões de cores do CSS."
                ],
                answer: "UX != Visual: A experiência envolve comportamento, sistema de uso e lógica, não apenas estética."
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
            await typeWriter(`Carregando Desafio ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Auditoria concluída. Processando resultados para emissão de certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Vulnerabilidade de UX contornada.";
                addLog("Sucesso: Diagnóstico preciso.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Usuário abandonou o sistema.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Diagnóstico Incorreto. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Diagnóstico incorreto. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente capacidade de diagnóstico de interfaces.";
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de IHC, DCU e Heurísticas.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Avaliação IHC e UX</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Usabilidade</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo processos de pesquisa, carga cognitiva, modelos mentais, arquitetura de informação e métodos de avaliação.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento validado tecnicamente pelo Simulador IHC.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `IHC_Relatorio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reiniciando simulação de IHC...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador IHC_EVAL_v2.0...", "log-info");
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