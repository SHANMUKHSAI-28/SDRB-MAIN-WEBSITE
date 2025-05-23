export const navOptions = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  
  { 
    id: "shopnow", 
    label: "Shop Now", 
    submenu: [ 
      { id: "all-products", label: "All Products", path: "/product/listing/all-products" }, 
      { id: "retrofit", label: "Retrofit", path: "/product/listing/RetroFit" },
      { id: "smart-switches", label: "Smart Switches", path: "/product/listing/SmartSwitches" }, 
      { id: "security", label: "Security", path: "/product/listing/Security" } 
    ] 
  },
  { id: "internships", label: "Internships", path: "https://forms.gle/dXzWDuawyueXHDidA" },
  { id: "contact-us", label: "Contact Us", path: "/contact" },
  { id: "aboutus", label: "About Us", path: "/aboutus" },
  { id: "Verify", label: "Verify", path: "https://verify.sdrbtechnologies.com/" }, 
];

export const adminNavOptions = [
  {
    id: "adminListing",
    label: "Manage All Products",
    path: "/admin-view/all-products",
  },
  {
    id: "adminNewProduct",
    label: "Add New Product",
    path: "/admin-view/add-product",
  },
  {
    id: "adminManageInternships",
    label: "Manage Internships",
    path: "/admin-view/internships",
  },  {
    id: "adminAddInternships",
    label: "Add Internships",
    path: "/admin-view/add-internship",
  },
  {
    id: "adminCoupons",
    label: "Manage Coupons",
    path: "/admin-view/coupons",
  },
];
export const registrationFormControls = [
  {
    id: "name",
    type: "text",
    placeholder: "Enter your name",
    label: "Name",
    componentType: "input",
  },
  {
    id: "email",
    type: "email",
    placeholder: "Enter your email",
    label: "Email",
    componentType: "input",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    label: "Password",
    componentType: "input",
  },
];

export const loginFormControls = [
  {
    id: "email",
    type: "email",
    placeholder: "Enter your email",
    label: "Email",
    componentType: "input",
  },
  {
    id: "password",
    type: "password",
    placeholder: "Enter your password",
    label: "Password",
    componentType: "input",
  },
];

export const adminAddProductformControls = [
  {
    id: "name",
    type: "text",
    placeholder: "Enter name",
    label: "Name",
    componentType: "input",
  },
  {
    id: "price",
    type: "number",
    placeholder: "Enter price",
    label: "Price",
    componentType: "input",
  },
  {
    id: "description",
    type: "text",
    placeholder: "Enter description",
    label: "Description",
    componentType: "input",
  },
  {
    id: "category",
    type: "",
    placeholder: "",
    label: "Category",
    componentType: "select",
    options: [
      {
        id: "RetroFit",
        label: "RetroFit",
      },
      {
        id: "SmartSwitches",
        label: "SmartSwitches",
      },
      {
        id: "Security",
        label: "Security",
      },
    ],
  },
  {
    id: "deliveryInfo",
    type: "text",
    placeholder: "Enter deliveryInfo",
    label: "Delivery Info",
    componentType: "input",
  },
  {
    id: "onSale",
    type: "",
    placeholder: "",
    label: "On Sale",
    componentType: "select",
    options: [
      {
        id: "yes",
        label: "Yes",
      },
      {
        id: "no",
        label: "No",
      },
    ],
  },
  {
    id: "priceDrop",
    type: "number",
    placeholder: "Enter Price Drop",
    label: "Price Drop",
    componentType: "input",
  },
];

export const AvailableSizes = [
  {
    id: "s",
    label: "S",
  },
  {
    id: "m",
    label: "M",
  },
  {
    id: "l",
    label: "L",
  },
];

export const firebaseConfig = {
  apiKey: "AIzaSyB4ueWeAITgrofhqbcpRcWNtdWANtzhpUM",
  authDomain: "ssb-automations.firebaseapp.com",
  projectId: "ssb-automations",
  storageBucket: "ssb-automations.appspot.com",
  messagingSenderId: "764868890336",
  appId: "1:764868890336:web:f5cfecafa20e3e94480a85",
  measurementId: "G-4L8V3GPBGJ"
};

export const firebaseStroageURL =
  "gs://ssb-automations.appspot.com";

export const addNewAddressFormControls = [
  {
    id: "fullName",
    type: "input",
    placeholder: "Enter your full name",
    label: "Full Name",
    componentType: "input",
  },
  {
    id: "address",
    type: "input",
    placeholder: "Enter your full address",
    label: "Address",
    componentType: "input",
  },
  {
    id: "city",
    type: "input",
    placeholder: "Enter your city",
    label: "City",
    componentType: "input",
  },
  {
    id: "country",
    type: "input",
    placeholder: "Enter your country",
    label: "Country",
    componentType: "input",
  },
  {
    id: "postalCode",
    type: "input",
    placeholder: "Enter your postal code",
    label: "Postal Code",
    componentType: "input",
  },
];

export const validateCouponData = (couponCode, user, cartItems) => {
  const errors = [];

  if (!couponCode) {
    errors.push('Please enter a coupon code');
  }

  if (!cartItems?.length) {
    errors.push('Your cart is empty');
  }

  if (!user?._id) {
    errors.push('You must be logged in to use coupons');
  }

  const orderValue = cartItems?.reduce((total, item) => item.productID.price + total, 0) || 0;
  if (orderValue <= 0) {
    errors.push('Invalid order value');
  }

  return {
    isValid: errors.length === 0,
    errors,
    orderValue,
    productCategory: cartItems?.[0]?.productID?.category || 'SMARTSWITCH',
    products: cartItems?.map(item => item.productID._id) || []
  };
};

export const calculateCouponDiscount = (discountType, discountValue, orderValue) => {
  switch (discountType) {
    case 'PERCENTAGE':
      return Math.min((orderValue * discountValue) / 100, orderValue);
    case 'FIXED':
      return Math.min(discountValue, orderValue);
    case 'FREE_SHIPPING':
      return 0; // Handle free shipping if you have shipping costs
    default:
      return 0;
  }
};
