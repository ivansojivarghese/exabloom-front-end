import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { v4 as uuidv4 } from 'uuid';

const startNode = {
  id: 'start',
  type: 'input',
  data: { label: 'Start' },
  position: { x: 250, y: 0 },
};

const endNode = {
  id: 'end',
  type: 'output',
  data: { label: 'End' },
  position: { x: 250, y: 600 },
};

function EditableNode({ id, label, onDelete, onNameChange }) {
  const [name, setName] = useState(label);
  return (
    <div style={{ padding: 10, backgroundColor: '#eee', borderRadius: 5 }}>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          onNameChange(id, e.target.value);
        }}
        style={{ marginRight: 5 }}
      />
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
}

function IfElseNode({ id, label, branches, elseId, onDelete, onUpdate }) {
  const [name, setName] = useState(label);
  const [branchList, setBranchList] = useState(branches);

  const handleAddBranch = () => {
    const newBranch = { id: uuidv4(), label: `Branch ${branchList.length + 1}` };
    const newBranchList = [...branchList, newBranch];
    setBranchList(newBranchList);
    onUpdate(id, name, newBranchList);
  };

  const handleLabelChange = (e) => {
    setName(e.target.value);
    onUpdate(id, e.target.value, branchList);
  };

  return (
    <div style={{ padding: 10, backgroundColor: '#f8f8f8', borderRadius: 5 }}>
      <input value={name} onChange={handleLabelChange} />
      <button onClick={() => onDelete(id, branchList.map((b) => b.id), elseId)}>Delete</button>
      <br />
      Branches:
      <ul>
        {branchList.map((b) => (
          <li key={b.id}>{b.label}</li>
        ))}
      </ul>
      <button onClick={handleAddBranch}>+ Branch</button>
    </div>
  );
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([startNode, endNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'start-end', source: 'start', target: 'end' },
  ]);
  const [showMenu, setShowMenu] = useState(false);

  const addActionNode = () => {
    const id = uuidv4();
    const newNode = {
      id,
      data: {        label: (
          <EditableNode
            id={id}
            label={`Action`}
            onDelete={handleDelete}
            onNameChange={handleNameChange}
          />
        ),
      },
      position: { x: 250, y: 150 + nodes.length * 50 },
    };

    const indexToInsert = nodes.length - 1;
    const updatedNodes = [...nodes];
    updatedNodes.splice(indexToInsert, 0, newNode);
    setNodes(updatedNodes);

    const lastNodeId = updatedNodes[indexToInsert - 1].id;
    const newEdges = [
      ...edges.filter((e) => e.source !== lastNodeId),
      { id: uuidv4(), source: lastNodeId, target: id },
      { id: uuidv4(), source: id, target: 'end' },
    ];
    setEdges(newEdges);
  };

  const handleDelete = (id) => {
    const nodeIndex = nodes.findIndex((n) => n.id === id);
    const prevNode = nodes[nodeIndex - 1];
    const nextNode = nodes[nodeIndex + 1];
    setNodes(nodes.filter((n) => n.id !== id));
    const newEdges = edges
      .filter((e) => e.source !== id && e.target !== id)
      .concat(prevNode && nextNode ? { id: uuidv4(), source: prevNode.id, target: nextNode.id } : []);
    setEdges(newEdges);
  };

  const handleNameChange = (id, newName) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                label: (
                  <EditableNode
                    id={id}
                    label={newName}
                    onDelete={handleDelete}
                    onNameChange={handleNameChange}
                  />
                ),
              },
            }
          : n
      )
    );
  };

  const addIfElseNode = () => {
    const ifId = uuidv4();
    const branchId = uuidv4();
    const elseId = uuidv4();

    const ifNode = {
      id: ifId,
      data: {
        label: (
          <IfElseNode
            id={ifId}
            label="If/Else"
            branches={[{ id: branchId, label: 'Branch 1' }]}
            elseId={elseId}
            onDelete={handleDeleteIfElse}
            onUpdate={handleUpdateIfElse}
          />
        ),
      },
      position: { x: 250, y: 150 + nodes.length * 50 },
    };

    const branchNode = {
      id: branchId,
      data: { label: 'Branch 1' },
      position: { x: 100, y: ifNode.position.y + 100 },
      draggable: false,
    };

    const elseNode = {
      id: elseId,
      data: { label: 'Else' },
      position: { x: 400, y: ifNode.position.y + 100 },
      draggable: false,
    };

    setNodes((nds) => [...nds, ifNode, branchNode, elseNode]);
    setEdges((eds) => [
      ...eds,
      { id: uuidv4(), source: ifId, target: branchId },
      { id: uuidv4(), source: ifId, target: elseId },
    ]);
  };

  const handleDeleteIfElse = (ifId, branchIds, elseId) => {
    const toRemove = [ifId, elseId, ...branchIds];
    setNodes((nds) => nds.filter((n) => !toRemove.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !toRemove.includes(e.source) && !toRemove.includes(e.target)));
  };

  const handleUpdateIfElse = (id, newName, newBranches) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                label: (
                  <IfElseNode
                    id={id}
                    label={newName}
                    branches={newBranches}
                    elseId={n.data.elseId}
                    onDelete={handleDeleteIfElse}
                    onUpdate={handleUpdateIfElse}
                  />
                ),
              },
            }
          : n
      )
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
      >
        + Add Node
      </button>

      {showMenu && (
        <div style={{ position: 'absolute', top: 50, left: 10, zIndex: 10, backgroundColor: 'white', padding: 10, border: '1px solid gray' }}>
          <button onClick={() => { setShowMenu(false); addActionNode(); }}>Action Node</button><br />
          <button onClick={() => { setShowMenu(false); addIfElseNode(); }}>If / Else Node</button>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;