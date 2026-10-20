import { Plugin, RichTextField, Node as TiptapNode } from "@examplary/ui";
import type { Editor } from "@tiptap/core";
import type { Transaction } from "@tiptap/pm/state";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

import { BLANK } from "./shared";

// The tiptap exports are only available from newer versions of @examplary/ui,
// which the platform provides at runtime
export const supportsBlankEditor = typeof TiptapNode === "function";

type RenderBlank = (index: number, isNew: boolean) => ReactNode;

export type BlankEditorHandle = { insertBlank: () => void };

// For every blank, the index it had before a change, or if it's new, the
// correct answer to start it off with
export type BlankOrder = (number | string)[];

// Set on a transaction with the position of a blank that was just added
const NEW_BLANK = "newBlank";
// Set on a transaction with the correct answer for the blank it adds
const NEW_BLANK_ANSWER = "newBlankAnswer";

let nextBlankId = 0;

// Turns every `___` in the text into a blank node, both for typed text and
// for content loaded into the editor
const replaceBlankText: Plugin["spec"]["appendTransaction"] = (
  transactions,
  _oldState,
  state,
) => {
  const positions: number[] = [];
  state.doc.descendants((node, pos) => {
    for (const match of node.text?.matchAll(/___/g) ?? []) {
      positions.push(pos + match.index);
    }
  });

  const tr = state.tr;
  for (const pos of [...positions].reverse()) {
    const blank = state.schema.nodes.blank.create({ id: nextBlankId++ });
    tr.replaceWith(pos, pos + BLANK.length, blank);
  }

  // A blank that was copied and pasted gets an id of its own
  const ids = new Set<number>();
  tr.doc.descendants((node, pos) => {
    if (node.type.name !== "blank") return;
    if (ids.has(node.attrs.id)) tr.setNodeAttribute(pos, "id", nextBlankId++);
    ids.add(node.attrs.id);
  });

  // Content that is loaded rather than typed is set without an update
  const loaded = transactions.some((t) => t.getMeta("preventUpdate"));
  if (positions.length && !loaded) tr.setMeta(NEW_BLANK, positions[0]);

  return tr.docChanged ? tr : null;
};

// Each blank is an empty placeholder in the editor, which `BlankEditor` fills
// with a chip. Set on the plugin rather than with `addNodeView`, as tiptap
// drops those on unmount and its fallback, `renderHTML`, is text.
const blankNodeView = () => {
  const dom = document.createElement("span");
  dom.dataset.blank = "";
  return { dom, stopEvent: () => true };
};

// Rendered back to `___`, so the stored question text still contains its
// blanks. Wrapped in a span, as ProseMirror reads a bare string as a tag name.
const createBlankNode = () =>
  TiptapNode.create({
    name: "blank",
    group: "inline",
    inline: true,
    atom: true,

    // Only kept in the editor, so ProseMirror can tell the blanks apart.
    // Otherwise, as they would all be the same, it may reuse the placeholder
    // of one blank for another, which moves its chip along with it.
    addAttributes: () => ({
      id: { default: null, rendered: false, parseHTML: () => null },
    }),

    renderHTML: () => ["span", BLANK],
    renderText: () => BLANK,

    addProseMirrorPlugins: () => [
      new Plugin({
        appendTransaction: replaceBlankText,
        props: { nodeViews: { blank: blankNodeView } },
      }),
    ],

    onCreate() {
      // The initial content is set without a transaction, so dispatch an
      // empty one to have its blanks replaced too
      const tr = this.editor.state.tr;
      tr.setMeta("preventUpdate", true).setMeta("addToHistory", false);
      this.editor.view.dispatch(tr);
    },
  });

const extensions = supportsBlankEditor ? [createBlankNode()] : [];

const blankPositions = (doc: Transaction["doc"]) => {
  const positions: number[] = [];
  doc.descendants((node, pos) => {
    if (node.type.name === "blank") positions.push(pos);
  });
  return positions;
};

const getMeta = (transactions: Transaction[], key: string) =>
  transactions
    .map((tr) => tr.getMeta(key))
    .find((value) => value !== undefined);

// Follows the blanks through a change, so the settings of each blank can move
// along with it when blanks are added or removed in between others. Null if
// no blank moved.
const getBlankOrder = (transactions: Transaction[]): BlankOrder | null => {
  const mapped = blankPositions(transactions[0].before).map((pos) => {
    for (const tr of transactions) {
      const result = tr.mapping.mapResult(pos);
      if (result.deletedAfter) return null;
      pos = result.pos;
    }
    return pos;
  });

  const newBlank = getMeta(transactions, NEW_BLANK);
  const answer = getMeta(transactions, NEW_BLANK_ANSWER) ?? "";
  const order = blankPositions(transactions.at(-1)!.doc).map((pos) => {
    const index = mapped.indexOf(pos);
    if (index !== -1) return index;
    return pos === newBlank ? answer : "";
  });

  const unchanged =
    order.length === mapped.length && order.every((index, i) => index === i);
  return unchanged ? null : order;
};

