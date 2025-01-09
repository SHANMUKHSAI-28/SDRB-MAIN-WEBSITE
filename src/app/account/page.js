"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddresses,
  updateAddress,
} from "@/services/address";
import { addNewAddressFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { User, MapPin, Package2, Plus, Pencil, Trash2 } from "lucide-react";

export default function Account() {
  const {
    user,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    componentLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);
  const router = useRouter();

  // Existing functions remain unchanged
  async function extractAllAddresses() {
    setPageLevelLoader(true);
    const res = await fetchAllAddresses(user?._id);
    if (res.success) {
      setPageLevelLoader(false);
      setAddresses(res.data);
    }
  }

  async function handleAddOrUpdateAddress() {
    setComponentLevelLoader({ loading: true, id: "" });
    const res = currentEditedAddressId !== null
      ? await updateAddress({
          ...addressFormData,
          _id: currentEditedAddressId,
        })
      : await addNewAddress({ ...addressFormData, userID: user?._id });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
      extractAllAddresses();
      setCurrentEditedAddressId(null);
      setShowAddressForm(false);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  function handleUpdateAddress(getCurrentAddress) {
    setShowAddressForm(true);
    setAddressFormData({
      fullName: getCurrentAddress.fullName,
      city: getCurrentAddress.city,
      country: getCurrentAddress.country,
      postalCode: getCurrentAddress.postalCode,
      address: getCurrentAddress.address,
    });
    setCurrentEditedAddressId(getCurrentAddress._id);
  }

  async function handleDelete(getCurrentAddressID) {
    setComponentLevelLoader({ loading: true, id: getCurrentAddressID });
    const res = await deleteAddress(getCurrentAddressID);
    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllAddresses();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) extractAllAddresses();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Section */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push("/orders")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
              >
                <Package2 className="h-4 w-4 mr-2" />
                View Orders
              </button>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Saved Addresses</h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
              >
                {showAddressForm ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </>
                )}
              </button>
            </div>

            {pageLevelLoader ? (
              <div className="flex justify-center py-8">
                <PulseLoader color={"#000000"} loading={pageLevelLoader} size={15} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses && addresses.length ? (
                  addresses.map((item) => (
                    <div
                      key={item._id}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.fullName}</h4>
                          <p className="text-gray-600 mt-1">{item.address}</p>
                          <p className="text-gray-600">{item.city}, {item.country} {item.postalCode}</p>
                          
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => handleUpdateAddress(item)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                            >
                              <Pencil className="h-4 w-4 mr-1.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="inline-flex items-center px-3 py-1.5 border border-red-200 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                              {componentLevelLoader.loading && componentLevelLoader.id === item._id ? (
                                <ComponentLevelLoader
                                  text={"Deleting"}
                                  color={"#DC2626"}
                                  loading={true}
                                />
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-1.5" />
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                    <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No addresses found</p>
                    <p className="text-sm text-gray-500">Add a new address to get started</p>
                  </div>
                )}
              </div>
            )}

            {/* Address Form */}
            {showAddressForm && (
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-6">
                  {currentEditedAddressId ? "Update Address" : "Add New Address"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addNewAddressFormControls.map((controlItem) => (
                    <InputComponent
                      key={controlItem.id}
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      value={addressFormData[controlItem.id]}
                      onChange={(event) =>
                        setAddressFormData({
                          ...addressFormData,
                          [controlItem.id]: event.target.value,
                        })
                      }
                    />
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    onClick={handleAddOrUpdateAddress}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                  >
                    {componentLevelLoader.loading ? (
                      <ComponentLevelLoader
                        text={"Saving"}
                        color={"#ffffff"}
                        loading={true}
                      />
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}