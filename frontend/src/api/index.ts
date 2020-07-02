import { get, post } from './axios';

export const getAllProjects = () => get('/getAllProjects');

export const scanProject = (params: object) => post('/scanProject', params);
