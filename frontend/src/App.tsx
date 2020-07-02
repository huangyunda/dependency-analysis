import React, { useState } from 'react';
import Scan from './components/Scan';
import FileTable from './components/FileTable';
import './App.css';

const App: React.FC = () => {
  const [projectName, setProjectName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [filterPath, setFilterPath] = useState('');

  return (
    <div className='container'>
      <Scan 
        onScan={(a, b) => {
          setProjectName(a);
          setBranchName(b);
        }}
        onFilter={s => setFilterPath(s)}
      />
      <FileTable projectName={projectName} branchName={branchName} filterPath={filterPath} />
    </div>
  );
}

export default App;
