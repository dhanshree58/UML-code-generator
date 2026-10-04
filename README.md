# UML Studio — React UML Class Designer

A responsive React application for designing UML class diagrams and generating Java source code.

## Features
- Add, edit, and delete UML classes
- Add attributes and methods with visibility, types, parameters, and return types
- Interactive drag-and-drop UML canvas using React Flow
- Create association, inheritance, and dependency relationships
- Relationship editor with labels and delete support
- Automatic Java source generation
- Copy or download generated Java code
- Responsive desktop/mobile layout
- Reusable React components and centralized React state

## Run
```bash
npm install
npm run dev
```
Then open the local Vite URL shown in the terminal.


## Main files
- `src/App.jsx` — application state, canvas, class/relationship management
- `src/components/ClassNode.jsx` — UML class node
- `src/components/Inspector.jsx` — class editor
- `src/components/RelationshipModal.jsx` — relationship CRUD UI
- `src/utils/javaGenerator.js` — Java code generation
- `src/styles.css` — responsive styling

## Demonstration flow
1. Add a class from the left panel.
2. Select it and add attributes/methods in the Class Editor.
3. Drag classes on the diagram.
4. Use Relationship to create association/inheritance/dependency.
5. Click Generate Java to inspect, copy, or download source code.

