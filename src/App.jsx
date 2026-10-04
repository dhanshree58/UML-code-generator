import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useEdgesState,
  useNodesState,
  Panel,
} from '@xyflow/react';

import {
  Boxes,
  Code2,
  Link2,
  Plus,
  RotateCcw,
  Download,
} from 'lucide-react';

import ClassNode from './components/ClassNode';
import Inspector from './components/Inspector';
import RelationshipModal from './components/RelationshipModal';
import { generateJava } from './utils/javaGenerator';


// ======================================================
// STARTER DATA
// ======================================================

const starter = [
  {
    id: 'student',
    name: 'Student',

    attributes: [
      {
        visibility: '-',
        name: 'studentId',
        type: 'int',
      },
      {
        visibility: '-',
        name: 'name',
        type: 'String',
      },
    ],

    methods: [
      {
        visibility: '+',
        name: 'enroll',
        parameters: 'course: Course',
        returnType: 'void',
      },
    ],

    position: {
      x: 100,
      y: 100,
    },
  },

  {
    id: 'course',
    name: 'Course',

    attributes: [
      {
        visibility: '-',
        name: 'code',
        type: 'String',
      },
      {
        visibility: '-',
        name: 'title',
        type: 'String',
      },
    ],

    methods: [
      {
        visibility: '+',
        name: 'addStudent',
        parameters: 'student: Student',
        returnType: 'void',
      },
    ],

    position: {
      x: 480,
      y: 100,
    },
  },

  {
    id: 'person',
    name: 'Person',

    attributes: [
      {
        visibility: '-',
        name: 'email',
        type: 'String',
      },
    ],

    methods: [
      {
        visibility: '+',
        name: 'login',
        parameters: '',
        returnType: 'boolean',
      },
    ],

    position: {
      x: 100,
      y: 430,
    },
  },
];

const starterRel = [
  {
    id: 'r1',
    source: 'person',
    target: 'student',
    type: 'inheritance',
    label: 'extends',
  },

  {
    id: 'r2',
    source: 'student',
    target: 'course',
    type: 'association',
    label: 'enrolls',
  },
];


// ======================================================
// APP
// ======================================================

