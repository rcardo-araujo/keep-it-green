# Guia de Autenticação Multi-contas (GitHub)

← [Voltar ao README](./README.md)

Se você utiliza o **Keep It Green** em uma máquina de trabalho que já possui credenciais globais da instituição configuradas (via SSH ou HTTPS), o Git tentará enviar os commits usando a conta corporativa. Isso resultará em um erro de permissão (*Permission Denied*) ao tentar dar push no seu repositório pessoal.

Para resolver isso, escolha um dos métodos abaixo para configurar a autenticação correta exclusivamente para o seu repositório pessoal *dummy*.

## Método 1: HTTPS com Personal Access Token (PAT)

Este método sobrescreve qualquer credencial global do Git incluindo o seu token de acesso pessoal diretamente na URL de sincronização do repositório pessoal.

#### Criar o token no GitHub
1. No seu GitHub pessoal, acesse: **Settings** > **Developer Settings** > **Personal Access Tokens** > **Tokens (classic)**.
2. Clique em **Generate new token (classic)**.
3. Dê um nome (ex: `keep-it-green`) e selecione a permissão **`repo`** (necessária para realizar o push em repositórios).
4. Gere o token e **copie-o** (ele não será exibido novamente).

#### Configurar o repositório local
Abra o terminal na pasta do seu repositório pessoal *dummy* local e execute o comando abaixo, substituindo `<seu-token>` pelo token gerado, `<seu-usuario>` pelo seu usuário do GitHub e `<nome-do-repo>` pelo nome do seu repositório:

```bash
git remote set-url origin https://<seu-token>@github.com/<seu-usuario>/<nome-do-repo>.git
```

Pronto! O Git agora usará esse token sempre que fizer push a partir deste repositório, ignorando as credenciais globais.

## Método 2: SSH com Alias de Host

Se você utiliza chaves SSH para se autenticar e deseja separar sua chave pessoal da corporativa.

#### Gerar uma nova chave SSH para seu GitHub pessoal
Execute o comando abaixo, salvando com um nome diferente do padrão da empresa (ex: `id_rsa_pessoal`):
```bash
ssh-keygen -t ed25519 -C "seu-email-pessoal@email.com" -f ~/.ssh/id_ed25519_pessoal
```

Em seguida, adicione a nova chave ao agente SSH da sua sessão:
```bash
ssh-add ~/.ssh/id_ed25519_pessoal
```

> [!IMPORTANT]
> Sem este passo, o agente SSH continuará usando a chave padrão da máquina (provavelmente a corporativa) e a autenticação falhará silenciosamente.

#### Adicionar a chave pública no seu GitHub pessoal
Exiba e copie o conteúdo da chave pública gerada:
```bash
cat ~/.ssh/id_ed25519_pessoal.pub
```

Copie toda a saída do comando e adicione em **Settings** > **SSH and GPG keys** > **New SSH key** no seu GitHub pessoal.

#### Configurar o arquivo `~/.ssh/config`
Abra ou crie o arquivo de configuração SSH:
```bash
nano ~/.ssh/config
```

Adicione um alias para o seu GitHub pessoal:
```text
# Conta Pessoal
Host github.com-pessoal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_pessoal
```

#### Ajustar o repositório local
Altere o endereço remoto do seu repositório local para utilizar o alias `github.com-pessoal`:
```bash
git remote set-url origin git@github.com-pessoal:seu-usuario/seu-repositorio.git
```
