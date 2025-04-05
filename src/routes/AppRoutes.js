import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';

// Auth components
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';

// Dashboard components
import OwnerDashboard from '../components/dashboard/OwnerDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import WaiterDashboard from '../components/dashboard/WaiterDashboard';

// Restaurant components
import RestaurantList from '../components/restaurants/RestaurantList';
import RestaurantDetail from '../components/restaurants/RestaurantDetail';
import RestaurantForm from '../components/restaurants/RestaurantForm';

// Branch components
import BranchList from '../components/branches/BranchList';
import BranchDetail from '../components/branches/BranchDetail';
import BranchForm from '../components/branches/BranchForm';

// Menu components
import MenuList from '../components/menu/MenuList';
import MenuItemForm from '../components/menu/MenuItemForm';

// Table components
import TableList from '../components/tables/TableList';
import TableForm from '../components/tables/TableForm';

// User management components
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';

// Deal management components
import DealList from '../components/deals/DealList';
import DealForm from '../components/deals/DealForm';

// POS components
import POSScreen from '../components/pos/POSScreen';

// Branch-specific components
import AssignedMenus from '../components/branch-specific/AssignedMenus';
import AssignedTables from '../components/branch-specific/AssignedTables';

// Error pages
import NotFound from '../common/NotFound';

// Route guards
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Route>
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboards */}
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/waiter/dashboard" element={<WaiterDashboard />} />
            
            {/* Restaurant Routes */}
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurants/new" element={<RestaurantForm />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants/:id/edit" element={<RestaurantForm />} />
            
            {/* Restaurant Menu Route */}
            <Route path="/restaurants/:restaurantId/menu" element={<MenuList />} />
            
            {/* Branch Routes - nested under restaurants */}
            <Route path="/restaurants/:restaurantId/branches" element={<BranchList />} />
            <Route path="/restaurants/:restaurantId/branches/new" element={<BranchForm />} />
            <Route path="/branches/:id" element={<BranchDetail />} />
            <Route path="/branches/:id/edit" element={<BranchForm />} />
            
            {/* Branch-specific routes */}
            <Route path="/assigned-menus" element={<AssignedMenus />} />
            <Route path="/assigned-tables" element={<AssignedTables />} />
            
            {/* Menu Routes - nested under branches */}
            <Route path="/branches/:branchId/menu" element={<MenuList />} />
            <Route path="/menu-items/:id/edit" element={<MenuItemForm />} />
            
            {/* Table Routes - nested under branches */}
            <Route path="/branches/:branchId/tables" element={<TableList />} />
            <Route path="/branches/:branchId/tables/new" element={<TableForm />} />
            <Route path="/tables/:id/edit" element={<TableForm />} />
            
            {/* Deal Routes - nested under branches */}
            <Route path="/branches/:branchId/deals" element={<DealList />} />
            <Route path="/branches/:branchId/deals/new" element={<DealForm />} />
            <Route path="/deals/:id/edit" element={<DealForm />} />
            
            {/* POS Routes */}
            <Route path="/pos" element={<POSScreen />} />
            <Route path="/pos/:branchId" element={<POSScreen />} />
            
            {/* Staff/User Routes */}
            {/* Staff/User Routes */}
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/:id/edit" element={<UserForm />} />
          </Route>
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;