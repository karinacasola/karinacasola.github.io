const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        const currentView = ref('menu'); 
        const selectedGroup = ref(null);
        const currentTab = ref('practical'); 
        
        const practicalScore = ref(0);
        const conceptualScore = ref(0);
        
        const indices = ref({ practical: 0, conceptual: 0 });
        const currentQuestionIndex = computed(() => indices.value[currentTab.value]);
        
        const userSelection = ref(null);
        const showAnswer = ref(false);
        const feedback = ref(null);
        const attempts = ref(0);

        const newNodeText = ref(""); 
        const nodes = ref([]);
        const edges = ref([]);
        const edgeStartNode = ref(null);
        
        // BANCO DE QUESTÕES: Empreendedorismo e Mentalidade Digital
        // Estrutura Anti DRY: Cada grupo herda a mesma dinâmica de abas e mapa mental
        const questionsDb = {
            1: { // Temática 1 & PPTX: Visão, Proatividade, Framework Sair do Problema
                practical: [
                    { context: "Framework Passo 1", text: "Você observa que estudantes perdem muito tempo organizando materiais de estudo. Como um empreendedor proativo agiria primariamente?", options: ["Validar se essa dor é real e intensa para os outros antes de codificar algo", "Começar imediatamente a programar um app gigante", "Reclamar da instituição", "Esperar que alguém resolva"], answer: "Validar se essa dor é real e intensa para os outros antes de codificar algo", explanation: "Visão proativa não é agir por impulso, é identificar a oportunidade e antecipar-se, validando o problema antes de gastar recursos (Sair do problema -> Criar Soluções -> Gerar Valor)." },
                    { context: "O Próximo Nível (Mercado)", text: "De acordo com o framework, qual elemento do 'Mercado' você deve testar nas primeiras 24h?", options: ["Se a dor é real e se existe público disposto a pagar", "A tecnologia mais moderna para o app", "O design do logotipo", "O plano de marketing de 5 anos"], answer: "Se a dor é real e se existe público disposto a pagar", explanation: "O Passo 1 do Próximo Nível e a Geração de Valor exigem testar as premissas de mercado mais críticas de forma rápida e barata." }
                ],
                conceptual: [
                    { context: "Mentalidade", text: "O que caracteriza a competência de 'Visão e Proatividade' no empreendedorismo?", options: ["Capacidade de enxergar oportunidades onde outros veem problemas e tomar iniciativa", "Saber programar em várias linguagens", "Fazer marketing no Instagram", "Esperar o momento perfeito para agir"], answer: "Capacidade de enxergar oportunidades onde outros veem problemas e tomar iniciativa", explanation: "A proatividade transforma queixas (problemas) em soluções por meio da iniciativa antecipada." },
                    { context: "Framework PPTX", text: "Qual a sequência correta do framework apresentado para ir além das queixas?", options: ["Sair do problema -> Criar soluções -> Gerar Valor", "Ter uma ideia -> Buscar investidor -> Lançar", "Estudar o mercado -> Fazer CNPJ -> Vender", "Focar na solução -> Reclamar -> Tentar de novo"], answer: "Sair do problema -> Criar soluções -> Gerar Valor", explanation: "O segredo para inovar é não ficar paralisado na reclamação, isolar o problema e focar na criação e entrega de valor no mundo real." }
                ]
            },
            2: { // Temática 2 & PPTX: Validação e Resiliência
                practical: [
                    { context: "Teste da Realidade (Geração de Valor)", text: "Sua equipe quer criar um software SaaS completo. Aplicando o teste rápido e barato, o que vocês fazem amanhã?", options: ["Criam uma Landing Page simples (ou formulário) para medir interesse", "Contratam 5 programadores", "Alugam um servidor na AWS por 1 ano", "Passam 3 meses escrevendo o código"], answer: "Criam uma Landing Page simples (ou formulário) para medir interesse", explanation: "Como diz o slide: 'Ideia sem validação... é só opinião'. O teste mais rápido e barato deve provar a premissa central de valor do seu negócio (cliques/cadastros/vendas prévias)." },
                    { context: "Teste Rápido e Barato (24h)", text: "O que você precisa provar nas próximas 24h para sua ideia sair do papel?", options: ["Que o público-alvo existe e se importa com o problema que você resolve", "Que sua ideia é 100% original", "Que você tem todo o capital necessário", "Que o design está perfeito"], answer: "Que o público-alvo existe e se importa com o problema que você resolve", explanation: "O primeiro passo da Engenharia da Validação é provar que a dor do cliente é real e que ele percebe valor na sua solução potencial." }
                ],
                conceptual: [
                    { context: "Definição de Sucesso", text: "Segundo os conceitos discutidos, o que é mais importante para o sucesso de um negócio?", options: ["Resolver o problema certo (que as pessoas realmente têm)", "Ter a ideia mais original do mercado", "Ter um orçamento infinito de largada", "Ter um escritório luxuoso"], answer: "Resolver o problema certo (que as pessoas realmente têm)", explanation: "O teste da realidade dita que encontrar o problema que dói e precisa de cura vale mais que uma ideia apenas inovadora." },
                    { context: "Pilar da Validação", text: "Qual é a 'Regra de Ouro' apresentada sobre o valor de uma ideia?", options: ["Ideia sem validação... é só opinião", "Quanto mais cara a ideia, melhor", "Nunca mostre a ideia para estranhos", "Ter muitas ideias é melhor que executar uma"], answer: "Ideia sem validação... é só opinião", explanation: "No mundo real, elogios de amigos são opiniões. Validação exige atrito: tempo, dinheiro ou dados fornecidos pelo cliente." }
                ]
            },
            3: { // Temática 3 & PPTX: Resiliência, Adaptabilidade, Passo 2 (Criar Soluções)
                practical: [
                    { context: "Adaptabilidade em Ação", text: "Você lançou seu MVP e 80% dos usuários não entenderam como usá-lo. Como agir?", options: ["Aprender com o erro, simplificar e pivotar baseando-se nos feedbacks", "Desistir e fechar a empresa", "Culpar os usuários por serem leigos", "Gastar mais dinheiro em tráfego pago"], answer: "Aprender com o erro, simplificar e pivotar baseando-se nos feedbacks", explanation: "O segredo do Próximo Nível é a Resiliência (aguentar o impacto) e a Adaptabilidade (mudar o modelo rapidamente sem perder o propósito)." },
                    { context: "Engenharia da Validação (Feedback)", text: "Ao receber feedbacks negativos no seu teste de 24h, qual deve ser a postura do empreendedor?", options: ["Usar como dado de mercado para adaptar e evoluir a solução", "Ignorar os feedbacks para manter o foco na ideia original", "Brigar com os clientes", "Esconder a ideia por medo de falha crítica"], answer: "Usar como dado de mercado para adaptar e evoluir a solução", explanation: "A falha de uma premissa é apenas um dado. A adaptabilidade exige ouvir o mercado e corrigir a rota rapidamente (Force Applied)." }
                ],
                conceptual: [
                    { context: "Passo 2 Framework", text: "No framework 'Sair do problema -> Criar soluções -> Gerar Valor', o que compõe o passo 2?", options: ["Mapear os diferenciais, a tecnologia e a forma de entrega (Solução)", "Mudar de nicho constantemente", "Fazer um pitch perfeito", "Cobrar caro"], answer: "Mapear os diferenciais, a tecnologia e a forma de entrega (Solução)", explanation: "Isolar a dor permite focar na criação estratégica da solução, definindo como você resolve o problema de forma única (diferencial)." },
                    { context: "Mentalidade de Falha", text: "No empreendedorismo digital, como o 'erro' ou a 'falha inicial' é visto?", options: ["Como uma etapa natural e valiosa de aprendizado (Fail Fast, Learn Faster)", "Como o fim da carreira", "Como prova de incompetência", "Como motivo para demissões"], answer: "Como uma etapa natural e valiosa de aprendizado (Fail Fast, Learn Faster)", explanation: "Falhar rápido e barato permite coletar dados e evitar falhas catastróficas (caras) no futuro." }
                ]
            },
            4: { // Temática 4 & PPTX: Foco no Cliente e Geração de Valor
                practical: [
                    { context: "Onde Focar (Perguntas PPTX)", text: "Sua ideia resolve um problema e funciona, mas ninguém consegue entender o que ela faz. Qual engrenagem quebrou?", options: ["É bem comunicada (Faz sentido para alguém)", "Resolve um problema real", "Funciona na prática", "Dá lucro fácil"], answer: "É bem comunicada (Faz sentido para alguém)", explanation: "No Motor da Viabilidade, se a ideia não é bem comunicada ou não resolve a dor, a mecânica inteira do negócio trava." },
                    { context: "Geração de Valor Real", text: "Um cliente reclama que seu software tem funcionalidades demais e ele se perde. Com o 'Foco no Cliente', qual é a sua atitude?", options: ["Remover as funcionalidades que não geram valor e focar no que resolve o problema (Dor)", "Forçá-lo a fazer um curso para usar", "Cobrar mais caro", "Ignorar o cliente"], answer: "Remover as funcionalidades que não geram valor e focar no que resolve o problema (Dor)", explanation: "Geração de valor está em resolver o problema real com menor atrito, não em acumular funções desnecessárias." }
                ],
                conceptual: [
                    { context: "Perguntas Fundamentais PPTX", text: "Quais perguntas fundamentais o slide 'Entenda sua Dor' propõe?", options: ["Quem usaria isso? Já existe algo parecido? O que faz alguém escolher VOCÊ?", "Onde abrir o escritório?", "Qual banco empresta dinheiro?", "Qual a cor da marca?"], answer: "Quem usaria isso? Já existe algo parecido? O que faz alguém escolher VOCÊ?", explanation: "Essas três perguntas definem o público-alvo (Quem), a análise competitiva (Existe?) e a proposta única de valor (Diferencial)." },
                    { context: "Geração de Valor vs Lucro", text: "O que a competência 'Foco no Cliente e Geração de Valor' afirma sobre o lucro?", options: ["O lucro é consequência inevitável de oferecer alto valor resolvendo problemas reais", "O lucro deve vir explorando o cliente", "O lucro é irrelevante", "O lucro é sorte"], answer: "O lucro é consequência inevitável de oferecer alto valor resolvendo problemas reais", explanation: "Negócios sustentáveis não perseguem o dinheiro diretamente; eles perseguem a solução do problema, e o dinheiro flui como recompensa." }
                ]
            },
            5: { // Temática 5: Paixão, Propósito e Aprendizado Contínuo
                practical: [
                    { context: "Lifelong Learning Prático", text: "Você lançou sua startup há 2 anos. Agora, a IA começou a alterar seu mercado. Como o 'Lifelong Learner' age?", options: ["Mergulha ativamente no estudo de IA para integrar a nova competência ao seu modelo", "Finge que a IA é uma moda passageira", "Processa empresas de IA", "Desiste e aposenta"], answer: "Mergulha ativamente no estudo de IA para integrar a nova competência ao seu modelo", explanation: "O aprendizado contínuo significa reconhecer que suas habilidades atuais têm prazo de validade e precisam de atualização constante." },
                    { context: "Propósito em Ação", text: "Nos meses em que o faturamento cai e o estresse sobe, o que impede o empreendedor de abandonar o projeto?", options: ["A conexão do negócio com um propósito maior (acreditar na missão de resolver aquela dor)", "Apenas a vontade de ficar rico", "O contrato de aluguel do escritório", "O orgulho de falhar"], answer: "A conexão do negócio com um propósito maior (acreditar na missão de resolver aquela dor)", explanation: "A paixão fornece o 'combustível' emocional para a resiliência. Quando os números caem, a crença na missão mantém o motor girando." }
                ],
                conceptual: [
                    { context: "Definição de Propósito", text: "Como o 'Propósito' é definido no contexto empreendedor?", options: ["A razão de ser do negócio (missão) que conecta o trabalho a um impacto positivo real", "Fazer caridade apenas", "Ter um slogan bonito", "Focar no lucro de curto prazo"], answer: "A razão de ser do negócio (missão) que conecta o trabalho a um impacto positivo real", explanation: "Propósito responde à pergunta 'Por que esta empresa existe além de fazer dinheiro?'." },
                    { context: "Lifelong Learning", text: "O que o termo 'Lifelong Learning' exige do profissional moderno?", options: ["A disposição constante para aprender novas competências, desaprender as obsoletas e evoluir profissionalmente", "Que ele tenha muitos diplomas antigos", "Que estude apenas na graduação", "Que ele foque apenas em soft skills"], answer: "A disposição constante para aprender novas competências, desaprender as obsoletas e evoluir profissionalmente", explanation: "É a mentalidade de eterno estudante, essencial para não ser atropelado pela inovação." }
                ]
            },
            6: { // Temática 6 & 7 & PPTX: Gestão Financeira, Coragem, Liderança e Pitch
                practical: [
                    { context: "O Palco e o Pitch (PPTX)", text: "Você tem 3 minutos para apresentar sua ideia a um investidor. Usando a regra 'Seu pitch em 3 tempos', qual a estrutura?", options: ["Problema -> Solução -> Diferencial", "Tecnologia usada -> Lucro -> História pessoal", "Equipe -> CNPJ -> Investimento", "Diferencial -> Funcionalidade -> Códigos"], answer: "Problema -> Solução -> Diferencial", explanation: "A Pirâmide do Palco estrutura a narrativa: Você ancora na dor (Problema), mostra como resolve (Solução) e porque só você faz isso bem (Diferencial)." },
                    { context: "Riscos Calculados (Gestão)", text: "Você precisa investir para escalar o servidor. Como um gestor com 'Coragem e Planejamento' age?", options: ["Assume riscos calculados, projetando o fluxo de caixa, entendendo o cenário e agindo com controle financeiro", "Pega um empréstimo gigantesco sem calcular o ROI", "Tem medo e não investe, perdendo clientes", "Gasta o dinheiro de marketing no servidor"], answer: "Assume riscos calculados, projetando o fluxo de caixa, entendendo o cenário e agindo com controle financeiro", explanation: "Coragem no empreendedorismo não é loucura. É tomar decisões audaciosas ancoradas em análise de dados (risco calculado)." }
                ],
                conceptual: [
                    { context: "Assertividade e Networking", text: "Dentro das competências do fundador, o que é o 'Networking' verdadeiro?", options: ["A habilidade de construir relacionamentos autênticos e de ganha-ganha, gerando oportunidades para a empresa", "Entregar cartão de visitas em eventos e não falar com ninguém", "Colecionar conexões no LinkedIn sem propósito", "Falar apenas com pessoas mais ricas que você"], answer: "A habilidade de construir relacionamentos autênticos e de ganha-ganha, gerando oportunidades para a empresa", explanation: "Networking é sobre construir pontes de confiança e valor mútuo, não apenas trocas superficiais." },
                    { context: "Liderança e Visão", text: "Qual o papel principal da Liderança e Comunicação assertiva em uma startup?", options: ["Engajar pessoas e equipes em prol da visão e propósito do negócio, superando desafios", "Cobrar resultados 24h por dia", "Tomar todas as decisões sozinho", "Gastar o dinheiro dos investidores"], answer: "Engajar pessoas e equipes em prol da visão e propósito do negócio, superando desafios", explanation: "Liderança engaja pessoas em prol da visão. A comunicação clara e a empatia restauram a energia do time." }
                ]
            }
        };

        const getGroupName = (id) => {
            const names = [
                "Visão, Proatividade e o Problema Certo", 
                "Validação e o Teste da Realidade", 
                "Resiliência, Falhas e Adaptabilidade", 
                "Foco no Cliente e Geração de Valor", 
                "Paixão, Propósito e Lifelong Learning", 
                "Estratégia, Liderança e O Palco"
            ];
            return names[id - 1] || `Módulo ${id}`;
        };

        const currentQuestionList = (tabParam) => {
            if (!selectedGroup.value || !questionsDb[selectedGroup.value]) return [];
            return questionsDb[selectedGroup.value][tabParam || currentTab.value] || [];
        };

        const currentQuestion = computed(() => {
            const list = currentQuestionList();
            if(!list || list.length === 0) return null;
            return list[currentQuestionIndex.value];
        });

        const selectGroup = (groupId) => {
            if(!questionsDb[groupId]) questionsDb[groupId] = questionsDb[1]; 
            selectedGroup.value = groupId;
            currentView.value = 'quiz';
            changeTab('practical');
            practicalScore.value = 0;
            conceptualScore.value = 0;
            indices.value = { practical: 0, conceptual: 0 };
        };

        const changeTab = (tab) => {
            if (currentTab.value !== tab) {
                currentTab.value = tab;
                resetTurn(); 
            }
        };

        const resetTurn = () => {
            userSelection.value = null;
            showAnswer.value = false;
            feedback.value = null;
            attempts.value = 0;
        };

        const answerQuestion = (option) => {
            if (showAnswer.value) return; 
            userSelection.value = option;
            
            if (option === currentQuestion.value.answer) {
                if (currentTab.value === 'practical') practicalScore.value++;
                else conceptualScore.value++;
                
                feedback.value = { type: 'correct', text: 'Parabéns, visão validada com sucesso!' };
                showAnswer.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= 3) {
                    feedback.value = { type: 'error', text: `Tentativas esgotadas. A resposta correta é: ${currentQuestion.value.answer}` };
                    showAnswer.value = true; 
                } else {
                    feedback.value = { type: 'error', text: `Diagnóstico Incorreto. Analise o mercado e a teoria novamente.` };
                }
            }
        };

        const nextQuestion = () => {
            if (currentQuestionIndex.value < currentQuestionList().length - 1) {
                indices.value[currentTab.value]++;
                resetTurn();
            } else {
                indices.value[currentTab.value]++; 
            }
        };

        const addCustomNode = () => {
            if (!newNodeText.value.trim()) return;
            nodes.value.push({
                id: Date.now(),
                text: newNodeText.value.trim(),
                x: 100 + Math.random() * 50, 
                y: 100 + Math.random() * 50
            });
            newNodeText.value = ""; 
        };

        const deleteNode = (id) => {
            nodes.value = nodes.value.filter(n => n.id !== id);
            edges.value = edges.value.filter(e => e.from !== id && e.to !== id);
            if (edgeStartNode.value === id) edgeStartNode.value = null;
        };

        const selectNodeForEdge = (nodeId) => {
            if (edgeStartNode.value === null) {
                edgeStartNode.value = nodeId; 
            } else {
                if (edgeStartNode.value !== nodeId) {
                    const exists = edges.value.find(e => 
                        (e.from === edgeStartNode.value && e.to === nodeId) ||
                        (e.to === edgeStartNode.value && e.from === nodeId)
                    );
                    if(!exists) edges.value.push({ from: edgeStartNode.value, to: nodeId });
                }
                edgeStartNode.value = null; 
            }
        };

        const getNode = (id) => nodes.value.find(n => n.id === id) || {x:0, y:0};

        let draggingNode = null;
        let startX, startY;

        const startDragNode = (event, node) => {
            if(edgeStartNode.value !== null) return; 
            if(event.target.closest('.delete-node')) return;

            draggingNode = node;
            startX = event.clientX - node.x;
            startY = event.clientY - node.y;

            document.addEventListener('mousemove', dragNode);
            document.addEventListener('mouseup', stopDragNode);
        };

        const dragNode = (event) => {
            if (!draggingNode) return;
            draggingNode.x = event.clientX - startX;
            draggingNode.y = event.clientY - startY;
        };

        const stopDragNode = () => {
            draggingNode = null;
            document.removeEventListener('mousemove', dragNode);
            document.removeEventListener('mouseup', stopDragNode);
        };

        const exportPDF = () => {
            const element = document.getElementById('pdf-export-area');
            const header = element.querySelector('.pdf-only-header');
            
            let maxX = 800; 
            let maxY = 600; 
            nodes.value.forEach(n => {
                if (n.x + 200 > maxX) maxX = n.x + 200;
                if (n.y + 100 > maxY) maxY = n.y + 100;
            });

            const originalHeight = element.style.height;
            const originalOverflow = element.style.overflow;
            
            element.style.height = `${maxY + 50}px`;
            element.style.width = `${maxX + 50}px`;
            element.style.overflow = 'visible'; 
            element.style.background = '#ffffff';

            if(header) {
                header.style.display = 'block';
                header.style.marginBottom = '30px';
                header.style.color = 'black'; 
            }
            
            const allNodes = element.querySelectorAll('.mindmap-node');
            const allDeleteBtns = element.querySelectorAll('.delete-node');
            const svgElement = document.getElementById('mindmap-svg');

            if(svgElement) {
                svgElement.style.width = `${maxX + 50}px`;
                svgElement.style.height = `${maxY + 50}px`;
            }
            
            allNodes.forEach(n => {
                n.style.background = '#f0f0f0';
                n.style.color = '#000';
            });
            allDeleteBtns.forEach(btn => btn.style.display = 'none');

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_Startup_G${selectedGroup.value}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true,
                    scrollY: 0,
                    width: maxX + 50, 
                    height: maxY + 50 
                },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                if(header) header.style.display = 'none';
                element.style.background = '';
                element.style.height = originalHeight;
                element.style.width = '100%'; 
                element.style.overflow = originalOverflow;
                
                if(svgElement) {
                    svgElement.style.width = '100%';
                    svgElement.style.height = '100%';
                }

                allNodes.forEach(n => {
                    n.style.background = '';
                    n.style.color = '';
                });
                allDeleteBtns.forEach(btn => btn.style.display = 'flex');
            });
        };

        return {
            currentView, selectedGroup, currentTab, getGroupName,
            practicalScore, conceptualScore, currentQuestionIndex,
            currentQuestion, userSelection, showAnswer, feedback, attempts,
            selectGroup, changeTab, answerQuestion, nextQuestion, currentQuestionList,
            newNodeText, nodes, edges, edgeStartNode,
            addCustomNode, deleteNode, startDragNode, selectNodeForEdge, getNode,
            exportPDF
        };
    }
}).mount('#app');