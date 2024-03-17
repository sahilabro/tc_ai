import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import { TreeView } from "@mui/x-tree-view/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  TreeItem,
  TreeItemProps,
  useTreeItem,
  TreeItemContentProps,
} from "@mui/x-tree-view/TreeItem";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Timeline } from "./timeline";

interface AdvisoryEntry {
  topic: {
    issue: string;
    risk: string;
    recommendation: string;
    priority: string;
    page: string;
  };
}

interface TimelineData {
  event: string;
  heading: string;
  description: string;
  icon: string;
}

const CustomContentRoot = styled("div")(({ theme }) => ({
  WebkitTapHighlightColor: "transparent",
  "&&:hover, &&.Mui-disabled, &&.Mui-focused, &&.Mui-selected, &&.Mui-selected.Mui-focused, &&.Mui-selected:hover":
    {
      backgroundColor: "transparent",
    },
  ".MuiTreeItem-contentBar": {
    position: "absolute",
    width: "100%",
    height: 24,
    left: 0,
  },
  "&:hover .MuiTreeItem-contentBar": {
    backgroundColor: theme.palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: "transparent",
    },
  },
  "&.Mui-disabled .MuiTreeItem-contentBar": {
    opacity: theme.palette.action.disabledOpacity,
    backgroundColor: "transparent",
  },
  "&.Mui-focused .MuiTreeItem-contentBar": {
    backgroundColor: theme.palette.action.focus,
  },
  "&.Mui-selected .MuiTreeItem-contentBar": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
  },
  "&.Mui-selected:hover .MuiTreeItem-contentBar": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
    ),
    // Reset on touch devices, it doesn't add specificity
    "@media (hover: none)": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
    },
  },
  "&.Mui-selected.Mui-focused .MuiTreeItem-contentBar": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity + theme.palette.action.focusOpacity
    ),
  },
}));

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref
) {
  const {
    className,
    classes,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    preventSelection(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event);
    handleSelection(event);
  };

  return (
    <CustomContentRoot
      className={clsx(className, classes.root, {
        "Mui-expanded": expanded,
        "Mui-selected": selected,
        "Mui-focused": focused,
        "Mui-disabled": disabled,
      })}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className="MuiTreeItem-contentBar" />
      <div className={classes.iconContainer}>{icon}</div>
      <Typography component="div" className={classes.label}>
        {label}
      </Typography>
    </CustomContentRoot>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: TreeItemProps,
  ref: React.Ref<HTMLLIElement>
) {
  return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

interface InfoProps {
    category: string;
    risk: string;
    recommendation: string;
    document: string;
    priority: string;
}
const InformationSubsection = (props: InfoProps) => {
  return (
    <div>
      <h4>
        Category: {props.category}
      </h4>
      <p style={{marginBlockEnd: "8px"}}>
        Risk: {props.risk}
          </p>
          
      <p>
        Recommendation: {props.recommendation}

      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
              <Chip label={`Priority: ${ props.priority}`}color="error" variant="outlined" />
              <Chip label={ props.document} color="default" variant="outlined" />
      </div>
      <br />
    </div>
  );
};

const stubData = [
    {
      category: "Property Condition",
      issue: "Undisclosed Liens on the Property",
      risk: "Buyer may inherit existing debts or financial obligations tied to the property, leading to financial loss or legal disputes.",
      recommendation:
        "Conduct a thorough title search to uncover any existing liens or encumbrances on the property. Consider purchasing title insurance to protect against undiscovered defects.",
      priority: "High",
      legal_document: "Title Deed/Title Report.pdf",
    },
    {
      category: "Property Condition",
      issue: "Misrepresentation of Property Condition",
      risk: "Buyer may encounter unexpected defects or damages not disclosed by the seller, resulting in repair costs or decreased property value.",
      recommendation:
        "Obtain a professional home inspection to identify any hidden issues or structural problems. Request full disclosure of known property defects from the seller.",
      priority: "High",
      legal_document: "Seller's Disclosure Statement.pdf",
    },
    {
      category: "Legal Compliance",
      issue: "Inadequate Property Zoning or Land Use Restrictions",
      risk: "Buyer may face limitations on property use or development, affecting intended plans or investment potential.",
      recommendation:
        "Review local zoning ordinances and land use regulations to ensure the property aligns with intended use. Consult with local planning authorities or zoning experts for clarification.",
      priority: "Medium",
      legal_document: "Zoning Ordinances/Certificate of Occupancy.pdf",
    },
    {
      category: "Legal Compliance",
      issue: "Ambiguous or Incomplete Purchase Contract Terms",
      risk: "Buyer may face disputes or misunderstandings regarding contractual obligations, leading to legal challenges or failed transactions.",
      recommendation:
        "Seek legal advice to draft or review the purchase contract, ensuring all terms are clearly defined and agreed upon by both parties. Include contingency clauses to address potential issues.",
      priority: "High",
      legal_document: "Purchase Agreement/Contract.pdf",
    },
    {
      category: "Legal Compliance",
      issue: "Boundary Disputes or Easement Encroachments",
      risk: "Buyer may encounter conflicts with neighbors or third parties over property boundaries or access rights, resulting in legal battles or loss of property rights.",
      recommendation:
        "Conduct a survey of the property to verify boundaries and easements. Obtain title insurance with boundary coverage to protect against boundary disputes.",
      priority: "Medium",
      legal_document: "Property Survey/Title Deed.pdf",
    },
    {
      category: "Safety",
      issue: "Stair Safety Concerns",
      risk: "Buyer may face safety hazards or liabilities associated with poorly constructed or maintained stairs, leading to accidents or legal claims.",
      recommendation:
        "Conduct a thorough inspection of stairs, handrails, and associated safety features. Consider renovations or repairs to address any identified safety issues.",
      priority: "Medium",
      legal_document: "Home Inspection Report.pdf",
    },
    {
      category: "Area Impact",
      issue: "Construction Plans in the Area",
      risk: "Buyer may face disruptions, noise pollution, or changes to property value due to nearby construction projects.",
      recommendation:
        "Research ongoing and planned construction projects in the area. Consider the potential impact on property value, quality of life, and resale prospects.",
      priority: "Medium",
      legal_document: "Local Planning and Development Documents.pdf",
    },
  ];
  
export const BarTreeView = () => {
  return (
    <Box
      sx={{
        minHeight: 180,
        flexGrow: 1,
        maxWidth: "50vw",
        background: "",
        width: "100%",
      }}
    >
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={"🚩"}
        sx={{ position: "relative" }}
      >
        {stubData.map((d, i) => {
          return (
              <CustomTreeItem nodeId={i.toString()} label={<h3>{d.issue}</h3>}>
                  <InformationSubsection category={d.category} risk={d.risk} recommendation={d.recommendation} priority={d.priority} document={d.legal_document}  />
            </CustomTreeItem>
          );
        })}
      </TreeView>
    </Box>
  );
};

export const Evaluation = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "80vw",
        marginBlockStart: "",
        justifyContent: "center",
      }}
    >
      <BarTreeView />
      <Timeline />
    </div>
  );
};
