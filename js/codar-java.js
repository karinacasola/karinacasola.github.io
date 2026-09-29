const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Treinamento ---
        const currentQuestionIndex = ref(0);
        const attempts = ref(0);
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const roundOver = ref(false);
        const gameOver = ref(false);
        const userCode = ref("");
        const terminalBody = ref(null);
        
        // --- Controle de Dicas ---
        const hintsUsed = ref(0);
        const maxHints = 2;
        const maxAttempts = 3;

        // --- Banco de Questões (40 Desafios do Dia-a-Dia) ---
        const questions = ref([
            {
                id: 1,
                instruction: "Leia o saldo de uma conta bancária e o valor de um saque. Se o saque for menor ou igual ao saldo, subtraia e exiba 'Saque aprovado', senão 'Saldo insuficiente'.",
                variables: "Scanner sc, double saldo, double saque",
                scenario: "Caixa Eletrônico: Validação de fundos antes de liberar o dinheiro.",
                expectedPatterns: ["Scanner", "nextDouble", "if", "<=", "else", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble saldo = sc.nextDouble();\ndouble saque = sc.nextDouble();\nif (saque <= saldo) {\n  System.out.println(\"Saque aprovado\");\n} else {\n  System.out.println(\"Saldo insuficiente\");\n}",
                explanation: "O sistema testa a condição booleana do valor desejado contra o saldo disponível em conta para aprovar a transação.",
                hints: [
                    "Declare o Scanner e leia as variáveis usando 'sc.nextDouble()'.",
                    "Use 'if (saque <= saldo)' para verificar a liberação."
                ]
            },
            {
                id: 2,
                instruction: "Leia a senha digitada pelo usuário. Se for igual a 'Admin2026', exiba 'Acesso Liberado'. Caso contrário, 'Bloqueado'.",
                variables: "Scanner sc, String senha",
                scenario: "Controle de Acesso: Login de administrador em um painel corporativo.",
                expectedPatterns: ["Scanner", "nextLine|next", "if", "equals", "Admin2026", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString senha = sc.nextLine();\nif (senha.equals(\"Admin2026\")) {\n  System.out.println(\"Acesso Liberado\");\n} else {\n  System.out.println(\"Bloqueado\");\n}",
                explanation: "Para validar credenciais de texto em Java, utilizamos o método '.equals()' nativo da classe String.",
                hints: [
                    "Não use '==' para comparar Strings.",
                    "A sintaxe correta é 'senha.equals(\"Admin2026\")'."
                ]
            },
            {
                id: 3,
                instruction: "Leia o ano de fabricação de um veículo. Se for menor que 2004, exiba 'Isento de IPVA', senão exiba 'IPVA Devido'.",
                variables: "Scanner sc, int anoCarro",
                scenario: "Sistema do Detran: Verificação automática de isenção de imposto por idade do veículo.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "2004", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint anoCarro = sc.nextInt();\nif (anoCarro < 2004) {\n  System.out.println(\"Isento de IPVA\");\n} else {\n  System.out.println(\"IPVA Devido\");\n}",
                explanation: "O condicional simples divide o fluxo do programa com base na regra estadual de isenção.",
                hints: [
                    "Leia o ano usando 'sc.nextInt()'.",
                    "A condição é 'anoCarro < 2004'."
                ]
            },
            {
                id: 4,
                instruction: "Leia uma postagem de rede social. Se o tamanho da string passar de 280 caracteres, exiba 'Limite excedido', senão 'Postagem aceita'.",
                variables: "Scanner sc, String postagem, int tamanho",
                scenario: "Rede Social: Validação de limite de caracteres de uma publicação.",
                expectedPatterns: ["Scanner", "nextLine", "length", "if", ">", "280", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString postagem = sc.nextLine();\nint tamanho = postagem.length();\nif (tamanho > 280) {\n  System.out.println(\"Limite excedido\");\n} else {\n  System.out.println(\"Postagem aceita\");\n}",
                explanation: "O método .length() avalia o tamanho do texto recebido antes de enviá-lo ao banco de dados.",
                hints: [
                    "Leia o texto com 'sc.nextLine()'.",
                    "Use 'postagem.length()' para pegar a quantidade de caracteres e jogue no 'if'."
                ]
            },
            {
                id: 5,
                instruction: "Leia o valor total de uma compra online. Se passar de 300 reais, exiba 'Frete Grátis'. Senão, exiba 'Frete R$ 25.00'.",
                variables: "Scanner sc, double valorCompra",
                scenario: "E-commerce: Aplicação de regra de frete grátis por ticket médio alto.",
                expectedPatterns: ["Scanner", "nextDouble", "if", ">", "300", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble valorCompra = sc.nextDouble();\nif (valorCompra > 300) {\n  System.out.println(\"Frete Gratis\");\n} else {\n  System.out.println(\"Frete R$ 25.00\");\n}",
                explanation: "A loja incentiva compras maiores cobrando frete apenas de tickets menores que 300.",
                hints: [
                    "A leitura deve usar 'double' pois são valores financeiros.",
                    "O 'if' verifica '(valorCompra > 300)'."
                ]
            },
            {
                id: 6,
                instruction: "Leia a velocidade capturada de um carro. Se for maior que 80, exiba 'Multado'. Se for igual ou menor, 'Dentro do limite'.",
                variables: "Scanner sc, int velocidade",
                scenario: "Engenharia de Tráfego: Lógica de acionamento do radar fotográfico.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "80", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint velocidade = sc.nextInt();\nif (velocidade > 80) {\n  System.out.println(\"Multado\");\n} else {\n  System.out.println(\"Dentro do limite\");\n}",
                explanation: "Se a condição da via for ultrapassada, o sistema entra no bloco de emissão de multa.",
                hints: [
                    "Capture um inteiro com 'nextInt()'.",
                    "Seja direto no bloco: 'if (velocidade > 80)'."
                ]
            },
            {
                id: 7,
                instruction: "Leia a quantidade de tentativas de login falhas. Se chegar a 3 ou mais, exiba 'Conta Bloqueada', senão 'Tente novamente'.",
                variables: "Scanner sc, int tentativas",
                scenario: "Segurança da Informação: Prevenção contra ataques de força bruta.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">=", "3", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint tentativas = sc.nextInt();\nif (tentativas >= 3) {\n  System.out.println(\"Conta Bloqueada\");\n} else {\n  System.out.println(\"Tente novamente\");\n}",
                explanation: "Políticas de segurança bloqueiam usuários que erram a senha recorrentemente.",
                hints: [
                    "Verifique com 'tentativas >= 3'.",
                    "Imprima as mensagens exatas solicitadas no cenário."
                ]
            },
            {
                id: 8,
                instruction: "Leia o turno de um funcionário ('M' para Manhã, 'N' para Noite). Se for 'N', adicione e exiba um aviso 'Adicional Noturno Aplicado'.",
                variables: "Scanner sc, String turno",
                scenario: "Folha de Pagamento: Validação de direitos trabalhistas por horário.",
                expectedPatterns: ["Scanner", "nextLine|next", "equals|equalsIgnoreCase", "\"N\"", "if"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString turno = sc.nextLine();\nif (turno.equalsIgnoreCase(\"N\")) {\n  System.out.println(\"Adicional Noturno Aplicado\");\n}",
                explanation: "Mapeamento simples de caractere ou string para liberação de benefícios no RH.",
                hints: [
                    "Leia como String usando 'sc.next()'.",
                    "Use 'turno.equals(\"N\")' para o 'if'. O else não é estritamente necessário se nada acontece no turno M."
                ]
            },
            {
                id: 9,
                instruction: "Leia o status de uma nota fiscal ('Emitida', 'Pendente', 'Cancelada'). Se for 'Pendente', exiba 'Aguardando Pagamento'. Senão se for 'Emitida', exiba 'Pronta para Envio'.",
                variables: "Scanner sc, String statusNF",
                scenario: "ERP Logístico: Direcionamento do fluxo de mercadorias no estoque.",
                expectedPatterns: ["Scanner", "nextLine|next", "if", "equals", "else if"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString statusNF = sc.nextLine();\nif (statusNF.equals(\"Pendente\")) {\n  System.out.println(\"Aguardando Pagamento\");\n} else if (statusNF.equals(\"Emitida\")) {\n  System.out.println(\"Pronta para Envio\");\n}",
                explanation: "O 'else if' lida com múltiplos estados específicos que um documento pode assumir.",
                hints: [
                    "Compare as strings com '.equals()'.",
                    "Encadeie a segunda verificação com 'else if (statusNF.equals(\"Emitida\"))'."
                ]
            },
            {
                id: 10,
                instruction: "Leia a umidade do solo de um vaso (0 a 100). Se for menor que 30, exiba 'Acionar Irrigação'. Caso contrário, 'Umidade OK'.",
                variables: "Scanner sc, int umidade",
                scenario: "IoT Agrícola: Sistema autônomo de rega de plantas.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "30", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint umidade = sc.nextInt();\nif (umidade < 30) {\n  System.out.println(\"Acionar Irrigacao\");\n} else {\n  System.out.println(\"Umidade OK\");\n}",
                explanation: "Sensores devolvem um valor inteiro; se estiver abaixo do limiar crítico, a bomba de água é ligada.",
                hints: [
                    "Declare 'umidade' como inteiro.",
                    "O 'if' valida se é menor que 30."
                ]
            },
            {
                id: 11,
                instruction: "Leia a idade de um paciente na triagem. Se >= 60, exiba 'Fila Prioritária'. Se < 60, exiba 'Fila Comum'.",
                variables: "Scanner sc, int idadePaciente",
                scenario: "Hospital: Sistema de senhas e encaminhamento de atendimento.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">=", "60", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint idadePaciente = sc.nextInt();\nif (idadePaciente >= 60) {\n  System.out.println(\"Fila Prioritária\");\n} else {\n  System.out.println(\"Fila Comum\");\n}",
                explanation: "Regra básica de cidadania em totens de retirada de senha.",
                hints: [
                    "O if principal verifica se 'idadePaciente >= 60'.",
                    "Qualquer outro valor cai no 'else'."
                ]
            },
            {
                id: 12,
                instruction: "Leia o código de validação de um ingresso (String). Se o código estiver em maiúsculo igual a 'VIP', libere 'Acesso ao Lounge'.",
                variables: "Scanner sc, String ingresso, String ingressoFormatado",
                scenario: "Eventos: Catraca digital que padroniza os dados antes de checar.",
                expectedPatterns: ["Scanner", "nextLine|next", "toUpperCase", "equals", "\"VIP\""],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString ingresso = sc.nextLine();\nString ingressoFormatado = ingresso.toUpperCase();\nif (ingressoFormatado.equals(\"VIP\")) {\n  System.out.println(\"Acesso ao Lounge\");\n}",
                explanation: "Para evitar erros se o usuário digitar 'vip' ou 'Vip', formatamos tudo para maiúsculo com 'toUpperCase()' antes do if.",
                hints: [
                    "Converta o que foi lido: 'ingressoFormatado = ingresso.toUpperCase();'.",
                    "Faça a comparação '.equals(\"VIP\")' na variável formatada."
                ]
            },
            {
                id: 13,
                instruction: "Leia o número de matrícula de um aluno. Se for par, exiba 'Turma A'. Se for ímpar, 'Turma B'.",
                variables: "Scanner sc, int matricula",
                scenario: "Universidade: Divisão automática de alunos em laboratórios.",
                expectedPatterns: ["Scanner", "nextInt", "if", "%", "2", "==", "0", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint matricula = sc.nextInt();\nif (matricula % 2 == 0) {\n  System.out.println(\"Turma A\");\n} else {\n  System.out.println(\"Turma B\");\n}",
                explanation: "Sistemas usam o operador módulo (%) para criar divisões aleatórias ou agrupamentos justos.",
                hints: [
                    "Use 'matricula % 2 == 0' para descobrir se é par."
                ]
            },
            {
                id: 14,
                instruction: "Leia a carga da bateria do celular. Se <= 15, exiba 'Modo Economia Ativado'. Senão, 'Operação Normal'.",
                variables: "Scanner sc, int bateria",
                scenario: "Sistema Operacional Mobile: Gerenciamento de consumo de hardware.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<=", "15", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint bateria = sc.nextInt();\nif (bateria <= 15) {\n  System.out.println(\"Modo Economia Ativado\");\n} else {\n  System.out.println(\"Operação Normal\");\n}",
                explanation: "Decisões no SO cortam processos em segundo plano baseados na carga restante.",
                hints: [
                    "Teste '(bateria <= 15)' no seu 'if'."
                ]
            },
            {
                id: 15,
                instruction: "Leia o peso de uma bagagem. Se for até 10kg, 'Bagagem de Mão Livre'. Se for de 11 a 23kg, 'Bagagem Despachada'. Maior que 23kg, 'Excesso de Peso'.",
                variables: "Scanner sc, double peso",
                scenario: "Companhia Aérea: Software de check-in e tarifação de malas.",
                expectedPatterns: ["Scanner", "nextDouble", "if", "<=", "10", "else if", "<=", "23", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble peso = sc.nextDouble();\nif (peso <= 10) {\n  System.out.println(\"Bagagem de Mão Livre\");\n} else if (peso <= 23) {\n  System.out.println(\"Bagagem Despachada\");\n} else {\n  System.out.println(\"Excesso de Peso\");\n}",
                explanation: "Cadeia de else if perfeita para definir faixas de tolerância operacionais.",
                hints: [
                    "Se o peso for <= 10, entra no primeiro if.",
                    "O 'else if (peso <= 23)' cobre automaticamente a faixa do meio. O 'else' fica com o excesso."
                ]
            },
            {
                id: 16,
                instruction: "Leia o consumo de API (em chamadas). Se exceder 1000, exiba 'Plano Pro Necessário'. Senão, 'Dentro do Limite Gratuito'.",
                variables: "Scanner sc, int chamadasAPI",
                scenario: "Serviço Cloud: Paywall de plataforma de software (SaaS).",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "1000", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint chamadasAPI = sc.nextInt();\nif (chamadasAPI > 1000) {\n  System.out.println(\"Plano Pro Necessário\");\n} else {\n  System.out.println(\"Dentro do Limite Gratuito\");\n}",
                explanation: "Gatilho de faturamento comum em sistemas de software modernos.",
                hints: [
                    "if (chamadasAPI > 1000) controla o aviso."
                ]
            },
            {
                id: 17,
                instruction: "Leia a temperatura de um servidor. Se for maior que 85.0, exiba 'Risco de Superaquecimento - Reduzindo Clock'.",
                variables: "Scanner sc, double tempServidor",
                scenario: "Data Center: Prevenção de queima de processadores.",
                expectedPatterns: ["Scanner", "nextDouble", "if", ">", "85"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble tempServidor = sc.nextDouble();\nif (tempServidor > 85.0) {\n  System.out.println(\"Risco de Superaquecimento - Reduzindo Clock\");\n}",
                explanation: "Algoritmos de segurança muitas vezes disparam ações críticas (throttle) sem precisar de um 'else'.",
                hints: [
                    "Um 'if' isolado é suficiente aqui, sem bloco 'else'."
                ]
            },
            {
                id: 18,
                instruction: "Leia os pontos de fidelidade do cliente. Se >= 500, exiba 'Resgatar Produto'. Senão, exiba 'Continue comprando'.",
                variables: "Scanner sc, int pontosFidelidade",
                scenario: "Farmácia/Supermercado: Lógica do clube de benefícios.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">=", "500", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint pontosFidelidade = sc.nextInt();\nif (pontosFidelidade >= 500) {\n  System.out.println(\"Resgatar Produto\");\n} else {\n  System.out.println(\"Continue comprando\");\n}",
                explanation: "Gamificação simples exigindo um limiar exato.",
                hints: [
                    "A leitura é de inteiro (nextInt). O condicional é >= 500."
                ]
            },
            {
                id: 19,
                instruction: "Leia o nível de acesso do usuário (String). Se for 'Gestor' ou 'Admin', libere 'Acesso ao Relatório'. Senão, 'Acesso Negado'.",
                variables: "Scanner sc, String nivelAcesso",
                scenario: "BI Corporativo: Sistema de permissões baseadas em papel (RBAC).",
                expectedPatterns: ["Scanner", "nextLine|next", "equals", "\\|\\|", "if", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString nivel = sc.nextLine();\nif (nivel.equals(\"Gestor\") || nivel.equals(\"Admin\")) {\n  System.out.println(\"Acesso ao Relatório\");\n} else {\n  System.out.println(\"Acesso Negado\");\n}",
                explanation: "O operador lógico OU (||) testa se pelo menos uma das condições das strings é verdadeira.",
                hints: [
                    "Use 'if (nivel.equals(\"Gestor\") || nivel.equals(\"Admin\"))'."
                ]
            },
            {
                id: 20,
                instruction: "Leia a avaliação em estrelas de um app (1 a 5). Se for < 3, exiba 'Pedir feedback'. Se for >= 4, 'Pedir avaliação na loja'.",
                variables: "Scanner sc, int estrelas",
                scenario: "Marketing de Aplicativo: Encaminhamento dinâmico pós-uso.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "3", "else if", ">=", "4"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint estrelas = sc.nextInt();\nif (estrelas < 3) {\n  System.out.println(\"Pedir feedback\");\n} else if (estrelas >= 4) {\n  System.out.println(\"Pedir avaliação na loja\");\n}",
                explanation: "Aplicativos evitam direcionar usuários irritados para as lojas oficiais, contendo as críticas em formulários internos.",
                hints: [
                    "Duas condições principais: um 'if' para < 3 e um 'else if' para >= 4."
                ]
            },
            {
                id: 21,
                instruction: "Leia o tipo de combustível escolhido ('A' para Álcool, 'G' para Gasolina). Se 'A', exiba 'Bomba 1 ativada'. Se 'G', 'Bomba 2 ativada'.",
                variables: "Scanner sc, String combustivel",
                scenario: "Posto Inteligente: Liberação automatizada das bombas.",
                expectedPatterns: ["Scanner", "next", "equals", "\"A\"", "else if", "\"G\""],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString comb = sc.next();\nif (comb.equals(\"A\")) {\n  System.out.println(\"Bomba 1 ativada\");\n} else if (comb.equals(\"G\")) {\n  System.out.println(\"Bomba 2 ativada\");\n}",
                explanation: "Sistemas embarcados mapeiam strings ou chars simples para controle de hardware de saída.",
                hints: [
                    "Como é uma String/texto curto, use '.equals()'."
                ]
            },
            {
                id: 22,
                instruction: "Leia o valor de um empréstimo e a renda mensal. Se a parcela (empréstimo/12) for maior que 30% da renda, 'Recusado', senão 'Aprovado'.",
                variables: "Scanner sc, double emprestimo, double renda, double parcela",
                scenario: "Fintech: Análise de limite de crédito pré-aprovado.",
                expectedPatterns: ["Scanner", "nextDouble", "parcela", "=", "/", "12", "if", ">", "\\*", "0\\.3", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble emp = sc.nextDouble();\ndouble renda = sc.nextDouble();\ndouble parcela = emp / 12;\nif (parcela > (renda * 0.30)) {\n  System.out.println(\"Recusado\");\n} else {\n  System.out.println(\"Aprovado\");\n}",
                explanation: "As leis bancárias evitam o superendividamento travando parcelas que superem 30% da renda comprovada.",
                hints: [
                    "Primeiro calcule a parcela: 'double parcela = emprestimo / 12;'.",
                    "Teste se ela compromete a renda: 'if (parcela > renda * 0.30)'."
                ]
            },
            {
                id: 23,
                instruction: "Leia a idade do pet em anos. Se for <= 2, exiba 'Filhote'. Se <= 8, exiba 'Adulto'. Senão, 'Sênior'.",
                variables: "Scanner sc, int idadePet",
                scenario: "Clínica Veterinária: Segmentação de pacotes de vacina.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<=", "2", "else if", "<=", "8", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint idade = sc.nextInt();\nif (idade <= 2) {\n  System.out.println(\"Filhote\");\n} else if (idade <= 8) {\n  System.out.println(\"Adulto\");\n} else {\n  System.out.println(\"Sênior\");\n}",
                explanation: "Múltiplas fases da vida exigem a estrutura em cascata do else if.",
                hints: [
                    "Faça na ordem: menor ou igual a 2, depois else if menor ou igual a 8, e por fim else."
                ]
            },
            {
                id: 24,
                instruction: "Leia o CPF digitado. Se não tiver exatamente 11 caracteres, exiba 'CPF Inválido', senão 'CPF Formato Válido'.",
                variables: "Scanner sc, String cpf",
                scenario: "Cadastro Web: Validação primária de formulário.",
                expectedPatterns: ["Scanner", "nextLine|next", "length", "if", "!=", "11", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString cpf = sc.next();\nif (cpf.length() != 11) {\n  System.out.println(\"CPF Inválido\");\n} else {\n  System.out.println(\"CPF Formato Válido\");\n}",
                explanation: "Antes de checar algoritmos matemáticos complexos, o sistema já recusa CPFs que não possuam 11 dígitos na String.",
                hints: [
                    "O tamanho é validado por 'cpf.length() != 11'."
                ]
            },
            {
                id: 25,
                instruction: "Leia o número de quartos desejados em um hotel de luxo. Se for > 5, exiba 'Encaminhar para Setor de Grupos', senão 'Reserva Padrão'.",
                variables: "Scanner sc, int quartos",
                scenario: "Motor de Reservas: Redirecionamento comercial de reservas atípicas.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "5", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint quartos = sc.nextInt();\nif (quartos > 5) {\n  System.out.println(\"Encaminhar para Setor de Grupos\");\n} else {\n  System.out.println(\"Reserva Padrão\");\n}",
                explanation: "Identificação de anomalias no funil de vendas B2C para tratamento B2B.",
                hints: [
                    "Condicional simples: 'if (quartos > 5)'."
                ]
            },
            {
                id: 26,
                instruction: "Leia o cupom de desconto. Se for 'NATAL26' ou 'BLACKFRIDAY', exiba 'Desconto de 20% aplicado'.",
                variables: "Scanner sc, String cupom",
                scenario: "Carrinho de Compras: Validador de cupons promocionais sazonais.",
                expectedPatterns: ["Scanner", "next", "equals", "\\|\\|", "if"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString cupom = sc.next();\nif (cupom.equals(\"NATAL26\") || cupom.equals(\"BLACKFRIDAY\")) {\n  System.out.println(\"Desconto de 20% aplicado\");\n}",
                explanation: "Dois identificadores textuais engatilham o mesmo evento de conversão com operador ||.",
                hints: [
                    "Use: 'if (cupom.equals(\"NATAL26\") || cupom.equals(\"BLACKFRIDAY\"))'."
                ]
            },
            {
                id: 27,
                instruction: "Leia as horas jogadas em um game. Se > 100, exiba 'Jogador Hardcore'. Senão, 'Jogador Casual'.",
                variables: "Scanner sc, int horas",
                scenario: "Plataforma de Games: Classificação de engajamento do usuário.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "100", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint horas = sc.nextInt();\nif (horas > 100) {\n  System.out.println(\"Jogador Hardcore\");\n} else {\n  System.out.println(\"Jogador Casual\");\n}",
                explanation: "Métricas de produto dividem a base de usuários para campanhas de marketing diferentes.",
                hints: [
                    "Um 'if / else' direto validando as horas."
                ]
            },
            {
                id: 28,
                instruction: "Leia a pressão dos pneus de um carro (int). Se for menor que 28, exiba 'Calibragem necessária'.",
                variables: "Scanner sc, int pressao",
                scenario: "Computador de Bordo Automotivo: Alerta do painel.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "28"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint pressao = sc.nextInt();\nif (pressao < 28) {\n  System.out.println(\"Calibragem necessária\");\n}",
                explanation: "O microcontrolador do carro só emite o alerta em caso de queda de pressão (sem bloco else).",
                hints: [
                    "Não há necessidade de 'else', basta o 'if (pressao < 28)'."
                ]
            },
            {
                id: 29,
                instruction: "Leia a forma de pagamento ('Pix', 'Cartão'). Se for 'Pix', exiba 'Pagamento Imediato'. Se for 'Cartão', 'Pagamento em Análise'.",
                variables: "Scanner sc, String metodo",
                scenario: "Gateway de Pagamento: Status temporário de transação.",
                expectedPatterns: ["Scanner", "next", "equals", "\"Pix\"", "else if", "\"Cartão\""],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString metodo = sc.next();\nif (metodo.equals(\"Pix\")) {\n  System.out.println(\"Pagamento Imediato\");\n} else if (metodo.equals(\"Cartão\")) {\n  System.out.println(\"Pagamento em Análise\");\n}",
                explanation: "Gateways diferenciam o fluxo tecnológico dependendo da modalidade.",
                hints: [
                    "Trate 'Cartão' com acento nas comparações se exigido."
                ]
            },
            {
                id: 30,
                instruction: "Leia o número de passos do smartwatch. Se >= 10000, exiba 'Meta Diária Atingida!'. Senão, exiba 'Continue caminhando'.",
                variables: "Scanner sc, int passos",
                scenario: "App de Saúde: Notificação de encorajamento diário.",
                expectedPatterns: ["Scanner", "nextInt", "if", ">=", "10000", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint passos = sc.nextInt();\nif (passos >= 10000) {\n  System.out.println(\"Meta Diária Atingida!\");\n} else {\n  System.out.println(\"Continue caminhando\");\n}",
                explanation: "Monitoramento constante da variável contra o alvo de saúde fixo da OMS.",
                hints: [
                    "Teste '(passos >= 10000)'."
                ]
            },
            {
                id: 31,
                instruction: "Leia o ano de nascimento do cliente. Calcule a idade (Ano Atual 2026 - Nascimento). Se >= 18, exiba 'Pode assinar contrato'.",
                variables: "Scanner sc, int nascimento, int idade",
                scenario: "Jurídico Web: Validador de capacidade civil antes da assinatura digital.",
                expectedPatterns: ["Scanner", "nextInt", "idade", "=", "2026", "-", "if", ">=", "18"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint nasc = sc.nextInt();\nint idade = 2026 - nasc;\nif (idade >= 18) {\n  System.out.println(\"Pode assinar contrato\");\n}",
                explanation: "O sistema processa o input subtraindo-o do ano corrente para encontrar o status do usuário.",
                hints: [
                    "Calcule: 'int idade = 2026 - nascimento;'.",
                    "Depois valide 'if (idade >= 18)'."
                ]
            },
            {
                id: 32,
                instruction: "Leia uma frase. Se ela começar com 'Erro:', exiba 'Redirecionando para Suporte Técnico'.",
                variables: "Scanner sc, String mensagem",
                scenario: "Chatbot de Atendimento: Triage inicial de IA.",
                expectedPatterns: ["Scanner", "nextLine", "startsWith", "\"Erro:\"", "if"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString msg = sc.nextLine();\nif (msg.startsWith(\"Erro:\")) {\n  System.out.println(\"Redirecionando para Suporte Técnico\");\n}",
                explanation: "Métodos da classe String como 'startsWith()' ajudam o bot a fazer roteamento avançado rapidamente.",
                hints: [
                    "A classe String possui o método 'startsWith()'. Use 'if (mensagem.startsWith(\"Erro:\"))'."
                ]
            },
            {
                id: 33,
                instruction: "Leia o número do andar do elevador. Se for < 0, exiba 'Subsolo'. Se for 0, 'Térreo'. Senão, 'Andar Superior'.",
                variables: "Scanner sc, int andar",
                scenario: "Controlador de Elevador: Display interno da cabine.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "0", "else if", "==", "0", "else"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint andar = sc.nextInt();\nif (andar < 0) {\n  System.out.println(\"Subsolo\");\n} else if (andar == 0) {\n  System.out.println(\"Térreo\");\n} else {\n  System.out.println(\"Andar Superior\");\n}",
                explanation: "A matemática básica traduzida para elementos físicos da construção civil.",
                hints: [
                    "Verifique os negativos com 'andar < 0', depois 'andar == 0' e deixe o resto pro else."
                ]
            },
            {
                id: 34,
                instruction: "Leia a categoria da CNH ('A', 'B', 'C'). Se for 'C', exiba 'Habilitado para caminhões'.",
                variables: "Scanner sc, String categoria",
                scenario: "Logística Transportes: Cadastro de motoristas terceirizados.",
                expectedPatterns: ["Scanner", "next", "equals", "\"C\"", "if"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString cat = sc.next();\nif (cat.equals(\"C\")) {\n  System.out.println(\"Habilitado para caminhões\");\n}",
                explanation: "O filtro de contratação corta automaticamente perfis que não possuem a String específica da lei.",
                hints: [
                    "Use o método '.equals()' para isolar a categoria \"C\"."
                ]
            },
            {
                id: 35,
                instruction: "Leia o nível de tanque do veículo (litros). Se <= 5.0, exiba 'Aviso: Entrando na Reserva'.",
                variables: "Scanner sc, double tanque",
                scenario: "Telemetria Automotiva: Luz amarela do painel.",
                expectedPatterns: ["Scanner", "nextDouble", "if", "<=", "5\\.0"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble tanque = sc.nextDouble();\nif (tanque <= 5.0) {\n  System.out.println(\"Aviso: Entrando na Reserva\");\n}",
                explanation: "Tipos primitivos decimais (double) exigem atenção com operadores lógicos em ambientes industriais.",
                hints: [
                    "O uso do 'double' é necessário pois os sensores medem frações de litros."
                ]
            },
            {
                id: 36,
                instruction: "Leia a região de entrega ('Norte', 'Sul'). Se for 'Norte', frete = 50. Se 'Sul', frete = 30. Imprima o valor do frete.",
                variables: "Scanner sc, String regiao, int frete",
                scenario: "E-commerce de Mobília: Tabela de roteirização simplificada.",
                expectedPatterns: ["Scanner", "next", "equals", "if", "else if", "System\\.out\\.print"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString regiao = sc.next();\nint frete = 0;\nif (regiao.equals(\"Norte\")) {\n  frete = 50;\n} else if (regiao.equals(\"Sul\")) {\n  frete = 30;\n}\nSystem.out.println(frete);",
                explanation: "Variáveis de estado ('frete') têm seus valores modificados dentro dos blocos condicionais textuais.",
                hints: [
                    "Crie a variável 'frete' zerada e popule-a dentro dos if/else if correspondentes a cada String."
                ]
            },
            {
                id: 37,
                instruction: "Leia o número de visualizações de um vídeo. Se > 1000000, exiba 'Vídeo Viral'.",
                variables: "Scanner sc, int views",
                scenario: "Algoritmo de Mídia: Classificação de conteúdo em alta (Trending).",
                expectedPatterns: ["Scanner", "nextInt", "if", ">", "1000000"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint views = sc.nextInt();\nif (views > 1000000) {\n  System.out.println(\"Vídeo Viral\");\n}",
                explanation: "A plataforma engatilha scripts paralelos de CDN apenas quando a barreira crítica é ultrapassada.",
                hints: [
                    "Cuidado para não colocar pontuação nos números do código: escreva '1000000', não '1.000.000'."
                ]
            },
            {
                id: 38,
                instruction: "Leia os batimentos cardíacos (BPM). Se < 40 ou > 120, exiba 'Alerta Médico Imediato'.",
                variables: "Scanner sc, int bpm",
                scenario: "Monitor de UTI: Sistema integrado ao corpo do paciente.",
                expectedPatterns: ["Scanner", "nextInt", "if", "<", "40", "\\|\\|", ">", "120"],
                expectedExample: "Scanner sc = new Scanner(System.in);\nint bpm = sc.nextInt();\nif (bpm < 40 || bpm > 120) {\n  System.out.println(\"Alerta Médico Imediato\");\n}",
                explanation: "O operador OU (||) testa se o paciente entrou em alguma das zonas de limite (superior ou inferior).",
                hints: [
                    "A lógica de limites opostos pede o operador OU. Use 'if (bpm < 40 || bpm > 120)'."
                ]
            },
            {
                id: 39,
                instruction: "Leia o limite do cartão e o valor do produto. Calcule o 'saldo restante' após a compra. Se o 'saldo restante' for < 0, exiba 'Transação Recusada'.",
                variables: "Scanner sc, double limite, double valor, double saldo",
                scenario: "Adquirente de Cartão de Crédito: Validador de PDV.",
                expectedPatterns: ["Scanner", "nextDouble", "saldo", "=", "limite", "-", "valor", "if", "<", "0"],
                expectedExample: "Scanner sc = new Scanner(System.in);\ndouble limite = sc.nextDouble();\ndouble valor = sc.nextDouble();\ndouble saldo = limite - valor;\nif (saldo < 0) {\n  System.out.println(\"Transação Recusada\");\n}",
                explanation: "As operações de matemática de negócio antecedem as árvores de decisão e bloqueio.",
                hints: [
                    "Subtraia o valor do limite e guarde em 'saldo'. Depois avalie o 'saldo'."
                ]
            },
            {
                id: 40,
                instruction: "Leia a extensão de um arquivo ('jpg', 'pdf'). Se não for 'pdf', exiba 'Apenas PDFs são aceitos para currículos'.",
                variables: "Scanner sc, String extensao",
                scenario: "Portal de Vagas: Filtro do sistema de Upload.",
                expectedPatterns: ["Scanner", "next", "if", "!", "equals", "\"pdf\""],
                expectedExample: "Scanner sc = new Scanner(System.in);\nString ext = sc.next();\nif (!ext.equals(\"pdf\")) {\n  System.out.println(\"Apenas PDFs são aceitos para currículos\");\n}",
                explanation: "O sinal de negação (!) inverte a resposta booleana, protegendo a base de dados de arquivos indesejados.",
                hints: [
                    "Para verificar se é diferente, coloque a exclamação antes do método: 'if (!extensao.equals(\"pdf\"))'."
                ]
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
            await typeWriter(`Construindo Sistema (ID: ${currentQuestion.value.id})...`, "log-info");
            await typeWriter(`[Cenário de Negócio] ${currentQuestion.value.scenario}`, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userCode.value = "";
            attempts.value = 0; 
            hintsUsed.value = 0;
            roundOver.value = false; 
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
                addLog("Trilha de regras de negócios concluída. Gerando relatórios de qualidade de software...", "log-info");
            }
        };

        const requestHint = () => {
            if (hintsUsed.value < maxHints && !roundOver.value && !isTyping.value) {
                const hintText = currentQuestion.value.hints[hintsUsed.value];
                hintsUsed.value++;
                feedbackType.value = "info";
                feedbackMsg.value = `<i class='bi bi-lightbulb-fill'></i> <strong>Dica ${hintsUsed.value}:</strong> ${hintText}`;
                addLog(`[Ajuda] Análise de Requisitos solicitada (${hintsUsed.value}/${maxHints}).`, "log-info");
            }
        };

        const submitCode = () => {
            if (isTyping.value || roundOver.value) return;

            const code = userCode.value;
            if (!code.trim()) {
                feedbackType.value = "warning";
                feedbackMsg.value = "<i class='bi bi-exclamation-triangle'></i> O editor está vazio. Defina a regra de negócio.";
                return;
            }

            const isValid = currentQuestion.value.expectedPatterns.every(pattern => {
                const regex = new RegExp(pattern, 'i');
                return regex.test(code);
            });

            if (isValid) {
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> Fluxo sistêmico aprovado no ambiente de testes!";
                addLog(`[Success] Lógica para o Cenário ${currentQuestion.value.id} aprovada.`, "log-success");
                roundOver.value = true;
            } else {
                attempts.value++;
                if (attempts.value >= maxAttempts) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Compilação falhou. Estrutura de negócio reprovada. Leia a solução padrão.`;
                    addLog(`[Erro] Código-fonte diverge da especificação corporativa.`, "log-error");
                    roundOver.value = true;
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> Faltam blocos de controle (if/else/variáveis). Tentativa ${attempts.value}/${maxAttempts}`;
                    addLog(`[Aviso] Revisão de código exigida - falha na validação ${attempts.value}.`, "log-warning");
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Engenheiro(a) preparado(a) para implementação de regras sistêmicas complexas no back-end.";
            if (score.value < 25) performanceMsg = "Necessária revisão de documentação de IF/ELSE e regras de negócio com Operadores.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5C8069; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5C8069; margin: 0;">Relatório de Homologação de Software</h1>
                    <h2 style="color: #555; margin: 5px 0;">Regras de Negócio e Controle de Fluxo</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Homologação:</strong> ${data}</p>
                    <p>O presente documento reflete os testes aplicados a ${questions.value.length} cenários práticos de desenvolvimento de software diário (E-commerce, Bancário, Automação).</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Indicador de Qualidade de Código (QA)</h3>
                        <p style="font-size: 28px; color: ${score.value >= 25 ? '#5C8069' : (score.value >= 15 ? '#D9A05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${questions.value.length} Sistemas Passaram no Teste Unitário</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico Técnico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento auditado e gerado pela Suíte JAVA.LOGIC.B2B
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Relatorio_Regras_de_Negocio_${new Date().toISOString().slice(0,10)}.pdf`,
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
            addLog("Levantando contêineres de compilação Java...", "log-info");
            setTimeout(() => loadQuestion(), 1000);
        };

        onMounted(() => {
            addLog("Inicializando Simulador de Ambiente Corporativo...", "log-info");
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
            roundOver,
            gameOver,
            userCode,
            terminalBody,
            hintsUsed,
            maxHints,
            requestHint,
            submitCode,
            nextQuestion,
            saveResultPDF,
            resetGame
        };
    }
}).mount('#app');