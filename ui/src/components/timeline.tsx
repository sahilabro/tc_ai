import { Chrono } from "react-chrono";

export interface TimelineDataEntry {
        title: string;
        date: string;
        desc: string;
        gotchas: string;
}
export const stubData: TimelineDataEntry[] = [
  {
    title: "Contract Acceptance",
    date: "2024-03-17",
    desc: "The pivotal moment when both parties mutually agree upon the terms and conditions outlined in the contract, solidifying our agreement's foundation.",
    gotchas:
      "<ul><li>Ensure all terms and conditions are clearly defined and agreed upon by both parties before signing.</li><li>Review the contract thoroughly to understand your rights, obligations, and any potential liabilities.</li></ul>",
  },
  {
    title: "Disclosures Due",
    date: "2024-04-18",
    desc: "Deadline by which the seller must disclose all known property defects, pertinent information, and legal obligations to you, ensuring transparency and informed decision-making.",
    gotchas:
      "<ul><li>Thoroughly review all disclosed information to assess its impact on the property's value and your decision to proceed with the purchase.</li><li>Seek clarification on any ambiguous or unclear disclosures to avoid misunderstandings.</li></ul>",
  },
  {
    title: "Loan Contingency",
    date: "2024-06-13",
    desc: "The period during which you secure financing for the property purchase, contingent upon meeting specific loan requirements, terms, and conditions set forth by the lender.",
    gotchas:
      "<ul><li>Submit all required documentation promptly to avoid delays in loan processing.</li><li>Be prepared for potential loan approval conditions or requirements from the lender.</li><li>Consider alternative financing options if the current terms are not favorable.</li></ul>",
  },
  {
    title: "Special Contract Terms",
    date: "2024-07-04",
    desc: "Inclusion of unique or negotiated terms within the purchase contract, addressing your specific needs, preferences, or contingencies, ensuring a customized and mutually beneficial agreement.",
    gotchas:
      "<ul><li>Ensure all special terms are clearly outlined and agreed upon by both parties.</li><li>Consult with legal or real estate professionals to understand the implications of unique contract terms.</li><li>Consider potential scenarios and include contingency clauses to address them.</li></ul>",
  },
  {
    title: "COE/Settlement",
    date: "2024-08-15",
    desc: "Scheduled closing of escrow or settlement, marking the final stage of the real estate transaction process, where ownership of the property is transferred, and all financial and legal obligations are fulfilled.",
    gotchas:
      "<ul><li>Review all closing documents carefully and address any discrepancies or questions with your real estate agent or attorney.</li><li>Ensure all necessary funds are available for closing costs, taxes, and other expenses.</li><li>Coordinate with all parties involved to ensure a smooth and timely closing process.</li></ul>",
  },
];

export const Timeline = (props: { timelineData: {
    title: string;
    date: string;
    desc: string;
    gotchas: string;
  }[]  }) => {
  let data = stubData;
  if (props.timelineData && props.timelineData.length) {
    data = props.timelineData;
  }
  return (
    <Chrono
      items={data.map((d) => {
        return {
          title: d.date,
          cardTitle: d.title,
          cardSubtitle: d.desc,
          cardDetailedText: d.gotchas,
        };
      })}
      mode="VERTICAL"
      disableToolbar
      minHeight="50px"
      parseDetailsAsHTML
      theme={{
        primary: "#2b2b2b",
        secondary: "#eeeae8",
        cardBgColor: "white",
        cardForeColor: "violet",
        titleColor: "#68695b",
        titleColorActive: "#2b2b2b",
      }}
    />
  );
};
