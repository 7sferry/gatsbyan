import React from "react";
import ReactDOM from "react-dom/client";
import { ValueAveragingStockCalculator } from "../../utils/ValueAveragingStockCalculator";
import { getValueAveragingFormResult } from "../../components/ValueAveragingFormResult";
import CustomPageContainer from "../../components/CustomPageContainer.tsx";
import { graphql, Link, useStaticQuery } from "gatsby";
import Seo from "../../components/Seo";
import { InvestTargetValueInput } from "../../components/value-averaging/InvestTargetValueInput";
import { TotalLotValueInput } from "../../components/value-averaging/TotalLotValueInput";
import { SinceMonthValueInput } from "../../components/value-averaging/SinceMonthValueInput";
import { SinceYearValueInput } from "../../components/value-averaging/SinceYearValueInput";
import { UnitPriceValueInput } from "../../components/value-averaging/UnitPriceValueInput";
import { CustomPostAttr, StockData, UnitType } from "../../types/DataTypes";
import { StockNameValueInput } from "../../components/value-averaging/StockNameValueInput.tsx";

/************************
 * Made by [MR Ferry™]  *
 * on Oktober 2022      *
 ************************/

const pageContext: CustomPostAttr = {
  title: "Value Averaging Calculator",
  description: "Monthly Value Averaging Calculator. Kalkulator untuk menghitung Value Averaging secara bulanan",
  publishDate: "2022-10-23",
  lang: "id",
};

const ValueAveragingCalculator = () => {
  const storageKey = "vcaList";
  const storage = typeof window !== "undefined" ? window.localStorage : null;
  const element: React.RefObject<HTMLDivElement> = React.createRef();
  const [stockCacheValueByName, setStockCacheValueByName] = React.useState(getStockCacheValue());
  const [stockName, setStockName] = React.useState("");

  function getStockCacheValue(): Map<string, StockData> {
    const stockCache = storage?.getItem(storageKey);
    if (stockCache) {
      let parsed = JSON.parse(stockCache);
      return new Map(parsed);
    }
    return new Map();
  }

  const clearResult = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    const parentResult: HTMLElement | null = document.getElementById("result");
    while (parentResult?.firstChild) {
      parentResult?.firstChild?.remove();
    }
  };

  const removeInput = (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    clearResult(e);
    stockCacheValueByName.delete(stockName);
    storage?.setItem(storageKey, JSON.stringify([...stockCacheValueByName]));
    setStockCacheValueByName(stockCacheValueByName);
    setStockName("");
  };

  function constructStockData(e: React.BaseSyntheticEvent): StockData {
    return {
      stockName: e.target.stockName.value,
      currentUnitPrice: e.target.currentUnitPrice.value,
      unitType: UnitType.LOT,
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
    const stock = new ValueAveragingStockCalculator(stockData);

    const divElement: HTMLDivElement = document.createElement("div");
    element?.current?.appendChild(divElement);
    const vcaResult = getValueAveragingFormResult(stock);
    const root = ReactDOM.createRoot(divElement);
    root.render(vcaResult);
    stockCacheValueByName.set(String(stockData.stockName), stockData);
    storage?.setItem(storageKey, JSON.stringify([...stockCacheValueByName]));
    setStockCacheValueByName(stockCacheValueByName);
  };

  const { site } = useStaticQuery(graphql`
    query BlogPageSlug {
      site {
        siteMetadata {
          repo
        }
      }
    }
  `);

  return (
    pageContext && (
      <CustomPageContainer site={site.siteMetadata} customPost={pageContext}>
        <p>
          Berikut ini adalah kalkulator untuk menghitung investasi secara Value Averaging per-bulan. Untuk penjelasan
          mengenai strategi ini bisa dibaca tulisan tentang{" "}
          <Link to={"/blog/pengalaman-investasi-saham-selama-4-bulan#value-averaging"}> strategi saham</Link>
        </p>
        <form id="survey-form" onSubmit={calculate}>
          <div className="rowTab">
            <div className="labels">
              <label id="name-label" htmlFor="stockName">
                Nama Emiten:
              </label>
            </div>
            <div className="rightTab">
              <StockNameValueInput
                onChange={(e) => setStockName(e.target.value.toUpperCase())}
                stockName={stockName}
                stockCacheValueByName={stockCacheValueByName}
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
              <SinceMonthValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
              <SinceYearValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="number-label" htmlFor="totalLot">
                Stock yang dimiliki saat ini:
              </label>
            </div>
            <div className="rightTab" key={"totalLot"}>
              <TotalLotValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} /> Lot
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="number-label" htmlFor="currentUnitPrice">
                Harga saat ini (dalam unit):
              </label>
            </div>
            <div className="rightTab" key={"currentUnitPrice"}>
              <UnitPriceValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
            </div>
          </div>
          <div className="rowTab">
            <div className="labels">
              <label id="number-label" htmlFor="monthlyInvestTarget">
                Target investasi bulanan:
              </label>
            </div>
            <div className="rightTab" key={"monthlyInvestTarget"}>
              <InvestTargetValueInput stockCacheValueByName={stockCacheValueByName} stockName={stockName} />
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
              <button className="reset-vca" onClick={removeInput}>
                Delete
              </button>
            </div>
          </div>
        </form>
        <div id="result" ref={element} />
      </CustomPageContainer>
    )
  );
};

export async function config() {
  return () => {
    return {
      defer: true,
    };
  };
}

export default ValueAveragingCalculator;

export function Head({ location }: any) {
  return (
    <Seo
      title={pageContext?.title}
      description={pageContext?.description}
      lang={pageContext?.lang}
      path={location?.pathname}
    />
  );
}
