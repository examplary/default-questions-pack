# 🙋 Default questions pack

This repository specifies the default question types available in the **[Examplary](https://examplary.ai)** 
test software. You can use it as a basis to create your own question packs.

Read more in the [📘 Developer Documentation](https://developers.examplary.ai/question-types).

The question types are published together as the **Default questions** app: `app.ts` lists them,
and each directory's `question-type.ts` defines one type, importing its React components and
assets. The app is preinstalled in every Examplary workspace. `npx @examplary/cli app validate`
checks the app and all of its question types, and the release workflow uploads it with
`npx @examplary/cli app upload`. To work on one type with hot reload, run
`npx @examplary/cli preview` in its directory.
