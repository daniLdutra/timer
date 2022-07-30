import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';

export function DefaultLayout() {
  return (
    <div>
      <Header />
      <Outlet />
      {/* component do react-router-dom que permite manter um espaço
      para ser inserido um conteúdo para transicionar. */}
    </div>
  );
}
