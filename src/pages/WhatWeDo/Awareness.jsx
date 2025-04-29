"use client";
import React, { useState, useRef } from "react";
import Sidebar from "../../layout/Sidebar";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Awareness() {
  const [singleImage, setSingleImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const singleFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Single Image:", singleImage);
    console.log("Gallery Images:", galleryImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Single Image Drop
  const handleSingleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSingleImage(file);
    }
  };

  // Gallery Images Drop
  const handleGalleryDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setGalleryImages((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSingleImage(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setGalleryImages((prev) => [...prev, ...imageFiles]);
  };

  const handleSingleClick = () => {
    if (singleFileInputRef.current) {
      singleFileInputRef.current.click();
    }
  };

  const handleGalleryClick = () => {
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.click();
    }
  };

  return (
    <Sidebar>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          {/* Select Category */}
          <div className="flex flex-col space-y-2 col-span-6">
            <Label>Select Category</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Title" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Titles</SelectLabel>
                  <SelectItem value="title1">Title 1</SelectItem>
                  <SelectItem value="title2">Title 2</SelectItem>
                  <SelectItem value="title3">Title 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Title and Gallery Title */}
          <div className="flex flex-col space-y-2 col-span-3">
            <Label>Title</Label>
            <Input placeholder="Enter Title" />
          </div>
          <div className="flex flex-col space-y-2 col-span-3">
            <Label>Gallery Title</Label>
            <Input placeholder="Enter Gallery Title" />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-2 col-span-6">
            <Label>Description</Label>
            <Textarea placeholder="Enter your description here..." />
          </div>

          {/* Single Image Upload */}
          <div className="flex flex-col space-y-2 col-span-3">
            <Label>Single Image</Label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleSingleDrop}
              onClick={handleSingleClick}
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition"
            >
              {singleImage ? (
                <div className="flex flex-col items-center">
                  <p className="text-center font-semibold text-xl mb-2">
                    Single Image Preview
                  </p>
                  <img
                    src={URL.createObjectURL(singleImage)}
                    alt="Single"
                    className="object-cover h-40 w-40 rounded-md"
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  Click or drag to upload a single image
                </p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleSingleImageChange}
              ref={singleFileInputRef}
              className="hidden"
            />
          </div>

          {/* Gallery Images Upload */}
          <div className="flex flex-col space-y-2 col-span-3">
            <Label>Gallery Images</Label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleGalleryDrop}
              onClick={handleGalleryClick}
              className="border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition"
            >
              <p className="text-gray-500 text-center">
                Drag & drop or click to upload gallery images
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              ref={galleryFileInputRef}
              className="hidden"
            />
          </div>

          {/* Single Image Preview (Alone) */}
          {singleImage && (
            <div className="col-span-6">
              <h3 className="text-xl font-semibold mt-4">
                Single Image Preview:
              </h3>
              <div className="border rounded-lg overflow-hidden mb-4 p-4 flex justify-center">
                <img
                  src={URL.createObjectURL(singleImage)}
                  alt="Single Image"
                  className="object-cover h-48 w-48 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Gallery Images Preview (Alone) */}
          {galleryImages.length > 0 && (
            <div className="col-span-6">
              <h3 className="text-xl font-semibold mt-4">
                Gallery Images Preview:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                {galleryImages.map((file, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Gallery Preview ${index}`}
                      className="object-cover w-full h-32"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="col-span-6 flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}

export default Awareness;
