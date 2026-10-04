import React, {
  useEffect,
  useState,
} from 'react';

const makeDefaults = (classes) => ({
  source: classes[0]?.id ?? '',
  target: classes[1]?.id ?? '',
  type: 'association',
  label: '',
});

export default function RelationshipModal({
  classes,
  initial,
  onSave,
  onDelete,
  onClose,
}) {
  const [form, setForm] = useState(
    initial
      ? { label: '', ...initial }
      : makeDefaults(classes)
  );

  useEffect(() => {
    setForm(
      initial
        ? { label: '', ...initial }
        : makeDefaults(classes)
    );
  }, [initial?.id]);

  useEffect(() => {
    setForm((current) => {
      const source =
        current.source === ''
          ? classes[0]?.id ?? ''
          : current.source;

      const target =
        current.target === ''
          ? classes[1]?.id ?? ''
          : current.target;

      if (
        source === current.source &&
        target === current.target
      ) {
        return current;
      }

      return {
        ...current,
        source,
        target,
      };
    });
  }, [classes]);

  const toId = (value) =>
    classes.find(
      (c) => String(c.id) === value
    )?.id ?? value;

  const invalid =
    !form.source ||
    !form.target ||
    form.source === form.target;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              RELATIONSHIP
            </span>

            <h2>
              {initial
                ? 'Edit'
                : 'Create'}{' '}
              relationship
            </h2>
          </div>

          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <label>
          From

          <select
            value={form.source}
            onChange={(e) =>
              setForm({
                ...form,
                source: toId(e.target.value),
              })
            }
          >
            {classes.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          To

          <select
            value={form.target}
            onChange={(e) =>
              setForm({
                ...form,
                target: toId(e.target.value),
              })
            }
          >
            {classes.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Type

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
          >
            <option value="association">
              Association
            </option>

            <option value="inheritance">
              Inheritance
            </option>

            <option value="dependency">
              Dependency
            </option>
          </select>
        </label>

        <label>
          Label{' '}
          <span className="muted">
            optional
          </span>

          <input
            value={form.label || ''}
            onChange={(e) =>
              setForm({
                ...form,
                label: e.target.value,
              })
            }
            placeholder="e.g. enrolls, uses"
          />
        </label>

        <div className="modal-actions">
          {initial && (
            <button
              type="button"
              className="danger ghost"
              onClick={() =>
                onDelete(initial.id)
              }
            >
              Delete
            </button>
          )}

          <span />

          <button
            type="button"
            className="ghost"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary"
            disabled={invalid}
            onClick={() =>
              onSave({
                ...form,
                id:
                  initial?.id ||
                  `r-${Date.now()}`,
              })
            }
          >
            {initial
              ? 'Save changes'
              : 'Add relationship'}
          </button>
        </div>
      </div>
    </div>
  );
}