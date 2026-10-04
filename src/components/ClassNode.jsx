import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Pencil, Trash2 } from 'lucide-react';

export default function ClassNode({ data }) {
  const c = data.classData;

  const edit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof data.onEdit === 'function') {
      data.onEdit(c.id);
    }
  };

  const remove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof data.onDelete === 'function') {
      data.onDelete(c.id);
    }
  };

  return (
    <div className="uml-node">
      <Handle
        type="target"
        position={Position.Top}
        className="handle"
      />

      <div className="uml-head">
        <span>{c.name || 'UnnamedClass'}</span>

        <div
          className="node-actions nodrag nopan"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="nodrag nopan"
            onClick={edit}
            title="Edit class"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            className="nodrag nopan"
            onClick={remove}
            title="Delete class"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="uml-section">
        {c.attributes?.length > 0 ? (
          c.attributes.map((a, i) => (
            <div
              className="uml-line"
              key={i}
            >
              <span>{a.visibility || '-'} </span>

              {a.name || 'field'}:

              <em>
                {' '}
                {a.type || 'String'}
              </em>
            </div>
          ))
        ) : (
          <div className="uml-empty">
            No attributes
          </div>
        )}
      </div>

      <div className="uml-section">
        {c.methods?.length > 0 ? (
          c.methods.map((m, i) => (
            <div
              className="uml-line"
              key={i}
            >
              <span>{m.visibility || '+'} </span>

              {m.name || 'method'}(
              {m.parameters || ''}
              ):

              <em>
                {' '}
                {m.returnType || 'void'}
              </em>
            </div>
          ))
        ) : (
          <div className="uml-empty">
            No methods
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="handle"
      />
    </div>
  );
}