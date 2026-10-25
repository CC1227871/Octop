import { App } from "antd";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProviderRow } from "../../useProviders";
import { ProviderConfigModal } from "./ProviderConfigModal";

function renderModal(models: ProviderRow["models"]) {
  const provider: ProviderRow = {
    id: 1,
    name: "custom-provider",
    kind: "openai",
    base_url: "https://example.com/v1",
    api_key: "sk-test",
    models,
    note: null,
    enabled: true,
  };

  return render(
    <App>
      <ProviderConfigModal
        provider={provider}
        open
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />
    </App>,
  );
}

function selectedDefaultModel(): Element | null {
  const label = screen.getByText("models.defaultModelLabel");
  const formItem = label.closest(".ant-form-item");
  return formItem?.querySelector(".ant-select-selection-item") ?? null;
}

describe("ProviderConfigModal default model", () => {
  it("selects the first enabled model when the first provider model is disabled", async () => {
    renderModal([
      { id: "disabled-model", name: "disabled-model", enabled: false },
      { id: "enabled-model", name: "enabled-model", enabled: true },
    ]);

    await waitFor(() => {
      expect(selectedDefaultModel()).toHaveAttribute("title", "enabled-model");
    });
  });

  it("leaves the default model empty when every model is disabled", async () => {
    renderModal([
      { id: "disabled-model", name: "disabled-model", enabled: false },
    ]);

    await waitFor(() => {
      expect(selectedDefaultModel()).toHaveAttribute("title", "");
    });
  });
});
