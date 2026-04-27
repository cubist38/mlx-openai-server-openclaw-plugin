import { describe, expect, it } from "vitest";
import manifest from "./openclaw.plugin.json" with { type: "json" };
import packageJson from "./package.json" with { type: "json" };

describe("OpenClaw plugin metadata", () => {
  it("declares the provider in the manifest and package metadata", () => {
    expect(manifest.id).toBe("mlx-openai-server");
    expect(manifest.providers).toEqual(["mlx-openai-server"]);
    expect(packageJson.openclaw.extensions).toEqual(["./index.ts"]);
    expect(packageJson.openclaw.providers).toEqual(["mlx-openai-server"]);
  });

  it("advertises ClawHub compatibility metadata", () => {
    expect(packageJson.openclaw.compat.pluginApi).toBe(">=2026.3.24-beta.2");
    expect(packageJson.openclaw.compat.minGatewayVersion).toBe("2026.3.24-beta.2");
    expect(packageJson.openclaw.build.openclawVersion).toBe("2026.3.24-beta.2");
    expect(packageJson.openclaw.build.pluginSdkVersion).toBe("2026.3.24-beta.2");
  });
});