function App() {
  const [classes, setClasses] =
    useState(starter);

  const [relations, setRelations] =
    useState(starterRel);

  const [selectedId, setSelectedId] =
    useState(null);

  const [modal, setModal] =
    useState(null);

  const [codeOpen, setCodeOpen] =
    useState(false);

  const [tab, setTab] =
    useState('diagram');


  // ====================================================
  // NODE TYPES
  // ====================================================

  const nodeTypes = useMemo(
    () => ({
      umlClass: ClassNode,
    }),
    []
  );


  // ====================================================
  // DELETE CLASS
  // ====================================================

  function deleteClass(id) {
    setClasses(
      (currentClasses) =>
        currentClasses.filter(
          (c) => c.id !== id
        )
    );

    setRelations(
      (currentRelations) =>
        currentRelations.filter(
          (r) =>
            r.source !== id &&
            r.target !== id
        )
    );

    if (selectedId === id) {
      setSelectedId(null);
    }
  }


  // ====================================================
  // CREATE REACT FLOW NODES
  // ====================================================

  const nodes = useMemo(
    () =>
      classes.map((c) => ({
        id: c.id,

        type: 'umlClass',

        position:
          c.position || {
            x: 100,
            y: 100,
          },

        data: {
          classData: c,

          onEdit: (id) => {
            setSelectedId(id);
            setTab('editor');
          },

          onDelete: deleteClass,
        },
      })),

    [classes, selectedId]
  );


  // ====================================================
  // CREATE REACT FLOW EDGES
  // ====================================================

  const edges = useMemo(
    () =>
      relations.map((r) => ({
        id: r.id,

        source: r.source,

        target: r.target,

        label: r.label,

        type: 'smoothstep',

        markerEnd: {
          type:
            r.type === 'inheritance'
              ? MarkerType.ArrowClosed
              : MarkerType.Arrow,
        },

        style: {
          strokeWidth: 2,

          strokeDasharray:
            r.type === 'dependency'
              ? '6 5'
              : undefined,
        },

        labelStyle: {
          fontWeight: 700,
          fill: '#334155',
        },

        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.9,
        },
      })),

    [relations]
  );


  // ====================================================
  // REACT FLOW STATE
  // ====================================================

  const [
    rfNodes,
    setRfNodes,
    onNodesChange,
  ] = useNodesState(nodes);

  const [
    rfEdges,
    setRfEdges,
    onEdgesChange,
  ] = useEdgesState(edges);


  // ====================================================
  // SYNC NODES
  // ====================================================

  useEffect(() => {
    setRfNodes(nodes);
  }, [nodes, setRfNodes]);


  // ====================================================
  // SYNC EDGES
  // ====================================================

  useEffect(() => {
    setRfEdges(edges);
  }, [edges, setRfEdges]);


  // ====================================================
  // CONNECT CLASSES
  // ====================================================

  const onConnect = useCallback(
    (connection) => {
      if (
        !connection.source ||
        !connection.target ||
        connection.source ===
          connection.target
      ) {
        return;
      }

      setRelations(
        (currentRelations) => [
          ...currentRelations,

          {
            id: `r-${Date.now()}`,

            source: connection.source,

            target: connection.target,

            type: 'association',

            label: '',
          },
        ]
      );
    },
    []
  );


  // ====================================================
  // DRAG CLASS
  // ====================================================

  const onNodeDragStop =
    useCallback(
      (_, node) => {
        setClasses(
          (currentClasses) =>
            currentClasses.map(
              (c) =>
                c.id === node.id
                  ? {
                      ...c,
                      position:
                        node.position,
                    }
                  : c
            )
        );
      },
      []
    );


  // ====================================================
  // ADD CLASS
  // ====================================================

  function addClass() {
    const id =
      `class-${Date.now()}`;

    const newClass = {
      id,

      name: 'NewClass',

      attributes: [],

      methods: [],

      position: {
        x:
          180 +
          (classes.length % 3) *
            300,

        y:
          120 +
          Math.floor(
            classes.length / 3
          ) *
            250,
      },
    };

    setClasses(
      (currentClasses) => [
        ...currentClasses,
        newClass,
      ]
    );

    setSelectedId(id);

    setTab('editor');
  }


  // ====================================================
  // UPDATE CLASS
  // ====================================================

  function updateSelected(
    updatedClass
  ) {
    setClasses(
      (currentClasses) =>
        currentClasses.map(
          (currentClass) =>
            currentClass.id ===
            updatedClass.id
              ? {
                  ...currentClass,
                  ...updatedClass,
                }
              : currentClass
        )
    );

    setSelectedId(
      updatedClass.id
    );

    setTab('editor');
  }


  // ====================================================
  // SELECTED CLASS
  // ====================================================

  const selected =
    classes.find(
      (c) => c.id === selectedId
    ) || null;


  // ====================================================
  // SAVE RELATIONSHIP
  // ====================================================

  function saveRelation(
    relation
  ) {
    setRelations(
      (currentRelations) => {
        const exists =
          currentRelations.some(
            (r) =>
              r.id === relation.id
          );

        if (exists) {
          return currentRelations.map(
            (r) =>
              r.id === relation.id
                ? relation
                : r
          );
        }

        return [
          ...currentRelations,
          relation,
        ];
      }
    );

    setModal(null);
  }


  // ====================================================
  // RESET
  // ====================================================

  function reset() {
    setClasses(
      starter.map((c) => ({
        ...c,

        attributes:
          c.attributes.map(
            (a) => ({ ...a })
          ),

        methods:
          c.methods.map(
            (m) => ({ ...m })
          ),

        position: {
          ...c.position,
        },
      }))
    );

    setRelations(
      starterRel.map((r) => ({
        ...r,
      }))
    );

    setSelectedId(null);

    setTab('diagram');

    setModal(null);

    setCodeOpen(false);
  }


  // ====================================================
  // JAVA
  // ====================================================

  function getGeneratedCode() {
    return generateJava(
      classes,
      relations
    );
  }


  function downloadJava() {
    const code =
      getGeneratedCode();

    const blob = new Blob(
      [code],
      {
        type: 'text/plain',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement('a');

    a.href = url;

    a.download =
      'GeneratedClasses.java';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }


  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="app-shell">

      {/* TOP BAR */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Boxes size={20} />
          </div>

          <div>
            <strong>
              UML Studio
            </strong>

            <span>
              Class Designer
            </span>
          </div>
        </div>

        <div className="top-actions">
          <button
            className="ghost"
            onClick={reset}
            type="button"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            className="primary"
            onClick={() =>
              setCodeOpen(true)
            }
            type="button"
          >
            <Code2 size={16} />
            Generate Java
          </button>
        </div>
      </header>


      {/* MOBILE TABS */}

      <div className="mobile-tabs">
        <button
          className={
            tab === 'diagram'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('diagram')
          }
          type="button"
        >
          Diagram
        </button>

        <button
          className={
            tab === 'editor'
              ? 'active'
              : ''
          }
          onClick={() =>
            setTab('editor')
          }
          type="button"
        >
          Class editor
        </button>
      </div>


      {/* WORKSPACE */}

      <main className="workspace">

        {/* SIDEBAR */}

        <aside className="panel sidebar">

          <div className="side-title">
            <div>
              <span className="eyebrow">
                MODEL
              </span>

              <h2>
                Class diagram
              </h2>
            </div>

            <button
              className="square-add"
              onClick={addClass}
              type="button"
              title="Add class"
            >
              <Plus size={18} />
            </button>
          </div>


          <button
            className="add-class"
            onClick={addClass}
            type="button"
          >
            <Plus size={16} />
            Add class
          </button>


          {/* CLASS LIST */}

          <div className="class-list">
            {classes.map((c) => (
              <button
                key={c.id}
                className={
                  selectedId === c.id
                    ? 'class-list-item active'
                    : 'class-list-item'
                }
                onClick={() => {
                  setSelectedId(
                    c.id
                  );

                  setTab('editor');
                }}
                type="button"
              >
                <span className="class-dot" />

                <span>
                  {c.name ||
                    'UnnamedClass'}
                </span>

                <small>
                  {c.attributes
                    ?.length || 0}
                  A ·{' '}
                  {c.methods?.length ||
                    0}
                  M
                </small>
              </button>
            ))}
          </div>


          {/* SIDEBAR FOOTER */}

          <div className="side-footer">
            <div className="stat">
              <b>
                {classes.length}
              </b>

              <span>
                Classes
              </span>
            </div>

            <div className="stat">
              <b>
                {relations.length}
              </b>

              <span>
                Relations
              </span>
            </div>
          </div>
        </aside>


        {/* DIAGRAM */}

        <section
          className={
            tab === 'diagram'
              ? 'canvas-wrap'
              : 'canvas-wrap mobile-hidden'
          }
        >
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            onNodesChange={
              onNodesChange
            }
            onEdgesChange={
              onEdgesChange
            }
            onConnect={onConnect}
            onNodeDragStop={
              onNodeDragStop
            }
            onNodeClick={(_, node) => {
              setSelectedId(
                node.id
              );

              setTab('editor');
            }}
            onEdgeClick={(_, edge) => {
              const relation =
                relations.find(
                  (r) =>
                    r.id === edge.id
                );

              if (relation) {
                setModal(relation);
              }
            }}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            connectionLineStyle={{
              strokeWidth: 2,
            }}
            deleteKeyCode={null}
          >
            <Background
              gap={20}
              size={1}
              color="#e2e8f0"
            />

            <Controls />

            <MiniMap
              nodeColor="#0f766e"
              pannable
              zoomable
            />

            <Panel position="top-left">
              <div className="canvas-help">
                <b>
                  Diagram
                </b>

                <span>
                  Drag classes to arrange
                  · Connect handles to
                  create associations
                </span>
              </div>
            </Panel>

            <Panel position="top-right">
              <button
                className="relation-btn"
                onClick={() => {
                  if (
                    classes.length > 1
                  ) {
                    setModal({});
                  }
                }}
                type="button"
              >
                <Link2 size={16} />
                Relationship
              </button>
            </Panel>
          </ReactFlow>
        </section>


        {/* DESKTOP EDITOR */}

        <div className="desktop-editor">
          <Inspector
            selected={selected}
            onChange={
              updateSelected
            }
            onClose={() => {
              setSelectedId(null);
              setTab('diagram');
            }}
          />
        </div>

      </main>


      {/* MOBILE EDITOR */}

      <div
        className={
          tab === 'editor'
            ? 'mobile-editor'
            : 'mobile-editor hidden'
        }
      >
        <Inspector
          selected={selected}
          onChange={
            updateSelected
          }
          onClose={() => {
            setSelectedId(null);
            setTab('diagram');
          }}
        />
      </div>


      {/* RELATIONSHIP MODAL */}

      {modal && (
        <RelationshipModal
          classes={classes}
          initial={
            modal.id
              ? modal
              : null
          }
          onSave={saveRelation}
          onDelete={(id) => {
            setRelations(
              (currentRelations) =>
                currentRelations.filter(
                  (r) =>
                    r.id !== id
                )
            );

            setModal(null);
          }}
          onClose={() =>
            setModal(null)
          }
        />
      )}


      {/* JAVA MODAL */}

      {codeOpen && (
        <div className="modal-backdrop">
          <div className="code-modal">

            <div className="modal-head">
              <div>
                <span className="eyebrow">
                  JAVA GENERATOR
                </span>

                <h2>
                  Generated source code
                </h2>
              </div>

              <button
                className="icon-btn"
                onClick={() =>
                  setCodeOpen(false)
                }
                type="button"
              >
                ×
              </button>
            </div>


            <pre>
              {getGeneratedCode()}
            </pre>


            <div className="modal-actions">
              <span className="muted">
                {classes.length}{' '}
                class
                {classes.length !==
                1
                  ? 'es'
                  : ''}{' '}
                generated
              </span>

              <span />

              <button
                className="ghost"
                onClick={() => {
                  navigator.clipboard?.writeText(
                    getGeneratedCode()
                  );
                }}
                type="button"
              >
                Copy
              </button>

              <button
                className="primary"
                onClick={
                  downloadJava
                }
                type="button"
              >
                <Download size={15} />
                Download .java
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;