<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# CONTROLL — Memória do Projeto (atualizado 2026-06-30)

## O que é este sistema
Sistema de controle administrativo do IEF/NAR Guanhães (Instituto Estadual de Florestas, MG).
Servidor: James. Chefia: Márcio. NUREG Rio Doce: Sara (sara.oliveira@meioambiente.mg.gov.br).
Análise técnica: Paulo. AFLOBIO Peçanha: Ana Célia (atende DCF de alguns municípios).

## Stack
- Next.js 15, App Router, TypeScript strict
- Tailwind CSS escuro: slate-950/900/800, emerald para ações, indigo para DCMG/AIA
- Estado global: React Context (AppContext) + localStorage (`narflow_v4_*`)
- SEM banco de dados, SEM backend, SEM telefones (apenas primeiro nome + e-mail — LGPD)

## Tipos de processo
- **AIA** — Intervenção Ambiental (Autorização de Intervenção Ambiental)
- **DCF** — Declaração de Corte e Fora (produção florestal)
- **Simples Declaração** — declaração florestal simplificada

## Arquitetura atual (pós-refactor fluxo)
Cada processo é um **fluxo linear início-meio-fim** (fases colapsáveis, progresso no topo).
Checkboxes auto-salvam via `updateProcess` — sem botão "Salvar" para etapas de fluxo.

### AIA — 4 fases
1. Triagem: intervenções, responsável técnico, parse SEI, checklist 19 itens (Res. 3102/2021), `pendenciasNotificadas`
2. Instrução SEI: `despachoInstrucaoCriado`, `memorandoAnalistaCriado`, `encaminhadoAnalise`, validação chefia
3. Análise Técnica: `analiseTecnicaConcluida` (aguardar Paulo)
4. Finalização: `despachoFinalCriado`, `encaminhadoSistemaDecisoes` (Sara/NUREG), `sinaflorAtualizado`, isFinalized, blocoInterno

**Contador DCMG** (card indigo acima das fases): campo numérico que James atualiza manualmente
conforme o sistema DCMG (pode ter pausas — não é calculado automaticamente).
- ≥ 90 dias = crítico (vermelho), ≥ 60 = atenção (âmbar), > 0 = ok (verde)
- Campo: `aiaData.contagemDCMG` (number, opcional, default 0)

### DCF — 3 fases
1. Conferência documental: 12 checkboxes booleanos + produtoDeclarado/volumeDeclarado
2. Aceite e Instrução: `despachoAceiteCriado`, `memorandoDistribuicaoCriado`, [`encaminhadoAflobio` se município AFLOBIO], `emAcompEspecialDCFs`, `processoConcluidoNAR`
3. Finalização: `saldoSiamLancado`, `despachoAvaliacaoCriado`, `intimacaoEletronicaCriada`, isFinalized, blocoInterno

Municípios AFLOBIO Peçanha (DCF): Coroaci, Virgolândia, Peçanha, Cantagalo, São João Evangelista, São Pedro do Suaçuí, São José do Jacuri, Virginópolis.

### Simples Declaração — 3 fases
1. Entrada: `conferidoDocumentos`
2. Instrução: `memorandoAnalistaCriado`
3. Conclusão: `analiseTecnicaConcluida`, `intimacaoEletronicaCriada`, isFinalized, blocoInterno

## Dashboard — seções
1. Indicadores (4 cards): Novos, Triagem, Aguardando Márcio, Finalizados no Mês
2. Secundários (3): Análise Técnica, Assinatura, Intimação/Resposta
3. **Hoje eu preciso olhar**: processos atrasados >20d, finalizados sem bloco, acompanhamentos especiais
4. **Prazos Legais** (Lei 14.184/2002): alertas automáticos para
   - AIA sem triagem após 5 dias (nenhum checklist respondido)
   - AIA com DCMG ≥ 60 dias
   - Qualquer processo >30 dias não finalizado

## Arquivos-chave
- `src/types.ts` — interfaces: AiaProcessData, DcfProcessData, SimplesProcessData, Process
- `src/context/AppContext.tsx` — estado global, localStorage, addProcess/updateProcess
- `src/components/Aia.tsx` — fluxo AIA completo
- `src/components/Dcf.tsx` — fluxo DCF completo
- `src/components/SimplesDeclaracao.tsx` — fluxo Simples
- `src/components/Dashboard.tsx` — painel + alertas legais

## Regras críticas
1. **Sem telefones** — apenas primeiro nome e e-mail (constraint de privacidade/LGPD permanente)
2. **Fluxo preservado** — qualquer alteração visual mantém: menu, rota, botão, action, permissões, multiempresa
3. **Campos opcionais `?`** — novos campos em types.ts sempre opcionais para backward compat com localStorage existente
4. **Auto-save** — toggles de flow salvam imediatamente; `handleSave` só para campos de texto livres
5. **Filesystem bash** — bash acessa o projeto via mount CIFS; Write/Edit via file tools é diferente do bash. Usar Python via bash para garantir sync. `git` operations deixam index.lock — usar `os.rename()` via Python para contornar.
6. **gitigone lixo/** — pasta ignorada no .gitignore (dados pessoais/WhatsApp)

## Normas legais principais
- Lei 14.184/2002 — processo administrativo MG (30 dias diligência)
- Res. Conjunta SEMAD/IEF 3.102/2021 — checklist AIA (19 itens)
- Decreto 47.749/2019 — AIA e produção florestal MG
- Res. 1.914/2013 — restituição de taxas
- Lei 12.651/2012 — Código Florestal Federal
