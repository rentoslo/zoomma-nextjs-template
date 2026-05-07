# =============================================================
# SETUP DE NOVO PROJETO — Zoomma Template
# Execute este script uma vez ao clonar o template
# =============================================================

$masterEnv = "$env:USERPROFILE\.env.master"
$localEnv  = ".env.local"

Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  Zoomma Template — Setup de Novo Projeto" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# --- 1. Configurar variáveis de ambiente ---

if (Test-Path $localEnv) {
    Write-Host "[OK] .env.local já existe. Pulando configuração de ambiente." -ForegroundColor Green
} elseif (Test-Path $masterEnv) {
    Copy-Item $masterEnv $localEnv
    Write-Host "[OK] .env.local criado a partir de ~/.env.master" -ForegroundColor Green
} else {
    Copy-Item ".env.example" $localEnv
    Write-Host "[ATENÇÃO] ~/.env.master não encontrado." -ForegroundColor Yellow
    Write-Host "          .env.local criado a partir de .env.example." -ForegroundColor Yellow
    Write-Host "          Preencha as chaves de API em .env.local antes de continuar." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Dica: crie o arquivo ~/.env.master com suas chaves reais para" -ForegroundColor DarkGray
    Write-Host "  não precisar preencher manualmente em cada projeto novo." -ForegroundColor DarkGray
}

Write-Host ""

# --- 2. Instalar dependências ---

Write-Host "[...] Instalando dependências npm..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Dependências instaladas." -ForegroundColor Green
} else {
    Write-Host "[ERRO] Falha ao instalar dependências. Verifique se o Node.js está instalado." -ForegroundColor Red
    exit 1
}

Write-Host ""

# --- 3. Verificar se o nome do projeto foi atualizado ---

$claudeMd = Get-Content "CLAUDE.md" -Raw
if ($claudeMd -match "\[NOME DO PROJETO\]") {
    Write-Host "[ATENÇÃO] Lembre de atualizar o nome do projeto em CLAUDE.md" -ForegroundColor Yellow
}

# --- Concluído ---

Write-Host ""
Write-Host "=================================================" -ForegroundColor Green
Write-Host "  Projeto pronto! Próximos passos:" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  1. Atualize o nome e contexto do projeto em CLAUDE.md"
Write-Host "  2. Abra o projeto no Claude Code (VS Code)"
Write-Host "  3. Comece a conversar — o Claude vai te guiar"
Write-Host ""
Write-Host "  Para iniciar o servidor de desenvolvimento:"
Write-Host "  > npm run dev" -ForegroundColor Cyan
Write-Host ""