// Stable ids for the blank placeholders, to key their portals by. Keyed by
// index instead, a blank added before others would take over the chip (and
// its state) of the blank that was there.
const placeholderIds = new WeakMap<Element, number>();
let nextPlaceholderId = 0;
const placeholderId = (blank: Element) => {
  if (!placeholderIds.has(blank)) {
    placeholderIds.set(blank, nextPlaceholderId++);
  }
  return placeholderIds.get(blank);
};

// Portals `renderBlank(index, isNew)` into each blank placeholder, which are
// looked up again after every change to the editor
const BlankChips = ({
  editor,
  editorRef,
  container,
  renderBlank,
  onBlankOrder,
}: {
  editor: Editor | null;
  editorRef: RefObject<Editor | null>;
  container: RefObject<HTMLElement | null>;
  renderBlank: RenderBlank;
  onBlankOrder: (order: BlankOrder | null) => void;
}) => {
  const [blanks, setBlanks] = useState<Element[]>([]);
  const [newBlank, setNewBlank] = useState<Node | null>(null);

  useEffect(() => {
    editorRef.current = editor;

    const findBlanks = ({
      transaction,
      appendedTransactions = [],
    }: {
      transaction?: Transaction;
      appendedTransactions?: Transaction[];
    } = {}) => {
      setBlanks(
        Array.from(container.current?.querySelectorAll("[data-blank]") ?? []),
      );

      if (!transaction) return;
      const transactions = [transaction, ...appendedTransactions];

      // Loaded content replaces the blanks rather than moving them
      if (transaction.docChanged && !transaction.getMeta("preventUpdate")) {
        onBlankOrder(getBlankOrder(transactions));
      }

      const pos = getMeta(transactions, NEW_BLANK);
      if (pos !== undefined) setNewBlank(editor?.view.nodeDOM(pos) ?? null);
    };

    findBlanks();
    editor?.on("transaction", findBlanks);
    return () => {
      editor?.off("transaction", findBlanks);
    };
  }, [editor, editorRef, container, onBlankOrder]);

  return blanks.map((blank, index) =>
    createPortal(
      renderBlank(index, blank === newBlank),
      blank,
      `blank-${placeholderId(blank)}`,
    ),
  );
};

// The end of the last paragraph, where text would be added
const endOfText = (editor: Editor) => {
  let end = 0;
  editor.state.doc.descendants((node, pos) => {
    if (node.isTextblock) end = pos + node.nodeSize - 1;
  });
  return end;
};

export const BlankEditor = ({
  ref,
  value,
  onChange,
  placeholder,
  renderBlank,
}: {
  ref?: Ref<BlankEditorHandle>;
  value: string;
  // With the new order of the blanks, if any moved
  onChange: (value: string, order: BlankOrder | null) => void;
  placeholder?: string;
  renderBlank: RenderBlank;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const hasCursor = useRef(false);

  // Set on every change, right before tiptap calls `onChange` for it
  const blankOrder = useRef<BlankOrder | null>(null);
  const onBlankOrder = useCallback((order: BlankOrder | null) => {
    blankOrder.current = order;
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      // Typed as text, so it's turned into a blank (and opened) just like
      // typed underscores. Not focusing the editor, as tiptap does that a
      // frame later, which would close the blank's popover again.
      insertBlank: () => {
        const editor = editorRef.current;
        if (!editor) return;
        if (!hasCursor.current) {
          editor.commands.insertContentAt(endOfText(editor), BLANK);
          return;
        }

        // Selected text is replaced by the blank, and becomes its answer
        const { from, to } = editor.state.selection;
        const answer = editor.state.doc.textBetween(from, to, " ").trim();
        editor
          .chain()
          .setMeta(NEW_BLANK_ANSWER, answer)
          .insertContent(BLANK)
          .run();
      },
    }),
    [],
  );

  return (
    <div
      ref={container}
      onFocus={(e) => {
        // Also fires for the blanks' popovers, which aren't the editor
        if (e.target === editorRef.current?.view.dom) hasCursor.current = true;
      }}
    >
      <RichTextField
        value={value}
        onChange={(value: string) => {
          onChange(value, blankOrder.current);
          blankOrder.current = null;
        }}
        placeholder={placeholder}
        extensions={extensions}
        slotBefore={(editor) => (
          <BlankChips
            editor={editor}
            editorRef={editorRef}
            container={container}
            renderBlank={renderBlank}
            onBlankOrder={onBlankOrder}
          />
        )}
        className="w-full leading-7"
      />
    </div>
  );
};
