import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Users,
  HeartHandshake,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  LogOut,
  AlertTriangle,
  XCircle,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

// API URL as a constant to avoid repetition
const API_BASE_URL = "https://adminfashioncadamy.traficoanalytica.com/api/v1";

// Status mapping as constants
const STATUS_MAP = {
  new: {
    displayName: "New Donation",
    badge: {
      variant: "secondary",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      icon: <Clock className="h-4 w-4 mr-1" />,
    },
  },
  processing: {
    displayName: "Processing",
    badge: {
      variant: "default",
      className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      icon: <Users className="h-4 w-4 mr-1" />,
    },
  },
  completed: {
    displayName: "Completed",
    badge: {
      variant: "default",
      className: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: <CheckCircle className="h-4 w-4 mr-1" />,
    },
  },
  failed: {
    displayName: "Failed",
    badge: {
      variant: "default",
      className: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: <XCircle className="h-4 w-4 mr-1" />,
    },
  },
};

// Stats card component for DRY code
const StatCard = ({ icon, title, value, color }) => (
  <Card className="shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center space-x-4">
        <div className={`p-2 bg-${color}-100 rounded-full`}>
          {React.cloneElement(icon, { className: `h-6 w-6 text-${color}-600` })}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Donations = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalDonors: 0,
    totalDonations: 0,
    totalAmount: 0,
    upcomingEvents: 0,
    donations: [],
  });
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter data once dashboardData is loaded
  useEffect(() => {
    if (dashboardData.donations.length > 0) {
      setFilteredDonations(dashboardData.donations);
    }
  }, [dashboardData.donations]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would be a real API call
      // For now, using mock data that follows the donation form structure
      
      const mockDonations = [
        {
          _id: "don1",
          name: "Amit Kumar",
          email: "amit@example.com",
          phone: "9876543210",
          citizenship: "Indian Citizen",
          donationType: "Once",
          birthdate: "1985-06-15",
          amount: 2500,
          certificate: true,
          createdAt: "2025-04-15T10:30:00Z",
          status: "completed"
        },
        {
          _id: "don2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "8765432109",
          citizenship: "Foreign National",
          donationType: "Monthly",
          birthdate: "1992-03-22",
          amount: 5000,
          certificate: true,
          createdAt: "2025-05-01T14:45:00Z",
          status: "processing"
        },
        {
          _id: "don3",
          name: "Rajesh Sharma",
          email: "rajesh@example.com",
          phone: "7654321098",
          citizenship: "Indian Citizen",
          donationType: "Once",
          birthdate: "1976-11-08",
          amount: 10000,
          certificate: true,
          createdAt: "2025-05-03T09:15:00Z",
          status: "new"
        },
        {
          _id: "don4",
          name: "Emily Wang",
          email: "emily@example.com",
          phone: "6543210987",
          citizenship: "Foreign National",
          donationType: "Monthly",
          birthdate: "1990-07-30",
          amount: 3000,
          certificate: false,
          createdAt: "2025-04-20T16:00:00Z",
          status: "failed"
        }
      ];

      setDashboardData({
        totalDonors: 178,
        totalDonations: 245,
        totalAmount: 1245000,
        upcomingEvents: 3,
        donations: mockDonations,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Unable to load dashboard data. Please try again later.");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleStatusChange = (donationId, newStatus) => {
    setSelectedDonation(donationId);
    setSelectedAction(newStatus);
    setIsDialogOpen(true);
  };

  const getStatusDisplayName = (status) => {
    return STATUS_MAP[status]?.displayName || status;
  };

  const getApiStatusValue = (action) => {
    const actionMap = {
      "donation-completed": "completed",
      "donation-failed": "failed",
      "donation-processing": "processing",
    };
    return actionMap[action] || "new";
  };

  const confirmStatusChange = async () => {
    setIsSubmitting(true);
    const newApiStatus = getApiStatusValue(selectedAction);

    try {
      // In a real application, this would be an API call to update the status
      
      // Mock update for demo purposes
      const updatedDonations = dashboardData.donations.map(donation => {
        if (donation._id === selectedDonation) {
          return { ...donation, status: newApiStatus };
        }
        return donation;
      });
      
      setDashboardData({
        ...dashboardData,
        donations: updatedDonations
      });
      
      setFilteredDonations(updatedDonations);
      
      toast.success(`Status updated to ${getStatusDisplayName(newApiStatus)}`);
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      setSelectedDonation(null);
      setSelectedAction(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Sidebar>
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Toast container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
            }}
          />

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Donations Dashboard</h1>
              {filterApplied && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 py-1"
                >
                  <Filter className="h-3 w-3" />
                  Filter Applied
                </Badge>
              )}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {error}
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users />}
              title="Total Donors"
              value={dashboardData.totalDonors}
              color="blue"
            />
            <StatCard
              icon={<HeartHandshake />}
              title="Total Donations"
              value={dashboardData.totalDonations}
              color="purple"
            />
            <StatCard
              icon={<DollarSign />}
              title="Total Amount"
              value={formatAmount(dashboardData.totalAmount)}
              color="green"
            />
            <StatCard
              icon={<Calendar />}
              title="Upcoming Events"
              value={dashboardData.upcomingEvents}
              color="amber"
            />
          </div>

          {/* Donations Table */}
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Donation Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredDonations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No donations found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Citizenship</TableHead>
                      <TableHead>Donation Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Certificate</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.map((donation) => {
                      const statusInfo =
                        STATUS_MAP[donation.status] || STATUS_MAP.new;
                      return (
                        <TableRow key={donation._id}>
                          <TableCell>{donation.name}</TableCell>
                          <TableCell>{donation.phone}</TableCell>
                          <TableCell>{donation.email}</TableCell>
                          <TableCell>{donation.citizenship}</TableCell>
                          <TableCell>{donation.donationType}</TableCell>
                          <TableCell>{formatAmount(donation.amount)}</TableCell>
                          <TableCell>{donation.certificate ? "Yes" : "No"}</TableCell>
                          <TableCell>{formatDate(donation.createdAt)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={statusInfo.badge.variant}
                              className={statusInfo.badge.className}
                            >
                              <div className="flex items-center">
                                {statusInfo.badge.icon}
                                {statusInfo.displayName}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      donation._id,
                                      "donation-processing"
                                    )
                                  }
                                >
                                  Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      donation._id,
                                      "donation-completed"
                                    )
                                  }
                                >
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(donation._id, "donation-failed")
                                  }
                                >
                                  Mark as Failed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Alert Dialog */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to mark this donation as{" "}
                  <strong>
                    {getStatusDisplayName(getApiStatusValue(selectedAction))}
                  </strong>
                  ?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmStatusChange}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Yes, Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Sidebar>
    </>
  );
};

export default Donations;