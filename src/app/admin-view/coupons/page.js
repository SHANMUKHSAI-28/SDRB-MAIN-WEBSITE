"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { PencilIcon, TrashIcon } from "lucide-react";

const initialFormData = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderValue: "",
  startDate: "",
  endDate: "",
  usageLimit: "",
  userUsageLimit: "",
  productCategories: [],
  isActive: true,
};

// Form field config for ease of maintenance
const formFields = [
  { id: 'code', label: 'Coupon Code', type: 'text', placeholder: 'Enter coupon code' },
  { id: 'description', label: 'Description', type: 'text', placeholder: 'Enter description' },
  { id: 'discountType', label: 'Discount Type', type: 'select', options: [
    { id: 'PERCENTAGE', label: 'Percentage' },
    { id: 'FIXED', label: 'Fixed Amount' },
    { id: 'FREE_SHIPPING', label: 'Free Shipping' }
  ]},
  { id: 'discountValue', label: 'Discount Value', type: 'number', placeholder: 'Enter discount value' },
  { id: 'minOrderValue', label: 'Minimum Order Value', type: 'number', placeholder: 'Enter minimum order value' },
  { id: 'startDate', label: 'Start Date', type: 'date' },
  { id: 'endDate', label: 'End Date', type: 'date' },
  { id: 'usageLimit', label: 'Total Usage Limit', type: 'number', placeholder: 'Enter total usage limit' },
  { id: 'userUsageLimit', label: 'Per User Usage Limit', type: 'number', placeholder: 'Enter per user usage limit' }
];

export default function AdminCoupons() {
  const [formData, setFormData] = useState(initialFormData);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Error fetching coupons");
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  async function handleSubmit() {
    if (!formData.code || !formData.description || !formData.discountType || 
        !formData.discountValue || !formData.minOrderValue || !formData.startDate || 
        !formData.endDate || !formData.usageLimit || !formData.userUsageLimit) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.discountType === 'PERCENTAGE' && (formData.discountValue <= 0 || formData.discountValue > 100)) {
      toast.error("Percentage discount must be between 0 and 100");
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast.error("End date must be after start date");
      return;
    }

    if (new Date(formData.startDate) < new Date()) {
      toast.error("Start date must be in the future");
      return;
    }
    try {
      setLoading(true);

      const url = selectedCoupon
        ? `/api/admin/coupons/${selectedCoupon._id}`
        : "/api/admin/coupons/add";

      const res = await fetch(url, {
        method: selectedCoupon ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          selectedCoupon ? "Coupon updated successfully!" : "Coupon created successfully!"
        );
        setFormData(initialFormData);
        setSelectedCoupon(null);
        fetchCoupons();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error handling coupon:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(couponId) {
    try {
      const res = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Coupon deleted successfully!");
        fetchCoupons();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Error deleting coupon");
    }
  }

  function handleEdit(coupon) {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue,
      startDate: new Date(coupon.startDate).toISOString().split('T')[0],
      endDate: new Date(coupon.endDate).toISOString().split('T')[0],
      usageLimit: coupon.usageLimit,
      userUsageLimit: coupon.userUsageLimit,
      productCategories: coupon.productCategories,
      isActive: coupon.isActive,
    });
  }

  return (
    <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <div className="flex gap-2 flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <h1 className="text-4xl font-bold text-gray-900">{selectedCoupon ? 'Edit' : 'Create'} Coupon</h1>
              {selectedCoupon && (
                <button
                  onClick={() => {
                    setSelectedCoupon(null);
                    setFormData(initialFormData);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Create New
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Fields */}
              {formFields.map((field) => 
                field.type === 'select' ? (
                  <SelectComponent
                    key={field.id}
                    label={field.label}
                    value={formData[field.id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    options={field.options}
                  />
                ) : (
                  <InputComponent
                    key={field.id}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.id]: field.id === 'code' ? e.target.value.toUpperCase() : e.target.value
                      })
                    }
                  />
                )
              )}

              {/* Product Categories */}
              <SelectComponent
                label="Product Categories"
                value={formData.productCategories}
                multiple={true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productCategories: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                options={[
                  { id: "RETROFIT", label: "Retrofit" },
                  { id: "SMARTSWITCH", label: "Smart Switch" },
                  { id: "SECURITY", label: "Security" },
                ]}
              />

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="inline-flex justify-center rounded-md bg-black px-8 py-3 text-sm font-semibold text-white outline-none hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                selectedCoupon ? "Update Coupon" : "Create Coupon"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h2 className="text-2xl font-semibold text-gray-900">All Coupons</h2>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the coupons including their code, description, discount and status.
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {coupon.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {coupon.discountType === 'PERCENTAGE' 
                      ? `${coupon.discountValue}%` 
                      : coupon.discountType === 'FIXED' 
                        ? `₹${coupon.discountValue}` 
                        : 'Free Shipping'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      coupon.isActive 
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No coupons found. Create your first coupon above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
