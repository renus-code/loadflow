/**
 * ======================================================================================
 * API ROUTE: Documentation Engine (Swagger/OpenAPI)
 * ======================================================================================
 * Serves the platform's API specification to the Swagger UI frontend.
 * 
 * Features:
 * 1. YAML-to-JSON Pipeline: Dynamically parses the root 'openapi.yaml' for real-time delivery.
 * 2. Specification Source: Acts as the source of truth for all external integrations.
 * 3. Dynamic Hydration: Allows the Swagger UI to reflect spec changes without rebuilds.
 * ======================================================================================
 */
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
