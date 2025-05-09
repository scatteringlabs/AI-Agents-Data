import { BigNumber, ethers, utils } from "ethers";
export function formatUSD(amount: number | string): string {
  if (!amount) {
    return "$0";
  }
  const numericAmount = Number(amount);
  // if (numericAmount < 0.01) {
  //   return "<$0.01";
  // }
  if (numericAmount < 1) {
    return `$${numericAmount.toFixed(6)}`;
  }
  // return `$${numericAmount.toFixed(2)}`;
  return `$${numericAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatUSDPrice(amount: number | string): string {
  if (!amount) {
    return "$0";
  }
  if (Number(amount) < 0.001) {
    return "<$0.001";
  }
  // return `$${Number(amount).toFixed(2)}`;
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatTokenFixed(amount: number | string): string {
  if (Number(amount) === 0) {
    return "0";
  }
  if (!amount) {
    return "0";
  }
  if (Number(amount) < 0.000001) {
    return "< 0.000001";
  }
  const formatted = Number(amount).toFixed(6);
  // const formatted = amount.toLocaleString("en-US", {
  //   minimumFractionDigits: 6,
  //   maximumFractionDigits: 6,
  // });

  // if (/e/.test(formatted)) {
  //   let [base, exponent] = formatted.split("e");
  //   exponent = Number(exponent).toString();

  //   let decimalPlaces = Math.max(0, 6 - base.replace(".", "").length);
  //   formatted = Number(amount).toFixed(
  //     Number(exponent) < 0 ? -exponent + decimalPlaces : decimalPlaces,
  //   );
  // }
  return formatted.replace(/\.?0+$/, "");
  // return Number(formatted.replace(/\.?0+$/, "")).toLocaleString("en-US", {
  //   minimumFractionDigits: 6,
  //   maximumFractionDigits: 6,
  // });
}
export function formatToken(amount: number | string): string {
  if (Number(amount) === 0) {
    return "0";
  }
  if (!amount) {
    return "0";
  }
  // if (Number(amount) < 0.000001) {
  //   return "< 0.000001";
  // }
  let formatted = Number(amount).toPrecision(6);

  if (/e/.test(formatted)) {
    let [base, exponent] = formatted.split("e");
    exponent = Number(exponent).toString();

    let decimalPlaces = Math.max(0, 6 - base.replace(".", "").length);
    formatted = Number(amount).toFixed(
      Number(exponent) < 0 ? -exponent + decimalPlaces : decimalPlaces,
    );
  }
  return formatted.replace(/\.?0+$/, "");
}

// export function formatTokenFixedto(amount: number | string): string {
//   if (Number(amount) === 0) {
//     return "0";
//   }
//   if (!amount) {
//     return "0";
//   }
//   if (Number(amount) < 0.000001) {
//     return "< 0.000001";
//   }
//   let formatted = Number(amount).toFixed(6);

//   if (/e/.test(formatted)) {
//     let [base, exponent] = formatted.split("e");
//     exponent = Number(exponent).toString();

//     let decimalPlaces = Math.max(0, 6 - base.replace(".", "").length);
//     formatted = Number(amount).toFixed(
//       Number(exponent) < 0 ? -exponent + decimalPlaces : decimalPlaces,
//     );
//   }
//   return formatted.replace(/\.?0+$/, "");
// }
export function formatTokenFixedto(
  amount?: string | number,
  dig?: number,
): string {
  // const numAmount = Number(amount);
  const initDecimalPart = dig || 4;
  if (!amount || Number(amount) === 0) {
    return "0";
  }

  let strAmount = amount.toString();
  if (Number(strAmount) >= 0.001) {
    let [integerPart, decimalPart] = strAmount.split(".");

    if (decimalPart && decimalPart.length > initDecimalPart) {
      decimalPart = decimalPart.substring(0, initDecimalPart);
    }

    // 如果没有小数部分，补充小数部分为 0000
    if (!decimalPart) {
      decimalPart = "0000";
    }

    // 保证小数部分有 4 位，不足时补 0
    decimalPart = decimalPart.padEnd(initDecimalPart, "0");

    // 将整数部分添加千分位分隔符并拼接小数部分
    return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decimalPart}`;
  }

  // 将数值转换为字符串，避免科学记数法

  // 如果数字小于 0.001 才进行特殊处理
  if (Number(amount) < 0.001 && Number(amount) > 0) {
    // 将数字转换为足够精确的小数字符串，避免科学记数法
    strAmount = Number(amount).toFixed(30); // 使用30位小数避免科学记数法

    const match = strAmount.match(/0\.0(0+)([1-9]\d*)/); // 匹配 0. 后的零和有效数字
    if (match) {
      const zeroCount = match[1].length; // 获取 0.0 后连续零的数量
      let significantDigits = match[2]; // 获取连续零后实际的有效数字

      // 限制有效数字的长度，避免输出过长
      significantDigits = significantDigits.substring(0, initDecimalPart); // 保留前4位有效数字

      // 移除有效数字中的多余尾随零
      significantDigits = significantDigits.replace(/0+$/, "");

      if (!significantDigits) {
        return "0.0000"; // 避免返回无效的格式
      }

      // 使用 Unicode 下标字符来表示零的数量
      const zeroCharMap: string[] = [
        "₀",
        "₁",
        "₂",
        "₃",
        "₄",
        "₅",
        "₆",
        "₇",
        "₈",
        "₉",
      ];
      const zeroCountStr = String(zeroCount + 1)
        .split("")
        .map((digit) => zeroCharMap[Number(digit)])
        .join("");

      return `0.0${zeroCountStr}${significantDigits}`;
    }
  }

  // 默认返回值
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: initDecimalPart,
    maximumFractionDigits: initDecimalPart,
  });
}

