export function generateJava(
  classes,
  relationships
) {
  const byId = Object.fromEntries(
    classes.map((c) => [c.id, c])
  );

  const inheritance =
    relationships.filter(
      (r) => r.type === 'inheritance'
    );

  const deps =
    relationships.filter(
      (r) => r.type === 'dependency'
    );

  return classes
    .map((c) => {
      const parentEdge =
        inheritance.find(
          (r) => r.target === c.id
        );

      const parent = parentEdge
        ? byId[parentEdge.source]?.name
        : null;

      const fields = (
        c.attributes || []
      )
        .map(
          (a) =>
            `    ${a.visibility || 'private'} ${
              a.type || 'String'
            } ${a.name || 'field'};`
        )
        .join('\n');

      const methods = (
        c.methods || []
      )
        .map((m) => {
          const vis =
            m.visibility || 'public';

          const ret =
            m.returnType || 'void';

          const params =
            m.parameters || '';

          return `    ${vis} ${ret} ${
            m.name || 'method'
          }(${params}) {
        // TODO: implement
    }`;
        })
        .join('\n\n');

      const depImports = deps
        .filter(
          (r) => r.source === c.id
        )
        .map(
          (r) =>
            byId[r.target]?.name
        )
        .filter(Boolean)
        .map(
          (name) => `import ${name};`
        )
        .join('\n');

      const header =
        `public class ${
          c.name || 'Class'
        }` +
        `${
          parent
            ? ` extends ${parent}`
            : ''
        } {`;

      return (
        `${
          depImports
            ? `${depImports}\n\n`
            : ''
        }` +
        `${header}\n` +
        `${fields}` +
        `${
          fields && methods
            ? '\n\n'
            : ''
        }` +
        `${methods}\n}`
      );
    })
    .join('\n\n');
}