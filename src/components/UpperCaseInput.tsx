import React from "react";

/************************
 * Made by [MR Ferry™]  *
 * on November 2022     *
 ************************/

const UpperCaseInput = ({ id, name, required, placeholder, className }: UpperCaseInputAttr) => {
  const [upperCase, setUpperCase] = React.useState("");

  return (
    <input
      type="text"
      name={name}
      id={id}
      className={className}
      placeholder={placeholder}
      required={required}
      onChange={(e) => setUpperCase(handleChange(e))}
      value={upperCase}
    />
  );
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  return event.target.value.toUpperCase();
};

interface UpperCaseInputAttr {
  id: string;
  name: string;
  required: boolean;
  placeholder: string;
  className: string;
}

export default UpperCaseInput;
