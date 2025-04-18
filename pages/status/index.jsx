import useSWR from "swr";

async function fetchStatus() {
  const response = await fetch("api/v1/status");
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
    </>
  );
}

function UpdateAt() {
  const labels = {
    version: "Versão",
    max_connections: "Máximo de Conexões",
    opened_connections: "Conexões Abertas",
  };

  const { isLoading, data } = useSWR("status", fetchStatus, {
    refreshInterval: 2000,
  });

  let update_at = "Carregando...";
  if (!isLoading && data) {
    update_at = new Date(data.update_at).toLocaleString("pt-BR");
  }
  const database = Object.entries(data?.dependencies.database || {});
  return (
    <>
      <span>Última atualização: {update_at}</span>
      <div style={{ margin: "8px 0 0 0" }}>
        {database.map(([key, value]) => (
          <div key={key} style={{ padding: "2px 0" }}>
            <span>{labels[key]}: </span>
            <span> {value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
