"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { registerNewUser } from "@/services/register";
import { registrationFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [isRegistered, setIsRegistered] = useState(false);
  const { pageLevelLoader, setPageLevelLoader, isAuthUser } =
    useContext(GlobalContext);

  const router = useRouter();

  function isFormValid() {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== ""
    );
  }

  async function handleRegisterOnSubmit() {
    setPageLevelLoader(true);
    try {
      const data = await registerNewUser(formData);
      if (data.success) {
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsRegistered(true);
        setFormData(initialFormData);
      } else {
        toast.error(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setPageLevelLoader(false);
    }
  }

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {isRegistered ? (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <UserPlus className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-900">Welcome!</h2>
                <p className="text-gray-600">Your account has been created successfully.</p>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-black hover:bg-gray-900 text-white rounded-lg px-6 py-4 text-sm font-medium transition-all duration-200 ease-in-out hover:shadow-lg"
                >
                  Continue to Login
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-gray-900">Create Account</h2>
                  <p className="mt-2 text-gray-600">Join our community today</p>
                </div>
                <div className="space-y-6">
                  {registrationFormControls.map((controlItem) =>
                    controlItem.componentType === "input" ? (
                      <div key={controlItem.id} className="space-y-2">
                        <InputComponent
                          type={controlItem.type}
                          placeholder={controlItem.placeholder}
                          label={controlItem.label}
                          onChange={(event) => {
                            setFormData({
                              ...formData,
                              [controlItem.id]: event.target.value,
                            });
                          }}
                          value={formData[controlItem.id]}
                        />
                      </div>
                    ) : controlItem.componentType === "select" ? (
                      <div key={controlItem.id} className="space-y-2">
                        <SelectComponent
                          options={controlItem.options}
                          label={controlItem.label}
                          onChange={(event) => {
                            setFormData({
                              ...formData,
                              [controlItem.id]: event.target.value,
                            });
                          }}
                          value={formData[controlItem.id]}
                        />
                      </div>
                    ) : null
                  )}
                  <button
                    className={`w-full bg-black hover:bg-gray-900 text-white rounded-lg px-6 py-4 text-sm font-medium 
                    transition-all duration-200 ease-in-out hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                    ${pageLevelLoader ? "cursor-wait" : ""}`}
                    disabled={!isFormValid() || pageLevelLoader}
                    onClick={handleRegisterOnSubmit}
                  >
                    {pageLevelLoader ? (
                      <ComponentLevelLoader
                        text="Creating your account..."
                        color="#ffffff"
                        loading={pageLevelLoader}
                      />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-black hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
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