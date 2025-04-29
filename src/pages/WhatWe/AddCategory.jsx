"use client"
import React, { useState, useRef } from 'react'
import Sidebar from '../../layout/Sidebar'

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function AddCategory() {

  return (
    <Sidebar>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <form className="space-y-6">

          {/* Title */}
          <div className="flex flex-col space-y-2">
            <Label>Title</Label>
            <Input placeholder="Enter Title" />
          </div>

          {/* Submit Button */}
          <Button type="submit">Submit</Button>

        </form>
      </div>
    </Sidebar>
  )
}

export default AddCategory
