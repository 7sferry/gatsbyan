/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2026      *
 ************************/

import userEvent from "@testing-library/user-event";

/**
 * Sets up user-event without its default setTimeout(0) after every keystroke and click,
 * which takes ~16ms each on Windows and made typing tests several times slower.
 * Call it at the start of each test, like userEvent.setup.
 */
export const setupUser = () => userEvent.setup({ delay: null });
