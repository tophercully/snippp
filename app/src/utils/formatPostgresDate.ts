function formatPostgresDate(postgresDate: string): string {
  const date = new Date(postgresDate);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export default formatPostgresDate;
