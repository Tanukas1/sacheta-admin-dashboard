import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Sidebar from "../../layout/Sidebar";
import { DataTable } from "../../utils/Datatable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Ocassional = () => {
  const [dashboardData, setDashboardData] = useState({
    donations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://sucheta.traficoanalytica.com/api/v1/enquiry/get-special-occasion-donations");
      const result = await res.json();
      if (result.success) {
        setDashboardData({ donations: result.data });
      } else {
        throw new Error(result.message || "Failed to fetch donations");
      }
    } catch (error) {
      setError("Error fetching donations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDonation = async () => {
    try {
      await axios.post(
        `https://sucheta.traficoanalytica.com/api/v1/enquiry/delete-special-occasion-donation`,
        { id: deleteId }
      );
      setDashboardData(prev => ({
        ...prev,
        donations: prev.donations.filter(donation => donation._id !== deleteId)
      }));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error(`Failed to delete donation ${deleteId}:`, err);
      alert("Failed to delete donation. Please try again.");
    }
  };

  const columns = [
    {
      accessorKey: "occasionDate",
      header: "Occasion Date",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    },
    { accessorKey: "occasionName", header: "Occasion Name" },
    { accessorKey: "honoreeName", header: "Honoree Name" },
    { accessorKey: "fullName", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobileNumber", header: "Mobile" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDonation(row.original)}
          >
            View
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setDeleteId(row.original._id);
              setShowDeleteConfirm(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Special Occasion Donations</h1>
        {error ? (
          <>
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={fetchDashboardData} className="mt-2">
              Retry
            </Button>
          </>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : dashboardData.donations.length === 0 ? (
          <p>No donations found.</p>
        ) : (
          <DataTable columns={columns} data={dashboardData.donations} />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this donation? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteDonation}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Donation Details Modal */}
        <Dialog
          open={!!selectedDonation}
          onOpenChange={() => setSelectedDonation(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Donation Details</DialogTitle>
            </DialogHeader>
            {selectedDonation && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4

">
                    <p>
                      <strong>Name:</strong> {selectedDonation.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedDonation.email}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {selectedDonation.mobileNumber}
                    </p>
                    <p>
                      <strong>Birthdate:</strong>{" "}
                      {selectedDonation.birthdate
                        ? new Date(selectedDonation.birthdate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Citizenship:</strong> {selectedDonation.citizenship || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Occasion Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <p>
                      <strong>Occasion Date:</strong>{" "}
                      {selectedDonation.occasionDate
                        ? new Date(selectedDonation.occasionDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Occasion Name:</strong> {selectedDonation.occasionName || "N/A"}
                    </p>
                    <p>
                      <strong>Honoree Name:</strong> {selectedDonation.honoreeName || "N/A"}
                    </p>
                    <p>
                      <strong>Relationship with Honoree:</strong>{" "}
                      {selectedDonation.relationshipWithHonoree || "N/A"}
                    </p>
                    <p>
                      <strong>Donation Type:</strong> {selectedDonation.donationType || "N/A"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {selectedDonation.createdAt
                        ? new Date(selectedDonation.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Donation ID:</strong> {selectedDonation._id}
                    </p>
                  </div>
                </div>

                {selectedDonation.wants80GCertificate && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Certificate Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p>
                        <strong>PAN Number:</strong>{" "}
                        {selectedDonation.certificateDetails?.panCardNumber || "N/A"}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedDonation.certificateDetails?.certificateAddress || "N/A"}
                      </p>
                      <p>
                        <strong>Pincode:</strong>{" "}
                        {selectedDonation.certificateDetails?.certificatePinCode || "N/A"}
                      </p>
                      <p>
                        <strong>City:</strong>{" "}
                        {selectedDonation.certificateDetails?.certificateCity || "N/A"}
                      </p>
                      <p>
                        <strong>State:</strong>{" "}
                        {selectedDonation.certificateDetails?.certificateState || "N/A"}
                      </p>
                      <p>
                        <strong>Preference State:</strong>{" "}
                        {selectedDonation.certificateDetails?.preferenceState || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedDonation(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Sidebar>
  );
};

export default Ocassional;