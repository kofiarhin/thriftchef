import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveProfile, createDefaultProfile } from "../features/profile/profileStorage";
import { apiRequest } from "./http";

describe("apiRequest device correlation", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("sends the saved anonymous id without exposing the profile", async () => {
    const profile = saveProfile(createDefaultProfile());
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest<{ ok: boolean }>("/api/test");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/test",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-anonymous-id": profile.anonymousId,
        }),
      }),
    );

    vi.unstubAllGlobals();
  });

  it("omits the header when no profile has been saved", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiRequest<{ ok: boolean }>("/api/test");

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.headers).not.toHaveProperty("x-anonymous-id");

    vi.unstubAllGlobals();
  });
});
