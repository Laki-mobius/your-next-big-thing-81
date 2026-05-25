export interface AttributeCategory {
  id: string;
  label: string;
  attributes: string[];
}

export const profileCategories: AttributeCategory[] = [
  {
    id: "basic_data",
    label: "Basic Data",
    attributes: [
      "Company Name", "Legal Name", "Address", "City", "State", "Zip Code",
      "Office Address", "Country", "Phone Number", "Email ID", "Website URL",
      "Industry / Sector", "LinkedIn URL", "Twitter URL", "Registration Number",
      "Incorporation Date", "Company Status", "Status", "Entity Type",
      "Jurisdiction", "Exchange Name", "Trading Status", "Ticker Symbol",
      "CIK", "LEI", "SIC Code", "CEO / Founder",
      "Industry", "Website", "HQ Location",
    ],
  },
  {
    id: "financial_data",
    label: "Financial Data",
    attributes: [
      "Revenue", "Net Income", "EBITDA", "Total Assets", "Liabilities",
      "Stock Price (Current)", "Stock Price (Open)", "Stock Price (Close)",
      "Market Capitalization", "Shares Outstanding", "Ownership %",
    ],
  },
  {
    id: "corporate_hierarchy",
    label: "Corporate Hierarchy",
    attributes: [
      "Parent Name", "Ultimate Parent", "Subsidiary Name",
      "Hierarchy Level", "Coverage",
    ],
  },
];

export function categorizeAttributes(
  attributes: { name: string;[key: string]: any }[]
): { category: AttributeCategory; attrs: typeof attributes }[] {
  const result: { category: AttributeCategory; attrs: typeof attributes }[] = [];
  const assigned = new Set<string>();

  for (const cat of profileCategories) {
    const matched = attributes.filter(a => cat.attributes.includes(a.name) && !assigned.has(a.name));
    matched.forEach(a => assigned.add(a.name));
    if (matched.length > 0) {
      result.push({ category: cat, attrs: matched });
    }
  }

  const remaining = attributes.filter(a => !assigned.has(a.name));
  if (remaining.length > 0) {
    const basicIdx = result.findIndex(r => r.category.id === "basic_data");
    if (basicIdx >= 0) result[basicIdx].attrs.push(...remaining);
    else result.unshift({ category: profileCategories[0], attrs: remaining });
  }

  return result;
}
