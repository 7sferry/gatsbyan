import { onChangeRupiah } from "../utils/GatsbyanUtils";
import React from "react";

const CurrencyInput = ({ id, name, required, className, placeHolder = "Rp" }: CurrencyInputAttr) => {
  const [currentUnitPriceValue, setCurrentUnitPriceValue] = React.useState("");

  return (
    <input
      type="text"
      name={name}
      id={id}
      className={className}
      placeholder={placeHolder}
      onChange={(e) => setCurrentUnitPriceValue(onChangeRupiah(e))}
      value={currentUnitPriceValue}
      required={required}
    />
  );
};

interface CurrencyInputAttr {
  id: string;
  name: string;
  placeHolder?: string;
  required: boolean;
  className: string;
}

export default CurrencyInput;
