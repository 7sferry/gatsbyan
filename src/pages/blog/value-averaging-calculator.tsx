import React from "react";
import ReactDOM from "react-dom/client";
import { StockData, UnitType, VcaCalculator } from "../../utils/VcaCalculator";
import { getVcaResult } from "../../components/VcaFormResult";
import CustomPage from "../../components/CustomPage";
import { graphql, useStaticQuery } from "gatsby";
import { customPostContextByCode } from "../../../custom-post-by-slug";
import Seo from "../../components/Seo";
import { onChangeRupiah } from "../../utils/GatsbyanUtils";

/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/

const postContext = customPostContextByCode.get("vca");

const Vca = () => {
  const storage = typeof window !== "undefined" ? window.localStorage : null;
  const VCA_STORAGE = "vca";
  const element: React.RefObject<HTMLDivElement> = React.createRef();

  const [stockNameValue, setStockNameValue] = React.useState("");
  const [unitPriceValue, setUnitPriceValue] = React.useState("");
  const [investTargetValue, setInvestTargetValue] = React.useState("");
  const [sinceYearValue, setSinceYearValue] = React.useState("");
  const [sinceMonthValue, setSinceMonthValue] = React.useState("");
  const [totalLotValue, setTotalLotValue] = React.useState("");
  const [unitTypeValue, setUnitTypeValue] = React.useState("");

  React.useEffect(() => {
    const stockCacheValue = getStockCacheValue();
    if (stockCacheValue) {
      setSinceMonthValue(stockCacheValue.sinceMonth || "");
      setStockNameValue(stockCacheValue.stockName || "");
      setUnitPriceValue(String(stockCacheValue.currentUnitPrice || ""));
      setInvestTargetValue(String(stockCacheValue.monthlyInvestTarget || ""));
      setSinceYearValue(String(stockCacheValue.sinceYear || ""));
      setTotalLotValue(String(stockCacheValue.totalLot || ""));
      setUnitTypeValue(String(stockCacheValue.unitType || ""));
    }
  }, []);

  function getStockCacheValue(): StockData {
    const stockCache = storage?.getItem(VCA_STORAGE);
    if (stockCache) {
      return JSON.parse(stockCache);
    }
    return new StockData();
  }

  const clearResult = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    const parentResult: HTMLElement | null = document.getElementById("result");
    while (parentResult?.firstChild) {
      parentResult?.firstChild?.remove();
    }
  };

  const resetInput = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    storage?.removeItem(VCA_STORAGE);
    setStockNameValue("");
    setUnitPriceValue("");
    setUnitTypeValue("");
    setTotalLotValue("");
    setSinceYearValue("");
    setSinceMonthValue("");
    setInvestTargetValue("");
  };

  function constructStockData(e: React.BaseSyntheticEvent): StockData {
    return {
      stockName: e.target.stockName.value,
      currentUnitPrice: e.target.currentUnitPrice.value,
      unitType: e.target.unitType.value,
      totalLot: parseInt(e.target.totalLot.value),
      monthlyInvestTarget: e.target.monthlyInvestTarget.value,
      sinceYear: parseInt(e.target.sinceYear.value),
      sinceMonth: e.target.sinceMonth.value,
    };
  }

  const calculate = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    clearResult();
    const stockData = constructStockData(e);
    const stock = new VcaCalculator(stockData);

    const divElement: HTMLDivElement = document.createElement("div");
    element?.current?.appendChild(divElement);
    const vcaResult = getVcaResult(stock);
    const root = ReactDOM.createRoot(divElement);
    root.render(vcaResult);
    storage?.setItem(VCA_STORAGE, JSON.stringify(stockData));
  };

  const toUpperCase = (event: React.ChangeEvent<HTMLInputElement>) => {
    return event.target.value.toUpperCase();
  };

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
    postContext && (
      <CustomPage site={site.siteMetadata} customPost={postContext}>
        <p>Berikut ini adalah kalkulator untuk menghitung investasi secara Value Averaging per-bulan</p>
        <form id="survey-form" onSubmit={calculate}>
          <div className="rowTab">
            <div className="labels">
              <label id="name-label" htmlFor="stockName">
                Nama Emiten:
              </label>
            </div>
            <div className="rightTab">
              <input
                type="text"
                name={"stockName"}
                id={"stockName"}
                className={"input-field"}
                autoComplete={"off"}
                required={true}
                onChange={(e) => setStockNameValue(toUpperCase(e))}
                value={stockNameValue}
              />
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="email-label" htmlFor="sinceMonth">
                Mulai sejak:
              </label>
            </div>
            <div className="rightTab" key={"since"}>
              <select
                required={true}
                id="sinceMonth"
                name="sinceMonth"
                className="dropdown"
                style={{ width: "40%" }}
                onChange={(e) => setSinceMonthValue(e.target.value)}
                value={sinceMonthValue}
              >
                <option value="">-</option>
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
              </select>
              <input
                type="number"
                name="sinceYear"
                id="sinceYear"
                className="input-field"
                placeholder="year"
                style={{ width: "25%" }}
                min={1970}
                max={3000}
                required={true}
                onChange={(e) => setSinceYearValue(e.target.value)}
                value={sinceYearValue}
              />
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="number-label" htmlFor="totalLot">
                Total stock yang dimiliki saat ini:
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
                placeholder="total"
                required={true}
                onChange={(e) => setTotalLotValue(e.target.value)}
                value={totalLotValue}
              />
              <select
                onChange={(e) => setUnitTypeValue(e.target.value)}
                value={unitTypeValue}
                id="unitType"
                name="unitType"
                className="dropdown"
                style={{ width: "25%" }}
              >
                <option value={UnitType.LOT}>Lot</option>
                <option value={UnitType.UNIT}>Unit</option>
              </select>
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="number-label" htmlFor="currentUnitPrice">
                Harga saat ini (dalam unit):
              </label>
            </div>
            <div className="rightTab" key={"currentUnitPrice"}>
              <input
                type="text"
                name={"currentUnitPrice"}
                id={"currentUnitPrice"}
                className={"input-field"}
                placeholder={"Rp"}
                autoComplete={"off"}
                onChange={(e) => setUnitPriceValue(onChangeRupiah(e))}
                value={unitPriceValue}
                required={true}
              />
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="number-label" htmlFor="monthlyInvestTarget">
                Target investasi bulanan:
              </label>
            </div>
            <div className="rightTab" key={"monthlyInvestTarget"}>
              <input
                type="text"
                name={"monthlyInvestTarget"}
                id={"monthlyInvestTarget"}
                className={"input-field"}
                placeholder={"Rp"}
                autoComplete={"off"}
                onChange={(e) => setInvestTargetValue(onChangeRupiah(e))}
                value={investTargetValue}
                required={true}
              />
            </div>
          </div>
          <div>
            <div style={{ textAlign: "center" }}>
              <button className="submit-vca" type="submit">
                Calculate
              </button>
              <button className="clear-vca" onClick={clearResult}>
                Clear
              </button>
              <button className="reset-vca" onClick={resetInput}>
                Reset
              </button>
            </div>
          </div>
        </form>
        <div id="result" ref={element} />
      </CustomPage>
    )
  );
};

export default Vca;

export function Head({ location }: any) {
  return (
    <Seo
      title={postContext?.title}
      description={postContext?.description}
      lang={postContext?.lang}
      path={location?.pathname}
    />
  );
}
