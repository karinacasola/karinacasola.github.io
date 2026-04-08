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

        // --- Banco de 20 Questões: Estilos & Branding ---
        const questions = ref([
            { id: 1, instruction: "Design System vs Style Guide.", scenario: "A equipe precisa escalar os produtos e definir não só a interface, mas os valores da marca.", text: "O que um Design System inclui a mais que um Style Guide?", options: ["Apenas ícones extras e paleta de cores", "Identidade da marca, propósitos, valores e princípios de design", "O código fonte em JavaScript puro", "Regras exclusivas de gerenciamento de banco de dados"], answer: "Identidade da marca, propósitos, valores e princípios de design" },
            { id: 2, instruction: "Teoria das Cores.", scenario: "O cliente pediu para usarmos as cores que são consideradas a 'essência de tudo'.", text: "Como são classificadas as cores Amarelo, Azul e Vermelho?", options: ["Secundárias", "Terciárias", "Monocromáticas", "Primárias"], answer: "Primárias" },
            { id: 3, instruction: "Harmonia Complementar.", scenario: "Precisamos de máximo contraste visual no banner de conversão de vendas.", text: "O que caracteriza a harmonia complementar?", options: ["Uso de uma única cor em diferentes tons", "Duas cores localizadas em pontos opostos no círculo cromático", "Três cores escolhidas de forma equidistante no círculo", "Cores que estão lado a lado no círculo cromático"], answer: "Duas cores localizadas em pontos opostos no círculo cromático" },
            { id: 4, instruction: "Regra 60-30-10.", scenario: "O layout precisa de equilíbrio visual matemático entre as cores escolhidas.", text: "Na regra 60-30-10, para que é destinada a Cor Base (60%)?", options: ["Fundos e componentes neutros", "Botões de conversão e áreas de destaque", "Apenas para tipografia serifada longa", "Para a cor predominante da marca, como logotipos"], answer: "Fundos e componentes neutros" },
            { id: 5, instruction: "Tipografia: Typeface.", scenario: "O desenvolvedor iniciante perguntou qual 'Typeface' foi usada no projeto digital.", text: "Qual a definição correta de Tipo de Fonte (Typeface)?", options: ["A implementação específica com peso (ex: bold) e tamanho", "O design ou a 'família' visual de caracteres (ex: Arial)", "A cor hexadecimal aplicada diretamente à fonte", "O espaçamento vertical gerado entre as linhas do texto"], answer: "O design ou a 'família' visual de caracteres (ex: Arial)" },
            { id: 6, instruction: "Tipografia para Telas.", scenario: "O aplicativo terá um design moderno, limpo, veloz e focado no minimalismo.", text: "Qual estilo de fonte é o mais ideal para telas e interfaces digitais?", options: ["Fontes com Serifa (Serif)", "Fontes Sem Serifa (Sans-serif)", "Fontes cursivas rebuscadas", "Fontes góticas ou clássicas tradicionais"], answer: "Fontes Sem Serifa (Sans-serif)" },
            { id: 7, instruction: "Anatomia do Grid.", scenario: "Para evitar que os cards de produtos fiquem visualmente colados, aplicamos um espaçamento no grid.", text: "Como se chama o espaço existente entre as colunas em um Grid estrutural?", options: ["Margens", "Linhas base", "Gutter", "Frames"], answer: "Gutter" },
            { id: 8, instruction: "Estados de Interação.", scenario: "O usuário relata que clica no botão, mas não sabe se a ação foi realmente acionada no mouse.", text: "Qual estado do botão ocorre no exato momento em que ele é clicado e mantido?", options: ["Hover", "Focus", "Disabled", "Pressed (Pressionado)"], answer: "Pressed (Pressionado)" },
            { id: 9, instruction: "Componentes UI.", scenario: "O formulário precisa mostrar um exemplo (ex: nome@email.com) que desaparece imediatamente ao digitar.", text: "Como se chama essa dica efêmera dentro do campo de entrada de texto?", options: ["Label", "Placeholder", "Switch", "Navbar"], answer: "Placeholder" },
            { id: 10, instruction: "Papel dos Ícones.", scenario: "O menu lateral tem apenas textos curtos, e a diretoria quer deixá-lo mais rápido e intuitivo para o usuário.", text: "Segundo o guia de UI, qual o principal benefício cognitivo dos ícones?", options: ["Tornam a programação de backend muito mais rápida", "Aumentam positivamente a carga cognitiva do leitor", "Criam familiaridade e reduzem a curva de aprendizado", "Substituem por completo a necessidade de usar cores e textos"], answer: "Criam familiaridade e reduzem a curva de aprendizado" },
            { id: 11, instruction: "Arquétipos de Jung.", scenario: "A equipe de marketing e design quer humanizar a marca antes de iniciar o layout.", text: "O que os Arquétipos de Jung representam no processo profundo de Branding?", options: ["Padrões universais do inconsciente coletivo que geram identificação", "Scripts técnicos de linguagem de programação orientada", "As restritas diretrizes globais do consórcio WCAG 2.1", "Técnicas exclusivas para o desenho de peças em vetor"], answer: "Padrões universais do inconsciente coletivo que geram identificação" },
            { id: 12, instruction: "Cebola Semiótica: Núcleo.", scenario: "Vamos mapear a estrutura corporativa da nossa marca, olhando de dentro para fora.", text: "O que compõe o centro (núcleo) vital da Cebola Semiótica?", options: ["Símbolos e decisões finais de UI", "Rituais de consumo e fluxos de UX", "A Essência (o real porquê existimos e entregamos valor)", "Os doze Arquétipos universais catalogados"], answer: "A Essência (o real porquê existimos e entregamos valor)" },
            { id: 13, instruction: "Cebola Semiótica: Interface.", scenario: "A camada visual do site é o primeiro e mais direto ponto de contato entre a marca e o usuário final.", text: "Onde as decisões de Frontend e UI se encontram na estrutura da Cebola Semiótica?", options: ["Profundamente alocadas na Essência do modelo", "Junto aos Arquétipos universais e padrões mentais", "Nas camadas externas (Símbolos & UI)", "Exclusivamente nos Rituais lógicos & mapeamentos de UX"], answer: "Nas camadas externas (Símbolos & UI)" },
            { id: 14, instruction: "Arquétipo O Sábio.", scenario: "A nova plataforma universitária focará em divulgar dados científicos e pautas puramente educativas.", text: "Quais escolhas de Ul transmitem corretamente o arquétipo 'O Sábio'?", options: ["Laranja forte, roxo elétrico e layouts altamente assimétricos", "Design minimalista, tipografia limpa (sans-serif), paleta com azul escuro e branco", "Bordas da interface muito arredondadas e tons extremamente pastéis", "Alto contraste subversivo com temas noturnos e elementos cyberpunk"], answer: "Design minimalista, tipografia limpa (sans-serif), paleta com azul escuro e branco" },
            { id: 15, instruction: "Arquétipo O Criador.", scenario: "Uma nova ferramenta de design foca exclusivamente na liberdade criativa e expressão artística.", text: "Como o arquétipo 'O Criador' se tangibiliza adequadamente em uma interface digital?", options: ["Preto sólido, dourado luxuoso e simetria matemática rigorosa nas proporções", "Layouts assimétricos, microinterações fluidas criativas e paletas de cor inusitadas", "Predominância total de tons de cinza com foco extremo e engessado em dados", "Linguagem corporativa conservadora e fontes serifadas antiquadas"], answer: "Layouts assimétricos, microinterações fluidas criativas e paletas de cor inusitadas" },
            { id: 16, instruction: "Arquétipo O Cuidador.", scenario: "Um aplicativo de agendamentos em saúde mental quer transmitir segurança, proteção e profunda empatia.", text: "Qual é a melhor abordagem visual para personificar 'O Cuidador'?", options: ["Bordas muito arredondadas, tons visuais pastéis suaves e fluxos tolerantes a erros", "Cores quentes muito fortes e itálico agressivo focado em movimento de competição", "Design rigoroso com simetria extrema para demonstrar pura autoridade de mercado", "Cores lúgubres escuras e quebra de regras formais focada na disrupção adolescente"], answer: "Bordas muito arredondadas, tons visuais pastéis suaves e fluxos tolerantes a erros" },
            { id: 17, instruction: "Neuromarketing e Cores.", scenario: "O designer novato afirma que 'azul passa confiança e só', mas a neurociência prova que há mais profundidade.", text: "Segundo o material de Branding, qual a função biológica real da psicologia das cores na UI?", options: ["Apenas para adequar o layout ao gosto do investidor principal", "Guiar instintivamente a atenção (heurística de usabilidade) e provocar rápidas respostas neuroquímicas", "Diminuir drasticamente a velocidade de carregamento técnico do frontend via CSS", "Substituir integralmente toda a necessidade de carga textual em plataformas densas"], answer: "Guiar instintivamente a atenção (heurística de usabilidade) e provocar rápidas respostas neuroquímicas" },
            { id: 18, instruction: "Estudo de Caso: Amazon.", scenario: "Analisando a coerência da marca Amazon, nota-se o arquétipo clássico de O Cara Comum / Explorador.", text: "Como essa estratégia psicológica reflete-se tecnicamente no Frontend/UI da Amazon?", options: ["O design é luxuoso, premium e focado num sentimento exclusivista para poucos", "A interface é 100% focada em função, com a barra de busca onipresente em destaque", "A tela é coberta por intensas microinterações lúdicas pesadas e dezenas de cores elétricas", "O layout ignora os produtos para priorizar longas matérias textuais e denso material investigativo"], answer: "A interface é 100% focada em função, com a barra de busca onipresente em destaque" },
            { id: 19, instruction: "Hand-off Consciente.", scenario: "O layout finalizado será documentado e exportado pelo time de UX para o desenvolvedor de Frontend.", text: "Na metodologia moderna, o que significa de fato realizar um 'Hand-off Consciente'?", options: ["O ato de apenas arquivar o layout em formato PDF e enviá-lo via link público", "Entregar as telas secas no Figma sem tempo hábil para reuniões de introdução da lógica", "Entregar ativamente a lógica psicológica e de negócio atrelada às decisões visuais tomadas", "Abolir o time de design delegando aos analistas de banco de dados a construção da interface crua"], answer: "Entregar ativamente a lógica psicológica e de negócio atrelada às decisões visuais tomadas" },
            { id: 20, instruction: "Frontend e Branding.", scenario: "No fluxo analítico de coerência visual, o processo se encerra no desenvolvimento web.", text: "Qual o papel vital de quem coda o Frontend em relação ao ecossistema do Branding?", options: ["O Frontend consolida tecnologicamente a experiência da marca, que retroalimenta a percepção psíquica do usuário", "A engenharia Frontend é focada unicamente na performance de servidor (DevOps), ignorando diretrizes da marca", "A escrita do CSS é apenas o início do processo demorado de etnografia, não impactando o produto em si", "As regras do Frontend criam barreiras que impedem que o negócio converta os usuários orgânicos em clientes"], answer: "O Frontend consolida tecnologicamente a experiência da marca, que retroalimenta a percepção psíquica do usuário" }
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
            await typeWriter(`Carregando Diretriz de Branding - Item ${currentQuestion.value.id}...`, "log-info");
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
                addLog("Auditoria visual e estratégica concluída. Processando certificado PDF...", "log-info");
            }
        };

        const selectOption = (option) => {
            if (showAnswer.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;

            if (option === currentQuestion.value.answer) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Diretriz validada com sucesso.";
                addLog("Sucesso: Decisão visual validada no projeto.", "log-success");
                showAnswer.value = true;
                setTimeout(nextQuestion, 2500);
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Tentativas esgotadas. A resposta correta era: <strong>${currentQuestion.value.answer}</strong>`;
                    addLog("Falha Crítica: Decisão refutada na revisão de design.", "log-error");
                    showAnswer.value = true;
                    setTimeout(nextQuestion, 4500);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Decisão Incorreta. Reavalie a documentação. Tentativas restantes: ${maxAttempts - attempts.value}`;
                    addLog(`Aviso: Revisão de estilo necessária. Tentativa ${attempts.value}/${maxAttempts}`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Excelente domínio da psicologia visual e aplicação de Guias de Estilo no Frontend.";
            if (score.value < 14) performanceMsg = "Recomenda-se forte revisão teórica sobre Arquétipos e Elementos UI.";
            
            // Layout mantendo a identidade azul
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Certificado de Auditoria Web</h1>
                    <h2 style="color: #555; margin: 5px 0;">Avaliação: Guias de Estilo e Branding Digital</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Auditoria:</strong> ${data}</p>
                    <p>Este documento atesta a passagem do profissional pelas ${questions.value.length} análises críticas envolvendo conceitos de Cebola Semiótica, Design Systems, Interações Digitais, Teoria das Cores e Handoff de UI para Frontend.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                        <p style="font-size: 28px; color: ${score.value >= 14 ? '#10B981' : (score.value >= 10 ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Acertos</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo Módulo UX.ESCAPE // Branding
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Certificado_Branding_UI_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Reconfigurando parâmetros visuais...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador: Módulo Branding e Estilo...", "log-info");
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