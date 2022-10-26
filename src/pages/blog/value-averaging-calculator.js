import React from "react";
import ReactDOM from "react-dom";
import { VcaCalculator } from "../../utils/VcaCalculator";
import { getVcaResult } from "../../components/VcaFormResult";
import { onChangeRupiah } from "../../utils/GatsbyanUtils";
import CustomPage from "../../components/CustomPage";
import { graphql, useStaticQuery } from "gatsby";
import { customPostContextByCode } from "/custom-post-by-slug";

/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/

const vcaContext = customPostContextByCode.get("vca");

const Vca = () => {
  const element = React.createRef();
  const clearResult = (e) => {
    e?.preventDefault();
    const parentResult = document.getElementById("result");
    while (parentResult.firstChild) {
      parentResult.firstChild.remove();
    }
  };

  const calculate = (e) => {
    e.preventDefault();
    clearResult(null);
    const currentUnitPrice = e.target.currentUnitPrice.value;
    let stock = new VcaCalculator({
      stockName: e.target.stockName.value,
      currentUnitPrice: currentUnitPrice,
      totalLot: e.target.unitType.value === "lot" ? e.target.totalLot.value : e.target.totalLot.value / 100,
      monthlyInvestTarget: e.target.monthlyInvestTarget.value,
      since: new Date(e.target.sinceYear.value + "-" + e.target.sinceMonth.value),
    });

    const divElement = document.createElement("div");
    element.current.appendChild(divElement);
    const vcaResult = getVcaResult(stock);
    ReactDOM.render(vcaResult, divElement);
  };

  const [currentUnitPriceValue, setCurrentUnitPriceValue] = React.useState("");
  const [monthlyInvestTargetValue, setMonthlyInvestTargetValue] = React.useState("");

  const { site } = useStaticQuery(
    graphql`
      query BlogPageSlug {
        site {
          siteMetadata {
            siteUrl
            repo
          }
        }
      }
    `
  );

  return (
    <CustomPage site={site.siteMetadata} customPost={vcaContext}>
      <form id="survey-form" onSubmit={calculate}>
        <div className="rowTab">
          <div className="labels">
            <label id="name-label" htmlFor="stockName">
              Nama Emiten:{" "}
            </label>
          </div>
          <div className="rightTab">
            <input
              type="text"
              name="stockName"
              id="stockName"
              className="input-field"
              placeholder="BYAN"
              style={{ textTransform: "uppercase" }}
              required={true}
            />
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="email-label" htmlFor="sinceMonth">
              Mulai sejak:{" "}
            </label>
          </div>
          <div className="rightTab" key={"since"}>
            <select id="sinceMonth" name="sinceMonth" className="dropdown" style={{ width: "40%" }}>
              <optgroup>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </optgroup>
            </select>
            <input
              type="number"
              name="sinceYear"
              id="sinceYear"
              className="input-field"
              placeholder="2022"
              style={{ width: "25%" }}
              min={1970}
              max={3000}
              required={true}
            />
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="number-label" htmlFor="totalLot">
              Total stock yang dimiliki saat ini:{" "}
            </label>
          </div>
          <div className="rightTab" key={"totalLot"}>
            <input
              type="number"
              name="totalLot"
              id="totalLot"
              className="input-field"
              style={{ width: "40%" }}
              min={0}
              placeholder="10"
              required={true}
            />
            <select id="unitType" name="unitType" className="dropdown" style={{ width: "25%" }}>
              <option value="lot">Lot</option>
              <option value="unit">Unit</option>
            </select>
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="number-label" htmlFor="currentUnitPrice">
              Harga saat ini (dalam unit):{" "}
            </label>
          </div>
          <div className="rightTab" key={"currentUnitPrice"}>
            <input
              type="text"
              name="currentUnitPrice"
              id="currentUnitPrice"
              className="input-field"
              placeholder={"Rp"}
              onChange={(e) => setCurrentUnitPriceValue(onChangeRupiah(e))}
              value={currentUnitPriceValue}
              required={true}
            />
          </div>
        </div>
        <div className="rowTab">
          <div className="labels">
            <label id="number-label" htmlFor="monthlyInvestTarget">
              Target investasi bulanan:{" "}
            </label>
          </div>
          <div className="rightTab" key={"monthlyInvestTarget"}>
            <input
              type="text"
              name="monthlyInvestTarget"
              id="monthlyInvestTarget"
              className="input-field"
              placeholder={"Rp"}
              onChange={(e) => setMonthlyInvestTargetValue(onChangeRupiah(e))}
              value={monthlyInvestTargetValue}
              required={true}
            />
          </div>
        </div>
        <div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <button id="submit" type="submit">
              Calculate
            </button>
            {/*<button id="clear" type="reset">Reset</button>*/}
            <button id="clear" onClick={clearResult}>
              Clear
            </button>
          </div>
        </div>
      </form>
      <div id="result" ref={element} />
    </CustomPage>
  );
};

export default Vca;
