import { onChangeRupiah } from "../utils/GatsbyanUtils";
import React from "react";

const CurrencyInput = ({ id, name, placeHolder = "Rp" }) => {
  const [currentUnitPriceValue, setCurrentUnitPriceValue] = React.useState("");

  return (
    <input
      type="text"
      name={name}
      id={id}
      className="input-field"
      placeholder={placeHolder}
      onChange={(e) => setCurrentUnitPriceValue(onChangeRupiah(e))}
      value={currentUnitPriceValue}
      required={true}
    />
  );
};

export default CurrencyInput;
