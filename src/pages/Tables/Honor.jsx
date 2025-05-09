import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "../../utils/Datatable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from "../../layout/Sidebar";

const Honor = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://sucheta.traficoanalytica.com/api/v1/enquiry/get-in-honour-donations"
      );

      const donationData = response?.data?.data;
      if (!Array.isArray(donationData)) {
        throw new Error("Invalid data format received from API");
      }

      setDonations(donationData);
    } catch (err) {
      setError(err.message || "Failed to fetch donations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDonation = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donation?"
    );
    if (!confirmDelete) return;

    console.log(`Attempting to delete donation with ID: ${id}`);
    try {
      // Using POST instead of DELETE and sending ID in the request body
      await axios.post(
        `http://sucheta.traficoanalytica.com/api/v1/enquiry/delete-in-honour-donation`,
        { id }
      );

      setDonations((prev) => prev.filter((d) => d._id !== id));
      console.log(`Donation ${id} deleted successfully`);
    } catch (err) {
      console.error(`Failed to delete donation ${id}:`, err);
      alert("Failed to delete donation. Please try again.");
    }
  };

  const renderCertificateField = (field, row) => {
    return row.original.wants80GCertificate
      ? row.original.certificateDetails?.[field] || ""
      : null;
  };

  const columns = [
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "mobileNumber", header: "Mobile" },
    { accessorKey: "alternateMobileNumber", header: "Alt. Mobile" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "birthdate", header: "Birthdate" },
    { accessorKey: "citizenship", header: "Citizenship" },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info) => {
        const value = info.getValue();
        return value ? new Date(value).toLocaleDateString() : "";
      },
    },
    // { accessorKey: "panNumber", header: "PAN Number" },
    // { accessorKey: "address", header: "Address" },
    // { accessorKey: "pinCode", header: "Pincode" },

    { accessorKey: "occasionDate", header: "Occasion Date" },
    { accessorKey: "occasionName", header: "Occasion Name" },
    { accessorKey: "honoreeName", header: "Honoree Name" },
    { accessorKey: "donationType", header: "Donation Type" },
    { accessorKey: "relationshipWithHonoree", header: "Relation" },
    { accessorKey: "honoreeEmail", header: "Honoree Email" },
    { accessorKey: "honoreeMobile", header: "Honoree Mobile" },
    

  

    // Certificate Fields
    {
      accessorKey: "certificateDetails.panCardNumber",
      header: "Certificate PAN",
      cell: ({ row }) => renderCertificateField("panCardNumber", row),
    },
    {
      accessorKey: "certificateDetails.certificateAddress",
      header: "Certificate Address",
      cell: ({ row }) => renderCertificateField("certificateAddress", row),
    },
    {
      accessorKey: "certificateDetails.certificatePinCode",
      header: "Certificate Pincode",
      cell: ({ row }) => renderCertificateField("certificatePinCode", row),
    },
    {
      accessorKey: "certificateDetails.certificateCity",
      header: "Certificate City",
      cell: ({ row }) => renderCertificateField("certificateCity", row),
    },
    {
      accessorKey: "certificateDetails.certificateState",
      header: "Certificate State",
      cell: ({ row }) => renderCertificateField("certificateState", row),
    },
    {
      accessorKey: "certificateDetails.preferenceState",
      header: "Preference State",
      cell: ({ row }) => renderCertificateField("preferenceState", row),
    },

    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => (info.getValue() ? `₹${info.getValue()}` : ""),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        if (!status) return null;
        const statusClass =
          status === "completed"
            ? "bg-green-100 text-green-800"
            : status === "failed"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800";

        return <Badge className={statusClass}>{status}</Badge>;
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
        {error ? (
          <>
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={fetchDonations} className="mt-2">
              Retry
            </Button>
          </>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : donations.length === 0 ? (
          <p>No donations found.</p>
        ) : (
          <DataTable columns={columns} data={donations} />
        )}
      </div>
    </Sidebar>
  );
};

export default Honor;