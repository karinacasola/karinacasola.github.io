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

        // --- Banco de Questões (As 20 do PDF: Ergonomia & IHC) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Definição de Ergonomia Cognitiva.",
                scenario: "Durante uma reunião de planejamento, a equipe discute como o sistema deve interagir com as capacidades mentais do usuário.",
                text: "Segundo o material, qual é o foco principal da ergonomia cognitiva?",
                options: [
                    "Postura e manuseio de equipamentos de hardware.",
                    "Processos mentais como percepção, memória e raciocínio na interação.",
                    "Estética e escolha paletas de cores das interfaces gráficas.",
                    "Velocidade de processamento do servidor de banco de dados."
                ],
                answer: "Processos mentais como percepção, memória e raciocínio na interação."
            },
            {
                id: 2,
                instruction: "Diferença entre Ergonomia Física e Cognitiva.",
                scenario: "Um hospital está comprando mesas cirúrgicas com ajuste de altura e desenvolvendo novos painéis de controle para UTI.",
                text: "O ajuste de altura da mesa e o layout do painel de controle da UTI são exemplos, respectivamente, de:",
                options: [
                    "Ergonomia Cognitiva e Ergonomia Física.",
                    "Apenas Ergonomia Cognitiva em ambos os casos.",
                    "Ergonomia Física e Ergonomia Cognitiva.",
                    "Design Centrado no Sistema e Usabilidade."
                ],
                answer: "Ergonomia Física e Ergonomia Cognitiva."
            },
            {
                id: 3,
                instruction: "Processamento Humano: Leitura e Escrita.",
                scenario: "O usuário olha para a tela e precisa transformar os ícones que vê em ações para o sistema.",
                text: "No modelo de processamento humano estudado, a etapa de percepção (Leitura/Escrita) refere-se a:",
                options: [
                    "Acesso a modelos mentais prévios na memória de longo prazo.",
                    "Ajuste da postura ergonômica da cadeira.",
                    "Monitoramento do próprio pensamento (metacognição).",
                    "Decodificação de símbolos e tradução de intenções."
                ],
                answer: "Decodificação de símbolos e tradução de intenções."
            },
            {
                id: 4,
                instruction: "Processamento Humano: Recuperação.",
                scenario: "Um usuário clica instintivamente no ícone de um disquete para salvar um arquivo, mesmo sem nunca ter usado um disquete físico.",
                text: "Esse comportamento é um exemplo clássico de qual etapa do processamento humano?",
                options: [
                    "Percepção visual.",
                    "Memória (acessar modelos mentais prévios).",
                    "Metacognição.",
                    "Ergonomia física."
                ],
                answer: "Memória (acessar modelos mentais prévios)."
            },
            {
                id: 5,
                instruction: "Conceito de Metacognição.",
                scenario: "Durante o preenchimento de um longo formulário de imposto de renda, o usuário começa a se perguntar: 'Estou fazendo certo?'",
                text: "Como um sistema de IHC pode auxiliar na metacognição do usuário?",
                options: [
                    "Removendo todas as informações e botões de ajuda da tela.",
                    "Utilizando o sistema para ajudar o usuário a monitorar sua própria performance (ex: barras de progresso).",
                    "Aumentando a quantidade de cliques para forçar a atenção.",
                    "Ignorando o feedback para reduzir a carga do servidor."
                ],
                answer: "Utilizando o sistema para ajudar o usuário a monitorar sua própria performance (ex: barras de progresso)."
            },
            {
                id: 6,
                instruction: "Modelo de Escrita e Leitura em Interfaces.",
                scenario: "A interface é vista como um canal de comunicação. O designer criou um botão com um ícone muito abstrato que ninguém entende.",
                text: "No modelo autor-interface-usuário, por que a 'leitura' falha neste caso?",
                options: [
                    "Porque o designer usou códigos e signos que o usuário não domina.",
                    "Porque o sistema operacional está desatualizado.",
                    "Porque a ergonomia física do monitor está causando reflexos.",
                    "Porque não há tempo suficiente para o aprendizado cognitivo."
                ],
                answer: "Porque o designer usou códigos e signos que o usuário não domina."
            },
            {
                id: 7,
                instruction: "Limitações da Memória.",
                scenario: "Um menu de navegação de um site de notícias apresenta 15 categorias de uma só vez, gerando confusão nos leitores.",
                text: "Qual regra fundamental para evitar sobrecarga na Memória de Curto Prazo está sendo violada?",
                options: [
                    "A Lei de Hick sobre tomada de decisões.",
                    "O uso de modelos mentais coincidentes.",
                    "A regra dos 7 ± 2 itens.",
                    "A metacognição orientada."
                ],
                answer: "A regra dos 7 ± 2 itens."
            },
            {
                id: 8,
                instruction: "Reconhecimento vs. Recordação.",
                scenario: "O sistema exige que o usuário decore e digite o código de 8 dígitos de um cliente, em vez de oferecer uma busca pelo nome.",
                text: "Segundo os princípios de recuperação de memória vistos, por que isso é uma má prática?",
                options: [
                    "Porque aumenta a acessibilidade geral do sistema.",
                    "Porque a memória de curto prazo tem capacidade infinita.",
                    "Porque é mais fácil reconhecer do que relembrar.",
                    "Porque reduz a carga mental da interface."
                ],
                answer: "Porque é mais fácil reconhecer do que relembrar."
            },
            {
                id: 9,
                instruction: "Tomada de Decisão.",
                scenario: "Um painel de configurações exibe 40 opções de filtros irrelevantes na tela principal, dificultando a escolha do usuário.",
                text: "Qual lei se aplica à necessidade de reduzir o número de cliques e opções irrelevantes para facilitar a decisão?",
                options: [
                    "Regra do Iceberg.",
                    "Lei de Moore.",
                    "Lei de Hick.",
                    "A regra do 7 ± 2 itens."
                ],
                answer: "Lei de Hick."
            },
            {
                id: 10,
                instruction: "Princípio de Consistência.",
                scenario: "Ao longo do aplicativo, o usuário nota que o botão 'Confirmar' é azul na tela inicial, mas verde e menor na tela de pagamentos.",
                text: "Qual fundamento básico da ergonomia cognitiva não está sendo seguido?",
                options: [
                    "Feedback Imediato.",
                    "Visibilidade do Sistema.",
                    "Metacognição.",
                    "Consistência (padrões repetidos)."
                ],
                answer: "Consistência (padrões repetidos)."
            },
            {
                id: 11,
                instruction: "Princípio de Visibilidade.",
                scenario: "O usuário navega por cinco páginas consecutivas em um e-commerce e se perde sem saber como voltar à categoria principal.",
                text: "Qual fundamento deve responder à pergunta mental do usuário: 'Onde estou e o que posso fazer?'",
                options: [
                    "Feedback visual.",
                    "Redução de Erros.",
                    "Visibilidade do status do sistema.",
                    "Consistência externa."
                ],
                answer: "Visibilidade do status do sistema."
            },
            {
                id: 12,
                instruction: "A Importância do Feedback.",
                scenario: "Um usuário clica em 'Enviar Cadastro' e nada muda na tela. Dez segundos depois, ele clica de novo achando que não funcionou.",
                text: "O que faltou projetar nesta interação?",
                options: [
                    "Visibilidade do status.",
                    "Feedback (resposta imediata do sistema).",
                    "Redução da carga mental de ícones.",
                    "Consistência nas cores dos botões."
                ],
                answer: "Feedback (resposta imediata do sistema)."
            },
            {
                id: 13,
                instruction: "Prevenção de Erros na Prática.",
                scenario: "Para evitar que o usuário digite uma data de nascimento inválida (como 31/02), o sistema mudou a entrada de texto livre para um widget de seleção.",
                text: "Esta abordagem é uma aplicação real para:",
                options: [
                    "Evitar a sobrecarga de memória.",
                    "Garantir a consistência visual.",
                    "Prevenir erros antes que eles aconteçam.",
                    "Aplicar a Lei de Hick."
                ],
                answer: "Prevenir erros antes que eles aconteçam."
            },
            {
                id: 14,
                instruction: "Redução de Carga Cognitiva.",
                scenario: "Ao acessar a barra de pesquisa do Google e começar a digitar, sugestões automáticas são exibidas imediatamente.",
                text: "O 'Autocompletar' é uma técnica focada especificamente em:",
                options: [
                    "Ergonomia física da digitação.",
                    "Redução de Carga Cognitiva.",
                    "Aumento das métricas de acessibilidade.",
                    "Criar uma interface minimalista."
                ],
                answer: "Redução de Carga Cognitiva."
            },
            {
                id: 15,
                instruction: "O Conceito de Don Norman.",
                scenario: "O designer insiste que o sistema está ótimo porque tem cores bonitas e tipografia moderna, ignorando a dificuldade de uso.",
                text: "Segundo o conceito de Don Norman, o Design Centrado no Usuário (UCD):",
                options: [
                    "Trata exclusivamente da beleza visual da interface gráfica.",
                    "Não é apenas estética; é projetar para as limitações do cérebro humano.",
                    "Foca na arquitetura invisível e ignora os botões da tela.",
                    "Deve focar no tempo de resposta do servidor back-end."
                ],
                answer: "Não é apenas estética; é projetar para as limitações do cérebro humano."
            },
            {
                id: 16,
                instruction: "Teoria do Iceberg em IHC.",
                scenario: "Um cliente vê apenas a ponta do iceberg (a interface visual) e subestima o esforço de criação do produto.",
                text: "O que compõe a parte invisível (abaixo da água) que sustenta a interação, segundo a Teoria do Iceberg?",
                options: [
                    "Cores, tipografia e espaçamento.",
                    "A tela do celular e o mouse.",
                    "Arquitetura, UX, Pesquisa e Emoção.",
                    "A ergonomia física do posto de trabalho."
                ],
                answer: "Arquitetura, UX, Pesquisa e Emoção."
            },
            {
                id: 17,
                instruction: "Ciclo do UCD (Design Centrado no Usuário).",
                scenario: "A equipe vai lançar um novo aplicativo e decide aplicar o conceito de UCD desde o início.",
                text: "Qual é uma característica fundamental desse processo abordado no material?",
                options: [
                    "A iteração: O design nunca está pronto na 1ª versão; evolui com o feedback.",
                    "É um processo em cascata onde a pesquisa só ocorre no final.",
                    "A exclusão de usuários idosos para focar em métricas de performance.",
                    "A dispensa total de testes se as cores forem escolhidas corretamente."
                ],
                answer: "A iteração: O design nunca está pronto na 1ª versão; evolui com o feedback."
            },
            {
                id: 18,
                instruction: "UCD e Empatia.",
                scenario: "Ao desenhar uma tela de leitura para o público da terceira idade, a fonte foi aumentada e o contraste ajustado.",
                text: "Qual fundamento do UCD orienta entender limitações reais como a visão reduzida?",
                options: [
                    "Prototipagem de alta fidelidade.",
                    "Metacognição.",
                    "Empatia.",
                    "Avaliação Heurística."
                ],
                answer: "Empatia."
            },
            {
                id: 19,
                instruction: "Métricas de Usabilidade: Eficiência.",
                scenario: "O usuário levou 5 minutos para entender o sistema no 1º acesso. No 2º acesso, ele realiza a mesma tarefa em 30 segundos.",
                text: "Essa velocidade produtiva após o aprendizado é medida por qual métrica de Jakob Nielsen?",
                options: [
                    "Facilidade de Aprendizado.",
                    "Memorabilidade.",
                    "Eficiência.",
                    "Taxa de Erros."
                ],
                answer: "Eficiência."
            },
            {
                id: 20,
                instruction: "Métricas de Usabilidade: Memorabilidade.",
                scenario: "Um professor usa um sistema acadêmico apenas uma vez por semestre para lançar notas e não precisa de treinamento a cada vez.",
                text: "Se ele consegue lembrar como funciona após meses sem usar, o sistema tem excelente índice de:",
                options: [
                    "Memorabilidade.",
                    "Acessibilidade de hardware.",
                    "Ergonomia física.",
                    "Satisfação (Agradabilidade)."
                ],
                answer: "Memorabilidade."
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
                addLog("Sucesso: Diagnóstico heurístico preciso.", "log-success");
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
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada dos conceitos de Ergonomia Cognitiva.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Avaliação Heurística IHC</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Usabilidade</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo processos de inspeção, carga cognitiva, modelos mentais e heurísticas de Nielsen.</p>
                    
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