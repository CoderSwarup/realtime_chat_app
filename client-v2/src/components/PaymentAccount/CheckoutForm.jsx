import React, { useState } from "react";
import {
  useStripe,
  useElements,
  LinkAuthenticationElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button, CircularProgress, Typography } from "@mui/material";

const CheckoutForm = ({ amount, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`, // This won't be used now
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message);
        setError(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("Payment succeeded!");
        onSuccess();
      } else {
        setMessage("An unexpected error occurred.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    }

    setProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" onChange={handleChange} />
      <Button
        type="submit"
        disabled={processing || disabled}
        id="submit"
        variant="contained"
        color="primary"
        sx={{
          my: 2,
        }}
      >
        {processing ? <CircularProgress size={24} /> : "Pay now"}
      </Button>
      {error && (
        <Typography variant="caption" className="card-error" role="alert">
          {error}
        </Typography>
      )}
      {message && (
        <Typography
          display={"block"}
          my={2}
          variant="caption"
          id="payment-message"
        >
          {message}
        </Typography>
      )}
    </form>
  );
};

export default CheckoutForm;

// import React, { useState } from "react";
// import {
//   useStripe,
//   useElements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
// } from "@stripe/react-stripe-js";
// import { Button, CircularProgress } from "@mui/material";

// const CheckoutForm = ({ amount, clientSecret, onSuccess }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [error, setError] = useState(null);
//   const [processing, setProcessing] = useState(false);
//   const [disabled, setDisabled] = useState(true);

//   const handleChange = (event) => {
//     setDisabled(event.empty);
//     setError(event.error ? event.error.message : "");
//   };

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }

//     setProcessing(true);

//     const payload = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardNumberElement),
//         billing_details: {
//           // Include any additional billing details needed
//         },
//       },
//     });

//     if (payload.error) {
//       setError(`Payment failed ${payload.error.message}`);
//       setProcessing(false);
//     } else {
//       setError(null);
//       setProcessing(false);
//       onSuccess();
//     }
//   };

//   return (
//     <form id="payment-form" onSubmit={handleSubmit}>
//       <label>
//         Card Number
//         <CardNumberElement
//           options={{
//             showIcon: true,
//             style: {
//               base: {
//                 fontSize: "16px",
//                 color: "#424770",
//                 "::placeholder": {
//                   color: "#aab7c4",
//                 },
//               },
//             },
//           }}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Expiration Date
//         <CardExpiryElement
//           options={{
//             style: {
//               base: {
//                 fontSize: "16px",
//                 color: "#424770",
//                 "::placeholder": {
//                   color: "#aab7c4",
//                 },
//               },
//             },
//           }}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         CVC
//         <CardCvcElement
//           options={{
//             style: {
//               base: {
//                 fontSize: "16px",
//                 color: "#424770",
//                 "::placeholder": {
//                   color: "#aab7c4",
//                 },
//               },
//             },
//           }}
//           onChange={handleChange}
//         />
//       </label>
//       <Button
//         type="submit"
//         disabled={processing || disabled}
//         id="submit"
//         variant="contained"
//         color="primary"
//       >
//         {processing ? <CircularProgress size={24} /> : "Pay now"}
//       </Button>
//       {error && (
//         <div className="card-error" role="alert">
//           {error}
//         </div>
//       )}
//     </form>
//   );
// };

// export default CheckoutForm;
