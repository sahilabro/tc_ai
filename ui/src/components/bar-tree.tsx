import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { styled, alpha } from "@mui/material/styles";
import { TreeView } from "@mui/x-tree-view/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
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
import React, { useState, useEffect} from "react";

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
  // category: string;
  // risk: string;
  // recommendation: string;
  actionItems: string[];
  advisories: string[];
  warnings: string[];
  document: string;
  // priority: string;
}

const RenderListIfPresent = (props: {
  listData: string[];
  heading: string;
}) => {
  return props.listData.length > 0 ? (
    <List sx={{ listStyleType: "disc" }}>
      <h4 style={{ marginLeft: "-20px" }}>{props.heading}</h4>

      {props.listData.map((d) => (
        <ListItem sx={{ display: "list-item" }}>{d}</ListItem>
      ))}
    </List>
  ) : (
    <div></div>
  );
};
const InformationSubsection = (props: InfoProps) => {
  return (
    <div>
      <RenderListIfPresent
        listData={props.actionItems}
        heading="Action Items"
      />
      <RenderListIfPresent listData={props.advisories} heading="Advisories" />
      <RenderListIfPresent listData={props.warnings} heading="Warnings" />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "16px",
        }}
      >
        {/* <Chip label={`Priority: ${ props.priority}`}color="error" variant="outlined" /> */}
        <Chip label={props.document} color="default" variant="outlined" />
      </div>
      <br />
    </div>
  );
};

export interface BarTreeViewDataEntry {
  category: string;
  action_items: string[];
  advisories: string[];
  warnings: string[];
  legal_document: string;
}

export const stubData: BarTreeViewDataEntry[] = [
  {
    category: "Property Condition",
    action_items: [
      "Conduct a thorough title search to uncover any existing liens or encumbrances on the property.",
      "Consider purchasing title insurance to protect against undiscovered defects.",
    ],
    advisories: [
      "Buyer may inherit existing debts or financial obligations tied to the property, leading to financial loss or legal disputes.",
    ],
    warnings: [
      "The property may have undisclosed financial liabilities.",
      "Failure to address existing liens may lead to legal complications.",
    ],
    legal_document: "Title Deed/Title Report.pdf",
  },
  {
    category: "Property Condition",
    action_items: [
      "Obtain a professional home inspection to identify any hidden issues or structural problems.",
      "Request full disclosure of known property defects from the seller.",
    ],
    advisories: [
      "Buyer may encounter unexpected defects or damages not disclosed by the seller, resulting in repair costs or decreased property value.",
    ],
    warnings: [
      "Hidden defects may not be immediately apparent and could incur significant costs.",
      "Failure to disclose known property issues may result in legal disputes.",
    ],
    legal_document: "Seller's Disclosure Statement.pdf",
  },
  {
    category: "Legal Compliance",
    action_items: [
      "Review local zoning ordinances and land use regulations to ensure the property aligns with intended use.",
      "Consult with local planning authorities or zoning experts for clarification.",
    ],
    advisories: [
      "Buyer may face limitations on property use or development, affecting intended plans or investment potential.",
    ],
    warnings: [
      "Failure to comply with zoning regulations may result in fines or restrictions on property use.",
      "Unawareness of zoning restrictions may hinder planned development projects.",
    ],
    legal_document: "Zoning Ordinances/Certificate of Occupancy.pdf",
  },
  {
    category: "Legal Compliance",
    action_items: [
      "Seek legal advice to draft or review the purchase contract, ensuring all terms are clearly defined and agreed upon by both parties.",
      "Include contingency clauses to address potential issues.",
    ],
    advisories: [
      "Buyer may face disputes or misunderstandings regarding contractual obligations, leading to legal challenges or failed transactions.",
    ],
    warnings: [
      "Ambiguous contract terms may lead to misinterpretations and legal disputes.",
      "Failure to include contingency clauses may expose the buyer to unforeseen risks.",
    ],
    legal_document: "Purchase Agreement/Contract.pdf",
  },
  {
    category: "Legal Compliance",
    action_items: [
      "Conduct a survey of the property to verify boundaries and easements.",
      "Obtain title insurance with boundary coverage to protect against boundary disputes.",
    ],
    advisories: [
      "Buyer may encounter conflicts with neighbors or third parties over property boundaries or access rights, resulting in legal battles or loss of property rights.",
    ],
    warnings: [
      "Boundary disputes may escalate into costly legal battles if not addressed properly.",
      "Failure to obtain title insurance may leave the buyer vulnerable to boundary-related issues.",
    ],
    legal_document: "Property Survey/Title Deed.pdf",
  },
  {
    category: "Safety",
    action_items: [
      "Conduct a thorough inspection of stairs, handrails, and associated safety features.",
      "Consider renovations or repairs to address any identified safety issues.",
    ],
    advisories: [
      "Buyer may face safety hazards or liabilities associated with poorly constructed or maintained stairs, leading to accidents or legal claims.",
    ],
    warnings: [
      "Neglecting stair safety may result in accidents and potential legal liabilities.",
      "Safety hazards pose a risk to occupants and could affect property resale value.",
    ],
    legal_document: "Home Inspection Report.pdf",
  },
  {
    category: "Area Impact",
    action_items: [
      "Research ongoing and planned construction projects in the area.",
      "Consider the potential impact on property value, quality of life, and resale prospects.",
    ],
    advisories: [
      "Buyer may face disruptions, noise pollution, or changes to property value due to nearby construction projects.",
    ],
    warnings: [
      "Nearby construction may affect property resale value and livability.",
      "Disruptions from ongoing construction could impact daily life for occupants.",
    ],
    legal_document: "Local Planning and Development Documents.pdf",
  },
];

export const BarTreeView = (props: { bartreeData: typeof stubData }) => {
    let data = stubData;
    if (props.bartreeData && props.bartreeData.length > 0) {
        data = props.bartreeData;
    }
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
        {data.map((d, i) => {
          return (
            <CustomTreeItem nodeId={i.toString()} label={<h3>{d.category}</h3>}>
              <InformationSubsection
                //   category={d.category}
                actionItems={d.action_items}
                advisories={d.advisories}
                warnings={d.warnings}
                document={d.legal_document}
              />
            </CustomTreeItem>
          );
        })}
      </TreeView>
    </Box>
  );
};