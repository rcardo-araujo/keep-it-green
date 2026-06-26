<p align="center">
  <img src="./assets/banner.png" alt="Keep It Green Banner" width="100%"/>
</p>

<h1 align="center">Keep It Green</h1>

<p align="center">
  Mantenha seu GitHub pessoal ativo enquanto você trabalha em repositórios privados corporativos e acadêmicos.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License MIT"/>
  </a>
  <img src="https://img.shields.io/badge/Java-17%2B-orange?logo=openjdk" alt="Java 17+"/>
  <img src="https://img.shields.io/badge/Build-Maven-red?logo=apachemaven" alt="Maven"/>
  <img src="https://img.shields.io/badge/Platform-Linux%20%7C%20Windows-blue" alt="Platform"/>
</p>

# Sobre

O **Keep It Green** é uma ferramenta automática e segura para manter seu perfil pessoal do GitHub ativo enquanto você trabalha em repositórios privados (corporativos ou acadêmicos). Ele lê o histórico de commits das suas pastas de trabalho locais e replica commits vazios com os mesmos timestamps em um repositório pessoal, sem expor nenhuma linha de código ou informação sensível.

## Instalação e configuração

Siga o passo a passo abaixo para configurar e rodar o **Keep It Green** no Linux.

#### Instalar o Java 17

Verifique se o Java já está instalado e qual a versão:
```bash
java -version
```

Caso precise instalar o Java 17, execute:
```bash
sudo apt update
sudo apt install openjdk-17-jdk -y
```

Confirme a instalação:
```bash
java -version
# Saída esperada: openjdk version "17.x.x" ...
```

#### Instalar o Maven

Verifique se o Maven já está instalado:
```bash
mvn -version
```

Caso precise instalar:
```bash
sudo apt install maven -y
```

Confirme a instalação:
```bash
mvn -version
# Saída esperada: Apache Maven 3.x.x ...
```

#### Clonar o repositório

```bash
git clone https://github.com/rcardo-araujo/keep-it-green.git
cd keep-it-green
```

#### Preparar o repositório pessoal (*dummy*)

Para que os quadradinhos verdes apareçam no seu perfil, o repositório local onde os commits vazios são gerados precisa estar conectado a um repositório remoto no seu GitHub:

1. No seu GitHub pessoal, crie um novo repositório (ex: `nome-empresa-commits`).
2. Clone esse repositório em sua máquina local:
   ```bash
   git clone https://github.com/<seu-usuario>/<nome-do-repositorio>.git /home/usuario/projetos/meu-repositorio-dummy
   ```
   *(O caminho local ao final é o que você usará como `destinationRepoPath` no próximo passo.)*

> [!WARNING]
> Se a sua máquina de trabalho já está configurada com a conta do GitHub da sua instituição, consulte o [**Guia de Autenticação Multi-contas (AUTH_GITHUB.md)**](./AUTH_GITHUB.md) para configurar o acesso seguro ao seu repositório pessoal.

#### Configurar o `config.json`

Copie o arquivo de exemplo fornecido no projeto:
```bash
cp config_example.json config.json
```

> [!NOTE]
> O arquivo `config.json` está listado no `.gitignore` do projeto. Isso garante que suas informações pessoais (e-mail e caminhos de pastas) nunca sejam enviadas acidentalmente ao GitHub.

Agora, abra o `config.json` no seu editor preferido e preencha os campos:
```bash
nano config.json
```

```json
{
  "authorEmail": "seu_email_da_empresa@empresa.com",
  "destinationRepoPath": "/home/usuario/projetos/meu-repositorio-dummy",
  "sourceRepoPaths": [
    "/home/usuario/projetos/projeto-da-empresa-1",
    "/home/usuario/projetos/projeto-da-empresa-2"
  ]
}
```

| Campo                 | Descrição                                                                        |
|-----------------------|----------------------------------------------------------------------------------|
| `authorEmail`         | O e-mail que você usa para fazer commits nos repositórios da instituição             |
| `destinationRepoPath` | Caminho local do seu repositório pessoal *dummy* (onde os commits serão criados) |
| `sourceRepoPaths`     | Lista de caminhos locais dos repositórios da empresa que você quer monitorar     |

#### Gerar o arquivo `.jar`

Com o `config.json` configurado, gere o arquivo executável final com o Maven:
```bash
mvn clean package
```

Após o comando finalizar com sucesso (`BUILD SUCCESS`), o arquivo executável estará disponível em:
```
target/keep-it-green-1.0-SNAPSHOT.jar
```

Para testar se tudo está funcionando corretamente, execute manualmente uma vez:
```bash
java -jar target/keep-it-green-1.0-SNAPSHOT.jar
```

Para verificar se os commits foram criados, basta verificar o log (`git log --oneline`) do seu repositório *dummy* local.

#### Agendar com o Crontab

Para que a sincronização aconteça automaticamente, vamos configurar o agendador do Linux.

Primeiro, descubra o caminho absoluto do Java na sua máquina:
```bash
which java
# Exemplo de saída: /usr/bin/java
```

Agora abra o editor do crontab:
```bash
crontab -e
```

Adicione a seguinte linha ao final do arquivo, ajustando os caminhos conforme a sua máquina. O exemplo abaixo configura a execução **a cada 3 horas entre 9h e 22h**:

```text
0 9-22/3 * * * cd /home/usuario/keep-it-green && /usr/bin/java -jar target/keep-it-green-1.0-SNAPSHOT.jar >> sync.log 2>&1
```

> [!IMPORTANT]
> Sempre use caminhos absolutos no crontab. O agendador roda em um ambiente minimalista e não sabe onde estão seus arquivos se você usar caminhos relativos.

Salve e feche o arquivo. A partir de agora, a sincronização ocorrerá automaticamente nos horários configurados.

Para verificar se o crontab foi salvo corretamente:
```bash
crontab -l
```

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais informações.