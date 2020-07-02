import React, { useEffect, useState } from 'react';
import { Select, Button, Input } from 'antd';
import { getAllProjects } from '../../api';

interface IProps {
  onScan: (projectName: string, branchName: string) => void
  onFilter: (str: string) => void
}

const Scan = ({ onScan, onFilter }: IProps) => {
  const [projects, setProjects] = useState({} as { [key: string]: string[] });
  const [projectName, setProjectName] = useState('');
  const [branchName, setBranchName] = useState('');

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const data = await getAllProjects() as any;
    setProjects(data);
    const tem = Object.keys(data)[0];
    if (!tem) return;
    setProjectName(tem);
    setBranchName(data[tem][0]);
  }

  return (
    <div className='row'>
      <div>
        <span className='mr'>项目:</span>
        <Select className='select' value={projectName} onChange={(value: string) => {
          setProjectName(value);
          setBranchName(projects[value][0]);
        }}>
          {Object.keys(projects).map(item => <Select.Option key={item}>{item}</Select.Option>)}
        </Select>
        <span className='mr ml'>分支:</span>
        <Select className='select' value={branchName} onChange={(value: string) => setBranchName(value)}>
          {(projects[projectName] || []).map(item => <Select.Option key={item}>{item}</Select.Option>)}
        </Select>
        <Button className='ml' type='primary' onClick={() => onScan(projectName, branchName)}>扫描</Button>
      </div>
      <Input.Search onSearch={value => onFilter(value)} style={{ width: 200 }} />
    </div>
  )
};

export default Scan;
