const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        // --- Estado ---
        const currentLevelIndex = ref(0);
        const userLines = ref([]); 
        const isChecked = ref(false); 
        const isLevelCorrect = ref(false);
        const userHistory = ref([]); 
        const gameFinished = ref(false);
        
        // Estado para controle do Drag and Drop
        const draggingIndex = ref(null);
        const dragOverIndex = ref(null);

        // --- BANCO DE DADOS DE CENÁRIOS REAIS ---
        const allLevels = [
            // --- BÁSICO / INTRODUÇÃO ---
            {
                id: 1,
                feature: "Funcionalidade: Login",
                scenarioName: "Cenário: Usuário loga com credenciais válidas",
                correctOrder: [
                    "Given que estou na página de login",
                    "When eu insiro credenciais válidas",
                    "And clico no botão entrar",
                    "Then devo ser redirecionado para o dashboard",
                    "And devo ver a mensagem 'Bem-vindo'"
                ]
            },
            {
                id: 2,
                feature: "Funcionalidade: Carrinho de Compras",
                scenarioName: "Cenário: Adicionar primeiro item ao carrinho",
                correctOrder: [
                    "Given que meu carrinho está vazio",
                    "And estou na página do produto 'Mouse Gamer'",
                    "When eu clico em 'Adicionar ao Carrinho'",
                    "Then o ícone do carrinho deve exibir 1 item",
                    "And o valor total do carrinho deve ser atualizado"
                ]
            },
             {
                id: 3,
                feature: "Funcionalidade: Cadastro de Usuário",
                scenarioName: "Cenário: Tentativa de cadastro com senha fraca",
                correctOrder: [
                    "Given que estou no formulário de cadastro",
                    "When eu preencho o campo senha com '123'",
                    "And confirmo o envio do formulário",
                    "Then o sistema deve exibir um erro de validação",
                    "And o cadastro não deve ser persistido no banco"
                ]
            },
            {
                id: 4,
                feature: "Funcionalidade: Busca de Produtos",
                scenarioName: "Cenário: Busca sem resultados",
                correctOrder: [
                    "Given que estou na página inicial do e-commerce",
                    "When pesquiso por 'produto_inexistente_xyz'",
                    "Then a lista de resultados deve retornar vazia",
                    "And devo ver a mensagem 'Nenhum item encontrado'"
                ]
            },
            {
                id: 5,
                feature: "Funcionalidade: API Rest - Usuários",
                scenarioName: "Cenário: GET retorna detalhes de um usuário",
                correctOrder: [
                    "Given que o banco de dados possui o usuário ID 42",
                    "When faço uma requisição GET para '/api/users/42'",
                    "Then o status code da resposta deve ser 200",
                    "And o corpo da resposta deve conter o JSON do usuário"
                ]
            },
            
            // --- INTERMEDIÁRIO / FLUXOS DE NEGÓCIO ---
            {
                id: 6,
                feature: "Funcionalidade: Checkout de Pagamento",
                scenarioName: "Cenário: Pagamento com cartão de crédito expirado",
                correctOrder: [
                    "Given que tenho itens no carrinho de compras",
                    "And avanço para a etapa de pagamento",
                    "When insiro dados de um cartão com data de validade passada",
                    "Then a transação deve ser recusada pela adquirente",
                    "And devo ver a mensagem 'Cartão Expirado ou Inválido'"
                ]
            },
            {
                id: 7,
                feature: "Funcionalidade: Blog / Comentários",
                scenarioName: "Cenário: Usuário publica um comentário em um post",
                correctOrder: [
                    "Given que estou logado na plataforma do blog",
                    "When escrevo um comentário no campo de texto",
                    "And clico no botão 'Publicar'",
                    "Then meu comentário deve aparecer imediatamente na lista",
                    "And o contador de comentários do post deve incrementar"
                ]
            },
            {
                id: 8,
                feature: "Funcionalidade: Filtros de Listagem",
                scenarioName: "Cenário: Filtrar produtos por faixa de preço",
                correctOrder: [
                    "Given que estou visualizando a categoria 'Eletrônicos'",
                    "When seleciono o filtro de preço 'Até R$100,00'",
                    "Then a listagem deve atualizar via AJAX",
                    "And apenas produtos com valor inferior a R$100 devem ser exibidos"
                ]
            },
            {
                id: 9,
                feature: "Funcionalidade: Recuperação de Senha",
                scenarioName: "Cenário: Solicitação com e-mail não cadastrado",
                correctOrder: [
                    "Given que acesso a página 'Esqueci minha senha'",
                    "When digito um e-mail que não existe na base",
                    "Then devo ver uma mensagem genérica de sucesso por segurança",
                    "But nenhum e-mail com token de recuperação é disparado"
                ]
            },
            {
                id: 10,
                feature: "Funcionalidade: Upload de Arquivos",
                scenarioName: "Cenário: Upload de arquivo excedendo o limite",
                correctOrder: [
                    "Given que o limite máximo de upload é configurado para 5MB",
                    "When tento fazer upload de uma imagem de 10MB",
                    "Then o processo de upload deve ser interrompido",
                    "And um alerta 'Arquivo excede o tamanho permitido' é exibido"
                ]
            },

            // --- NÍVEIS 11 A 20: REDES SOCIAIS E STREAMING ---
            {
                id: 11,
                feature: "Funcionalidade: Feed de Notícias",
                scenarioName: "Cenário: Carregar mais posts ao rolar a página (Infinite Scroll)",
                correctOrder: [
                    "Given que estou logado e visualizando meu feed",
                    "And existem mais posts antigos no banco de dados",
                    "When eu rolo a página até o final (bottom)",
                    "Then uma animação de 'loading' deve aparecer",
                    "And novos posts devem ser anexados ao final da lista"
                ]
            },
            {
                id: 12,
                feature: "Funcionalidade: Player de Vídeo",
                scenarioName: "Cenário: Ajuste automático de qualidade (Bitrate)",
                correctOrder: [
                    "Given que estou assistindo um vídeo em 4K",
                    "When a velocidade da minha conexão cai drasticamente",
                    "Then o player deve baixar a resolução para 720p ou 480p",
                    "And a reprodução deve continuar sem travar (buffering)"
                ]
            },
            {
                id: 13,
                feature: "Funcionalidade: Autenticação de Dois Fatores (2FA)",
                scenarioName: "Cenário: Código SMS inválido",
                correctOrder: [
                    "Given que inseri login e senha corretos",
                    "And fui redirecionado para a tela de verificação 2FA",
                    "When insiro um código de 6 dígitos incorreto",
                    "Then o acesso ao sistema deve permanecer bloqueado",
                    "And devo ver a mensagem 'Código de verificação inválido'"
                ]
            },
            {
                id: 14,
                feature: "Funcionalidade: Chat em Tempo Real",
                scenarioName: "Cenário: Recebimento de mensagem",
                correctOrder: [
                    "Given que estou com a janela de chat aberta com 'Usuário B'",
                    "When 'Usuário B' envia uma mensagem para mim",
                    "Then a nova mensagem deve aparecer no fim da conversa",
                    "And se a janela não estiver focada, devo receber uma notificação sonora"
                ]
            },
            {
                id: 15,
                feature: "Funcionalidade: Stories (Instagram/WhatsApp)",
                scenarioName: "Cenário: Story expira após 24 horas",
                correctOrder: [
                    "Given que publiquei um story ontem às 10:00 AM",
                    "When o relógio do servidor marca hoje 10:01 AM",
                    "Then o story não deve mais estar visível para meus seguidores",
                    "And o story deve ser movido para o meu arquivo pessoal"
                ]
            },
            {
                id: 16,
                feature: "Funcionalidade: Edição de Perfil",
                scenarioName: "Cenário: Alterar foto de perfil",
                correctOrder: [
                    "Given que estou na tela de configurações de conta",
                    "When faço upload de uma nova imagem JPG válida",
                    "And clico em 'Salvar Alterações'",
                    "Then a miniatura da foto no header deve atualizar",
                    "And uma mensagem de sucesso deve ser exibida"
                ]
            },
            {
                id: 17,
                feature: "Funcionalidade: Bloqueio de Usuário",
                scenarioName: "Cenário: Impedir interação de usuário bloqueado",
                correctOrder: [
                    "Given que bloqueiei o usuário 'Spammer_01'",
                    "When 'Spammer_01' tenta me enviar uma mensagem direta",
                    "Then a mensagem não deve ser entregue a mim",
                    "And o remetente deve ver um erro 'Você não pode enviar mensagens para este usuário'"
                ]
            },
            {
                id: 18,
                feature: "Funcionalidade: Playlist de Música",
                scenarioName: "Cenário: Remover música da playlist",
                correctOrder: [
                    "Given que tenho uma playlist com 5 músicas",
                    "When clico no ícone de lixeira na música 3",
                    "And confirmo a exclusão no modal",
                    "Then a playlist deve passar a ter 4 músicas",
                    "And a música removida não deve ser reproduzida na fila"
                ]
            },
            {
                id: 19,
                feature: "Funcionalidade: Notificações Push",
                scenarioName: "Cenário: Opt-out de notificações de marketing",
                correctOrder: [
                    "Given que recebo notificações de promoções no app",
                    "When acesso configurações e desmarco 'Receber ofertas'",
                    "Then a preferência deve ser salva no backend",
                    "And não devo mais receber push notifications promocionais"
                ]
            },
            {
                id: 20,
                feature: "Funcionalidade: Lives (Transmissão ao Vivo)",
                scenarioName: "Cenário: Espectador entra na live",
                correctOrder: [
                    "Given que o 'Streamer X' está transmitindo ao vivo",
                    "When eu clico na notificação da live",
                    "Then o vídeo deve começar a reproduzir sincronizado",
                    "And eu devo aparecer na contagem de 'espectadores atuais'"
                ]
            },

            // --- NÍVEIS 21 A 30: FINTECH E BANCOS ---
            {
                id: 21,
                feature: "Funcionalidade: Transferência PIX",
                scenarioName: "Cenário: Saldo insuficiente",
                correctOrder: [
                    "Given que tenho R$ 50,00 na conta",
                    "When tento fazer um PIX de R$ 100,00",
                    "Then o aplicativo deve impedir a transação",
                    "And deve exibir a mensagem 'Saldo insuficiente'"
                ]
            },
            {
                id: 22,
                feature: "Funcionalidade: Extrato Bancário",
                scenarioName: "Cenário: Filtrar lançamentos por período",
                correctOrder: [
                    "Given que estou na tela de extrato",
                    "When seleciono o período 'Últimos 7 dias'",
                    "Then apenas as transações dessa semana são exibidas",
                    "And o saldo parcial do período é calculado"
                ]
            },
            {
                id: 23,
                feature: "Funcionalidade: Cartão Virtual",
                scenarioName: "Cenário: Gerar cartão temporário",
                correctOrder: [
                    "Given que tenho um cartão físico ativo",
                    "When solicito a criação de um cartão virtual no app",
                    "Then um novo número, CVV e validade são gerados",
                    "And o cartão virtual fica ativo para compras online imediatamente"
                ]
            },
            {
                id: 24,
                feature: "Funcionalidade: Investimentos",
                scenarioName: "Cenário: Resgate de aplicação com liquidez diária",
                correctOrder: [
                    "Given que tenho dinheiro aplicado no CDB",
                    "When solicito o resgate total para minha conta corrente",
                    "Then o valor deve ser creditado na conta corrente",
                    "And o saldo do investimento deve zerar"
                ]
            },
            {
                id: 25,
                feature: "Funcionalidade: Pagamento de Boleto",
                scenarioName: "Cenário: Leitura de código de barras",
                correctOrder: [
                    "Given que abri a câmera pelo app do banco",
                    "When aponto a câmera para um código de barras válido",
                    "Then o app deve reconhecer o código e preencher os dados",
                    "And deve mostrar o beneficiário e o valor para confirmação"
                ]
            },
            {
                id: 26,
                feature: "Funcionalidade: Limite do Cartão",
                scenarioName: "Cenário: Ajuste de limite pelo usuário",
                correctOrder: [
                    "Given que meu limite aprovado é R$ 5.000",
                    "But meu limite ajustado atual é R$ 1.000",
                    "When movo a barra de ajuste para R$ 2.000",
                    "Then o novo limite disponível para compras passa a ser R$ 2.000"
                ]
            },
            {
                id: 27,
                feature: "Funcionalidade: Recarga de Celular",
                scenarioName: "Cenário: Recarga bem sucedida",
                correctOrder: [
                    "Given que informei o número e a operadora",
                    "When confirmo o valor da recarga com minha senha",
                    "Then o valor é debitado da minha conta",
                    "And recebo o comprovante da transação"
                ]
            },
            {
                id: 28,
                feature: "Funcionalidade: Bloqueio de Cartão",
                scenarioName: "Cenário: Bloqueio temporário por segurança",
                correctOrder: [
                    "Given que meu cartão está ativo",
                    "When clico na opção 'Bloquear Cartão' no app",
                    "Then o status do cartão muda para 'Bloqueado'",
                    "And qualquer tentativa de compra física deve ser negada"
                ]
            },
            {
                id: 29,
                feature: "Funcionalidade: Poupança Automática",
                scenarioName: "Cenário: Guardar troco",
                correctOrder: [
                    "Given que ativei a função 'Guardar Troco'",
                    "When faço uma compra de R$ 19,90 no débito",
                    "Then o sistema arredonda para R$ 20,00",
                    "And transfere R$ 0,10 para minha conta poupança"
                ]
            },
            {
                id: 30,
                feature: "Funcionalidade: Informe de Rendimentos",
                scenarioName: "Cenário: Download do PDF",
                correctOrder: [
                    "Given que o ano fiscal encerrou",
                    "When acesso a área de Imposto de Renda no app",
                    "And clico em 'Baixar Informe 2025'",
                    "Then o download do arquivo PDF deve iniciar automaticamente"
                ]
            },

            // --- NÍVEIS 31 A 40: SAÚDE E IOT (Internet das Coisas) ---
            {
                id: 31,
                feature: "Funcionalidade: Smart Home / Termostato",
                scenarioName: "Cenário: Ligar AC quando temperatura sobe",
                correctOrder: [
                    "Given que a temperatura alvo está definida em 22°C",
                    "When o sensor detecta que a temperatura ambiente chegou a 25°C",
                    "Then o sistema deve enviar comando para ligar o Ar Condicionado",
                    "And o app deve notificar 'Resfriando o ambiente'"
                ]
            },
            {
                id: 32,
                feature: "Funcionalidade: Agendamento de Consulta",
                scenarioName: "Cenário: Conflito de horário médico",
                correctOrder: [
                    "Given que o Dr. Silva já tem paciente às 14:00",
                    "When tento agendar uma nova consulta para as 14:00",
                    "Then o sistema deve informar que o horário está indisponível",
                    "And deve sugerir os próximos horários livres"
                ]
            },
            {
                id: 33,
                feature: "Funcionalidade: Smartwatch / Passos",
                scenarioName: "Cenário: Atingir meta diária",
                correctOrder: [
                    "Given que minha meta é 10.000 passos",
                    "When eu caminho e o contador chega a 10.000",
                    "Then o relógio deve vibrar e mostrar uma animação de troféu",
                    "And o app no celular deve registrar a conquista no histórico"
                ]
            },
            {
                id: 34,
                feature: "Funcionalidade: Telemedicina",
                scenarioName: "Cenário: Conexão de vídeo",
                correctOrder: [
                    "Given que a consulta está agendada e paga",
                    "When o médico inicia a chamada de vídeo",
                    "And eu aceito a permissão de câmera e microfone",
                    "Then a transmissão de vídeo bidirecional é estabelecida"
                ]
            },
            {
                id: 35,
                feature: "Funcionalidade: Geladeira Inteligente",
                scenarioName: "Cenário: Porta aberta por muito tempo",
                correctOrder: [
                    "Given que a porta da geladeira foi aberta",
                    "When ela permanece aberta por mais de 2 minutos",
                    "Then um alarme sonoro deve disparar na cozinha",
                    "And uma notificação push é enviada ao celular do dono"
                ]
            },
            {
                id: 36,
                feature: "Funcionalidade: Prontuário Eletrônico",
                scenarioName: "Cenário: Registro de alergia",
                correctOrder: [
                    "Given que estou no perfil do paciente",
                    "When adiciono 'Penicilina' na lista de alergias",
                    "Then o sistema deve destacar essa informação em vermelho",
                    "And deve emitir um alerta ao prescrever medicamentos com Penicilina"
                ]
            },
            {
                id: 37,
                feature: "Funcionalidade: Robô Aspirador",
                scenarioName: "Cenário: Retorno à base com bateria fraca",
                correctOrder: [
                    "Given que o robô está limpando a sala",
                    "When o nível de bateria cai para 15%",
                    "Then o robô deve parar a limpeza",
                    "And deve navegar automaticamente para a base de carregamento"
                ]
            },
            {
                id: 38,
                feature: "Funcionalidade: App de Corrida",
                scenarioName: "Cenário: Pausa automática",
                correctOrder: [
                    "Given que estou monitorando uma corrida com GPS",
                    "When eu paro de me mover no semáforo",
                    "Then o app deve pausar o cronômetro automaticamente",
                    "And deve retomar a contagem quando eu voltar a correr"
                ]
            },
            {
                id: 39,
                feature: "Funcionalidade: Lâmpada Inteligente",
                scenarioName: "Cenário: Rotina de despertar",
                correctOrder: [
                    "Given que configurei o despertar para as 07:00",
                    "When o relógio marca 06:30",
                    "Then a luz deve acender com 1% de brilho",
                    "And deve aumentar gradualmente até 100% às 07:00"
                ]
            },
            {
                id: 40,
                feature: "Funcionalidade: Entrega de Drone",
                scenarioName: "Cenário: Entrega em local seguro",
                correctOrder: [
                    "Given que o drone chegou às coordenadas de entrega",
                    "When os sensores detectam um obstáculo no solo",
                    "Then o drone deve abortar a descida",
                    "And deve aguardar em hover até a área estar limpa"
                ]
            },
            
            // --- NÍVEIS 41 A 50: TÉCNICO / DEV / CI-CD ---
            {
                id: 41,
                feature: "Funcionalidade: Git Workflow",
                scenarioName: "Cenário: Conflito de Merge",
                correctOrder: [
                    "Given que eu e meu colega editamos o mesmo arquivo na mesma linha",
                    "When tento fazer o merge da branch dele na minha",
                    "Then o Git deve interromper o merge automático",
                    "And deve solicitar que eu resolva os conflitos manualmente"
                ]
            },
            {
                id: 42,
                feature: "Funcionalidade: Pipeline de CI/CD",
                scenarioName: "Cenário: Teste unitário falhando",
                correctOrder: [
                    "Given que fiz um push para o repositório",
                    "When o pipeline executa a suíte de testes automatizados",
                    "And um teste crítico falha",
                    "Then o deploy para produção deve ser cancelado",
                    "And a equipe deve ser notificada no Slack"
                ]
            },
            {
                id: 43,
                feature: "Funcionalidade: API Rate Limiting",
                scenarioName: "Cenário: Excesso de requisições",
                correctOrder: [
                    "Given que o limite da API é 100 requests por minuto",
                    "When um cliente faz a requisição número 101 dentro de 1 minuto",
                    "Then a API deve retornar Status 429 (Too Many Requests)",
                    "And o header 'Retry-After' deve indicar quando tentar novamente"
                ]
            },
            {
                id: 44,
                feature: "Funcionalidade: Container Docker",
                scenarioName: "Cenário: Healthcheck falhando",
                correctOrder: [
                    "Given que um container está rodando a aplicação",
                    "When o endpoint /health deixa de responder 200 OK",
                    "Then o orquestrador (Kubernetes) deve marcar o pod como 'unhealthy'",
                    "And deve reiniciar o container automaticamente"
                ]
            },
            {
                id: 45,
                feature: "Funcionalidade: Feature Flag",
                scenarioName: "Cenário: Ativar nova feature para beta testers",
                correctOrder: [
                    "Given que a feature 'NovoDashboard' está atrás de uma flag",
                    "When um usuário do grupo 'Beta' faz login",
                    "Then o sistema verifica a flag e retorna 'true'",
                    "And o usuário visualiza o novo dashboard ao invés do antigo"
                ]
            },
            {
                id: 46,
                feature: "Funcionalidade: Cache (Redis)",
                scenarioName: "Cenário: Cache Miss e Hit",
                correctOrder: [
                    "Given que busco os dados do produto ID 50",
                    "When os dados não estão no cache (Cache Miss)",
                    "Then o sistema busca no banco de dados SQL",
                    "And salva o resultado no cache com TTL de 1 hora"
                ]
            },
            {
                id: 47,
                feature: "Funcionalidade: JWT Authentication",
                scenarioName: "Cenário: Token expirado",
                correctOrder: [
                    "Given que possuo um token JWT válido por 30 minutos",
                    "When tento acessar uma rota protegida após 31 minutos",
                    "Then a API deve retornar 401 Unauthorized",
                    "And o frontend deve me redirecionar para o login"
                ]
            },
            {
                id: 48,
                feature: "Funcionalidade: Banco de Dados",
                scenarioName: "Cenário: Rollback de transação",
                correctOrder: [
                    "Given que iniciei uma transação bancária complexa",
                    "When ocorre um erro ao debitar a conta de origem",
                    "Then o banco de dados deve executar um ROLLBACK",
                    "And nenhuma alteração deve ser salva (atomicidade)"
                ]
            },
            {
                id: 49,
                feature: "Funcionalidade: Webhook",
                scenarioName: "Cenário: Tentativa de entrega falha",
                correctOrder: [
                    "Given que um evento de 'Pagamento Aprovado' ocorreu",
                    "When o sistema tenta enviar o webhook para o cliente e recebe Timeout",
                    "Then o evento deve ser colocado em uma fila de retentativa",
                    "And o sistema deve tentar reenviar após um intervalo exponencial"
                ]
            },
            {
                id: 50,
                feature: "Funcionalidade: Monitoramento (Logs)",
                scenarioName: "Cenário: Detecção de anomalia",
                correctOrder: [
                    "Given que o monitoramento analisa os logs em tempo real",
                    "When a taxa de erros 500 sobe para 10% em 1 minuto",
                    "Then um alerta de 'Alta Taxa de Erros' é disparado",
                    "And o time de SRE recebe uma ligação automática (PagerDuty)"
                ]
            }
        ];

        // --- Lógica Principal ---

        const levels = ref(allLevels);
        
        const currentLevel = computed(() => {
            return levels.value[currentLevelIndex.value];
        });
        
        const progressPercentage = computed(() => {
            return ((currentLevelIndex.value) / levels.value.length) * 100;
        });

        const correctCount = computed(() => {
            return userHistory.value.filter(h => h.isCorrect).length;
        });

        // Embaralhar Array
        const shuffleArray = (array) => {
            const newArr = [...array];
            for (let i = newArr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
            }
            // Garante que não venha já resolvido (a menos que tenha só 1 item)
            if (newArr.length > 1 && JSON.stringify(newArr) === JSON.stringify(array)) {
                return shuffleArray(array);
            }
            return newArr;
        };

        const loadLevel = () => {
            isChecked.value = false;
            isLevelCorrect.value = false;
            draggingIndex.value = null;
            dragOverIndex.value = null;
            
            const shuffled = shuffleArray(currentLevel.value.correctOrder);
            userLines.value = shuffled.map((text, idx) => ({
                id: `line-${currentLevel.value.id}-${idx}`, // ID único para animação correta
                text: text
            }));
        };

        // --- Drag and Drop Logic ---
        
        const dragStart = (evt, index) => {
            if(isChecked.value) return;
            draggingIndex.value = index;
            
            evt.dataTransfer.effectAllowed = 'move';
            evt.dataTransfer.dropEffect = 'move';
            evt.dataTransfer.setData('text/plain', index);
            
            setTimeout(() => {
                if(evt.target) evt.target.classList.add('dragging');
            }, 0);
        };

        const dragEnter = (index) => {
            if (index !== draggingIndex.value) {
                dragOverIndex.value = index;
            }
        };

        const dragEnd = (evt) => {
            if(evt.target) evt.target.classList.remove('dragging');
            dragOverIndex.value = null;
            draggingIndex.value = null;
        };

        const drop = (index) => {
            dragOverIndex.value = null;
            
            if(isChecked.value || draggingIndex.value === null) return;
            
            const dragIdx = draggingIndex.value;
            const dropIdx = index;
            
            if (dragIdx === dropIdx) return;

            // Reordena array
            const newLines = [...userLines.value];
            const itemToMove = newLines[dragIdx];
            newLines.splice(dragIdx, 1);
            newLines.splice(dropIdx, 0, itemToMove);
            userLines.value = newLines;
            
            draggingIndex.value = null;
        };

        // Verificar Resposta
        const checkAnswer = () => {
            const currentOrder = userLines.value.map(l => l.text);
            const correctOrder = currentLevel.value.correctOrder;
            
            const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
            
            isLevelCorrect.value = isCorrect;
            isChecked.value = true;

            // Salva histórico se for a primeira vez jogando este nível nessa sessão
            const existingEntry = userHistory.value.find(h => h.levelId === currentLevel.value.id);
            if (!existingEntry) {
                userHistory.value.push({
                    levelId: currentLevel.value.id,
                    scenario: currentLevel.value.scenarioName,
                    isCorrect: isCorrect,
                    timestamp: new Date().toISOString()
                });
            }
        };

        const nextLevel = () => {
            if (currentLevelIndex.value < levels.value.length - 1) {
                currentLevelIndex.value++;
                loadLevel();
            } else {
                gameFinished.value = true;
            }
        };

        const resetGame = () => {
            currentLevelIndex.value = 0;
            userHistory.value = [];
            gameFinished.value = false;
            loadLevel();
        };

        const exportResults = () => {
            const dataStr = JSON.stringify(userHistory.value, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gherkin_qa_report_${new Date().toISOString().slice(0,10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
        };

        onMounted(() => {
            loadLevel();
        });

        return {
            levels,
            currentLevelIndex,
            currentLevel,
            userLines,
            isChecked,
            isLevelCorrect,
            progressPercentage,
            correctCount,
            gameFinished,
            dragStart,
            dragEnter,
            dragEnd,
            drop,
            dragOverIndex,
            checkAnswer,
            nextLevel,
            exportResults,
            resetGame
        };
    }
}).mount('#app');

// --- Inicialização do VLibras (Fora do Vue) ---
window.onload = function() {
    new window.VLibras.Widget('https://vlibras.gov.br/app');
};