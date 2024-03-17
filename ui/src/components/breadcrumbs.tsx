import "./breadcrumb.css"
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import * as React from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(4),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
      // eh styled comp is weird.
  };
}) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

// function handleClick(event: React.MouseEvent<Element, MouseEvent>) {
//   event.preventDefault();
//   console.info('You clicked a breadcrumb.');
// }

interface BreadCrumbContainerProps {
    curPath: string;
}

interface BreadCrumbProps {
    label: string;
    active: boolean;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; };
}

const BreadCrumbWithActiveState = (props: BreadCrumbProps) => {
    return <StyledBreadcrumb
      className={props.active ? 'active' : ''}
      sx={{padding: "8px"}}
      label={<h3>{props.label}</h3>}
    icon={<props.icon style={{fill: props.active ? '#f9f7f6':''}} />}
  />

}

export const CustomizedBreadcrumbs = (props: BreadCrumbContainerProps) => {
  return (
    <div role="presentation" style={{marginBlockEnd: "16px"}}>
      <Breadcrumbs aria-label="breadcrumb">
        <BreadCrumbWithActiveState
                  active={props.curPath === "/form"}
                  label="Describe"
          icon={ModeEditOutlineIcon}
        />
        <BreadCrumbWithActiveState active={props.curPath === "/upload"} label="Upload" icon={DriveFolderUploadIcon} />
        <BreadCrumbWithActiveState active={props.curPath === "/evaluate"} label="Evaluate" icon={TroubleshootIcon}  />
      </Breadcrumbs>
    </div>
  );
};
