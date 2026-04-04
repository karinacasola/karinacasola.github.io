const { createApp, ref, computed, onMounted, nextTick } = Vue;

createApp({
    setup() {
        // --- Estado do Jogo ---
        const currentLevelIndex = ref(0);
        const attempts = ref(3); // Inicia com 3 tentativas
        const score = ref(0);
        const logs = ref([]);
        const isTyping = ref(false);
        const feedbackMsg = ref("");
        const feedbackType = ref("");
        const levelComplete = ref(false);
        const gameOver = ref(false);
        const userSelection = ref(null);
        const terminalBody = ref(null);
        const testResults = ref([]); // Histórico para PDF e JSON

        // --- ROTEIRO DO JOGO (20 Níveis Integrados) ---
        const levels = ref([
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
        ]);

        const currentLevel = computed(() => levels.value[currentLevelIndex.value]);
        const progressPercentage = computed(() => (currentLevelIndex.value / levels.value.length) * 100);

        // --- Lógica Principal ---
        const formatCodeLine = (line) => {
            if (line.includes("???")) {
                if (userSelection.value) {
                    return line.replace(/(\?\?\?)/g, `<span class="code-slot filled">${userSelection.value}</span>`);
                }
                return line.replace(/(\?\?\?)/g, `<span class="code-slot">?</span>`);
            }
            return line;
        };

        const scrollToBottom = () => {
            nextTick(() => {
                if (terminalBody.value) { 
                    terminalBody.value.scrollTop = terminalBody.value.scrollHeight; 
                }
            });
        };

        const addLog = (text, type = "log-info") => {
            logs.value.push({ text, type });
            scrollToBottom();
        };

        const typeWriter = (text, type) => {
            return new Promise(resolve => {
                logs.value.push({ text: "", type });
                let currentLogIndex = logs.value.length - 1; 
                let i = 0;
                
                const interval = setInterval(() => {
                    if (!logs.value[currentLogIndex]) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }
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

        const loadLevel = async () => {
            isTyping.value = true;
            await typeWriter(`test_file.py::test_${currentLevel.value.id}_${currentLevel.value.concept.toLowerCase().replace(/\s/g, '_')} ...`, "log-default");
            isTyping.value = false;
        };

        const resetTurn = () => {
            userSelection.value = null; 
            attempts.value = 3;
            levelComplete.value = false; 
            feedbackMsg.value = ""; 
            feedbackType.value = "";
        };

        const nextLevel = () => {
            if (currentLevelIndex.value < levels.value.length - 1) {
                currentLevelIndex.value++;
                resetTurn();
                loadLevel();
            } else {
                gameOver.value = true;
                levelComplete.value = true;
                isTyping.value = false;
                addLog("=================================", "log-info");
                addLog(`Sessão de testes finalizada. Score: ${score.value}/${levels.value.length}`, "log-success");
            }
        };

        const selectOption = (option) => {
            if (levelComplete.value || gameOver.value || isTyping.value) return;
            userSelection.value = option;
            feedbackMsg.value = ""; 
        };

        const runCode = async () => {
            if (!userSelection.value || levelComplete.value || isTyping.value) return;

            isTyping.value = true;
            const isCorrect = userSelection.value === currentLevel.value.correctAnswer;

            if (isCorrect) {
                // --- SUCESSO ---
                score.value++;
                feedbackType.value = "success";
                feedbackMsg.value = "<i class='bi bi-check-lg'></i> PASSED [100%]";
                levelComplete.value = true;
                
                testResults.value.push({ 
                    test_id: currentLevel.value.id,
                    concept: currentLevel.value.concept,
                    status: 'PASSED',
                    attempts_used: 4 - attempts.value
                });

                await typeWriter(`✓ ${currentLevel.value.successLog}`, "log-success");
                setTimeout(nextLevel, 1500);

            } else {
                // --- ERRO ---
                attempts.value--;
                if (attempts.value <= 0) {
                    feedbackType.value = "error";
                    feedbackMsg.value = `<i class='bi bi-x-circle-fill'></i> Falha na Suite. A resposta correta era: <strong>${currentLevel.value.correctAnswer}</strong>`;
                    levelComplete.value = true;
                    
                    testResults.value.push({ 
                        test_id: currentLevel.value.id,
                        concept: currentLevel.value.concept,
                        status: 'FAILED',
                        attempts_used: 3
                    });
                    
                    await typeWriter(`E ERROR: ${currentLevel.value.concept} falhou. Resposta esperada: '${currentLevel.value.correctAnswer}'.`, "log-error");
                    setTimeout(nextLevel, 3000);
                } else {
                    feedbackType.value = "warning";
                    feedbackMsg.value = `<i class='bi bi-exclamation-triangle'></i> AssertionError: '${userSelection.value}' não é o esperado.`;
                    await typeWriter(`F Falha no teste. ${attempts.value} tentativa(s) restante(s).`, "log-warning");
                    isTyping.value = false;
                }
            }
        };

        const saveResultPDF = () => {
            const data = new Date().toLocaleString();
            const printElement = document.createElement('div');
            
            printElement.style.padding = '40px'; 
            printElement.style.fontFamily = 'Arial, sans-serif'; 
            printElement.style.color = '#333';
            
            let performanceMsg = "Proficiência alta em testes automatizados.";
            if (score.value < (levels.value.length * 0.7)) performanceMsg = "Recomenda-se revisão da sintaxe do Pytest e fixtures do Django.";
            
            printElement.innerHTML = `
                <div style="text-align: center; border-bottom: 2px solid #5eb177; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #5eb177; margin: 0;">Relatório de Execução: Pytest</h1>
                    <h2 style="color: #555; margin: 5px 0;">Certificação em Testes Backend</h2>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; text-align: justify;">
                    <p><strong>Data da Execução:</strong> ${data}</p>
                    <p>Este documento atesta a conclusão da simulação de testes unitários para a framework Django, cobrindo Fixtures, Mocks, Asserções e Client HTTP.</p>
                    
                    <div style="background-color: #f4f7f6; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #333;">Coverage Report</h3>
                        <p style="font-size: 28px; color: ${score.value >= (levels.value.length * 0.7) ? '#5eb177' : (score.value >= (levels.value.length * 0.5) ? '#d9a05b' : '#EF4444')}; margin: 15px 0;">
                            <strong>${score.value} de ${levels.value.length} Testes Válidos (PASSED)</strong>
                        </p>
                        <p style="font-size: 15px; color: #666; font-style: italic;">Diagnóstico: ${performanceMsg}</p>
                    </div>
                </div>
                <p style="font-size: 13px; color: #888; text-align: center; margin-top: 50px; border-top: 1px dashed #ccc; padding-top: 15px;">
                    Documento gerado pelo simulador PYTEST.ESCAPE
                </p>
            `;

            const opt = {
                margin:       0.5,
                filename:     `Pytest_Coverage_Report_${new Date().toISOString().slice(0,10)}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(printElement).save();
        };

        const exportJSON = () => {
            const dataStr = JSON.stringify({
                final_score: score.value,
                total_tests: levels.value.length,
                results: testResults.value,
                generated_at: new Date().toLocaleString('pt-BR')
            }, null, 2);
            
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_pytest_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        const resetGame = () => {
            currentLevelIndex.value = 0; 
            score.value = 0; 
            logs.value = []; 
            testResults.value = [];
            gameOver.value = false;
            resetTurn();
            addLog("Reiniciando ambiente de testes...", "log-info");
            setTimeout(() => loadLevel(), 1000);
        };

        onMounted(() => {
            addLog("Iniciando Pytest Runner v4.2.0...", "log-info");
            addLog("Plataforma: linux -- Python 3.10.0, pytest-7.4.0, pytest-django-4.5.2", "log-info");
            addLog(`Coletando ${levels.value.length} itens...`, "log-info");
            setTimeout(() => { loadLevel(); }, 1500);
        });

        return {
            levels,
            currentLevelIndex,
            currentLevel,
            progressPercentage,
            attempts,
            score,
            logs,
            isTyping,
            feedbackMsg,
            feedbackType,
            levelComplete,
            gameOver,
            userSelection,
            terminalBody,
            formatCodeLine,
            selectOption,
            runCode,
            saveResultPDF,
            exportJSON,
            resetGame
        };
    }
}).mount('#app');