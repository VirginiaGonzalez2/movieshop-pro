/**
 * @ Author: Sabrina Bjurman
 * @ Create Time: 2026-02-24 12:12:46
 * @ Modified by: Sabrina Bjurman
 * @ Modified time: 2026-02-25 15:16:22
 * @ Description: Simplified input filter for input elements.
 */

import { InputEvent } from "react";

type InputEventHandler = (event: InputEvent<HTMLInputElement>) => void;

export function buildInputFilter(options: {
    numericsOnly?: true;
    filter?: string | RegExp;
    maxLength?: number;
}) {
    let onInput: InputEventHandler | undefined;

    function add(newFilter: InputEventHandler) {
        const oldFilter = onInput;
        onInput = oldFilter
            ? (event: InputEvent<HTMLInputElement>) => {
                  oldFilter(event);
                  newFilter(event);
              }
            : newFilter;
    }

    let filter = options.filter;
    if (options.numericsOnly) {
        filter = /[^\d]/;
    }

    if (filter) {
        add((event: InputEvent<HTMLInputElement>) => {
            if (event.defaultPrevented) return;

            if (event.data.match(filter)) {
                event.preventDefault();
            }
        });
    }

    if (options.maxLength) {
        const maxLength = options.maxLength;
        add((event: InputEvent<HTMLInputElement>) => {
            if (event.defaultPrevented) return;

            const length = event.currentTarget.value.length;
            if (length >= maxLength) {
                if (length > maxLength) {
                    event.currentTarget.value = event.currentTarget.value.substring(0, maxLength);
                }
                event.preventDefault();
            }
        });
    }

    if (!onInput) {
        throw new Error("buildInputFilter: Must add atleast one option.");
    }

    return onInput;
}
