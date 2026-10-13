/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VoiceSearchElement from "./VoiceSearchElement.tsx";
import { createSearchClient, lastQuery } from "../../test/searchClient.ts";
import { renderWithSearch } from "../../test/renderWithSearch.tsx";

class FakeSpeechRecognition extends EventTarget {
  static instances: FakeSpeechRecognition[] = [];
  interimResults = false;
  start = mock();
  stop = mock();

  constructor() {
    super();
    FakeSpeechRecognition.instances.push(this);
  }

  say(transcript: string) {
    const results = [Object.assign([{ transcript }], { isFinal: true })];
    this.dispatchEvent(Object.assign(new Event("result"), { results }));
    this.dispatchEvent(new Event("end"));
  }
}

const speechWindow = window as unknown as { webkitSpeechRecognition?: typeof FakeSpeechRecognition };

const micPath = () => screen.getByTitle("Search by voice").querySelector("path")!;

describe("VoiceSearchElement", () => {
  test("renders nothing when the browser cannot recognize speech", async () => {
    const client = createSearchClient();
    const { container } = renderWithSearch(<VoiceSearchElement />, client, "");
    await waitFor(() => expect(client.search).toHaveBeenCalled());

    expect(container.innerHTML).toBe("");
  });

  describe("with speech recognition", () => {
    beforeEach(() => {
      FakeSpeechRecognition.instances = [];
      speechWindow.webkitSpeechRecognition = FakeSpeechRecognition;
    });

    afterEach(() => {
      delete speechWindow.webkitSpeechRecognition;
    });

    test("starts listening when the mic is clicked", async () => {
      renderWithSearch(<VoiceSearchElement />, createSearchClient(), "");

      await userEvent.click(await screen.findByTitle("Search by voice"));

      const [recognition] = FakeSpeechRecognition.instances;
      expect(recognition.start).toHaveBeenCalledTimes(1);
      expect(recognition.interimResults).toBe(true);
    });

    test("fills the mic while waiting for speech", async () => {
      renderWithSearch(<VoiceSearchElement />, createSearchClient(), "");
      await userEvent.click(await screen.findByTitle("Search by voice"));
      expect(micPath().getAttribute("fill")).toBe("");

      act(() => {
        FakeSpeechRecognition.instances[0].dispatchEvent(new Event("start"));
      });

      expect(micPath().getAttribute("fill")).toBe("currentColor");
    });

    test("searches what was said once speaking ends", async () => {
      const client = createSearchClient();
      renderWithSearch(<VoiceSearchElement />, client, "");
      await userEvent.click(await screen.findByTitle("Search by voice"));

      act(() => {
        FakeSpeechRecognition.instances[0].say("spring boot");
      });

      await waitFor(() => expect(lastQuery(client)?.query).toBe("spring boot"));
    });

    test("stops listening when the mic is clicked again", async () => {
      renderWithSearch(<VoiceSearchElement />, createSearchClient(), "");
      await userEvent.click(await screen.findByTitle("Search by voice"));

      await userEvent.click(screen.getByTitle("Search by voice"));

      expect(FakeSpeechRecognition.instances[0].stop).toHaveBeenCalledTimes(1);
    });
  });
});
