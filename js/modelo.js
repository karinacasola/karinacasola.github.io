/**
 * Lógica do Modelador DER
 * Integrado via Vue.js 3 + SQL Generator
 */
const { createApp, ref, reactive, computed, onMounted } = Vue;

const DerApp = {
    setup() {
        const model = reactive({
            entities: [],
            relationships: [],
            attributes: [],
            generalizations: [],
            notes: []
        });

        const zoom = ref(1.0);
        const zoomIn = () => { if (zoom.value < 2) zoom.value += 0.1; };
        const zoomOut = () => { if (zoom.value > 0.4) zoom.value -= 0.1; };
        const resetZoom = () => { zoom.value = 1.0; };

        const history = ref([]);
        const historyIndex = ref(-1);
        let isRestoring = false;

        const saveState = () => {
            if (isRestoring) return;
            const snapshot = JSON.stringify(model);
            history.value = history.value.slice(0, historyIndex.value + 1);
            history.value.push(snapshot);
            historyIndex.value++;

            if (window.saveToDB) window.saveToDB(snapshot);
        };

        const undo = () => {
            if (historyIndex.value > 0) {
                isRestoring = true;
                historyIndex.value--;
                applySnapshot(history.value[historyIndex.value]);
                clearSelection();
                setTimeout(() => isRestoring = false, 0);
            }
        };

        const redo = () => {
            if (historyIndex.value < history.value.length - 1) {
                isRestoring = true;
                historyIndex.value++;
                applySnapshot(history.value[historyIndex.value]);
                clearSelection();
                setTimeout(() => isRestoring = false, 0);
            }
        };

        const applySnapshot = (snapshotJSON) => {
            const parsed = JSON.parse(snapshotJSON);
            model.entities = parsed.entities || [];
            model.relationships = parsed.relationships || [];
            model.attributes = (parsed.attributes || []).map(a => ({ ...a, parentAttributeId: a.parentAttributeId || null }));
            model.generalizations = parsed.generalizations || [];
            model.notes = parsed.notes || [];
        };

        window.restoreFromDB = (jsonStr) => {
            try {
                applySnapshot(jsonStr);
                history.value = [jsonStr];
                historyIndex.value = 0;
                clearSelection();
            } catch (e) {
                console.error("Erro ao restaurar diagrama do cache:", e);
            }
        };

        const clearCache = () => {
            if (window.clearDB) {
                if(confirm("Tem certeza que deseja apagar o diagrama atual e limpar o cache? Essa ação não pode ser desfeita.")) window.clearDB();
            } else {
                alert("O sistema de Cache ainda está carregando...");
            }
        };

        const canUndo = computed(() => historyIndex.value > 0);
        const canRedo = computed(() => historyIndex.value < history.value.length - 1);

        const selectedItem = ref(null);
        const selectedType = ref('');

        const selectItem = (item, type) => {
            selectedItem.value = item;
            selectedType.value = type;
        };
        const clearSelection = () => {
            selectedItem.value = null;
            selectedType.value = '';
        };

        const addElement = (type, isPrimary = false) => {
            const centerX = 300 / zoom.value; 
            const centerY = 200 / zoom.value;

            if (type === 'entity') {
                model.entities.push({ id: 'e_' + Date.now(), name: 'Entidade', x: centerX, y: centerY });
            } 
            else if (type === 'relationship') {
                model.relationships.push({ id: 'r_' + Date.now(), name: 'Rel', x: centerX, y: centerY, from: null, to: null, cardinalityFrom: '1,n', cardinalityTo: '1,n', isAuto: false });
            } 
            else if (type === 'auto') {
                model.relationships.push({ id: 'ra_' + Date.now(), name: 'Auto', x: centerX, y: centerY, from: null, to: null, cardinalityFrom: '0,n', cardinalityTo: '0,n', isAuto: true });
            } 
            else if (type === 'attribute') {
                model.attributes.push({ id: 'a_' + Date.now(), name: isPrimary ? 'id' : 'atributo', x: centerX, y: centerY, isPrimary: isPrimary, entityId: null, parentAttributeId: null });
            } 
            else if (type === 'composite_attribute') {
                const parentId = 'a_' + Date.now();
                model.attributes.push({ id: parentId, name: 'Composto', x: centerX, y: centerY - 30, isPrimary: false, entityId: null, parentAttributeId: null });
                model.attributes.push({ id: 'a_' + (Date.now() + 1), name: 'Sub 1', x: centerX - 30, y: centerY + 20, isPrimary: false, entityId: null, parentAttributeId: parentId });
                model.attributes.push({ id: 'a_' + (Date.now() + 2), name: 'Sub 2', x: centerX + 30, y: centerY + 20, isPrimary: false, entityId: null, parentAttributeId: parentId });
            }
            else if (type === 'generalization') {
                model.generalizations.push({ id: 'g_' + Date.now(), x: centerX, y: centerY, superclass: null, subclasses: [] });
            } 
            else if (type === 'note') {
                model.notes.push({ id: 'n_' + Date.now(), text: 'Nota', x: centerX, y: centerY });
            }
            saveState();
        };

        const getEntity = (id) => model.entities.find(e => e.id === id);
        const getAttribute = (id) => model.attributes.find(a => a.id === id);

        const removeSelected = () => {
            if (!selectedItem.value) return;
            const id = selectedItem.value.id;

            if (selectedType.value === 'entity') {
                model.relationships.forEach(r => { if(r.from === id) r.from = null; if(r.to === id) r.to = null; });
                model.attributes.forEach(a => { if(a.entityId === id) a.entityId = null; });
                model.generalizations.forEach(g => { 
                    if(g.superclass === id) g.superclass = null; 
                    g.subclasses = g.subclasses.filter(sub => sub !== id); 
                });
                model.entities = model.entities.filter(e => e.id !== id);
            } 
            else if (selectedType.value === 'relationship') {
                model.relationships = model.relationships.filter(r => r.id !== id);
            }
            else if (selectedType.value === 'attribute') {
                model.attributes.forEach(a => { if(a.parentAttributeId === id) a.parentAttributeId = null; });
                model.attributes = model.attributes.filter(a => a.id !== id);
            }
            else if (selectedType.value === 'generalization') {
                model.generalizations = model.generalizations.filter(g => g.id !== id);
            }
            else if (selectedType.value === 'note') {
                model.notes = model.notes.filter(n => n.id !== id);
            }
            
            clearSelection();
            saveState();
        };

        let draggingItem = null;
        let startMouseX = 0; let startMouseY = 0;
        let startItemX = 0; let startItemY = 0;

        const startDrag = (item, type, event) => {
            selectItem(item, type);
            draggingItem = item;
            
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            startMouseX = clientX; startMouseY = clientY;
            startItemX = item.x; startItemY = item.y;
            
            window.addEventListener('mousemove', doDrag);
            window.addEventListener('mouseup', stopDrag);
            window.addEventListener('touchmove', doDrag, { passive: false });
            window.addEventListener('touchend', stopDrag);
        };

        const doDrag = (event) => {
            if (!draggingItem) return;
            if (event.touches) event.preventDefault();

            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;
            
            const deltaX = (clientX - startMouseX) / zoom.value;
            const deltaY = (clientY - startMouseY) / zoom.value;
            
            draggingItem.x = startItemX + deltaX;
            draggingItem.y = startItemY + deltaY;
        };

        const stopDrag = () => {
            if (draggingItem) saveState();
            draggingItem = null;
            window.removeEventListener('mousemove', doDrag);
            window.removeEventListener('mouseup', stopDrag);
            window.removeEventListener('touchmove', doDrag);
            window.removeEventListener('touchend', stopDrag);
        };

        const fileInput = ref(null);
        const triggerFileInput = () => fileInput.value.click();

        const importJSON = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    applySnapshot(e.target.result);
                    clearSelection();
                    saveState();
                    alert("Diagrama carregado com sucesso!");
                } catch (err) {
                    alert("Erro: Arquivo corrompido ou JSON inválido.");
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        };

        const exportJSON = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(model, null, 2));
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "diagrama_der.json");
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
        };

        // --- NOVO: GERADOR DE SQL ---
        const generateSQL = () => {
            let sql = "-- Script DDL Gerado Automaticamente\n";
            sql += "-- Plataforma: Karina Casola Blog - Modelador DER\n\n";

            const tables = {}; 

            // Helpers
            const formatName = (name) => name.trim().replace(/\s+/g, '_').toLowerCase();
            const getPKs = (entId) => model.attributes.filter(a => a.entityId === entId && a.isPrimary).map(a => formatName(a.name));

            // 1. Mapear Entidades e seus Atributos
            model.entities.forEach(ent => {
                const tableName = formatName(ent.name);
                let cols = [];
                let pks = [];

                const attrs = model.attributes.filter(a => a.entityId === ent.id);
                attrs.forEach(a => {
                    const children = model.attributes.filter(child => child.parentAttributeId === a.id);
                    if (children.length > 0) {
                        // Atributo composto: insere apenas as bolinhas filhas
                        children.forEach(c => cols.push(`  ${formatName(c.name)} VARCHAR(255)`));
                    } else if (!a.parentAttributeId) {
                        // Atributo simples ou Chave
                        const colName = formatName(a.name);
                        let def = `  ${colName} VARCHAR(255)`;
                        if (a.isPrimary) {
                            def += " NOT NULL";
                            pks.push(colName);
                        }
                        cols.push(def);
                    }
                });

                tables[ent.id] = { name: tableName, cols: cols, pks: pks, fks: [] };
            });

            // 2. Resolver Relacionamentos (1:N e N:M)
            model.relationships.forEach(rel => {
                if (!rel.from || !rel.to) return;
                
                const fromN = rel.cardinalityFrom.toLowerCase().includes('n');
                const toN = rel.cardinalityTo.toLowerCase().includes('n');
                
                const tableFrom = tables[rel.from];
                const tableTo = tables[rel.to];
                if (!tableFrom || !tableTo) return;

                const fromPK = getPKs(rel.from).length ? getPKs(rel.from)[0] : 'id';
                const toPK = getPKs(rel.to).length ? getPKs(rel.to)[0] : 'id';

                if (fromN && toN) {
                    // N:M -> Cria Tabela Associativa
                    const assocName = formatName(rel.name);
                    sql += `CREATE TABLE ${assocName} (\n`;
                    sql += `  fk_${tableFrom.name}_${fromPK} VARCHAR(255) NOT NULL,\n`;
                    sql += `  fk_${tableTo.name}_${toPK} VARCHAR(255) NOT NULL,\n`;
                    sql += `  PRIMARY KEY (fk_${tableFrom.name}_${fromPK}, fk_${tableTo.name}_${toPK}),\n`;
                    sql += `  FOREIGN KEY (fk_${tableFrom.name}_${fromPK}) REFERENCES ${tableFrom.name} (${fromPK}),\n`;
                    sql += `  FOREIGN KEY (fk_${tableTo.name}_${toPK}) REFERENCES ${tableTo.name} (${toPK})\n`;
                    sql += `);\n\n`;
                } else if (fromN && !toN) {
                    // N:1 -> A Chave Estrangeira vai para o lado 'From' (N)
                    tableFrom.cols.push(`  fk_${tableTo.name}_${toPK} VARCHAR(255)`);
                    tableFrom.fks.push(`  FOREIGN KEY (fk_${tableTo.name}_${toPK}) REFERENCES ${tableTo.name} (${toPK})`);
                } else if (!fromN && toN) {
                    // 1:N -> A Chave Estrangeira vai para o lado 'To' (N)
                    tableTo.cols.push(`  fk_${tableFrom.name}_${fromPK} VARCHAR(255)`);
                    tableTo.fks.push(`  FOREIGN KEY (fk_${tableFrom.name}_${fromPK}) REFERENCES ${tableFrom.name} (${fromPK})`);
                } else {
                    // 1:1 -> Chave Estrangeira arbitrária no 'From' (como UNIQUE)
                    tableFrom.cols.push(`  fk_${tableTo.name}_${toPK} VARCHAR(255) UNIQUE`);
                    tableFrom.fks.push(`  FOREIGN KEY (fk_${tableTo.name}_${toPK}) REFERENCES ${tableTo.name} (${toPK})`);
                }
            });

            // 3. Resolver Generalização (Subclasses apontam PK/FK para Superclasse)
            model.generalizations.forEach(gen => {
                if (!gen.superclass) return;
                const supTable = tables[gen.superclass];
                if (!supTable) return;
                
                const supPK = getPKs(gen.superclass).length ? getPKs(gen.superclass)[0] : 'id';

                gen.subclasses.forEach(subId => {
                    const subTable = tables[subId];
                    if (!subTable) return;
                    
                    subTable.cols.push(`  fk_super_${supTable.name}_${supPK} VARCHAR(255) PRIMARY KEY`);
                    subTable.fks.push(`  FOREIGN KEY (fk_super_${supTable.name}_${supPK}) REFERENCES ${supTable.name} (${supPK})`);
                });
            });

            // 4. Montar String Final
            Object.values(tables).forEach(t => {
                sql += `CREATE TABLE ${t.name} (\n`;
                const defs = [...t.cols];
                
                // Adiciona Primary Key apenas se não foi definida como genérica
                if (t.pks.length > 0 && !t.cols.some(c => c.includes('PRIMARY KEY'))) {
                    defs.push(`  PRIMARY KEY (${t.pks.join(', ')})`);
                }
                defs.push(...t.fks);
                sql += defs.join(',\n') + '\n);\n\n';
            });

            // Disparar Download
            const dataStr = "data:text/sql;charset=utf-8," + encodeURIComponent(sql);
            const dlAnchor = document.createElement('a');
            dlAnchor.setAttribute("href", dataStr);
            dlAnchor.setAttribute("download", "script_banco.sql");
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            dlAnchor.remove();
        };

        onMounted(() => saveState());

        return {
            model, history, canUndo, canRedo, undo, redo, saveState,
            selectedItem, selectedType, selectItem, clearSelection,
            addElement, getEntity, getAttribute, removeSelected,
            startDrag, zoom, zoomIn, zoomOut, resetZoom, clearCache,
            fileInput, triggerFileInput, importJSON, exportJSON, generateSQL
        };
    }
};

createApp(DerApp).mount('#der-app');