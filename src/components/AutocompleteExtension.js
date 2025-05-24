import { autocompletion, completionKeymap } from "@codemirror/autocomplete";

// Suggestions HTML
const htmlTags = [
  "html",
  "head",
  "title",
  "meta",
  "link",
  "script",
  "style",
  "body",
  "header",
  "nav",
  "main",
  "section",
  "article",
  "aside",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "div",
  "span",
  "a",
  "img",
  "ul",
  "ol",
  "li",
  "table",
  "tr",
  "td",
  "th",
  "form",
  "input",
  "textarea",
  "button",
  "select",
  "option",
  "label",
];

const htmlAttributes = [
  "id",
  "class",
  "src",
  "href",
  "alt",
  "title",
  "type",
  "value",
  "name",
  "placeholder",
  "required",
  "disabled",
  "style",
  "onclick",
];

// Suggestions CSS
const cssProperties = [
  "color",
  "background",
  "background-color",
  "font-family",
  "font-size",
  "font-weight",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border",
  "border-radius",
  "width",
  "height",
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "z-index",
  "overflow",
  "text-align",
  "text-decoration",
  "flex",
  "justify-content",
  "align-items",
];

// Fonction d'autocomplétion simplifiée
const createCompletionSource = (language) => {
  return (context) => {
    const { state, pos } = context;
    const line = state.doc.lineAt(pos);
    const lineText = line.text;
    const posInLine = pos - line.from;
    const beforeCursor = lineText.slice(0, posInLine);

    let suggestions = [];
    let from = pos;
    let word = "";

    if (language === "html") {
      // Autocomplétion des balises HTML
      if (beforeCursor.match(/<\w*$/)) {
        word = beforeCursor.match(/<(\w*)$/)?.[1] || "";
        from = pos - word.length;
        suggestions = htmlTags
          .filter((tag) => tag.startsWith(word))
          .map((tag) => ({
            label: tag,
            type: "keyword",
            info: `Balise HTML <${tag}>`,
            apply: tag + ">",
          }));
      }
      // Autocomplétion des attributs HTML
      else if (
        beforeCursor.match(/\s\w*$/) &&
        beforeCursor.includes("<") &&
        !beforeCursor.includes(">")
      ) {
        word = beforeCursor.match(/\s(\w*)$/)?.[1] || "";
        from = pos - word.length;
        suggestions = htmlAttributes
          .filter((attr) => attr.startsWith(word))
          .map((attr) => ({
            label: attr,
            type: "property",
            info: `Attribut HTML ${attr}`,
            apply: attr + '=""',
          }));
      }
    }

    if (language === "css") {
      // Autocomplétion des propriétés CSS
      if (beforeCursor.match(/^\s*\w*$/) || beforeCursor.match(/;\s*\w*$/)) {
        word = beforeCursor.match(/(\w*)$/)?.[1] || "";
        from = pos - word.length;
        suggestions = cssProperties
          .filter((prop) => prop.startsWith(word))
          .map((prop) => ({
            label: prop,
            type: "property",
            info: `Propriété CSS ${prop}`,
            apply: prop + ": ",
          }));
      }
    }

    if (suggestions.length === 0) {
      return null;
    }

    return {
      from,
      options: suggestions,
    };
  };
};

// Extension d'autocomplétion simplifiée
export const createAutocompleteExtension = (language) => {
  // Ne créer l'autocomplétion que pour HTML et CSS
  if (language !== "html" && language !== "css") {
    return [];
  }

  try {
    return [
      autocompletion({
        override: [createCompletionSource(language)],
        activateOnTyping: true,
        maxRenderedOptions: 8,
        closeOnBlur: true,
      }),
    ];
  } catch (error) {
    console.warn("Erreur lors de la création de l'autocomplétion:", error);
    return [];
  }
};
