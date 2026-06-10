const app = Vue.createApp({
    data() {
        return {
            currentQuestionIndex: 0,
            score: 0,
            attempts: 0,
            gameOver: false,
            userSelection: null,
            showAnswer: false,
            feedbackMsg: '',
            feedbackType: '',
            isTyping: false,
            logs: [],
            // Mapeamento das 40 Questões baseadas nos PDFs enviados
            questions: [
                // PDF: UX
                {
                    instruction: "Fundamentos: O Guarda-Chuva de UX",
                    text: "No contexto do ecossistema de UX Design, qual disciplina é considerada a 'fundação' por envolver o entendimento de comportamentos, necessidades e motivações através de testes e observação?",
                    options: [
                        "Arquitetura da Informação (AI)",
                        "Pesquisa com Usuários (User Research)",
                        "Estratégia de Conteúdo",
                        "Design Visual (UI)"
                    ],
                    answer: "Pesquisa com Usuários (User Research)",
                    rationale: "A Pesquisa com Usuários é a fundação de UX, mapeando as dores e motivações reais."
                },
                {
                    instruction: "Fundamentos: O Guarda-Chuva de UX",
                    text: "A disciplina focada em organizar, estruturar e rotular o conteúdo de forma eficaz para ajudar o usuário a encontrar informações facilmente é a:",
                    options: [
                        "Usabilidade",
                        "Design de Interação (IxD)",
                        "Arquitetura da Informação (AI)",
                        "Pesquisa com Usuários"
                    ],
                    answer: "Arquitetura da Informação (AI)",
                    rationale: "AI cuida da taxonomia e estruturação sustentável da informação no sistema."
                },
                {
                    instruction: "Fundamentos: O Guarda-Chuva de UX",
                    text: "Qual destas disciplinas define como o sistema reage às ações do usuário, focando em microinterações e transições lógicas?",
                    options: [
                        "Arquitetura da Informação",
                        "Estratégia de Conteúdo",
                        "Design Visual (UI)",
                        "Design de Interação (IxD)"
                    ],
                    answer: "Design de Interação (IxD)",
                    rationale: "IxD é responsável pelo fluxo da ação e resposta do sistema às entradas do usuário."
                },
                {
                    instruction: "Pilares do Produto: Visão 360º",
                    text: "A 'Visão 360º' em UX equilibra três pilares. O pilar que foca em descobrir 'o que as pessoas realmente querem ou precisam' é a:",
                    options: [
                        "Feasibility (Viabilidade Técnica)",
                        "Viability (Viabilidade de Negócio)",
                        "Desirability (Desejabilidade/Necessidades do Usuário)",
                        "Usability (Usabilidade Prática)"
                    ],
                    answer: "Desirability (Desejabilidade/Necessidades do Usuário)",
                    rationale: "Desirability atende ao desejo e necessidade do humano utilizando o produto."
                },
                {
                    instruction: "Pilares do Produto: Visão 360º",
                    text: "Como o produto gera valor para a empresa (lucro, engajamento, retenção) reflete qual pilar da Visão 360º?",
                    options: [
                        "Desirability",
                        "Viability (Objetivos de Negócio)",
                        "Feasibility",
                        "Acessibility"
                    ],
                    answer: "Viability (Objetivos de Negócio)",
                    rationale: "Viability garante que a solução faz sentido financeiro/estratégico para a empresa."
                },
                {
                    instruction: "Ferramentas de Pesquisa: Personas",
                    text: "Antes de investir em pesquisas profundas, as equipes costumam iniciar com uma versão preliminar baseada em suposições que deverá ser validada depois. Isso é chamado de:",
                    options: [
                        "Card Sorting",
                        "Teste A/B",
                        "Proto-Persona",
                        "Design System"
                    ],
                    answer: "Proto-Persona",
                    rationale: "Proto-personas são o primeiro esboço do usuário baseado nas hipóteses do time."
                },
                {
                    instruction: "Ferramentas de Pesquisa: Mapa de Empatia",
                    text: "No Mapa da Empatia, em qual quadrante colocamos as influências externas, como amigos, chefes e mercado que afetam o usuário?",
                    options: [
                        "O que Pensa e Sente?",
                        "O que Ouve?",
                        "O que Vê?",
                        "O que Fala e Faz?"
                    ],
                    answer: "O que Ouve?",
                    rationale: "O quadrante 'O que Ouve' mapeia as influências auditivas e interpessoais diretas."
                },
                {
                    instruction: "Técnicas de Entrevista",
                    text: "Para pesquisas quantitativas ou com roteiro fixo e perguntas fechadas, utilizamos entrevistas do tipo:",
                    options: [
                        "Não Estruturada",
                        "Semiestruturada",
                        "Estruturada",
                        "Heurística"
                    ],
                    answer: "Estruturada",
                    rationale: "A entrevista estruturada segue um script rígido, ideal para comparar dados objetivos."
                },
                {
                    instruction: "Técnicas de Entrevista",
                    text: "Uma entrevista focada na descoberta e narrativa, semelhante a uma conversa livre sem guia rigoroso, é classificada como:",
                    options: [
                        "Semiestruturada",
                        "Não Estruturada",
                        "Estruturada",
                        "Guerrilha"
                    ],
                    answer: "Não Estruturada",
                    rationale: "Permite explorar problemas desconhecidos através de narrativas abertas."
                },
                {
                    instruction: "Organização e Decisão",
                    text: "Qual é a técnica utilizada para categorizar informações com base no modelo mental dos usuários, fundamental para a Arquitetura da Informação?",
                    options: [
                        "Card Sorting",
                        "Wireframing",
                        "Think-Aloud",
                        "Mapas de Calor"
                    ],
                    answer: "Card Sorting",
                    rationale: "Usuários agrupam 'cartões' revelando como eles naturalmente categorizam o conteúdo."
                },
                {
                    instruction: "Organização e Decisão: Prototipagem",
                    text: "Wireframes focados na estrutura e funcionalidade, sem distrações visuais e focados na iteração rápida (errar cedo e barato) são considerados de:",
                    options: [
                        "Alta Fidelidade (Hi-Fi)",
                        "Média Fidelidade (Mid-Fi)",
                        "Baixa Fidelidade (Lo-Fi)",
                        "Fidelidade de Produção"
                    ],
                    answer: "Baixa Fidelidade (Lo-Fi)",
                    rationale: "Lo-Fi (rascunhos, wireframes básicos) permite focar no fluxo, não na estética."
                },
                {
                    instruction: "Estética e UI: Fisiologia das Cores",
                    text: "Do ponto de vista fisiológico e emocional em UX, cores quentes como vermelho e laranja tendem a:",
                    options: [
                        "Transmitir calma e segurança a longo prazo.",
                        "Acelerar batimentos e transmitir senso de urgência.",
                        "Reduzir a carga cognitiva em leituras longas.",
                        "Indicar elementos de estado neutro do sistema."
                    ],
                    answer: "Acelerar batimentos e transmitir senso de urgência.",
                    rationale: "Fisiologicamente, cores quentes são estimulantes e evocam ações imediatas."
                },
                {
                    instruction: "Estética e UI: Fisiologia das Cores",
                    text: "Na criação da interface de um aplicativo bancário, bancos geralmente preferem a cor azul. Por qual motivo fisiológico/emocional?",
                    options: [
                        "Porque transmite calma, confiança e segurança.",
                        "Porque é a única cor visível para daltônicos.",
                        "Porque transmite urgência para realizar depósitos.",
                        "Para indicar estado de erro preventivo."
                    ],
                    answer: "Porque transmite calma, confiança e segurança.",
                    rationale: "Cores frias ancoram sentimentos de estabilidade, essenciais em finanças."
                },
                {
                    instruction: "Estética e UI: Acessibilidade",
                    text: "Ao planejar a acessibilidade visual de um botão com texto, a recomendação de contraste (WCAG AA) entre o texto e o fundo deve ser de no mínimo:",
                    options: [
                        "1.5:1",
                        "2:1",
                        "3:1",
                        "4.5:1"
                    ],
                    answer: "4.5:1",
                    rationale: "Para textos normais, a taxa de proporção exigida pelo WCAG é 4.5:1."
                },
                {
                    instruction: "Estética e UI: Acessibilidade",
                    text: "Para garantir o design inclusivo (considerando o daltonismo), a regra de ouro sobre mensagens de erro em formulários é:",
                    options: [
                        "Usar apenas a cor vermelha para o texto.",
                        "Depender exclusivamente do contraste WCAG 2:1.",
                        "Nunca usar apenas a cor para transmitir a mensagem (usar ícones e padrões).",
                        "Esconder o formulário até o usuário corrigir."
                    ],
                    answer: "Nunca usar apenas a cor para transmitir a mensagem (usar ícones e padrões).",
                    rationale: "Bordas vermelhas devem estar acompanhadas de ícones e textos explicativos."
                },
                {
                    instruction: "Tipografia e Grids",
                    text: "A técnica que define um 'esqueleto invisível' para a interface, mantendo alinhamento, consistência e facilitando layouts responsivos é chamada de:",
                    options: [
                        "Card Sorting",
                        "Heurística de Consistência",
                        "Grids (Grelhas)",
                        "Regra 60-30-10"
                    ],
                    answer: "Grids (Grelhas)",
                    rationale: "Grids organizam estruturalmente os componentes independentemente do tamanho da tela."
                },
                {
                    instruction: "Psicologia e Leis de UX",
                    text: "Qual lei afirma que 'O tempo necessário para tomar uma decisão aumenta com o número e a complexidade das escolhas'?",
                    options: [
                        "Lei de Jakob",
                        "Lei de Hick",
                        "Lei de Fitts",
                        "Efeito de Von Restorff"
                    ],
                    answer: "Lei de Hick",
                    rationale: "Hick alerta sobre a paralisia da decisão; reduza opções para agilizar a ação."
                },
                {
                    instruction: "Psicologia e Leis de UX",
                    text: "Qual lei determina que 'O tempo para atingir um alvo é função da distância até ele e de seu tamanho' (justificando botões grandes em áreas fáceis do mobile)?",
                    options: [
                        "Lei de Hick",
                        "Lei de Fitts",
                        "Lei de Jakob",
                        "Lei de Miller"
                    ],
                    answer: "Lei de Fitts",
                    rationale: "Fitts relaciona tempo, distância e área do alvo. Essencial para touchscreens."
                },
                {
                    instruction: "Psicologia e Leis de UX",
                    text: "O princípio que dita que 'Os usuários preferem que seu site funcione da mesma forma que os sites que eles já conhecem' é a:",
                    options: [
                        "Lei de Hick",
                        "Lei de Fitts",
                        "Lei de Jakob",
                        "Efeito de Von Restorff"
                    ],
                    answer: "Lei de Jakob",
                    rationale: "Não reinvente a roda. Padrões conhecidos diminuem a curva de aprendizado."
                },
                {
                    instruction: "Psicologia e Leis de UX",
                    text: "A prática de utilizar um contraste forte no botão de 'Comprar' para destacá-lo dos demais botões baseia-se no:",
                    options: [
                        "Efeito de Von Restorff",
                        "Carga Cognitiva de Sweller",
                        "Lei de Jakob",
                        "Percurso Cognitivo"
                    ],
                    answer: "Efeito de Von Restorff",
                    rationale: "Elementos que diferem visualmente do restante têm maior probabilidade de serem lembrados."
                },
                
                // PDF: Usabilidade e Acessibilidade
                {
                    instruction: "Usabilidade vs Acessibilidade",
                    text: "Enquanto a Usabilidade tem foco na 'Experiência' (eficácia e satisfação no uso do produto), a Acessibilidade tem foco primário em:",
                    options: [
                        "Estética",
                        "Barreiras (Pode entrar/acessar?)",
                        "Conversão de Vendas",
                        "Arquétipos de Marca"
                    ],
                    answer: "Barreiras (Pode entrar/acessar?)",
                    rationale: "Acessibilidade é sobre remover o obstáculo de entrada; Usabilidade é sobre a jornada lá dentro."
                },
                {
                    instruction: "Design Inclusivo",
                    text: "A diferença entre Design Universal e Design Inclusivo é que o Design Inclusivo:",
                    options: [
                        "Busca criar uma única versão do produto aplicável a todos sem adaptações.",
                        "É um processo contínuo que considera a diversidade humana e foca em excluir a exclusão.",
                        "Foca apenas em idosos e não em adaptações tecnológicas.",
                        "Ignora neurodivergências para focar em deficiências motoras."
                    ],
                    answer: "É um processo contínuo que considera a diversidade humana e foca em excluir a exclusão.",
                    rationale: "Design Inclusivo abraça a multiplicidade e oferece formas variadas de participação."
                },
                {
                    instruction: "Avaliação Inclusiva",
                    text: "Para usuários utilizando Leitores de Tela (como NVDA ou VoiceOver), qual atributo do código HTML é absolutamente crítico em imagens?",
                    options: [
                        "A tag <div>",
                        "O uso do CSS grid",
                        "A ausência de JavaScript",
                        "Textos alternativos (tag alt)"
                    ],
                    answer: "Textos alternativos (tag alt)",
                    rationale: "A tag 'alt' traduz o visual para semântica audível para cegos e baixa visão."
                },
                {
                    instruction: "Métricas Práticas",
                    text: "Ao avaliar interfaces para público PcD, usamos o 'Time on Task'. Disparidades extremas de tempo entre usuários com e sem deficiência indicam:",
                    options: [
                        "Que o teste foi um sucesso.",
                        "Barreiras severas de design e falta de acessibilidade.",
                        "Que a Lei de Hick não se aplica a PcD.",
                        "Que a paleta de cores é adequada."
                    ],
                    answer: "Barreiras severas de design e falta de acessibilidade.",
                    rationale: "Tempo excessivo revela atrito cognitivo ou barreiras sistêmicas no fluxo."
                },
                {
                    instruction: "Neurodiversidade: Autismo (TEA)",
                    text: "Pessoas no espectro autista podem apresentar hipersensibilidade sensorial. Por isso, uma boa prática de UI é:",
                    options: [
                        "Usar vídeos com autoplay e sons ambientes frequentes.",
                        "Usar textos cheios de jargões e linguagem figurada.",
                        "Evitar cores neon/ofuscantes e manter as interações lógicas e consistentes.",
                        "Esconder os rótulos dos menus para um design minimalista."
                    ],
                    answer: "Evitar cores neon/ofuscantes e manter as interações lógicas e consistentes.",
                    rationale: "Consistência, literalidade e baixo ruído visual mitigam gatilhos sensoriais."
                },
                {
                    instruction: "Neurodiversidade: Dislexia",
                    text: "Para melhorar a leiturabilidade de usuários com dislexia, qual prática NÃO é recomendada (ou seja, deve ser evitada)?",
                    options: [
                        "Fontes sem serifa (sans-serif).",
                        "Paredes de texto densas e fontes muito ornamentadas/serifadas.",
                        "Alinhamento de texto à esquerda.",
                        "Uso de listas (bullet points) para quebrar o conteúdo."
                    ],
                    answer: "Paredes de texto densas e fontes muito ornamentadas/serifadas.",
                    rationale: "Blocos de texto maciços e serifas causam fadiga na decodificação visual das palavras."
                },
                {
                    instruction: "Neurodiversidade: TDAH",
                    text: "Para usuários com TDAH, cujo foco pode ser facilmente quebrado, a interface deve evitar:",
                    options: [
                        "Dividir processos longos em passos mais curtos.",
                        "Múltiplos estímulos visuais simultâneos e pop-ups irrelevantes.",
                        "Contraste adequado de texto.",
                        "Feedback visual claro ao clicar em um botão."
                    ],
                    answer: "Múltiplos estímulos visuais simultâneos e pop-ups irrelevantes.",
                    rationale: "Poluição e multitarefas causam paralisia de decisão; o design deve guiar o foco."
                },
                {
                    instruction: "Metas WCAG",
                    text: "A meta de que 'a informação deve ser apresentada de formas que todos notem' (como o uso de legendas em vídeos) pertence a qual pilar da WCAG?",
                    options: [
                        "Robusto",
                        "Operável",
                        "Compreensível",
                        "Perceptível"
                    ],
                    answer: "Perceptível",
                    rationale: "O conteúdo não pode estar invisível a todos os sentidos da pessoa."
                },
                {
                    instruction: "Metas WCAG",
                    text: "Garantir que a interface seja 100% navegável apenas via teclado atende ao princípio WCAG de ser:",
                    options: [
                        "Operável",
                        "Perceptível",
                        "Visceral",
                        "Robusto"
                    ],
                    answer: "Operável",
                    rationale: "A interface não pode exigir interações (como mouse de precisão) que o usuário não consiga fazer."
                },

                // PDF: Revisão IHC e Branding
                {
                    instruction: "Branding e Semiótica",
                    text: "Na 'Cebola Semiótica', qual camada representa o núcleo da identidade (o propósito profundo) que ditará as escolhas visuais do Frontend?",
                    options: [
                        "Símbolos & UI",
                        "Rituais & UX",
                        "Essência",
                        "Arquétipos"
                    ],
                    answer: "Essência",
                    rationale: "A essência é o núcleo valórico; todo o resto (UI, UX) é casca ou manifestação dessa essência."
                },
                {
                    instruction: "Arquétipos de Marca",
                    text: "Qual arquétipo utiliza UI minimalista, tipografia sans-serif limpa e tons de azul escuro/cinza, com foco em dados e lógica?",
                    options: [
                        "O Rebelde",
                        "O Governante",
                        "O Cuidador",
                        "O Sábio"
                    ],
                    answer: "O Sábio",
                    rationale: "O Sábio valoriza a verdade e a análise, traduzindo-se em interfaces claras e sóbrias."
                },
                {
                    instruction: "Arquétipos de Marca",
                    text: "Um design disruptivo, utilizando Dark Mode, altos contrastes e tipografia agressiva, normalmente reflete o arquétipo:",
                    options: [
                        "O Rebelde",
                        "O Cuidador",
                        "O Sábio",
                        "O Governante"
                    ],
                    answer: "O Rebelde",
                    rationale: "O Rebelde quebra regras, o que na UI se manifesta na desconstrução dos grids clássicos."
                },
                {
                    instruction: "IHC vs UX",
                    text: "Utilizando a analogia da porta apresentada na Revisão, a IHC garante que a maçaneta seja ergonômica. E a UX?",
                    options: [
                        "Garante o código backend da maçaneta.",
                        "Garante a jornada completa, emoções e como você se sente ao entrar na sala.",
                        "Garante que apenas daltônicos abram a porta.",
                        "Foca exclusivamente no material da porta."
                    ],
                    answer: "Garante a jornada completa, emoções e como você se sente ao entrar na sala.",
                    rationale: "IHC é a mecânica da interação; UX é o saldo emocional de toda a vivência."
                },
                {
                    instruction: "Design System vs Style Guide",
                    text: "Enquanto o Style Guide foca apenas na estética (cores, fontes), um Design System também abriga:",
                    options: [
                        "Apenas o código do banco de dados.",
                        "Propósitos, valores, princípios e componentes codificados (Design Tokens).",
                        "O planejamento financeiro do setor de marketing.",
                        "O modelo de negócio (Canvas)."
                    ],
                    answer: "Propósitos, valores, princípios e componentes codificados (Design Tokens).",
                    rationale: "Design System é um produto vivo, englobando código reutilizável e princípios de conduta."
                },
                {
                    instruction: "Teoria das Cores na Interface",
                    text: "Na Regra 60-30-10 para distribuição de cores, os 10% (Cor de Destaque) devem ser aplicados primariamente em:",
                    options: [
                        "Fundos das páginas.",
                        "Textos corridos (parágrafos).",
                        "Ações principais e botões de Call to Action (CTAs).",
                        "Rodapés institucionais."
                    ],
                    answer: "Ações principais e botões de Call to Action (CTAs).",
                    rationale: "O contraste de 10% guia o olho diretamente para a ação primária."
                },
                {
                    instruction: "Design Emocional",
                    text: "Segundo Don Norman, qual nível de Design Emocional lida com a reação estética imediata ('uau, que bonito') antes mesmo de usar o produto?",
                    options: [
                        "Comportamental",
                        "Reflexivo",
                        "Visceral",
                        "Heurístico"
                    ],
                    answer: "Visceral",
                    rationale: "O nível visceral é pré-consciente, instintivo e estético."
                },
                {
                    instruction: "Heurísticas de Nielsen",
                    text: "Qual heurística determina que o sistema deve sempre manter o usuário informado sobre o que está acontecendo no momento (ex: barras de carregamento)?",
                    options: [
                        "Visibilidade do status do sistema.",
                        "Prevenção de erros.",
                        "Estética minimalista.",
                        "Liberdade e controle."
                    ],
                    answer: "Visibilidade do status do sistema.",
                    rationale: "Ausência de feedback gera ansiedade e múltiplos cliques desnecessários."
                },
                {
                    instruction: "Heurísticas de Nielsen",
                    text: "O uso do ícone de um 'carrinho de supermercado' para e-commerces atende perfeitamente a qual Heurística de Nielsen?",
                    options: [
                        "Diagnóstico de erros claro.",
                        "Correspondência com o mundo real.",
                        "Reconhecimento em vez de recordação.",
                        "Consistência e padrões."
                    ],
                    answer: "Correspondência com o mundo real.",
                    rationale: "Skeumorfismo ou metáforas visuais conectam o digital aos hábitos do mundo físico."
                },
                {
                    instruction: "Métodos de Avaliação/Teste",
                    text: "Em qual método de teste pedimos ao usuário para realizar tarefas enquanto narra em voz alta tudo o que está pensando, revelando seu modelo mental?",
                    options: [
                        "Teste A/B",
                        "Percurso Cognitivo",
                        "First Click",
                        "Think-Aloud"
                    ],
                    answer: "Think-Aloud",
                    rationale: "Ouvir a racionalização (Think-Aloud) revela atritos que o mouse não mapeia sozinho."
                },
                {
                    instruction: "Métricas de Avaliação",
                    text: "O SUS (System Usability Scale) é um questionário padronizado. Um score aceitável/bom nesta escala geralmente está acima de:",
                    options: [
                        "30",
                        "50",
                        "68",
                        "90"
                    ],
                    answer: "68",
                    rationale: "Historicamente, o benchmark médio para a régua SUS é 68. Abaixo disso, o sistema tem problemas de uso severos."
                }
            ]
        }
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        progressPercentage() {
            return ((this.currentQuestionIndex) / this.questions.length) * 100;
        }
    },
    methods: {
        typeLog(text, type = 'info', delay = 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.isTyping = true;
                    this.logs.push({ text: '', type });
                    const currentIndex = this.logs.length - 1;
                    let i = 0;
                    
                    const typeInterval = setInterval(() => {
                        this.logs[currentIndex].text += text.charAt(i);
                        i++;
                        
                        this.$refs.terminalBody.scrollTop = this.$refs.terminalBody.scrollHeight;
                        
                        if (i >= text.length) {
                            clearInterval(typeInterval);
                            this.isTyping = false;
                            resolve();
                        }
                    }, 20); // Velocidade da digitação
                }, delay);
            });
        },
        async startQuestion() {
            this.logs = [];
            this.attempts = 0;
            this.userSelection = null;
            this.showAnswer = false;
            this.feedbackMsg = '';
            this.feedbackType = '';
            
            await this.typeLog(`[INIT] Módulo ${this.currentQuestionIndex + 1}: ${this.currentQuestion.instruction}`, 'log-header');
            await this.typeLog('Avaliando o cenário... Aguardando input do analista UX.', 'info', 300);
        },
        async selectOption(option) {
            if (this.isTyping || this.showAnswer) return;
            
            this.userSelection = option;
            const isCorrect = option === this.currentQuestion.answer;
            
            if (isCorrect) {
                // Acertou
                this.showAnswer = true;
                if(this.attempts === 0) this.score++; // Ganha ponto apenas se acertar de primeira
                
                this.feedbackType = 'success';
                this.feedbackMsg = `<strong>Aprovação!</strong> ${this.currentQuestion.rationale}`;
                
                await this.typeLog(`[INPUT] Validando hipótese: ${option}`, 'info');
                await this.typeLog(`[SUCCESS] Hipótese validada. ${this.currentQuestion.rationale}`, 'success', 400);
                
                setTimeout(() => {
                    this.nextQuestion();
                }, 4000);
            } else {
                // Errou
                this.attempts++;
                this.feedbackType = 'error';
                
                await this.typeLog(`[INPUT] Validando hipótese: ${option}`, 'info');
                await this.typeLog(`[ERROR] Falha na heurística. Tentativa ${this.attempts} de 3.`, 'error', 300);
                
                if (this.attempts >= 3) {
                    this.showAnswer = true;
                    this.feedbackMsg = `<strong>Diagnóstico Falho.</strong> A resposta correta era: ${this.currentQuestion.answer}.<br><em>Motivo:</em> ${this.currentQuestion.rationale}`;
                    await this.typeLog(`[CRITICAL] Limite de tentativas excedido. Avançando cenário...`, 'error', 500);
                    
                    setTimeout(() => {
                        this.nextQuestion();
                    }, 5000);
                } else {
                    this.feedbackMsg = 'Hipótese incorreta. Analise a interface conceitual e tente novamente.';
                }
            }
        },
        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.startQuestion();
            } else {
                this.gameOver = true;
            }
        },
        resetGame() {
            this.currentQuestionIndex = 0;
            this.score = 0;
            this.gameOver = false;
            this.startQuestion();
        },
        saveResultPDF() {
            const element = document.createElement('div');
            element.innerHTML = `
                <div style="padding: 40px; font-family: sans-serif; color: #333;">
                    <h1 style="color: #3E8EFF; border-bottom: 2px solid #eee; padding-bottom: 10px;">Relatório de Análise Heurística IHC/UX</h1>
                    <p><strong>Candidato/Analista:</strong> Módulo de Avaliação Online</p>
                    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                    <p><strong>Diagnósticos Precisos:</strong> ${this.score} de ${this.questions.length}</p>
                    <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-left: 4px solid #3E8EFF;">
                        <p>Este documento certifica a conclusão da bateria de testes teóricos do ecossistema de Design Inclusivo, Leis de UX e Avaliação de Interfaces.</p>
                    </div>
                </div>
            `;
            const opt = {
                margin: 1,
                filename: 'relatorio_diagnostico_ihc.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        }
    },
    mounted() {
        this.startQuestion();
    }
});

app.mount('#app');