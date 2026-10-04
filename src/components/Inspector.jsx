import React from 'react';

const fieldStyle = {
  padding: '8px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: 'white',
  color: 'black',
};

export default function Inspector({
  selected,
  onChange,
  onClose,
}) {
  if (!selected) {
    return (
      <aside className="panel inspector">
        <h3>No class selected</h3>
      </aside>
    );
  }

  const attributes = selected.attributes ?? [];
  const methods = selected.methods ?? [];

  const updateAttribute = (index, patch) => {
    const next = [...attributes];

    next[index] = {
      ...next[index],
      ...patch,
    };

    onChange({
      ...selected,
      attributes: next,
    });
  };

  const removeAttribute = (index) => {
    onChange({
      ...selected,
      attributes: attributes.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updateMethod = (index, patch) => {
    const next = [...methods];

    next[index] = {
      ...next[index],
      ...patch,
    };

    onChange({
      ...selected,
      methods: next,
    });
  };

  const removeMethod = (index) => {
    onChange({
      ...selected,
      methods: methods.filter(
        (_, i) => i !== index
      ),
    });
  };

  return (
    <aside className="panel inspector">
      <div className="panel-title">
        <div>
          <span className="eyebrow">
            CLASS
          </span>

          <h2>Class Editor</h2>
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          title="Close editor"
        >
          ×
        </button>
      </div>

      {/* CLASS NAME */}

      <label>
        Class Name

        <input
          type="text"
          value={selected.name || ''}
          onChange={(e) =>
            onChange({
              ...selected,
              name: e.target.value,
            })
          }
        />
      </label>

      {/* ATTRIBUTES */}

      <div className="section-title">
        <span>Attributes</span>

        <button
          type="button"
          className="mini-add"
          onClick={() =>
            onChange({
              ...selected,
              attributes: [
                ...attributes,
                {
                  visibility: '-',
                  name: '',
                  type: 'String',
                },
              ],
            })
          }
        >
          + Add
        </button>
      </div>

      {attributes.length === 0 && (
        <div className="inspector-empty">
          No attributes yet.
        </div>
      )}

      {attributes.map((attribute, index) => (
        <div
          className="member-row"
          key={index}
        >
          <select
            value={attribute.visibility || '-'}
            onChange={(e) =>
              updateAttribute(index, {
                visibility: e.target.value,
              })
            }
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="#">#</option>
            <option value="~">~</option>
          </select>

          <input
            value={attribute.name || ''}
            onChange={(e) =>
              updateAttribute(index, {
                name: e.target.value,
              })
            }
            placeholder="Attribute"
          />

          <input
            value={attribute.type || ''}
            onChange={(e) =>
              updateAttribute(index, {
                type: e.target.value,
              })
            }
            placeholder="Type"
          />

          <button
            type="button"
            onClick={() =>
              removeAttribute(index)
            }
            title="Remove attribute"
          >
            ×
          </button>
        </div>
      ))}

      {/* METHODS */}

      <div className="section-title">
        <span>Methods</span>

        <button
          type="button"
          className="mini-add"
          onClick={() =>
            onChange({
              ...selected,
              methods: [
                ...methods,
                {
                  visibility: '+',
                  name: '',
                  parameters: '',
                  returnType: 'void',
                },
              ],
            })
          }
        >
          + Add
        </button>
      </div>

      {methods.length === 0 && (
        <div className="inspector-empty">
          No methods yet.
        </div>
      )}

      {methods.map((method, index) => (
        <div
          className="method-card"
          key={index}
        >
          <div className="member-row">
            <select
              value={method.visibility || '+'}
              onChange={(e) =>
                updateMethod(index, {
                  visibility: e.target.value,
                })
              }
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="#">#</option>
              <option value="~">~</option>
            </select>

            <input
              value={method.name || ''}
              onChange={(e) =>
                updateMethod(index, {
                  name: e.target.value,
                })
              }
              placeholder="Method name"
            />

            <input
              value={method.returnType || ''}
              onChange={(e) =>
                updateMethod(index, {
                  returnType: e.target.value,
                })
              }
              placeholder="Return"
            />

            <button
              type="button"
              onClick={() =>
                removeMethod(index)
              }
              title="Remove method"
            >
              ×
            </button>
          </div>

          <div className="member-row sub">
            <input
              value={method.parameters || ''}
              onChange={(e) =>
                updateMethod(index, {
                  parameters: e.target.value,
                })
              }
              placeholder="Parameters e.g. id: int"
            />
          </div>
        </div>
      ))}

      {/* LEGEND */}

      <div className="legend">
        <b>Visibility</b>

        <span>
          <i>+</i> public
        </span>

        <span>
          <i>-</i> private
        </span>

        <span>
          <i>#</i> protected
        </span>

        <span>
          <i>~</i> package
        </span>
      </div>
    </aside>
  );
}