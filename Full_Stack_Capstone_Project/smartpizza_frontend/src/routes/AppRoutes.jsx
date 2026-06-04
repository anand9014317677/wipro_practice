import { Routes, Route, Navigate } from 'react-router-dom';
import RoleRoute from '../components/RoleRoute.jsx';

// layouts
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import DeliveryLayout from '../layouts/DeliveryLayout.jsx';

// auth
import CustomerLogin from '../pages/auth/CustomerLogin.jsx';
import AdminLogin from '../pages/auth/AdminLogin.jsx';
import DeliveryLogin from '../pages/auth/DeliveryLogin.jsx';
import Register from '../pages/Register.jsx';

// shared
import Profile from '../pages/shared/Profile.jsx';

// customer pages (existing)
import Home from '../pages/Home.jsx';
import Menu from '../pages/Menu.jsx';
import PizzaDetails from '../pages/PizzaDetails.jsx';
import Recommendations from '../pages/Recommendations.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Orders from '../pages/Orders.jsx';
import OrderDetails from '../pages/OrderDetails.jsx';
import Payment from '../pages/Payment.jsx';
import Payments from '../pages/Payments.jsx';

// admin / delivery reused pages (existing)
import CategoryManager from '../components/admin/CategoryManager.jsx';
import PizzaManager from '../components/admin/PizzaManager.jsx';
import DeliveryDashboard from '../pages/DeliveryDashboard.jsx';
import DeliveryTracking from '../pages/DeliveryTracking.jsx';
import Dashboard from '../pages/admin/Dashboard.jsx';
import LiveOrders from '../pages/admin/LiveOrders.jsx';
import Customers from '../pages/admin/Customers.jsx';
import Analytics from '../pages/admin/Analytics.jsx';
import Kitchen from '../pages/admin/Kitchen.jsx';
import Tracking from '../pages/delivery/Tracking.jsx';
import Completed from '../pages/delivery/Completed.jsx';

// guard helper for a single customer-only page
const customer = (el) => <RoleRoute allow={['CUSTOMER']} redirectTo="/customer/login">{el}</RoleRoute>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- AUTH ---------- */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/customer/register" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Navigate to="/customer/login" replace />} />

      {/* ---------- CUSTOMER APP ---------- */}
      <Route element={<CustomerLayout />}>
        {/* public browse */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<PizzaDetails />} />
        {/* customer-only */}
        <Route path="/recommendations" element={customer(<Recommendations />)} />
        <Route path="/cart" element={customer(<Cart />)} />
        <Route path="/checkout" element={customer(<Checkout />)} />
        <Route path="/orders" element={customer(<Orders />)} />
        <Route path="/orders/:id" element={customer(<OrderDetails />)} />
        <Route path="/payment/:orderId" element={customer(<Payment />)} />
        <Route path="/payments" element={customer(<Payments />)} />
        <Route path="/profile" element={customer(<Profile />)} />
      </Route>

      {/* ---------- ADMIN APP ---------- */}
      <Route
        element={
          <RoleRoute allow={['ADMIN']} redirectTo="/admin/login">
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/live-orders" element={<LiveOrders />} />
        <Route path="/admin/kitchen" element={<Kitchen />} />
        <Route path="/admin/assign-delivery" element={<DeliveryDashboard />} />
        <Route path="/admin/categories" element={<CategoryManager />} />
        <Route path="/admin/pizzas" element={<PizzaManager />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/track/:orderId" element={<DeliveryTracking />} />
      </Route>

      {/* ---------- DELIVERY APP ---------- */}
      <Route
        element={
          <RoleRoute allow={['DELIVERY']} redirectTo="/delivery/login">
            <DeliveryLayout />
          </RoleRoute>
        }
      >
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/delivery/tracking" element={<Tracking />} />
        <Route path="/delivery/completed" element={<Completed />} />
        <Route path="/delivery/profile" element={<Profile />} />
        <Route path="/delivery/track/:orderId" element={<DeliveryTracking />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
