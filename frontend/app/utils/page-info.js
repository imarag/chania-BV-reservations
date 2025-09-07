export function createPageMeta(title, description) {
  return [
    { title: title },
    {
      name: "description",
      content: description,
    },
  ];
}
