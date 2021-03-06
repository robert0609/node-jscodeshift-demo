import 'babel-polyfill';
import j from 'jscodeshift';
import fileHelper from './fileHelper';
import path from 'path';

const baseDirectory = __dirname;

async function transform(filename) {
  let realFilename = path.resolve(baseDirectory, filename);
  let source = await fileHelper.read(realFilename);
  let root = j(source);
  const body = root.get().value.program.body;

  const createImportRegenerator = () => {
    return j.importDeclaration(
      [j.importDefaultSpecifier(
        j.identifier('regeneratorRuntime')
      )],
      j.literal('babyfs-regenerator')
    );
  };

  const findImportDeclaration = () => {
    let importDeclarations = root.find(j.ImportDeclaration);
    importDeclarations.forEach(item => {
      console.log(item);
    });
  };

  const findRequireExpression = () => {
    let requires = root.find(j.CallExpression, {
      callee: {
        name: 'require'
      }
    }).filter(requireStatement => requireStatement.value.arguments.length === 1 && requireStatement.value.arguments[0].type === 'Literal');
    requires.forEach(requireStatement => {
      let item = requireStatement.parent.parent;
      console.log(item);
      requireStatement.value.arguments = [
        j.literal('testmodule')
      ];
    });
  };

  findImportDeclaration();
  findRequireExpression();
  // body.unshift(createImportRegenerator());
  return root.toSource({quote: 'single'});
}

transform('../content/main.js').then((result) => {
  return fileHelper.write(path.resolve(baseDirectory, '../content/main.target.js'), result);
}).then(result => {
  console.log(result);
}).catch((error) => {
  console.log(error);
});
