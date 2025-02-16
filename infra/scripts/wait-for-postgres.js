const { exec } = require("node:child_process");

function chekPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn); // diz se o postgres esta rodando e na porta tcp/ip
  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      chekPostgres();
      return;
    }
    console.log("\n😁 Postgres Já está pronto e aceitando conexões!\n");
  }
}

process.stdout.write("\n\n🥱 Aguardando postgres aceitar conexões\n");
chekPostgres();
