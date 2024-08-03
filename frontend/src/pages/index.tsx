import { useEffect, useState } from 'react';
import api from '../services/api';

interface BlogPost {
  id: number;
  title: string;
  intro: string;
  body: string;
}

const HomePage = () => {

  return (
    <div>
      <h1>Hlavní stránka</h1>
    </div>
  );
};

export default HomePage;
