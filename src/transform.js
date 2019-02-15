
export default (fileInfo, api, options) => {
  // console.log(options);
  const j = api.jscodeshift;
  console.log(typeof fileInfo.source);
  const root = j(fileInfo.source);
  const body = root.get().value.program.body;

  const createImportRegenerator = () => {
    return j.importDeclaration(
      [j.importDefaultSpecifier(
        j.identifier('regeneratorRuntime')
      )],
      j.literal('babyfs-regenerator')
    );
  };

  body.unshift(createImportRegenerator());
  return root.toSource({quote: 'single'});
};
