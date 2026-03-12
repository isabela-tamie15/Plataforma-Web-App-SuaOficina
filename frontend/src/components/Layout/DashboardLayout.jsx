import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ menuItems = [], title = '' }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar menuItems={menuItems} />
      <div className="dashboard-main">
        <TopBar title={title} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
