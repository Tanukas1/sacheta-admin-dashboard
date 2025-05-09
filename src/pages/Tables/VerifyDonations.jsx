import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "../../utils/Datatable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Sidebar from "../../layout/Sidebar";

const VerifyDonations = () => {
  const [dashboardData, setDashboardData] = useState({
    donations: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        "https://sucheta.traficoanalytica.com/api/v1/enquiry/get-verify-donations"
      ); // Replace with actual endpoint
      if (response.data?.success) {
        setDashboardData({
          donations: response.data.data,
        });
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setDashboardData((prev) => ({
      ...prev,
      donations: prev.donations.map((donation) =>
        donation._id === id ? { ...donation, status: newStatus } : donation
      ),
    }));
  };

  const handleDeleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (!confirmDelete) return;

    console.log(`Attempting to delete donation with ID: ${id}`);
    try {
      await axios.post(
        `https://sucheta.traficoanalytica.com/api/v1/enquiry/delete-verify-donation`,
        { id }
      );
      setDashboardData((prev) => ({
        ...prev,
        donations: prev.donations.filter((donation) => donation._id !== id),
      }));
      console.log(`Donation ${id} deleted successfully`);
    } catch (err) {
      console.error(`Failed to delete donation ${id}:`, err);
      alert("Failed to delete donation. Please try again.");
    }
  };

  const columns = [
    {
      accessorKey: "firstName",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "contactNumber",
      header: "Mobile",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "donationAmount",
      header: "Donation Amount",
      cell: (info) => `₹${info.getValue()}`,
    },
    {
      accessorKey: "donationScreenshot",
      header: "Donation Screenshot",
      cell: (info) => {
        const path = info.getValue(); // e.g., "public/temp/..."
        const relativePath = path.replace("public/", "/"); // gives "/temp/..."
        const fullPath = `https://sucheta.traficoanalytica.com${relativePath}`;
        return (
          <a href={fullPath} target="_blank" rel="noopener noreferrer">
            <img
              src={fullPath}
              alt="Donation Screenshot"
              className="w-16 h-16 object-cover rounded border"
            />
          </a>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteDonation(row.original._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Donations</h1>
        <DataTable columns={columns} data={dashboardData.donations} />
      </div>
    </Sidebar>
  );
};

export default VerifyDonations;
