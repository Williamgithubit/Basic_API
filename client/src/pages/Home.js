import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Hero from '../components/Home/Hero';
import Features from '../components/Home/Features';
import DriverSection from '../components/Home/DriverSection';
import SafetySection from '../components/Home/SafetySection';
import Footer from '../components/Footer';
const Home = () => {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" }), _jsx("meta", { name: "theme-color", content: "#ffffff" }), _jsx("meta", { name: "mobile-web-app-capable", content: "yes" }), _jsx("meta", { name: "apple-mobile-web-app-capable", content: "yes" }), _jsx("meta", { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" })] }), _jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx(Header, {}), _jsx(Hero, {}), _jsx(Features, {}), _jsx(DriverSection, {}), _jsx(SafetySection, {}), _jsx(Footer, {})] })] }));
};
export default Home;
