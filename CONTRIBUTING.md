# Contributing Guide

Hi! I'm really excited that you're interested in contributing to this project! Before submitting your contribution, please read through the following guide 🚀

## Repo Setup

To develop and test the application:

1. Run `npm install`/`npm i` in the project's root folder.

2. Run `npm run dev` in the project's root folder.

## Available scripts

| Command | Description |
| :--- | :--- |
| `analyze` | Analyze build bundle size (needs build and sourcemaps enabled) |
| `start` | Starts development serve |
| `dev` | Shorthand for `start` |
| `dev:build` | Starts development server in production mode |
| `dev:serve` | Starts development serve in production mode without building |
| `build` | Builds for production |
| `lint` | Run ESLint and show messages in console |
| `lint:fix` | Run ESLint and fixed any automatically fixable error |
| `prettier` | Run Prettier and show messages in console |
| `prettier:fix` | Run Prettier and formate supported files |
| `format` | Shorthand for `lint:fix` and `prettier:fix` |

## Debugging

To use breakpoints and explore code execution, you can use the ["Run and Debug"](https://code.visualstudio.com/docs/editor/debugging) feature from VS Code.

1. Add a `debugger` statement where you want to stop the code execution.

2. Click the "Run and Debug" icon in the activity bar of the editor, which opens the [_Run and Debug view_](https://code.visualstudio.com/docs/editor/debugging#_run-and-debug-view).

3. Click the "JavaScript Debug Terminal" button in the _Run and Debug view_, which opens a terminal in VS Code.

4. The execution will stop at the `debugger` statement, and you can use the [Debug toolbar](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) to continue, step over, and restart the process...

### Debug Logging

We are using [`loglevel`](https://github.com/pimterry/loglevel) in our application, for more information about it, please visit the main repository.

When running the application on development mode, the logger log level (`src/utils/logger.js`) will automatically set to debug.

If instead, you are running the application on production mode, the default log level is warn.
You can still access it from the console using `window.Logger` or changing in manually using `Logger.setLevel(level, [persist: boolean])` or setting the log level in the LocalStorage with the key `loglevel` and one of the following values:

- `TRACE` _(default development)_
- `DEBUG`
- `INFO`
- `WARN` _(default production)_
- `ERROR`
- `SILENT`

### Debugging the Service Worker

Only available in development mode. If sourcemaps are not already enabled, you will have to manually set ON the sourcemaps (`build.sourcemap`) inside the Vite configuration (`vite.config.js`) and for the `vite-plugin-pwa` plugin configuration inside `scripts/viteServiceWorker.js`, enable `workbox.sourcemap` and `devOptions.enabled`.

To add breakpoints to the service worker, after building it and AFTER visiting the site, a new folder will be generated in the root of the project: `dev-dist`. This folder contains the `sw.js` and `workbox-{id}.json` as well as their respective sourcemaps, if enabled.

Please, note that you will have to manually remove the service worker cache when working and some fonts may not load.

### Mobile Debug Logging

If you are unable to use the `USB Debugging` with any browser, please place the following snippet at the top or bottom of `body` tag, on the `index.html`:

```HTML
<ul id="console-container"></ul>
<script>
  // https://stackoverflow.com/a/60118035
  ;(function () {
    let printOnScreen = function (...args) {
      // adds <li> on "console-container"
      let node = document.createElement('LI')
      let textnode = document.createTextNode('console: ' + args.join(' - '))
      node.appendChild(textnode)
      window.document.getElementById('console-container').appendChild(node)
    }
    let methods = Object.keys(console) //get all console methods
    for (i = 0, j = methods.length; i < j; i++) {
      console[methods[i]] = printOnScreen //override all methods
    }
    window.onerror = function (...args) {
      // catch all unhandled exceptions
      printOnScreen(args)
    }
  })()
</script>
```

This little script will append any console message directly into the body as an ordered list as a replacement of the missing console.

## Running Tests

We use a combination of smoke and unit tests to check the basic functionality of the application quickly and ensure that the major features are working as expected.

Each test of the vital components of the application is under the `src/__tests__` directory. These tests are being powered by [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [jsdom](https://github.com/jsdom/jsdom) to emulate a web browser. The detailed config is inside the `vitest.config.js` file.

- `npm run test` by default runs every test.
-
- `npm run test [path]` runs tests in specific path or file.

- `npm run test:ui` runs all tests and open a UI to view and interact with the tests (`http://localhost:51204/__vitest__/`)

- `npm run coverage` output tests coverage reports (c8 is required: `npm i -D c8`)

## Pull Request Guidelines

- Checkout a topic branch from a base branch (e.g. `master`), and merge back against that branch.

- If adding a new feature:

  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first, and have it approved before working on it.

- If fixing a bug:

  - If you are resolving a special issue, add `(fix/solve/close #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title (e.g. `Update component styles (fix #3899)`).
  - Provide a detailed description of the bug in the PR.

- It's OK to have multiple small commits as you work on the PR. GitHub can automatically squash them before merging.

## Translation Contributions

If you are VS Code user, it is highly recommended installing and using the [i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) extension.

All translations are formated in JSON and can be found at `src/static/locales` followed only by the language two-letter code, that means no hypens nor regional code is used (e.g. `src/static/locales/en.json`).

If you have problems finding the code of a language, please refer to the [List of ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes). If you still have questions or think that there may be any kind of problem, please make sure to open an issue!

---

You may come across strings that are in curly brackets (e.g. `{{app_name}}`). This means they will be replaced with some real content while the application is running (e.g. `{{app_name}}` will become `I-Gen`). Make sure to not translate those as the name needs to be exactly the same.

Some HTML code is also hard-coded in the strings (e.g. `<0>...</0>` or `<1></1><1></1>`), these as well as the curly brackets will be replaced later on. Please, make sure to not change and keep them as well.

### Updating existing translations

Found a wrong translation? Fear not!

- Navigate to `src/static/locales`.
- Locate the file language file (e.g. `/en.json`)
- Make your changes.
- Submit a pull request as: `Updated {language} locates` (e.g. `Updated Spanish locates`)

### Adding a new language

- Navigate to `src/static/locales`.
- Duplicate the english translations file (`/en.json`) to use as a template.
- Rename the file to language code you will be translating to (e.g. if you are translating spanish `/es.json` or french `/fr.json`)
- (optional) Once translated, add it to `src/utils/supportedLanguages.js` in `supportedLanguages[]`. The new object inside the array needs to have the following keys:
  - `code`: Follows the translated file name (e.g. `es` or `fr`)
  - `name`: The name of the language in its native language (e.g. `Español`, `Français`, `Deutsch`, etc)
- Submit a pull request as: `Created {language} locates` (e.g. `Created Spanish locates`)

---

Thank you for your contribution! ❤️
