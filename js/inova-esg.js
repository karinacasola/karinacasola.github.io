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

        // --- Banco de Questões (15 Questões - Inovação Aberta/Fechada e ESG) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Invenção vs. Inovação",
                scenario: "O laboratório de TI criou um novo algoritmo super avançado, mas ele não resolve nenhuma dor de mercado e não foi comercializado.",
                text: "Segundo os conceitos fundamentais, qual a diferença entre invenção e inovação?",
                options: [
                    "Invenção é criar algo novo; Inovação exige colocar a novidade em uso para resolver um problema e gerar valor.",
                    "Invenção só ocorre em empresas fechadas; Inovação só existe no modelo open source.",
                    "Inovação é a patente técnica depositada; Invenção é o marketing do produto.",
                    "Não há diferença, ambos os termos significam gerar lucro imediato."
                ],
                answer: "Invenção é criar algo novo; Inovação exige colocar a novidade em uso para resolver um problema e gerar valor."
            },
            {
                id: 2,
                instruction: "Modelo de Inovação Fechada",
                scenario: "A diretoria de uma empresa decidiu que o novo produto será desenvolvido em absoluto sigilo, utilizando apenas o time interno de P&D.",
                text: "Qual é a principal lógica por trás do funil de inovação fechada?",
                options: [
                    "Controlar ideias, talentos e propriedade intelectual com pesquisa interna em sigilo.",
                    "Compartilhar o código-fonte com a comunidade desde o primeiro dia.",
                    "Atrair startups parceiras para dividir os custos do desenvolvimento.",
                    "Terceirizar a pesquisa para baratear o custo da mão de obra."
                ],
                answer: "Controlar ideias, talentos e propriedade intelectual com pesquisa interna em sigilo."
            },
            {
                id: 3,
                instruction: "Ecossistema Fechado: Case Apple",
                scenario: "A Apple é famosa por manter um rigoroso controle sobre a fabricação do iPhone, o sistema iOS e a App Store.",
                text: "Qual é a principal vantagem desse ecossistema fechado de inovação?",
                options: [
                    "A integração favorece o controle rigoroso de qualidade e gera uma experiência coesa.",
                    "Permite que qualquer pessoa modifique o sistema operacional livremente.",
                    "Reduz o custo interno de desenvolvimento ao mínimo possível.",
                    "Garante que o mercado defina sozinho os próximos recursos do aparelho."
                ],
                answer: "A integração favorece o controle rigoroso de qualidade e gera uma experiência coesa."
            },
            {
                id: 4,
                instruction: "Inovação Aberta",
                scenario: "A corporação abriu um 'Hackathon' convidando startups, clientes e universidades para resolverem um desafio tecnológico juntos.",
                text: "Esse cenário ilustra o termo Inovação Aberta, popularizado por Henry Chesbrough (2003). O que ele significa na prática?",
                options: [
                    "Ideias entram e saem da empresa, onde conhecimentos externos colaboram na criação de soluções.",
                    "A empresa desiste de suas patentes e doa todo o seu orçamento para as universidades.",
                    "O fechamento dos laboratórios internos para focar exclusivamente na compra de concorrentes.",
                    "Um modelo onde o sigilo é mantido, mas o financiamento vem do governo."
                ],
                answer: "Ideias entram e saem da empresa, onde conhecimentos externos colaboram na criação de soluções."
            },
            {
                id: 5,
                instruction: "Escala com Open Source",
                scenario: "Diferente de sistemas operacionais construídos por uma única empresa, sistemas como Linux e Android operam de forma distinta.",
                text: "O que o Linux e o Android demonstram sobre a inovação aberta?",
                options: [
                    "A colaboração de uma comunidade global permite uma escala que uma empresa sozinha dificilmente alcançaria.",
                    "Sistemas abertos sempre geram mais falhas de segurança do que os fechados.",
                    "Sistemas abertos não podem ser utilizados por fabricantes com fins lucrativos.",
                    "Eles provam que a inovação aberta é apenas um slogan de marketing sem valor de negócio."
                ],
                answer: "A colaboração de uma comunidade global permite uma escala que uma empresa sozinha dificilmente alcançaria."
            },
            {
                id: 6,
                instruction: "Dinâmica do GitHub: Fork e Merge",
                scenario: "Um desenvolvedor quer contribuir com um projeto open source. Ele copia o repositório, faz alterações e envia a sugestão para os mantenedores.",
                text: "Quais são os nomes técnicos para o ato de 'fazer a cópia' e 'juntar as alterações aprovadas'?",
                options: [
                    "Fork (cópia) e Merge (integração).",
                    "Clone (cópia) e Push (integração).",
                    "Branch (cópia) e Issue (integração).",
                    "Commit (cópia) e Pull Request (integração)."
                ],
                answer: "Fork (cópia) e Merge (integração)."
            },
            {
                id: 7,
                instruction: "Licenças Open Source",
                scenario: "A equipe de software encontrou uma biblioteca open source incrível na internet, mas o jurídico exigiu a leitura do arquivo LICENSE antes do uso.",
                text: "Qual a diferença prática entre licenças Permissivas (ex: MIT) e Copyleft (ex: GPL)?",
                options: [
                    "Permissivas permitem uso livre com poucas condições; Copyleft exige que obras derivadas também mantenham o código aberto.",
                    "Permissivas são pagas; Copyleft são totalmente gratuitas.",
                    "Permissivas impedem uso comercial; Copyleft permitem lucro livre.",
                    "Não há diferença, toda licença open source obriga a liberação do software final."
                ],
                answer: "Permissivas permitem uso livre com poucas condições; Copyleft exige que obras derivadas também mantenham o código aberto."
            },
            {
                id: 8,
                instruction: "Responsabilidade Social Empresarial (RSE)",
                scenario: "A empresa decidiu reformular seu modelo de gestão para gerar benefícios tanto para os funcionários quanto para a comunidade ao redor da fábrica.",
                text: "A Responsabilidade Social é caracterizada fundamentalmente como:",
                options: [
                    "Uma postura voluntária, buscando o benefício da coletividade e o bem-estar dos públicos interno e externo.",
                    "Uma obrigação legal imposta exclusivamente pelo Estado para pagamento de impostos.",
                    "Uma ação puramente assistencialista sem relação com a estratégia da organização.",
                    "O foco exclusivo no lucro financeiro para os acionistas majoritários."
                ],
                answer: "Uma postura voluntária, buscando o benefício da coletividade e o bem-estar dos públicos interno e externo."
            },
            {
                id: 9,
                instruction: "A Visão Clássica vs Moderna",
                scenario: "Nos anos 70, a postura corporativa em relação às pautas sociais e ambientais era bem diferente da exigida pelo mercado hoje.",
                text: "Para o economista Milton Friedman, crítico inicial da responsabilidade social, qual era o único propósito de uma empresa?",
                options: [
                    "A maximização do lucro e a geração de empregos, sem substituir atribuições do Estado.",
                    "Salvar o meio ambiente acima da lucratividade.",
                    "Aumentar o bem-estar da comunidade local com doações financeiras.",
                    "Tornar todos os processos open source e de acesso público."
                ],
                answer: "A maximização do lucro e a geração de empregos, sem substituir atribuições do Estado."
            },
            {
                id: 10,
                instruction: "Dimensões da Responsabilidade Social",
                scenario: "O RH lançou um programa de saúde mental para os funcionários e exigiu padrões éticos rígidos dos distribuidores de matéria-prima.",
                text: "Essas ações se enquadram em qual dimensão da Responsabilidade Social Empresarial (RSE)?",
                options: [
                    "Dimensão Interna (focada em trabalhadores e na cadeia produtiva direta).",
                    "Dimensão Externa (focada em comunidades locais não relacionadas economicamente).",
                    "Filantropia Corporativa Indireta.",
                    "Greenwashing Institucional."
                ],
                answer: "Dimensão Interna (focada em trabalhadores e na cadeia produtiva direta)."
            },
            {
                id: 11,
                instruction: "Normas e Certificações Sociais",
                scenario: "Uma confecção de roupas quer comprovar ao mercado internacional que não utiliza trabalho infantil e respeita os direitos trabalhistas.",
                text: "Qual norma/certificação internacional é focada primordialmente nestas relações trabalhistas e direitos humanos na cadeia produtiva?",
                options: [
                    "SA8000 (Social Accountability 8000).",
                    "ISO 9000 (Gestão de Qualidade).",
                    "ISO 14000 (Gestão Ambiental exclusiva).",
                    "Selo Empresa Amiga da Criança."
                ],
                answer: "SA8000 (Social Accountability 8000)."
            },
            {
                id: 12,
                instruction: "Pilar de Governança: Accountability",
                scenario: "Um banco de dados da empresa vazou. Imediatamente, a diretoria veio a público, assumiu o erro, detalhou o problema e mostrou as medidas corretivas.",
                text: "Esse comportamento ético de prestar contas e assumir consequências exemplifica o princípio da:",
                options: [
                    "Accountability.",
                    "Inovação Aberta.",
                    "Ecologia Industrial.",
                    "Minimização de Lucros."
                ],
                answer: "Accountability."
            },
            {
                id: 13,
                instruction: "Benefícios Econômicos do Meio Ambiente",
                scenario: "O conselho acha que investir em meio ambiente é apenas 'gastar dinheiro'. O Gestor de Sustentabilidade precisa provar o contrário.",
                text: "Como as práticas de proteção ambiental podem gerar benefícios econômicos reais (não apenas de imagem) para a empresa?",
                options: [
                    "Através da economia de custos (redução de água/energia), reciclagem de resíduos e redução de multas.",
                    "Apenas através do aumento imediato do preço do produto final.",
                    "Reduzindo os salários da equipe para compensar o gasto com tecnologia verde.",
                    "Ganhando isenção total de impostos estaduais em todos os produtos."
                ],
                answer: "Através da economia de custos (redução de água/energia), reciclagem de resíduos e redução de multas."
            },
            {
                id: 14,
                instruction: "Entendendo a sigla ESG",
                scenario: "O fundo de investimentos exigiu que a empresa apresentasse seu relatório de integração dos pilares ESG antes de liberar o financiamento.",
                text: "O que significa a sigla ESG e o que ela avalia?",
                options: [
                    "Environmental, Social e Governance; avalia sustentabilidade, reputação e redução de riscos corporativos.",
                    "Economic, Sales e Growth; avalia apenas o crescimento financeiro bruto anual.",
                    "Enterprise, Software e Git; avalia a infraestrutura de inovação tecnológica fechada.",
                    "Environment, Safety e Guidelines; um manual operacional exclusivo para o chão de fábrica."
                ],
                answer: "Environmental, Social e Governance; avalia sustentabilidade, reputação e redução de riscos corporativos."
            },
            {
                id: 15,
                instruction: "Performance Social Corporativa (PSC)",
                scenario: "Não basta cumprir as leis locais. A corporação agora mede proativamente suas emissões de carbono e sua diversidade nas lideranças.",
                text: "Qual é a definição da Performance Social Corporativa (PSC) nesse contexto?",
                options: [
                    "É o desempenho proativo da empresa em criar impacto social positivo além do mero cumprimento de obrigações legais.",
                    "É uma métrica contábil que calcula o custo de demissões em massa.",
                    "É o índice de curtidas que as campanhas ambientais recebem nas redes sociais.",
                    "É a velocidade com que a empresa lança (Time to Market) produtos ecológicos."
                ],
                answer: "É o desempenho proativo da empresa em criar impacto social positivo além do mero cumprimento de obrigações legais."
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

        // Aplica o embaralhamento para todas as opções ao iniciar
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
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Resposta Correta! Raciocínio de inovação e ESG validado com sucesso.";
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
            
            let performanceMsg = "Excelente domínio sobre Modelos de Inovação e Responsabilidade Socioambiental (ESG).";
            if (score.value < 10) performanceMsg = "Recomenda-se revisão aprofundada dos frameworks (Inovação Aberta/Fechada e Pilares ESG) apresentados no material base.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #3e8eff; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #3e8eff; margin: 0;">Relatório de Desempenho - Inovação e ESG</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação Estratégica Baseada em Casos Reais</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Simulação:</strong> ${data}</p>
                    <p>Este documento comprova a submissão a ${questions.value.length} cenários práticos exigindo diagnóstico ativo em modelos de Inovação Aberta e Fechada, Governança Open Source e Estruturas de Responsabilidade Socioambiental Corporativa.</p>
                    
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
                filename:     `Certificacao_Inovacao_ESG_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Inicializando Simulador de Gestão da Inovação e ESG v3.0...", "log-info");
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