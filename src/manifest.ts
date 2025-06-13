import { readFileSync } from "fs";
import { z } from "zod";
import * as yaml from "js-yaml";

const hexColorSchema = z.preprocess(
  (val) => {
    return String(val);
  },
  z
    .string()
    .regex(
      /^([0-9a-fA-F]{6})$/,
      "Invalid hex color format. Expected 6 hexadecimal characters (e.g., 'RRGGBB').",
    ),
);

const LabelManifestSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: hexColorSchema,
});
const LabelManifestSchemaArray = z.array(LabelManifestSchema);
type LabelManifest = z.infer<typeof LabelManifestSchemaArray>;

const loadManifest = (manifestPath: string): LabelManifest => {
  const manifestContent = readFileSync(manifestPath, "utf8");
  const parsedYaml: unknown = yaml.load(manifestContent);

  // Validate the parsed object against the schema
  return LabelManifestSchemaArray.parse(parsedYaml);
};

export { loadManifest };
