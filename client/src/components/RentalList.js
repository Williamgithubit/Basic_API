import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ITEMS_PER_PAGE = 6;
const RentalList = ({ rentals, onRentalDeleted, setMessage, isLoading, }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortKey, setSortKey] = useState("date");
    const [currentPage, setCurrentPage] = useState(1);
    const [deletingRentalId, setDeletingRentalId] = useState(null);
    const filteredRentals = useMemo(() => {
        return rentals
            .filter((rental) => {
            const carName = rental.Car?.name?.toLowerCase() || "";
            const carModel = rental.Car?.model?.toLowerCase() || "";
            const matchesSearch = carName.includes(searchTerm.toLowerCase()) ||
                carModel.includes(searchTerm.toLowerCase());
            const isExpired = new Date(rental.endDate) < new Date();
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && !isExpired) ||
                (statusFilter === "expired" && isExpired);
            return matchesSearch && matchesStatus;
        })
            .sort((a, b) => {
            if (sortKey === "name") {
                return (a.Car?.name || "").localeCompare(b.Car?.name || "");
            }
            else if (sortKey === "cost") {
                return b.totalCost - a.totalCost;
            }
            else {
                return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            }
        });
    }, [rentals, searchTerm, statusFilter, sortKey]);
    const paginatedRentals = filteredRentals.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[200px] p-8", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }), _jsx("span", { className: "text-gray-600", children: "Loading rentals..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(ToastContainer, { position: "top-right", autoClose: 3000, hideProgressBar: true }), _jsxs("div", { className: "flex flex-wrap gap-4 justify-between items-center", children: [_jsx("input", { type: "text", placeholder: "Search by car name or model", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "p-2 border border-gray-300 rounded-md w-full md:w-1/3" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "p-2 border border-gray-300 rounded-md", children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "expired", children: "Expired" })] }), _jsxs("select", { value: sortKey, onChange: (e) => setSortKey(e.target.value), className: "p-2 border border-gray-300 rounded-md", children: [_jsx("option", { value: "date", children: "Sort by Date" }), _jsx("option", { value: "name", children: "Sort by Name" }), _jsx("option", { value: "cost", children: "Sort by Cost" })] })] }), filteredRentals.length === 0 ? (_jsx("div", { className: "p-6 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-lg text-center", children: _jsx("p", { className: "text-lg font-medium", children: "No matching rentals found" }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6", children: paginatedRentals.map((rental) => {
                            const isExpired = new Date(rental.endDate) < new Date();
                            const isOwner = rental.customerId === user?.id;
                            const canCancel = !isExpired && isOwner;
                            return (_jsx("div", { className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden", children: _jsx("div", { className: "p-4 md:p-6", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg md:text-xl font-semibold text-gray-900", children: rental.Car?.name ?? "Unnamed Car" }), _jsxs("p", { className: "text-gray-600 text-sm mt-1", children: ["Model: ", rental.Car?.model ?? "Unknown"] })] }), _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isExpired
                                                            ? "bg-gray-100 text-gray-500"
                                                            : "bg-green-100 text-green-800"}`, children: isExpired ? "Expired" : "Active" })] }), _jsxs("div", { className: "flex-grow", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Start Date:" }), _jsx("span", { className: "text-sm font-medium", children: rental.startDate })] }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("span", { className: "text-sm text-gray-500", children: "End Date:" }), _jsx("span", { className: "text-sm font-medium", children: rental.endDate })] }), _jsxs("div", { className: "flex justify-between items-center mb-4 pt-2 border-t border-gray-100", children: [_jsx("span", { className: "text-gray-600", children: "Total Cost:" }), _jsxs("span", { className: "text-lg font-semibold text-blue-600", children: ["$", rental.totalCost] })] })] }), _jsx("div", { className: "mt-4", children: _jsxs("button", { onClick: async () => {
                                                        setDeletingRentalId(rental.id);
                                                        try {
                                                            await onRentalDeleted(rental.id);
                                                            toast.success("Rental cancelled successfully");
                                                            setMessage({
                                                                text: "Rental cancelled successfully",
                                                                type: "success",
                                                            });
                                                        }
                                                        catch (error) {
                                                            toast.error("Failed to cancel rental");
                                                            setMessage({
                                                                text: error?.response?.data?.message ||
                                                                    "Failed to cancel rental",
                                                                type: "error",
                                                            });
                                                        }
                                                        finally {
                                                            setDeletingRentalId(null);
                                                        }
                                                    }, disabled: !canCancel || deletingRentalId === rental.id, className: `w-full px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${canCancel && deletingRentalId === rental.id
                                                        ? "bg-blue-400 text-white cursor-wait"
                                                        : !canCancel
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-red-500 text-white hover:bg-red-600"}`, children: [_jsx("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }), _jsx("span", { children: deletingRentalId === rental.id ? "Cancelling..." : "Cancel Rental" })] }) })] }) }) }, rental.id));
                        }) }), totalPages > 1 && (_jsx("div", { className: "flex justify-center items-center space-x-2 mt-4", children: Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: `px-3 py-1 rounded-md border text-sm ${page === currentPage
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`, children: page }, page))) }))] }))] }));
};
export default RentalList;
