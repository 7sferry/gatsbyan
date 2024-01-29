/************************
 * Made by [MR Ferry™]  *
 * on Januari 2024      *
 ************************/

import type {
  VoiceSearchConnectorParams,
  VoiceSearchWidgetDescription,
} from "instantsearch.js/es/connectors/voice-search/connectVoiceSearch";
import connectVoiceSearch from "instantsearch.js/es/connectors/voice-search/connectVoiceSearch";
import React from "react";
import { useConnector } from "react-instantsearch";

const useVoiceSearch = (props?: VoiceSearchConnectorParams) =>
  useConnector<VoiceSearchConnectorParams, VoiceSearchWidgetDescription>(connectVoiceSearch, props);

export function VoiceSearchElement(props: VoiceSearchConnectorParams) {
  const { isBrowserSupported, toggleListening, voiceListeningState } = useVoiceSearch(props);
  if (!isBrowserSupported) {
    return <></>;
  }
  return (
    <div className="ais-VoiceSearch">
      <button onClick={toggleListening} className="ais-VoiceSearch-button" type="button" title="Search by voice">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
            fill={voiceListeningState.status === "waiting" ? "currentColor" : ""}
          ></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>
      <div className="ais-VoiceSearch-status">
        <p></p>
      </div>
    </div>
  );
}

export default VoiceSearchElement;
