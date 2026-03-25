const { createApp } = Vue;

createApp({
  data() {
    return {
      currentQuestionIndex: 0, attempts: 0, score: 0, logs: [],
      isTyping: false, feedbackMsg: "", feedbackType: "",
      showAnswer: false, gameOver: false, userSelection: null,
      
      questions: [
        { id: 1, instruction: "Arquitetura no E-learning.", scenario: "Na plataforma de aulas de programação, alunos não encontram os módulos nos menus.", text: "Qual disciplina foca em estruturar esse conteúdo?", options: ["Usabilidade", "IxD", "Arquitetura da Informação (AI)", "UI"], answer: "Arquitetura da Informação (AI)" },
        { id: 2, instruction: "Pilares do Produto.", scenario: "Para a landing page do Magazine Luiza, o marketing quer 3D, mas você só tem 1 semana em HTML/CSS.", text: "Qual pilar da Visão 360º de UX foi ignorado?", options: ["Desirability", "Feasibility (Restrições Tecnológicas)", "Viability", "Acessibilidade"], answer: "Feasibility (Restrições Tecnológicas)" },
        { id: 3, instruction: "Pesquisa UX preliminar.", scenario: "Antes de validar a landing page, a equipe cria uma ficha baseada em suposições da equipe sobre 'Ana, Desenvolvedora'.", text: "Como se chama essa representação preliminar?", options: ["Mapa da Empatia", "Proto-Persona", "User Flow", "Card Sorting"], answer: "Proto-Persona" },
        { id: 4, instruction: "Mapa da Empatia.", scenario: "Você anota: 'Meus colegas de laboratório dizem que o Notion é melhor que  OneNote'.", text: "Em qual quadrante isso se encaixa?", options: ["Pensa e Sente", "Fala e Faz", "Ouve (Influências)", "Vê (Ambiente)"], answer: "Ouve (Influências)" },
        { id: 5, instruction: "Tipos de Entrevista.", scenario: "Para descobrir cenários de sala de aula online, você usa um guia de tópicos focado na narrativa dos professores.", text: "Que tipo de entrevista é essa?", options: ["Estruturada", "Semiestruturada", "Não Estruturada", "Quantitativa"], answer: "Semiestruturada" },
        { id: 6, instruction: "Wireframes e Iteração.", scenario: "A equipe vai testar um fluxo de Auth0. Desenhamos caixas e linhas sem distrações visuais.", text: "Qual a vantagem do Lo-Fi?", options: ["Iteração rápida e barata (errar cedo)", "Testar cores WCAG", "Aplicar Lei de Fitts", "Aumentar Viability"], answer: "Iteração rápida e barata (errar cedo)" },
        { id: 7, instruction: "Organização do modelo mental.", scenario: "Você pede a alunos para agruparem os tópicos de CSS e JS em categorias que façam sentido para eles.", text: "Qual é a técnica utilizada?", options: ["Card Sorting", "User Flow", "Kanban", "Debriefing"], answer: "Card Sorting" },
        { id: 8, instruction: "Acessibilidade e Cores.", scenario: "O campo de 'Senha Incorreta' apenas fica com a borda vermelha. Homens com daltonismo podem não ver.", text: "Qual estratégia de Design Inclusivo falhou?", options: ["Proporção 4.5:1", "Não depender só da cor (usar ícones)", "Cores complementares", "Estética minimalista"], answer: "Não depender só da cor (usar ícones)" },
        { id: 9, instruction: "Cultura no UX.", scenario: "Um app ocidental usa verde para 'sucesso'. No oriente médio, a recepção foi ruim.", text: "O que o material diz sobre o verde em algumas culturas?", options: ["Significa luto", "É cor sagrada e pode significar infidelidade", "Acelera os batimentos", "Significa erro fatal"], answer: "É cor sagrada e pode significar infidelidade" },
        { id: 10, instruction: "Contraste WCAG.", scenario: "Você ajustou o CSS de um forms estático com fonte cinza clara sobre fundo branco.", text: "Qual a taxa mínima de contraste recomendada?", options: ["1:1", "4.5:1", "10:1", "2.0:1"], answer: "4.5:1" },
        { id: 11, instruction: "Tipografia em telas pequenas.", scenario: "O corpo de texto do módulo de treinamento foi configurado em 12px.", text: "Por que isso é um erro em web?", options: ["Títulos devem ser H1", "Mínimo recomendado para leitura em web é 16px", "Fere o Grid invisível", "Fere a Lei de Jakob"], answer: "Mínimo recomendado para leitura em web é 16px" },
        { id: 12, instruction: "Tomada de Decisão.", scenario: "O formulário Staticman tem 15 campos não essenciais. A taxa de conversão despencou.", text: "Qual lei psicológica explica essa desistência?", options: ["Lei de Fitts", "Lei de Hick (Complexidade de escolhas)", "Efeito de Von Restorff", "Lei de Jakob"], answer: "Lei de Hick (Complexidade de escolhas)" },
        { id: 13, instruction: "Alvos de Interação.", scenario: "O botão de 'Enviar Resposta' no quiz mobile ficou minúsculo no topo da tela.", text: "Qual lei foca no tamanho e distância do alvo?", options: ["Hick", "Jakob", "Fitts", "Von Restorff"], answer: "Fitts" },
        { id: 14, instruction: "Destaque Visual.", scenario: "Nos posts de Instagram do Xyz, você colocou uma sombra e cor forte na principal 'Dor' do usuário, deixando o resto neutro.", text: "Que efeito é esse?", options: ["Hick", "Fitts", "Von Restorff (elemento diferente é lembrado)", "Jakob"], answer: "Von Restorff (elemento diferente é lembrado)" },
        { id: 15, instruction: "Padrões de Mercado.", scenario: "Seu botão de 'Carrinho' fica no rodapé. Usuários ficam perdidos pois esperam ele no topo direito.", text: "Qual lei explica essa preferência por familiaridade?", options: ["Jakob", "Hick", "Fitts", "Scapin"], answer: "Jakob" },
        { id: 16, instruction: "Fluxo Kanban.", scenario: "Você está criando a 'Proto-Persona' e 'Entrevistando Usuários'.", text: "Em qual coluna do Kanban essas tarefas se encontram?", options: ["Backlog", "Discovery", "Design", "Handoff"], answer: "Discovery" },
        { id: 17, instruction: "Responsividade visual.", scenario: "A interface quebra no mobile. Faltou um esqueleto invisível para alinhar os elementos.", text: "Qual elemento da UI organiza isso?", options: ["Tipografia", "Cores Quentes", "Grids (Grelhas)", "Cards"], answer: "Grids (Grelhas)" },
        { id: 18, instruction: "Benefício da Usabilidade.", scenario: "O sistema de notas da universidade tem uma documentação de 50 páginas para ser compreendido.", text: "Um sistema com boa usabilidade reduziria o erro humano e qual outro fator?", options: ["A curva de aprendizado", "O uso de Auth0", "O tempo de Vercel", "A Viability do negócio"], answer: "A curva de aprendizado" },
        { id: 19, instruction: "Fundação de UX.", scenario: "Antes de codar, você precisa observar os alunos para entender suas motivações.", text: "Qual disciplina abriga essa prática?", options: ["Design Visual", "IxD", "Pesquisa com Usuários", "Estratégia de Conteúdo"], answer: "Pesquisa com Usuários" },
        { id: 20, instruction: "Microinterações.", scenario: "O botão de login muda de estado fluidamente ao ser clicado.", text: "Qual disciplina rege como o sistema reage às ações do usuário?", options: ["Design de Interação (IxD)", "Arquitetura da Informação", "Estética", "User Research"], answer: "Design de Interação (IxD)" },
        { id: 21, instruction: "Usabilidade Objetiva vs UX.", scenario: "O quiz web roda perfeitamente sem erros (eficácia), mas os alunos sentem ansiedade com a interface escura.", text: "Como você avalia?", options: ["Baixa Usabilidade, Boa UX", "Boa Usabilidade, Baixa UX (Sentimento holístico ruim)", "Baixa Eficiência", "Falha no Backlog"], answer: "Boa Usabilidade, Baixa UX (Sentimento holístico ruim)" },
        { id: 22, instruction: "Heurística de Nielsen.", scenario: "Após enviar um form OAuth2, a tela congela em branco sem dar nenhum aviso.", text: "Qual heurística de Nielsen falhou gravemente?", options: ["Reconhecimento", "Consistência", "Liberdade do usuário", "Visibilidade do status do sistema"], answer: "Visibilidade do status do sistema" },
        { id: 23, instruction: "Carga Cognitiva.", scenario: "Um aluno precisa decorar uma URL complexa com hash para acessar a aula privada.", text: "O que a usabilidade ligada à cognição humana indica evitar?", options: ["Feedback imediato", "Modelos mentais", "Minimizar a carga cognitiva (não forçar memorização)", "Flexibilidade"], answer: "Minimizar a carga cognitiva (não forçar memorização)" },
        { id: 24, instruction: "Heurística de Scapin.", scenario: "Ao acessar um artigo de graduação pelo portal, não há botão 'Voltar' ou breadcrumbs.", text: "Qual heurística defende que o usuário deve saber de onde veio e para onde vai?", options: ["Controle explícito", "Orientação", "Carga de trabalho", "Significados dos códigos"], answer: "Orientação" },
        { id: 25, instruction: "Arquitetura no Xyz.", scenario: "As notas do  OneNote precisam de rótulos sustentáveis para facilitar a busca.", text: "Isso é tarefa principal da...", options: ["Estratégia de Conteúdo", "Arquitetura da Informação (AI)", "Usabilidade (UI)", "Lei de Jakob"], answer: "Arquitetura da Informação (AI)" },
        { id: 26, instruction: "Design Responsivo.", scenario: "O ofuscador JS tem um botão de 'Processar' que esconde opções em telas menores.", text: "Que estrutura deveria ter sido pensada para adaptar celulares e desktops?", options: ["Proporção 4.5:1", "Grids (Grelhas)", "Cores análogas", "Entrevista não estruturada"], answer: "Grids (Grelhas)" },
        { id: 27, instruction: "Viability do Negócio.", scenario: "A hospedagem na Vercel e o Auth0 encareceram a manutenção da landing page do curso, zerando o lucro.", text: "Qual esfera do produto na visão 360º de UX foi comprometida?", options: ["Feasibility", "Desirability", "Viability (Objetivos e lucro)", "Acessibilidade"], answer: "Viability (Objetivos e lucro)" },
        { id: 28, instruction: "Prevenção de Erros vs Reconhecimento.", scenario: "Ao invés de mostrar 0 resultados no quiz, o sistema mostra fotos dos módulos estudados recentemente.", text: "Isso facilita o quê?", options: ["Reconhecimento em vez de recordação", "Prevenção de erros fatal", "Consistência", "Design minimalista"], answer: "Reconhecimento em vez de recordação" },
        { id: 29, instruction: "Sessão de Consolidação.", scenario: "Três avaliadores finalizaram a análise individual do painel do professor.", text: "O que ocorre no 'Debriefing'?", options: ["Exportar assets SVG", "Escrever código limpo", "Compartilhar, agrupar e priorizar descobertas", "Testar com 20 alunos"], answer: "Compartilhar, agrupar e priorizar descobertas" },
        { id: 30, instruction: "Scapin: Feedback.", scenario: "O usuário submete um Static Form e a página não confirma o recebimento do contato.", text: "Qual heurística de Scapin e Bastien foi ignorada?", options: ["Feedback", "Carga de trabalho", "Gestão de erros", "Flexibilidade"], answer: "Feedback" },
        { id: 31, instruction: "Mundo Real.", scenario: "A mensagem de erro no quiz diz 'Uncaught TypeError: null'.", text: "Qual heurística de Nielsen pede linguagem familiar ao usuário?", options: ["Prevenção de erros", "Estética e minimalismo", "Correspondência entre o sistema e o mundo real", "Flexibilidade"], answer: "Correspondência entre o sistema e o mundo real" },
        { id: 32, instruction: "Kanban UX.", scenario: "Você está criando o Wireframe da Tela Home do Xyz.", text: "Em qual coluna do fluxo isso fica?", options: ["Backlog", "Design", "Review", "Handoff"], answer: "Design" },
        { id: 33, instruction: "Liberdade de Ação.", scenario: "O professor deleta um aluno sem querer e não consegue desfazer a ação.", text: "Qual heurística de Nielsen garante o 'Ctrl+Z'?", options: ["Visibilidade", "Reconhecimento", "Liberdade e controle do usuário", "Consistência"], answer: "Liberdade e controle do usuário" },
        { id: 34, instruction: "Scapin: Significados.", scenario: "O dashboard tem um ícone de um olho roxo piscando. Ninguém entende o que faz.", text: "Qual regra de Bastien foi quebrada?", options: ["Significados dos códigos e das mensagens", "Controle explícito", "Carga de trabalho", "Feedback"], answer: "Significados dos códigos e das mensagens" },
        { id: 35, instruction: "Entrevista Exploratória.", scenario: "Para entender como alunos usam o  OneNote em casa, você bate um papo solto sem roteiro fixo.", text: "Qual é o nome desse método qualitativo?", options: ["Card Sorting", "Entrevista Semiestruturada", "Entrevista Estruturada", "Entrevista Não Estruturada (Conversa livre)"], answer: "Entrevista Não Estruturada (Conversa livre)" },
        { id: 36, instruction: "Documentação Heurística.", scenario: "Na tabela de problemas de IHC, você listou ID e Problema. O que falta?", options: ["Wireframe, Cores", "Heurística Violada, Prioridade", "Custo, Assinatura", "Código-fonte, Linguagem"], answer: "Heurística Violada, Prioridade" },
        { id: 37, instruction: "Eficiência de Uso.", scenario: "Usuários experientes de programação preferem usar atalhos de teclado no quiz.", text: "Qual heurística atende a essa necessidade?", options: ["Flexibilidade e eficiência de uso", "Design Minimalista", "Visibilidade do status", "Mundo real"], answer: "Flexibilidade e eficiência de uso" },
        { id: 38, instruction: "Design Inclusivo.", scenario: "Seu layout usa apenas vermelho para erros, ignorando homens com daltonismo.", text: "Aproximadamente qual a porcentagem afetada?", options: ["1%", "8%", "0.5%", "15%"], answer: "8%" },
        { id: 39, instruction: "Limites das Heurísticas.", scenario: "O gestor aprovou o projeto só pela avaliação dos especialistas, sem mostrar a alunos.", text: "Por que isso é um erro no fluxo de avaliação?", options: ["A avaliação não documenta prioridades.", "Heurísticas não substituem testes reais com usuários.", "Nielsen não aprova dashboards.", "Faltou debriefing."], answer: "Heurísticas não substituem testes reais com usuários." },
        { id: 40, instruction: "Fisiologia: Cores Frias.", scenario: "O Auth0 usa um painel predominantemente azul para os administradores.", text: "O que o azul transmite fisiologicamente?", options: ["Calma, confiança e segurança", "Urgência e atenção", "Luto no ocidente", "Infidelidade"], answer: "Calma, confiança e segurança" },
        { id: 41, instruction: "Estratégia de Conteúdo.", scenario: "Você planeja que a voz da landing page do Xyz seja formal, mas acolhedora, com PDFs utilizáveis.", text: "Essa governança de texto e mídia pertence a qual área?", options: ["IxD", "Estratégia de Conteúdo", "Pesquisa", "Usabilidade"], answer: "Estratégia de Conteúdo" },
        { id: 42, instruction: "Scapin: Carga de Trabalho.", scenario: "A tela de login exige que o usuário calcule um captcha matemático difícil e demorado.", text: "Qual heurística manda reduzir esforço mental?", options: ["Controle explícito", "Orientação", "Carga de trabalho", "Consistência"], answer: "Carga de trabalho" },
        { id: 43, instruction: "Heurística: Consistência.", scenario: "No app, o botão de 'Salvar' é um disquete numa tela e uma nuvem na outra.", text: "Qual heurística foi desrespeitada?", options: ["Consistência e padrões", "Reconhecimento", "Visibilidade", "Flexibilidade"], answer: "Consistência e padrões" },
        { id: 44, instruction: "Visão 360: Desirability.", scenario: "O portal da graduação é seguro e robusto, mas os alunos o detestam e não querem usá-lo.", text: "Qual pilar essencial falta?", options: ["Feasibility", "Desirability (O que as pessoas realmente querem)", "Viability", "Carga Cognitiva"], answer: "Desirability (O que as pessoas realmente querem)" },
        { id: 45, instruction: "Entrevista Fechada.", scenario: "Você envia um Forms com nota de 1 a 5 sobre o curso. Foco quantitativo puro.", text: "Qual é o tipo de entrevista?", options: ["Não Estruturada", "Semiestruturada", "Estruturada", "User flow"], answer: "Estruturada" },
        { id: 46, instruction: "Hierarquia Tipográfica.", scenario: "Na página, as tags H1 e H2 são do mesmo tamanho que a tag 'p'.", text: "O que a Tipografia diz que os Títulos devem fazer?", options: ["Guiar o olhar e criar hierarquia visual", "Serem maiores que 24px no mobile", "Servir apenas para SEO do Vercel", "Manter grids simétricos"], answer: "Guiar o olhar e criar hierarquia visual" },
        { id: 47, instruction: "Mapa da Empatia: Dores.", scenario: "No perfil do aluno: 'Dificuldade de foco durante as videoaulas longas'.", text: "Onde isso é classificado na Proto-Persona?", options: ["Objetivos", "Dores", "Avatar", "Influências"], answer: "Dores" },
        { id: 48, instruction: "Componentes UX.", scenario: "Sua plataforma é acessível e eficaz, mas não tem credibilidade devido ao design ultrapassado.", text: "Credibilidade é um componente de quê?", options: ["Experiência do Usuário (UX)", "Usabilidade isolada", "Design de Interação (IxD)", "Scapin e Bastien"], answer: "Experiência do Usuário (UX)" },
        { id: 49, instruction: "Scapin: Controle.", scenario: "O vídeo da aula magna começa a rodar o áudio no volume máximo sozinho ao abrir a página.", text: "Qual heurística exige que o usuário inicie as ações?", options: ["Controle explícito", "Carga de trabalho", "Gestão de erros", "Feedback"], answer: "Controle explícito" },
        { id: 50, instruction: "Caminho do Usuário.", scenario: "Você desenha o percurso do aluno desde o clique no e-mail até a submissão do form Staticman.", text: "Como o material chama esse mapeamento?", options: ["Card Sorting", "User Flows", "Wireframes", "Kanban"], answer: "User Flows" },
        { id: 51, instruction: "Diagnóstico de Erros.", scenario: "O sistema indica: 'Erro ao gerar certificado: PDF corrompido. Tente limpar o cache'.", text: "Essa clareza aplica qual heurística de Nielsen?", options: ["Ajude a reconhecer, diagnosticar e recuperar erros", "Liberdade e controle", "Design minimalista", "Prevenção de erros"], answer: "Ajude a reconhecer, diagnosticar e recuperar erros" },
        { id: 52, instruction: "Atenção Limitada.", scenario: "A página do quiz tem 4 banners brilhantes, 6 cores e 3 fontes no cabeçalho.", text: "Qual heurística evita informações irrelevantes?", options: ["Estética e design minimalista", "Visibilidade do status", "Carga de trabalho", "Reconhecimento"], answer: "Estética e design minimalista" },
        { id: 53, instruction: "Acessibilidade de Contraste.", scenario: "Para passar na WCAG 2.1 e melhorar a usabilidade de pessoas com baixa visão, o texto do       Xyz foi escurecido.", text: "Isso cumpre qual estratégia?", options: ["Estratégia 1: Alta taxa de contraste (4.5:1)", "Estratégia 2: Não depender só de cor", "Harmonia análoga", "Efeito Von Restorff"], answer: "Estratégia 1: Alta taxa de contraste (4.5:1)" },
        { id: 54, instruction: "Planejamento da Avaliação.", scenario: "Apenas um dev backend vai fazer a avaliação heurística da landing page para economizar tempo.", text: "O que o processo ideal recomenda?", options: ["Apenas 1 dev", "100 usuários", "Selecionar 3 a 5 avaliadores especialistas em UX", "Usar Proto-Personas"], answer: "Selecionar 3 a 5 avaliadores especialistas em UX" },
        { id: 55, instruction: "Kanban UX Handoff.", scenario: "O design do app está pronto e os SVGs foram exportados para os devs.", text: "Isso ocorre em qual fase do fluxo?", options: ["Discovery", "Design", "Review", "Handoff (Exportar Assets SVG)"], answer: "Handoff (Exportar Assets SVG)" },
        { id: 56, instruction: "Validação de Hipóteses.", scenario: "A Proto-Persona de um 'Professor de Graduação' foi desenhada baseada no 'achismo' da equipe de vendas.", text: "O que diz o material sobre suposições da equipe?", options: ["Devem ser validadas posteriormente em pesquisa", "São verdades absolutas", "Substituem mapas da empatia", "Devem ser ignoradas na Viability"], answer: "Devem ser validadas posteriormente em pesquisa" },
        { id: 57, instruction: "Mapa da Empatia: Pensamentos.", scenario: "O aluno confessa na entrevista: 'Tenho medo de reprovar em programação e decepcionar a família'.", text: "Onde isso é mapeado?", options: ["Ouve", "Pensa e Sente (Preocupações)", "Fala e Faz", "Vê"], answer: "Pensa e Sente (Preocupações)" },
        { id: 58, instruction: "Scapin: Flexibilidade.", scenario: "O editor de JS do aluno pode mudar do tema Claro para o Escuro, se adaptando ao gosto dele.", text: "Qual heurística de Scapin atende a adaptação?", options: ["Flexibilidade", "Carga de Trabalho", "Feedback", "Significados"], answer: "Flexibilidade" },
        { id: 59, instruction: "Planejamento Heurístico.", scenario: "Antes da análise, os especialistas recebem a missão: 'Testar redefinição de senha'.", text: "O que foi definido nessa etapa 1?", options: ["Prioridade", "As tarefas que serão avaliadas", "Debriefing", "Relatório final"], answer: "As tarefas que serão avaliadas" },
        { id: 60, instruction: "Cognição e Modelos Mentais.", scenario: "Para o botão de deletar o Software xyz, foi usado o ícone de uma Lixeira padrão.", text: "Por que isso é eficaz?", options: ["Previne daltonismo", "O usuário já espera que funcione baseando-se no mundo real (modelos mentais)", "Cria viabilidade técnica", "Atende ao Efeito Restorff"], answer: "O usuário já espera que funcione baseando-se no mundo real (modelos mentais)" },
        { id: 61, instruction: "Gestão do Backlog.", scenario: "A equipe decide implementar um modo escuro (Dark Mode) na Vercel no próximo sprint.", text: "Onde essa 'Nova Feature' entra inicialmente no Kanban?", options: ["Review", "Handoff", "Discovery", "Backlog"], answer: "Backlog" },
        { id: 62, instruction: "Memorização vs Usabilidade.", scenario: "Os professores só geram relatórios 2 vezes ao ano e sempre esquecem como faz, precisando do manual.", text: "Qual métrica objetiva de usabilidade está falhando?", options: ["Aprendizado e memorização", "Emoção", "Eficiência visual", "Taxa de contraste"], answer: "Aprendizado e memorização" },
        { id: 63, instruction: "Ação Indesejada.", scenario: "Você clica em um anúncio no site e ele abre, sem permitir fechar, forçando o refresh.", text: "Qual heurística de liberdade foi ignorada?", options: ["Visibilidade", "Reconhecimento", "Liberdade e controle (Sair de ações)", "Estética minimalista"], answer: "Liberdade e controle (Sair de ações)" },
        { id: 64, instruction: "Nielsen: Prevenção.", scenario: "No Static Form, o campo 'Telefone' ignora caracteres alfa, impedindo o usuário de digitar letras.", text: "Isso é um bom exemplo de qual heurística?", options: ["Prevenção de erros", "Visibilidade", "Recuperação", "Consistência"], answer: "Prevenção de erros" },
        { id: 65, instruction: "Nielsen: Consistência.", scenario: "Na plataforma de aulas, os ícones de 'Próxima Aula' são setas vermelhas, e no quiz, são bolinhas azuis.", text: "Qual princípio foi esquecido?", options: ["Flexibilidade", "Estética", "Consistência e padrões", "Prevenção"], answer: "Consistência e padrões" },
        { id: 66, instruction: "Scapin: Orientação.", scenario: "No app, o aluno de graduação clica em 4 links sucessivos e fica sem saber onde está no site.", text: "A falta de indicação de 'onde estou' fere qual heurística de Bastien?", options: ["Carga de trabalho", "Controle explícito", "Orientação", "Feedback"], answer: "Orientação" },
        { id: 67, instruction: "Hick e Abandono.", scenario: "Na página de login do Auth0, há opções para logar com 15 redes sociais diferentes. Os usuários ficam paralisados.", text: "Qual lei explica esse atraso na decisão?", options: ["Hick", "Fitts", "Jakob", "Restorff"], answer: "Hick" },
        { id: 68, instruction: "Aceleradores.", scenario: "O ofuscador de JS permite arrastar e soltar (drag & drop) ao invés de procurar o arquivo em pastas.", text: "Isso se traduz em qual heurística de Nielsen?", options: ["Design Minimalista", "Mundo Real", "Visibilidade do Sistema", "Flexibilidade e eficiência de uso"], answer: "Flexibilidade e eficiência de uso" },
        { id: 69, instruction: "Pesquisa Avaliativa.", scenario: "Você exibe seu Wireframe Lo-Fi a 3 professores e pede que eles pensem em voz alta enquanto navegam.", text: "Isso substitui as Heurísticas?", options: ["Sim", "Não, elas são complementares", "Sim, se for Kanban", "Não, heurísticas são para backend"], answer: "Não, elas são complementares" },
        { id: 70, instruction: "Fisiologia Cores Quentes.", scenario: "Um pop-up de 'Aviso Crítico' no sistema é laranja vibrante.", text: "O que isso induz no usuário?", options: ["Confiança e paz", "Acelera batimentos e transmite urgência", "Traz purificação cultural", "Fere o Grid CSS"], answer: "Acelera batimentos e transmite urgência" },
        { id: 71, instruction: "Daltonismo Inclusivo.", scenario: "Você desenha o estado de hover de um botão do Xyz apenas mudando de vermelho para verde escuro.", text: "Quem será mais prejudicado?", options: ["8% dos homens (Daltonismo)", "0.5% dos homens", "15% das mulheres", "Ninguém"], answer: "8% dos homens (Daltonismo)" },
        { id: 72, instruction: "Mundo Real vs Sistema.", scenario: "O log da Vercel no front-end mostra 'Error 502 Bad Gateway'.", text: "O que a heurística Correspondência do Mundo Real diria?", options: ["Aumentar o H1", "Mudar para azul", "A linguagem deveria ser familiar ao usuário, não código de servidor", "Adicionar Ctrl+Z"], answer: "A linguagem deveria ser familiar ao usuário, não código de servidor" },
        { id: 73, instruction: "Viability UX.", scenario: "O app é fácil de usar e desejado pelos alunos, mas os servidores são mais caros que as mensalidades.", text: "Qual pilar 360º de UX falhou miseravelmente?", options: ["Viability (Objetivos de Negócio/Lucro)", "Feasibility", "Desirability", "Carga Cognitiva"], answer: "Viability (Objetivos de Negócio/Lucro)" },
        { id: 74, instruction: "Usabilidade Subjetiva.", scenario: "A diretora pergunta a diferença prática entre as métricas. Como você resume?", options: ["Usabilidade é objetiva (completar tarefas); UX é holística e subjetiva (emoções).", "Ambas são idênticas.", "Usabilidade foca na estética.", "UX é só código limpo."], answer: "Usabilidade é objetiva (completar tarefas); UX é holística e subjetiva (emoções)." },
        { id: 75, instruction: "Pesquisa de Fluxos.", scenario: "Você mapeia o 'Checkout' do seu curso desde clicar no anúncio até a tela de cartão de crédito.", text: "Esse mapeamento é tecnicamente chamado de?", options: ["User Flows", "Card Sorting", "Mapas da Empatia", "Handoff"], answer: "User Flows" },
        { id: 76, instruction: "Proto-persona Válida.", scenario: "Para a página do quiz de programação, você traçou que o usuário é ansioso por notas.", text: "A Proto-persona é o resultado final da pesquisa?", options: ["Sim, não precisa testar.", "Não, é uma versão preliminar que deve ser validada.", "Sim, se for feita em Figma.", "Apenas se for feita por devs."], answer: "Não, é uma versão preliminar que deve ser validada." },
        { id: 77, instruction: "Carga de Memória.", scenario: "Em vez de pedir o nome da universidade do professor de graduação, o sistema sugere opções baseadas no CEP.", text: "Qual conceito está em jogo?", options: ["Permitir o reconhecimento, não a recordação", "Estética visual", "Significado dos códigos", "Cor análoga"], answer: "Permitir o reconhecimento, não a recordação" },
        { id: 78, instruction: "Heurística de Scapin: Gestão de Erros.", scenario: "Quando o form não é enviado, a mensagem diz apenas 'Falha'.", text: "O que a gestão de erros recomenda?", options: ["Deletar o campo", "Ajudar a prevenir, detectar e corrigir erros", "Aumentar a fonte para 16px", "Usar a Lei de Fitts"], answer: "Ajudar a prevenir, detectar e corrigir erros" },
        { id: 79, instruction: "Significados Culturais: Luto.", scenario: "O design do Xyz para o mercado asiático abusa da cor branca para transmitir pureza.", text: "O que o material alerta sobre o branco na Ásia?", options: ["Transmite urgência", "É a cor do luto na Ásia", "Significa sucesso", "Significa infidelidade"], answer: "É a cor do luto na Ásia" },
        { id: 80, instruction: "Hierarquia e Tamanho.", scenario: "O parágrafo de introdução do quiz está com tamanho 10px em monitores 4k.", text: "O mínimo exigido para o corpo de texto na web é:", options: ["10px", "12px", "14px", "16px"], answer: "16px" },
        { id: 81, instruction: "Heurística: Reconhecer e Diagnosticar.", scenario: "Um usuário digita o e-mail no OAuth2 e a tela mostra 'Usuário não encontrado. Verifique a ortografia ou crie conta'.", text: "Essa aplicação atende a qual regra?", options: ["Ajude a diagnosticar erros", "Lei de Hick", "Flexibilidade", "Carga de trabalho"], answer: "Ajude a diagnosticar erros" },
        { id: 82, instruction: "Kanban: Fases.", scenario: "O teste de usabilidade final do quiz de programação com 5 alunos começou hoje.", text: "Qual coluna Kanban engloba esse tipo de validação prática?", options: ["Backlog", "Discovery", "Design", "Review (Teste de Usabilidade)"], answer: "Review (Teste de Usabilidade)" },
        { id: 83, instruction: "Significado do Laranja.", scenario: "Para um banner promocional do curso, usou-se laranja e vermelho vibrantes.", text: "A resposta fisiológica e emocional esperada inclui:", options: ["Urgência e atenção", "Paz profunda", "Reflexão analítica", "Fadiga zero"], answer: "Urgência e atenção" },
        { id: 84, instruction: "Design Inclusivo Prático.", scenario: "O ofuscador de JS aponta erros de sintaxe apenas colorindo a linha de vermelho. Sem sublinhado, sem ícone.", text: "Qual regra isso quebra frontalmente?", options: ["Nunca depender só da cor", "Uso de cores complementares", "Lei de Jakob", "Estética Minimalista"], answer: "Nunca depender só da cor" },
        { id: 85, instruction: "Correspondência: Jargões.", scenario: "O Xyz avisa: 'Node cluster rebooting'. O usuário acha que é vírus.", text: "A Correspondência com o mundo real (Heurística) exige:", options: ["Mensagens em caixa alta", "Linguagem familiar ao usuário", "Links para a Wikipedia", "Cores análogas no alerta"], answer: "Linguagem familiar ao usuário" },
        { id: 86, instruction: "Visão 360: Equilíbrio.", scenario: "Um bom profissional de UX transita entre 3 esferas garantindo que a solução seja bonita, viável tecnicamente e...", text: "Qual o terceiro ponto do equilíbrio de Produto?", options: ["Feita em React", "Lucrativa (Viável pro negócio)", "Escrita com 12px", "Baseada em modelos lógicos"], answer: "Lucrativa (Viável pro negócio)" },
        { id: 87, instruction: "UX Holística.", scenario: "As requisições do Vercel e Auth0 respondem em 100ms. A usabilidade é incrível, mas a marca tem reputação de vazar dados (baixa credibilidade).", text: "Logo, a Experiência do Usuário (UX) como um todo é:", options: ["Excelente", "Irrelevante", "Comprometida (pois abrange valor e emoções)", "Matemática e pura"], answer: "Comprometida (pois abrange valor e emoções)" },
        { id: 88, instruction: "Estratégia IxD.", scenario: "O preenchimento de formulário no Static Forms flui com transições lógicas e suaves.", text: "O design focado na reação do sistema à ação do usuário chama-se:", options: ["Design de Interação (IxD)", "Arquitetura Visual", "Estratégia de Banco de Dados", "Card Sorting"], answer: "Design de Interação (IxD)" },
        { id: 89, instruction: "Pesquisa Colaborativa.", scenario: "Antes de ir ao campo, os devs da plataforma de ensino e os designers escrevem num papel suas visões do aluno.", text: "Isso define uma...", options: ["Avaliação Final", "Proto-Persona", "Entrevista Estruturada", "Heurística"], answer: "Proto-Persona" },
        { id: 90, instruction: "Entrevista sem Roteiro.", scenario: "Bate-papo informal com professores de graduação para colher histórias.", text: "O foco na descoberta e narrativa livre define a:", options: ["Sessão de Consolidação", "Entrevista Não Estruturada", "Teste de Viabilidade", "Verificação Heurística"], answer: "Entrevista Não Estruturada" },
        { id: 91, instruction: "Reunião de Avaliação.", scenario: "A plataforma Xyz será avaliada usando o checklist de Nielsen.", text: "Quem conduz idealmente o passo de análise individual?", options: ["Um grupo de 3 a 5 avaliadores especialistas", "O próprio desenvolvedor junior", "O dono do negócio", "Qualquer pessoa leiga"], answer: "Um grupo de 3 a 5 avaliadores especialistas" },
        { id: 92, instruction: "Relatório de IHC.", scenario: "O debriefing terminou. A equipe de UX vai apresentar os resultados aos programadores.", text: "O Documento final deve conter problemas, heurística violada, melhorias e...", options: ["A foto dos devs", "Prioridade (gravidade)", "Código CSS pronto", "O valor do servidor na Vercel"], answer: "Prioridade (gravidade)" },
        { id: 93, instruction: "Heurística Preventiva.", scenario: "O botão 'Excluir Turma' pede para o usuário digitar o nome da turma para confirmar.", text: "Qual regra obriga desenhar o sistema para evitar erros fatais antes que ocorram?", options: ["Prevenção de erros", "Visibilidade do status", "Mundo Real", "Significado dos códigos"], answer: "Prevenção de erros" },
        { id: 94, instruction: "Scapin: Esforço Físico.", scenario: "O form do quiz de 20 questões não tem tabulação correta, obrigando a usar o mouse toda hora.", text: "Qual princípio defende reduzir o esforço físico do usuário?", options: ["Carga de trabalho", "Consistência e Padrão", "Efeito Von Restorff", "Handoff Visual"], answer: "Carga de trabalho" },
        { id: 95, instruction: "Scapin: Navegação.", scenario: "A ferramenta de ofuscação de JS esconde a aba em que o usuário está trabalhando no momento.", text: "O usuário que não sabe onde está é vítima de má aplicação de:", options: ["Orientação", "Liberdade e Controle", "Contraste", "Estratégia de Conteúdo"], answer: "Orientação" },
        { id: 96, instruction: "Fitts vs Botões.", scenario: "Os botões de redes sociais do Auth0 são minúsculos e distantes do campo de email.", text: "Pela Lei de Fitts, isso resultará em:", options: ["Maior tempo para atingir o alvo e mais erros de clique", "Aumento da Viability", "Melhora no Grid invisível", "Cores análogas em ação"], answer: "Maior tempo para atingir o alvo e mais erros de clique" },
        { id: 97, instruction: "Familiaridade Jakob.", scenario: "O link sublinhado e em azul no texto acadêmico converte 2x mais que um link vermelho sem sublinhado.", text: "Por que os usuários preferem padrões estabelecidos?", options: ["Lei de Jakob (funciona como eles já conhecem)", "Lei de Hick (são menos opções)", "Lei de Fitts (é mais perto)", "Kanban"], answer: "Lei de Jakob (funciona como eles já conhecem)" },
        { id: 98, instruction: "Hick e Abandono 2.", scenario: "Os professores têm que escolher entre 50 filtros para achar uma aula gravada. Eles desistem.", text: "O tempo de decisão aumentou por excesso de escolha. Qual a Lei?", options: ["Hick", "Jakob", "Nielsen", "Carga Estética"], answer: "Hick" },
        { id: 99, instruction: "Contraste e Memória.", scenario: "Apenas o módulo de 'Integração Auth0' tem uma estrela dourada, o resto é cinza.", text: "O elemento diferente é lembrado por causa do:", options: ["Efeito de Von Restorff", "Princípio de Pareto", "Daltonismo reverso", "Grid Responsivo"], answer: "Efeito de Von Restorff" },
        { id: 100, instruction: "Limitações Práticas.", scenario: "Os 5 especialistas não acharam nenhum problema na avaliação heurística do Xyz. O produto é à prova de falhas?", text: "A teoria de IHC garante que heurísticas...", options: ["Substituem o usuário final.", "Não substituem testes com usuários, são apenas um filtro inicial.", "Validam automaticamente o Auth0.", "São provas matemáticas objetivas."], answer: "Não substituem testes com usuários, são apenas um filtro inicial." }
      ]
    }
  },
  computed: {
    currentQuestion() { return this.questions[this.currentQuestionIndex]; }
  },
  mounted() {
    this.addLog("Inicializando Simulador UX_360_v1.0 (PRO)...", "log-info");
    setTimeout(() => { this.loadQuestion(); }, 1000);
  },
  methods: {
    selectOption(option) {
      if (this.showAnswer || this.gameOver || this.isTyping) return;
      this.userSelection = option;

      if (option === this.currentQuestion.answer) {
        this.score++;
        this.feedbackType = "success";
        this.feedbackMsg = "Decisão Correta! Projeto validado e UX otimizada.";
        this.addLog("Sucesso: Decisão metodológica acatada pelo comitê.", "log-success");
        this.showAnswer = true;
        setTimeout(this.nextQuestion, 2500);
      } else {
        this.attempts++;
        if (this.attempts >= 3) {
          this.feedbackType = "error";
          this.feedbackMsg = `Tentativas esgotadas. A resposta correta baseada no material era: ${this.currentQuestion.answer}`;
          this.addLog("Falha Crítica de UX: Abandono de carrinho detectado nos logs.", "log-error");
          this.showAnswer = true;
          setTimeout(this.nextQuestion, 4500);
        } else {
          this.feedbackType = "warning";
          this.feedbackMsg = `Decisão Incorreta. Tente reavaliar a teoria. Tentativas restantes: ${3 - this.attempts}`;
          this.addLog(`Aviso: O usuário ficou frustrado e contestou a interface. Tentativa ${this.attempts}/3`, "log-error");
        }
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.resetTurn();
        this.loadQuestion();
      } else {
        this.finishGame();
      }
    },
    resetTurn() {
      this.userSelection = null; this.attempts = 0; this.showAnswer = false; this.feedbackMsg = ""; this.feedbackType = "";
    },
    async loadQuestion() {
      this.isTyping = true;
      await this.typeWriter(`Carregando Cenário Aplicado ${this.currentQuestion.id}...`, "log-info");
      await this.typeWriter(this.currentQuestion.scenario, "log-default");
      this.isTyping = false;
    },
    finishGame() {
      this.gameOver = true;
      this.addLog("Simulação concluída. Processando métricas de performance para exportação PDF...", "log-info");
    },
    addLog(text, type = "log-default") {
      this.logs.push({ text, type });
      this.scrollToBottom();
    },
    typeWriter(text, type) {
      return new Promise(resolve => {
        this.logs.push({ text: "", type });
        let currentLogIndex = this.logs.length - 1; let i = 0;
        const interval = setInterval(() => {
          this.logs[currentLogIndex].text += text.charAt(i);
          this.scrollToBottom(); i++;
          if (i === text.length) { clearInterval(interval); resolve(); }
        }, 15);
      });
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const terminal = this.$refs.terminalBody;
        if (terminal) { terminal.scrollTop = terminal.scrollHeight; }
      });
    },
    saveResultPDF() {
      const data = new Date().toLocaleString();
      const printElement = document.createElement('div');
      printElement.style.padding = '40px'; printElement.style.fontFamily = 'Arial, sans-serif'; printElement.style.color = '#333';
      
      let performanceMsg = "Sólida base em Ecossistema UX e Heurísticas.";
      if (this.score < 50) performanceMsg = "Recomenda-se revisão aprofundada das Leis de UX e Heurísticas.";
      
      printElement.innerHTML = `
        <div style="text-align: center; border-bottom: 2px solid #9c6bd4; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #9c6bd4; margin: 0;">Relatório de Avaliação Heurística e UX</h1>
            <h2 style="color: #555; margin: 5px 0;">Certificação: Ecossistema de Design 360º</h2>
        </div>
        <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
            <p><strong>Data da Simulação:</strong> ${data}</p>
            <p><strong>Avaliado por:</strong> Líder de Produto UX</p>
            <p>Este documento atesta a passagem do profissional pelas 100 análises críticas em cenários envolvendo wireframes, card sorting, acessibilidade visual, heurísticas de Nielsen e Bastien, e estruturação de projetos front-end.</p>
            
            <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                <h3 style="margin-top: 0; color: #333;">Desempenho Final</h3>
                <p style="font-size: 28px; color: ${this.score >= 70 ? '#5eb177' : (this.score >= 50 ? '#d9a05b' : '#ff5555')}; margin: 15px 0;">
                    <strong>${this.score} de ${this.questions.length} Acertos</strong>
                </p>
                <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
            </div>
        </div>
        <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
            Documento validado tecnicamente pelo Simulador UX.ESCAPE
        </p>
      `;

      const opt = {
        margin:       0.5,
        filename:     'UX_Certificacao_Desempenho.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(printElement).save();
    },
    resetGame() {
      this.currentQuestionIndex = 0; this.score = 0; this.logs = []; this.gameOver = false;
      this.resetTurn();
      this.addLog("Reconfigurando parâmetros do simulador de UX...", "log-info");
      setTimeout(() => this.loadQuestion(), 1000);
    }
  }
}).mount('#app');