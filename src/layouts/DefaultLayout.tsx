import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { LayoutContainer } from './styles';

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      <Outlet />
      {/* component do react-router-dom que permite manter um espaço
      para ser inserido um conteúdo para transicionar. */}
    </LayoutContainer>
  );
}
