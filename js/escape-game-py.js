const { createApp } = Vue;

createApp({
    data() {
        return {
            currentLevelIndex: 0,
            userSelection: null,
            logs: [],
            isTyping: false,
            feedbackMsg: "",
            feedbackType: "",
            levelComplete: false,
            
            // Variáveis de Estado do Jogo
            score: 0,
            attempts: 3,
            testResults: [],

            // 
            levels: [
                 {
                    id: 1, concept: "Marcação de Banco de Dados",
                    instruction: "Permita que este teste acesse o banco de dados do Django.",
                    codeTemplate: ["<span class='dec'>@pytest.mark.</span><span class='keyword'>???</span>", "<span class='builtin'>def</span> <span class='func'>test_user_creation</span>():", "    <span class='keyword'>pass</span>"],
                    options: ["django_db", "database", "use_db", "db_access"],
                    correctAnswer: "django_db",
                    successLog: "Marcação aplicada! Banco de dados disponível para o teste."
                },
                {
                    id: 2, concept: "Django Test Client",
                    instruction: "Use a fixture padrão do pytest-django para simular requisições HTTP.",
                    codeTemplate: ["<span class='builtin'>def</span> <span class='func'>test_homepage</span>(<span class='keyword'>???</span>):", "    response = <span class='keyword'>???</span>.get(<span class='string'>'/'</span>)", "    <span class='keyword'>assert</span> response.status_code == 200"],
                    options: ["requests", "browser", "client", "http"],
                    correctAnswer: "client",
                    successLog: "Client injetado! Requisição GET simulada com sucesso."
                },
                {
                    id: 3, concept: "Verificação de Status Code",
                    instruction: "Verifique se a página foi encontrada (código 200).",
                    codeTemplate: ["    response = client.get(<span class='string'>'/sobre/'</span>)", "    <span class='keyword'>assert</span> response.<span class='keyword'>???</span> == 200"],
                    options: ["status", "status_code", "code", "http_status"],
                    correctAnswer: "status_code",
                    successLog: "Asserção correta. Código de status validado."
                },
                {
                    id: 4, concept: "Criação de Model",
                    instruction: "Crie um registro real no banco de dados para o teste.",
                    codeTemplate: ["<span class='builtin'>def</span> <span class='func'>test_author_model</span>(db):", "    author = Author.objects.<span class='keyword'>???</span>(name=<span class='string'>'Kari'</span>)", "    <span class='keyword'>assert</span> author.name == <span class='string'>'Kari'</span>"],
                    options: ["new", "insert", "add", "create"],
                    correctAnswer: "create",
                    successLog: "Objeto instanciado e salvo no banco de testes."
                },
                {
                    id: 5, concept: "Contagem de Objetos",
                    instruction: "Garanta que o banco de dados tem exatamente 1 usuário após a inserção.",
                    codeTemplate: ["    User.objects.create(username=<span class='string'>'admin'</span>)", "    <span class='keyword'>assert</span> User.objects.<span class='keyword'>???</span>() == 1"],
                    options: ["length", "size", "count", "all"],
                    correctAnswer: "count",
                    successLog: "Contagem validada com sucesso via ORM."
                },
                {
                    id: 6, concept: "Testando Exceções",
                    instruction: "O teste deve passar APENAS se o código levantar um ValidationError.",
                    codeTemplate: ["    <span class='keyword'>with</span> pytest.<span class='keyword'>???</span>(ValidationError):", "        user.full_clean()  <span class='comment'># Força a validação</span>"],
                    options: ["raises", "except", "catch", "throws"],
                    correctAnswer: "raises",
                    successLog: "Exceção capturada com sucesso! Comportamento esperado."
                },
                {
                    id: 7, concept: "Requisição POST",
                    instruction: "Envie dados via método POST usando o test client.",
                    codeTemplate: ["    payload = {<span class='string'>'title'</span>: <span class='string'>'Novo Post'</span>}", "    response = client.<span class='keyword'>???</span>(<span class='string'>'/api/posts/'</span>, data=payload)"],
                    options: ["send", "post", "submit", "push"],
                    correctAnswer: "post",
                    successLog: "Payload enviado para a rota via POST."
                },
                {
                    id: 8, concept: "Variáveis de Contexto",
                    instruction: "Verifique se a variável 'posts' foi enviada para o template.",
                    codeTemplate: ["    response = client.get(<span class='string'>'/blog/'</span>)", "    <span class='keyword'>assert</span> <span class='string'>'posts'</span> <span class='keyword'>in</span> response.<span class='keyword'>???</span>"],
                    options: ["context", "data", "template", "args"],
                    correctAnswer: "context",
                    successLog: "Contexto do Django analisado e validado."
                },
                {
                    id: 9, concept: "Parametrização de Testes",
                    instruction: "Rode o mesmo teste várias vezes com dados diferentes usando o marker parametrize.",
                    codeTemplate: ["<span class='dec'>@pytest.mark.</span><span class='keyword'>???</span>(<span class='string'>'a,b,expected'</span>, [(1,2,3), (2,2,4)])", "<span class='builtin'>def</span> <span class='func'>test_soma</span>(a, b, expected):", "    <span class='keyword'>assert</span> a + b == expected"],
                    options: ["loop", "parametrize", "matrix", "repeat"],
                    correctAnswer: "parametrize",
                    successLog: "Testes parametrizados gerados dinamicamente."
                },
                {
                    id: 10, concept: "Criando Fixtures",
                    instruction: "Transforme a função abaixo em uma dependência injetável (fixture).",
                    codeTemplate: ["<span class='dec'>@pytest.</span><span class='keyword'>???</span>", "<span class='builtin'>def</span> <span class='func'>admin_user</span>(db):", "    <span class='keyword'>return</span> User.objects.create_superuser(<span class='string'>'admin'</span>)"],
                    options: ["fixture", "inject", "setup", "dependency"],
                    correctAnswer: "fixture",
                    successLog: "Fixture registrada! Agora pode ser usada em outros testes."
                },
                {
                    id: 11, concept: "Autenticação em Testes",
                    instruction: "Faça o client logar automaticamente com o usuário passado sem precisar de senha.",
                    codeTemplate: ["    user = User.objects.create(username=<span class='string'>'teste'</span>)", "    client.<span class='keyword'>???</span>(user)", "    response = client.get(<span class='string'>'/dashboard/'</span>)"],
                    options: ["login", "force_login", "auth", "set_user"],
                    correctAnswer: "force_login",
                    successLog: "Sessão iniciada via force_login bypassando a autenticação real."
                },
                {
                    id: 12, concept: "Ignorando um Teste",
                    instruction: "Pule este teste pois a funcionalidade ainda não foi implementada.",
                    codeTemplate: ["<span class='dec'>@pytest.mark.</span><span class='keyword'>???</span>(reason=<span class='string'>'WIP'</span>)", "<span class='builtin'>def</span> <span class='func'>test_payment_gateway</span>():", "    <span class='keyword'>pass</span>"],
                    options: ["ignore", "pass", "skip", "todo"],
                    correctAnswer: "skip",
                    successLog: "Teste ignorado intencionalmente na suíte."
                },
                {
                    id: 13, concept: "Sobrescrevendo Settings",
                    instruction: "Acesse as configurações do Django de forma segura durante o teste.",
                    codeTemplate: ["<span class='builtin'>def</span> <span class='func'>test_debug_mode</span>(<span class='keyword'>???</span>):", "    <span class='keyword'>???</span>.DEBUG = <span class='keyword'>True</span>", "    <span class='keyword'>assert</span> <span class='keyword'>???</span>.DEBUG <span class='keyword'>is</span> <span class='keyword'>True</span>"],
                    options: ["config", "django_settings", "settings", "env"],
                    correctAnswer: "settings",
                    successLog: "Settings sobrescritas e isoladas para o escopo do teste."
                },
                {
                    id: 14, concept: "Validação de Forms",
                    instruction: "Acione a validação de um Django Form no teste.",
                    codeTemplate: ["    form = ContactForm(data={<span class='string'>'email'</span>: <span class='string'>'x@x.com'</span>})", "    <span class='keyword'>assert</span> form.<span class='keyword'>???</span>() <span class='keyword'>is</span> <span class='keyword'>True</span>"],
                    options: ["validate", "is_valid", "check", "clean"],
                    correctAnswer: "is_valid",
                    successLog: "Método is_valid acionado. Formulário válido."
                },
                {
                    id: 15, concept: "Testando Redirecionamentos",
                    instruction: "Verifique a URL exata para a qual a view redirecionou após o POST.",
                    codeTemplate: ["    response = client.post(<span class='string'>'/login/'</span>, data=...)", "    <span class='keyword'>assert</span> response.<span class='keyword'>???</span> == <span class='string'>'/home/'</span>"],
                    options: ["redirect_url", "location", "url", "path"],
                    correctAnswer: "url",
                    successLog: "Redirecionamento confirmado na propriedade url."
                },
                {
                    id: 16, concept: "Verificando HTML (Content)",
                    instruction: "Certifique-se de que a string 'Bem-vindo' está no HTML retornado.",
                    codeTemplate: ["    response = client.get(<span class='string'>'/home/'</span>)", "    <span class='keyword'>assert</span> <span class='string'>b'Bem-vindo'</span> <span class='keyword'>in</span> response.<span class='keyword'>???</span>"],
                    options: ["body", "content", "html", "text"],
                    correctAnswer: "content",
                    successLog: "Byte string encontrada no response.content."
                },
                {
                    id: 17, concept: "Mocking com pytest-mock",
                    instruction: "Faça o mock de uma função externa usando a fixture mocker.",
                    codeTemplate: ["<span class='builtin'>def</span> <span class='func'>test_api</span>(mocker):", "    mocker.<span class='keyword'>???</span>(<span class='string'>'app.services.fetch_data'</span>, return_value=100)"],
                    options: ["mock", "fake", "patch", "spy"],
                    correctAnswer: "patch",
                    successLog: "Módulo substituído por um MagicMock via patch."
                },
                {
                    id: 18, concept: "Refresh do Banco de Dados",
                    instruction: "Atualize a instância do model para refletir mudanças que ocorreram no banco.",
                    codeTemplate: ["    client.post(<span class='string'>'/update_status/'</span>)", "    user.<span class='keyword'>???</span>()", "    <span class='keyword'>assert</span> user.is_active <span class='keyword'>is</span> <span class='keyword'>True</span>"],
                    options: ["reload", "refresh_from_db", "update", "fetch"],
                    correctAnswer: "refresh_from_db",
                    successLog: "Instância sincronizada com o banco de dados."
                },
                {
                    id: 19, concept: "Testando Respostas JSON",
                    instruction: "Extraia o dicionário de um JsonResponse.",
                    codeTemplate: ["    response = client.get(<span class='string'>'/api/data/'</span>)", "    data = response.<span class='keyword'>???</span>()", "    <span class='keyword'>assert</span> data[<span class='string'>'ok'</span>] <span class='keyword'>is</span> <span class='keyword'>True</span>"],
                    options: ["to_dict", "json", "get_json", "data"],
                    correctAnswer: "json",
                    successLog: "Payload JSON parseado com sucesso."
                },
                {
                    id: 20, concept: "Testando Templates Utilizados",
                    instruction: "Verifique se o Django renderizou um template específico (requer pytest-django).",
                    codeTemplate: ["<span class='keyword'>from</span> pytest_django.asserts <span class='keyword'>import</span> <span class='keyword'>???</span>", "", "    response = client.get(<span class='string'>'/'</span>)", "    <span class='keyword'>???</span>(response, <span class='string'>'index.html'</span>)"],
                    options: ["assertTemplate", "checkTemplate", "assertTemplateUsed", "validateTemplate"],
                    correctAnswer: "assertTemplateUsed",
                    successLog: "Validação do template concluída. Todos os testes passaram!"
                }
            ]
        }
    },
    computed: {
        currentLevel() {
            return this.levels[this.currentLevelIndex];
        }
    },
    mounted() {
        this.addLog("Iniciando Pytest Runner v4.2.0...", "log-info");
        this.addLog("Plataforma: linux -- Python 3.10.0, pytest-7.4.0, pytest-django-4.5.2", "log-info");
        this.addLog("Coletando 20 itens...", "log-info");
        setTimeout(() => {
            this.loadLevel();
        }, 1500);
    },
    methods: {
        formatCodeLine(line) {
            // Formata os ??? para mostrar a seleção do usuário em tempo real
            if (line.includes("???")) {
                if (this.userSelection) {
                    return line.replace(/(\?\?\?)/g, `<span class="code-slot filled">${this.userSelection}</span>`);
                }
                return line.replace(/(\?\?\?)/g, `<span class="code-slot">?</span>`);
            }
            return line;
        },

        selectOption(option) {
            if (this.isTyping || this.levelComplete) return;
            this.userSelection = option;
            this.feedbackMsg = "";
        },

        async runCode() {
            if (!this.userSelection || this.isTyping || this.levelComplete) return;

            this.isTyping = true; // Bloqueia interface enquanto "roda"
            const isCorrect = this.userSelection === this.currentLevel.correctAnswer;

            if (isCorrect) {
                // --- SUCESSO ---
                this.feedbackType = "success";
                this.score++;
                this.levelComplete = true;
                
                this.testResults.push({
                    test_id: this.currentLevel.id,
                    concept: this.currentLevel.concept,
                    status: "PASSED",
                    attempts_used: 4 - this.attempts
                });

                await this.typeWriter(`✓ ${this.currentLevel.successLog}`, "log-success");
                // Pequeno delay antes de ir para o próximo
                setTimeout(() => {
                    this.nextLevel();
                }, 1500);

            } else {
                // --- ERRO ---
                this.attempts--;
                
                if (this.attempts > 0) {
                    // Ainda tem tentativas
                    this.feedbackType = "warning";
                    this.feedbackMsg = `AssertionError: '${this.userSelection}' não é o esperado.`;
                    await this.typeWriter(`F Falha no teste. ${this.attempts} tentativa(s) restante(s).`, "log-warning");
                    this.isTyping = false; // Libera para tentar de novo
                } else {
                    // ESGOTOU TENTATIVAS DA FASE
                    this.feedbackType = "error";
                    // Mostra a resposta correta no feedback
                    this.feedbackMsg = `Falha na Suite. A resposta correta era: ${this.currentLevel.correctAnswer}`;
                    this.levelComplete = true;
                    
                    this.testResults.push({
                        test_id: this.currentLevel.id,
                        concept: this.currentLevel.concept,
                        status: "FAILED",
                        attempts_used: 3
                    });

                    await this.typeWriter(`E ERROR: ${this.currentLevel.concept} falhou. Resposta esperada: '${this.currentLevel.correctAnswer}'.`, "log-error");
                    
                    // Delay maior para ler o erro antes de avançar
                    setTimeout(() => {
                        this.nextLevel();
                    }, 3000);
                }
            }
        },

        nextLevel() {
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.userSelection = null;
                this.levelComplete = false;
                this.feedbackMsg = "";
                this.attempts = 3; // Reseta as 3 tentativas para a nova fase
                this.loadLevel();
            } else {
                // FIM DO JOGO
                this.levelComplete = true; // Garante que a tela final apareça
                this.isTyping = false;
                this.addLog(`=================================`, "log-info");
                this.addLog(`Sessão de testes finalizada. Score: ${this.score}/20`, "log-success");
            }
        },

        async loadLevel() {
            this.isTyping = true;
            await this.typeWriter(`test_file.py::test_${this.currentLevel.id}_${this.currentLevel.concept.toLowerCase().replace(/\s/g, '_')} ...`, "log-default");
            this.isTyping = false;
        },

        addLog(text, type = "log-default") {
            this.logs.push({ text, type });
            this.scrollToBottom();
        },

        // Simula o efeito de digitação no terminal
        typeWriter(text, type) {
            return new Promise(resolve => {
                this.logs.push({ text: "", type });
                let currentLogIndex = this.logs.length - 1;
                let i = 0;
                
                const interval = setInterval(() => {
                    // Verifica se o log ainda existe (caso reinicie o jogo durante a animação)
                    if (!this.logs[currentLogIndex]) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }
                    this.logs[currentLogIndex].text += text.charAt(i);
                    this.scrollToBottom();
                    i++;
                    if (i === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 15); // Velocidade da digitação
            });
        },

       scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalBody;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                }
            });
        },

        // Função de exportação JSON
        exportJSON() {
            const dataStr = JSON.stringify({
                final_score: this.score,
                total_tests: 20,
                results: this.testResults,
                generated_at: new Date().toLocaleString('pt-BR')
            }, null, 2);
            
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_pytest_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },

        resetGame() {
            this.currentLevelIndex = 0;
            this.userSelection = null;
            this.score = 0;
            this.attempts = 3;
            this.logs = [];
            this.testResults = [];
            this.levelComplete = false;
            this.addLog("Reiniciando ambiente de testes...", "log-info");
            setTimeout(() => this.loadLevel(), 1000);
        }
    }
}).mount('#app');