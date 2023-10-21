import * as yup from "yup";

export const validationSchema = [yup.object({
    fullName: yup.string().required("Full Name is Required."),
    address1: yup.string().required("Address Line 1 is Required."),
    address2: yup.string().required("Address Line 2 is Required."),
    city: yup.string().required("City is Required."),
    state: yup.string().required("State is Required."),
    country: yup.string().required("Country is Required."),
    saveAddress: yup.boolean(),
}),
    yup.object({}),
    yup.object({
        cardName: yup.string().required("Card Name is Required.")
    })];