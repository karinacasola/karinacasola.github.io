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
        
        // BANCO DE QUESTÕES: UX/UI e IHC - Nível Avançado/Analítico
        const questionsDb = {
            1: {
                practical: [
                    { context: "Alinhamento de Identidade", text: "Um banco digital voltado para jovens quer transmitir a ideia de 'quebrar as regras' e fugir das taxas tradicionais. O time de UI sugeriu um layout com tipografia clássica (serifada) e tons escuros. Segundo a Cebola Semiótica, qual o impacto prático dessa decisão?", options: ["O design terá sucesso por aplicar a Heurística da Estética Minimalista Clássica.", "Haverá dissonância cognitiva, pois os símbolos (UI) refletem o Governante ou Sábio, enquanto a essência exige o Rebelde.", "A interface criará um loop de dopamina positivo devido ao contraste de cores frias.", "O arquétipo do Criador foi perfeitamente aplicado pela escolha da simetria."], answer: "Haverá dissonância cognitiva, pois os símbolos (UI) refletem o Governante ou Sábio, enquanto a essência exige o Rebelde.", explanation: "A Cebola Semiótica exige que a UI (camada externa) reflita a essência (núcleo). Um posicionamento disruptivo (Rebelde) conflita profundamente com escolhas visuais focadas em tradição (Governante), gerando desconexão no usuário." },
                    { context: "Hand-off e Design Tokens", text: "Durante o repasse de um projeto com o arquétipo 'Cuidador', o designer entregou apenas as telas no Figma. O desenvolvedor implementou botões com cantos vivos e alto contraste, desconfigurando as bordas arredondadas originais. O que falhou no processo?", options: ["A falta de dark patterns para forçar o clique em botões retos.", "A violação estrutural da Lei de Hick pelo uso do CSS em cascata.", "O repasse ignorou a entrega da 'lógica psicológica' através de Design Tokens bem documentados.", "O designer deveria ter programado em Vue.js para evitar que o código fosse modificado."], answer: "O repasse ignorou a entrega da 'lógica psicológica' através de Design Tokens bem documentados.", explanation: "O hand-off consciente vai além de entregar telas; inclui a entrega da lógica emocional e regras. Botões agressivos destroem a linguagem acolhedora do 'Cuidador', algo que o mapeamento de Design Tokens evita." },
                    { context: "Neuromarketing e Microcopy", text: "Uma corretora financeira quer aumentar a confiança de novos usuários no momento do cadastro (Arquétipo: O Sábio). Como o microcopy no Frontend pode atuar junto à UI para reforçar esse posicionamento?", options: ["Usando mensagens de erro irônicas e animações frenéticas para engajar o usuário jovem.", "Escondendo a política de privacidade (Dark Pattern) para acelerar a conversão.", "Utilizando redação clara que justifique a solicitação de dados, alinhada à transparência e autoridade.", "Aumentando drasticamente as fontes com serifa para ocultar os inputs de formulário."], answer: "Utilizando redação clara que justifique a solicitação de dados, alinhada à transparência e autoridade.", explanation: "O arquétipo do Sábio transmite verdade e conhecimento. Uma Redação UI (microcopy) que explica o 'porquê' valida essa confiança e reduz o esforço mental." },
                    { context: "Coerência Tecnológica", text: "Analisando o case da Amazon, vemos que a interface não tenta ser 'artisticamente refinada', focando inteiramente na barra de buscas e na compra com '1-Clique'. O que isso demonstra sobre a relação UI/UX e Branding?", options: ["O Frontend jamais deve sofrer influência direta do plano de Branding e Marketing.", "A Amazon ignora heurísticas de usabilidade em prol da estética visual e banners piscantes.", "O arquétipo exige que o sistema gere picos de ansiedade visceral (Hook Model) no checkout.", "A essência da marca (redução de fricção) dita a estética funcional, priorizando a usabilidade brutal em vez do apelo artístico."], answer: "A essência da marca (redução de fricção) dita a estética funcional, priorizando a usabilidade brutal em vez do apelo artístico.", explanation: "O Branding dita a função. Com o arquétipo focado no acesso democrático, a UI reflete isso sacrificando ornamentos visuais para priorizar a eficiência extrema." }
                ],
                conceptual: [
                    { context: "Cebola Semiótica", text: "A Cebola Semiótica ilustra que o Frontend e a UI de um sistema digital representam qual estrutura fundamental da marca?", options: ["O Núcleo e a Essência, operando de forma invisível nos bancos de dados do projeto.", "A Camada de Símbolos, a pele externa que deve traduzir e retroalimentar as verdades do núcleo para o usuário.", "Os Rituais da marca, onde as jornadas de marketing determinam a escalabilidade de servidores.", "A estrutura restrita ao modelo mental logarítmico, sem relação com as emoções da empresa."], answer: "A Camada de Símbolos, a pele externa que deve traduzir e retroalimentar as verdades do núcleo para o usuário.", explanation: "O Frontend e o UI são os símbolos. São o primeiro contato sensorial. Se eles não irradiarem a mesma mensagem da essência (o núcleo da cebola), o produto se torna incoerente." },
                    { context: "Arquétipos de Jung", text: "Do ponto de vista prático da disciplina de UX, o que legitima a aplicação da Teoria dos Arquétipos de Jung no design de uma interface?", options: ["Eles são algoritmos precisos de recomendação que determinam a velocidade de carregamento da página web.", "São regras criadas pela WCAG para evitar o uso de componentes bloqueantes em telas escuras.", "Eles ativam padrões universais do inconsciente, permitindo que as decisões de UI gerem identificação imediata e previsível.", "São as métricas consolidadas pelo System Usability Scale (SUS) após a publicação oficial do site."], answer: "Eles ativam padrões universais do inconsciente, permitindo que as decisões de UI gerem identificação imediata e previsível.", explanation: "Arquétipos não são métricas, mas ferramentas psicanalíticas. Ao adotá-los, o design explora moldes pré-existentes na mente humana (ex: O Explorador, O Sábio) criando familiaridade." },
                    { context: "Neuromarketing Visual", text: "Como o Neuromarketing contesta a visão superficial de que a 'psicologia das cores serve apenas para deixar o site com a cara do logo'?", options: ["Afirmando que a cor possui um impacto irrelevante se o código HTML e o SEO forem otimizados.", "Provando que as cores guiam a atenção em nível heurístico e disparam instintos químicos contextuais antes do pensamento lógico.", "Afirmando que, estatisticamente, todas as marcas devem usar cores quentes e tons terrosos para evitar fadiga ocular na Europa.", "Substituindo o estudo das cores por testes focados exclusivamente na Lei de Hick."], answer: "Provando que as cores guiam a atenção em nível heurístico e disparam instintos químicos contextuais antes do pensamento lógico.", explanation: "A cor atua no nível Visceral e na gestão de carga cognitiva. Ela destaca elementos de conversão (Efeito Von Restorff) e provoca respostas emocionais inconscientes antes que o usuário leia o texto." },
                    { context: "Hand-off via Design Tokens", text: "Qual a função primária de utilizar 'Design Tokens' no fluxo de transição entre UX/UI e o desenvolvimento Frontend?", options: ["Criptografar as informações do banco de dados na transição das APIs RESTful da plataforma em produção.", "Automatizar questionários baseados na Heurística de Nielsen e Molich sem a intervenção de programadores ou gerentes de projeto.", "Substituir valores isolados (hex de cor, pixel de espaçamento) por variáveis nomeadas, mantendo a coerência escalável entre os conceitos de design e o código final.", "Garantir a retenção financeira no funil do checkout aplicando o Loop do Hábito (Hook Model)."], answer: "Substituir valores isolados (hex de cor, pixel de espaçamento) por variáveis nomeadas, mantendo a coerência escalável entre os conceitos de design e o código final.", explanation: "Tokens são a ponte universal. Se a marca definir 'primary-color' como vermelho, alterar essa essência no Design System reflete sistemicamente no código sem o risco de discrepâncias visuais." }
                ]
            },
            2: {
                practical: [
                    { context: "Níveis de Frustração", text: "Durante o teste num app financeiro, não há indicativo visual de que a transferência está ocorrendo. O usuário franze a testa, clica novamente e suspira. Qual nível do Design Emocional falhou gravemente e o que isso causou?", options: ["Nível Visceral, causando ofuscamento retiniano devido ao contraste do app.", "Nível Comportamental, pois a perda na sensação de controle sem feedback disparou a ansiedade cognitiva.", "Nível Reflexivo, reduzindo imediatamente o status social do usuário com seus pares e contatos.", "Nenhum. Suspirar é uma heurística natural que simboliza o fluxo do Loop do Hábito de recompensa."], answer: "Nível Comportamental, pois a perda na sensação de controle sem feedback disparou a ansiedade cognitiva.", explanation: "O Comportamento é regido pelo uso, eficácia e controle. Omissão de feedback em ações críticas (dinheiro) abala o controle do usuário, sobrecarregando a mente." },
                    { context: "Soluções via Mapa de Empatia", text: "O Nubank mapeou que clientes em bancos normais percebiam 'filas e portas travadas' (Vê) e sentiam 'impotência' (Sente). Qual a resposta de Arquitetura UX no nível Comportamental para combater essa dor exata?", options: ["Esconder o chat de ajuda para que o cliente aprenda a explorar ativamente a interface minimalista da instituição financeira moderna.", "Forçar a memorização das senhas implementando alta carga cognitiva com autenticação heurística robusta e fontes complexas.", "Remover fricções e burocracia, entregando resolução 24h em um app onde o usuário finaliza a tarefa antes do tempo de uma fila real.", "Fazer o app vermelho e amarelo vibrante para explorar a lei de Fitts de reconhecimento reflexivo."], answer: "Remover fricções e burocracia, entregando resolução 24h em um app onde o usuário finaliza a tarefa antes do tempo de uma fila real.", explanation: "UX não é só visual. A dor comportamental (esperar/depender) deve ser curada através da autonomia. O design devolve o controle instantâneo na palma da mão." },
                    { context: "Análise Qualitativa", text: "Um suporte anota: 'Os clientes estão reclamando abertamente no Twitter que se sentem enganados pelas taxas mensais'. Em qual quadrante do Mapa de Empatia e em qual nível de Norman isso deve ser ancorado?", options: ["Quadrante 'O que ele VÊ', afetando diretamente a primeira impressão Visceral ao abrir as redes sociais e o site da empresa pela primeira vez.", "Quadrante 'O que ele FAZ e DIZ', ferindo a longo prazo o nível Reflexivo relacionado à confiança e associação moral com a marca em questão.", "Quadrante 'O que ele OUVE', estimulando o nível Comportamental de interação com botões de cancelamento ou mudança de rotas no checkout.", "Essa queixa deve ser ignorada do Mapa, pois redes sociais geram vieses emocionais que invalidam métricas quantitativas limpas e exatas de usabilidade."], answer: "Quadrante 'O que ele FAZ e DIZ', ferindo a longo prazo o nível Reflexivo relacionado à confiança e associação moral com a marca em questão.", explanation: "Uma ação pública é um 'Fazer/Dizer'. A dor fere o sentimento de dignidade e significado perante a marca, caracterizando uma grave crise reflexiva de longo prazo." },
                    { context: "Deleite de Longo Prazo", text: "Um aplicativo de fitness envia uma notificação: 'Parabéns, você está no top 5% de dedicação do mês'. Qual o propósito estratégico cognitivo dessa micro-interação?", options: ["Verificar falhas comportamentais e bugs no disparo e push do servidor, mascarados como um elogio automatizado para evitar reclamações de suporte.", "Acelerar a Lei de Hick obrigando o usuário a interagir em menos de cinco segundos sob estresse extremo, melhorando conversão visceral.", "Forçar o 'Reconhecimento em vez de Recordação', lembrando o cliente de pagar as parcelas do seu plano de treinamento avançado e de assinatura vitalícia.", "Atuar fortemente no nível Reflexivo, atrelando a autoimagem de sucesso, orgulho próprio e significado duradouro ao ecossistema do aplicativo em tela."], answer: "Atuar fortemente no nível Reflexivo, atrelando a autoimagem de sucesso, orgulho próprio e significado duradouro ao ecossistema do aplicativo em tela.", explanation: "Ao invés de só medir a corrida (comportamental), a interface afeta o modo como o usuário se avalia positivamente, transformando uma ferramenta funcional em um pilar emocional (Reflexivo)." }
                ],
                conceptual: [
                    { context: "Estrutura Funcional", text: "Qual a diferença central e tática entre o mapeamento visual do 'Mapa de Empatia' e a estruturação clássica de 'Personas' na rotina de design UX/UI?", options: ["O Mapa serve apenas para projetar a Arquitetura da Informação (sitemaps estruturais), enquanto a Persona foca rigorosamente nos wireframes de interface visual gráfica final.", "A Persona cria o perfil arquetípico, enquanto o Mapa mergulha a equipe nas rotinas, influências sensoriais e conflitos velados do dia a dia daquele perfil, barrando o viés do criador.", "O Mapa de Empatia documenta o orçamento da equipe (ROI) durante reuniões com Stakeholders, e a Persona lista restrições técnicas do Frontend (Javascript, APIs e frameworks).", "São exatamente a mesma documentação. O nome muda consoante as métricas de design ágil e a metodologia do Scrum ou Kanban escolhida pelo líder técnico de engenharia de software."], answer: "A Persona cria o perfil arquetípico, enquanto o Mapa mergulha a equipe nas rotinas, influências sensoriais e conflitos velados do dia a dia daquele perfil, barrando o viés do criador.", explanation: "A Persona é o 'personagem'. O Mapa é o contexto tridimensional. Ele humaniza a pesquisa, forçando a equipe a enxergar através dos olhos do usuário antes de programar as soluções." },
                    { context: "Níveis de Norman", text: "O que caracteriza biologicamente e projetualmente o 'Nível Visceral' no modelo tricamadas apresentado por Don Norman?", options: ["A análise lenta e de custo-benefício racional que ocorre em compras B2B ou softwares industriais antes de gerar os relatórios de conversão quantitativos finais de ROI.", "A reação instintiva e subconsciente focada na aparência imediata e nas emoções primárias (o 'ranço' ou o fascínio), ativando julgamentos rápidos de prazer, caos ou perigo biológico.", "A usabilidade tática envolvida em concluir um longo formulário de checkout em etapas num sistema bancário focado na eliminação do esforço e da carga de memória mental heurística.", "O status sociológico consolidado pela comunidade após anos atrelados fielmente à marca de software open source e a defesa dela contra concorrentes novos do mercado de atuação geral."], answer: "A reação instintiva e subconsciente focada na aparência imediata e nas emoções primárias (o 'ranço' ou o fascínio), ativando julgamentos rápidos de prazer, caos ou perigo biológico.", explanation: "Nível Visceral é instinto. É pré-consciente. O design desordenado não parece apenas confuso; parece, neurologicamente, algo hostil e estressante de forma instantânea." },
                    { context: "Técnicas de Documentação", text: "Ao documentar as seções do Mapa de Empatia relacionadas aos sentimentos e falas, por que a prática UX determina a utilização estrita de 'citações diretas (verbatim)'?", options: ["Para que o software de análise de texto generativo (IA) do Figma converta palavras em fluxogramas automatizados sem exigir validação qualitativa do mediador da equipe de desenvolvimento interno da plataforma estrutural.", "Para ancorar o documento na realidade empírica, mitigando o risco crítico dos desenvolvedores e designers projetarem suas próprias percepções preconcebidas (maldição do conhecimento) no modelo final de perfil.", "Por exigências da lei geral de proteção de dados, que obriga a identificação cruzada de métricas demográficas de todos os indivíduos do teste e o compartilhamento ético de dados de servidores online da web.", "Para tornar a avaliação heurística do sistema mais rápida, omitindo informações que demandam interpretação do fluxo de design emocional antes dos wireframes interativos de média fidelidade ou protótipos visuais de baixa."], answer: "Para ancorar o documento na realidade empírica, mitigando o risco crítico dos desenvolvedores e designers projetarem suas próprias percepções preconcebidas (maldição do conhecimento) no modelo final de perfil.", explanation: "As citações ancoram a equipe na realidade nua do cliente, eliminando achismos e o perigo de inventar dores irreais na sala de criação." },
                    { context: "Comportamento UX", text: "Projetar adequadamente para o 'Nível Comportamental' de uma interface exige focar metodologicamente em quais aspectos práticos e heurísticos?", options: ["No refinamento minucioso do CSS de animações tridimensionais abstratas da tela inicial de carregamento contínuo.", "Na exclusão da responsabilidade social da arquitetura de informação e fomento unicamente de métricas mercadológicas baseadas em Dark Patterns agressivas de conversão em checkouts complexos.", "No uso de paletas monocromáticas e logos enormes na porção superior esquerda para ancorar a sensação de autoridade mercadológica institucional antes do engajamento orgânico completo.", "Na fluidez da função e no prazer de uso prático, oferecendo feedback instantâneo e garantindo ao cérebro uma sensação imersiva de domínio lógico das ferramentas da interface em execução natural."], answer: "Na fluidez da função e no prazer de uso prático, oferecendo feedback instantâneo e garantindo ao cérebro uma sensação imersiva de domínio lógico das ferramentas da interface em execução natural.", explanation: "O comportamento e uso se alimentam da performance, tolerância a erros e clareza. O usuário gosta quando a máquina obedece de forma polida e previsível." }
                ]
            },
            3: {
                practical: [
                    { context: "Sobrecarga Sensorial (TEA)", text: "Num portal educacional infantil, o login mescla vídeos autoexecutáveis com música alta, contadores regressivos coloridos e banners giratórios de ofertas relâmpago. Qual o impacto projetivo para um aluno no Espectro Autista?", options: ["Maior retenção atencional devido ao Efeito Von Restorff ativado multiplamente no campo visual principal e otimização imediata da taxonomia de fluxo mental na navegação.", "Estresse visual extremo e paralisia sistêmica, já que o design não provê filtros aos estímulos redundantes, atropelando a sensibilidade sensorial de forma violenta.", "Atuação positiva na memória espacial de curto prazo, pois o movimento ativa o Nível Comportamental instintivo gerando controle absoluto do percurso.", "Nenhum impacto direto, já que a acessibilidade web está condicionada unicamente ao cumprimento mecânico da inserção de Alt Text."], answer: "Estresse visual extremo e paralisia sistêmica, já que o design não provê filtros aos estímulos redundantes, atropelando a sensibilidade sensorial de forma violenta.", explanation: "Para neurodivergentes, movimento incessante, ruídos sem aviso e cronômetros geram estresse massivo (carga visceral) inviabilizando o cumprimento da tarefa primária." },
                    { context: "Ocultação Semântica", text: "O site infame 'Million Dollar Homepage' empilhava blocos gráficos caóticos contendo hiperlinks sem adotar estruturas de HTML como nav, main, headers ou Alt Text adequado nas tags de imagens. Qual a barreira central?", options: ["Inviabilizou severamente o download em conexões móveis lentas de terceira geração prejudicando usuários com dados móveis limitados.", "Tornou-se impossível de usar por quem necessita de Leitores de Tela (VoiceOver), pois a interface se apresentava como um vácuo negro desprovido de marcação estrutural.", "Diminuiu o tamanho da área percutível exigida para interações em telas touch-screen invalidando o Princípio de Fitts.", "Melhorou drasticamente o Design Universal pois as imagens substituem a barreira dos idiomas mundiais complexos."], answer: "Tornou-se impossível de usar por quem necessita de Leitores de Tela (VoiceOver), pois a interface se apresentava como um vácuo negro desprovido de marcação estrutural.", explanation: "As tecnologias assistivas não 'veem' a tela; elas 'leem' as intenções semânticas do código. Sem marcações estruturais e descritivos, o conteúdo literalmente não existe para o software e para o usuário cego." },
                    { context: "Teste Heurístico Prático", text: "Ao executar o Checklist Inclusivo, você percebe que a tela de compra utiliza 'Placeholders' fracos (dentro do formulário) que desaparecem ao digitar, forçando o cliente a usar a própria memória para manter a função da caixa. Qual nicho mais sofre?", options: ["Usuários normovisuais avançados de ambientes desktop com monitores amplos.", "Engenheiros Backend testando o banco e o servidor API.", "Usuários com TDAH, deficiências cognitivas ou perda de memória recente, violando a recomendação crucial do 'Reconhecimento, e não Recordação'.", "Exclusivamente pessoas daltônicas que não captam o uso do sublinhado."], answer: "Usuários com TDAH, deficiências cognitivas ou perda de memória recente, violando a recomendação crucial do 'Reconhecimento, e não Recordação'.", explanation: "Se o rótulo da instrução desaparece, a interface descarrega a obrigação logística na memória frágil do usuário. Isso é o oposto da redução de carga cognitiva exigida na IHC humanizada." },
                    { context: "Contraste Prático", text: "Ao testar a usabilidade real do Padrão GOV.BR com o NVDA e navegação por teclado, notou-se o uso do alto contraste somado a molduras dinâmicas espessas ao redor do objeto 'focado' pela tabulação orgânica. O intuito é:", options: ["Elevar o ruído semântico do site.", "Servir apenas para validar o cumprimento protocolar estético do design minimalista perante o tribunal governamental.", "Fornecer rastreabilidade motora crucial; permitindo que usuários que não operam mouses vejam espacialmente em tempo real qual nó está interagindo.", "Garantir a funcionalidade das micro-animações avançadas com alto gasto de dopamina, explorando técnicas de neuromarketing digital."], answer: "Fornecer rastreabilidade motora crucial; permitindo que usuários que não operam mouses vejam espacialmente em tempo real qual nó está interagindo.", explanation: "O 'Focus' visível aliado a contrastes testados previne a pior sensação de navegação seqüencial: apertar 'Tab' às cegas e clicar sem saber onde a máquina registrou o apontamento." }
                ],
                conceptual: [
                    { context: "Dilemas de Abordagem", text: "Na perspectiva metodológica macro de UX, como diverge o escopo da 'Acessibilidade' em comparação aos objetivos da 'Usabilidade'?", options: ["Acessibilidade mensura campanhas de funil; a Usabilidade projeta o Wireframe visual interativo.", "Acessibilidade exige a extinção absoluta dos obstáculos técnicos para a entrada (Pode acessar?). A Usabilidade avalia as métricas fluídas da jornada interna vivenciada após o rompimento das barreiras (A jornada é satisfatória?).", "Usabilidade foca só no nível Visceral; Acessibilidade nas métricas comportamentais viciantes.", "São o mesmo método exato que só diferenciam o público-alvo para justificar preços no planejamento."], answer: "Acessibilidade exige a extinção absoluta dos obstáculos técnicos para a entrada (Pode acessar?). A Usabilidade avalia as métricas fluídas da jornada interna vivenciada após o rompimento das barreiras (A jornada é satisfatória?).", explanation: "Sem Acessibilidade (remoção de barreiras) a Usabilidade não começa. O uso pode ser excelente, mas se a pessoa não consegue entrar na estrutura, toda a análise cai por terra." },
                    { context: "Neurodiversidade em Interface", text: "Ao observar o padrão de leitura em interfaces pesadas, o que justifica, sob a lupa médica/UX, que blocos sólidos de texto altamente justificado, associados com serifas artísticas, agem como obstáculo cruel à usuários no Espectro Disléxico?", options: ["Elas barram a conexão direta com as APIs abertas no desenvolvimento.", "A Dislexia exige a rápida tradução neural da forma das palavras; Serifas mesclam as letras induzindo confusões, enquanto o justificado gera vales de espaços brancos na malha (rios) que interrompem o fluxo visual.", "Eles melhoram drasticamente o Efeito Von Restorff ao realçar erros tipográficos.", "Eles estimulam excessivamente a audição paralela das funções interativas."], answer: "A Dislexia exige a rápida tradução neural da forma das palavras; Serifas mesclam as letras induzindo confusões, enquanto o justificado gera vales de espaços brancos na malha (rios) que interrompem o fluxo visual.", explanation: "Tipografia sem serifa em alinhamento à esquerda fornece previsibilidade rítmica visual e claridade nas fronteiras de cada sílaba, ajudando o cérebro na decodificação extenuante." },
                    { context: "WCAG Objetiva", text: "As Diretrizes Internacionais do WCAG 2.1 garantem o suporte em quatro metas magnas (POUR). A quais eixos elas referem-se?", options: ["Padrão Minimalista Exigido (UI), Hierarquia Flexível, Criptografia Pesada e Arquiteturas Escaláveis.", "Princípios P.O.U.R: Perceptível (O conteúdo precisa ser absorvido sensorialmente); Operável (Navegação motora acessível); Compreensível (Clareza do conteúdo e operação); Robusto (Legibilidade do código por leitores múltiplos).", "Flexível, Robusto, Econômico e Original.", "Visual Perfeito, Experiência Fluída, Código Reduzido e Rapidez Extrema."], answer: "Princípios P.O.U.R: Perceptível (O conteúdo precisa ser absorvido sensorialmente); Operável (Navegação motora acessível); Compreensível (Clareza do conteúdo e operação); Robusto (Legibilidade do código por leitores múltiplos).", explanation: "Sem esses 4 pilares, o design inclusivo sucumbe no primeiro degrau prático da Web. Eles asseguram que os sentidos, a interação e os softwares assistivos estarão na mesma página." },
                    { context: "Terminologia de Design", text: "Ao contrapor 'Design Universal' a metodologias de 'Design Inclusivo', qual assertiva define o foco do Design Inclusivo?", options: ["Universal obriga o uso da linguagem arcaica nos termos; Inclusivo defende o mercado de luxo e elitiza componentes.", "Design Universal almeja desenhar o artefato pragmático para acolher todos 'de uma vez'. O Design Inclusivo ataca as restrições reconhecendo ativamente que não há molde absoluto e integra as exceções no desenvolvimento.", "São ambos modelos focados rigorosamente em design comportamental viciante que evitam barreiras legais.", "Universal é o design sem cores, e Inclusivo é apenas para sistemas de voz modernos."], answer: "Design Universal almeja desenhar o artefato pragmático para acolher todos 'de uma vez'. O Design Inclusivo ataca as restrições reconhecendo ativamente que não há molde absoluto e integra as exceções no desenvolvimento.", explanation: "O Design Inclusivo abraça o desafio processual contínuo de tentar sempre combater as barreiras mutantes na realidade das exclusões das margens, exigindo adaptações ricas." }
                ]
            },
            4: {
                practical: [
                    { context: "Validação Antecipada", text: "Sua equipe de UX planeja testar se os usuários encontram a aba de 'Cancelamento' no sitemap de um novo app financeiro antes de discutirem cores ou ilustrações. Qual estratégia empírica é essencial neste tempo sensível no ciclo do MVP?", options: ["Prototipagem de Baixa/Média Fidelidade em tons de cinza ou papel explorando táticas brutas baseadas na métrica direta como 'Tree Testing' e 'Card Sorting' validando fluxos intelectuais.", "Teste Não Moderado massivo explorando 'System Usability Scale' com protótipos programados do Frontend baseados no CSS puro.", "Testes A/B focados estritamente na cor complementar Laranja de alto impacto da fase final.", "Uso da interface nativa de voz para simular cliques sem visibilidade."], answer: "Prototipagem de Baixa/Média Fidelidade em tons de cinza ou papel explorando táticas brutas baseadas na métrica direta como 'Tree Testing' e 'Card Sorting' validando fluxos intelectuais.", explanation: "Errar no papel/cinza é barato. Testar a fundação estrutural sem o ruído visual garante que o arcabouço lógico atenda aos Modelos Mentais orgânicos do usuário." },
                    { context: "Engajamento Ético ou Tóxico?", text: "Redes sociais utilizam 'Refresh Infinito' com conteúdos de incerteza da fase de recompensas flutuantes e gatilhos instintivos. Como a lente Ética UX julga esse progresso comercial?", options: ["Considera a maior vitória no campo das 'Microinterações', consagrando o uso positivo de Dark Patterns.", "Isso configura um engajamento pautado na vulnerabilidade neural, explorando o Loop do Hábito instintivo baseando a escalada num design viciante que colide com tendências de proteção e Bem-Estar cognitivo.", "Significa que as heurísticas de flexibilidade foram ativadas adequadamente beneficiando daltônicos.", "Trata-se de pura usabilidade clássica inofensiva e recomendada por Nielsen."], answer: "Isso configura um engajamento pautado na vulnerabilidade neural, explorando o Loop do Hábito instintivo baseando a escalada num design viciante que colide com tendências de proteção e Bem-Estar cognitivo.", explanation: "O Design Emocional ético visa a autonomia. Explorar atalhos cerebrais viciantes usando interfaces enganosas para furtar tempo é classificado como um Dark Pattern predatório." },
                    { context: "As Leis Matemáticas no Dashboard", text: "Você deve melhorar um sistema aéreo que requer que despachantes selecionem a pista em 3 segundos diante de um mapa em crise. A tela anterior possuía 45 botões diminutos cinzas. O que as Leis da usabilidade forçam corrigir primeiro?", options: ["Aplicar Estética Minimalista Clássica escurecendo todos os componentes para forçar a adaptação ocular.", "Reduzir dramaticamente o volume massivo de opções (Lei de Hick) e expandir a zona magnética de toque/clique dos controles vitais aproximando-os instintivamente (Lei de Fitts).", "Ignorar a usabilidade e focar na inserção de elementos decorativos vermelhos de atenção contínua baseados no Efeito de Von Restorff.", "Obrigar o uso de Card Sorting na hora do perigo absoluto."], answer: "Reduzir dramaticamente o volume massivo de opções (Lei de Hick) e expandir a zona magnética de toque/clique dos controles vitais aproximando-os instintivamente (Lei de Fitts).", explanation: "Design nesse cenário é engenharia. Mais botões demandam mais energia computacional do cérebro (Hick). Botões ínfimos demoram mais para serem alcançados sob estresse (Fitts)." },
                    { context: "Papel do Designer com a IA", text: "Ao usar Uizard ou IAs capazes de montar telas padronizadas em 30 segundos, como o UX/UI Designer prático deve agir estrategicamente para não ser redundante?", options: ["Desligar os programas e voltar a codificar CSS puro estrutural em tabelas HTML cruas.", "Deslocar o foco crítico da 'fabricação passiva de pixels' para a regência analítica contínua da arquitetura da informação em estados invisíveis: Como a IA recupera erros? Onde o 'Empty State' retém o humano? Como orquestramos os fluxos de exceção?", "Focar somente nos testes de Guerrilha com formulários abertos sem roteiros para coletar achismos isolados de cor.", "Assumir estritamente as documentações textuais de marketing, largando completamente a modelagem lógica visual."], answer: "Deslocar o foco crítico da 'fabricação passiva de pixels' para a regência analítica contínua da arquitetura da informação em estados invisíveis: Como a IA recupera erros? Onde o 'Empty State' retém o humano? Como orquestramos os fluxos de exceção?", explanation: "As ferramentas constroem as paredes rápidas, mas não sabem onde a casa deve ter janelas. O Designer cuida das zonas de interseção complexa, Edge Cases e recuperação de erros lógicos." }
                ],
                conceptual: [
                    { context: "Viés Cognitivo de Projeto", text: "O que significa estruturalmente combater a 'Maldição do Conhecimento' num cenário de criação UX?", options: ["Exigir testes contínuos moderados que quebrem os modelos viciados do time de criadores originais que já memorizaram os labirintos do sistema e falham ao antecipar os atritos sentidos pelo novato.", "Acatar passivamente a vontade e a documentação burocrática dos líderes de marketing focados exclusivamente no neuro-marketing.", "Criar barreiras complexas com senhas longas para excluir usuários mais velhos.", "Proibir todos os testes iterativos no papel na etapa baixa da fidelidade e passar para o backend."], answer: "Exigir testes contínuos moderados que quebrem os modelos viciados do time de criadores originais que já memorizaram os labirintos do sistema e falham ao antecipar os atritos sentidos pelo novato.", explanation: "O inventor sabe todas as engrenagens ocultas. Isso o torna cego à incompreensão do leigo. Testes reais quebram o espelho do narcisismo projetual do autor da interface." },
                    { context: "Construção do Teste", text: "Ao desenhar o 'Plano de Teste de Usabilidade', por que é fundamental usar 'Cenários' em detrimento de puras 'Instruções Direcionais' para o usuário?", options: ["Instruir verbalmente o ato ('Clique em configurações') arruína a avaliação de navegação autônoma intuitiva. Cenários envolvem emoções, simulam pressão e ativam o modelo cognitivo real de busca do usuário.", "Porque cenários são muito fáceis e induzem ao Efeito Hawthorne rápido.", "As orientações frias engatilham erros pesados nos softwares de mouse tracking que gravam o calor.", "Serve para esconder os problemas no relatório ao induzir falhas intencionais dos grupos focais."], answer: "Instruir verbalmente o ato ('Clique em configurações') arruína a avaliação de navegação autônoma intuitiva. Cenários envolvem emoções, simulam pressão e ativam o modelo cognitivo real de busca do usuário.", explanation: "A instrução é um spoiler; ensina a usar a interface. O cenário dá o desejo e o desafio para que o usuário tropece nativamente nos obstáculos estruturais sem a bengala do moderador." },
                    { context: "Validação Cruzada", text: "Por que o uso estrito de métodos Quantitativos Não Moderados (ex: taxa de rejeição, tempo de tela) nunca substitui plenamente a etapa rica de testes Moderados (Qualitativos) com usuários reais?", options: ["Pois o método Quantitativo fornece 'O Que' rompeu no funil, mas é cego. Somente o teste Qualitativo (entrevista/observação) desvenda os 'Por Quês' subjacentes (as emoções, dúvidas e modelos mentais) das falhas.", "Porque testes qualitativos não necessitam de humanos na sua estrutura; apenas softwares caros de AI.", "Eles excluem a acessibilidade, substituindo o WCAG por testes de layout simplificados.", "Eles avaliam apenas protótipos rabiscados em papeis brancos sem a interatividade na tela."], answer: "Pois o método Quantitativo fornece 'O Que' rompeu no funil, mas é cego. Somente o teste Qualitativo (entrevista/observação) desvenda os 'Por Quês' subjacentes (as emoções, dúvidas e modelos mentais) das falhas.", explanation: "O dado frio quantitativo acha o local do vazamento. A análise quente e qualitativa (Entrevista, UX Lab) explica porque o material não suportou a pressão humana." },
                    { context: "Validação Avaliativa Heurística", text: "No espectro das metodologias robustas de UX, o que preconiza filosoficamente o teste 'Percurso Cognitivo' (Cognitive Walkthrough)?", options: ["É a fase final onde usuários com deficiência visual validam unicamente o contraste remotamente.", "A substituição das entrevistas por gravação cega em mapas de calor usando IA para avaliar botões.", "Um mergulho avaliativo estruturado onde Especialistas (Não usuários finais) transitam passo a passo pelo fluxo, formulando questões duras à cada transição (ex: O usuário reconhecerá a rota?) focando em destruir falhas lógicas precoces da interface.", "Uso restrito da moderação no mercado via testes de Guerrilha focados puramente em cor da paleta."], answer: "Um mergulho avaliativo estruturado onde Especialistas (Não usuários finais) transitam passo a passo pelo fluxo, formulando questões duras à cada transição (ex: O usuário reconhecerá a rota?) focando em destruir falhas lógicas precoces da interface.", explanation: "Não se deve usar o usuário final para corrigir falhas evidentes de transição que especialistas conseguem pegar. O Percurso ataca logicamente as pontes invisíveis de conhecimento." }
                ]
            },
            5: {
                practical: [
                    { context: "Gestão Crítica de Erro", text: "No portal governamental o preenchimento gera o alerta: 'Exceção não tratada DBX40 - Operação suspensa'. Baseado nas Heurísticas de Nielsen, qual eixo foi massacrado e o que é requerido?", options: ["Violação na Estética Minimalista devido ao tamanho exacerbado da fonte nos dispositivos.", "A destruição da diretriz 'Ajude os Usuários a Reconhecerem, Diagnosticarem e se Recuperarem de Erros' somada à omissão da 'Correspondência com o Mundo Real'. A interface deve adotar mensagens orgânicas pacíficas sem códigos técnicos indecifráveis, explicitando a falha e dando um atalho de correção.", "Foi violada rigorosamente a Liberdade Exata de Gestão Autônoma, devido à aplicação de Dark Patterns.", "Violação pragmática estrita na Aceleração de Flexibilidade Eficiente nos percursos do design de interação."], answer: "A destruição da diretriz 'Ajude os Usuários a Reconhecerem, Diagnosticarem e se Recuperarem de Erros' somada à omissão da 'Correspondência com o Mundo Real'. A interface deve adotar mensagens orgânicas pacíficas sem códigos técnicos indecifráveis, explicitando a falha e dando um atalho de correção.", explanation: "Um código 'DBX40' agride o usuário e esconde o que ele deve fazer. A máquina deve dialogar amigavelmente instruindo o passo de correção (Ex: 'Seu CPF está incompleto. Corrija adicionando os dígitos ausentes')." },
                    { context: "Prevenção vs Reação", text: "Ao estruturar a transferência em um app de corretora, o UX propõe aplicar máscaras dinâmicas (R$ 0,00 automático) que barram a inserção de letras no valor. Qual heurística magna atua aqui?", options: ["Visibilidade Constante de Status Dinâmicos dos processos orgânicos.", "A Prevenção de Erros (Nielsen #5). Superior a criar boas mensagens de erro é orquestrar restrições funcionais que blindam o campo e eliminam a condição instintiva que geraria o lapso operacional antes do clique.", "Efeito de Fitts adaptado à matriz de Hick no modelo de Design Universal.", "Prototipagem de Baixa Fidelidade baseada na técnica do Think Aloud."], answer: "A Prevenção de Erros (Nielsen #5). Superior a criar boas mensagens de erro é orquestrar restrições funcionais que blindam o campo e eliminam a condição instintiva que geraria o lapso operacional antes do clique.", explanation: "A prevenção de erros blinda a frente. Uma máscara auto-formatável bloqueada a letras destrói as frustrações instintivas futuras de um dígito digitado erroneamente." },
                    { context: "Desorientação do Breadcrumb", text: "Durante testes, o sujeito interage com uma sub-categoria profunda num e-commerce e exclama: 'Onde diabos do programa eu estou parado agora?'. Qual norma de usabilidade foi rompida?", options: ["Reconhecimento Heurístico Orgânico das Cores Base do Efeito Restorff.", "A 'Orientação (Scapin e Bastien)' combinada ao 'Status do Sistema (Nielsen)'. É crime tático manter a rota obscura. O usuário precisa situar-se (onde estou), identificar o trilho retroativo (de onde vim) e as vias prospectivas (para onde vou).", "As leis de Hick aplicadas nos cliques logarítmicos complexos do Menu Hamburguer.", "As Heurísticas focadas no Minimalismo extremo, focado em esconder tudo para diminuir o tamanho dos arquivos."], answer: "A 'Orientação (Scapin e Bastien)' combinada ao 'Status do Sistema (Nielsen)'. É crime tático manter a rota obscura. O usuário precisa situar-se (onde estou), identificar o trilho retroativo (de onde vim) e as vias prospectivas (para onde vou).", explanation: "Sem recursos como 'Breadcrumbs' (Migalhas de Pão: Home > Produtos > Tênis), o usuário se afoga no conteúdo. Se a interface corta a navegação, a cognição sobrecarrega na cegueira local." },
                    { context: "Símbolos e Memória", text: "Por que interfaces modernas ainda usam um velho ícone de 'disquete' para o comando de salvar, se a mídia física não existe mais para os usuários novos?", options: ["Isso satisfaz a 'Correspondência com o Mundo Real e o Modelo Mental Consolidado'. O ícone virou uma convenção universal ligada à ação de salvação; alterá-lo com gráficos alienígenas exigiria, de forma predatória, a força de 'Recordação' contínua na curva de aprendizado.", "Porque o design inclusivo determina obrigatoriamente por lei global do WCAG 2.1.", "Visa manter os princípios de Design Minimalista limpo.", "Serve como artifício Dark Pattern contínuo para evitar que novatos encontrem botões no design."], answer: "Isso satisfaz a 'Correspondência com o Mundo Real e o Modelo Mental Consolidado'. O ícone virou uma convenção universal ligada à ação de salvação; alterá-lo com gráficos alienígenas exigiria, de forma predatória, a força de 'Recordação' contínua na curva de aprendizado.", explanation: "O arquétipo visual ancorado queima menos energia na tradução imediata da ordem do que o uso de textos ou formatos inovadores desconhecidos. Mudar por vaidade estética sabota as operações vitais." }
                ],
                conceptual: [
                    { context: "Filosofia Macro IHC/UX", text: "No ecossistema do design centrado no humano, qual a diferença conceitual e prática entre a 'Usabilidade' (IHC) e a 'Experiência do Usuário' (UX)?", options: ["UX engloba os comandos ocultos no banco de dados e a Usabilidade se resume à paleta de cores da logomarca.", "Usabilidade foca nos testes de daltônicos; UX nas métricas logarítmicas de Hick.", "A Usabilidade é uma métrica dura (A tarefa é eficiente e fácil de completar?). A UX extrapola o uso pontual, sendo holística e englobando os sentimentos, o suporte técnico e a percepção de valor agregado total da marca antes, durante e após o uso.", "Usabilidade baseia-se unicamente no Design Universal e UX nos códigos HTML da Web."], answer: "A Usabilidade é uma métrica dura (A tarefa é eficiente e fácil de completar?). A UX extrapola o uso pontual, sendo holística e englobando os sentimentos, o suporte técnico e a percepção de valor agregado total da marca antes, durante e após o uso.", explanation: "Usabilidade trata de fazer uma fechadura excelente; UX reflete sobre como toda a porta, a entrada e o ambiente transmitem segurança e conforto na jornada prolongada." },
                    { context: "Papel Heurístico", text: "As Heurísticas de Nielsen são tratadas na indústria como escudos preventivos. Qual sua relação com os testes de usabilidade com humanos reais?", options: ["Elas barateiam o frontend e substituem a necessidade de testes por avaliações automáticas (WCAG).", "As Heurísticas funcionam como um filtro (checklist) onde especialistas limpam os erros crassos da Arquitetura antes de investir em testes. Contudo, elas JAMAIS substituem o teste final pragmático com o usuário real lidando com a imprevisibilidade da interface.", "Elas não funcionam sem a avaliação logarítmica das cores primárias na navegação estrutural.", "Elas forçam a utilização restrita no papel e ignoram a programação técnica no Frontend." ], answer: "As Heurísticas funcionam como um filtro (checklist) onde especialistas limpam os erros crassos da Arquitetura antes de investir em testes. Contudo, elas JAMAIS substituem o teste final pragmático com o usuário real lidando com a imprevisibilidade da interface.", explanation: "Especialistas preveem desastres mecânicos no fluxo (Heurística); mas só o choque empírico com a imprevisibilidade do usuário novato legitima as dores de compreensão da jornada (Teste com Usuários)." },
                    { context: "Carga Cognitiva", text: "O princípio de 'Minimizar a Recordação e Privilegiar o Reconhecimento' afeta plataformas de alta complexidade de que maneira?", options: ["Força o uso de textos gigantes que explicam o arquétipo na tela de abertura.", "A cognição se frustra rápido. Obrigá-la a resgatar funções soltas na memória (recordar) custa caro. O design deve dispor os caminhos em menus e ícones óbvios prontos à coleta visual (reconhecimento), dispensando a escavação mental cansativa do usuário.", "Desliga as diretrizes focando no Loop de Gatilhos baseados na ansiedade visceral nas micro-interações.", "Obriga a adoção da linguagem em inglês e cores quentes ativas em áreas cegas." ], answer: "A cognição se frustra rápido. Obrigá-la a resgatar funções soltas na memória (recordar) custa caro. O design deve dispor os caminhos em menus e ícones óbvios prontos à coleta visual (reconhecimento), dispensando a escavação mental cansativa do usuário.", explanation: "Nossa memória falha. Interfaces complacentes deixam as opções expostas (como um menu de restaurante), servindo de prótese à memória limitada e reduzindo a carga cognitiva." },
                    { context: "Debriefing e Relatório", text: "Logo após a inspeção heurística individual dos especialistas, ocorre o Debriefing. Qual a missão vital desta reunião para o projeto de software?", options: ["Lançar imediatamente a documentação para aprovação do questionário SUS isolado.", "Conduzir um Teste A/B com cores diferentes e animações no painel de controle.", "Cruzar as descobertas isoladas, remover o ruído de avaliações duplicadas, e escalonar rigorosamente os problemas em uma Matriz de Severidade, sinalizando inequivocamente ao time de Dev quais 'incêndios' da interface exigem correção emergencial imediata.", "Programar simultaneamente sem moderação em wireframes e código nativo." ], answer: "Cruzar as descobertas isoladas, remover o ruído de avaliações duplicadas, e escalonar rigorosamente os problemas em uma Matriz de Severidade, sinalizando inequivocamente ao time de Dev quais 'incêndios' da interface exigem correção emergencial imediata.", explanation: "A reunião filtra as visões e entrega aos programadores uma lista técnica e inquestionável priorizada pelo risco que o problema impõe à sobrevivência da usabilidade." }
                ]
            },
            6: {
                practical: [
                    { context: "Análise Competitiva Prática", text: "No benchmarking, a equipe percebeu que concorrentes ocultavam botões vitais de compra em menus complexos. O redesign resolveu isso usando uma hierarquia plana (Flat) com atalhos expostos. O que isso buscou?", options: ["Ativar a repulsa instintiva baseada no ranço orgânico visceral do arquétipo Rebelde.", "Anular o gargalo limitador validado do nicho, cruzando o eixo de usabilidade do consumidor focado na praticidade com o eixo de Negócios ávido pela conversão rápida de vendas sem fricção.", "Focar unicamente no Hook Model em animações dopaminérgicas baseadas em recompensa aleatória.", "Adotar Estética Minimalista no código HTML nativo da aplicação móvel." ], answer: "Anular o gargalo limitador validado do nicho, cruzando o eixo de usabilidade do consumidor focado na praticidade com o eixo de Negócios ávido pela conversão rápida de vendas sem fricção.", explanation: "Benchmarking acha a falha; UX cria a solução unindo a sobrevivência financeira da empresa (Desirability/Viability) com a eliminação da dor do usuário num caminho sem cliques mortos." },
                    { context: "Testes Precoces (Card Sort)", text: "Na prototipação em Baixa Fidelidade, a equipe realizou um 'Card Sorting' (Ordenação de Cartões) para definir os menus. Qual problema isso evita na arquitetura da informação?", options: ["Assegura a adequação das paletas quentes em acessibilidade visual focada na WCAG.", "Destroça as alucinações dos modelos mentais viciados dos próprios desenvolvedores, estruturando as prateleiras lógicas das categorias de forma fidedigna ao raciocínio genuíno do leigo que usará a ferramenta no dia a dia.", "Testa de imediato o contraste estético visual isolado para leitores cegos.", "Obriga a conversão do Frontend para linguagens nativas puras sem flexibilidade." ], answer: "Destroça as alucinações dos modelos mentais viciados dos próprios desenvolvedores, estruturando as prateleiras lógicas das categorias de forma fidedigna ao raciocínio genuíno do leigo que usará a ferramenta no dia a dia.", explanation: "As lógicas de menus costumam ser corrompidas pelos desenvolvedores (que aglomeram itens por tabela de banco de dados). Cartões forçam a categorização guiada pela lógica ingênua e real do consumidor." },
                    { context: "Quantitativo X Qualitativo", text: "O painel (Analytics) mostra que 5.000 usuários abandonam a tela na etapa 3. Sem um teste Qualitativo (Moderado com Think Aloud), por que a equipe fica estagnada na solução?", options: ["Porque faltou a adoção do Loop de Hábito na camada comportamental limpa estrutural.", "Os dados Quantitativos acusam exatamente ONDE o funil sangra, mas são completamente cegos para o PORQUÊ. Sem a fala de dor do usuário em um teste qualitativo, a equipe tenta adivinhar os atritos emocionais ou confusões mentais baseando-se em achismos.", "Porque o arquétipo utilizado estava fora da cebola e o desenvolvimento focou no Frontend limpo.", "Isso ocorre por falha de aplicação do Efeito Von Restorff nos modelos de navegação cega." ], answer: "Os dados Quantitativos acusam exatamente ONDE o funil sangra, mas são completamente cegos para o PORQUÊ. Sem a fala de dor do usuário em um teste qualitativo, a equipe tenta adivinhar os atritos emocionais ou confusões mentais baseando-se em achismos.", explanation: "As métricas quentes de massa apontam o buraco na ponte; mas só o vídeo de alguém tropeçando ali revela qual pedra (confusão na rota ou falta de clareza) causou a queda." },
                    { context: "Decisões de Wireframes (Lo-Fi)", text: "Por que o fluxo de UX impõe uma fase dolorosa de rabiscos puros e caixas cinzas (Wireframe de Baixa Fidelidade) antes de ir para a alta fidelidade (UI colorida)?", options: ["Isso atrasa o teste A/B visual das campanhas de marketing.", "O objetivo não é testar estética, mas forçar uma validação ríspida da lógica de Arquitetura da Informação e fluxos. Errar 'cedo e barato' no rabisco evita o prejuízo massivo de ter que refatorar telas coloridas inteiras porque o usuário não encontrou um botão chave na taxonomia.", "Eliminar a Lei de Fitts e aplicar o arquétipo do Rebelde nos componentes interativos.", "Avaliar o desempenho do código nativo do servidor no carregamento remoto de imagens grandes." ], answer: "O objetivo não é testar estética, mas forçar uma validação ríspida da lógica de Arquitetura da Informação e fluxos. Errar 'cedo e barato' no rabisco evita o prejuízo massivo de ter que refatorar telas coloridas inteiras porque o usuário não encontrou um botão chave na taxonomia.", explanation: "A interface estética é a pintura. Se o encanamento (navegação estrutural) da casa estiver torto, derrubar a parede já pintada no fim do projeto custa fortunas em horas de design/programação." }
                ],
                conceptual: [
                    { context: "Benchmarking", text: "Ao realizar Benchmarking analítico num ecossistema de projeto, qual o objetivo funcional na avaliação inicial de UX?", options: ["Copiar o código fonte aberto no frontend das concorrentes focando nas IAs.", "Aplicar Lei Fitts nas tipografias base de cores focando estritamente na Acessibilidade.", "O objetivo não é o plágio, mas mapear a 'linha de conforto' estabelecida (padrão que o usuário já confia) e rastrear estrategicamente gargalos das concorrentes, decidindo o que nivelar e onde inovar na nova arquitetura do software.", "Obrigar a equipe na inserção rigorosa de Dark Patterns baseados no fluxo da web." ], answer: "O objetivo não é o plágio, mas mapear a 'linha de conforto' estabelecida (padrão que o usuário já confia) e rastrear estrategicamente gargalos das concorrentes, decidindo o que nivelar e onde inovar na nova arquitetura do software.", explanation: "Observar quem venceu na arena ensina. O benchmarking cria uma base (o nicho já tem esse modelo mental) e estipula zonas de oportunidade (onde a interface deles falha, nós seremos fluidos)." },
                    { context: "Wireframe Arquitetural", text: "O que o Wireframe (esqueleto em baixa fidelidade) traduz primariamente dentro da avaliação metodológica de UX?", options: ["Os blocos emocionais vívidos e as cores vibrantes abstratas com base no engajamento do Hábito visceral.", "Os códigos do backend logarítmico remoto estrutural de teste de APIs.", "As leis de Hick em tipografias para leitores de tela na acessibilidade nativa.", "A tangibilidade visual crua da 'Arquitetura da Informação'. Ele exibe o organograma hierárquico, a navegação de fluxos e os pesos dos elementos sem a distração das artes coloridas de UI." ], answer: "A tangibilidade visual crua da 'Arquitetura da Informação'. Ele exibe o organograma hierárquico, a navegação de fluxos e os pesos dos elementos sem a distração das artes coloridas de UI.", explanation: "As caixas secas provam se a espinha dorsal lógica aguenta de pé a jornada do usuário antes de as carnes e as tintas estéticas do design gráfico ofuscarem o teste." },
                    { context: "Testes Qualitativos 'Think Aloud'", text: "Na técnica qualitativa do 'Think Aloud' (Pensar em Voz Alta), qual a regra base de comportamento inegociável para o Facilitador (avaliador)?", options: ["Obrigar o preenchimento de Card Sorts remotos limpos sem testes presenciais.", "Manter postura agressiva defendendo a arte e instruindo passo a passo o clique.", "Aplicar o SUS de imediato focando no Loop visceral das IAs.", "Adotar passividade silente máxima. Jamais tutelar instruindo o trajeto. Fazer perguntas neutras ('O que você procuraria aqui?') para forçar o usuário a externalizar sua dor e seu labirinto cognitivo sem a bengala do criador." ], answer: "Adotar passividade silente máxima. Jamais tutelar instruindo o trajeto. Fazer perguntas neutras ('O que você procuraria aqui?') para forçar o usuário a externalizar sua dor e seu labirinto cognitivo sem a bengala do criador.", explanation: "Instruções viciam o teste. O facilitador só age para evitar que o testador cale a boca, permitindo que as confusões e a hesitação fluam nativamente." },
                    { context: "SUS - System Usability Scale", text: "Ao finalizar um teste, aplica-se o questionário padronizado SUS (System Usability Scale). O que ele mensura faticamente?", options: ["Calcula a Lei de Fitts e o Loop da dopamina nas operações de IA.", "Atua como auditoria de WCAG 2.1 focada nas tipografias e contrastes visuais de acessibilidade.", "Mede rigorosamente a percepção subjetiva de usabilidade (Fácil x Difícil; Complexo x Seguro), convertendo sentimentos soltos e fadiga mental em um score numérico frio, base matemática padrão para aprovação técnica.", "Audita dark patterns nas áreas de conversão remota." ], answer: "Mede rigorosamente a percepção subjetiva de usabilidade (Fácil x Difícil; Complexo x Seguro), convertendo sentimentos soltos e fadiga mental em um score numérico frio, base matemática padrão para aprovação técnica.", explanation: "As opiniões humanas são divergentes e abstratas; o questionário enclausura o desabafo subjetivo, convertendo-o num índice objetivo (nota na faixa de 0 a 100) validando metricamente se a interface atingiu a taxa mínima de conforto." }
                ]
            }
        };

        const getGroupName = (id) => {
            const names = [
                "Psicologia e Branding", 
                "Design Emocional", 
                "Usabilidade e Acessibilidade", 
                "Ecossistema e Leis de UX", 
                "IHC e Heurísticas", 
                "Benchmarking e Arquitetura (AI)"
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
                
                feedback.value = { type: 'correct', text: 'Parabéns, lógica validada com sucesso!' };
                showAnswer.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= 3) {
                    feedback.value = { type: 'error', text: `Tentativas esgotadas. A resposta correta é: ${currentQuestion.value.answer}` };
                    showAnswer.value = true; 
                } else {
                    feedback.value = { type: 'error', text: `Diagnóstico Incorreto. Analise o contexto e a teoria novamente.` };
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
                filename:     `Relatorio_UXUI_IHC_G${selectedGroup.value}.pdf`,
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