export function formatTokenNoPrecision(amount: number | string): string {
  if (Number(amount) === 0 || !amount) {
    return "0";
  }

  return amount.toString().replace(/\.?0+$/, "");
}

export function formatWei(
  bigAmount?: number | string,
  decimals?: number,
): string {
  if (!bigAmount) {
    return "0";
  }
  return formatToken(ethers.utils.formatUnits(bigAmount, decimals || 18));
}
export function formatWeiNoPrecision(
  bigAmount?: number | string,
  decimals?: number,
): string {
  if (!bigAmount) {
    return "0";
  }
  return formatTokenNoPrecision(
    ethers.utils.formatUnits(bigAmount, decimals || 18),
  );
}
export function formatWeiFixed(
  bigAmount?: number | string,
  decimals?: number,
): string {
  if (!bigAmount) {
    return "0";
  }
  return formatTokenFixed(ethers.utils.formatUnits(bigAmount, decimals || 18));
}
export function formatNumberWithKM(
  num?: number | string,
  unit?: string,
  decimal?: number,
): string {
  const threshold = 10000;
  if (!Number(num)) {
    return "0";
  }
  if (Number(num) < 0.000001) {
    return "<0.000001";
  }
  if (Number(num) < 1000) {
    return `${unit || ""}${Number(num).toFixed(decimal || 2)}`;
  }
  if (Number(num) < threshold) {
    return `${unit || ""}${Number(num).toLocaleString(undefined, { minimumFractionDigits: decimal || 2, maximumFractionDigits: decimal || 2 })}`;
  }
  if (Number(num) >= 1e12) {
    return `${unit || ""}${(Number(num) / 1e12).toLocaleString(undefined, { minimumFractionDigits: decimal || 2, maximumFractionDigits: decimal || 2 })}T`;
  }
  if (Number(num) >= 1e9) {
    return `${unit || ""}${(Number(num) / 1e9).toFixed(decimal || 2)}B`;
  }
  if (Number(num) >= 1e6) {
    return `${unit || ""}${(Number(num) / 1e6).toFixed(decimal || 2)}M`;
  }
  return `${unit || ""}${(Number(num) / 1000).toFixed(decimal || 2)}K`;
}
export function formatIntNumberWithKM(
  num?: number | string,
  unit?: string,
): string {
  const threshold = 10000;
  if (!Number(num)) {
    return "0";
  }
  if (Number(num) < threshold) {
    return `${unit || ""}${Number(num).toFixed(0)}`;
  }

  if (Number(num) >= 1000000) {
    return `${unit || ""}${(Number(num) / 1000000).toFixed(0)}M`;
  }

  return `${unit || ""}${(Number(num) / 1000).toFixed(0)}K`;
}

export function formatAddress(address?: string | `0x${string}`) {
  if (!address) {
    return;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function safeParseUnits(value: string, decimals: number): BigNumber {
  const decimalRegex = new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);

  if (!decimalRegex.test(value)) {
    console.error("input error", value);
    return utils.parseUnits("0", decimals);
  }

  try {
    return utils.parseUnits(value, decimals);
  } catch (error) {
    console.error("safeParseUnits:", error);
    return utils.parseUnits("0", decimals);
  }
}
export const calculatePriceScale = (decimalValue: number) => {
  if (decimalValue >= 1) {
    return 100;
  } else {
    const significantDigits = 4;
    const decimalPlaces = Math.max(
      significantDigits - Math.floor(Math.log10(decimalValue)) - 1,
      0,
    );
    return Math.pow(10, decimalPlaces);
  }
};

export const formatNumberToString = (amount: any) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
};

export const formatNumberToStringInt = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) {
    // throw new Error("Invalid number input");
    return "";
  }
  return num.toLocaleString("en-US");
};

export function calculateMinimumReceivedWithSlippage(
  minimumReceived: string,
  slippage: number,
  decimals: number,
): string {
  try {
    if (!Number(minimumReceived)) {
      return "0";
    }
    console.log("minimumReceived", minimumReceived);

    const minimumReceivedWei = ethers.utils.parseUnits(
      minimumReceived,
      decimals,
    );

    const minimumReceivedWithSlippage = minimumReceivedWei
      .mul(ethers.BigNumber.from((100 - slippage * 100).toString()))
      .div(ethers.BigNumber.from("100"));

    return ethers.utils.formatUnits(minimumReceivedWithSlippage, decimals);
  } catch (error) {
    return "0";
  }
}
