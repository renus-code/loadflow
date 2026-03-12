import fs from "fs";
import path from "path";
import yaml from "yaml";

export async function GET() {
  const filePath = path.join(process.cwd(), "openapi.yaml");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const swaggerData = yaml.parse(fileContents);

  return new Response(JSON.stringify(swaggerData), {
    headers: { "Content-Type": "application/json" },
  });
}
