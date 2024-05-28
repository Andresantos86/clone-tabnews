const{exec} = require ("node:child_process")

function chekPostgres () {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(erro, stdout){
    if(stdout.search("accepting connections") === -1){
      process.stdout.write(".")
      chekPostgres();
      return;
    }
    console.log("\n Postgres Já está pronto e aceitando conexões")
  }
}

console.log("Aguardando postgres aceitar conexões")
chekPostgres();