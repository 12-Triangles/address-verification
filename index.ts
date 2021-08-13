const Client = require("node-rest-client").Client;
const client = new Client();
const SHIPPING_API_VERIFY_BASE_URL =
  "https://secure.shippingapis.com/ShippingAPI.dll?API=Verify";

module.exports = async function validateAddress(
  uid: string,
  address: Address
): Promise<Address> {
  return new Promise((resolve) => {
    const addressXML =
      encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>
            <AddressValidateRequest USERID="${uid}">
            <Revision>1</Revision>
            <Address ID="0">
            <Address1/>
            <Address2>${address.street}</Address2>
            <City/>
            <State/>
            <Zip5>${address.zip5}</Zip5>
            <Zip4/>
            </Address>
            </AddressValidateRequest>`);

    const validateUrl = `${SHIPPING_API_VERIFY_BASE_URL}&XML=${addressXML}`;
    client.get(validateUrl, (data) => {
      const address: Address = {
        street: data.AddressValidateResponse.Address.Address2,
        city: data.AddressValidateResponse.Address.City,
        state: data.AddressValidateResponse.Address.State,
        zip4: data.AddressValidateResponse.Address.Zip4,
        zip5: data.AddressValidateResponse.Address.Zip5,
        isBusiness: data.AddressValidateResponse.Address.Business === "Y",
        isVavant: data.AddressValidateResponse.Address.Vacant === "Y",
        error: data.AddressValidateResponse.Address.ReturnText,
      };

      resolve(address);
    });
  });
};

export class Address {
  street?: string;
  city?: string;
  state?: string;
  zip4?: string;
  zip5?: string;
  isBusiness?: boolean;
  isVavant?: boolean;
  error?: string;
}
