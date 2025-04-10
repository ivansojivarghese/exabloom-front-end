# Exabloom - React Flow Workflow Builder

This is my submission for the **Exabloom Frontend React Flow Test**. It is a workflow builder built using **React** & **React Flow**.

---

## ✅ Features Implemented

### Level 1: Basic Workflow Structure
- Setup React project using Vite
- Integrated React Flow with Start → End nodes
- Basic connection between nodes
- Simple “Add Node” button

### Level 2: Action Nodes
- Add “Action Nodes” dynamically
- Each Action Node has:
  - Editable label via input field
  - Delete button to remove the node
  - Auto-reconnects surrounding nodes on delete

### Level 3: If / Else Node
- Dropdown menu to choose node type (Action / If-Else)
- If/Else Node adds:
  - Main If/Else node with editable name
  - One Branch Node (label-only)
  - One Else Node (label-only)
- Supports:
  - Adding more branches
  - Editing branch labels via If/Else node only
  - Deleting If/Else node removes all children nodes

## Tech Stack
- React (Vite)
- React Flow (react-flow-renderer)
- UUID for node IDs
- Plain CSS for quick styling

---

## 🚀 Getting Started

### Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/exabloom-workflow-builder.git
cd exabloom-workflow-builder

### 2. Install dependencies
```bash
npm install

### 3. Run the app
```bash
npm run dev