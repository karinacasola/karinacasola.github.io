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

        // --- Banco de Questões (As 20 de IHC Originais) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Analise a diferença entre UX e Usabilidade.",
                scenario: "O Gerente de Produto pergunta: 'Por que nosso sistema tem boa usabilidade, mas uma UX ruim?' Você precisa explicar a diferença conceitual baseada na Teoria.",
                text: "Qual a definição correta segundo o material?",
                options: [
                    "Usabilidade foca na métrica objetiva (completar tarefa); UX foca no sentimento e percepção holística.",
                    "Usabilidade é subjetiva; UX é métrica objetiva focada na velocidade do sistema.",
                    "Não há diferença, ambos avaliam o número de cliques para uma ação.",
                    "Usabilidade avalia a credibilidade da marca, UX avalia a eficácia dos botões."
                ],
                answer: "Usabilidade foca na métrica objetiva (completar tarefa); UX foca no sentimento e percepção holística."
            },
            {
                id: 2,
                instruction: "Identifique a Heurística de Nielsen violada.",
                scenario: "Um usuário preenche um longo formulário de cadastro. Ao clicar em 'Enviar', a página recarrega em branco apagando tudo, exibindo apenas: 'Erro 4X-90'.",
                text: "Além da falta de prevenção de erros, qual heurística falhou miseravelmente na mensagem apresentada?",
                options: [
                    "Estética e design minimalista",
                    "Visibilidade do status do sistema",
                    "Correspondência entre o sistema e o mundo real",
                    "Reconhecimento em vez de recordação"
                ],
                answer: "Correspondência entre o sistema e o mundo real"
            },
            {
                id: 3,
                instruction: "Conceito de Carga Cognitiva.",
                scenario: "A nova interface de um software de contabilidade exige que o usuário decore códigos numéricos de 6 dígitos para acessar cada menu, não possuindo busca.",
                text: "Qual princípio de usabilidade e cognição está sendo diretamente ferido?",
                options: [
                    "Oferecer feedback imediato",
                    "Minimizar a carga cognitiva",
                    "Utilizar modelos mentais",
                    "Estética minimalista"
                ],
                answer: "Minimizar a carga cognitiva"
            },
            {
                id: 4,
                instruction: "Heurísticas de Scapin e Bastien.",
                scenario: "O avaliador anotou: 'O sistema não diz de onde o usuário veio nem para onde ele pode ir a partir desta tela'.",
                text: "Qual heurística de Scapin e Bastien foi violada?",
                options: [
                    "Carga de trabalho",
                    "Controle explícito",
                    "Orientação",
                    "Gestão de erros"
                ],
                answer: "Orientação"
            },
            {
                id: 5,
                instruction: "Processo de Avaliação Heurística.",
                scenario: "Sua equipe vai realizar uma avaliação heurística em um site de e-commerce seguindo as boas práticas do material.",
                text: "Quantos avaliadores especialistas são recomendados para esta tarefa?",
                options: [
                    "1 avaliador experiente",
                    "3 a 5 avaliadores",
                    "Mais de 15 usuários finais",
                    "Apenas o desenvolvedor líder"
                ],
                answer: "3 a 5 avaliadores"
            },
            {
                id: 6,
                instruction: "Reconhecimento vs Recordação.",
                scenario: "Em vez de fazer o usuário digitar de cabeça o código de um produto, o sistema oferece uma lista com fotos e nomes dos produtos visitados recentemente.",
                text: "Qual o benefício desta abordagem segundo Nielsen?",
                options: [
                    "Previne a ineficiência estética",
                    "Aumenta a carga de trabalho explícita",
                    "Permite o reconhecimento em vez de recordação",
                    "Garante consistência e padrões de hardware"
                ],
                answer: "Permite o reconhecimento em vez de recordação"
            },
            {
                id: 7,
                instruction: "Heurística de Nielsen: Visibilidade do status.",
                scenario: "O usuário faz o upload de um arquivo de 5GB. A tela não exibe barra de progresso, apenas um botão congelado.",
                text: "O que diz a heurística 'Visibilidade do status do sistema' sobre isso?",
                options: [
                    "O sistema deve ser flexível para uploaders avançados.",
                    "O usuário deve saber o que está acontecendo no sistema.",
                    "O sistema deve pedir confirmação antes de congelar.",
                    "A linguagem deve ser voltada para redes e servidores."
                ],
                answer: "O usuário deve saber o que está acontecendo no sistema."
            },
            {
                id: 8,
                instruction: "Heurísticas Clássicas.",
                scenario: "Você percebe que em uma tela o botão 'Confirmar' é verde e quadrado, mas na tela seguinte é azul e redondo.",
                text: "Qual heurística (Nielsen) foi claramente esquecida?",
                options: [
                    "Liberdade e controle do usuário",
                    "Estética e design minimalista",
                    "Prevenção de erros",
                    "Consistência e padrões"
                ],
                answer: "Consistência e padrões"
            },
            {
                id: 9,
                instruction: "Componentes da Experiência do Usuário.",
                scenario: "Para argumentar a favor de um redesenho completo, você lista os componentes de UX para a diretoria.",
                text: "Segundo o slide 4, quais são os componentes da UX?",
                options: [
                    "Usabilidade + emoção, valor, credibilidade, utilidade, acessibilidade",
                    "Eficiência, eficácia, aprendizado, memorização",
                    "Heurísticas, relatórios, testes de carga",
                    "Modelos mentais, orientação e controle explícito"
                ],
                answer: "Usabilidade + emoção, valor, credibilidade, utilidade, acessibilidade"
            },
            {
                id: 10,
                instruction: "Planejamento da Avaliação.",
                scenario: "Após a navegação individual, os avaliadores se reúnem para discutir descobertas e priorizar problemas.",
                text: "Como é chamada esta etapa do processo de avaliação?",
                options: [
                    "Brainstorming Criativo",
                    "Sessão de Consolidação (Debriefing)",
                    "Análise Individual",
                    "Entrevista com o Usuário"
                ],
                answer: "Sessão de Consolidação (Debriefing)"
            },
            {
                id: 11,
                instruction: "Gestão de Erros.",
                scenario: "O usuário digita a data de nascimento no formato errado. O sistema apaga e bloqueia a conta.",
                text: "Segundo Scapin e Bastien, a 'Gestão de Erros' deveria ajudar o usuário a...",
                options: [
                    "Ignorar o erro e processar silenciosamente.",
                    "Mudar a linguagem para códigos explícitos.",
                    "Prevenir, detectar e corrigir erros.",
                    "Adaptar a interface para usuários flexíveis."
                ],
                answer: "Prevenir, detectar e corrigir erros."
            },
            {
                id: 12,
                instruction: "Liberdade do Usuário.",
                scenario: "Você abre um pop-up promocional no site, mas não existe um botão de 'X' ou 'Fechar' visível.",
                text: "Qual heurística de Nielsen trata especificamente de saídas de emergência e desfazer ações?",
                options: [
                    "Liberdade e controle do usuário",
                    "Flexibilidade e eficiência de uso",
                    "Estética e design minimalista",
                    "Reconhecimento em vez de recordação"
                ],
                answer: "Liberdade e controle do usuário"
            },
            {
                id: 13,
                instruction: "Conceito Básico.",
                scenario: "Durante uma aula, um aluno pergunta: 'Afinal, o que é uma heurística de usabilidade?'",
                text: "Qual a melhor definição com base na aula?",
                options: [
                    "São testes obrigatórios feitos com usuários reais vendados.",
                    "São regras gerais ou dicas para identificar problemas de forma sistemática.",
                    "É o código-fonte que gera a responsividade do site.",
                    "São métricas de performance do banco de dados (tempo de resposta)."
                ],
                answer: "São regras gerais ou dicas para identificar problemas de forma sistemática."
            },
            {
                id: 14,
                instruction: "Heurística de Scapin e Bastien.",
                scenario: "O software emite um bipe e mostra a mensagem 'Operação salva com sucesso' no canto da tela.",
                text: "A qual heurística de Scapin e Bastien essa ação de informar o resultado atende?",
                options: [
                    "Feedback",
                    "Controle explícito",
                    "Orientação",
                    "Carga de trabalho"
                ],
                answer: "Feedback"
            },
            {
                id: 15,
                instruction: "Modelos Mentais.",
                scenario: "Sua equipe discute que ícone usar para representar a função de 'Imprimir'.",
                text: "Por que usar o ícone de uma impressora atende à utilização de Modelos Mentais?",
                options: [
                    "Porque exige alto processamento do usuário para decorar atalhos.",
                    "Porque o usuário já espera que funcione baseando-se no mundo real.",
                    "Porque previne erros de hardware.",
                    "Porque aumenta a eficácia matemática do sistema."
                ],
                answer: "Porque o usuário já espera que funcione baseando-se no mundo real."
            },
            {
                id: 16,
                instruction: "Documentação de IHC.",
                scenario: "Você está elaborando o relatório final da inspeção heurística e precisa montar a tabela de problemas.",
                text: "Quais colunas devem obrigatoriamente compor a tabela de documentação de erros (slide 13)?",
                options: [
                    "ID, Problema, Heurística Violada, Prioridade",
                    "Nome do Avaliador, Data, Código Fonte, Custo",
                    "Print da Tela, Sentimento do Usuário, Cores Utilizadas",
                    "ID, Sugestão de Código, Assinatura do Diretor"
                ],
                answer: "ID, Problema, Heurística Violada, Prioridade"
            },
            {
                id: 17,
                instruction: "Flexibilidade e Eficiência.",
                scenario: "Um sistema de edição de imagens permite clicar em botões no menu, mas também oferece atalhos como CTRL+C, CTRL+V.",
                text: "Esta prática atende a qual heurística de Nielsen?",
                options: [
                    "Flexibilidade e eficiência de uso",
                    "Estética e design minimalista",
                    "Prevenção de erros",
                    "Visibilidade do status"
                ],
                answer: "Flexibilidade e eficiência de uso"
            },
            {
                id: 18,
                instruction: "Estética Minimalista.",
                scenario: "Um site do governo apresenta 4 banners animados, 6 colunas de texto espremido e dezenas de links coloridos que distraem da tarefa principal.",
                text: "O que a heurística de 'Estética e design minimalista' recomenda nesses casos?",
                options: [
                    "Aumentar o número de cores para manter consistência.",
                    "Evitar informações irrelevantes ou desnecessárias na interface.",
                    "Colocar mensagens de erro maiores.",
                    "Exigir confirmação antes de ler o texto."
                ],
                answer: "Evitar informações irrelevantes ou desnecessárias na interface."
            },
            {
                id: 19,
                instruction: "Prevenção de Erros vs Gestão.",
                scenario: "O motor de busca do Google sugere 'Você quis dizer: X?' quando você digita uma palavra errada, em vez de mostrar 0 resultados.",
                text: "Essa funcionalidade brilhante é focada principalmente em:",
                options: [
                    "Controle explícito e visibilidade do servidor",
                    "Ajudar usuários a reconhecerem, diagnosticarem e recuperarem-se de erros",
                    "Design minimalista removendo botões",
                    "Orientação de rotas e mapas GPS"
                ],
                answer: "Ajudar usuários a reconhecerem, diagnosticarem e recuperarem-se de erros"
            },
            {
                id: 20,
                instruction: "O limite das Heurísticas.",
                scenario: "O Gerente diz: 'Fizemos a avaliação heurística. Agora não precisamos mais testar com usuários, certo?'",
                text: "Com base no material (slide 6), qual é a resposta correta para o gerente?",
                options: [
                    "Correto, heurísticas garantem 100% de usabilidade.",
                    "Incorreto. Avaliação Heurística não substitui testes com usuários.",
                    "Correto, desde que tenham sido usados mais de 5 avaliadores.",
                    "Incorreto, as heurísticas só servem para sistemas antigos."
                ],
                answer: "Incorreto. Avaliação Heurística não substitui testes com usuários."
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
            if (score.value < 14) performanceMsg = "Recomenda-se revisão aprofundada das Heurísticas de Nielsen e Bastien.";
            
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