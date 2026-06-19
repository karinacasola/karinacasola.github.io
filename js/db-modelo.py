from browser import window

db = None

def on_upgradeneeded(evt):
    db_upgrade = evt.target.result
    if not db_upgrade.objectStoreNames.contains("der_sessions"):
        db_upgrade.createObjectStore("der_sessions", {"keyPath": "id"})

def on_get(evt):
    res = evt.target.result
    if res and res is not window.undefined:
        try:
            window.restoreFromDB(res.data)
        except Exception as e:
            print("Aguardando Vue montar para restaurar a sessão...", e)

def load_session():
    if not db: return
    tx = db.transaction("der_sessions", "readonly")
    store = tx.objectStore("der_sessions")
    req = store.get("autosave")
    req.bind("success", on_get)

def on_success(evt):
    global db
    db = evt.target.result
    load_session()

def on_error(evt):
    print("Erro ao abrir IndexedDB")

# Inicializa o Banco de Dados do Navegador
req = window.indexedDB.open("DERModelerDB", 1)
req.bind("upgradeneeded", on_upgradeneeded)
req.bind("success", on_success)
req.bind("error", on_error)

# Função chamada pelo Vue.js toda vez que o estado muda
def save_session(json_str):
    if not db: return
    tx = db.transaction("der_sessions", "readwrite")
    store = tx.objectStore("der_sessions")
    store.put({"id": "autosave", "data": json_str})

# Função chamada pelo botão "Limpar Cache"
def clear_cache():
    if not db: return
    tx = db.transaction("der_sessions", "readwrite")
    store = tx.objectStore("der_sessions")
    req = store.clear()
    
    def on_cleared(evt):
        window.alert("Sessão apagada! A ferramenta será reiniciada.")
        window.location.reload()
        
    req.bind("success", on_cleared)

# Expõe as funções Python para o contexto global do JavaScript (window)
window.saveToDB = save_session
window.clearDB = clear_cache